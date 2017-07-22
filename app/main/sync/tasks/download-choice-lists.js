'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _choiceList = require('../../models/choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChoiceLists extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'choice_lists');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' choice lists' });

      const response = yield _client2.default.getChoiceLists(account);

      const objects = JSON.parse(response.body).choice_lists;

      _this.progress({ message: _this.processing + ' choice lists', count: 0, total: objects.length });

      const localObjects = yield account.findChoiceLists();

      _this.markDeletedObjects(localObjects, objects, 'choice-list', 'choiceList');

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _choiceList2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        if (isChanged) {
          yield _this.trigger('choice-list:save', { choiceList: object });
        }

        _this.progress({ message: _this.processing + ' choice lists', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('choiceLists');

      _this.progress({ message: _this.finished + ' choice lists', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadChoiceLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hvaWNlLWxpc3RzLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkQ2hvaWNlTGlzdHMiLCJydW4iLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsInN5bmMiLCJjaGVja1N5bmNTdGF0ZSIsIm5lZWRzVXBkYXRlIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJyZXNwb25zZSIsImdldENob2ljZUxpc3RzIiwib2JqZWN0cyIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJjaG9pY2VfbGlzdHMiLCJwcm9jZXNzaW5nIiwiY291bnQiLCJ0b3RhbCIsImxlbmd0aCIsImxvY2FsT2JqZWN0cyIsImZpbmRDaG9pY2VMaXN0cyIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImluZGV4IiwiYXR0cmlidXRlcyIsIm9iamVjdCIsImZpbmRPckNyZWF0ZSIsImRiIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiX2RlbGV0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwiY2hvaWNlTGlzdCIsInVwZGF0ZSIsInNvdXJjZSIsImludmFsaWRhdGUiLCJmaW5pc2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLG1CQUFOLHdCQUF1QztBQUM5Q0MsS0FBTixDQUFVLEVBQUNDLE9BQUQsRUFBVUMsVUFBVixFQUFWLEVBQWlDO0FBQUE7O0FBQUE7QUFDL0IsWUFBTUMsT0FBTyxNQUFNLE1BQUtDLGNBQUwsQ0FBb0JILE9BQXBCLEVBQTZCLGNBQTdCLENBQW5COztBQUVBLFVBQUksQ0FBQ0UsS0FBS0UsV0FBVixFQUF1QjtBQUNyQjtBQUNEOztBQUVELFlBQUtDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtDLFdBQUwsR0FBbUIsZUFBN0IsRUFBZDs7QUFFQSxZQUFNQyxXQUFXLE1BQU0saUJBQU9DLGNBQVAsQ0FBc0JULE9BQXRCLENBQXZCOztBQUVBLFlBQU1VLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLFlBQTFDOztBQUVBLFlBQUtULFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE1BQUtTLFVBQUwsR0FBa0IsZUFBNUIsRUFBNkNDLE9BQU8sQ0FBcEQsRUFBdURDLE9BQU9QLFFBQVFRLE1BQXRFLEVBQWQ7O0FBRUEsWUFBTUMsZUFBZSxNQUFNbkIsUUFBUW9CLGVBQVIsRUFBM0I7O0FBRUEsWUFBS0Msa0JBQUwsQ0FBd0JGLFlBQXhCLEVBQXNDVCxPQUF0QyxFQUErQyxhQUEvQyxFQUE4RCxZQUE5RDs7QUFFQSxXQUFLLElBQUlZLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFaLFFBQVFRLE1BQXBDLEVBQTRDLEVBQUVJLEtBQTlDLEVBQXFEO0FBQ25ELGNBQU1DLGFBQWFiLFFBQVFZLEtBQVIsQ0FBbkI7O0FBRUEsY0FBTUUsU0FBUyxNQUFNLHFCQUFXQyxZQUFYLENBQXdCekIsUUFBUTBCLEVBQWhDLEVBQW9DLEVBQUNDLGFBQWFKLFdBQVdLLEVBQXpCLEVBQTZCQyxZQUFZN0IsUUFBUThCLEtBQWpELEVBQXBDLENBQXJCOztBQUVBLGNBQU1DLFlBQVksQ0FBQ1AsT0FBT1EsV0FBUixJQUNBLHVCQUFVQyxpQkFBVixDQUE0QlYsV0FBV1csVUFBdkMsRUFBbURDLE9BQW5ELE9BQWlFWCxPQUFPWSxTQUFQLENBQWlCRCxPQUFqQixFQURuRjs7QUFHQVgsZUFBT2EsdUJBQVAsQ0FBK0JkLFVBQS9COztBQUVBQyxlQUFPYyxVQUFQLEdBQW9CLElBQXBCOztBQUVBLGNBQU1kLE9BQU9lLElBQVAsRUFBTjs7QUFFQSxZQUFJUixTQUFKLEVBQWU7QUFDYixnQkFBTSxNQUFLUyxPQUFMLENBQWEsa0JBQWIsRUFBaUMsRUFBQ0MsWUFBWWpCLE1BQWIsRUFBakMsQ0FBTjtBQUNEOztBQUVELGNBQUtuQixRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLGVBQTVCLEVBQTZDQyxPQUFPTSxRQUFRLENBQTVELEVBQStETCxPQUFPUCxRQUFRUSxNQUE5RSxFQUFkO0FBQ0Q7O0FBRUQsWUFBTWhCLEtBQUt3QyxNQUFMLEVBQU47O0FBRUF6QyxpQkFBVzBDLE1BQVgsQ0FBa0JDLFVBQWxCLENBQTZCLGFBQTdCOztBQUVBLFlBQUt2QyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLdUMsUUFBTCxHQUFnQixlQUExQixFQUEyQzdCLE9BQU9OLFFBQVFRLE1BQTFELEVBQWtFRCxPQUFPUCxRQUFRUSxNQUFqRixFQUFkO0FBNUMrQjtBQTZDaEM7QUE5Q21EO2tCQUFqQ3BCLG1CIiwiZmlsZSI6ImRvd25sb2FkLWNob2ljZS1saXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IENob2ljZUxpc3QgZnJvbSAnLi4vLi4vbW9kZWxzL2Nob2ljZS1saXN0JztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQ2hvaWNlTGlzdHMgZXh0ZW5kcyBUYXNrIHtcbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN5bmMgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsICdjaG9pY2VfbGlzdHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGNob2ljZSBsaXN0cyd9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldENob2ljZUxpc3RzKGFjY291bnQpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkuY2hvaWNlX2xpc3RzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBjaG9pY2UgbGlzdHMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRDaG9pY2VMaXN0cygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzLCAnY2hvaWNlLWxpc3QnLCAnY2hvaWNlTGlzdCcpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IENob2ljZUxpc3QuZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZCwgYWNjb3VudF9pZDogYWNjb3VudC5yb3dJRH0pO1xuXG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ2Nob2ljZS1saXN0OnNhdmUnLCB7Y2hvaWNlTGlzdDogb2JqZWN0fSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgY2hvaWNlIGxpc3RzJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ2Nob2ljZUxpc3RzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBjaG9pY2UgbGlzdHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=