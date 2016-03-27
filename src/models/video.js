import { PersistentObject } from 'minidb';

export default class Video {
  static get tableName() {
    return 'videos';
  }

  static get columns() {
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'metadata', column: 'metadata', type: 'json' },
      { name: 'filePath', column: 'file_path', type: 'string' },
      { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._metadata = attributes.metadata;
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }
}

PersistentObject.register(Video);
