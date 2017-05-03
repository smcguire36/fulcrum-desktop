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

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _role2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' roles', count: index + 1, total: objects.length });
      }

      yield sync.update();

      _this.progress({ message: _this.finished + ' roles', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadRoles;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcm9sZXMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRSb2xlcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Um9sZXMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInJvbGVzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kUm9sZXMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsIl9kZWxldGVkQXQiLCJzYXZlIiwidXBkYXRlIiwiZmluaXNoZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxhQUFOLHdCQUFpQztBQUN4Q0MsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLE9BQTdCLENBQW5COztBQUVBLFVBQUksQ0FBQ0UsS0FBS0UsV0FBVixFQUF1QjtBQUNyQjtBQUNEOztBQUVELFlBQUtDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtDLFdBQUwsR0FBbUIsUUFBN0IsRUFBZDs7QUFFQSxZQUFNQyxXQUFXLE1BQU0saUJBQU9DLFFBQVAsQ0FBZ0JULE9BQWhCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLEtBQTFDOztBQUVBLFlBQUtULFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsUUFBNUIsRUFBc0NDLE9BQU8sQ0FBN0MsRUFBZ0RDLE9BQU9QLFFBQVFRLE1BQS9ELEVBQWQ7O0FBRUEsWUFBTUMsZUFBZSxNQUFNbkIsUUFBUW9CLFNBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0Qzs7QUFFQSxXQUFLLElBQUlZLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFaLFFBQVFRLE1BQXBDLEVBQTRDLEVBQUVJLEtBQTlDLEVBQXFEO0FBQ25ELGNBQU1DLGFBQWFiLFFBQVFZLEtBQVIsQ0FBbkI7O0FBRUEsY0FBTUUsU0FBUyxNQUFNLGVBQUtDLFlBQUwsQ0FBa0J6QixRQUFRMEIsRUFBMUIsRUFBOEIsRUFBQ0MsYUFBYUosV0FBV0ssRUFBekIsRUFBNkJDLFlBQVk3QixRQUFROEIsS0FBakQsRUFBOUIsQ0FBckI7O0FBRUFOLGVBQU9PLHVCQUFQLENBQStCUixVQUEvQjs7QUFFQUMsZUFBT1EsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNUixPQUFPUyxJQUFQLEVBQU47O0FBRUEsY0FBSzVCLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsUUFBNUIsRUFBc0NDLE9BQU9NLFFBQVEsQ0FBckQsRUFBd0RMLE9BQU9QLFFBQVFRLE1BQXZFLEVBQWQ7QUFDRDs7QUFFRCxZQUFNaEIsS0FBS2dDLE1BQUwsRUFBTjs7QUFFQSxZQUFLN0IsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBSzZCLFFBQUwsR0FBZ0IsUUFBMUIsRUFBb0NuQixPQUFPTixRQUFRUSxNQUFuRCxFQUEyREQsT0FBT1AsUUFBUVEsTUFBMUUsRUFBZDtBQW5DK0I7QUFvQ2hDO0FBckM2QztrQkFBM0JwQixhIiwiZmlsZSI6ImRvd25sb2FkLXJvbGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgUm9sZSBmcm9tICcuLi8uLi9tb2RlbHMvcm9sZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUm9sZXMgZXh0ZW5kcyBUYXNrIHtcbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN5bmMgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsICdyb2xlcycpO1xuXG4gICAgaWYgKCFzeW5jLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgcm9sZXMnfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRSb2xlcyhhY2NvdW50KTtcblxuICAgIGNvbnN0IG9iamVjdHMgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpLnJvbGVzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyByb2xlcycsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGNvbnN0IGxvY2FsT2JqZWN0cyA9IGF3YWl0IGFjY291bnQuZmluZFJvbGVzKCk7XG5cbiAgICB0aGlzLm1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG9iamVjdHMpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IFJvbGUuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZCwgYWNjb3VudF9pZDogYWNjb3VudC5yb3dJRH0pO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyByb2xlcycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyByb2xlcycsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gIH1cbn1cbiJdfQ==