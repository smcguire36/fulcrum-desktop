import { PersistentObject } from 'minidb';
import { ClassificationSet as ClassificationSetBase } from 'fulcrum-core';

export default class ClassificationSet extends ClassificationSetBase {
  static get tableName() {
    return 'classification_sets';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'itemsJSON', column: 'items', type: 'json', null: false }
    ];
  }
}

PersistentObject.register(ClassificationSet);
