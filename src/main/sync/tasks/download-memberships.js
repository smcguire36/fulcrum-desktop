import Task from './task';
import Client from '../../api/client';
import Membership from '../../models/membership';
import { DateUtils } from 'fulcrum-core';

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

    this.markDeletedObjects(localObjects, objects, 'membership');

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await Membership.findOrCreate(account.db, {user_resource_id: attributes.user_id, account_id: account.rowID});

      const isChanged = !object.isPersisted ||
                        DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      object.updateFromAPIAttributes(attributes);

      await object.getLocalRole();

      object._deletedAt = null;

      await object.save();

      if (isChanged) {
        await this.trigger('membership:save', {membership: object});
      }

      this.progress({message: this.processing + ' memberships', count: index + 1, total: objects.length});
    }

    await sync.update();

    dataSource.source.invalidate('memberships');

    this.progress({message: this.finished + ' memberships', count: objects.length, total: objects.length});
  }
}
