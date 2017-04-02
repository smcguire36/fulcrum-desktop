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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class LocalDatabaseDataSource {
  constructor(account) {
    this.account = account;
    this.db = account.db;
    this.choiceLists = {};
    this.classificationSets = {};
    this.forms = {};
  }

  load(db) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.choiceLists = yield _this.loadObjects(db, _choiceList2.default);
      _this.classificationSets = yield _this.loadObjects(db, _classificationSet2.default);
      _this.forms = yield _this.loadObjects(db, _form2.default);
    })();
  }

  loadObjects(db, type) {
    return _asyncToGenerator(function* () {
      const objects = yield type.findAll(db);

      const map = {};

      for (const object of objects) {
        map[object.id] = object;
      }

      return map;
    })();
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
}
exports.default = LocalDatabaseDataSource;
//# sourceMappingURL=local-database-data-source.js.map