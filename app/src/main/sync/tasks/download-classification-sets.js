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

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _classificationSet2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' classification sets', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('classificationSets');

      _this.progress({ message: _this.finished + ' classification sets', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadClassificationSets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2xhc3NpZmljYXRpb24tc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwib2JqZWN0cyIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJjbGFzc2lmaWNhdGlvbl9zZXRzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kQ2xhc3NpZmljYXRpb25TZXRzIiwibWFya0RlbGV0ZWRPYmplY3RzIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwiZGIiLCJyZXNvdXJjZV9pZCIsImlkIiwiYWNjb3VudF9pZCIsInJvd0lEIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsInVwZGF0ZSIsInNvdXJjZSIsImludmFsaWRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLDBCQUFOLHdCQUE4QztBQUNyREMsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLHFCQUE3QixDQUFuQjs7QUFFQSxVQUFJLENBQUNFLEtBQUtFLFdBQVYsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFLQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLQyxXQUFMLEdBQW1CLHNCQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MscUJBQVAsQ0FBNkJULE9BQTdCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLG1CQUExQzs7QUFFQSxZQUFLVCxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLHNCQUE1QixFQUFvREMsT0FBTyxDQUEzRCxFQUE4REMsT0FBT1AsUUFBUVEsTUFBN0UsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0Isc0JBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0Qzs7QUFFQSxXQUFLLElBQUlZLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFaLFFBQVFRLE1BQXBDLEVBQTRDLEVBQUVJLEtBQTlDLEVBQXFEO0FBQ25ELGNBQU1DLGFBQWFiLFFBQVFZLEtBQVIsQ0FBbkI7O0FBRUEsY0FBTUUsU0FBUyxNQUFNLDRCQUFrQkMsWUFBbEIsQ0FBK0J6QixRQUFRMEIsRUFBdkMsRUFBMkMsRUFBQ0MsYUFBYUosV0FBV0ssRUFBekIsRUFBNkJDLFlBQVk3QixRQUFROEIsS0FBakQsRUFBM0MsQ0FBckI7O0FBRUFOLGVBQU9PLHVCQUFQLENBQStCUixVQUEvQjs7QUFFQUMsZUFBT1EsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNUixPQUFPUyxJQUFQLEVBQU47O0FBRUEsY0FBSzVCLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0Isc0JBQTVCLEVBQW9EQyxPQUFPTSxRQUFRLENBQW5FLEVBQXNFTCxPQUFPUCxRQUFRUSxNQUFyRixFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUtnQyxNQUFMLEVBQU47O0FBRUFqQyxpQkFBV2tDLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLG9CQUE3Qjs7QUFFQSxZQUFLL0IsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBSytCLFFBQUwsR0FBZ0Isc0JBQTFCLEVBQWtEckIsT0FBT04sUUFBUVEsTUFBakUsRUFBeUVELE9BQU9QLFFBQVFRLE1BQXhGLEVBQWQ7QUFyQytCO0FBc0NoQztBQXZDMEQ7a0JBQXhDcEIsMEIiLCJmaWxlIjoiZG93bmxvYWQtY2xhc3NpZmljYXRpb24tc2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IENsYXNzaWZpY2F0aW9uU2V0IGZyb20gJy4uLy4uL21vZGVscy9jbGFzc2lmaWNhdGlvbi1zZXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3luYyA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgJ2NsYXNzaWZpY2F0aW9uX3NldHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGNsYXNzaWZpY2F0aW9uIHNldHMnfSk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRDbGFzc2lmaWNhdGlvblNldHMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5jbGFzc2lmaWNhdGlvbl9zZXRzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBjbGFzc2lmaWNhdGlvbiBzZXRzJywgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgY29uc3QgbG9jYWxPYmplY3RzID0gYXdhaXQgYWNjb3VudC5maW5kQ2xhc3NpZmljYXRpb25TZXRzKCk7XG5cbiAgICB0aGlzLm1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG9iamVjdHMpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IENsYXNzaWZpY2F0aW9uU2V0LmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG51bGw7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgY2xhc3NpZmljYXRpb24gc2V0cycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdjbGFzc2lmaWNhdGlvblNldHMnKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZmluaXNoZWQgKyAnIGNsYXNzaWZpY2F0aW9uIHNldHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=