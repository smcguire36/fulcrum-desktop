import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Video from '../../models/video';
import { DateUtils } from 'fulcrum-core';

export default class DownloadVideos extends DownloadSequence {
  get syncResourceName() {
    return 'videos';
  }

  get syncLabel() {
    return 'videos';
  }

  get resourceName() {
    return 'videos';
  }

  get lastSync() {
    return this.account._lastSyncVideos;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getVideos(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Video.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});
  }

  async process(object, attributes) {
    object.updateFromAPIAttributes(attributes);

    const isChanged = !object.isPersisted ||
                      DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

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

    this.account._lastSyncVideos = object._updatedAt;

    await object.save();

    if (isChanged) {
      await this.trigger('video:save', {video: object});
    }
  }

  async finish() {
    // update the lastSync date
    await this.account.save();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
