'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadChoiceLists = require('./tasks/download-choice-lists');

var _downloadChoiceLists2 = _interopRequireDefault(_downloadChoiceLists);

var _downloadClassificationSets = require('./tasks/download-classification-sets');

var _downloadClassificationSets2 = _interopRequireDefault(_downloadClassificationSets);

var _downloadProjects = require('./tasks/download-projects');

var _downloadProjects2 = _interopRequireDefault(_downloadProjects);

var _downloadForms = require('./tasks/download-forms');

var _downloadForms2 = _interopRequireDefault(_downloadForms);

var _downloadAllRecords = require('./tasks/download-all-records');

var _downloadAllRecords2 = _interopRequireDefault(_downloadAllRecords);

var _Client = require('../api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _humanizeDuration = require('humanize-duration');

var _humanizeDuration2 = _interopRequireDefault(_humanizeDuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import exif from 'exif';
// import Generator from '../reports/generator';


// import { Database } from 'minidb';

// Database.debug = true;

require('colors');

function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}

const mediaPath = _path2.default.join(getUserHome(), 'Documents', 'fulcrum-media');

_mkdirp2.default.sync(mediaPath);
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'videos'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'photos'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'audio'));
_mkdirp2.default.sync(_path2.default.join(mediaPath, 'reports'));

// const scrub = (string) => string.replace(/\0/g, '');

class Synchronizer {
  constructor() {
    this._tasks = [];
  }

  addTask(task) {
    this._tasks.push(task);
  }

  popTask() {
    return this._tasks.shift();
  }

  run(account, formName, dataSource) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const start = new Date().getTime();

      const response = yield _Client2.default.getSync(account);

      _this.syncState = JSON.parse(response.body).resources;
      _this.taskParams = { synchronizer: _this, syncState: _this.syncState };

      _this.addTask(new _downloadChoiceLists2.default(_this.taskParams));
      _this.addTask(new _downloadClassificationSets2.default(_this.taskParams));
      _this.addTask(new _downloadProjects2.default(_this.taskParams));
      _this.addTask(new _downloadForms2.default(_this.taskParams));
      _this.addTask(new _downloadAllRecords2.default(_this.taskParams));

      yield dataSource.source.load(account.db);

      do {
        const task = _this.popTask();

        yield task.execute({ account, dataSource });
      } while (_this._tasks.length);

      console.log('Synced', (0, _humanizeDuration2.default)(new Date().getTime() - start));
    })();
  }
}
exports.default = Synchronizer;
//# sourceMappingURL=synchronizer.js.map