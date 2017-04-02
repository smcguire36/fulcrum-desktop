import { PersistentObject } from 'minidb';
import { Record as RecordBase } from 'fulcrum-core';
import RecordValues from '../record-values';
import Form from './form';

export default class Record extends RecordBase {
  static get tableName() {
    return 'records';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'formValuesJSON', column: 'form_values', type: 'json', null: false },
      { name: 'clientCreatedAt', column: 'client_created_at', type: 'datetime' },
      { name: 'clientUpdatedAt', column: 'client_updated_at', type: 'datetime' },
      { name: 'status', column: 'status', type: 'string' },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'projectRowID', column: 'project_id', type: 'integer' },
      { name: 'version', column: 'version', type: 'integer', null: false },
      { name: 'hasChanges', column: 'has_changes', type: 'boolean' },
      { name: 'indexText', column: 'index_text', type: 'string' }
    ];
  }

  async afterSave(options) {
    const statements = RecordValues.updateForRecordStatements(this.db, this);

    await this.db.execute(statements.map(o => o.sql).join('\n'));
  }

  async beforeSave(options) {
    this.indexText = this.formValues.searchableValue;
  }

  async beforeDelete(options) {
    const statements = RecordValues.deleteForRecordStatements(this.db, this, this.form);

    await this.db.execute(statements.map(o => o.sql).join('\n'));
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
}

PersistentObject.register(Record);
