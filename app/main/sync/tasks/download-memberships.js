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

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object._updatedAt.getTime();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0TWVtYmVyc2hpcHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsIm1lbWJlcnNoaXBzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kTWVtYmVyc2hpcHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInVzZXJfcmVzb3VyY2VfaWQiLCJ1c2VyX2lkIiwiYWNjb3VudF9pZCIsInJvd0lEIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwiX3VwZGF0ZWRBdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiZ2V0TG9jYWxSb2xlIiwiX2RlbGV0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwibWVtYmVyc2hpcCIsInVwZGF0ZSIsInNvdXJjZSIsImludmFsaWRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLG1CQUFOLHdCQUF1QztBQUM5Q0MsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLGFBQTdCLENBQW5COztBQUVBLFVBQUksQ0FBQ0UsS0FBS0UsV0FBVixFQUF1QjtBQUNyQjtBQUNEOztBQUVELFlBQUtDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtDLFdBQUwsR0FBbUIsY0FBN0IsRUFBZDs7QUFFQSxZQUFNQyxXQUFXLE1BQU0saUJBQU9DLGNBQVAsQ0FBc0JULE9BQXRCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLFdBQTFDOztBQUVBLFlBQUtULFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsY0FBNUIsRUFBNENDLE9BQU8sQ0FBbkQsRUFBc0RDLE9BQU9QLFFBQVFRLE1BQXJFLEVBQWQ7O0FBRUEsWUFBTUMsZUFBZSxNQUFNbkIsUUFBUW9CLGVBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0QyxFQUErQyxZQUEvQzs7QUFFQSxXQUFLLElBQUlZLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFaLFFBQVFRLE1BQXBDLEVBQTRDLEVBQUVJLEtBQTlDLEVBQXFEO0FBQ25ELGNBQU1DLGFBQWFiLFFBQVFZLEtBQVIsQ0FBbkI7O0FBRUEsY0FBTUUsU0FBUyxNQUFNLHFCQUFXQyxZQUFYLENBQXdCekIsUUFBUTBCLEVBQWhDLEVBQW9DLEVBQUNDLGtCQUFrQkosV0FBV0ssT0FBOUIsRUFBdUNDLFlBQVk3QixRQUFROEIsS0FBM0QsRUFBcEMsQ0FBckI7O0FBRUEsY0FBTUMsWUFBWSxDQUFDUCxPQUFPUSxXQUFSLElBQ0EsdUJBQVVDLGlCQUFWLENBQTRCVixXQUFXVyxVQUF2QyxFQUFtREMsT0FBbkQsT0FBaUVYLE9BQU9ZLFVBQVAsQ0FBa0JELE9BQWxCLEVBRG5GOztBQUdBWCxlQUFPYSx1QkFBUCxDQUErQmQsVUFBL0I7O0FBRUEsY0FBTUMsT0FBT2MsWUFBUCxFQUFOOztBQUVBZCxlQUFPZSxVQUFQLEdBQW9CLElBQXBCOztBQUVBLGNBQU1mLE9BQU9nQixJQUFQLEVBQU47O0FBRUEsWUFBSVQsU0FBSixFQUFlO0FBQ2IsZ0JBQU0sTUFBS1UsT0FBTCxDQUFhLGlCQUFiLEVBQWdDLEVBQUNDLFlBQVlsQixNQUFiLEVBQWhDLENBQU47QUFDRDs7QUFFRCxjQUFLbkIsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixjQUE1QixFQUE0Q0MsT0FBT00sUUFBUSxDQUEzRCxFQUE4REwsT0FBT1AsUUFBUVEsTUFBN0UsRUFBZDtBQUNEOztBQUVELFlBQU1oQixLQUFLeUMsTUFBTCxFQUFOOztBQUVBMUMsaUJBQVcyQyxNQUFYLENBQWtCQyxVQUFsQixDQUE2QixhQUE3Qjs7QUFFQSxZQUFLeEMsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS3dDLFFBQUwsR0FBZ0IsY0FBMUIsRUFBMEM5QixPQUFPTixRQUFRUSxNQUF6RCxFQUFpRUQsT0FBT1AsUUFBUVEsTUFBaEYsRUFBZDtBQTlDK0I7QUErQ2hDO0FBaERtRDtrQkFBakNwQixtQiIsImZpbGUiOiJkb3dubG9hZC1tZW1iZXJzaGlwcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IE1lbWJlcnNoaXAgZnJvbSAnLi4vLi4vbW9kZWxzL21lbWJlcnNoaXAnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRNZW1iZXJzaGlwcyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3luYyA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgJ21lbWJlcnNoaXBzJyk7XG5cbiAgICBpZiAoIXN5bmMubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyBtZW1iZXJzaGlwcyd9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldE1lbWJlcnNoaXBzKGFjY291bnQpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkubWVtYmVyc2hpcHM7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIG1lbWJlcnNoaXBzJywgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgY29uc3QgbG9jYWxPYmplY3RzID0gYXdhaXQgYWNjb3VudC5maW5kTWVtYmVyc2hpcHMoKTtcblxuICAgIHRoaXMubWFya0RlbGV0ZWRPYmplY3RzKGxvY2FsT2JqZWN0cywgb2JqZWN0cywgJ21lbWJlcnNoaXAnKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBNZW1iZXJzaGlwLmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7dXNlcl9yZXNvdXJjZV9pZDogYXR0cmlidXRlcy51c2VyX2lkLCBhY2NvdW50X2lkOiBhY2NvdW50LnJvd0lEfSk7XG5cbiAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0Ll91cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5nZXRMb2NhbFJvbGUoKTtcblxuICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcignbWVtYmVyc2hpcDpzYXZlJywge21lbWJlcnNoaXA6IG9iamVjdH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIG1lbWJlcnNoaXBzJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ21lbWJlcnNoaXBzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gIH1cbn1cbiJdfQ==