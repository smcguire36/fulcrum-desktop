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

var _fulcrumCore = require('fulcrum-core');

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

      _this.markDeletedObjects(localObjects, objects, 'membership');

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _membership2.default.findOrCreate(account.db, { user_resource_id: attributes.user_id, account_id: account.rowID });

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

        object.updateFromAPIAttributes(attributes);

        yield object.getLocalRole();

        object._deletedAt = null;

        yield object.save();

        if (isChanged) {
          yield _this.trigger('membership:save', { membership: object });
        }

        _this.progress({ message: _this.processing + ' memberships', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('memberships');

      _this.progress({ message: _this.finished + ' memberships', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadMemberships;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0TWVtYmVyc2hpcHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsIm1lbWJlcnNoaXBzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kTWVtYmVyc2hpcHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInVzZXJfcmVzb3VyY2VfaWQiLCJ1c2VyX2lkIiwiYWNjb3VudF9pZCIsInJvd0lEIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJnZXRMb2NhbFJvbGUiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsInRyaWdnZXIiLCJtZW1iZXJzaGlwIiwidXBkYXRlIiwic291cmNlIiwiaW52YWxpZGF0ZSIsImZpbmlzaGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsbUJBQU4sd0JBQXVDO0FBQzlDQyxLQUFOLENBQVUsRUFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQVYsRUFBaUM7QUFBQTs7QUFBQTtBQUMvQixZQUFNQyxPQUFPLE1BQU0sTUFBS0MsY0FBTCxDQUFvQkgsT0FBcEIsRUFBNkIsYUFBN0IsQ0FBbkI7O0FBRUEsVUFBSSxDQUFDRSxLQUFLRSxXQUFWLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBS0MsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS0MsV0FBTCxHQUFtQixjQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsY0FBUCxDQUFzQlQsT0FBdEIsQ0FBdkI7O0FBRUEsWUFBTVUsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsV0FBMUM7O0FBRUEsWUFBS1QsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixjQUE1QixFQUE0Q0MsT0FBTyxDQUFuRCxFQUFzREMsT0FBT1AsUUFBUVEsTUFBckUsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0IsZUFBUixFQUEzQjs7QUFFQSxZQUFLQyxrQkFBTCxDQUF3QkYsWUFBeEIsRUFBc0NULE9BQXRDLEVBQStDLFlBQS9DOztBQUVBLFdBQUssSUFBSVksUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosUUFBUVEsTUFBcEMsRUFBNEMsRUFBRUksS0FBOUMsRUFBcUQ7QUFDbkQsY0FBTUMsYUFBYWIsUUFBUVksS0FBUixDQUFuQjs7QUFFQSxjQUFNRSxTQUFTLE1BQU0scUJBQVdDLFlBQVgsQ0FBd0J6QixRQUFRMEIsRUFBaEMsRUFBb0MsRUFBQ0Msa0JBQWtCSixXQUFXSyxPQUE5QixFQUF1Q0MsWUFBWTdCLFFBQVE4QixLQUEzRCxFQUFwQyxDQUFyQjs7QUFFQSxjQUFNQyxZQUFZLENBQUNQLE9BQU9RLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRVgsT0FBT1ksU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0FYLGVBQU9hLHVCQUFQLENBQStCZCxVQUEvQjs7QUFFQSxjQUFNQyxPQUFPYyxZQUFQLEVBQU47O0FBRUFkLGVBQU9lLFVBQVAsR0FBb0IsSUFBcEI7O0FBRUEsY0FBTWYsT0FBT2dCLElBQVAsRUFBTjs7QUFFQSxZQUFJVCxTQUFKLEVBQWU7QUFDYixnQkFBTSxNQUFLVSxPQUFMLENBQWEsaUJBQWIsRUFBZ0MsRUFBQ0MsWUFBWWxCLE1BQWIsRUFBaEMsQ0FBTjtBQUNEOztBQUVELGNBQUtuQixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLGNBQTVCLEVBQTRDQyxPQUFPTSxRQUFRLENBQTNELEVBQThETCxPQUFPUCxRQUFRUSxNQUE3RSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUt5QyxNQUFMLEVBQU47O0FBRUExQyxpQkFBVzJDLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLGFBQTdCOztBQUVBLFlBQUt4QyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLd0MsUUFBTCxHQUFnQixjQUExQixFQUEwQzlCLE9BQU9OLFFBQVFRLE1BQXpELEVBQWlFRCxPQUFPUCxRQUFRUSxNQUFoRixFQUFkO0FBOUMrQjtBQStDaEM7QUFoRG1EO2tCQUFqQ3BCLG1CIiwiZmlsZSI6ImRvd25sb2FkLW1lbWJlcnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgTWVtYmVyc2hpcCBmcm9tICcuLi8uLi9tb2RlbHMvbWVtYmVyc2hpcCc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZE1lbWJlcnNoaXBzIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzeW5jID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCAnbWVtYmVyc2hpcHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIG1lbWJlcnNoaXBzJ30pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBDbGllbnQuZ2V0TWVtYmVyc2hpcHMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5tZW1iZXJzaGlwcztcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgbWVtYmVyc2hpcHMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRNZW1iZXJzaGlwcygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzLCAnbWVtYmVyc2hpcCcpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IE1lbWJlcnNoaXAuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHt1c2VyX3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnVzZXJfaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgICBhd2FpdCBvYmplY3QuZ2V0TG9jYWxSb2xlKCk7XG5cbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ21lbWJlcnNoaXA6c2F2ZScsIHttZW1iZXJzaGlwOiBvYmplY3R9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdtZW1iZXJzaGlwcycpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgbWVtYmVyc2hpcHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=