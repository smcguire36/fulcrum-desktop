'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

class ChoiceList extends _fulcrumCore.ChoiceList {
  static get tableName() {
    return 'choice_lists';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'choicesJSON', column: 'choices', type: 'json', null: false }];
  }
}

exports.default = ChoiceList;
_minidb.PersistentObject.register(ChoiceList);
//# sourceMappingURL=choice-list.js.map