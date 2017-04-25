'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _changeset = require('../../models/changeset');

var _changeset2 = _interopRequireDefault(_changeset);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChangesets extends _downloadSequence2.default {
  get syncResourceName() {
    return 'changesets';
  }

  get syncLabel() {
    return 'changesets';
  }

  get resourceName() {
    return 'changesets';
  }

  get lastSync() {
    return this.account._lastSyncChangesets;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getChangesets(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _changeset2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      object.updateFromAPIAttributes(attributes);

      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      yield _this2.lookup(object, attributes.form_id, '_formRowID', 'getForm');
      yield _this2.lookup(object, attributes.closed_by_id, '_closedByRowID', 'getUser');
      yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');

      _this2.account._lastSyncChangesets = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('changeset:save', { changeset: object });
      }
    })();
  }

  finish() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // update the lastSync date
      yield _this3.account.save();
    })();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
exports.default = DownloadChangesets;
//# sourceMappingURL=download-changesets.js.map