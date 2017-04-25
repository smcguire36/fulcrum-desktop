'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _downloadRecords = require('./download-records');

var _downloadRecords2 = _interopRequireDefault(_downloadRecords);

var _downloadPhotos = require('./download-photos');

var _downloadPhotos2 = _interopRequireDefault(_downloadPhotos);

var _downloadVideos = require('./download-videos');

var _downloadVideos2 = _interopRequireDefault(_downloadVideos);

var _downloadAudio = require('./download-audio');

var _downloadAudio2 = _interopRequireDefault(_downloadAudio);

var _downloadSignatures = require('./download-signatures');

var _downloadSignatures2 = _interopRequireDefault(_downloadSignatures);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import DownloadPhotos from './download-photos';

class DownloadAllRecords extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const forms = yield account.findActiveForms();

      for (const form of forms) {
        yield new Promise(function (resolve, reject) {
          form.load(dataSource, resolve);
        });

        _this.synchronizer.addTask(new _downloadRecords2.default(_extends({ form: form }, _this.synchronizer.taskParams)));
      }

      // download media here to make sure the tasks are ordered after the records
      _this.synchronizer.addTask(new _downloadPhotos2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadVideos2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadAudio2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadSignatures2.default(_this.synchronizer.taskParams));
    })();
  }
}
exports.default = DownloadAllRecords;
//# sourceMappingURL=download-all-records.js.map