import Client from './api/Client';
import Form from './models/form';
import ChoiceList from './models/choice-list';
import ClassificationSet from './models/classification-set';
import Project from './models/project';
import Record from './models/record';
import Photo from './models/photo';
import Video from './models/video';
import {format} from 'util';
import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import sqldiff from 'sqldiff';
import V2 from 'fulcrum-schema/dist/schemas/postgres-query-v2';
import path from 'path';
import ConcurrentQueue from './concurrent-queue';
import filesize from 'filesize';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';

const {SchemaDiffer, Sqlite} = sqldiff;

require('colors');

// var fs = require('fs');
// var profiler = require('v8-profiler');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const mediaPath = path.join(getUserHome(), 'Documents', 'fulcrum-media');

mkdirp.sync(mediaPath);

const MEDIA_CONCURRENCY = 5;

const models = {
  Form: Form,
  ChoiceList: ChoiceList,
  ClassificationSet: ClassificationSet,
  Project: Project,
  Record: Record,
  Photo: Photo,
  Video: Video
};

export default class Synchronizer {
  async run(account, dataSource) {
    await Promise.all([ this.syncObject('ChoiceList', 'choice_lists', account),
                        this.syncObject('ClassificationSet', 'classification_sets', account),
                        this.syncObject('Project', 'projects', account) ]);

    await this.syncObject('Form', 'forms', account);

    const forms = await Form.findAll(account.db, {account_id: account.id}, 'name ASC');

    await this.syncVideos(account, null);
    await this.syncPhotos(account, null);

    for (const form of forms) {
      await new Promise((resolve, reject) => {
        form.load(dataSource, resolve);
      });
      await this.syncRecords(account, form);
    }
  }

  async syncObject(objectName, key, account) {
    const results = await Client['get' + objectName + 's'](account);

    const body = results.body;

    const data = JSON.parse(body);

    for (const attributes of data[key]) {
      const object = await models[objectName].findOrCreate(account.db, {resource_id: attributes.id, account_id: account.id});

      let oldForm = null;

      if (object.id) {
        oldForm = {
          id: object.resourceID,
          row_id: object.id,
          name: object.name,
          elements: object.elements
        };
      }

      object.updateFromAPIAttributes(attributes);
      object.accountID = account.id;

      await object.save();

      if (objectName === 'Form') {
        const newForm = Object.assign({row_id: object.id}, {elements: object.elementsJSON});

        await this.updateFormTables(account, oldForm, newForm);
      }
    }

    console.log(account.organizationName.green, 'downloaded ' + key);
  }

  async updateFormTables(account, oldForm, newForm) {
    let oldSchema = null;
    let newSchema = null;

    if (oldForm) {
      oldSchema = new Schema(oldForm, V2, null);
    }

    if (newForm) {
      newSchema = new Schema(newForm, V2, null);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    const meta = new Metadata(differ, {quote: '`', prefix: 'account_' + account.id + '_'});

    const generator = new Sqlite(differ, {afterTransform: meta.build.bind(meta)});

    generator.tablePrefix = 'account_' + account.id + '_';

    const statements = generator.generate();

    await account.db.execute('BEGIN TRANSACTION');

    for (const statement of statements) {
      await account.db.execute(statement);
    }

    await account.db.execute('COMMIT');
  }

  async syncVideos(account, form) {
    return this.syncVideoPage(account, form, 1);
  }

  async syncVideoPage(account, form, page, total) {
    const beginFetchTime = new Date();

    const results = await Client.getVideos(account, form, page);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    const body = results.body;

    if (results.statusCode !== 200) {
      // console.log(account.organizationName.green, 'failed'.red, 'to download photos in', form.name.blue);
      console.log(account.organizationName.green, 'failed'.red, 'to download videos');
      return;
    }

    const data = JSON.parse(body);

    const db = account.db;

    let now = new Date();

    const queue = new ConcurrentQueue(async function (task) {
      const file = path.join(mediaPath, 'videos', task.access_key + '.mp4');

      await Client.download(task.original, file);

      // console.log(format('%s downloaded photo in %s | %s | %s',
      //                    account.organizationName.green,
      //                    form.name.blue,
      //                    task.access_key.cyan,
      //                    filesize(task.file_size).red));
      console.log(format('%s downloaded video | %s | %s',
                         account.organizationName.green,
                         task.access_key.cyan,
                         filesize(task.file_size).red));
    }, MEDIA_CONCURRENCY);

    await db.transaction(async function () {
      for (const attributes of data.videos) {
        const object = await models.Video.findOrCreate(account.db, {account_id: account.id, resource_id: attributes.access_key});

        object.updateFromAPIAttributes(attributes);
        object.accountID = account.id;

        if (attributes.processed) {
          if (!object.isDownloaded) {
            queue.push(attributes, function(err) {
              if (err) {
                console.log('ERROR DOWNLOADING', err);
                throw err;
              }

              object.isDownloaded = true;
              // do we need to await this somehow?
              object.save();
            });
          }
        } else {
          object.isDownloaded = false;
        }

        if (object.isDownloaded == null) {
          object.isDownloaded = false;
        }

        await object.save();
      }
    });

    await queue.drain();

    const totalTime = new Date().getTime() - now.getTime();

    // console.log(format('%s downloaded photos in %s | %s | %s | %s',
    //                    account.organizationName.green,
    //                    form.name.blue,
    //                    format('page %s/%s', page, data.total_pages || 1).yellow,
    //                    (totalFetchTime + 'ms').cyan + ' (api)'.red,
    //                    (totalTime + 'ms').cyan + ' (db)'.red));

    console.log(format('%s downloaded videos | %s | %s | %s',
                       account.organizationName.green,
                       format('page %s/%s', page, data.total_pages || 1).yellow,
                       (totalFetchTime + 'ms').cyan + ' (api)'.red,
                       (totalTime + 'ms').cyan + ' (db)'.red));

    if (data.total_pages > page) {
      await this.syncVideoPage(account, form, page + 1, data.total_pages);
    }
  }

  async syncPhotos(account, form) {
    return this.syncPhotoPage(account, form, 1);
  }

  async syncPhotoPage(account, form, page, total) {
    const beginFetchTime = new Date();

    const results = await Client.getPhotos(account, form, page);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    const body = results.body;

    if (results.statusCode !== 200) {
      // console.log(account.organizationName.green, 'failed'.red, 'to download photos in', form.name.blue);
      console.log(account.organizationName.green, 'failed'.red, 'to download photos');
      return;
    }

    const data = JSON.parse(body);

    const db = account.db;

    let now = new Date();

    const queue = new ConcurrentQueue(async function (task) {
      const file = path.join(mediaPath, 'photos', task.access_key + '.jpg');

      await Client.download(task.original, file);

      // console.log(format('%s downloaded photo in %s | %s | %s',
      //                    account.organizationName.green,
      //                    form.name.blue,
      //                    task.access_key.cyan,
      //                    filesize(task.file_size).red));
      console.log(format('%s downloaded photo | %s | %s',
                         account.organizationName.green,
                         task.access_key.cyan,
                         filesize(task.file_size).red));
    }, MEDIA_CONCURRENCY);

    await db.transaction(async function () {
      for (const attributes of data.photos) {
        const object = await models.Photo.findOrCreate(account.db, {account_id: account.id, resource_id: attributes.access_key});

        object.updateFromAPIAttributes(attributes);
        object.accountID = account.id;

        if (attributes.processed) {
          if (!object.isDownloaded) {
            queue.push(attributes, function(err) {
              if (err) {
                console.log('ERROR DOWNLOADING', err);
                throw err;
              }

              object.isDownloaded = true;
              // do we need to await this somehow?
              object.save();
            });
          }
        } else {
          object.isDownloaded = false;
        }

        if (object.isDownloaded == null) {
          object.isDownloaded = false;
        }

        await object.save();
      }
    });

    await queue.drain();

    const totalTime = new Date().getTime() - now.getTime();

    // console.log(format('%s downloaded photos in %s | %s | %s | %s',
    //                    account.organizationName.green,
    //                    form.name.blue,
    //                    format('page %s/%s', page, data.total_pages || 1).yellow,
    //                    (totalFetchTime + 'ms').cyan + ' (api)'.red,
    //                    (totalTime + 'ms').cyan + ' (db)'.red));

    console.log(format('%s downloaded photos | %s | %s | %s',
                       account.organizationName.green,
                       format('page %s/%s', page, data.total_pages || 1).yellow,
                       (totalFetchTime + 'ms').cyan + ' (api)'.red,
                       (totalTime + 'ms').cyan + ' (db)'.red));

    if (data.total_pages > page) {
      await this.syncPhotoPage(account, form, page + 1, data.total_pages);
    }
  }

  async syncRecords(account, form) {
    return this.syncRecordPage(account, form, 1);
  }

  async syncRecordPage(account, form, page, total) {
    // console.log(format('%s downloading records in %s (page %s/%s)',
    //                    account.organizationName.green,
    //                    form.name.blue,
    //                    page,
    //                    total || 1));

    const beginFetchTime = new Date();

    const results = await Client.getRecords(account, form, page);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    const body = results.body;

    if (results.statusCode !== 200) {
      console.log(account.organizationName.green, 'failed'.red, 'to download records in', form.name.blue);
      return;
    }

    const data = JSON.parse(body);

    const db = account.db;

    let now = new Date();

    // profiler.startProfiling('1', true);

    await db.transaction(async function () {
      for (const attributes of data.records) {
        const object = await models.Record.findOrCreate(account.db, {account_id: account.id, resource_id: attributes.id});

        object.updateFromAPIAttributes(attributes);
        object.accountID = account.id;
        object.form = form;
        object.formID = form.id;

        if (attributes.project_id) {
          const project = await account.projectByResourceID(attributes.project_id);

          if (project) {
            object.projectId = project.id;
          }
        }

        await object.save();
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    // var profile1 = profiler.stopProfiling();

    // console.log(profile1.getHeader());

    // profile1.export(function (error, result) {
    //   if (error) {
    //     throw error;
    //   }
    //   fs.writeFileSync('profile1.cpuprofile', result);
    //   profile1.delete();
    // });

    console.log(format('%s downloaded records in %s | %s | %s | %s',
                       account.organizationName.green,
                       form.name.blue,
                       format('page %s/%s', page, data.total_pages || 1).yellow,
                       (totalFetchTime + 'ms').cyan + ' (api)'.red,
                       (totalTime + 'ms').cyan + ' (db)'.red));

    if (data.total_pages > page) {
      await this.syncRecordPage(account, form, page + 1, data.total_pages);
    }
  }
}

Synchronizer.instance = new Synchronizer();
