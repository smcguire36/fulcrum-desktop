import Base from './base';
// import {Form as FormBase} from 'fulcrum-core';

// import Feature from './feature';
// import FormValues from './values/form-values';
// import TextUtils from './utils/text-utils';
// import DateUtils from './utils/date-utils';
import {ChildElements} from 'fulcrum-core';
import async from 'async';

export default class Form extends Base {
  updateFromDatabaseAttributes(attributes) {
    super.updateFromDatabaseAttributes(attributes);

    if (this.elementsJSON) {
      this.createChildElements(this.elementsJSON);
    }
  }

  load(dataSource, callback) {
    const loadElements = [];

    for (const element of this.allElements) {
      if (element.load) {
        loadElements.push(element);
      }
    }

    async.each(loadElements, (element, cb) => {
      element.load(dataSource, cb);
    }, callback);
  }

  static get tableName() {
    return 'forms';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'elementsJSON', column: 'elements', type: 'json', null: false },
      { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' },
      { name: 'statusFieldJSON', column: 'status_field', type: 'json' }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.elementsJSON = attributes.elements;
    this.titleFieldKeysJSON = attributes.title_field_keys;
    this.statusFieldJSON = attributes.status_field;
  }

  // get model() {
  //   if (!this._form) {
  //     this._form = new FormModel({elements: this.elements, title_field_keys: this.titleFieldKeys});
  //   }
  //   return this._form;
  // }
  //

  get(key) {
    return this.elementsByKey[key];
  }

  find(dataName) {
    return this.elementsByDataName[dataName];
  }

  get hasHiddenParent() {
    return false;
  }
}

ChildElements.includeInto(Form);
Base.register(Form);
