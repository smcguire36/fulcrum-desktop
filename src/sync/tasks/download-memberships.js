import Task from './task';
import Client from '../../api/Client';
import Membership from '../../models/membership';

export default class DownloadMemberships extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'memberships');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' memberships'});

    const response = await Client.getMemberships(account);

    const objects = JSON.parse(response.body).memberships;

    this.progress({message: this.processing + ' memberships', count: 0, total: objects.length});

    const localObjects = await account.findMemberships();

    this.markDeletedObjects(localObjects, objects);

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await Membership.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      object.updateFromAPIAttributes(attributes);

      await object.getLocalRole();

      object._deletedAt = null;

      await object.save();

      this.progress({message: this.processing + ' memberships', count: index + 1, total: objects.length});
    }

    await sync.update();

    this.progress({message: this.finished + ' memberships', count: objects.length, total: objects.length});
  }
}
