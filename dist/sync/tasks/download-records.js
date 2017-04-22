'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _Client = require('../../api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _record = require('../../models/record');

var _record2 = _interopRequireDefault(_record);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PAGE_SIZE = 1000;

class DownloadRecords extends _task2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const state = yield _this.checkSyncState(account, 'records', _this.form.id);

      if (!state.needsUpdate) {
        return;
      }

      const sequence = _this.form._lastSync ? _this.form._lastSync.getTime() : null;

      _this.dataSource = dataSource;

      yield _this.downloadRecords(account, _this.form, _this.form._lastSync, sequence, state);
    })();
  }

  downloadRecords(account, form, lastSync, sequence, state) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      _this2.progress({ message: _this2.downloading + ' ' + _this2.form.name.blue });

      const results = lastSync == null ? yield _Client2.default.getRecords(account, form, sequence, PAGE_SIZE) : yield _Client2.default.getRecordsHistory(account, form, sequence, PAGE_SIZE);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      if (results.statusCode !== 200) {
        console.log(account.organizationName.green, 'failed'.red, 'to download records in', form.name.blue);
        return;
      }

      const data = JSON.parse(results.body);

      const objects = data.records;

      const db = account.db;

      let now = new Date();

      _this2.progress({ message: _this2.processing + ' ' + _this2.form.name.blue, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _record2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });

            if (attributes.history_change_type === 'd') {
              if (object) {
                object._form = form;
                object._formRowID = form.rowID;

                yield object.delete();

                yield _this2.trigger('record:delete', { record: object });
              }
            } else {
              const isChanged = !object.isPersisted || attributes.version !== object.version;

              object.updateFromAPIAttributes(attributes);
              object._form = form;
              object._formRowID = form.rowID;

              form._lastSync = object.updatedAt;

              yield _this2.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
              yield _this2.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
              yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
              yield _this2.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

              yield object.save();

              if (isChanged) {
                yield _this2.trigger('record:save', { record: object });
              }
            }

            _this2.progress({ message: _this2.processing + ' ' + _this2.form.name.blue, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      // update the lastSync date
      yield form.save();

      const message = (0, _util.format)(_this2.finished + ' %s | %s | %s', form.name.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this2.progress({ message, count: objects.length, total: objects.length });

      if (data.next_sequence) {
        yield _this2.downloadRecords(account, form, lastSync, data.next_sequence, state);
      } else {
        yield state.update();
      }
    })();
  }

  lookup(record, resourceID, propName, getter) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (resourceID) {
        const object = yield new Promise(function (resolve) {
          _this3.dataSource[getter](resourceID, function (err, object) {
            return resolve(object);
          });
        });

        if (object) {
          record[propName] = object.rowID;
        }
      }
    })();
  }
}
exports.default = DownloadRecords;
//# sourceMappingURL=download-records.js.map