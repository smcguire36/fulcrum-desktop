import Task from './task';
import {format} from 'util';

const PAGE_SIZE = 1000;

export default class DownloadSequence extends Task {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get syncResourceName() {
  }

  get syncResourceScope() {
    return null;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
  }

  get lastSync() {
  }

  fetchObjects(account, lastSync, sequence) {
  }

  findOrCreate(database, account, attributes) {
  }

  async process(object, attributes) {
  }

  async finish() {
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }

  async run({account, dataSource}) {
    const state = await this.checkSyncState(account, this.syncResourceName, this.syncResourceScope);

    if (!state.needsUpdate) {
      return;
    }

    const lastSync = this.lastSync;

    const sequence = lastSync ? lastSync.getTime() : null;

    this.dataSource = dataSource;

    await this.download(account, lastSync, sequence, state);
  }

  async download(account, lastSync, sequence, state) {
    let nextSequence = sequence || 0;

    while (nextSequence != null) {
      nextSequence = await this.downloadPage(account, lastSync, nextSequence, state);

      await account.save();
    }

    await state.update();
    await this.finish();
  }

  async downloadPage(account, lastSync, sequence, state) {
    const beginFetchTime = new Date();

    this.progress({message: this.downloading + ' ' + this.syncLabel.blue});

    const results = await this.fetchObjects(account, lastSync, sequence);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    if (results.statusCode !== 200) {
      this.fail(account, results);
      return null;
    }

    const data = JSON.parse(results.body);

    const objects = data[this.resourceName];

    const db = account.db;

    let now = new Date();

    this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: 0, total: objects.length});

    await db.transaction(async (database) => {
      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = await this.findOrCreate(database, account, attributes);

        await this.process(object, attributes);

        this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: index + 1, total: objects.length});
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    const message = format(this.finished + ' %s | %s | %s',
                           this.syncLabel.blue,
                           (totalFetchTime + 'ms').cyan,
                           (totalTime + 'ms').red);

    this.progress({message, count: objects.length, total: objects.length});

    return data.next_sequence;
  }
}
