'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _photo = require('../../models/photo');

var _photo2 = _interopRequireDefault(_photo);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadPhotos extends _downloadSequence2.default {
  get syncResourceName() {
    return 'photos';
  }

  get syncLabel() {
    return 'photos';
  }

  get resourceName() {
    return 'photos';
  }

  get lastSync() {
    return this.account._lastSyncPhotos;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getPhotos(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _photo2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
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

      _this2.account._lastSyncPhotos = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('photo:save', { photo: object });
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
exports.default = DownloadPhotos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcGhvdG9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkUGhvdG9zIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNMYWJlbCIsInJlc291cmNlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1Bob3RvcyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0UGhvdG9zIiwicGFnZVNpemUiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsImFjY2Vzc19rZXkiLCJwcm9jZXNzIiwib2JqZWN0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJwcm9jZXNzZWQiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInBob3RvIiwiZmluaXNoIiwiZmFpbCIsInJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwib3JnYW5pemF0aW9uTmFtZSIsImdyZWVuIiwicmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsY0FBTixvQ0FBOEM7QUFDM0QsTUFBSUMsZ0JBQUosR0FBdUI7QUFDckIsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sUUFBUDtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLQyxPQUFMLENBQWFDLGVBQXBCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJGLE9BQW5CLEVBQTRCRCxRQUE1QixFQUFzQ0ksUUFBdEMsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxhQUFPLGlCQUFPQyxTQUFQLENBQWlCSixPQUFqQixFQUEwQkcsUUFBMUIsRUFBb0MsTUFBS0UsUUFBekMsQ0FBUDtBQUQ4QztBQUUvQzs7QUFFREMsZUFBYUMsUUFBYixFQUF1QlAsT0FBdkIsRUFBZ0NRLFVBQWhDLEVBQTRDO0FBQzFDLFdBQU8sZ0JBQU1GLFlBQU4sQ0FBbUJDLFFBQW5CLEVBQTZCLEVBQUNFLFlBQVlULFFBQVFVLEtBQXJCLEVBQTRCQyxhQUFhSCxXQUFXSSxVQUFwRCxFQUE3QixDQUFQO0FBQ0Q7O0FBRUtDLFNBQU4sQ0FBY0MsTUFBZCxFQUFzQk4sVUFBdEIsRUFBa0M7QUFBQTs7QUFBQTtBQUNoQ00sYUFBT0MsdUJBQVAsQ0FBK0JQLFVBQS9COztBQUVBLFlBQU1RLFlBQVksQ0FBQ0YsT0FBT0csV0FBUixJQUNBLHVCQUFVQyxpQkFBVixDQUE0QlYsV0FBV1csVUFBdkMsRUFBbURDLE9BQW5ELE9BQWlFTixPQUFPTyxTQUFQLENBQWlCRCxPQUFqQixFQURuRjs7QUFHQSxVQUFJWixXQUFXYyxTQUFmLEVBQTBCO0FBQ3hCLFlBQUksQ0FBQ1IsT0FBT1MsWUFBWixFQUEwQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Q7QUFDRixPQWJELE1BYU87QUFDTFQsZUFBT1MsWUFBUCxHQUFzQixLQUF0QjtBQUNEOztBQUVELFVBQUlULE9BQU9TLFlBQVAsSUFBdUIsSUFBM0IsRUFBaUM7QUFDL0JULGVBQU9TLFlBQVAsR0FBc0IsS0FBdEI7QUFDRDs7QUFFRCxZQUFNLE9BQUtDLE1BQUwsQ0FBWVYsTUFBWixFQUFvQk4sV0FBV2lCLE9BQS9CLEVBQXdDLFlBQXhDLEVBQXNELFNBQXRELENBQU47O0FBRUEsVUFBSVgsT0FBT1ksVUFBWCxFQUF1QjtBQUNyQixjQUFNQyxTQUFTLE1BQU0sT0FBSzNCLE9BQUwsQ0FBYTRCLGVBQWIsQ0FBNkIsRUFBQ2pCLGFBQWFILFdBQVdxQixTQUF6QixFQUE3QixDQUFyQjs7QUFFQSxZQUFJRixNQUFKLEVBQVk7QUFDVmIsaUJBQU9nQixZQUFQLEdBQXNCSCxPQUFPakIsS0FBN0I7QUFDRDtBQUNGOztBQUVELGFBQUtWLE9BQUwsQ0FBYUMsZUFBYixHQUErQmEsT0FBT2lCLFVBQXRDOztBQUVBLFlBQU1qQixPQUFPa0IsSUFBUCxFQUFOOztBQUVBLFVBQUloQixTQUFKLEVBQWU7QUFDYixjQUFNLE9BQUtpQixPQUFMLENBQWEsWUFBYixFQUEyQixFQUFDQyxPQUFPcEIsTUFBUixFQUEzQixDQUFOO0FBQ0Q7QUEzQytCO0FBNENqQzs7QUFFS3FCLFFBQU4sR0FBZTtBQUFBOztBQUFBO0FBQ2I7QUFDQSxZQUFNLE9BQUtuQyxPQUFMLENBQWFnQyxJQUFiLEVBQU47QUFGYTtBQUdkOztBQUVESSxPQUFLcEMsT0FBTCxFQUFjcUMsT0FBZCxFQUF1QjtBQUNyQkMsWUFBUUMsR0FBUixDQUFZdkMsUUFBUXdDLGdCQUFSLENBQXlCQyxLQUFyQyxFQUE0QyxTQUFTQyxHQUFyRDtBQUNEO0FBOUUwRDtrQkFBeEMvQyxjIiwiZmlsZSI6ImRvd25sb2FkLXBob3Rvcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBQaG90byBmcm9tICcuLi8uLi9tb2RlbHMvcGhvdG8nO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRQaG90b3MgZXh0ZW5kcyBEb3dubG9hZFNlcXVlbmNlIHtcbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwaG90b3MnO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ3Bob3Rvcyc7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncGhvdG9zJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY1Bob3RvcztcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldFBob3RvcyhhY2NvdW50LCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gUGhvdG8uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgIGlmIChhdHRyaWJ1dGVzLnByb2Nlc3NlZCkge1xuICAgICAgaWYgKCFvYmplY3QuaXNEb3dubG9hZGVkKSB7XG4gICAgICAgIC8vIHF1ZXVlLnB1c2goYXR0cmlidXRlcywgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIC8vICAgaWYgKGVycikge1xuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ0VSUk9SIERPV05MT0FESU5HJywgZXJyKTtcbiAgICAgICAgLy8gICAgIHRocm93IGVycjtcbiAgICAgICAgLy8gICB9XG5cbiAgICAgICAgLy8gICBvYmplY3QuaXNEb3dubG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gICAvLyBkbyB3ZSBuZWVkIHRvIGF3YWl0IHRoaXMgc29tZWhvdz9cbiAgICAgICAgLy8gICBvYmplY3Quc2F2ZSgpO1xuICAgICAgICAvLyB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNQaG90b3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3Bob3RvOnNhdmUnLCB7cGhvdG86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG59XG4iXX0=