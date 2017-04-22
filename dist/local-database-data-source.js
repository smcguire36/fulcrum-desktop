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
    this.choiceLists = {};
    this.classificationSets = {};
    this.forms = {};
    this.memberships = {};
    this.roles = {};
  }

  load(db) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.choiceLists = yield _this.loadObjects(db, _choiceList2.default);
      _this.classificationSets = yield _this.loadObjects(db, _classificationSet2.default);
      _this.forms = yield _this.loadObjects(db, _form2.default);
      _this.role = yield _this.loadObjects(db, _role2.default);
      _this.projects = yield _this.loadObjects(db, _project2.default);
      _this.memberships = yield _this.loadObjects(db, _membership2.default, function (map, object) {
        map[object._userID] = object;
      });
    })();
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
exports.default = LocalDatabaseDataSource;
//# sourceMappingURL=local-database-data-source.js.map