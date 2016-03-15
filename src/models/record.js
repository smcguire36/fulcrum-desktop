import Base from './base';
import RecordValues from '../record-values';
import Form from './form';
// import {Record as RecordBase} from 'fulcrum-core';

// import Feature from './feature';
import {FormValues} from 'fulcrum-core';
// import TextUtils from './utils/text-utils';
// import DateUtils from './utils/date-utils';

export default class Record extends Base {
  static get tableName() {
    return 'records';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'formValuesJSON', column: 'form_values', type: 'json', null: false },
      { name: 'clientCreatedAt', column: 'client_created_at', type: 'datetime' },
      { name: 'clientUpdatedAt', column: 'client_updated_at', type: 'datetime' },
      { name: 'status', column: 'status', type: 'string' },
      { name: 'formID', column: 'form_id', type: 'integer' },
      { name: 'projectID', column: 'project_id', type: 'integer' },
      { name: 'version', column: 'version', type: 'integer' },
      { name: 'hasChanges', column: 'has_changes', type: 'boolean' },
      { name: 'indexText', column: 'index_text', type: 'string' }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.id;
    this.formValuesJSON = attributes.form_values;
    this.clientCreatedAt = new Date(attributes.client_created_at);
    this.clientUpdatedAt = new Date(attributes.client_updated_at);
    this.status = attributes.status;
    this.version = attributes.version;
  }

  async afterSave(options) {
    await RecordValues.updateForRecord(this);
    // super.save(options);
    // RecordValues.updateForRecord(this);
  }

  async beforeSave(options) {
    this.indexText = this.formValues.searchableValue;
  }

  getForm() {
    return this.loadOne('form', Form);
  }

  get form() {
    return this._form;
  }

  set form(form) {
    this.setOne('form', form);
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get createdAt() {
    return this._createdAt;
  }

  set createdAt(createdAt) {
    this._createdAt = createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  set updatedAt(updatedAt) {
    this._updatedAt = updatedAt;
  }

  get formValues() {
    if (this._formValues == null) {
      this._formValues = new FormValues(this.form, this.formValuesJSON);
    }

    return this._formValues;
  }

  get hasCoordinate() {
    return this._latitude != null && this._longitude != null;
  }

  // async getForm() {
  //   if (!this._form) {
  //     this._form = await Form.findFirst(this.db, {id: this.formId});
  //   }
  //   return this._form;
  // }

  // async getModel() {
  //   if (!this._model) {
  //     const attributes = {
  //       id: this.resourceId,
  //       client_created_at: this.clientCreatedAt,
  //       client_updated_at: this.clientUpdatedAt,
  //       form_values: this.formValues,
  //       latitude: this.latitude,
  //       longitude: this.longitude
  //     };

  //     const form = await this.getForm();

  //     this._model = new RecordModel(form.model, attributes);
  //   }
  //   return this._model;
  // }
}

// Base.includeInto(Record);
Base.register(Record);
