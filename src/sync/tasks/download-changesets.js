import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Changeset from '../../models/changeset';

export default class DownloadChangesets extends DownloadSequence {
  get syncResourceName() {
    return 'changesets';
  }

  get syncLabel() {
    return 'changesets';
  }

  get resourceName() {
    return 'changesets';
  }

  get lastSync() {
    return this.account._lastSyncChangesets;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getChangesets(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Changeset.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});
  }

  async process(object, attributes) {
    object.updateFromAPIAttributes(attributes);

    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
    await this.lookup(object, attributes.closed_by_id, '_closedByRowID', 'getUser');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');

    this.account._lastSyncChangesets = object._updatedAt;

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
