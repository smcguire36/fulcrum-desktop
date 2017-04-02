'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Account {
  static get tableName() {
    return 'accounts';
  }

  static get columns() {
    return [{ name: 'userResourceID', column: 'user_resource_id', type: 'string', null: false }, { name: 'organizationResourceID', column: 'organization_resource_id', type: 'string', null: false }, { name: 'organizationName', column: 'organization_name', type: 'string', null: false }, { name: 'email', column: 'email', type: 'string', null: false }, { name: 'firstName', column: 'first_name', type: 'string' }, { name: 'lastName', column: 'last_name', type: 'string' }, { name: 'token', column: 'token', type: 'string' }];
  }

  get userResourceID() {
    return this._userResourceID;
  }

  get organizationResourceID() {
    return this._organizationResourceID;
  }

  get organizationName() {
    return this._organizationName;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get token() {
    return this._token;
  }

  static findByUserAndOrganization(userID, organizationID, callback) {
    return Account.findFirst({ user_resource_id: userID,
      organization_resource_id: organizationID }, callback);
  }

  findForms(where) {
    return _form2.default.findAll(this.db, Object.assign({}, where, { account_id: this.id }), 'name ASC');
  }

  projectByResourceID(projectId) {
    return _project2.default.findFirst(this.db, { account_id: this.id });
  }
}

exports.default = Account;
_minidb.PersistentObject.register(Account);
//# sourceMappingURL=account.js.map