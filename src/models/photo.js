import Base from './base';

export default class Photo extends Base {
  static get tableName() {
    return 'photos';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'exif', column: 'exif', type: 'json' },
      { name: 'filePath', column: 'file_path', type: 'string' },
      { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.access_key;
    this.exif = attributes.exif;
  }
}

Base.register(Photo);
