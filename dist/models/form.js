'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class Form extends _fulcrumCore.Form {
  static get tableName() {
    return 'forms';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'version', column: 'version', type: 'integer', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'elementsJSON', column: 'elements', type: 'json', null: false }, { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' }, { name: 'statusFieldJSON', column: 'status_field', type: 'json' }, { name: 'lastSync', column: 'last_sync', type: 'datetime' }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }
}

exports.default = Form;
_minidb.PersistentObject.register(Form);
//# sourceMappingURL=form.js.map