import Base from './base';
import {Classification} from 'fulcrum-core';
// import {ClassificationSet as ClassificationSetBase} from 'fulcrum-core';

export default class ClassificationSet extends Base {
  static get tableName() {
    return 'classification_sets';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'itemsJSON', column: 'items', type: 'json', null: false }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.itemsJSON = attributes.items;
  }

  get items() {
    if (!this._items) {
      this._items = [];

      for (const item of this.itemsJSON) {
        this._items.push(new Classification(null, item));
      }
    }
    return this._items;
  }
}

// Base.includeInto(ClassificationSet);
Base.register(ClassificationSet);
