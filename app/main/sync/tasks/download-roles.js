'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _role = require('../../models/role');

var _role2 = _interopRequireDefault(_role);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadRoles extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'roles');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' roles' });

      const response = yield _client2.default.getRoles(account);

      const objects = JSON.parse(response.body).roles;

      _this.progress({ message: _this.processing + ' roles', count: 0, total: objects.length });

      const localObjects = yield account.findRoles();

      _this.markDeletedObjects(localObjects, objects, 'role');

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _role2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        if (isChanged) {
          yield _this.trigger('role:save', { role: object });
        }

        _this.progress({ message: _this.processing + ' roles', count: index + 1, total: objects.length });
      }

      yield sync.update();

      _this.progress({ message: _this.finished + ' roles', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadRoles;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcm9sZXMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRSb2xlcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Um9sZXMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInJvbGVzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kUm9sZXMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsIl9kZWxldGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInJvbGUiLCJ1cGRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGFBQU4sd0JBQWlDO0FBQ3hDQyxLQUFOLENBQVUsRUFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQVYsRUFBaUM7QUFBQTs7QUFBQTtBQUMvQixZQUFNQyxPQUFPLE1BQU0sTUFBS0MsY0FBTCxDQUFvQkgsT0FBcEIsRUFBNkIsT0FBN0IsQ0FBbkI7O0FBRUEsVUFBSSxDQUFDRSxLQUFLRSxXQUFWLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBS0MsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS0MsV0FBTCxHQUFtQixRQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsUUFBUCxDQUFnQlQsT0FBaEIsQ0FBdkI7O0FBRUEsWUFBTVUsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsS0FBMUM7O0FBRUEsWUFBS1QsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixRQUE1QixFQUFzQ0MsT0FBTyxDQUE3QyxFQUFnREMsT0FBT1AsUUFBUVEsTUFBL0QsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0IsU0FBUixFQUEzQjs7QUFFQSxZQUFLQyxrQkFBTCxDQUF3QkYsWUFBeEIsRUFBc0NULE9BQXRDLEVBQStDLE1BQS9DOztBQUVBLFdBQUssSUFBSVksUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosUUFBUVEsTUFBcEMsRUFBNEMsRUFBRUksS0FBOUMsRUFBcUQ7QUFDbkQsY0FBTUMsYUFBYWIsUUFBUVksS0FBUixDQUFuQjs7QUFFQSxjQUFNRSxTQUFTLE1BQU0sZUFBS0MsWUFBTCxDQUFrQnpCLFFBQVEwQixFQUExQixFQUE4QixFQUFDQyxhQUFhSixXQUFXSyxFQUF6QixFQUE2QkMsWUFBWTdCLFFBQVE4QixLQUFqRCxFQUE5QixDQUFyQjs7QUFFQSxjQUFNQyxZQUFZLENBQUNQLE9BQU9RLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRVgsT0FBT1ksU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0FYLGVBQU9hLHVCQUFQLENBQStCZCxVQUEvQjs7QUFFQUMsZUFBT2MsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNZCxPQUFPZSxJQUFQLEVBQU47O0FBRUEsWUFBSVIsU0FBSixFQUFlO0FBQ2IsZ0JBQU0sTUFBS1MsT0FBTCxDQUFhLFdBQWIsRUFBMEIsRUFBQ0MsTUFBTWpCLE1BQVAsRUFBMUIsQ0FBTjtBQUNEOztBQUVELGNBQUtuQixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLFFBQTVCLEVBQXNDQyxPQUFPTSxRQUFRLENBQXJELEVBQXdETCxPQUFPUCxRQUFRUSxNQUF2RSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUt3QyxNQUFMLEVBQU47O0FBRUEsWUFBS3JDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtxQyxRQUFMLEdBQWdCLFFBQTFCLEVBQW9DM0IsT0FBT04sUUFBUVEsTUFBbkQsRUFBMkRELE9BQU9QLFFBQVFRLE1BQTFFLEVBQWQ7QUExQytCO0FBMkNoQztBQTVDNkM7a0JBQTNCcEIsYSIsImZpbGUiOiJkb3dubG9hZC1yb2xlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFJvbGUgZnJvbSAnLi4vLi4vbW9kZWxzL3JvbGUnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRSb2xlcyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3luYyA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgJ3JvbGVzJyk7XG5cbiAgICBpZiAoIXN5bmMubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyByb2xlcyd9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldFJvbGVzKGFjY291bnQpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkucm9sZXM7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIHJvbGVzJywgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgY29uc3QgbG9jYWxPYmplY3RzID0gYXdhaXQgYWNjb3VudC5maW5kUm9sZXMoKTtcblxuICAgIHRoaXMubWFya0RlbGV0ZWRPYmplY3RzKGxvY2FsT2JqZWN0cywgb2JqZWN0cywgJ3JvbGUnKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBSb2xlLmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG51bGw7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyb2xlOnNhdmUnLCB7cm9sZTogb2JqZWN0fSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgcm9sZXMnLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcbiAgICB9XG5cbiAgICBhd2FpdCBzeW5jLnVwZGF0ZSgpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgcm9sZXMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=