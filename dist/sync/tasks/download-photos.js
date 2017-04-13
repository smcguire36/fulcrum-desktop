'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _Client = require('../../api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _photo = require('../../models/photo');

var _photo2 = _interopRequireDefault(_photo);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class DownloadPhotos extends _task2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.downloadPhotosPage(account, _this.form, 1, null, _this.form._lastSync);
    })();
  }

  downloadPhotosPage(account, form, page, total, lastSync) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();
      const { db } = account;

      _this2.progress({ message: _this2.downloading + ' photos ' + _this2.form.name.blue + ' ' + (0, _util.format)('page %s', page).yellow });

      const results = yield _Client2.default.getPhotos(account, form, page, lastSync);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      const data = JSON.parse(results.body);

      const objects = data.photos;

      let now = new Date();

      _this2.progress({ message: _this2.processing + ' photos ' + _this2.form.name.blue + ' ' + (0, _util.format)('page %s/%s', page, data.total_pages || 1).yellow, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _photo2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });

            object.updateFromAPIAttributes(attributes);

            if (attributes.processed) {
              if (!object.isDownloaded) {
                // queue.push(attributes, function(err) {
                //   if (err) {
                //     console.log('ERROR DOWNLOADING', err);
                //     throw err;
                //   }

                //   object.isDownloaded = true;
                //   // do we need to await this somehow?
                //   object.save();
                // });
              }
            } else {
              object.isDownloaded = false;
            }

            if (object.isDownloaded == null) {
              object.isDownloaded = false;
            }

            yield object.save();

            _this2.progress({ message: _this2.processing + ' photos ' + _this2.form.name.blue + ' ' + (0, _util.format)('page %s/%s', page, data.total_pages || 1).yellow, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      const message = (0, _util.format)(_this2.finished + ' photos %s | %s | %s | %s', form.name.blue, (0, _util.format)('%s/%s', page, data.total_pages || 1).yellow, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this2.progress({ message, count: objects.length, total: objects.length });

      if (data.total_pages > page) {
        yield _this2.downloadPhotosPage(account, form, page + 1, data.total_pages, lastSync);
      }
    })();
  }
}
exports.default = DownloadPhotos;
//# sourceMappingURL=download-photos.js.map