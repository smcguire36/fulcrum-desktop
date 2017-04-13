import { PersistentObject } from 'minidb';
import { Form as FormBase } from 'fulcrum-core';

export default class Form extends FormBase {
  static get tableName() {
    return 'forms';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'version', column: 'version', type: 'integer', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'elementsJSON', column: 'elements', type: 'json', null: false },
      { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' },
      { name: 'statusFieldJSON', column: 'status_field', type: 'json' },
      { name: 'lastSync', column: 'last_sync', type: 'datetime' },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }
}

PersistentObject.register(Form);
