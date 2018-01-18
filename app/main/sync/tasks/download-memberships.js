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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsImdldE1lbWJlcnNoaXBzIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZE1lbWJlcnNoaXBzIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwidXNlcl9yZXNvdXJjZV9pZCIsInVzZXJfaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJsb2FkT2JqZWN0Iiwib2JqZWN0IiwiZ2V0TG9jYWxSb2xlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsbUJBQU4sb0NBQW1EO0FBQ2hFLE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxZQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFFBQXZCLEVBQWlDO0FBQy9CLFdBQU8saUJBQU9DLGNBQVAsQ0FBc0IsS0FBS0MsT0FBM0IsQ0FBUDtBQUNEOztBQUVEQyxzQkFBb0I7QUFDbEIsV0FBTyxLQUFLRCxPQUFMLENBQWFFLGVBQWIsRUFBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLHFCQUFXRixZQUFYLENBQXdCQyxRQUF4QixFQUFrQyxFQUFDRSxrQkFBa0JELFdBQVdFLE9BQTlCLEVBQXVDQyxZQUFZLEtBQUtSLE9BQUwsQ0FBYVMsS0FBaEUsRUFBbEMsQ0FBUDtBQUNEOztBQUVLQyxZQUFOLENBQWlCQyxNQUFqQixFQUF5Qk4sVUFBekIsRUFBcUM7QUFBQTtBQUNuQyxZQUFNTSxPQUFPQyxZQUFQLEVBQU47QUFEbUM7QUFFcEM7QUF2QitEO2tCQUE3Q25CLG1CIiwiZmlsZSI6ImRvd25sb2FkLW1lbWJlcnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBNZW1iZXJzaGlwIGZyb20gJy4uLy4uL21vZGVscy9tZW1iZXJzaGlwJztcbmltcG9ydCBEb3dubG9hZFJlc291cmNlIGZyb20gJy4vZG93bmxvYWQtcmVzb3VyY2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZE1lbWJlcnNoaXBzIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdtZW1iZXJzaGlwcyc7XG4gIH1cblxuICBnZXQgdHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuICdtZW1iZXJzaGlwJztcbiAgfVxuXG4gIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldE1lbWJlcnNoaXBzKHRoaXMuYWNjb3VudCk7XG4gIH1cblxuICBmZXRjaExvY2FsT2JqZWN0cygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50LmZpbmRNZW1iZXJzaGlwcygpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIE1lbWJlcnNoaXAuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7dXNlcl9yZXNvdXJjZV9pZDogYXR0cmlidXRlcy51c2VyX2lkLCBhY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUR9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRPYmplY3Qob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgYXdhaXQgb2JqZWN0LmdldExvY2FsUm9sZSgpO1xuICB9XG59XG4iXX0=