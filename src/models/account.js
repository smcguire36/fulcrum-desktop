import { PersistentObject } from 'minidb';
import Project from './project';
import Form from './form';
import SyncState from './sync-state';

export default class Account {
  static get tableName() {
    return 'accounts';
  }

  static get columns() {
    return [
      { name: 'userResourceID', column: 'user_resource_id', type: 'string', null: false },
      { name: 'organizationResourceID', column: 'organization_resource_id', type: 'string', null: false },
      { name: 'organizationName', column: 'organization_name', type: 'string', null: false },
      { name: 'email', column: 'email', type: 'string', null: false },
      { name: 'firstName', column: 'first_name', type: 'string' },
      { name: 'lastName', column: 'last_name', type: 'string' },
      { name: 'token', column: 'token', type: 'string' }
    ];
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
    return Account.findFirst({user_resource_id: userID,
                              organization_resource_id: organizationID}, callback);
  }

  findForms(where) {
    return Form.findAll(this.db, {...where, account_id: this.rowID}, 'name ASC');
  }

  findActiveForms(where) {
    return Form.findAll(this.db, {...where, account_id: this.rowID, deleted_at: null}, 'name ASC');
  }

  projectByResourceID(projectId) {
    return Project.findFirst(this.db, {account_id: this.rowID});
  }

  findSyncState(where) {
    return SyncState.findOrCreate(this.db, {...where, account_id: this.rowID});
  }
}

PersistentObject.register(Account);
