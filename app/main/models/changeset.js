'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Changeset extends _fulcrumCore.Changeset {
  static get tableName() {
    return 'changesets';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'formRowID', column: 'form_id', type: 'integer' }, { name: 'metadata', column: 'metadata', type: 'json' }, { name: 'metadataIndexText', column: 'metadata_index_text', type: 'string' }, { name: 'closedAt', column: 'closed_at', type: 'datetime' }, { name: 'closedByRowID', column: 'closed_by_id', type: 'integer' }, { name: 'closedByID', column: 'closed_by_resource_id', type: 'string' }, { name: 'createdByRowID', column: 'created_by_id', type: 'integer' }, { name: 'createdByID', column: 'created_by_resource_id', type: 'string' }, { name: 'numberOfChanges', column: 'number_of_changes', type: 'integer' }, { name: 'minLat', column: 'min_lat', type: 'double' }, { name: 'maxLat', column: 'max_lat', type: 'double' }, { name: 'minLon', column: 'min_lon', type: 'double' }, { name: 'maxLon', column: 'max_lon', type: 'double' }, { name: 'createdAt', column: 'created_at', type: 'datetime', null: false }, { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }];
  }

  beforeSave(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._metadataIndexText = _this.metadataIndexText;
    })();
  }
}

exports.default = Changeset;
_minidb.PersistentObject.register(Changeset);
//# sourceMappingURL=changeset.js.map