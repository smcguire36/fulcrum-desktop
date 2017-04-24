import { PersistentObject } from 'minidb';
import { Changeset as ChangesetBase } from 'fulcrum-core';

export default class Changeset extends ChangesetBase {
  static get tableName() {
    return 'changesets';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'formRowID', column: 'form_id', type: 'integer' },
      { name: 'metadata', column: 'metadata', type: 'json' },
      { name: 'metadataIndexText', column: 'metadata_index_text', type: 'string' },
      { name: 'closedAt', column: 'closed_at', type: 'datetime' },
      { name: 'closedByRowID', column: 'closed_by_id', type: 'integer' },
      { name: 'closedByID', column: 'closed_by_resource_id', type: 'string' },
      { name: 'createdByRowID', column: 'created_by_id', type: 'integer' },
      { name: 'createdByID', column: 'created_by_resource_id', type: 'string' },
      { name: 'numberOfChanges', column: 'number_of_changes', type: 'integer' },
      { name: 'minLat', column: 'min_lat', type: 'double' },
      { name: 'maxLat', column: 'max_lat', type: 'double' },
      { name: 'minLon', column: 'min_lon', type: 'double' },
      { name: 'maxLon', column: 'max_lon', type: 'double' },
      { name: 'createdAt', column: 'created_at', type: 'datetime', null: false },
      { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }
    ];
  }

  async beforeSave(options) {
    this._metadataIndexText = this.metadataIndexText;
  }
}

PersistentObject.register(Changeset);
