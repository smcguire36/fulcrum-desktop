import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Audio from '../../models/audio';

export default class DownloadAudio extends DownloadSequence {
  get syncResourceName() {
    return 'audio';
  }

  get syncLabel() {
    return 'audio';
  }

  get resourceName() {
    return 'audio';
  }

  get lastSync() {
    return this.account._lastSyncAudio;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getAudio(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Audio.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});
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

    this.account._lastSyncAudio = object._updatedAt;

    await object.save();
  }

  async finish() {
    // update the lastSync date
    await this.account.save();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
