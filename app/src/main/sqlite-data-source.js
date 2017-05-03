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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3NxbGl0ZS1kYXRhLXNvdXJjZS5qcyJdLCJuYW1lcyI6WyJMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSIsImNvbnN0cnVjdG9yIiwiYWNjb3VudCIsImRiIiwiY2hvaWNlTGlzdHMiLCJjbGFzc2lmaWNhdGlvblNldHMiLCJmb3JtcyIsImxvYWQiLCJsb2FkT2JqZWN0cyIsInR5cGUiLCJvYmplY3RzIiwiZmluZEFsbCIsIm1hcCIsIm9iamVjdCIsImlkIiwiZ2V0Q2hvaWNlTGlzdCIsImNhbGxiYWNrIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXQiLCJnZXRGb3JtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsdUJBQU4sQ0FBOEI7QUFDM0NDLGNBQVlDLE9BQVosRUFBcUI7QUFDbkIsU0FBS0EsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0MsRUFBTCxHQUFVRCxRQUFRQyxFQUFsQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsRUFBbkI7QUFDQSxTQUFLQyxrQkFBTCxHQUEwQixFQUExQjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxFQUFiO0FBQ0Q7O0FBRUtDLE1BQU4sQ0FBV0osRUFBWCxFQUFlO0FBQUE7O0FBQUE7QUFDYixZQUFLQyxXQUFMLEdBQW1CLE1BQU0sTUFBS0ksV0FBTCxDQUFpQkwsRUFBakIsdUJBQXpCO0FBQ0EsWUFBS0Usa0JBQUwsR0FBMEIsTUFBTSxNQUFLRyxXQUFMLENBQWlCTCxFQUFqQiw4QkFBaEM7QUFDQSxZQUFLRyxLQUFMLEdBQWEsTUFBTSxNQUFLRSxXQUFMLENBQWlCTCxFQUFqQixpQkFBbkI7QUFIYTtBQUlkOztBQUVLSyxhQUFOLENBQWtCTCxFQUFsQixFQUFzQk0sSUFBdEIsRUFBNEI7QUFBQTtBQUMxQixZQUFNQyxVQUFVLE1BQU1ELEtBQUtFLE9BQUwsQ0FBYVIsRUFBYixDQUF0Qjs7QUFFQSxZQUFNUyxNQUFNLEVBQVo7O0FBRUEsV0FBSyxNQUFNQyxNQUFYLElBQXFCSCxPQUFyQixFQUE4QjtBQUM1QkUsWUFBSUMsT0FBT0MsRUFBWCxJQUFpQkQsTUFBakI7QUFDRDs7QUFFRCxhQUFPRCxHQUFQO0FBVDBCO0FBVTNCOztBQUVERyxnQkFBY0QsRUFBZCxFQUFrQkUsUUFBbEIsRUFBNEI7QUFDMUIsV0FBT0EsU0FBUyxJQUFULEVBQWUsS0FBS1osV0FBTCxDQUFpQlUsRUFBakIsQ0FBZixDQUFQO0FBQ0Q7O0FBRURHLHVCQUFxQkgsRUFBckIsRUFBeUJFLFFBQXpCLEVBQW1DO0FBQ2pDLFdBQU9BLFNBQVMsSUFBVCxFQUFlLEtBQUtYLGtCQUFMLENBQXdCUyxFQUF4QixDQUFmLENBQVA7QUFDRDs7QUFFREksVUFBUUosRUFBUixFQUFZRSxRQUFaLEVBQXNCO0FBQ3BCLFdBQU9BLFNBQVMsSUFBVCxFQUFlLEtBQUtWLEtBQUwsQ0FBV1EsRUFBWCxDQUFmLENBQVA7QUFDRDtBQXJDMEM7a0JBQXhCZCx1QiIsImZpbGUiOiJzcWxpdGUtZGF0YS1zb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRm9ybSBmcm9tICcuL21vZGVscy9mb3JtJztcbmltcG9ydCBDaG9pY2VMaXN0IGZyb20gJy4vbW9kZWxzL2Nob2ljZS1saXN0JztcbmltcG9ydCBDbGFzc2lmaWNhdGlvblNldCBmcm9tICcuL21vZGVscy9jbGFzc2lmaWNhdGlvbi1zZXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKGFjY291bnQpIHtcbiAgICB0aGlzLmFjY291bnQgPSBhY2NvdW50O1xuICAgIHRoaXMuZGIgPSBhY2NvdW50LmRiO1xuICAgIHRoaXMuY2hvaWNlTGlzdHMgPSB7fTtcbiAgICB0aGlzLmNsYXNzaWZpY2F0aW9uU2V0cyA9IHt9O1xuICAgIHRoaXMuZm9ybXMgPSB7fTtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoZGIpIHtcbiAgICB0aGlzLmNob2ljZUxpc3RzID0gYXdhaXQgdGhpcy5sb2FkT2JqZWN0cyhkYiwgQ2hvaWNlTGlzdCk7XG4gICAgdGhpcy5jbGFzc2lmaWNhdGlvblNldHMgPSBhd2FpdCB0aGlzLmxvYWRPYmplY3RzKGRiLCBDbGFzc2lmaWNhdGlvblNldCk7XG4gICAgdGhpcy5mb3JtcyA9IGF3YWl0IHRoaXMubG9hZE9iamVjdHMoZGIsIEZvcm0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZE9iamVjdHMoZGIsIHR5cGUpIHtcbiAgICBjb25zdCBvYmplY3RzID0gYXdhaXQgdHlwZS5maW5kQWxsKGRiKTtcblxuICAgIGNvbnN0IG1hcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBvYmplY3Qgb2Ygb2JqZWN0cykge1xuICAgICAgbWFwW29iamVjdC5pZF0gPSBvYmplY3Q7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIGdldENob2ljZUxpc3QoaWQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRoaXMuY2hvaWNlTGlzdHNbaWRdKTtcbiAgfVxuXG4gIGdldENsYXNzaWZpY2F0aW9uU2V0KGlkLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0aGlzLmNsYXNzaWZpY2F0aW9uU2V0c1tpZF0pO1xuICB9XG5cbiAgZ2V0Rm9ybShpZCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgdGhpcy5mb3Jtc1tpZF0pO1xuICB9XG59XG5cbiJdfQ==