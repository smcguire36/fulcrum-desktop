import Task from './task';
import Client from '../../api/Client';
import ClassificationSet from '../../models/classification-set';

export default class DownloadClassificationSets extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'classification_sets');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' classification sets'});

    const response = await Client.getClassificationSets(account);

    const objects = JSON.parse(response.body).classification_sets;

    this.progress({message: this.processing + ' classification sets', count: 0, total: objects.length});

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await ClassificationSet.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      object.updateFromAPIAttributes(attributes);

      await object.save();

      this.progress({message: this.processing + ' classification sets', count: index + 1, total: objects.length});
    }

    await sync.update();

    this.progress({message: this.finished + ' classification sets', count: objects.length, total: objects.length});
  }
}
