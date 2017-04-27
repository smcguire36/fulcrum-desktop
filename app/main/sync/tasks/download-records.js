'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _record = require('../../models/record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class DownloadRecords extends _downloadSequence2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  get syncResourceName() {
    return 'records';
  }

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return lastSync == null ? yield _client2.default.getRecords(account, _this.form, sequence, _this.pageSize) : yield _client2.default.getRecordsHistory(account, _this.form, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _record2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (attributes.history_change_type === 'd') {
        if (object) {
          object._form = _this2.form;
          object._formRowID = _this2.form.rowID;

          yield object.delete();

          _this2._hasChanges = true;

          yield _this2.trigger('record:delete', { record: object });
        }
      } else {
        const isChanged = !object.isPersisted || attributes.version !== object.version;

        object.updateFromAPIAttributes(attributes);
        object._form = _this2.form;
        object._formRowID = _this2.form.rowID;

        _this2.form._lastSync = object.updatedAt;

        yield _this2.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
        yield _this2.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
        yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
        yield _this2.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

        yield object.save();

        if (isChanged) {
          _this2._hasChanges = true;
          yield _this2.trigger('record:save', { record: object });
        }
      }
    })();
  }

  finish() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // update the lastSync date
      yield _this3.form.save();

      if (_this3._hasChanges) {
        yield _this3.trigger('records:finish', { form: _this3.form });
      }
    })();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
exports.default = DownloadRecords;
//# sourceMappingURL=download-records.js.map