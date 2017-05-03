'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _record = require('../../models/record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class DownloadRecords extends _downloadSequence2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  get syncResourceName() {
    return 'records';
  }

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return lastSync == null ? yield _client2.default.getRecords(account, _this.form, sequence, _this.pageSize) : yield _client2.default.getRecordsHistory(account, _this.form, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _record2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      if (attributes.history_change_type === 'd') {
        if (object) {
          object._form = _this2.form;
          object._formRowID = _this2.form.rowID;

          yield object.delete();

          _this2._hasChanges = true;

          yield _this2.trigger('record:delete', { record: object });
        }
      } else {
        const isChanged = !object.isPersisted || attributes.version !== object.version;

        object.updateFromAPIAttributes(attributes);
        object._form = _this2.form;
        object._formRowID = _this2.form.rowID;

        _this2.form._lastSync = object.updatedAt;

        yield _this2.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
        yield _this2.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
        yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
        yield _this2.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

        yield object.save();

        if (isChanged) {
          _this2._hasChanges = true;
          yield _this2.trigger('record:save', { record: object });
        }
      }
    })();
  }

  finish() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      // update the lastSync date
      yield _this3.form.save();

      if (_this3._hasChanges) {
        yield _this3.trigger('records:finish', { form: _this3.form });
      }
    })();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }
}
exports.default = DownloadRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNSZXNvdXJjZVNjb3BlIiwiaWQiLCJzeW5jTGFiZWwiLCJuYW1lIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJfbGFzdFN5bmMiLCJmZXRjaE9iamVjdHMiLCJhY2NvdW50Iiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwicGFnZVNpemUiLCJnZXRSZWNvcmRzSGlzdG9yeSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwicHJvY2VzcyIsIm9iamVjdCIsImhpc3RvcnlfY2hhbmdlX3R5cGUiLCJfZm9ybSIsIl9mb3JtUm93SUQiLCJkZWxldGUiLCJfaGFzQ2hhbmdlcyIsInRyaWdnZXIiLCJyZWNvcmQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsInVwZGF0ZWRBdCIsImxvb2t1cCIsInByb2plY3RfaWQiLCJhc3NpZ25lZF90b19pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwic2F2ZSIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZUFBTixvQ0FBK0M7QUFDNURDLG9CQUE2QjtBQUFBLFFBQWpCLEVBQUNDLElBQUQsRUFBaUI7QUFBQSxRQUFQQyxJQUFPOztBQUMzQixVQUFNQSxJQUFOOztBQUVBLFNBQUtELElBQUwsR0FBWUEsSUFBWjtB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akM7O0FBRUttQixRQUFOLEdBQWU7QUFBQTs7QUFBQTtBQUNiO0FBQ0EsWUFBTSxPQUFLMUMsSUFBTCxDQUFVeUMsSUFBVixFQUFOOztBQUVBLFVBQUksT0FBS2IsV0FBVCxFQUFzQjtBQUNwQixjQUFNLE9BQUtDLE9BQUwsQ0FBYSxnQkFBYixFQUErQixFQUFDN0IsTUFBTSxPQUFLQSxJQUFaLEVBQS9CLENBQU47QUFDRDtBQU5ZO0FBT2Q7O0FBRUQyQyxPQUFLaEMsT0FBTCxFQUFjaUMsT0FBZCxFQUF1QjtBQUNyQkMsWUFBUUMsR0FBUixDQUFZbkMsUUFBUW9DLGdCQUFSLENBQXlCQyxLQUFyQyxFQUE0QyxTQUFTQyxHQUFyRDtBQUNEO0FBbEYyRDtrQkFBekNuRCxlIiwiZmlsZSI6ImRvd25sb2FkLXJlY29yZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgUmVjb3JkIGZyb20gJy4uLy4uL21vZGVscy9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFJlY29yZHMgZXh0ZW5kcyBEb3dubG9hZFNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZWNvcmRzJztcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VTY29wZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmlkO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncmVjb3Jkcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5fbGFzdFN5bmM7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIGxhc3RTeW5jID09IG51bGwgPyAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHMoYWNjb3VudCwgdGhpcy5mb3JtLCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWR9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZXMuaGlzdG9yeV9jaGFuZ2VfdHlwZSA9PT0gJ2QnKSB7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XG5cbiAgICAgICAgYXdhaXQgb2JqZWN0LmRlbGV0ZSgpO1xuXG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOmRlbGV0ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgICB0aGlzLmZvcm0uX2xhc3RTeW5jID0gb2JqZWN0LnVwZGF0ZWRBdDtcblxuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnByb2plY3RfaWQsICdfcHJvamVjdFJvd0lEJywgJ2dldFByb2plY3QnKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZDpzYXZlJywge3JlY29yZDogb2JqZWN0fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxuICAgIGF3YWl0IHRoaXMuZm9ybS5zYXZlKCk7XG5cbiAgICBpZiAodGhpcy5faGFzQ2hhbmdlcykge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmRzOmZpbmlzaCcsIHtmb3JtOiB0aGlzLmZvcm19KTtcbiAgICB9XG4gIH1cblxuICBmYWlsKGFjY291bnQsIHJlc3VsdHMpIHtcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50Lm9yZ2FuaXphdGlvbk5hbWUuZ3JlZW4sICdmYWlsZWQnLnJlZCk7XG4gIH1cbn1cbiJdfQ==