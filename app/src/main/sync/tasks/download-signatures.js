'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _signature = require('../../models/signature');

var _signature2 = _interopRequireDefault(_signature);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadSignatures extends _downloadSequence2.default {
  get syncResourceName() {
    return 'signatures';
  }

  get syncLabel() {
    return 'signatures';
  }

  get resourceName() {
    return 'signatures';
  }

  get lastSync() {
    return this.account._lastSyncSignatures;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getSignatures(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _signature2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
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

      _this2.account._lastSyncSignatures = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('signature:save', { signature: object });
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
exports.default = DownloadSignatures;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2lnbmF0dXJlcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFNpZ25hdHVyZXMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jU2lnbmF0dXJlcyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0U2lnbmF0dXJlcyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwicHJvY2Vzc2VkIiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0Iiwic2F2ZSIsInRyaWdnZXIiLCJzaWduYXR1cmUiLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTixvQ0FBa0Q7QUFDL0QsTUFBSUMsZ0JBQUosR0FBdUI7QUFDckIsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sWUFBUDtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLQyxPQUFMLENBQWFDLG1CQUFwQjtBQUNEOztBQUVLQyxjQUFOLENBQW1CRixPQUFuQixFQUE0QkQsUUFBNUIsRUFBc0NJLFFBQXRDLEVBQWdEO0FBQUE7O0FBQUE7QUFDOUMsYUFBTyxpQkFBT0MsYUFBUCxDQUFxQkosT0FBckIsRUFBOEJHLFFBQTlCLEVBQXdDLE1BQUtFLFFBQTdDLENBQVA7QUFEOEM7QUFFL0M7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJQLE9BQXZCLEVBQWdDUSxVQUFoQyxFQUE0QztBQUMxQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZVCxRQUFRVSxLQUFyQixFQUE0QkMsYUFBYUgsV0FBV0ksVUFBcEQsRUFBakMsQ0FBUDtBQUNEOztBQUVLQyxTQUFOLENBQWNDLE1BQWQsRUFBc0JOLFVBQXRCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaENNLGFBQU9DLHVCQUFQLENBQStCUCxVQUEvQjs7QUFFQSxZQUFNUSxZQUFZLENBQUNGLE9BQU9HLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRU4sT0FBT08sU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0EsVUFBSVosV0FBV2MsU0FBZixFQUEwQjtBQUN4QixZQUFJLENBQUNSLE9BQU9TLFlBQVosRUFBMEI7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNEO0FBQ0YsT0FiRCxNQWFPO0FBQ0xULGVBQU9TLFlBQVAsR0FBc0IsS0FBdEI7QUFDRDs7QUFFRCxVQUFJVCxPQUFPUyxZQUFQLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CVCxlQUFPUyxZQUFQLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQsWUFBTSxPQUFLQyxNQUFMLENBQVlWLE1BQVosRUFBb0JOLFdBQVdpQixPQUEvQixFQUF3QyxZQUF4QyxFQUFzRCxTQUF0RCxDQUFOOztBQUVBLFVBQUlYLE9BQU9ZLFVBQVgsRUFBdUI7QUFDckIsY0FBTUMsU0FBUyxNQUFNLE9BQUszQixPQUFMLENBQWE0QixlQUFiLENBQTZCLEVBQUNqQixhQUFhSCxXQUFXcUIsU0FBekIsRUFBN0IsQ0FBckI7O0FBRUEsWUFBSUYsTUFBSixFQUFZO0FBQ1ZiLGlCQUFPZ0IsWUFBUCxHQUFzQkgsT0FBT2pCLEtBQTdCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFLVixPQUFMLENBQWFDLG1CQUFiLEdBQW1DYSxPQUFPaUIsVUFBMUM7O0FBRUEsWUFBTWpCLE9BQU9rQixJQUFQLEVBQU47O0FBRUEsVUFBSWhCLFNBQUosRUFBZTtBQUNiLGNBQU0sT0FBS2lCLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUFDQyxXQUFXcEIsTUFBWixFQUEvQixDQUFOO0FBQ0Q7QUEzQytCO0FBNENqQzs7QUFFS3FCLFFBQU4sR0FBZTtBQUFBOztBQUFBO0FBQ2I7QUFDQSxZQUFNLE9BQUtuQyxPQUFMLENBQWFnQyxJQUFiLEVBQU47QUFGYTtBQUdkOztBQUVESSxPQUFLcEMsT0FBTCxFQUFjcUMsT0FBZCxFQUF1QjtBQUNyQkMsWUFBUUMsR0FBUixDQUFZdkMsUUFBUXdDLGdCQUFSLENBQXlCQyxLQUFyQyxFQUE0QyxTQUFTQyxHQUFyRDtBQUNEO0FBOUU4RDtrQkFBNUMvQyxrQiIsImZpbGUiOiJkb3dubG9hZC1zaWduYXR1cmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkU2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFNpZ25hdHVyZSBmcm9tICcuLi8uLi9tb2RlbHMvc2lnbmF0dXJlJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkU2lnbmF0dXJlcyBleHRlbmRzIERvd25sb2FkU2VxdWVuY2Uge1xuICBnZXQgc3luY1Jlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jU2lnbmF0dXJlcztcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldFNpZ25hdHVyZXMoYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFNpZ25hdHVyZS5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiBhY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMucHJvY2Vzc2VkKSB7XG4gICAgICBpZiAoIW9iamVjdC5pc0Rvd25sb2FkZWQpIHtcbiAgICAgICAgLy8gcXVldWUucHVzaChhdHRyaWJ1dGVzLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgLy8gICBpZiAoZXJyKSB7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygnRVJST1IgRE9XTkxPQURJTkcnLCBlcnIpO1xuICAgICAgICAvLyAgICAgdGhyb3cgZXJyO1xuICAgICAgICAvLyAgIH1cblxuICAgICAgICAvLyAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSB0cnVlO1xuICAgICAgICAvLyAgIC8vIGRvIHdlIG5lZWQgdG8gYXdhaXQgdGhpcyBzb21laG93P1xuICAgICAgICAvLyAgIG9iamVjdC5zYXZlKCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG5cbiAgICBpZiAob2JqZWN0Ll9mb3JtUm93SUQpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xuXG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY1NpZ25hdHVyZXMgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3NpZ25hdHVyZTpzYXZlJywge3NpZ25hdHVyZTogb2JqZWN0fSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxuICAgIGF3YWl0IHRoaXMuYWNjb3VudC5zYXZlKCk7XG4gIH1cblxuICBmYWlsKGFjY291bnQsIHJlc3VsdHMpIHtcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50Lm9yZ2FuaXphdGlvbk5hbWUuZ3JlZW4sICdmYWlsZWQnLnJlZCk7XG4gIH1cbn1cbiJdfQ==