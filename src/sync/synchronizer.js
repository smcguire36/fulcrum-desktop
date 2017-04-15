import DownloadChoiceLists from './tasks/download-choice-lists';
import DownloadClassificationSets from './tasks/download-classification-sets';
import DownloadProjects from './tasks/download-projects';
import DownloadForms from './tasks/download-forms';
import DownloadAllRecords from './tasks/download-all-records';

import Client from '../api/Client';
import path from 'path';
import mkdirp from 'mkdirp';

// import exif from 'exif';
// import Generator from '../reports/generator';
import humanizeDuration from 'humanize-duration';
// import { Database } from 'minidb';

// Database.debug = true;

require('colors');

function getUserHome() {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

const mediaPath = path.join(getUserHome(), 'Documents', 'fulcrum-media');

mkdirp.sync(mediaPath);
mkdirp.sync(path.join(mediaPath, 'videos'));
mkdirp.sync(path.join(mediaPath, 'photos'));
mkdirp.sync(path.join(mediaPath, 'audio'));
mkdirp.sync(path.join(mediaPath, 'reports'));

// const scrub = (string) => string.replace(/\0/g, '');

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

    this.addTask(new DownloadChoiceLists(this.taskParams));
    this.addTask(new DownloadClassificationSets(this.taskParams));
    this.addTask(new DownloadProjects(this.taskParams));
    this.addTask(new DownloadForms(this.taskParams));
    this.addTask(new DownloadAllRecords(this.taskParams));

    await dataSource.source.load(account.db);

    do {
      const task = this.popTask();

      await task.execute({account, dataSource});
    } while (this._tasks.length);

    console.log('Synced', humanizeDuration(new Date().getTime() - start));
  }
}
