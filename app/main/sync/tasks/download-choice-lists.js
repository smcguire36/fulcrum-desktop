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

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _choiceList2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' choice lists', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('choiceLists');

      _this.progress({ message: _this.finished + ' choice lists', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadChoiceLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hvaWNlLWxpc3RzLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkQ2hvaWNlTGlzdHMiLCJydW4iLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsInN5bmMiLCJjaGVja1N5bmNTdGF0ZSIsIm5lZWRzVXBkYXRlIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJyZXNwb25zZSIsImdldENob2ljZUxpc3RzIiwib2JqZWN0cyIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJjaG9pY2VfbGlzdHMiLCJwcm9jZXNzaW5nIiwiY291bnQiLCJ0b3RhbCIsImxlbmd0aCIsImxvY2FsT2JqZWN0cyIsImZpbmRDaG9pY2VMaXN0cyIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImluZGV4IiwiYXR0cmlidXRlcyIsIm9iamVjdCIsImZpbmRPckNyZWF0ZSIsImRiIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiX2RlbGV0ZWRBdCIsInNhdmUiLCJ1cGRhdGUiLCJzb3VyY2UiLCJpbnZhbGlkYXRlIiwiZmluaXNoZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxtQkFBTix3QkFBdUM7QUFDOUNDLEtBQU4sQ0FBVSxFQUFDQyxPQUFELEVBQVVDLFVBQVYsRUFBVixFQUFpQztBQUFBOztBQUFBO0FBQy9CLFlBQU1DLE9BQU8sTUFBTSxNQUFLQyxjQUFMLENBQW9CSCxPQUFwQixFQUE2QixjQUE3QixDQUFuQjs7QUFFQSxVQUFJLENBQUNFLEtBQUtFLFdBQVYsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFLQyxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLQyxXQUFMLEdBQW1CLGVBQTdCLEVBQWQ7O0FBRUEsWUFBTUMsV0FBVyxNQUFNLGlCQUFPQyxjQUFQLENBQXNCVCxPQUF0QixDQUF2Qjs7QUFFQSxZQUFNVSxVQUFVQyxLQUFLQyxLQUFMLENBQVdKLFNBQVNLLElBQXBCLEVBQTBCQyxZQUExQzs7QUFFQSxZQUFLVCxRQUFMLENBQWMsRUFBQ0MsU0FBUyxNQUFLUyxVQUFMLEdBQWtCLGVBQTVCLEVBQTZDQyxPQUFPLENBQXBELEVBQXVEQyxPQUFPUCxRQUFRUSxNQUF0RSxFQUFkOztBQUVBLFlBQU1DLGVBQWUsTUFBTW5CLFFBQVFvQixlQUFSLEVBQTNCOztBQUVBLFlBQUtDLGtCQUFMLENBQXdCRixZQUF4QixFQUFzQ1QsT0FBdEM7O0FBRUEsV0FBSyxJQUFJWSxRQUFRLENBQWpCLEVBQW9CQSxRQUFRWixRQUFRUSxNQUFwQyxFQUE0QyxFQUFFSSxLQUE5QyxFQUFxRDtBQUNuRCxjQUFNQyxhQUFhYixRQUFRWSxLQUFSLENBQW5COztBQUVBLGNBQU1FLFNBQVMsTUFBTSxxQkFBV0MsWUFBWCxDQUF3QnpCLFFBQVEwQixFQUFoQyxFQUFvQyxFQUFDQyxhQUFhSixXQUFXSyxFQUF6QixFQUE2QkMsWUFBWTdCLFFBQVE4QixLQUFqRCxFQUFwQyxDQUFyQjs7QUFFQU4sZUFBT08sdUJBQVAsQ0FBK0JSLFVBQS9COztBQUVBQyxlQUFPUSxVQUFQLEdBQW9CLElBQXBCOztBQUVBLGNBQU1SLE9BQU9TLElBQVAsRUFBTjs7QUFFQSxjQUFLNUIsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBS1MsVUFBTCxHQUFrQixlQUE1QixFQUE2Q0MsT0FBT00sUUFBUSxDQUE1RCxFQUErREwsT0FBT1AsUUFBUVEsTUFBOUUsRUFBZDtBQUNEOztBQUVELFlBQU1oQixLQUFLZ0MsTUFBTCxFQUFOOztBQUVBakMsaUJBQVdrQyxNQUFYLENBQWtCQyxVQUFsQixDQUE2QixhQUE3Qjs7QUFFQSxZQUFLL0IsUUFBTCxDQUFjLEVBQUNDLFNBQVMsTUFBSytCLFFBQUwsR0FBZ0IsZUFBMUIsRUFBMkNyQixPQUFPTixRQUFRUSxNQUExRCxFQUFrRUQsT0FBT1AsUUFBUVEsTUFBakYsRUFBZDtBQXJDK0I7QUFzQ2hDO0FBdkNtRDtrQkFBakNwQixtQiIsImZpbGUiOiJkb3dubG9hZC1jaG9pY2UtbGlzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFzayBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBDaG9pY2VMaXN0IGZyb20gJy4uLy4uL21vZGVscy9jaG9pY2UtbGlzdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQ2hvaWNlTGlzdHMgZXh0ZW5kcyBUYXNrIHtcbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN5bmMgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsICdjaG9pY2VfbGlzdHMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGNob2ljZSBsaXN0cyd9KTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldENob2ljZUxpc3RzKGFjY291bnQpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkuY2hvaWNlX2xpc3RzO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBjaG9pY2UgbGlzdHMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRDaG9pY2VMaXN0cygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBDaG9pY2VMaXN0LmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG51bGw7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgY2hvaWNlIGxpc3RzJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ2Nob2ljZUxpc3RzJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBjaG9pY2UgbGlzdHMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG59XG4iXX0=