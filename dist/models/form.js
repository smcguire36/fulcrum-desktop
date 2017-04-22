'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Form extends _fulcrumCore.Form {
  static get tableName() {
    return 'forms';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'version', column: 'version', type: 'integer', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'elementsJSON', column: 'elements', type: 'json', null: false }, { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' }, { name: 'statusFieldJSON', column: 'status_field', type: 'json' }, { name: 'lastSync', column: 'last_sync', type: 'datetime' }, { name: 'createdAt', column: 'created_at', type: 'datetime', null: false }, { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }

  findEachRecord(where, callback) {
    return _record2.default.findEach(this.db, { where: _extends({}, where, { form_id: this.rowID }) }, callback);
  }

  findRecordsBySQL(sql, values) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const tableName = `account_${_this._accountRowID}_form_${_this.rowID}_view_full`;

      sql = 'SELECT * FROM ' + tableName + (sql ? ' WHERE ' + sql : '');

      const rows = yield _this.db.all(sql, values);

      const records = [];

      for (const row of rows) {
        const attributes = _record2.default.queryRowToAttributes(row);

        const record = new _record2.default(attributes, _this);

        record._db = _this.db;

        records.push(record);
      }

      return records;
    })();
  }
}

exports.default = Form;
_minidb.PersistentObject.register(Form);
//# sourceMappingURL=form.js.map