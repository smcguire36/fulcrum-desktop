import Task from './task';
import Client from '../../api/Client';
import Record from '../../models/record';
import {format} from 'util';

export default class DownloadRecords extends Task {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'records', this.form.id);

    if (!sync.needsUpdate) {
      return;
    }

    await this.downloadRecordPage(account, this.form, 1, null, this.form._lastSync, sync);
  }

  async downloadRecordPage(account, form, page, total, lastSync, sync) {
    const beginFetchTime = new Date();

    this.progress({message: this.downloading + ' ' + this.form.name.blue + ' ' + format('page %s', page).yellow});

    const results = lastSync == null ? (await Client.getRecords(account, form, page))
                                     : (await Client.getRecordsHistory(account, form, page, lastSync));

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    if (results.statusCode !== 200) {
      console.log(account.organizationName.green, 'failed'.red, 'to download records in', form.name.blue);
      return;
    }

    const data = JSON.parse(results.body);

    const objects = data.records;

    const db = account.db;

    let now = new Date();

    this.progress({message: this.processing + ' ' + this.form.name.blue + ' ' + format('page %s/%s', page, data.total_pages || 1).yellow, count: 0, total: objects.length});

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

          if (attributes.project_id) {
            const project = await account.projectByResourceID(attributes.project_id);

            if (project) {
              object._projectRowID = project.rowID;
            }
          }

          await object.save();

          if (isChanged) {
            await this.trigger('record:save', {record: object});
          }
        }

        this.progress({message: this.processing + ' ' + this.form.name.blue + ' ' + format('page %s/%s', page, data.total_pages || 1).yellow, count: index + 1, total: objects.length});
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    // update the lastSync date
    await form.save();

    const message = format(this.finished + ' %s | %s | %s | %s',
                           form.name.blue,
                           format('%s/%s', page, data.total_pages || 1).yellow,
                           (totalFetchTime + 'ms').cyan,
                           (totalTime + 'ms').red);

    this.progress({message, count: objects.length, total: objects.length});

    if (data.total_pages > page) {
      await this.downloadRecordPage(account, form, page + 1, data.total_pages, lastSync, sync);
    } else {
      await sync.update();
    }
  }
}
