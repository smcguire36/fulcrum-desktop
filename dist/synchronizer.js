'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Client = require('./api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _form = require('./models/form');

var _form2 = _interopRequireDefault(_form);

var _choiceList = require('./models/choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

var _classificationSet = require('./models/classification-set');

var _classificationSet2 = _interopRequireDefault(_classificationSet);

var _project = require('./models/project');

var _project2 = _interopRequireDefault(_project);

var _record = require('./models/record');

var _record2 = _interopRequireDefault(_record);

var _photo = require('./models/photo');

var _photo2 = _interopRequireDefault(_photo);

var _video = require('./models/video');

var _video2 = _interopRequireDefault(_video);

var _util = require('util');

var _schema = require('fulcrum-schema/dist/schema');

var _schema2 = _interopRequireDefault(_schema);

var _metadata = require('fulcrum-schema/dist/metadata');

var _metadata2 = _interopRequireDefault(_metadata);

var _sqldiff = require('sqldiff');

var _sqldiff2 = _interopRequireDefault(_sqldiff);

var _postgresQueryV = require('fulcrum-schema/dist/schemas/postgres-query-v2');

var _postgresQueryV2 = _interopRequireDefault(_postgresQueryV);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _concurrentQueue = require('./concurrent-queue');

var _concurrentQueue2 = _interopRequireDefault(_concurrentQueue);

var _filesize = require('filesize');

var _filesize2 = _interopRequireDefault(_filesize);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _recordValues = require('./record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

var _generator = require('./reports/generator');

var _generator2 = _interopRequireDefault(_generator);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import exif from 'exif';


// Database.debug = true;

const { SchemaDiffer, Sqlite, Postgres } = _sqldiff2.default;

require('colors');

// var fs = require('fs');
// var profiler = require('v8-profiler');

function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

const mediaPath = _path2.default.join(getUserHome(), 'Documents', 'fulcrum-media');

_mkdirp2.default.sync(mediaPath);
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'videos'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'photos'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'audio'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'reports'));

const MEDIA_CONCURRENCY = 10;

const models = {
  Form: _form2.default,
  ChoiceList: _choiceList2.default,
  ClassificationSet: _classificationSet2.default,
  Project: _project2.default,
  Record: _record2.default,
  Photo: _photo2.default,
  Video: _video2.default
};

const scrub = string => string.replace(/\0/g, '');

class Synchronizer {
  run(account, formName, dataSource) {
    var _this = this;

    return _asyncToGenerator(function* () {
      // await Promise.all([ this.syncObject('ChoiceList', 'choice_lists', account),
      //                     this.syncObject('ClassificationSet', 'classification_sets', account),
      //                     this.syncObject('Project', 'projects', account) ]);

      yield _this.syncObject('ChoiceList', 'choice_lists', account);
      yield _this.syncObject('ClassificationSet', 'classification_sets', account);
      yield _this.syncObject('Project', 'projects', account);

      yield _this.syncObject('Form', 'forms', account);

      yield dataSource.source.load(account.db);

      const where = {
        account_id: account.rowID
      };

      if (formName) {
        where.name = formName;
      }

      const forms = yield _form2.default.findAll(account.db, where, 'name ASC');

      for (const form of forms) {
        if (process.env.MEDIA === '1') {
          yield _this.syncVideos(account, form);
          yield _this.syncPhotos(account, form);
        }

        yield new _bluebird2.default(function (resolve, reject) {
          form.load(dataSource, resolve);
        });

        yield _this.syncRecords(account, form);
      }
    })();
  }

  syncObject(objectName, key, account) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const results = yield _Client2.default['get' + objectName + 's'](account);

      const body = results.body;

      const data = JSON.parse(body);

      for (const attributes of data[key]) {
        const object = yield models[objectName].findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });
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

        yield object.save();

        if (objectName === 'Form') {
          const newForm = { row_id: object.rowID,
            name: object._name,
            elements: object._elementsJSON };

          yield account.db.execute((0, _util.format)('DROP VIEW IF EXISTS %s', account.db.ident(object.name)));

          yield _this2.updateFormTables(account, oldForm, newForm);

          yield account.db.execute((0, _util.format)('CREATE VIEW %s AS SELECT * FROM %s_view_full', account.db.ident(object.name), _recordValues2.default.tableNameWithForm(object)));
        }
      }

      console.log(account.organizationName.green, 'downloaded ' + key);
    })();
  }

  updateFormTables(account, oldForm, newForm) {
    return _asyncToGenerator(function* () {
      let oldSchema = null;
      let newSchema = null;

      if (oldForm) {
        oldSchema = new _schema2.default(oldForm, _postgresQueryV2.default, null);
      }

      if (newForm) {
        newSchema = new _schema2.default(newForm, _postgresQueryV2.default, null);
      }

      const differ = new SchemaDiffer(oldSchema, newSchema);

      let generator = null;

      if (account.db.dialect === 'sqlite') {
        // const meta = new Metadata(differ, {quote: '`', prefix: 'account_' + account.rowID + '_'});
        // generator = new Sqlite(differ, {afterTransform: meta.build.bind(meta)});
        generator = new Sqlite(differ, { afterTransform: null });
      } else if (account.db.dialect === 'postgresql') {
        // const meta = new Metadata(differ, {quote: '"', prefix: 'account_' + account.rowID + '_'});
        // generator = new Postgres(differ, {afterTransform: meta.build.bind(meta)});
        generator = new Postgres(differ, { afterTransform: null });
      }

      generator.tablePrefix = 'account_' + account.rowID + '_';

      const statements = generator.generate();

      yield account.db.transaction((() => {
        var _ref = _asyncToGenerator(function* (db) {
          for (const statement of statements) {
            yield db.execute(statement);
          }
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());
    })();
  }

  syncVideos(account, form) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3.syncVideoPage(account, form, 1);
    })();
  }

  syncVideoPage(account, form, page, total) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      const results = yield _Client2.default.getVideos(account, form, page);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      const body = results.body;

      if (results.statusCode !== 200) {
        console.log(account.organizationName.green, 'failed'.red, 'to download videos');
        return;
      }

      const data = JSON.parse(body);

      const db = account.db;

      let now = new Date();

      const queue = new _concurrentQueue2.default((() => {
        var _ref2 = _asyncToGenerator(function* (task) {
          const file = _path2.default.join(mediaPath, 'videos', task.access_key + '.mp4');

          yield _Client2.default.download(task.original, file);

          console.log((0, _util.format)('%s downloaded video | %s | %s', account.organizationName.green, task.access_key.cyan, (0, _filesize2.default)(task.file_size).red));
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })(), MEDIA_CONCURRENCY);

      yield db.transaction((() => {
        var _ref3 = _asyncToGenerator(function* (database) {
          for (const attributes of data.videos) {
            const object = yield models.Video.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });

            object.updateFromAPIAttributes(attributes);

            if (attributes.processed) {
              if (!object.isDownloaded) {
                queue.push(attributes, function (err) {
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

            yield object.save();
          }
        });

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      })());

      yield queue.drain();

      const totalTime = new Date().getTime() - now.getTime();

      console.log((0, _util.format)('%s downloaded videos | %s | %s | %s', account.organizationName.green, (0, _util.format)('page %s/%s', page, data.total_pages || 1).yellow, (totalFetchTime + 'ms').cyan + ' (api)'.red, (totalTime + 'ms').cyan + ' (db)'.red));

      if (data.total_pages > page) {
        yield _this4.syncVideoPage(account, form, page + 1, data.total_pages);
      }
    })();
  }

  syncPhotos(account, form) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return _this5.syncPhotoPage(account, form, 1);
    })();
  }

  syncPhotoPage(account, form, page, total) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      const results = yield _Client2.default.getPhotos(account, form, page);

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

      const queue = new _concurrentQueue2.default((() => {
        var _ref4 = _asyncToGenerator(function* (task) {
          const file = _path2.default.join(mediaPath, 'photos', task.access_key + '.jpg');

          yield _Client2.default.download(task.original, file);

          // await extractExif(file);

          console.log((0, _util.format)('%s downloaded photo | %s | %s', account.organizationName.green, task.access_key.cyan, (0, _filesize2.default)(task.file_size).red));
        });

        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      })(), MEDIA_CONCURRENCY);

      yield db.transaction((() => {
        var _ref5 = _asyncToGenerator(function* (database) {
          for (const attributes of data.photos) {
            const object = yield models.Photo.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });

            object.updateFromAPIAttributes(attributes);

            if (attributes.processed) {
              if (!object.isDownloaded) {
                queue.push(attributes, function (err) {
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

            yield object.save();
          }
        });

        return function (_x5) {
          return _ref5.apply(this, arguments);
        };
      })());

      yield queue.drain();

      const totalTime = new Date().getTime() - now.getTime();

      console.log((0, _util.format)('%s downloaded photos | %s | %s | %s', account.organizationName.green, (0, _util.format)('page %s/%s', page, data.total_pages || 1).yellow, (totalFetchTime + 'ms').cyan + ' (api)'.red, (totalTime + 'ms').cyan + ' (db)'.red));

      if (data.total_pages > page) {
        yield _this6.syncPhotoPage(account, form, page + 1, data.total_pages);
      }
    })();
  }

  syncRecords(account, form) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return _this7.syncRecordPage(account, form, 1, null, form._lastSync);
    })();
  }

  syncRecordPage(account, form, page, total, lastSync) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      const results = lastSync == null ? yield _Client2.default.getRecords(account, form, page) : yield _Client2.default.getRecordsHistory(account, form, page, lastSync);
      // const results = form.lastSync != null ? (await Client.getRecordsHistory(account, form, page))
      //                                       : (await Client.getRecordsHistory(account, form, page))

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

      const queue = new _concurrentQueue2.default((() => {
        var _ref6 = _asyncToGenerator(function* (task) {
          const generator = new _generator2.default(task.record);

          const reportDirectory = _path2.default.join(mediaPath, 'reports', form.name);

          _mkdirp2.default.sync(reportDirectory);

          const result = yield generator.generate(reportDirectory);

          console.log((0, _util.format)('%s generated report | %s | %s', account.organizationName.green, _path2.default.basename(result.file).cyan, (0, _filesize2.default)(result.size).red));
        });

        return function (_x6) {
          return _ref6.apply(this, arguments);
        };
      })(), MEDIA_CONCURRENCY);

      let count = 0;

      yield db.transaction((() => {
        var _ref7 = _asyncToGenerator(function* (database) {
          for (const attributes of data.records) {
            const object = yield models.Record.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });

            if (attributes.history_change_type === 'd') {
              if (object) {
                object._form = form;
                object._formRowID = form.rowID;

                yield object.delete();
              }
            } else {

              object.updateFromAPIAttributes(attributes);
              object._form = form;
              object._formRowID = form.rowID;

              form._lastSync = object.createdAt;

              if (attributes.project_id) {
                const project = yield account.projectByResourceID(attributes.project_id);

                if (project) {
                  object._projectRowID = project.rowID;
                }
              }

              yield object.save();

              if (process.env.REPORTS === '1') {
                queue.push({ record: object }, function (err) {
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

        return function (_x7) {
          return _ref7.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      // update the lastSync date
      yield form.save();

      // var profile1 = profiler.stopProfiling();

      // console.log(profile1.getHeader());

      // profile1.export(function (error, result) {
      //   if (error) {
      //     throw error;
      //   }
      //   fs.writeFileSync('profile1.cpuprofile', result);
      //   profile1.delete();
      // });

      yield queue.drain();

      console.log((0, _util.format)('%s downloaded records in %s | %s | %s | %s', account.organizationName.green, form.name.blue, (0, _util.format)('page %s/%s', page, data.total_pages || 1).yellow, (totalFetchTime + 'ms').cyan + ' (api)'.red, (totalTime + 'ms').cyan + ' (db)'.red));

      if (data.total_pages > page) {
        yield _this8.syncRecordPage(account, form, page + 1, data.total_pages, lastSync);
      }
    })();
  }
}

exports.default = Synchronizer;
Synchronizer.instance = new Synchronizer();
//# sourceMappingURL=synchronizer.js.map