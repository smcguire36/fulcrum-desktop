import Base from './base';

export default class Project extends Base {
  // constructor(db, attributes) {
  //   this.initializePersistentObject(db, attributes);
  // }

  static get tableName() {
    return 'projects';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
  }
}

Base.register(Project);
