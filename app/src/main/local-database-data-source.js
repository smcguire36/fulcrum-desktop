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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlLmpzIl0sIm5hbWVzIjpbIkxvY2FsRGF0YWJhc2VEYXRhU291cmNlIiwiY29uc3RydWN0b3IiLCJhY2NvdW50IiwiZGIiLCJjaG9pY2VMaXN0cyIsImNsYXNzaWZpY2F0aW9uU2V0cyIsImZvcm1zIiwibWVtYmVyc2hpcHMiLCJwcm9qZWN0cyIsInJvbGVzIiwibG9hZCIsImxvYWRPYmplY3RzIiwidHlwZSIsImhhbmRsZXIiLCJvYmplY3RzIiwiZmluZEFsbCIsIm1hcCIsIm9iamVjdCIsImlkIiwiaW52YWxpZGF0ZSIsImNvbGxlY3Rpb24iLCJsYXp5TG9hZCIsImNhbGxiYWNrIiwidGhlbiIsImdldFByb2plY3QiLCJnZXRDaG9pY2VMaXN0IiwiZ2V0Q2xhc3NpZmljYXRpb25TZXQiLCJnZXRGb3JtIiwiZ2V0VXNlciIsIl91c2VySUQiLCJnZXRSb2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsdUJBQU4sQ0FBOEI7QUFDM0NDLGNBQVlDLE9BQVosRUFBcUI7QUFDbkIsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsRUFBTCxHQUFVRCxRQUFRQyxFQUFsQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxJQUFiO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQixJQUFuQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxTQUFLQyxLQUFMLEdBQWEsSUFBYjtBQUNEOztBQUVLQyxNQUFOLENBQVdQLEVBQVgsRUFBZTtBQUFBO0FBQ2Q7O0FBRUtRLGFBQU4sQ0FBa0JSLEVBQWxCLEVBQXNCUyxJQUF0QixFQUE0QkMsT0FBNUIsRUFBcUM7QUFBQTtBQUNuQyxZQUFNQyxVQUFVLE1BQU1GLEtBQUtHLE9BQUwsQ0FBYVosRUFBYixDQUF0Qjs7QUFFQSxZQUFNYSxNQUFNLEVBQVo7O0FBRUEsV0FBSyxNQUFNQyxNQUFYLElBQXFCSCxPQUFyQixFQUE4QjtBQUM1QixZQUFJRCxPQUFKLEVBQWE7QUFDWEEsa0JBQVFHLEdBQVIsRUFBYUMsTUFBYjtBQUNELFNBRkQsTUFFTztBQUNMRCxjQUFJQyxPQUFPQyxFQUFYLElBQWlCRCxNQUFqQjtBQUNEO0FBQ0Y7O0FBRUQsYUFBT0QsR0FBUDtBQWJtQztBQWNwQzs7QUFFREcsYUFBV0MsVUFBWCxFQUF1QjtBQUNyQixTQUFLQSxVQUFMLElBQW1CLElBQW5CO0FBQ0Q7O0FBRURDLFdBQVNELFVBQVQsRUFBcUJGLEVBQXJCLEVBQXlCTixJQUF6QixFQUErQkMsT0FBL0IsRUFBd0NTLFFBQXhDLEVBQWtEO0FBQ2hELFFBQUksS0FBS0YsVUFBTCxLQUFvQixJQUF4QixFQUE4QjtBQUM1QixXQUFLVCxXQUFMLENBQWlCLEtBQUtSLEVBQXRCLEVBQTBCUyxJQUExQixFQUFnQ0MsT0FBaEMsRUFBeUNVLElBQXpDLENBQStDVCxPQUFELElBQWE7QUFDekQsYUFBS00sVUFBTCxJQUFtQk4sT0FBbkI7QUFDQVEsaUJBQVMsSUFBVCxFQUFlLEtBQUtGLFVBQUwsRUFBaUJGLEVBQWpCLENBQWY7QUFDRCxPQUhEOztBQUtBO0FBQ0Q7O0FBRURJLGFBQVMsSUFBVCxFQUFlLEtBQUtGLFVBQUwsRUFBaUJGLEVBQWpCLENBQWY7QUFDRDs7QUFFRE0sYUFBV04sRUFBWCxFQUFlSSxRQUFmLEVBQXlCO0FBQ3ZCLFdBQU8sS0FBS0QsUUFBTCxDQUFjLFVBQWQsRUFBMEJILEVBQTFCLHFCQUF1QyxJQUF2QyxFQUE2Q0ksUUFBN0MsQ0FBUDtBQUNEOztBQUVERyxnQkFBY1AsRUFBZCxFQUFrQkksUUFBbEIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLRCxRQUFMLENBQWMsYUFBZCxFQUE2QkgsRUFBN0Isd0JBQTZDLElBQTdDLEVBQW1ESSxRQUFuRCxDQUFQO0FBQ0Q7O0FBRURJLHVCQUFxQlIsRUFBckIsRUFBeUJJLFFBQXpCLEVBQW1DO0FBQ2pDLFdBQU8sS0FBS0QsUUFBTCxDQUFjLG9CQUFkLEVBQW9DSCxFQUFwQywrQkFBMkQsSUFBM0QsRUFBaUVJLFFBQWpFLENBQVA7QUFDRDs7QUFFREssVUFBUVQsRUFBUixFQUFZSSxRQUFaLEVBQXNCO0FBQ3BCLFdBQU8sS0FBS0QsUUFBTCxDQUFjLE9BQWQsRUFBdUJILEVBQXZCLGtCQUFpQyxJQUFqQyxFQUF1Q0ksUUFBdkMsQ0FBUDtBQUNEOztBQUVETSxVQUFRVixFQUFSLEVBQVlJLFFBQVosRUFBc0I7QUFDcEIsV0FBTyxLQUFLRCxRQUFMLENBQWMsYUFBZCxFQUE2QkgsRUFBN0Isd0JBQTZDLENBQUNGLEdBQUQsRUFBTUMsTUFBTixLQUFpQjtBQUNuRUQsVUFBSUMsT0FBT1ksT0FBWCxJQUFzQlosTUFBdEI7QUFDRCxLQUZNLEVBRUpLLFFBRkksQ0FBUDtBQUdEOztBQUVEUSxVQUFRWixFQUFSLEVBQVlJLFFBQVosRUFBc0I7QUFDcEIsV0FBTyxLQUFLRCxRQUFMLENBQWMsT0FBZCxFQUF1QkgsRUFBdkIsa0JBQWlDLElBQWpDLEVBQXVDSSxRQUF2QyxDQUFQO0FBQ0Q7QUF4RTBDO2tCQUF4QnRCLHVCIiwiZmlsZSI6ImxvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEZvcm0gZnJvbSAnLi9tb2RlbHMvZm9ybSc7XG5pbXBvcnQgQ2hvaWNlTGlzdCBmcm9tICcuL21vZGVscy9jaG9pY2UtbGlzdCc7XG5pbXBvcnQgQ2xhc3NpZmljYXRpb25TZXQgZnJvbSAnLi9tb2RlbHMvY2xhc3NpZmljYXRpb24tc2V0JztcbmltcG9ydCBNZW1iZXJzaGlwIGZyb20gJy4vbW9kZWxzL21lbWJlcnNoaXAnO1xuaW1wb3J0IFJvbGUgZnJvbSAnLi9tb2RlbHMvcm9sZSc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL21vZGVscy9wcm9qZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihhY2NvdW50KSB7XG4gICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudDtcbiAgICB0aGlzLmRiID0gYWNjb3VudC5kYjtcbiAgICB0aGlzLmNob2ljZUxpc3RzID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzaWZpY2F0aW9uU2V0cyA9IG51bGw7XG4gICAgdGhpcy5mb3JtcyA9IG51bGw7XG4gICAgdGhpcy5tZW1iZXJzaGlwcyA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0cyA9IG51bGw7XG4gICAgdGhpcy5yb2xlcyA9IG51bGw7XG4gIH1cblxuICBhc3luYyBsb2FkKGRiKSB7XG4gIH1cblxuICBhc3luYyBsb2FkT2JqZWN0cyhkYiwgdHlwZSwgaGFuZGxlcikge1xuICAgIGNvbnN0IG9iamVjdHMgPSBhd2FpdCB0eXBlLmZpbmRBbGwoZGIpO1xuXG4gICAgY29uc3QgbWFwID0ge307XG5cbiAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBvYmplY3RzKSB7XG4gICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICBoYW5kbGVyKG1hcCwgb2JqZWN0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcFtvYmplY3QuaWRdID0gb2JqZWN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYXA7XG4gIH1cblxuICBpbnZhbGlkYXRlKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzW2NvbGxlY3Rpb25dID0gbnVsbDtcbiAgfVxuXG4gIGxhenlMb2FkKGNvbGxlY3Rpb24sIGlkLCB0eXBlLCBoYW5kbGVyLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzW2NvbGxlY3Rpb25dID09IG51bGwpIHtcbiAgICAgIHRoaXMubG9hZE9iamVjdHModGhpcy5kYiwgdHlwZSwgaGFuZGxlcikudGhlbigob2JqZWN0cykgPT4ge1xuICAgICAgICB0aGlzW2NvbGxlY3Rpb25dID0gb2JqZWN0cztcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdGhpc1tjb2xsZWN0aW9uXVtpZF0pO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWxsYmFjayhudWxsLCB0aGlzW2NvbGxlY3Rpb25dW2lkXSk7XG4gIH1cblxuICBnZXRQcm9qZWN0KGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdwcm9qZWN0cycsIGlkLCBQcm9qZWN0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRDaG9pY2VMaXN0KGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdjaG9pY2VMaXN0cycsIGlkLCBDaG9pY2VMaXN0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRDbGFzc2lmaWNhdGlvblNldChpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5sYXp5TG9hZCgnY2xhc3NpZmljYXRpb25TZXRzJywgaWQsIENsYXNzaWZpY2F0aW9uU2V0LCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRGb3JtKGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdmb3JtcycsIGlkLCBGb3JtLCBudWxsLCBjYWxsYmFjayk7XG4gIH1cblxuICBnZXRVc2VyKGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmxhenlMb2FkKCdtZW1iZXJzaGlwcycsIGlkLCBNZW1iZXJzaGlwLCAobWFwLCBvYmplY3QpID0+IHtcbiAgICAgIG1hcFtvYmplY3QuX3VzZXJJRF0gPSBvYmplY3Q7XG4gICAgfSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZ2V0Um9sZShpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5sYXp5TG9hZCgncm9sZXMnLCBpZCwgUm9sZSwgbnVsbCwgY2FsbGJhY2spO1xuICB9XG59XG5cbiJdfQ==