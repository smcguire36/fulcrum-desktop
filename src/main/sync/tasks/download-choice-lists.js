import Task from './task';
import Client from '../../api/client';
import ChoiceList from '../../models/choice-list';
import { DateUtils } from 'fulcrum-core';

export default class DownloadChoiceLists extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'choice_lists');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' choice lists'});

    const response = await Client.getChoiceLists(account);

    const objects = JSON.parse(response.body).choice_lists;

    this.progress({message: this.processing + ' choice lists', count: 0, total: objects.length});

    const localObjects = await account.findChoiceLists();

    this.markDeletedObjects(localObjects, objects, 'choice-list', 'choiceList');

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await ChoiceList.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      const isChanged = !object.isPersisted ||
                        DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      object.updateFromAPIAttributes(attributes);

      object._deletedAt = null;

      await object.save();

      if (isChanged) {
        await this.trigger('choice-list:save', {choiceList: object});
      }

      this.progress({message: this.processing + ' choice lists', count: index + 1, total: objects.length});
    }

    await sync.update();

    dataSource.source.invalidate('choiceLists');

    this.progress({message: this.finished + ' choice lists', count: objects.length, total: objects.length});
  }
}
