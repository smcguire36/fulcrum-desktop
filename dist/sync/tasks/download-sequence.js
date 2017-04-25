'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PAGE_SIZE = 1000;

class DownloadSequence extends _task2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get syncResourceName() {}

  get syncResourceScope() {
    return null;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {}

  get lastSync() {}

  fetchObjects(account, lastSync, sequence) {}

  findOrCreate(database, account, attributes) {}

  process(object, attributes) {
    return _asyncToGenerator(function* () {})();
  }

  finish() {
    return _asyncToGenerator(function* () {})();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }

  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const state = yield _this.checkSyncState(account, _this.syncResourceName, _this.syncResourceScope);

      if (!state.needsUpdate) {
        return;
      }

      const lastSync = _this.lastSync;

      const sequence = lastSync ? lastSync.getTime() : null;

      _this.dataSource = dataSource;

      yield _this.download(account, lastSync, sequence, state);
    })();
  }

  download(account, lastSync, sequence, state) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      _this2.progress({ message: _this2.downloading + ' ' + _this2.syncLabel.blue });

      const results = yield _this2.fetchObjects(account, lastSync, sequence);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      if (results.statusCode !== 200) {
        _this2.fail(account, results);
        return;
      }

      const data = JSON.parse(results.body);

      const objects = data[_this2.resourceName];

      const db = account.db;

      let now = new Date();

      _this2.progress({ message: _this2.processing + ' ' + _this2.syncLabel.blue, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _this2.findOrCreate(database, account, attributes);

            yield _this2.process(object, attributes);

            _this2.progress({ message: _this2.processing + ' ' + _this2.syncLabel.blue, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      yield _this2.finish();

      const message = (0, _util.format)(_this2.finished + ' %s | %s | %s', _this2.syncLabel.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this2.progress({ message, count: objects.length, total: objects.length });

      if (data.next_sequence) {
        yield _this2.download(account, lastSync, data.next_sequence, state);
      } else {
        yield state.update();
      }
    })();
  }
}
exports.default = DownloadSequence;
//# sourceMappingURL=download-sequence.js.map