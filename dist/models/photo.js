'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

class Photo {
  static get tableName() {
    return 'photos';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'exif', column: 'exif', type: 'json' }, { name: 'filePath', column: 'file_path', type: 'string' }, { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }];
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._exif = attributes.exif;
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }
}

exports.default = Photo;
_minidb.PersistentObject.register(Photo);
//# sourceMappingURL=photo.js.map