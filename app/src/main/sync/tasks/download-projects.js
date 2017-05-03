'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _project = require('../../models/project');

var _project2 = _interopRequireDefault(_project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadProjects extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'projects');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' projects' });

      const response = yield _client2.default.getProjects(account);

      const objects = JSON.parse(response.body).projects;

      _this.progress({ message: _this.processing + ' projects', count: 0, total: objects.length });

      const localObjects = yield account.findProjects();

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _project2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' projects', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('projects');

      _this.progress({ message: _this.finished + ' projects', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadProjects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcHJvamVjdHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRQcm9qZWN0cyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0UHJvamVjdHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInByb2plY3RzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kUHJvamVjdHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsIl9kZWxldGVkQXQiLCJzYXZlIiwidXBkYXRlIiwic291cmNlIiwiaW52YWxpZGF0ZSIsImZpbmlzaGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsZ0JBQU4sd0JBQW9DO0FBQzNDQyxLQUFOLENBQVUsRUFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQVYsRUFBaUM7QUFBQTs7QUFBQTtBQUMvQixZQUFNQyxPQUFPLE1BQU0sTUFBS0MsY0FBTCxDQUFvQkgsT0FBcEIsRUFBNkIsVUFBN0IsQ0FBbkI7O0FBRUEsVUFBSSxDQUFDRSxLQUFLRSxXQUFWLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsWUFBS0MsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS0MsV0FBTCxHQUFtQixXQUE3QixFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsV0FBUCxDQUFtQlQsT0FBbkIsQ0FBdkI7O0FBRUEsWUFBTVUsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsUUFBMUM7O0FBRUEsWUFBS1QsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixXQUE1QixFQUF5Q0MsT0FBTyxDQUFoRCxFQUFtREMsT0FBT1AsUUFBUVEsTUFBbEUsRUFBZDs7QUFFQSxZQUFNQyxlQUFlLE1BQU1uQixRQUFRb0IsWUFBUixFQUEzQjs7QUFFQSxZQUFLQyxrQkFBTCxDQUF3QkYsWUFBeEIsRUFBc0NULE9BQXRDOztBQUVBLFdBQUssSUFBSVksUUFBUSxDQUFqQixFQUFvQkEsUUFBUVosUUFBUVEsTUFBcEMsRUFBNEMsRUFBRUksS0FBOUMsRUFBcUQ7QUFDbkQsY0FBTUMsYUFBYWIsUUFBUVksS0FBUixDQUFuQjs7QUFFQSxjQUFNRSxTQUFTLE1BQU0sa0JBQVFDLFlBQVIsQ0FBcUJ6QixRQUFRMEIsRUFBN0IsRUFBaUMsRUFBQ0MsYUFBYUosV0FBV0ssRUFBekIsRUFBNkJDLFlBQVk3QixRQUFROEIsS0FBakQsRUFBakMsQ0FBckI7O0FBRUFOLGVBQU9PLHVCQUFQLENBQStCUixVQUEvQjs7QUFFQUMsZUFBT1EsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNUixPQUFPUyxJQUFQLEVBQU47O0FBRUEsY0FBSzVCLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsV0FBNUIsRUFBeUNDLE9BQU9NLFFBQVEsQ0FBeEQsRUFBMkRMLE9BQU9QLFFBQVFRLE1BQTFFLEVBQWQ7QUFDRDs7QUFFRCxZQUFNaEIsS0FBS2dDLE1BQUwsRUFBTjs7QUFFQWpDLGlCQUFXa0MsTUFBWCxDQUFrQkMsVUFBbEIsQ0FBNkIsVUFBN0I7O0FBRUEsWUFBSy9CLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUsrQixRQUFMLEdBQWdCLFdBQTFCLEVBQXVDckIsT0FBT04sUUFBUVEsTUFBdEQsRUFBOERELE9BQU9QLFFBQVFRLE1BQTdFLEVBQWQ7QUFyQytCO0FBc0NoQztBQXZDZ0Q7a0JBQTlCcEIsZ0IiLCJmaWxlIjoiZG93bmxvYWQtcHJvamVjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFzayBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4uLy4uL21vZGVscy9wcm9qZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRQcm9qZWN0cyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3luYyA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgJ3Byb2plY3RzJyk7XG5cbiAgICBpZiAoIXN5bmMubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyBwcm9qZWN0cyd9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldFByb2plY3RzKGFjY291bnQpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkucHJvamVjdHM7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIHByb2plY3RzJywgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgY29uc3QgbG9jYWxPYmplY3RzID0gYXdhaXQgYWNjb3VudC5maW5kUHJvamVjdHMoKTtcblxuICAgIHRoaXMubWFya0RlbGV0ZWRPYmplY3RzKGxvY2FsT2JqZWN0cywgb2JqZWN0cyk7XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb2JqZWN0cy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBvYmplY3RzW2luZGV4XTtcblxuICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgUHJvamVjdC5maW5kT3JDcmVhdGUoYWNjb3VudC5kYiwge3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkLCBhY2NvdW50X2lkOiBhY2NvdW50LnJvd0lEfSk7XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIHByb2plY3RzJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ3Byb2plY3RzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBwcm9qZWN0cycsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gIH1cbn1cbiJdfQ==