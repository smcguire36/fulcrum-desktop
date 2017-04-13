import Task from './task';
import DownloadRecords from './download-records';
// import DownloadPhotos from './download-photos';

export default class DownloadAllRecords extends Task {
  async run({account, dataSource}) {
    const forms = await account.findActiveForms();

    for (const form of forms) {
      await new Promise((resolve, reject) => {
        form.load(dataSource, resolve);
      });

      this.synchronizer.addTask(new DownloadRecords({form: form, ...this.synchronizer.taskParams}));
      // this.synchronizer.addTask(new DownloadPhotos({form: form, ...this.synchronizer.taskParams}));
    }

    // this.progress({message: this.finished + ' looking for records'});
  }
}
