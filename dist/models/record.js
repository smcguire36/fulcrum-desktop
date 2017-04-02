'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

var _recordValues = require('../record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Record extends _fulcrumCore.Record {
  static get tableName() {
    return 'records';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'formValuesJSON', column: 'form_values', type: 'json', null: false }, { name: 'clientCreatedAt', column: 'client_created_at', type: 'datetime' }, { name: 'clientUpdatedAt', column: 'client_updated_at', type: 'datetime' }, { name: 'status', column: 'status', type: 'string' }, { name: 'formRowID', column: 'form_id', type: 'integer' }, { name: 'projectRowID', column: 'project_id', type: 'integer' }, { name: 'version', column: 'version', type: 'integer', null: false }, { name: 'hasChanges', column: 'has_changes', type: 'boolean' }, { name: 'indexText', column: 'index_text', type: 'string' }];
  }

  afterSave(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const statements = _recordValues2.default.updateForRecordStatements(_this.db, _this);

      yield _this.db.execute(statements.map(function (o) {
        return o.sql;
      }).join('\n'));
    })();
  }

  beforeSave(options) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.indexText = _this2.formValues.searchableValue;
    })();
  }

  beforeDelete(options) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const statements = _recordValues2.default.deleteForRecordStatements(_this3.db, _this3, _this3.form);

      yield _this3.db.execute(statements.map(function (o) {
        return o.sql;
      }).join('\n'));
    })();
  }

  getForm() {
    return this.loadOne('form', _form2.default);
  }

  get form() {
    return this._form;
  }

  set form(form) {
    this.setOne('form', form);
  }
}

exports.default = Record;
_minidb.PersistentObject.register(Record);
//# sourceMappingURL=record.js.map