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

var _fulcrumCore = require('fulcrum-core');

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

      _this.markDeletedObjects(localObjects, objects, 'project');

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _project2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        if (isChanged) {
          yield _this.trigger('project:save', { project: object });
        }

        _this.progress({ message: _this.processing + ' projects', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('projects');

      _this.progress({ message: _this.finished + ' projects', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadProjects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcHJvamVjdHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRQcm9qZWN0cyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0UHJvamVjdHMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInByb2plY3RzIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kUHJvamVjdHMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsIl9kZWxldGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInByb2plY3QiLCJ1cGRhdGUiLCJzb3VyY2UiLCJpbnZhbGlkYXRlIiwiZmluaXNoZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxnQkFBTix3QkFBb0M7QUFDM0NDLEtBQU4sQ0FBVSxFQUFDQyxPQUFELEVBQVVDLFVBQVYsRUFBVixFQUFpQztBQUFBOztBQUFBO0FBQy9CLFlBQU1DLE9BQU8sTUFBTSxNQUFLQyxjQUFMLENBQW9CSCxPQUFwQixFQUE2QixVQUE3QixDQUFuQjs7QUFFQSxVQUFJLENBQUNFLEtBQUtFLFdBQVYsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFLQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLQyxXQUFMLEdBQW1CLFdBQTdCLEVBQWQ7O0FBRUEsWUFBTUMsV0FBVyxNQUFNLGlCQUFPQyxXQUFQLENBQW1CVCxPQUFuQixDQUF2Qjs7QUFFQSxZQUFNVSxVQUFVQyxLQUFLQyxLQUFMLENBQVdKLFNBQVNLLElBQXBCLEVBQTBCQyxRQUExQzs7QUFFQSxZQUFLVCxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLFdBQTVCLEVBQXlDQyxPQUFPLENBQWhELEVBQW1EQyxPQUFPUCxRQUFRUSxNQUFsRSxFQUFkOztBQUVBLFlBQU1DLGVBQWUsTUFBTW5CLFFBQVFvQixZQUFSLEVBQTNCOztBQUVBLFlBQUtDLGtCQUFMLENBQXdCRixZQUF4QixFQUFzQ1QsT0FBdEMsRUFBK0MsU0FBL0M7O0FBRUEsV0FBSyxJQUFJWSxRQUFRLENBQWpCLEVBQW9CQSxRQUFRWixRQUFRUSxNQUFwQyxFQUE0QyxFQUFFSSxLQUE5QyxFQUFxRDtBQUNuRCxjQUFNQyxhQUFhYixRQUFRWSxLQUFSLENBQW5COztBQUVBLGNBQU1FLFNBQVMsTUFBTSxrQkFBUUMsWUFBUixDQUFxQnpCLFFBQVEwQixFQUE3QixFQUFpQyxFQUFDQyxhQUFhSixXQUFXSyxFQUF6QixFQUE2QkMsWUFBWTdCLFFBQVE4QixLQUFqRCxFQUFqQyxDQUFyQjs7QUFFQSxjQUFNQyxZQUFZLENBQUNQLE9BQU9RLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRVgsT0FBT1ksU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0FYLGVBQU9hLHVCQUFQLENBQStCZCxVQUEvQjs7QUFFQUMsZUFBT2MsVUFBUCxHQUFvQixJQUFwQjs7QUFFQSxjQUFNZCxPQUFPZSxJQUFQLEVBQU47O0FBRUEsWUFBSVIsU0FBSixFQUFlO0FBQ2IsZ0JBQU0sTUFBS1MsT0FBTCxDQUFhLGNBQWIsRUFBNkIsRUFBQ0MsU0FBU2pCLE1BQVYsRUFBN0IsQ0FBTjtBQUNEOztBQUVELGNBQUtuQixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLFdBQTVCLEVBQXlDQyxPQUFPTSxRQUFRLENBQXhELEVBQTJETCxPQUFPUCxRQUFRUSxNQUExRSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUt3QyxNQUFMLEVBQU47O0FBRUF6QyxpQkFBVzBDLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLFVBQTdCOztBQUVBLFlBQUt2QyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLdUMsUUFBTCxHQUFnQixXQUExQixFQUF1QzdCLE9BQU9OLFFBQVFRLE1BQXRELEVBQThERCxPQUFPUCxRQUFRUSxNQUE3RSxFQUFkO0FBNUMrQjtBQTZDaEM7QUE5Q2dEO2tCQUE5QnBCLGdCIiwiZmlsZSI6ImRvd25sb2FkLXByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgUHJvamVjdCBmcm9tICcuLi8uLi9tb2RlbHMvcHJvamVjdCc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFByb2plY3RzIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzeW5jID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCAncHJvamVjdHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIHByb2plY3RzJ30pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBDbGllbnQuZ2V0UHJvamVjdHMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5wcm9qZWN0cztcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgcHJvamVjdHMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRQcm9qZWN0cygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzLCAncHJvamVjdCcpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IFByb2plY3QuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZCwgYWNjb3VudF9pZDogYWNjb3VudC5yb3dJRH0pO1xuXG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3Byb2plY3Q6c2F2ZScsIHtwcm9qZWN0OiBvYmplY3R9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBwcm9qZWN0cycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdwcm9qZWN0cycpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgcHJvamVjdHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=