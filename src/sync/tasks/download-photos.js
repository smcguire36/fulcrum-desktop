import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Photo from '../../models/photo';

export default class DownloadPhotos extends DownloadSequence {
  get syncResourceName() {
    return 'photos';
  }

  get syncLabel() {
    return 'photos';
  }

  get resourceName() {
    return 'photos';
  }

  get lastSync() {
    return this.account._lastSyncPhotos;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getPhotos(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Photo.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});
  }

  async process(object, attributes) {
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

    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');

    if (object._formRowID) {
      const record = await this.account.findFirstRecord({resource_id: attributes.record_id});

      if (record) {
        object._recordRowID = record.rowID;
      }
    }

    this.account._lastSyncPhotos = object._updatedAt;

    await object.save();
  }

  async finish() {
    // update the lastSync date
    await this.account.save();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
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
