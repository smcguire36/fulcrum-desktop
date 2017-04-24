import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Record from '../../models/record';

export default class DownloadRecords extends DownloadSequence {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  get syncResourceName() {
    return 'records';
  }

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  async fetchObjects(account, lastSync, sequence) {
    return lastSync == null ? (await Client.getRecords(account, this.form, sequence, this.pageSize))
                            : (await Client.getRecordsHistory(account, this.form, sequence, this.pageSize));
  }

  findOrCreate(database, account, attributes) {
    return Record.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});
  }

  async process(object, attributes) {
    if (attributes.history_change_type === 'd') {
      if (object) {
        object._form = this.form;
        object._formRowID = this.form.rowID;

        await object.delete();

        await this.trigger('record:delete', {record: object});
      }
    } else {
      const isChanged = !object.isPersisted || attributes.version !== object.version;

      object.updateFromAPIAttributes(attributes);
      object._form = this.form;
      object._formRowID = this.form.rowID;

      this.form._lastSync = object.updatedAt;

      await this.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
      await this.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
      await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

      await object.save();

      if (isChanged) {
        await this.trigger('record:save', {record: object});
      }
    }
  }

  async finish() {
    // update the lastSync date
    await this.form.save();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
