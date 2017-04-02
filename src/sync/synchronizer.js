import Client from '../api/Client';
import Form from '../models/form';
import ChoiceList from '../models/choice-list';
import ClassificationSet from '../models/classification-set';
import Project from '../models/project';
import Record from '../models/record';
import Photo from '../models/photo';
import Video from '../models/video';
import {format} from 'util';
import Schema from 'fulcrum-schema/dist/schema';
import Metadata from 'fulcrum-schema/dist/metadata';
import sqldiff from 'sqldiff';
import V2 from 'fulcrum-schema/dist/schemas/postgres-query-v2';
import path from 'path';
import ConcurrentQueue from '../concurrent-queue';
import filesize from 'filesize';
import Promise from 'bluebird';
import mkdirp from 'mkdirp';
import RecordValues from '../record-values';
// import exif from 'exif';
import Generator from '../reports/generator';

import { Database } from 'minidb';

// Database.debug = true;

const {SchemaDiffer, Sqlite, Postgres} = sqldiff;

require('colors');

// var fs = require('fs');
// var profiler = require('v8-profiler');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const mediaPath = path.join(getUserHome(), 'Documents', 'fulcrum-media');

mkdirp.sync(mediaPath);
mkdirp.sync(path.join(mediaPath, 'videos'));
mkdirp.sync(path.join(mediaPath, 'photos'));
mkdirp.sync(path.join(mediaPath, 'audio'));
mkdirp.sync(path.join(mediaPath, 'reports'));

const MEDIA_CONCURRENCY = 10;

const models = {
  Form: Form,
  ChoiceList: ChoiceList,
  ClassificationSet: ClassificationSet,
  Project: Project,
  Record: Record,
  Photo: Photo,
  Video: Video
};

const scrub = (string) => string.replace(/\0/g, '');

export default class Synchronizer {
  async run(account, formName, dataSource) {
    // await Promise.all([ this.syncObject('ChoiceList', 'choice_lists', account),
    //                     this.syncObject('ClassificationSet', 'classification_sets', account),
    //                     this.syncObject('Project', 'projects', account) ]);

    await this.syncObject('ChoiceList', 'choice_lists', account);
    await this.syncObject('ClassificationSet', 'classification_sets', account);
    await this.syncObject('Project', 'projects', account);

    await this.syncObject('Form', 'forms', account);

    await dataSource.source.load(account.db);

    const where = {
      account_id: account.rowID
    };

    if (formName) {
      where.name = formName;
    }

    const forms = await Form.findAll(account.db, where, 'name ASC');

    for (const form of forms) {
      if (process.env.MEDIA === '1') {
        await this.syncVideos(account, form);
        await this.syncPhotos(account, form);
      }

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
      const object = await models[objectName].findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});
      let oldForm = null;

      if (object.isPersisted) {
        oldForm = {
          id: object._id,
          row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON
        };
      }

      object.updateFromAPIAttributes(attributes);

      await object.save();

      if (objectName === 'Form') {
        const newForm = {row_id: object.rowID,
                         name: object._name,
                         elements: object._elementsJSON};

        await account.db.execute(format('DROP VIEW IF EXISTS %s',
                                        account.db.ident(object.name)));

        await this.updateFormTables(account, oldForm, newForm);

        await account.db.execute(format('CREATE VIEW %s AS SELECT * FROM %s_view_full',
                                        account.db.ident(object.name),
                                        RecordValues.tableNameWithForm(object)));
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

    let generator = null;

    if (account.db.dialect === 'sqlite') {
      // const meta = new Metadata(differ, {quote: '`', prefix: 'account_' + account.rowID + '_'});
      // generator = new Sqlite(differ, {afterTransform: meta.build.bind(meta)});
      generator = new Sqlite(differ, {afterTransform: null});
    } else if (account.db.dialect === 'postgresql') {
      // const meta = new Metadata(differ, {quote: '"', prefix: 'account_' + account.rowID + '_'});
      // generator = new Postgres(differ, {afterTransform: meta.build.bind(meta)});
      generator = new Postgres(differ, {afterTransform: null});
    }

    generator.tablePrefix = 'account_' + account.rowID + '_';

    const statements = generator.generate();

    await account.db.transaction(async (db) => {
      for (const statement of statements) {
        await db.execute(statement);
      }
    });
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
      console.log(account.organizationName.green, 'failed'.red, 'to download videos');
      return;
    }

    const data = JSON.parse(body);

    const db = account.db;

    let now = new Date();

    const queue = new ConcurrentQueue(async function (task) {
      const file = path.join(mediaPath, 'videos', task.access_key + '.mp4');

      await Client.download(task.original, file);

      console.log(format('%s downloaded video | %s | %s',
                         account.organizationName.green,
                         task.access_key.cyan,
                         filesize(task.file_size).red));
    }, MEDIA_CONCURRENCY);

    await db.transaction(async function (database) {
      for (const attributes of data.videos) {
        const object = await models.Video.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});

        object.updateFromAPIAttributes(attributes);

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
      console.log(account.organizationName.green, 'failed'.red, 'to download photos');
      return;
    }

    const data = JSON.parse(body);

    const db = account.db;

    let now = new Date();

    // const extractExif = (filePath) => {
    //   return new Promise((resolve, reject) => {
    //     /* eslint-disable no-new */
    //     new exif.ExifImage({image: filePath}, (err, exifData) => {
    //     /* eslint-enable no-new */
    //       console.log(exifData.gps);

    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(exifData);
    //       }
    //     });
    //   });
    // };

    const queue = new ConcurrentQueue(async function (task) {
      const file = path.join(mediaPath, 'photos', task.access_key + '.jpg');

      await Client.download(task.original, file);

      // await extractExif(file);

      console.log(format('%s downloaded photo | %s | %s',
                         account.organizationName.green,
                         task.access_key.cyan,
                         filesize(task.file_size).red));
    }, MEDIA_CONCURRENCY);

    await db.transaction(async function (database) {
      for (const attributes of data.photos) {
        const object = await models.Photo.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});

        object.updateFromAPIAttributes(attributes);

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
    return this.syncRecordPage(account, form, 1, null, form._lastSync);
  }

  async syncRecordPage(account, form, page, total, lastSync) {
    const beginFetchTime = new Date();

    const results = lastSync == null ? (await Client.getRecords(account, form, page))
                                     : (await Client.getRecordsHistory(account, form, page, lastSync))

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

    const queue = new ConcurrentQueue(async function (task) {
      const generator = new Generator(task.record);

      const reportDirectory = path.join(mediaPath, 'reports', form.name);

      mkdirp.sync(reportDirectory);

      const result = await generator.generate(reportDirectory);

      console.log(format('%s generated report | %s | %s',
                         account.organizationName.green,
                         path.basename(result.file).cyan,
                         filesize(result.size).red));
    }, MEDIA_CONCURRENCY);

    let count = 0;

    await db.transaction(async function (database) {
      for (const attributes of data.records) {
        const object = await models.Record.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});

        if (attributes.history_change_type === 'd') {
          if (object) {
            object._form = form;
            object._formRowID = form.rowID;

            await object.delete();
          }
        } else {

          object.updateFromAPIAttributes(attributes);
          object._form = form;
          object._formRowID = form.rowID;

          form._lastSync = object.updatedAt;

          if (attributes.project_id) {
            const project = await account.projectByResourceID(attributes.project_id);

            if (project) {
              object._projectRowID = project.rowID;
            }
          }

          await object.save();

          if (process.env.REPORTS === '1') {
            queue.push({record: object}, function(err) {
              if (err) {
                console.log('ERROR Generating Report', err);
                throw err;
              }

              // object.isDownloaded = true;
              // object.save();
            });
          }
        }
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    // update the lastSync date
    await form.save();

    // var profile1 = profiler.stopProfiling();

    // console.log(profile1.getHeader());

    // profile1.export(function (error, result) {
    //   if (error) {
    //     throw error;
    //   }
    //   fs.writeFileSync('profile1.cpuprofile', result);
    //   profile1.delete();
    // });

    await queue.drain();

    console.log(format('%s downloaded records in %s | %s | %s | %s',
                       account.organizationName.green,
                       form.name.blue,
                       format('page %s/%s', page, data.total_pages || 1).yellow,
                       (totalFetchTime + 'ms').cyan + ' (api)'.red,
                       (totalTime + 'ms').cyan + ' (db)'.red));

    if (data.total_pages > page) {
      await this.syncRecordPage(account, form, page + 1, data.total_pages, lastSync);
    }
  }
}

Synchronizer.instance = new Synchronizer();
