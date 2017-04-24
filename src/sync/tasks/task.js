import ProgressBar from 'progress';
import {format} from 'util';
import app from '../../app';

export default class Task {
  constructor({synchronizer, syncState}) {
    this._synchronizer = synchronizer;
    this._syncState = syncState;
  }

  get synchronizer() {
    return this._synchronizer;
  }

  getSyncState(resource, scope = null) {
    return this._syncState.find((object) => {
      return object.resource === resource && ((object.scope == null && scope === '') || object.scope === scope);
    });
  }

  async checkSyncState(account, resource, scope = null) {
    const oldState = await account.findSyncState({resource, scope: scope || ''});
    const newState = this.getSyncState(resource, scope || '');

    let needsUpdate = true;

    if (oldState && newState && oldState.hash === newState.hash) {
      needsUpdate = false;
    }

    const update = async () => {
      if (oldState && newState) {
        oldState.hash = newState.hash;
        oldState.scope = oldState.scope || '';

        await oldState.save();
      }
    };

    return { needsUpdate, state: oldState, update };
  }

  async execute({account, dataSource}) {
    this.account = account;

    const result = await this.run({account, dataSource});

    if (this.bar) {
      console.log('');
    }

    return result;
  }

  trigger(name, args) {
    return app.emit(name, args);
  }

  get downloading() {
    return '😀 '.yellow;
  }

  get processing() {
    // return '➡️ '.cyan;
    return '🤔 '.cyan;
  }

  get finished() {
    return '😎 '.green;
  }

  progress({message, count, total}) {
    // const fmt = count != null ? format('%s :bar :percent (:current/:total) :etas :elapsed', message.green)
    //                           : format('%s', message.green);
    const fmt = count != null ? format('%s :bar :percent (:current/:total) :etas :elapsed', message.green)
                              : format('%s', message.green);

    if (!this.bar) {
      const options = {
        width: 40,
        total: total || 1,
        complete: '▇'.green,
        incomplete: '-',
        clear: false
      };

      this.bar = new ProgressBar(fmt, options);
      this.bar.tick(0);
    }

    this.bar.fmt = fmt;

    if (total != null) {
      this.bar.total = total || 1;
    }

    if (this._message !== message) {
      this.bar.curr = 0;
      this.bar.render();
      this._message = message;
    }

    if (count != null) {
      this.bar.curr = count;
      this.bar.render();
    }
  }

  async markDeletedObjects(localObjects, newObjects) {
    // delete all objects that don't exist on the server anymore
    for (const object of localObjects) {
      let objectExistsOnServer = false;

      for (const attributes of newObjects) {
        if (attributes.id === object.id) {
          objectExistsOnServer = true;
          break;
        }
      }

      if (!objectExistsOnServer) {
        object._deletedAt = object._deletedAt ? object._deletedAt : new Date();
        await object.save();
      }
    }
  }
}
