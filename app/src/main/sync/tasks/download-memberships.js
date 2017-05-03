'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _membership = require('../../models/membership');

var _membership2 = _interopRequireDefault(_membership);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadMemberships extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'memberships');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' memberships' });

      const response = yield _client2.default.getMemberships(account);

      const objects = JSON.parse(response.body).memberships;

      _this.progress({ message: _this.processing + ' memberships', count: 0, total: objects.length });

      const localObjects = yield account.findMemberships();

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _membership2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        yield object.getLocalRole();

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' memberships', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('memberships');

      _this.progress({ message: _this.finished + ' memberships', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadMemberships;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0TWVtYmVyc2hpcHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsIm1lbWJlcnNoaXBzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kTWVtYmVyc2hpcHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImdldExvY2FsUm9sZSIsIl9kZWxldGVkQXQiLCJzYXZlIiwidXBkYXRlIiwic291cmNlIiwiaW52YWxpZGF0ZSIsImZpbmlzaGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsbUJBQU4sd0JBQXVDO0FBQzlDQyxLQUFOLENBQVUsRUFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQVYsRUFBaUM7QUFBQTs7QUFBQTtBQUMvQixZQUFNQyxPQUFPLE1BQU0sTUFBS0MsY0FBTCxDQUFvQkgsT0FBcEIsRUFBNkIsYUFBN0IsQ0FBbkI7O0FBRUEsVUFBSSxDQUFDRSxLQUFLRSxXQUFWLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBS0MsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS0MsV0FBTCxHQUFtQixjQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsY0FBUCxDQUFzQlQsT0FBdEIsQ0FBdkI7O0FBRUEsWUFBTVUsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsV0FBMUM7O0FBRUEsWUFBS1QsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixjQUE1QixFQUE0Q0MsT0FBTyxDQUFuRCxFQUFzREMsT0FBT1AsUUFBUVEsTUFBckUsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0IsZUFBUixFQUEzQjs7QUFFQSxZQUFLQyxrQkFBTCxDQUF3QkYsWUFBeEIsRUFBc0NULE9BQXRDOztBQUVBLFdBQUssSUFBSVksUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosUUFBUVEsTUFBcEMsRUFBNEMsRUFBRUksS0FBOUMsRUFBcUQ7QUFDbkQsY0FBTUMsYUFBYWIsUUFBUVksS0FBUixDQUFuQjs7QUFFQSxjQUFNRSxTQUFTLE1BQU0scUJBQVdDLFlBQVgsQ0FBd0J6QixRQUFRMEIsRUFBaEMsRUFBb0MsRUFBQ0MsYUFBYUosV0FBV0ssRUFBekIsRUFBNkJDLFlBQVk3QixRQUFROEIsS0FBakQsRUFBcEMsQ0FBckI7O0FBRUFOLGVBQU9PLHVCQUFQLENBQStCUixVQUEvQjs7QUFFQSxjQUFNQyxPQUFPUSxZQUFQLEVBQU47O0FBRUFSLGVBQU9TLFVBQVAsR0FBb0IsSUFBcEI7O0FBRUEsY0FBTVQsT0FBT1UsSUFBUCxFQUFOOztBQUVBLGNBQUs3QixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLGNBQTVCLEVBQTRDQyxPQUFPTSxRQUFRLENBQTNELEVBQThETCxPQUFPUCxRQUFRUSxNQUE3RSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUtpQyxNQUFMLEVBQU47O0FBRUFsQyxpQkFBV21DLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLGFBQTdCOztBQUVBLFlBQUtoQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLZ0MsUUFBTCxHQUFnQixjQUExQixFQUEwQ3RCLE9BQU9OLFFBQVFRLE1BQXpELEVBQWlFRCxPQUFPUCxRQUFRUSxNQUFoRixFQUFkO0FBdkMrQjtBQXdDaEM7QUF6Q21EO2tCQUFqQ3BCLG1CIiwiZmlsZSI6ImRvd25sb2FkLW1lbWJlcnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgTWVtYmVyc2hpcCBmcm9tICcuLi8uLi9tb2RlbHMvbWVtYmVyc2hpcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkTWVtYmVyc2hpcHMgZXh0ZW5kcyBUYXNrIHtcbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN5bmMgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsICdtZW1iZXJzaGlwcycpO1xuXG4gICAgaWYgKCFzeW5jLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgbWVtYmVyc2hpcHMnfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRNZW1iZXJzaGlwcyhhY2NvdW50KTtcblxuICAgIGNvbnN0IG9iamVjdHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpLm1lbWJlcnNoaXBzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGNvbnN0IGxvY2FsT2JqZWN0cyA9IGF3YWl0IGFjY291bnQuZmluZE1lbWJlcnNoaXBzKCk7XG5cbiAgICB0aGlzLm1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG9iamVjdHMpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IE1lbWJlcnNoaXAuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZCwgYWNjb3VudF9pZDogYWNjb3VudC5yb3dJRH0pO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5nZXRMb2NhbFJvbGUoKTtcblxuICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIG1lbWJlcnNoaXBzJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ21lbWJlcnNoaXBzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gIH1cbn1cbiJdfQ==