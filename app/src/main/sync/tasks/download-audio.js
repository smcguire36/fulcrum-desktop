'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _audio = require('../../models/audio');

var _audio2 = _interopRequireDefault(_audio);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadAudio extends _downloadSequence2.default {
  get syncResourceName() {
    return 'audio';
  }

  get syncLabel() {
    return 'audio';
  }

  get resourceName() {
    return 'audio';
  }

  get lastSync() {
    return this.account._lastSyncAudio;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getAudio(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _audio2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      object.updateFromAPIAttributes(attributes);

      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      if (attributes.processed) {
        if (!object.isDownloaded) {
          // queue.push(attributes, function(err) {
          //   if (err) {
          //     console.log('ERROR DOWNLOADING', err);
          //     throw err;
          //   }

          //   object.isDownloaded = true;
          //   // do we need to await this somehow?
          //   object.save();
          // });
        }
      } else {
        object.isDownloaded = false;
      }

      if (object.isDownloaded == null) {
        object.isDownloaded = false;
      }

      yield _this2.lookup(object, attributes.form_id, '_formRowID', 'getForm');

      if (object._formRowID) {
        const record = yield _this2.account.findFirstRecord({ resource_id: attributes.record_id });

        if (record) {
          object._recordRowID = record.rowID;
        }
      }

      _this2.account._lastSyncAudio = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('audio:save', { audio: object });
      }
    })();
  }

  finish() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // update the lastSync date
      yield _this3.account.save();
    })();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
exports.default = DownloadAudio;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtYXVkaW8uanMiXSwibmFtZXMiOlsiRG93bmxvYWRBdWRpbyIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jTGFiZWwiLCJyZXNvdXJjZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNBdWRpbyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0QXVkaW8iLCJwYWdlU2l6ZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwiYWNjZXNzX2tleSIsInByb2Nlc3MiLCJvYmplY3QiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsInByb2Nlc3NlZCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwiYXVkaW8iLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxhQUFOLG9DQUE2QztBQUMxRCxNQUFJQyxnQkFBSixHQUF1QjtBQUNyQixXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFJQyxTQUFKLEdBQWdCO0FBQ2QsV0FBTyxPQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsY0FBcEI7QUFDRDs7QUFFS0MsY0FBTixDQUFtQkYsT0FBbkIsRUFBNEJELFFBQTVCLEVBQXNDSSxRQUF0QyxFQUFnRDtBQUFBOztBQUFBO0FBQzlDLGFBQU8saUJBQU9DLFFBQVAsQ0FBZ0JKLE9BQWhCLEVBQXlCRyxRQUF6QixFQUFtQyxNQUFLRSxRQUF4QyxDQUFQO0FBRDhDO0FBRS9DOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCUCxPQUF2QixFQUFnQ1EsVUFBaEMsRUFBNEM7QUFDMUMsV0FBTyxnQkFBTUYsWUFBTixDQUFtQkMsUUFBbkIsRUFBNkIsRUFBQ0UsWUFBWVQsUUFBUVUsS0FBckIsRUFBNEJDLGFBQWFILFdBQVdJLFVBQXBELEVBQTdCLENBQVA7QUFDRDs7QUFFS0MsU0FBTixDQUFjQyxNQUFkLEVBQXNCTixVQUF0QixFQUFrQztBQUFBOztBQUFBO0FBQ2hDTSxhQUFPQyx1QkFBUCxDQUErQlAsVUFBL0I7O0FBRUEsWUFBTVEsWUFBWSxDQUFDRixPQUFPRyxXQUFSLElBQ0EsdUJBQVVDLGlCQUFWLENBQTRCVixXQUFXVyxVQUF2QyxFQUFtREMsT0FBbkQsT0FBaUVOLE9BQU9PLFNBQVAsQ0FBaUJELE9BQWpCLEVBRG5GOztBQUdBLFVBQUlaLFdBQVdjLFNBQWYsRUFBMEI7QUFDeEIsWUFBSSxDQUFDUixPQUFPUyxZQUFaLEVBQTBCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDRDtBQUNGLE9BYkQsTUFhTztBQUNMVCxlQUFPUyxZQUFQLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQsVUFBSVQsT0FBT1MsWUFBUCxJQUF1QixJQUEzQixFQUFpQztBQUMvQlQsZUFBT1MsWUFBUCxHQUFzQixLQUF0QjtBQUNEOztBQUVELFlBQU0sT0FBS0MsTUFBTCxDQUFZVixNQUFaLEVBQW9CTixXQUFXaUIsT0FBL0IsRUFBd0MsWUFBeEMsRUFBc0QsU0FBdEQsQ0FBTjs7QUFFQSxVQUFJWCxPQUFPWSxVQUFYLEVBQXVCO0FBQ3JCLGNBQU1DLFNBQVMsTUFBTSxPQUFLM0IsT0FBTCxDQUFhNEIsZUFBYixDQUE2QixFQUFDakIsYUFBYUgsV0FBV3FCLFNBQXpCLEVBQTdCLENBQXJCOztBQUVBLFlBQUlGLE1BQUosRUFBWTtBQUNWYixpQkFBT2dCLFlBQVAsR0FBc0JILE9BQU9qQixLQUE3QjtBQUNEO0FBQ0Y7O0FBRUQsYUFBS1YsT0FBTCxDQUFhQyxjQUFiLEdBQThCYSxPQUFPaUIsVUFBckM7O0FBRUEsWUFBTWpCLE9BQU9rQixJQUFQLEVBQU47O0FBRUEsVUFBSWhCLFNBQUosRUFBZTtBQUNiLGNBQU0sT0FBS2lCLE9BQUwsQ0FBYSxZQUFiLEVBQTJCLEVBQUNDLE9BQU9wQixNQUFSLEVBQTNCLENBQU47QUFDRDtBQTNDK0I7QUE0Q2pDOztBQUVLcUIsUUFBTixHQUFlO0FBQUE7O0FBQUE7QUFDYjtBQUNBLFlBQU0sT0FBS25DLE9BQUwsQ0FBYWdDLElBQWIsRUFBTjtBQUZhO0FBR2Q7O0FBRURJLE9BQUtwQyxPQUFMLEVBQWNxQyxPQUFkLEVBQXVCO0FBQ3JCQyxZQUFRQyxHQUFSLENBQVl2QyxRQUFRd0MsZ0JBQVIsQ0FBeUJDLEtBQXJDLEVBQTRDLFNBQVNDLEdBQXJEO0FBQ0Q7QUE5RXlEO2tCQUF2Qy9DLGEiLCJmaWxlIjoiZG93bmxvYWQtYXVkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgQXVkaW8gZnJvbSAnLi4vLi4vbW9kZWxzL2F1ZGlvJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQXVkaW8gZXh0ZW5kcyBEb3dubG9hZFNlcXVlbmNlIHtcbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhdWRpbyc7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiAnYXVkaW8nO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2F1ZGlvJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY0F1ZGlvO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBDbGllbnQuZ2V0QXVkaW8oYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIEF1ZGlvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBpZiAoYXR0cmlidXRlcy5wcm9jZXNzZWQpIHtcbiAgICAgIGlmICghb2JqZWN0LmlzRG93bmxvYWRlZCkge1xuICAgICAgICAvLyBxdWV1ZS5wdXNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAvLyAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdFUlJPUiBET1dOTE9BRElORycsIGVycik7XG4gICAgICAgIC8vICAgICB0aHJvdyBlcnI7XG4gICAgICAgIC8vICAgfVxuXG4gICAgICAgIC8vICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IHRydWU7XG4gICAgICAgIC8vICAgLy8gZG8gd2UgbmVlZCB0byBhd2FpdCB0aGlzIHNvbWVob3c/XG4gICAgICAgIC8vICAgb2JqZWN0LnNhdmUoKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jQXVkaW8gPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ2F1ZGlvOnNhdmUnLCB7YXVkaW86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG59XG4iXX0=