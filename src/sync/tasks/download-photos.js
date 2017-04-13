import Task from './task';
import Client from '../../api/Client';
import Photo from '../../models/photo';
import {format} from 'util';

export default class DownloadPhotos extends Task {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  async run({account, dataSource}) {
    await this.downloadPhotosPage(account, this.form, 1, null, this.form._lastSync);
  }

  async downloadPhotosPage(account, form, page, total, lastSync) {
    const beginFetchTime = new Date();
    const {db} = account;

    this.progress({message: this.downloading + ' photos ' + this.form.name.blue + ' ' + format('page %s', page).yellow});

    const results = await Client.getPhotos(account, form, page, lastSync);

    const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

    const data = JSON.parse(results.body);

    const objects = data.photos;

    let now = new Date();

    this.progress({message: this.processing + ' photos ' + this.form.name.blue + ' ' + format('page %s/%s', page, data.total_pages || 1).yellow, count: 0, total: objects.length});

    await db.transaction(async (database) => {
      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = await Photo.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});

        object.updateFromAPIAttributes(attributes);

        if (attributes.processed) {
          if (!object.isDownloaded) {
            // queue.push(attributes, function(err) {
            //   if (err) {
            //     console.log('ERROR DOWNLOADING', err);
            //     throw err;
            //   }

            //   object.isDownloaded = true;
            //   // do we need to await this somehow?
            //   object.save();
            // });
          }
        } else {
          object.isDownloaded = false;
        }

        if (object.isDownloaded == null) {
          object.isDownloaded = false;
        }

        await object.save();

        this.progress({message: this.processing + ' photos ' + this.form.name.blue + ' ' + format('page %s/%s', page, data.total_pages || 1).yellow, count: index + 1, total: objects.length});
      }
    });

    const totalTime = new Date().getTime() - now.getTime();

    const message = format(this.finished + ' photos %s | %s | %s | %s',
                           form.name.blue,
                           format('%s/%s', page, data.total_pages || 1).yellow,
                           (totalFetchTime + 'ms').cyan,
                           (totalTime + 'ms').red);

    this.progress({message, count: objects.length, total: objects.length});

    if (data.total_pages > page) {
      await this.downloadPhotosPage(account, form, page + 1, data.total_pages, lastSync);
    }
  }
}
