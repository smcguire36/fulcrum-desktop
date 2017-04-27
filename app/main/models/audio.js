'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class Audio {
  static get tableName() {
    return 'audio';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'metadata', column: 'metadata', type: 'json' }, { name: 'filePath', column: 'file_path', type: 'string' }, { name: 'isDownloaded', column: 'is_downloaded', type: 'boolean', null: false }, { name: 'formRowID', column: 'form_id', type: 'integer' }, { name: 'recordRowID', column: 'record_id', type: 'integer' }];
  }

  get id() {
    return this._id;
  }

  updateFromAPIAttributes(attributes) {
    this._id = attributes.access_key;
    this._metadata = attributes.metadata;
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
  }

  get isDownloaded() {
    return this._isDownloaded;
  }

  set isDownloaded(value) {
    this._isDownloaded = !!value;
  }
}

exports.default = Audio;
_minidb.PersistentObject.register(Audio);
//# sourceMappingURL=audio.js.map