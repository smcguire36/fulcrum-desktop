'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _form = require('./models/form');

var _form2 = _interopRequireDefault(_form);

var _choiceList = require('./models/choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

var _classificationSet = require('./models/classification-set');

var _classificationSet2 = _interopRequireDefault(_classificationSet);

var _membership = require('./models/membership');

var _membership2 = _interopRequireDefault(_membership);

var _role = require('./models/role');

var _role2 = _interopRequireDefault(_role);

var _project = require('./models/project');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class LocalDatabaseDataSource {
  constructor(account) {
    this.account = account;
    this.db = account.db;
    this.choiceLists = null;
    this.classificationSets = null;
    this.forms = null;
    this.memberships = null;
    this.projects = null;
    this.roles = null;
  }

  load(db) {
    return _asyncToGenerator(function* () {})();
  }

  loadObjects(db, type, handler) {
    return _asyncToGenerator(function* () {
      const objects = yield type.findAll(db);

      const map = {};

      for (const object of objects) {
        if (handler) {
          handler(map, object);
        } else {
          map[object.id] = object;
        }
      }

      return map;
    })();
  }

  invalidate(collection) {
    this[collection] = null;
  }

  lazyLoad(collection, id, type, handler, callback) {
    if (this[collection] == null) {
      this.loadObjects(this.db, type, handler).then(objects => {
        this[collection] = objects;
        callback(null, this[collection][id]);
      });

      return;
    }

    callback(null, this[collection][id]);
  }

  getProject(id, callback) {
    return this.lazyLoad('projects', id, _project2.default, null, callback);
  }

  getChoiceList(id, callback) {
    return this.lazyLoad('choiceLists', id, _choiceList2.default, null, callback);
  }

  getClassificationSet(id, callback) {
    return this.lazyLoad('classificationSets', id, _classificationSet2.default, null, callback);
  }

  getForm(id, callback) {
    return this.lazyLoad('forms', id, _form2.default, null, callback);
  }

  getUser(id, callback) {
    return this.lazyLoad('memberships', id, _membership2.default, (map, object) => {
      map[object._userID] = object;
    }, callback);
  }

  getRole(id, callback) {
    return this.lazyLoad('roles', id, _role2.default, null, callback);
  }
}
exports.default = LocalDatabaseDataSource;
//# sourceMappingURL=local-database-data-source.js.map