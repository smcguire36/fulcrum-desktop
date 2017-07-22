import Task from './task';
import Client from '../../api/client';
import Project from '../../models/project';
import { DateUtils } from 'fulcrum-core';

export default class DownloadProjects extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'projects');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' projects'});

    const response = await Client.getProjects(account);

    const objects = JSON.parse(response.body).projects;

    this.progress({message: this.processing + ' projects', count: 0, total: objects.length});

    const localObjects = await account.findProjects();

    this.markDeletedObjects(localObjects, objects, 'project');

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await Project.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      const isChanged = !object.isPersisted ||
                        DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      object.updateFromAPIAttributes(attributes);

      object._deletedAt = null;

      await object.save();

      if (isChanged) {
        await this.trigger('project:save', {project: object});
      }

      this.progress({message: this.processing + ' projects', count: index + 1, total: objects.length});
    }

    await sync.update();

    dataSource.source.invalidate('projects');

    this.progress({message: this.finished + ' projects', count: objects.length, total: objects.length});
  }
}
