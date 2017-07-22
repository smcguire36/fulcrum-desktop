'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _classificationSet = require('../../models/classification-set');

var _classificationSet2 = _interopRequireDefault(_classificationSet);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadClassificationSets extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'classification_sets');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' classification sets' });

      const response = yield _client2.default.getClassificationSets(account);

      const objects = JSON.parse(response.body).classification_sets;

      _this.progress({ message: _this.processing + ' classification sets', count: 0, total: objects.length });

      const localObjects = yield account.findClassificationSets();

      _this.markDeletedObjects(localObjects, objects, 'classification-set', 'classificationSet');

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _classificationSet2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        if (isChanged) {
          yield _this.trigger('classification-set:save', { classificationSet: object });
        }

        _this.progress({ message: _this.processing + ' classification sets', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('classificationSets');

      _this.progress({ message: _this.finished + ' classification sets', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadClassificationSets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2xhc3NpZmljYXRpb24tc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwib2JqZWN0cyIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJjbGFzc2lmaWNhdGlvbl9zZXRzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kQ2xhc3NpZmljYXRpb25TZXRzIiwibWFya0RlbGV0ZWRPYmplY3RzIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwiZGIiLCJyZXNvdXJjZV9pZCIsImlkIiwiYWNjb3VudF9pZCIsInJvd0lEIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsInRyaWdnZXIiLCJjbGFzc2lmaWNhdGlvblNldCIsInVwZGF0ZSIsInNvdXJjZSIsImludmFsaWRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLDBCQUFOLHdCQUE4QztBQUNyREMsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLHFCQUE3QixDQUFuQjs7QUFFQSxVQUFJLENBQUNFLEtBQUtFLFdBQVYsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFLQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLQyxXQUFMLEdBQW1CLHNCQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MscUJBQVAsQ0FBNkJULE9BQTdCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLG1CQUExQzs7QUFFQSxZQUFLVCxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLHNCQUE1QixFQUFvREMsT0FBTyxDQUEzRCxFQUE4REMsT0FBT1AsUUFBUVEsTUFBN0UsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0Isc0JBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0QyxFQUErQyxvQkFBL0MsRUFBcUUsbUJBQXJFOztBQUVBLFdBQUssSUFBSVksUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosUUFBUVEsTUFBcEMsRUFBNEMsRUFBRUksS0FBOUMsRUFBcUQ7QUFDbkQsY0FBTUMsYUFBYWIsUUFBUVksS0FBUixDQUFuQjs7QUFFQSxjQUFNRSxTQUFTLE1BQU0sNEJBQWtCQyxZQUFsQixDQUErQnpCLFFBQVEwQixFQUF2QyxFQUEyQyxFQUFDQyxhQUFhSixXQUFXSyxFQUF6QixFQUE2QkMsWUFBWTdCLFFBQVE4QixLQUFqRCxFQUEzQyxDQUFyQjs7QUFFQSxjQUFNQyxZQUFZLENBQUNQLE9BQU9RLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRVgsT0FBT1ksU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0FYLGVBQU9hLHVCQUFQLENBQStCZCxVQUEvQjs7QUFFQUMsZUFBT2MsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNZCxPQUFPZSxJQUFQLEVBQU47O0FBRUEsWUFBSVIsU0FBSixFQUFlO0FBQ2IsZ0JBQU0sTUFBS1MsT0FBTCxDQUFhLHlCQUFiLEVBQXdDLEVBQUNDLG1CQUFtQmpCLE1BQXBCLEVBQXhDLENBQU47QUFDRDs7QUFFRCxjQUFLbkIsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixzQkFBNUIsRUFBb0RDLE9BQU9NLFFBQVEsQ0FBbkUsRUFBc0VMLE9BQU9QLFFBQVFRLE1BQXJGLEVBQWQ7QUFDRDs7QUFFRCxZQUFNaEIsS0FBS3dDLE1BQUwsRUFBTjs7QUFFQXpDLGlCQUFXMEMsTUFBWCxDQUFrQkMsVUFBbEIsQ0FBNkIsb0JBQTdCOztBQUVBLFlBQUt2QyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLdUMsUUFBTCxHQUFnQixzQkFBMUIsRUFBa0Q3QixPQUFPTixRQUFRUSxNQUFqRSxFQUF5RUQsT0FBT1AsUUFBUVEsTUFBeEYsRUFBZDtBQTVDK0I7QUE2Q2hDO0FBOUMwRDtrQkFBeENwQiwwQiIsImZpbGUiOiJkb3dubG9hZC1jbGFzc2lmaWNhdGlvbi1zZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgQ2xhc3NpZmljYXRpb25TZXQgZnJvbSAnLi4vLi4vbW9kZWxzL2NsYXNzaWZpY2F0aW9uLXNldCc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3luYyA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgJ2NsYXNzaWZpY2F0aW9uX3NldHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGNsYXNzaWZpY2F0aW9uIHNldHMnfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRDbGFzc2lmaWNhdGlvblNldHMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5jbGFzc2lmaWNhdGlvbl9zZXRzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBjbGFzc2lmaWNhdGlvbiBzZXRzJywgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgY29uc3QgbG9jYWxPYmplY3RzID0gYXdhaXQgYWNjb3VudC5maW5kQ2xhc3NpZmljYXRpb25TZXRzKCk7XG5cbiAgICB0aGlzLm1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG9iamVjdHMsICdjbGFzc2lmaWNhdGlvbi1zZXQnLCAnY2xhc3NpZmljYXRpb25TZXQnKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBDbGFzc2lmaWNhdGlvblNldC5maW5kT3JDcmVhdGUoYWNjb3VudC5kYiwge3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkLCBhY2NvdW50X2lkOiBhY2NvdW50LnJvd0lEfSk7XG5cbiAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcignY2xhc3NpZmljYXRpb24tc2V0OnNhdmUnLCB7Y2xhc3NpZmljYXRpb25TZXQ6IG9iamVjdH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIGNsYXNzaWZpY2F0aW9uIHNldHMnLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcbiAgICB9XG5cbiAgICBhd2FpdCBzeW5jLnVwZGF0ZSgpO1xuXG4gICAgZGF0YVNvdXJjZS5zb3VyY2UuaW52YWxpZGF0ZSgnY2xhc3NpZmljYXRpb25TZXRzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBjbGFzc2lmaWNhdGlvbiBzZXRzJywgY291bnQ6IG9iamVjdHMubGVuZ3RoLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcbiAgfVxufVxuIl19