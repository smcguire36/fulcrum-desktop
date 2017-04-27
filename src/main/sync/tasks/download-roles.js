import Task from './task';
import Client from '../../api/client';
import Role from '../../models/role';

export default class DownloadRoles extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'roles');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' roles'});

    const response = await Client.getRoles(account);

    const objects = JSON.parse(response.body).roles;

    this.progress({message: this.processing + ' roles', count: 0, total: objects.length});

    const localObjects = await account.findRoles();

    this.markDeletedObjects(localObjects, objects);

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await Role.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      object.updateFromAPIAttributes(attributes);

      object._deletedAt = null;

      await object.save();

      this.progress({message: this.processing + ' roles', count: index + 1, total: objects.length});
    }

    await sync.update();

    this.progress({message: this.finished + ' roles', count: objects.length, total: objects.length});
  }
}
