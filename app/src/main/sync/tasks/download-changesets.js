'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _changeset = require('../../models/changeset');

var _changeset2 = _interopRequireDefault(_changeset);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChangesets extends _downloadSequence2.default {
  get syncResourceName() {
    return 'changesets';
  }

  get syncLabel() {
    return 'changesets';
  }

  get resourceName() {
    return 'changesets';
  }

  get lastSync() {
    return this.account._lastSyncChangesets;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getChangesets(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _changeset2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      object.updateFromAPIAttributes(attributes);

      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      yield _this2.lookup(object, attributes.form_id, '_formRowID', 'getForm');
      yield _this2.lookup(object, attributes.closed_by_id, '_closedByRowID', 'getUser');
      yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');

      _this2.account._lastSyncChangesets = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('changeset:save', { changeset: object });
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
exports.default = DownloadChangesets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENoYW5nZXNldHMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jQ2hhbmdlc2V0cyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0Q2hhbmdlc2V0cyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJpZCIsInByb2Nlc3MiLCJvYmplY3QiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsImxvb2t1cCIsImZvcm1faWQiLCJjbG9zZWRfYnlfaWQiLCJjcmVhdGVkX2J5X2lkIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwiY2hhbmdlc2V0IiwiZmluaXNoIiwiZmFpbCIsInJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwib3JnYW5pemF0aW9uTmFtZSIsImdyZWVuIiwicmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsa0JBQU4sb0NBQWtEO0FBQy9ELE1BQUlDLGdCQUFKLEdBQXVCO0FBQ3JCLFdBQU8sWUFBUDtBQUNEOztBQUVELE1BQUlDLFNBQUosR0FBZ0I7QUFDZCxXQUFPLFlBQVA7QUFDRDs7QUFFRCxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sWUFBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sS0FBS0MsT0FBTCxDQUFhQyxtQkFBcEI7QUFDRDs7QUFFS0MsY0FBTixDQUFtQkYsT0FBbkIsRUFBNEJELFFBQTVCLEVBQXNDSSxRQUF0QyxFQUFnRDtBQUFBOztBQUFBO0FBQzlDLGFBQU8saUJBQU9DLGFBQVAsQ0FBcUJKLE9BQXJCLEVBQThCRyxRQUE5QixFQUF3QyxNQUFLRSxRQUE3QyxDQUFQO0FBRDhDO0FBRS9DOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCUCxPQUF2QixFQUFnQ1EsVUFBaEMsRUFBNEM7QUFDMUMsV0FBTyxvQkFBVUYsWUFBVixDQUF1QkMsUUFBdkIsRUFBaUMsRUFBQ0UsWUFBWVQsUUFBUVUsS0FBckIsRUFBNEJDLGFBQWFILFdBQVdJLEVBQXBELEVBQWpDLENBQVA7QUFDRDs7QUFFS0MsU0FBTixDQUFjQyxNQUFkLEVBQXNCTixVQUF0QixFQUFrQztBQUFBOztBQUFBO0FBQ2hDTSxhQUFPQyx1QkFBUCxDQUErQlAsVUFBL0I7O0FBRUEsWUFBTVEsWUFBWSxDQUFDRixPQUFPRyxXQUFSLElBQ0EsdUJBQVVDLGlCQUFWLENBQTRCVixXQUFXVyxVQUF2QyxFQUFtREMsT0FBbkQsT0FBaUVOLE9BQU9PLFNBQVAsQ0FBaUJELE9BQWpCLEVBRG5GOztBQUdBLFlBQU0sT0FBS0UsTUFBTCxDQUFZUixNQUFaLEVBQW9CTixXQUFXZSxPQUEvQixFQUF3QyxZQUF4QyxFQUFzRCxTQUF0RCxDQUFOO0FBQ0EsWUFBTSxPQUFLRCxNQUFMLENBQVlSLE1BQVosRUFBb0JOLFdBQVdnQixZQUEvQixFQUE2QyxnQkFBN0MsRUFBK0QsU0FBL0QsQ0FBTjtBQUNBLFlBQU0sT0FBS0YsTUFBTCxDQUFZUixNQUFaLEVBQW9CTixXQUFXaUIsYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47O0FBRUEsYUFBS3pCLE9BQUwsQ0FBYUMsbUJBQWIsR0FBbUNhLE9BQU9ZLFVBQTFDOztBQUVBLFlBQU1aLE9BQU9hLElBQVAsRUFBTjs7QUFFQSxVQUFJWCxTQUFKLEVBQWU7QUFDYixjQUFNLE9BQUtZLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUFDQyxXQUFXZixNQUFaLEVBQS9CLENBQU47QUFDRDtBQWhCK0I7QUFpQmpDOztBQUVLZ0IsUUFBTixHQUFlO0FBQUE7O0FBQUE7QUFDYjtBQUNBLFlBQU0sT0FBSzlCLE9BQUwsQ0FBYTJCLElBQWIsRUFBTjtBQUZhO0FBR2Q7O0FBRURJLE9BQUsvQixPQUFMLEVBQWNnQyxPQUFkLEVBQXVCO0FBQ3JCQyxZQUFRQyxHQUFSLENBQVlsQyxRQUFRbUMsZ0JBQVIsQ0FBeUJDLEtBQXJDLEVBQTRDLFNBQVNDLEdBQXJEO0FBQ0Q7QUFuRDhEO2tCQUE1QzFDLGtCIiwiZmlsZSI6ImRvd25sb2FkLWNoYW5nZXNldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgQ2hhbmdlc2V0IGZyb20gJy4uLy4uL21vZGVscy9jaGFuZ2VzZXQnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRDaGFuZ2VzZXRzIGV4dGVuZHMgRG93bmxvYWRTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBDbGllbnQuZ2V0Q2hhbmdlc2V0cyhhY2NvdW50LCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gQ2hhbmdlc2V0LmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkfSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY2xvc2VkX2J5X2lkLCAnX2Nsb3NlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG5cbiAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdjaGFuZ2VzZXQ6c2F2ZScsIHtjaGFuZ2VzZXQ6IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG59XG4iXX0=