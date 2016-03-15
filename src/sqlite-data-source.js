import Form from './models/form';
import ChoiceList from './models/choice-list';
import ClassificationSet from './models/classification-set';

export default class SQLiteDataSource {
  constructor(account) {
    this.account = account;
    this.db = account.db;
    this.choiceLists = {};
    this.classificationSets = {};
    this.forms = {};
  }

  async load(db) {
    this.choiceLists = await this.loadObjects(db, ChoiceList);
    this.classificationSets = await this.loadObjects(db, ClassificationSet);
    this.forms = await this.loadObjects(db, Form);
  }

  async loadObjects(db, type) {
    const objects = await type.findAll(db);

    const map = {};

    for (const object of objects) {
      map[object.resourceID] = object;
    }

    return map;
  }

  // async findObject(id, type, cache) {
  //   if (cache[id]) {
  //     return cache[id];
  //   }

  //   cache[id] = type.findFirst(this.db, {resource_id: id});

  //   return cache[id];
  // }

  // getChoiceList(id) {
  //   return this.findObject(id, ChoiceList, this.choiceLists);
  // }

  // getClassificationSet(id) {
  //   return this.findObject(id, ClassificationSet, this.classificationSets);
  // }

  // getForm(id) {
  //   return this.findObject(id, Form, this.forms);
  // }

  getChoiceList(id, callback) {
    return callback(null, this.choiceLists[id]);
  }

  getClassificationSet(id, callback) {
    return callback(null, this.classificationSets[id]);
  }

  getForm(id, callback) {
    return callback(null, this.forms[id]);
  }
}

