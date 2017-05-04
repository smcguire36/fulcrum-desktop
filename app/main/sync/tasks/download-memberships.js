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

        const object = yield _membership2.default.findOrCreate(account.db, { user_resource_id: attributes.user_id, account_id: account.rowID });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRNZW1iZXJzaGlwcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0TWVtYmVyc2hpcHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsIm1lbWJlcnNoaXBzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kTWVtYmVyc2hpcHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInVzZXJfcmVzb3VyY2VfaWQiLCJ1c2VyX2lkIiwiYWNjb3VudF9pZCIsInJvd0lEIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJnZXRMb2NhbFJvbGUiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsInVwZGF0ZSIsInNvdXJjZSIsImludmFsaWRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLG1CQUFOLHdCQUF1QztBQUM5Q0MsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLGFBQTdCLENBQW5COztBQUVBLFVBQUksQ0FBQ0UsS0FBS0UsV0FBVixFQUF1QjtBQUNyQjtBQUNEOztBQUVELFlBQUtDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtDLFdBQUwsR0FBbUIsY0FBN0IsRUFBZDs7QUFFQSxZQUFNQyxXQUFXLE1BQU0saUJBQU9DLGNBQVAsQ0FBc0JULE9BQXRCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLFdBQTFDOztBQUVBLFlBQUtULFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsY0FBNUIsRUFBNENDLE9BQU8sQ0FBbkQsRUFBc0RDLE9BQU9QLFFBQVFRLE1BQXJFLEVBQWQ7O0FBRUEsWUFBTUMsZUFBZSxNQUFNbkIsUUFBUW9CLGVBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0Qzs7QUFFQSxXQUFLLElBQUlZLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFaLFFBQVFRLE1BQXBDLEVBQTRDLEVBQUVJLEtBQTlDLEVBQXFEO0FBQ25ELGNBQU1DLGFBQWFiLFFBQVFZLEtBQVIsQ0FBbkI7O0FBRUEsY0FBTUUsU0FBUyxNQUFNLHFCQUFXQyxZQUFYLENBQXdCekIsUUFBUTBCLEVBQWhDLEVBQW9DLEVBQUNDLGtCQUFrQkosV0FBV0ssT0FBOUIsRUFBdUNDLFlBQVk3QixRQUFROEIsS0FBM0QsRUFBcEMsQ0FBckI7O0FBRUFOLGVBQU9PLHVCQUFQLENBQStCUixVQUEvQjs7QUFFQSxjQUFNQyxPQUFPUSxZQUFQLEVBQU47O0FBRUFSLGVBQU9TLFVBQVAsR0FBb0IsSUFBcEI7O0FBRUEsY0FBTVQsT0FBT1UsSUFBUCxFQUFOOztBQUVBLGNBQUs3QixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLGNBQTVCLEVBQTRDQyxPQUFPTSxRQUFRLENBQTNELEVBQThETCxPQUFPUCxRQUFRUSxNQUE3RSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUtpQyxNQUFMLEVBQU47O0FBRUFsQyxpQkFBV21DLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLGFBQTdCOztBQUVBLFlBQUtoQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLZ0MsUUFBTCxHQUFnQixjQUExQixFQUEwQ3RCLE9BQU9OLFFBQVFRLE1BQXpELEVBQWlFRCxPQUFPUCxRQUFRUSxNQUFoRixFQUFkO0FBdkMrQjtBQXdDaEM7QUF6Q21EO2tCQUFqQ3BCLG1CIiwiZmlsZSI6ImRvd25sb2FkLW1lbWJlcnNoaXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgTWVtYmVyc2hpcCBmcm9tICcuLi8uLi9tb2RlbHMvbWVtYmVyc2hpcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkTWVtYmVyc2hpcHMgZXh0ZW5kcyBUYXNrIHtcbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN5bmMgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsICdtZW1iZXJzaGlwcycpO1xuXG4gICAgaWYgKCFzeW5jLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgbWVtYmVyc2hpcHMnfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRNZW1iZXJzaGlwcyhhY2NvdW50KTtcblxuICAgIGNvbnN0IG9iamVjdHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpLm1lbWJlcnNoaXBzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGNvbnN0IGxvY2FsT2JqZWN0cyA9IGF3YWl0IGFjY291bnQuZmluZE1lbWJlcnNoaXBzKCk7XG5cbiAgICB0aGlzLm1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG9iamVjdHMpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IE1lbWJlcnNoaXAuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHt1c2VyX3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnVzZXJfaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgICBhd2FpdCBvYmplY3QuZ2V0TG9jYWxSb2xlKCk7XG5cbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBtZW1iZXJzaGlwcycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdtZW1iZXJzaGlwcycpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgbWVtYmVyc2hpcHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=