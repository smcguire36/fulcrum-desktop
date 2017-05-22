'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _record = require('../../models/record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

class DownloadRecords extends _downloadQuerySequence2.default {
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
        yield _this2.lookup(object, attributes.changeset_id, '_changesetRowID', 'getChangeset');

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

  attributesForQueryRow(row) {
    return {
      status: row[0],
      version: row[1],
      id: row[2],
      created_at: row[3],
      updated_at: row[4],
      client_created_at: row[5],
      client_updated_at: row[6],
      created_by_id: row[7],
      updated_by_id: row[8],
      form_id: row[9],
      project_id: row[10],
      assigned_to_id: row[11],
      form_values: JSON.parse(row[12]),
      latitude: row[13],
      longitude: row[14],
      altitude: row[15],
      speed: row[16],
      course: row[17],
      horizontal_accuracy: row[18],
      vertical_accuracy: row[19],
      edited_duration: row[20],
      updated_duration: row[21],
      created_duration: row[22],
      created_by: row[23],
      updated_by: row[24],
      assigned_to: row[25],
      project: row[26],
      changeset_id: row[27]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "_status" AS "status",
  "_version" AS "version",
  "_record_id" AS "id",
  to_char(pg_catalog.timezone('UTC', "_server_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "_server_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  to_char(pg_catalog.timezone('UTC', "_created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_created_at",
  to_char(pg_catalog.timezone('UTC', "_updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "client_updated_at",
  "_created_by_id" AS "created_by_id",
  "_updated_by_id" AS "updated_by_id",
  '${this.form.id}'::text AS "form_id",
  "_project_id" AS "project_id",
  "_assigned_to_id" AS "assigned_to_id",
  "_form_values" AS "form_values",
  "_latitude" AS "latitude",
  "_longitude" AS "longitude",
  "_altitude" AS "altitude",
  "_speed" AS "speed",
  "_course" AS "course",
  "_horizontal_accuracy" AS "horizontal_accuracy",
  "_vertical_accuracy" AS "vertical_accuracy",
  "_edited_duration" AS "edited_duration",
  "_updated_duration" AS "updated_duration",
  "_created_duration" AS "created_duration",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by",
  "assigned_to"."name" AS "assigned_to",
  "project"."name" AS "project",
  "_changeset_id" AS "changeset_id"
FROM "${this.form.id}/_full" AS "records"
LEFT OUTER JOIN "memberships" AS "created_by" ON (("records"."_created_by_id") = ("created_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "updated_by" ON (("records"."_updated_by_id") = ("updated_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "assigned_to" ON (("records"."_assigned_to_id") = ("assigned_to"."user_id"))
LEFT OUTER JOIN "projects" AS "project" ON (("records"."_project_id") = ("project"."project_id"))
WHERE
  _server_updated_at > '${sequenceString}'
ORDER BY
  _server_updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNSZXNvdXJjZVNjb3BlIiwiaWQiLCJzeW5jTGFiZWwiLCJuYW1lIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJfbGFzdFN5bmMiLCJmZXRjaE9iamVjdHMiLCJhY2NvdW50Iiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwicGFnZVNpemUiLCJnZXRSZWNvcmRzSGlzdG9yeSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwicHJvY2VzcyIsIm9iamVjdCIsImhpc3RvcnlfY2hhbmdlX3R5cGUiLCJfZm9ybSIsIl9mb3JtUm93SUQiLCJkZWxldGUiLCJfaGFzQ2hhbmdlcyIsInRyaWdnZXIiLCJyZWNvcmQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsInVwZGF0ZWRBdCIsImxvb2t1cCIsInByb2plY3RfaWQiLCJhc3NpZ25lZF90b19pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiY2hhbmdlc2V0X2lkIiwic2F2ZSIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsInN0YXR1cyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50X2NyZWF0ZWRfYXQiLCJjbGllbnRfdXBkYXRlZF9hdCIsImZvcm1faWQiLCJmb3JtX3ZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiYWx0aXR1ZGUiLCJzcGVlZCIsImNvdXJzZSIsImhvcml6b250YWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsImVkaXRlZF9kdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJhc3NpZ25lZF90byIsInByb2plY3QiLCJnZW5lcmF0ZVF1ZXJ5IiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRWUsTUFBTUEsZUFBTix5Q0FBb0Q7QUFDakVDLG9CQUE2QjtBQUFBLFFBQWpCLEVBQUNDLElBQUQsRUFBaUI7QUFBQSxRQUFQQyxJQUFPOztBQUMzQixVQUFNQSxJQUFOOztBQUVBLFNBQUtELElBQUwsR0FBWUEsSUFBWjtBQUNEOztBQUVELE1BQUlFLGdCQUFKLEdBQXVCO0FBQ3JCLFdBQU8sU0FBUDtBQUNEOztBQUVELE1BQUlDLGlCQUFKLEdBQXdCO0FBQ3RCLFdBQU8sS0FBS0gsSUFBTCxDQUFVSSxFQUFqQjtBQUNEOztBQUVELE1BQUlDLFNBQUosR0FBZ0I7QUFDZCxXQUFPLEtBQUtMLElBQUwsQ0FBVU0sSUFBakI7QUFDRDs7QUFFRCxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sU0FBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sS0FBS1IsSUFBTCxDQUFVUyxTQUFqQjtBQUNEOztBQUVLQyxjQUFOLENBQW1CQyxPQUFuQixFQUE0QkgsUUFBNUIsRUFBc0NJLFFBQXRDLEVBQWdEO0FBQUE7O0FBQUE7QUFDOUMsYUFBT0osWUFBWSxJQUFaLEdBQW9CLE1BQU0saUJBQU9LLFVBQVAsQ0FBa0JGLE9BQWxCLEVBQTJCLE1BQUtYLElBQWhDLEVBQXNDWSxRQUF0QyxFQUFnRCxNQUFLRSxRQUFyRCxDQUExQixHQUNvQixNQUFNLGlCQUFPQyxpQkFBUCxD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RSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7OztLQVdOLEtBQUtoRixJQUFMLENBQVVJLEVBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUFtQlgsS0FBS0osSUFBTCxDQUFVSSxFQUFJOzs7Ozs7MEJBTUcwRSxjQUFlOzs7UUFHakNELEtBQU07Q0F2Q1Y7QUF5Q0Q7QUFsS2dFO2tCQUE5Qy9FLGUiLCJmaWxlIjoiZG93bmxvYWQtcmVjb3Jkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFJlY29yZCBmcm9tICcuLi8uLi9tb2RlbHMvcmVjb3JkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRSZWNvcmRzIGV4dGVuZHMgRG93bmxvYWRRdWVyeVNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZWNvcmRzJztcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VTY29wZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmlkO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncmVjb3Jkcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5fbGFzdFN5bmM7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIGxhc3RTeW5jID09IG51bGwgPyAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHMoYWNjb3VudCwgdGhpcy5mb3JtLCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWR9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZXMuaGlzdG9yeV9jaGFuZ2VfdHlwZSA9PT0gJ2QnKSB7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XG5cbiAgICAgICAgYXdhaXQgb2JqZWN0LmRlbGV0ZSgpO1xuXG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOmRlbGV0ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgICB0aGlzLmZvcm0uX2xhc3RTeW5jID0gb2JqZWN0LnVwZGF0ZWRBdDtcblxuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnByb2plY3RfaWQsICdfcHJvamVjdFJvd0lEJywgJ2dldFByb2plY3QnKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNoYW5nZXNldF9pZCwgJ19jaGFuZ2VzZXRSb3dJRCcsICdnZXRDaGFuZ2VzZXQnKTtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICB0aGlzLl9oYXNDaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmQ6c2F2ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmZvcm0uc2F2ZSgpO1xuXG4gICAgaWYgKHRoaXMuX2hhc0NoYW5nZXMpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkczpmaW5pc2gnLCB7Zm9ybTogdGhpcy5mb3JtfSk7XG4gICAgfVxuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IHJvd1swXSxcbiAgICAgIHZlcnNpb246IHJvd1sxXSxcbiAgICAgIGlkOiByb3dbMl0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbM10sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbNF0sXG4gICAgICBjbGllbnRfY3JlYXRlZF9hdDogcm93WzVdLFxuICAgICAgY2xpZW50X3VwZGF0ZWRfYXQ6IHJvd1s2XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s4XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s5XSxcbiAgICAgIHByb2plY3RfaWQ6IHJvd1sxMF0sXG4gICAgICBhc3NpZ25lZF90b19pZDogcm93WzExXSxcbiAgICAgIGZvcm1fdmFsdWVzOiBKU09OLnBhcnNlKHJvd1sxMl0pLFxuICAgICAgbGF0aXR1ZGU6IHJvd1sxM10sXG4gICAgICBsb25naXR1ZGU6IHJvd1sxNF0sXG4gICAgICBhbHRpdHVkZTogcm93WzE1XSxcbiAgICAgIHNwZWVkOiByb3dbMTZdLFxuICAgICAgY291cnNlOiByb3dbMTddLFxuICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzE4XSxcbiAgICAgIHZlcnRpY2FsX2FjY3VyYWN5OiByb3dbMTldLFxuICAgICAgZWRpdGVkX2R1cmF0aW9uOiByb3dbMjBdLFxuICAgICAgdXBkYXRlZF9kdXJhdGlvbjogcm93WzIxXSxcbiAgICAgIGNyZWF0ZWRfZHVyYXRpb246IHJvd1syMl0sXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMjNdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzI0XSxcbiAgICAgIGFzc2lnbmVkX3RvOiByb3dbMjVdLFxuICAgICAgcHJvamVjdDogcm93WzI2XSxcbiAgICAgIGNoYW5nZXNldF9pZDogcm93WzI3XVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcIl9zdGF0dXNcIiBBUyBcInN0YXR1c1wiLFxuICBcIl92ZXJzaW9uXCIgQVMgXCJ2ZXJzaW9uXCIsXG4gIFwiX3JlY29yZF9pZFwiIEFTIFwiaWRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9zZXJ2ZXJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3NlcnZlcl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xpZW50X2NyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbGllbnRfdXBkYXRlZF9hdFwiLFxuICBcIl9jcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwiX3VwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgJyR7IHRoaXMuZm9ybS5pZCB9Jzo6dGV4dCBBUyBcImZvcm1faWRcIixcbiAgXCJfcHJvamVjdF9pZFwiIEFTIFwicHJvamVjdF9pZFwiLFxuICBcIl9hc3NpZ25lZF90b19pZFwiIEFTIFwiYXNzaWduZWRfdG9faWRcIixcbiAgXCJfZm9ybV92YWx1ZXNcIiBBUyBcImZvcm1fdmFsdWVzXCIsXG4gIFwiX2xhdGl0dWRlXCIgQVMgXCJsYXRpdHVkZVwiLFxuICBcIl9sb25naXR1ZGVcIiBBUyBcImxvbmdpdHVkZVwiLFxuICBcIl9hbHRpdHVkZVwiIEFTIFwiYWx0aXR1ZGVcIixcbiAgXCJfc3BlZWRcIiBBUyBcInNwZWVkXCIsXG4gIFwiX2NvdXJzZVwiIEFTIFwiY291cnNlXCIsXG4gIFwiX2hvcml6b250YWxfYWNjdXJhY3lcIiBBUyBcImhvcml6b250YWxfYWNjdXJhY3lcIixcbiAgXCJfdmVydGljYWxfYWNjdXJhY3lcIiBBUyBcInZlcnRpY2FsX2FjY3VyYWN5XCIsXG4gIFwiX2VkaXRlZF9kdXJhdGlvblwiIEFTIFwiZWRpdGVkX2R1cmF0aW9uXCIsXG4gIFwiX3VwZGF0ZWRfZHVyYXRpb25cIiBBUyBcInVwZGF0ZWRfZHVyYXRpb25cIixcbiAgXCJfY3JlYXRlZF9kdXJhdGlvblwiIEFTIFwiY3JlYXRlZF9kdXJhdGlvblwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwiYXNzaWduZWRfdG9cIi5cIm5hbWVcIiBBUyBcImFzc2lnbmVkX3RvXCIsXG4gIFwicHJvamVjdFwiLlwibmFtZVwiIEFTIFwicHJvamVjdFwiLFxuICBcIl9jaGFuZ2VzZXRfaWRcIiBBUyBcImNoYW5nZXNldF9pZFwiXG5GUk9NIFwiJHsgdGhpcy5mb3JtLmlkIH0vX2Z1bGxcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiX2NyZWF0ZWRfYnlfaWRcIikgPSAoXCJjcmVhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcInVwZGF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiX3VwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImFzc2lnbmVkX3RvXCIgT04gKChcInJlY29yZHNcIi5cIl9hc3NpZ25lZF90b19pZFwiKSA9IChcImFzc2lnbmVkX3RvXCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwicHJvamVjdHNcIiBBUyBcInByb2plY3RcIiBPTiAoKFwicmVjb3Jkc1wiLlwiX3Byb2plY3RfaWRcIikgPSAoXCJwcm9qZWN0XCIuXCJwcm9qZWN0X2lkXCIpKVxuV0hFUkVcbiAgX3NlcnZlcl91cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgX3NlcnZlcl91cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==