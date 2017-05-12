import DownloadSequence from './download-sequence';
import Client from '../../api/client';
import Record from '../../models/record';
import request from 'request';
import fs from 'fs';
import tempy from 'tempy';
import { parseFile } from '../../../jsonseq';
import { format } from 'util';

const QUERY_PAGE_SIZE = 50000;

export default class DownloadRecords extends DownloadSequence {
  constructor({form, ...args}) {
    super(args);

    this.form = form;
  }

  get syncResourceName() {
    return 'records';
  }

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  async fetchObjects(account, lastSync, sequence) {
    return lastSync == null ? (await Client.getRecords(account, this.form, sequence, this.pageSize))
                            : (await Client.getRecordsHistory(account, this.form, sequence, this.pageSize));
  }

  findOrCreate(database, account, attributes) {
    return Record.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});
  }

  async process(object, attributes) {
    if (attributes.history_change_type === 'd') {
      if (object) {
        object._form = this.form;
        object._formRowID = this.form.rowID;

        await object.delete();

        this._hasChanges = true;

        await this.trigger('record:delete', {record: object});
      }
    } else {
      const isChanged = !object.isPersisted || attributes.version !== object.version;

      object.updateFromAPIAttributes(attributes);
      object._form = this.form;
      object._formRowID = this.form.rowID;

      this.form._lastSync = object.updatedAt;

      await this.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
      await this.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
      await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

      await object.save();

      if (isChanged) {
        this._hasChanges = true;
        await this.trigger('record:save', {record: object});
      }
    }
  }

  async finish() {
    // update the lastSync date
    await this.form.save();

    if (this._hasChanges) {
      await this.trigger('records:finish', {form: this.form});
    }
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }

  async download(account, lastSync, sequence, state) {
    if (lastSync != null) {
      await DownloadSequence.prototype.download.call(this, account, lastSync, sequence, state);
    } else {
      const sql = this.recordQuery(this.form, sequence || 0);

      const options = Client.getQueryURL(account, sql);

      const filePath = tempy.file({extension: 'jsonseq'});

      this.progress({message: this.downloading + ' ' + this.syncLabel.blue});

      await this.downloadQuery(options, filePath);

      const {count, lastRecord} = await this.processRecords(account, filePath);

      const message = format(this.finished + ' %s',
                             this.syncLabel.blue);

      this.progress({message, count: count, total: -1});

      if (count >= QUERY_PAGE_SIZE) {
        const nextSequence = Math.ceil(lastRecord.updatedAt.getTime() - 1);
        await this.download(account, lastSync, nextSequence, state);
      } else {
        await state.update();
        await this.finish();
      }
    }
  }

  async processRecords(account, filePath) {
    this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: 0, total: -1});

    let index = 0;
    let lastRecord = null;

    await account.db.transaction(async (database) => {
      await new Promise((resolve, reject) => {
        const onObject = (json, done) => {
          if (json.row) {
            this.processRecord(json, account, database, (record) => {
              lastRecord = record;
              this.progress({message: this.processing + ' ' + this.syncLabel.blue, count: index + 1, total: -1});
              ++index;
              done();
            });
          } else {
            done();
          }
        };

        const onInvalid = (data, done) => {
          console.error('Invalid', data);
          done();
        };

        const onTruncated = (data, done) => {
          console.error('Truncated:', data, done);
          done();
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

    return {count: index, lastRecord};
  }

  processRecord(json, account, database, done) {
    this.processRecordAsync(json, account, database).then(done).catch(done);
  }

  async processRecordAsync(json, account, database) {
    const {row} = json;

    const attributes = {
      status: row[0],
      version: row[1],
      id: row[2],
      created_at: row[3],
      updated_at: row[4],
      client_created_at: row[5],
      client_updated_at: row[6],
      created_by_id: row[7],
      updated_by_id: row[8],
      form_id: row[9],
      project_id: row[10],
      assigned_to_id: row[11],
      form_values: JSON.parse(row[12]),
      latitude: row[13],
      longitude: row[14],
      altitude: row[15],
      speed: row[16],
      course: row[17],
      horizontal_accuracy: row[18],
      vertical_accuracy: row[19],
      edited_duration: row[20],
      updated_duration: row[21],
      created_duration: row[22],
      created_by: row[23],
      updated_by: row[24],
      assigned_to: row[25],
      project: row[26]
    };

    const object = await Record.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.id});

    const isChanged = !object.isPersisted || attributes.version !== object.version;

    object.updateFromAPIAttributes(attributes);
    object._form = this.form;
    object._formRowID = this.form.rowID;

    this.form._lastSync = object.updatedAt;

    await this.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
    await this.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
    await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

    await object.save({timestamps: false});

    if (isChanged) {
      this._hasChanges = true;
      await this.trigger('record:save', {record: object});
    }

    return object;
  }

  async downloadQuery(options, to) {
    return new Promise((resolve, reject) => {
      const rq = request(options).pipe(fs.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }

  recordQuery(form, sequence = 0, limit = QUERY_PAGE_SIZE) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "_status" AS "status",
  "_version" AS "version",
  "_record_id" AS "id",
  to_char(pg_catalog.timezone('UTC', "_server_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "_server_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  to_char(pg_catalog.timezone('UTC', "_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_created_at",
  to_char(pg_catalog.timezone('UTC', "_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_updated_at",
  "_created_by_id" AS "created_by_id",
  "_updated_by_id" AS "updated_by_id",
  '${ form.id }'::text AS "form_id",
  "_project_id" AS "project_id",
  "_assigned_to_id" AS "assigned_to_id",
  "_form_values" AS "form_values",
  "_latitude" AS "latitude",
  "_longitude" AS "longitude",
  "_altitude" AS "altitude",
  "_speed" AS "speed",
  "_course" AS "course",
  "_horizontal_accuracy" AS "horizontal_accuracy",
  "_vertical_accuracy" AS "vertical_accuracy",
  "_edited_duration" AS "edited_duration",
  "_updated_duration" AS "updated_duration",
  "_created_duration" AS "created_duration",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by",
  "assigned_to"."name" AS "assigned_to",
  "project"."name" AS "project"
FROM "${ form.id }/_full" AS "records"
LEFT OUTER JOIN "memberships" AS "created_by" ON (("records"."_created_by_id") = ("created_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "updated_by" ON (("records"."_updated_by_id") = ("updated_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "assigned_to" ON (("records"."_assigned_to_id") = ("assigned_to"."user_id"))
LEFT OUTER JOIN "projects" AS "project" ON (("records"."_project_id") = ("project"."project_id"))
WHERE
  _server_updated_at > '${sequenceString}'
ORDER BY
  _server_updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
