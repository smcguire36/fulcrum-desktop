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

var _changeset = require('./models/changeset');

var _changeset2 = _interopRequireDefault(_changeset);

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
    var _this = this;

    return _asyncToGenerator(function* () {
      const objects = yield type.findAll(db, { account_id: _this.account.rowID });

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

  loadObject(db, type, id, handler) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const object = yield type.findFirst(db, { account_id: _this2.account.rowID, resource_id: id });

      if (handler) {
        handler(object);
      }

      return object;
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

  getChangeset(id, callback) {
    this.loadObject(this.db, _changeset2.default, id).then(object => {
      callback(null, object);
    });
  }
}
exports.default = LocalDatabaseDataSource;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlLmpzIl0sIm5hbWVzIjpbIkxvY2FsRGF0YWJhc2VEYXRhU291cmNlIiwiY29uc3RydWN0b3IiLCJhY2NvdW50IiwiZGIiLCJjaG9pY2VMaXN0cyIsImNsYXNzaWZpY2F0aW9uU2V0cyIsImZvcm1zIiwibWVtYmVyc2hpcHMiLCJwcm9qZWN0cyIsInJvbGVzIiwibG9hZCIsImxvYWRPYmplY3RzIiwidHlwZSIsImhhbmRsZXIiLCJvYmplY3RzIiwiZmluZEFsbCIsImFjY291bnRfaWQiLCJyb3dJRCIsIm1hcCIsIm9iamVjdCIsImlkIiwibG9hZE9iamVjdCIsImZpbmRGaXJzdCIsInJlc291cmNlX2lkIiwiaW52YWxpZGF0ZSIsImNvbGxlY3Rpb24iLCJsYXp5TG9hZCIsImNhbGxiYWNrIiwidGhlbiIsImdldFByb2plY3QiLCJnZXRDaG9pY2VMaXN0IiwiZ2V0Q2xhc3NpZmljYXRpb25TZXQiLCJnZXRGb3JtIiwiZ2V0VXNlciIsIl91c2VySUQiLCJnZXRSb2xlIiwiZ2V0Q2hhbmdlc2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSx1QkFBTixDQUE4QjtBQUMzQ0MsY0FBWUMsT0FBWixFQUFxQjtBQUNuQixTQUFLQSxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyxFQUFMLEdBQVVELFFBQVFDLEVBQWxCO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFNBQUtDLGtCQUFMLEdBQTBCLElBQTFCO0FBQ0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0Q7O0FBRUtDLE1BQU4sQ0FBV1AsRUFBWCxFQUFlO0FB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Qk4sRUFBdkIsa0JBQWlDLElBQWpDLEVBQXVDTyxRQUF2QyxDQUFQO0FBQ0Q7O0FBRURTLGVBQWFoQixFQUFiLEVBQWlCTyxRQUFqQixFQUEyQjtBQUN6QixTQUFLTixVQUFMLENBQWdCLEtBQUtsQixFQUFyQix1QkFBb0NpQixFQUFwQyxFQUF3Q1EsSUFBeEMsQ0FBOENULE1BQUQsSUFBWTtBQUN2RFEsZUFBUyxJQUFULEVBQWVSLE1BQWY7QUFDRCxLQUZEO0FBR0Q7QUF4RjBDO2tCQUF4Qm5CLHVCIiwiZmlsZSI6ImxvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZvcm0gZnJvbSAnLi9tb2RlbHMvZm9ybSc7XG5pbXBvcnQgQ2hvaWNlTGlzdCBmcm9tICcuL21vZGVscy9jaG9pY2UtbGlzdCc7XG5pbXBvcnQgQ2xhc3NpZmljYXRpb25TZXQgZnJvbSAnLi9tb2RlbHMvY2xhc3NpZmljYXRpb24tc2V0JztcbmltcG9ydCBNZW1iZXJzaGlwIGZyb20gJy4vbW9kZWxzL21lbWJlcnNoaXAnO1xuaW1wb3J0IFJvbGUgZnJvbSAnLi9tb2RlbHMvcm9sZSc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL21vZGVscy9wcm9qZWN0JztcbmltcG9ydCBDaGFuZ2VzZXQgZnJvbSAnLi9tb2RlbHMvY2hhbmdlc2V0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihhY2NvdW50KSB7XG4gICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICB0aGlzLmRiID0gYWNjb3VudC5kYjtcbiAgICB0aGlzLmNob2ljZUxpc3RzID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzaWZpY2F0aW9uU2V0cyA9IG51bGw7XG4gICAgdGhpcy5mb3JtcyA9IG51bGw7XG4gICAgdGhpcy5tZW1iZXJzaGlwcyA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0cyA9IG51bGw7XG4gICAgdGhpcy5yb2xlcyA9IG51bGw7XG4gIH1cblxuICBhc3luYyBsb2FkKGRiKSB7XG4gIH1cblxuICBhc3luYyBsb2FkT2JqZWN0cyhkYiwgdHlwZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IG9iamVjdHMgPSBhd2FpdCB0eXBlLmZpbmRBbGwoZGIsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUR9KTtcblxuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2Ygb2JqZWN0cykge1xuICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgaGFuZGxlcihtYXAsIG9iamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXBbb2JqZWN0LmlkXSA9IG9iamVjdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgYXN5bmMgbG9hZE9iamVjdChkYiwgdHlwZSwgaWQsIGhhbmRsZXIpIHtcbiAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0eXBlLmZpbmRGaXJzdChkYiwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGlkfSk7XG5cbiAgICBpZiAoaGFuZGxlcikge1xuICAgICAgaGFuZGxlcihvYmplY3QpO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBpbnZhbGlkYXRlKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzW2NvbGxlY3Rpb25dID0gbnVsbDtcbiAgfVxuXG4gIGxhenlMb2FkKGNvbGxlY3Rpb24sIGlkLCB0eXBlLCBoYW5kbGVyLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzW2NvbGxlY3Rpb25dID09IG51bGwpIHtcbiAgICAgIHRoaXMubG9hZE9iamVjdHModGhpcy5kYiwgdHlwZSwgaGFuZGxlcikudGhlbigob2JqZWN0cykgPT4ge1xuICAgICAgICB0aGlzW2NvbGxlY3Rpb25dID0gb2JqZWN0cztcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpc1tjb2xsZWN0aW9uXVtpZF0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCB0aGlzW2NvbGxlY3Rpb25dW2lkXSk7XG4gIH1cblxuICBnZXRQcm9qZWN0KGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdwcm9qZWN0cycsIGlkLCBQcm9qZWN0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRDaG9pY2VMaXN0KGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdjaG9pY2VMaXN0cycsIGlkLCBDaG9pY2VMaXN0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRDbGFzc2lmaWNhdGlvblNldChpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5sYXp5TG9hZCgnY2xhc3NpZmljYXRpb25TZXRzJywgaWQsIENsYXNzaWZpY2F0aW9uU2V0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRGb3JtKGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdmb3JtcycsIGlkLCBGb3JtLCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRVc2VyKGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdtZW1iZXJzaGlwcycsIGlkLCBNZW1iZXJzaGlwLCAobWFwLCBvYmplY3QpID0+IHtcbiAgICAgIG1hcFtvYmplY3QuX3VzZXJJRF0gPSBvYmplY3Q7XG4gICAgfSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0Um9sZShpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5sYXp5TG9hZCgncm9sZXMnLCBpZCwgUm9sZSwgbnVsbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0Q2hhbmdlc2V0KGlkLCBjYWxsYmFjaykge1xuICAgIHRoaXMubG9hZE9iamVjdCh0aGlzLmRiLCBDaGFuZ2VzZXQsIGlkKS50aGVuKChvYmplY3QpID0+IHtcbiAgICAgIGNhbGxiYWNrKG51bGwsIG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn1cblxuIl19