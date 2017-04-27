'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Membership {
  constructor(attributes) {
    this.updateFromAPIAttributes(attributes);
  }

  updateFromAPIAttributes(attrs) {
    const attributes = attrs || {};

    this._id = attributes.id;
    this._firstName = attributes.first_name;
    this._lastName = attributes.last_name;
    this._userID = attributes.user_id;
    this._email = attributes.email;
    this._roleID = attributes.role_id;
  }

  get id() {
    return this._id;
  }

  static get tableName() {
    return 'memberships';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'userID', column: 'user_resource_id', type: 'string', null: false }, { name: 'roleID', column: 'role_resource_id', type: 'string', null: false }, { name: 'roleRowID', column: 'role_id', type: 'integer', null: false }, { name: 'email', column: 'email', type: 'string', null: false }, { name: 'firstName', column: 'first_name', type: 'string', null: false }, { name: 'lastName', column: 'last_name', type: 'string', null: false }, { name: 'createdAt', column: 'created_at', type: 'datetime', null: false }, { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }

  getLocalRole() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._role = yield _role2.default.findFirst(_this.db, { resource_id: _this._roleID });
      _this._roleRowID = _this._role ? _this._role.rowID : null;
      return _this._role;
    })();
  }

  // role
  getRole() {
    return this.loadOne('role', _role2.default);
  }

  get role() {
    return this._role;
  }

  set role(role) {
    this.setOne('role', role);
  }
}

exports.default = Membership;
_minidb.PersistentObject.register(Membership);
//# sourceMappingURL=membership.js.map