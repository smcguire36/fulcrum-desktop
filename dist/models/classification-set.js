'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class ClassificationSet extends _fulcrumCore.ClassificationSet {
  static get tableName() {
    return 'classification_sets';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'itemsJSON', column: 'items', type: 'json', null: false }];
  }
}

exports.default = ClassificationSet;
_minidb.PersistentObject.register(ClassificationSet);
//# sourceMappingURL=classification-set.js.map