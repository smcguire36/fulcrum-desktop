import Base from './base';

export default class Video extends Base {
  static get tableName() {
    return 'videos';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'metadata', column: 'metadata', type: 'json' },
      { name: 'filePath', column: 'file_path', type: 'string' },
      { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.access_key;
    this.metadata = attributes.metadata;
  }
}

Base.register(Video);
