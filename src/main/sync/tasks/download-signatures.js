import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Signature from '../../models/signature';
import { DateUtils } from 'fulcrum-core';

export default class DownloadSignatures extends DownloadSequence {
  get syncResourceName() {
    return 'signatures';
  }

  get syncLabel() {
    return 'signatures';
  }

  get resourceName() {
    return 'signatures';
  }

  get lastSync() {
    return this.account._lastSyncSignatures;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getSignatures(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Signature.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});
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

    this.account._lastSyncSignatures = object._updatedAt;

    await object.save();

    if (isChanged) {
      await this.trigger('signature:save', {signature: object});
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
