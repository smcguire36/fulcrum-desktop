import Base from './base';
import Project from './project';
import Form from './form';

export default class Account extends Base {
  static get tableName() {
    return 'accounts';
  }

  static get columns() {
    return [
      { name: 'userResourceID', column: 'user_resource_id', type: 'integer', null: false },
      { name: 'organizationResourceID', column: 'organization_resource_id', type: 'string', null: false },
      { name: 'organizationName', column: 'organization_name', type: 'string', null: false },
      { name: 'email', column: 'email', type: 'string', null: false },
      { name: 'firstName', column: 'first_name', type: 'string' },
      { name: 'lastName', column: 'last_name', type: 'string' },
      { name: 'token', column: 'token', type: 'string' }
    ];
  }

  static findByUserAndOrganization(userID, organizationID, callback) {
    return Base.findFirst(Account, {
      user_resource_id: userID,
      organization_resource_id: organizationID
    }, callback);
  }

  findForms(where) {
    return Form.findAll(this.db, Object.assign({}, where, {account_id: this.id}), 'name ASC');
  }

  projectByResourceID(projectId) {
    return Project.findFirst(this.db, {account_id: this.id});
  }
}

Base.register(Account);
