import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import request from 'request';
import fs from 'fs';
import tempy from 'tempy';
import { parseFile } from '../../../jsonseq';
import { format } from 'util';

const QUERY_PAGE_SIZE = 50000;

export default class DownloadQuerySequence extends DownloadSequence {
  async download(account, lastSync, sequence, state) {
    if (lastSync != null) {
      await DownloadSequence.prototype.download.call(this, account, lastSync, sequence, state);
    } else {
      let nextSequence = sequence || 0;

      while (nextSequence != null) {
        nextSequence = await this.downloadQueryPage(account, lastSync, nextSequence, state);

        await account.save();
      }

      await state.update();
      await this.finish();
    }
  }

  async downloadQueryPage(account, lastSync, sequence, state) {
    const sql = this.generateQuery(sequence || 0, QUERY_PAGE_SIZE);

    const options = Client.getQueryURL(account, sql);

    const filePath = tempy.file({extension: 'jsonseq'});

    this.progress({message: this.downloading + ' ' + this.syncLabel.blue});

    await this.downloadQuery(options, filePath);

    const {count, lastObject} = await this.processQueryResponse(account, filePath);

    const message = format(this.finished + ' %s',
                           this.syncLabel.blue);

    this.progress({message, count: count, total: -1});

    if (count >= QUERY_PAGE_SIZE) {
      return Math.ceil(lastObject.updatedAt.getTime() - 1);
    }

    return null;
  }

  async processQueryResponse(account, filePath) {
    this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: 0, total: -1});

    let index = 0;
    let lastObject = null;

    await account.db.transaction(async (database) => {
      await new Promise((resolve, reject) => {
        const onObject = (json, done) => {
          if (json.row) {
            this.processQueryObject(json, account, database, (object) => {
              lastObject = object;
              this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: index + 1, total: -1});
              ++index;
              done();
            });
          } else {
            done();
          }
        };

        const onInvalid = (data, done) => {
          console.error('Invalid', data && data.toString());
          done(new Error('invalid JSON sequence'));
        };

        const onTruncated = (data, done) => {
          console.error('Truncated:', data && data.toString());
          done(new Error('truncated JSON sequence'));
        };

        const onEnd = () => {
          resolve();
        };

        const onError = (err) => {
          reject(err);
        };

        parseFile(filePath, {onObject, onInvalid, onTruncated})
          .on('end', onEnd)
          .on('error', onError);
      });
    });

    return {count: index, lastObject};
  }

  processQueryObject(attributes, account, database, done) {
    this.processObjectAsync(attributes, account, database).then(done).catch(done);
  }

  async processObjectAsync(json, account, database) {
    const attributes = this.attributesForQueryRow(json.row);

    const object = await this.findOrCreate(database, account, attributes);

    await this.process(object, attributes);

    return object;
  }

  async downloadQuery(options, to) {
    return new Promise((resolve, reject) => {
      const rq = request(options).pipe(fs.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }
}
