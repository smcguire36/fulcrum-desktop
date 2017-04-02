'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class Project extends _fulcrumCore.Project {
  static get tableName() {
    return 'projects';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'description', column: 'description', type: 'string' }];
  }
}

exports.default = Project;
_minidb.PersistentObject.register(Project);
//# sourceMappingURL=project.js.map