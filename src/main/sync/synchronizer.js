import DownloadRoles from './tasks/download-roles';
import DownloadMemberships from './tasks/download-memberships';
import DownloadChoiceLists from './tasks/download-choice-lists';
import DownloadClassificationSets from './tasks/download-classification-sets';
import DownloadProjects from './tasks/download-projects';
import DownloadForms from './tasks/download-forms';
import DownloadChangesets from './tasks/download-changesets';
import DownloadAllRecords from './tasks/download-all-records';

import Client from '../api/client';

import humanizeDuration from 'humanize-duration';

// import { Database } from 'minidb';
// Database.debug = true;

require('colors');

export default class Synchronizer {
  constructor() {
    this._tasks = [];
  }

  addTask(task) {
    this._tasks.push(task);
  }

  popTask() {
    return this._tasks.shift();
  }

  async run(account, formName, dataSource, {fullSync}) {
    const start = new Date().getTime();

    const response = await Client.getSync(account);

    this.syncState = fullSync ? [] : JSON.parse(response.body).resources;
    this.taskParams = { synchronizer: this, syncState: this.syncState };

    this.addTask(new DownloadRoles(this.taskParams));
    this.addTask(new DownloadMemberships(this.taskParams));
    this.addTask(new DownloadChoiceLists(this.taskParams));
    this.addTask(new DownloadClassificationSets(this.taskParams));
    this.addTask(new DownloadProjects(this.taskParams));
    this.addTask(new DownloadForms(this.taskParams));
    this.addTask(new DownloadChangesets(this.taskParams));
    this.addTask(new DownloadAllRecords(this.taskParams));

    await dataSource.source.load(account.db);

    do {
      const task = this.popTask();

      await task.execute({account, dataSource});
    } while (this._tasks.length);

    console.log('Synced', humanizeDuration(new Date().getTime() - start));
  }
}