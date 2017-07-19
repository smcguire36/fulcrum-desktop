import DownloadQuerySequence from './download-query-sequence';
import Client from '../../api/client';
import Photo from '../../models/photo';
import { DateUtils } from 'fulcrum-core';

export default class DownloadPhotos extends DownloadQuerySequence {
  get syncResourceName() {
    return 'photos';
  }

  get syncLabel() {
    return 'photos';
  }

  get resourceName() {
    return 'photos';
  }

  get lastSync() {
    return this.account._lastSyncPhotos;
  }

  get useRestAPI() {
    return false;
  }

  async fetchObjects(account, lastSync, sequence) {
    return Client.getPhotos(account, sequence, this.pageSize);
  }

  findOrCreate(database, account, attributes) {
    return Photo.findOrCreate(database, {account_id: account.rowID, resource_id: attributes.access_key});
  }

  async process(object, attributes) {
    const isChanged = !object.isPersisted ||
                      DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

    object.updateFromAPIAttributes(attributes);

    if (object.isDownloaded == null) {
      object.isDownloaded = false;
    }

    await this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
    await this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
    await this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

    if (object._formRowID) {
      const record = await this.account.findFirstRecord({resource_id: attributes.record_id});

      if (record) {
        object._recordRowID = record.rowID;
      }
    }

    this.account._lastSyncPhotos = object._updatedAt;

    await object.save();

    if (isChanged) {
      await this.trigger('photo:save', {photo: object});
    }
  }

  async finish() {
    // update the lastSync date
    await this.account.save();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }

  attributesForQueryRow(row) {
    return {
      access_key: row[0],
      created_at: row[1],
      updated_at: row[2],
      uploaded: row[3],
      stored: row[4],
      processed: row[5],
      created_by_id: row[6],
      updated_by_id: row[7],
      form_id: row[8],
      record_id: row[9],
      content_type: row[10],
      file_size: row[11],
      latitude: row[12],
      longitude: row[13],
      exif: row[14] && JSON.parse(row[14]),
      created_by: row[15],
      updated_by: row[16]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "photo_id" AS "access_key",
  to_char(pg_catalog.timezone('UTC', "records"."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "records"."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  "uploaded_at" IS NOT NULL AS uploaded,
  "stored_at" IS NOT NULL AS stored,
  "processed_at" IS NOT NULL AS processed,
  "created_by_id" AS "created_by_id",
  "updated_by_id" AS "updated_by_id",
  "form_id" AS "form_id",
  "record_id" AS "record_id",
  "content_type" AS "content_type",
  "file_size" AS "file_size",
  "latitude" AS "latitude",
  "longitude" AS "longitude",
  "exif" AS "exif",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by"
FROM "photos" AS "records"
LEFT OUTER JOIN "memberships" AS "created_by" ON (("records"."created_by_id") = ("created_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "updated_by" ON (("records"."updated_by_id") = ("updated_by"."user_id"))
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
