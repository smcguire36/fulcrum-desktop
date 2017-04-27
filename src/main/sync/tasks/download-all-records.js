import Task from './task';
import DownloadRecords from './download-records';
import DownloadPhotos from './download-photos';
import DownloadVideos from './download-videos';
import DownloadAudio from './download-audio';
import DownloadSignatures from './download-signatures';
// import DownloadPhotos from './download-photos';

export default class DownloadAllRecords extends Task {
  async run({account, dataSource}) {
    const forms = await account.findActiveForms();

    for (const form of forms) {
      await new Promise((resolve, reject) => {
        form.load(dataSource, resolve);
      });

      this.synchronizer.addTask(new DownloadRecords({form: form, ...this.synchronizer.taskParams}));
    }

    // download media here to make sure the tasks are ordered after the records
    this.synchronizer.addTask(new DownloadPhotos(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadVideos(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadAudio(this.synchronizer.taskParams));
    this.synchronizer.addTask(new DownloadSignatures(this.synchronizer.taskParams));
  }
}