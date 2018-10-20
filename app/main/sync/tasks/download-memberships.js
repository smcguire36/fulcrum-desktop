'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _membership = require('../../models/membership');

var _membership2 = _interopRequireDefault(_membership);

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadMemberships extends _downloadResource2.default {
  get resourceName() {
    return 'memberships';
  }

  get typeName() {
    return 'membership';
  }

  fetchObjects(lastSync, sequence) {
    return _client2.default.getMemberships(this.account);
  }

  fetchLocalObjects() {
    return this.account.findMemberships();
  }

  findOrCreate(database, attributes) {
    return _membership2.default.findOrCreate(database, { user_resource_id: attributes.user_id, account_id: this.account.rowID });
  }

  loadObject(object, attributes) {
    return _asyncToGenerator(function* () {
      yield object.getLocalRole();
    })();
  }
}
exports.default = DownloadMemberships;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsImdldE1lbWJlcnNoaXBzIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZE1lbWJlcnNoaXBzIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwidXNlcl9yZXNvdXJjZV9pZCIsInVzZXJfaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJsb2FkT2JqZWN0Iiwib2JqZWN0IiwiZ2V0TG9jYWxSb2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsbUJBQU4sb0NBQW1EO0FBQ2hFLE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxZQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFFBQXZCLEVBQWlDO0FBQy9CLFdBQU8saUJBQU9DLGNBQVAsQ0FBc0IsS0FBS0MsT0FBM0IsQ0FBUDtBQUNEOztBQUVEQyxzQkFBb0I7QUFDbEIsV0FBTyxLQUFLRCxPQUFMLENBQWFFLGVBQWIsRUFBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLHFCQUFXRixZQUFYLENBQXdCQyxRQUF4QixFQUFrQyxFQUFDRSxrQkFBa0JELFdBQVdFLE9BQTlCLEVBQXVDQyxZQUFZLEtBQUtSLE9BQUwsQ0FBYVMsS0FBaEUsRUFBbEMsQ0FBUDtBQUNEOztBQUVLQyxZQUFOLENBQWlCQyxNQUFqQixFQUF5Qk4sVUFBekIsRUFBcUM7QUFBQTtBQUNuQyxZQUFNTSxPQUFPQyxZQUFQLEVBQU47QUFEbUM7QUFFcEM7QUF2QitEO2tCQUE3Q25CLG1CIiwiZmlsZSI6ImRvd25sb2FkLW1lbWJlcnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcclxuaW1wb3J0IE1lbWJlcnNoaXAgZnJvbSAnLi4vLi4vbW9kZWxzL21lbWJlcnNoaXAnO1xyXG5pbXBvcnQgRG93bmxvYWRSZXNvdXJjZSBmcm9tICcuL2Rvd25sb2FkLXJlc291cmNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkTWVtYmVyc2hpcHMgZXh0ZW5kcyBEb3dubG9hZFJlc291cmNlIHtcclxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xyXG4gICAgcmV0dXJuICdtZW1iZXJzaGlwcyc7XHJcbiAgfVxyXG5cclxuICBnZXQgdHlwZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gJ21lbWJlcnNoaXAnO1xyXG4gIH1cclxuXHJcbiAgZmV0Y2hPYmplY3RzKGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xyXG4gICAgcmV0dXJuIENsaWVudC5nZXRNZW1iZXJzaGlwcyh0aGlzLmFjY291bnQpO1xyXG4gIH1cclxuXHJcbiAgZmV0Y2hMb2NhbE9iamVjdHMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50LmZpbmRNZW1iZXJzaGlwcygpO1xyXG4gIH1cclxuXHJcbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XHJcbiAgICByZXR1cm4gTWVtYmVyc2hpcC5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHt1c2VyX3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnVzZXJfaWQsIGFjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZE9iamVjdChvYmplY3QsIGF0dHJpYnV0ZXMpIHtcclxuICAgIGF3YWl0IG9iamVjdC5nZXRMb2NhbFJvbGUoKTtcclxuICB9XHJcbn1cclxuIl19