import Task from './task';
import Client from '../../api/Client';
import Record from '../../models/record';
import {format} from 'util';

const PAGE_SIZE = 1000;

export default class DownloadRecords extends Task {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  async run({account, dataSource}) {
    const state = await this.checkSyncState(account, 'records', this.form.id);

    if (!state.needsUpdate) {
      return;
    }

    const sequence = this.form._lastSync ? this.form._lastSync.getTime() : null;

    this.dataSource = dataSource;

    await this.downloadRecords(account, this.form, this.form._lastSync, sequence, state);
  }

  async downloadRecords(account, form, lastSync, sequence, state) {
    const beginFetchTime = new Date();

    this.progress({message: this.downloading + ' ' + this.form.name.blue});

    const results = lastSync == null ? (await Client.getRecords(account, form, sequence, PAGE_SIZE))
                                     : (await Client.getRecordsHistory(account, form, sequence, PAGE_SIZE));

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    if (results.statusCode !== 200) {
      console.log(account.organizationName.green, 'failed'.red, 'to download records in', form.name.blue);
      return;
    }

    const data = JSON.parse(results.body);

    const objects = data.records;

    const db = account.db;

    let now = new Date();

    this.progress({message: this.processing + ' ' + this.form.name.blue, count: 0, total: objects.length});

    await db.transaction(async (database) => {
      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = await Record.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});

        if (attributes.history_change_type === 'd') {
          if (object) {
            object._form = form;
            object._formRowID = form.rowID;

            await object.delete();

            await this.trigger('record:delete', {record: object});
          }
        } else {
          const isChanged = !object.isPersisted || attributes.version !== object.version;

          object.updateFromAPIAttributes(attributes);
          object._form = form;
          object._formRowID = form.rowID;

          form._lastSync = object.updatedAt;

          await this.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
          await this.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
          await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
          await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

          await object.save();

          if (isChanged) {
            await this.trigger('record:save', {record: object});
          }
        }

        this.progress({message: this.processing + ' ' + this.form.name.blue, count: index + 1, total: objects.length});
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    // update the lastSync date
    await form.save();

    const message = format(this.finished + ' %s | %s | %s',
                           form.name.blue,
                           (totalFetchTime + 'ms').cyan,
                           (totalTime + 'ms').red);

    this.progress({message, count: objects.length, total: objects.length});

    if (data.next_sequence) {
      await this.downloadRecords(account, form, lastSync, data.next_sequence, state);
    } else {
      await state.update();
    }
  }

  async lookup(record, resourceID, propName, getter) {
    if (resourceID) {
      const object = await new Promise((resolve) => {
        this.dataSource[getter](resourceID, (err, object) => resolve(object));
      });

      if (object) {
        record[propName] = object.rowID;
      }
    }
  }
}
