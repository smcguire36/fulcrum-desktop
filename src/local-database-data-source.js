import Form from './models/form';
import ChoiceList from './models/choice-list';
import ClassificationSet from './models/classification-set';
import Memberships from './models/membership';
import Role from './models/role';
import Project from './models/project';

export default class LocalDatabaseDataSource {
  constructor(account) {
    this.account = account;
    this.db = account.db;
    this.choiceLists = {};
    this.classificationSets = {};
    this.forms = {};
    this.memberships = {};
    this.roles = {};
  }

  async load(db) {
    this.choiceLists = await this.loadObjects(db, ChoiceList);
    this.classificationSets = await this.loadObjects(db, ClassificationSet);
    this.forms = await this.loadObjects(db, Form);
    this.role = await this.loadObjects(db, Role);
    this.projects = await this.loadObjects(db, Project);
    this.memberships = await this.loadObjects(db, Memberships, (map, object) => {
      map[object._userID] = object;
    });
  }

  async loadObjects(db, type, handler) {
    const objects = await type.findAll(db);

    const map = {};

    for (const object of objects) {
      if (handler) {
        handler(map, object);
      } else {
        map[object.id] = object;
      }
    }

    return map;
  }

  getProject(id, callback) {
    return callback(null, this.projects[id]);
  }

  getChoiceList(id, callback) {
    return callback(null, this.choiceLists[id]);
  }

  getClassificationSet(id, callback) {
    return callback(null, this.classificationSets[id]);
  }

  getForm(id, callback) {
    return callback(null, this.forms[id]);
  }

  getUser(id, callback) {
    return callback(null, this.memberships[id]);
  }

  getRole(id, callback) {
    return callback(null, this.roles[id]);
  }
}

