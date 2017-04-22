import { PersistentObject } from 'minidb';
import Role from './role';

export default class Membership {
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
    return [
      { name: 'accountRowID', column: 'account_id', type: 'integer', null: false },
      { name: 'id', column: 'resource_id', type: 'string', null: false },
      { name: 'userID', column: 'user_resource_id', type: 'string', null: false },
      { name: 'roleID', column: 'role_resource_id', type: 'string', null: false },
      { name: 'roleRowID', column: 'role_id', type: 'integer', null: false },
      { name: 'email', column: 'email', type: 'string', null: false },
      { name: 'firstName', column: 'first_name', type: 'string', null: false },
      { name: 'lastName', column: 'last_name', type: 'string', null: false },
      { name: 'createdAt', column: 'created_at', type: 'datetime', null: false },
      { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false },
      { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }
    ];
  }

  async getLocalRole() {
    this._role = await Role.findFirst(this.db, {resource_id: this._roleID});
    this._roleRowID = this._role ? this._role.rowID : null;
    return this._role;
  }

  // role
  getRole() {
    return this.loadOne('role', Role);
  }

  get role() {
    return this._role;
  }

  set role(role) {
    this.setOne('role', role);
  }
}

PersistentObject.register(Membership);
