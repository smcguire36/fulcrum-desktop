'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _changeset = require('../../models/changeset');

var _changeset2 = _interopRequireDefault(_changeset);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChangesets extends _downloadQuerySequence2.default {
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

  get useRestAPI() {
    return false;
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

  attributesForQueryRow(row) {
    return {
      id: row[0],
      created_at: row[1],
      updated_at: row[2],
      closed_at: row[3],
      metadata: row[4] && JSON.parse(row[4]),
      min_lat: row[5],
      max_lat: row[6],
      min_lon: row[7],
      max_lon: row[8],
      number_of_changes: row[9],
      number_created: row[10],
      number_updated: row[11],
      number_deleted: row[12],
      form_id: row[13],
      created_by_id: row[14],
      updated_by_id: row[15],
      closed_by_id: row[16],
      created_by: row[17],
      updated_by: row[18],
      closed_by: row[19]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "changeset_id" AS "id",
  to_char(pg_catalog.timezone('UTC', "records"."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "records"."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  to_char(pg_catalog.timezone('UTC', "records"."closed_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "closed_at",
  "metadata" AS "metadata",
  "min_lat" AS min_lat,
  "max_lat" AS max_lat,
  "min_lon" AS min_lon,
  "max_lon" AS max_lon,
  "number_of_changes" AS number_of_changes,
  "number_of_creates" AS number_created,
  "number_of_updates" AS number_updated,
  "number_of_deletes" AS number_deleted,
  "form_id" AS form_id,
  "created_by_id" AS "created_by_id",
  "updated_by_id" AS "updated_by_id",
  "closed_by_id" AS "closed_by_id",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by",
  "closed_by"."name" AS "closed_by"
FROM "changesets" AS "records"
LEFT OUTER JOIN "memberships" AS "created_by" ON (("records"."created_by_id") = ("created_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "updated_by" ON (("records"."updated_by_id") = ("updated_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "closed_by" ON (("records"."closed_by_id") = ("closed_by"."user_id"))
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadChangesets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENoYW5nZXNldHMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jQ2hhbmdlc2V0cyIsInVzZVJlc3RBUEkiLCJmZXRjaE9iamVjdHMiLCJzZXF1ZW5jZSIsImdldENoYW5nZXNldHMiLCJwYWdlU2l6ZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwiaWQiLCJwcm9jZXNzIiwib2JqZWN0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY2xvc2VkX2J5X2lkIiwiY3JlYXRlZF9ieV9pZCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsImNoYW5nZXNldCIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImNyZWF0ZWRfYXQiLCJjbG9zZWRfYXQiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsIm1pbl9sYXQiLCJtYXhfbGF0IiwibWluX2xvbiIsIm1heF9sb24iLCJudW1iZXJfb2ZfY2hhbmdlcyIsIm51bWJlcl9jcmVhdGVkIiwibnVtYmVyX3VwZGF0ZWQiLCJudW1iZXJfZGVsZXRlZCIsInVwZGF0ZWRfYnlfaWQiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9ieSIsImNsb3NlZF9ieSIsImdlbmVyYXRlUXVlcnki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U0xTLGVBQVNULElBQUksQ0FBSixDQVRKO0FBVUxVLHlCQUFtQlYsSUFBSSxDQUFKLENBVmQ7QUFXTFcsc0JBQWdCWCxJQUFJLEVBQUosQ0FYWDtBQVlMWSxzQkFBZ0JaLElBQUksRUFBSixDQVpYO0FBYUxhLHNCQUFnQmIsSUFBSSxFQUFKLENBYlg7QUFjTGhCLGVBQVNnQixJQUFJLEVBQUosQ0FkSjtBQWVMZCxxQkFBZWMsSUFBSSxFQUFKLENBZlY7QUFnQkxjLHFCQUFlZCxJQUFJLEVBQUosQ0FoQlY7QUFpQkxmLG9CQUFjZSxJQUFJLEVBQUosQ0FqQlQ7QUFrQkxlLGtCQUFZZixJQUFJLEVBQUosQ0FsQlA7QUFtQkxnQixrQkFBWWhCLElBQUksRUFBSixDQW5CUDtBQW9CTGlCLGlCQUFXakIsSUFBSSxFQUFKO0FBcEJOLEtBQVA7QUFzQkQ7O0FBRURrQixnQkFBY3RELFFBQWQsRUFBd0J1RCxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUN6RCxRQUFWLEVBQW9CMEQsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQTJCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQTlCVjtBQWdDRDtBQXJIbUU7a0JBQWpEaEUsa0IiLCJmaWxlIjoiZG93bmxvYWQtY2hhbmdlc2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IENoYW5nZXNldCBmcm9tICcuLi8uLi9tb2RlbHMvY2hhbmdlc2V0JztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQ2hhbmdlc2V0cyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBDbGllbnQuZ2V0Q2hhbmdlc2V0cyhhY2NvdW50LCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gQ2hhbmdlc2V0LmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkfSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY2xvc2VkX2J5X2lkLCAnX2Nsb3NlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG5cbiAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdjaGFuZ2VzZXQ6c2F2ZScsIHtjaGFuZ2VzZXQ6IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgY2xvc2VkX2F0OiByb3dbM10sXG4gICAgICBtZXRhZGF0YTogcm93WzRdICYmIEpTT04ucGFyc2Uocm93WzRdKSxcbiAgICAgIG1pbl9sYXQ6IHJvd1s1XSxcbiAgICAgIG1heF9sYXQ6IHJvd1s2XSxcbiAgICAgIG1pbl9sb246IHJvd1s3XSxcbiAgICAgIG1heF9sb246IHJvd1s4XSxcbiAgICAgIG51bWJlcl9vZl9jaGFuZ2VzOiByb3dbOV0sXG4gICAgICBudW1iZXJfY3JlYXRlZDogcm93WzEwXSxcbiAgICAgIG51bWJlcl91cGRhdGVkOiByb3dbMTFdLFxuICAgICAgbnVtYmVyX2RlbGV0ZWQ6IHJvd1sxMl0sXG4gICAgICBmb3JtX2lkOiByb3dbMTNdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzE0XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1sxNV0sXG4gICAgICBjbG9zZWRfYnlfaWQ6IHJvd1sxNl0sXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTddLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzE4XSxcbiAgICAgIGNsb3NlZF9ieTogcm93WzE5XVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcImNoYW5nZXNldF9pZFwiIEFTIFwiaWRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNsb3NlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xvc2VkX2F0XCIsXG4gIFwibWV0YWRhdGFcIiBBUyBcIm1ldGFkYXRhXCIsXG4gIFwibWluX2xhdFwiIEFTIG1pbl9sYXQsXG4gIFwibWF4X2xhdFwiIEFTIG1heF9sYXQsXG4gIFwibWluX2xvblwiIEFTIG1pbl9sb24sXG4gIFwibWF4X2xvblwiIEFTIG1heF9sb24sXG4gIFwibnVtYmVyX29mX2NoYW5nZXNcIiBBUyBudW1iZXJfb2ZfY2hhbmdlcyxcbiAgXCJudW1iZXJfb2ZfY3JlYXRlc1wiIEFTIG51bWJlcl9jcmVhdGVkLFxuICBcIm51bWJlcl9vZl91cGRhdGVzXCIgQVMgbnVtYmVyX3VwZGF0ZWQsXG4gIFwibnVtYmVyX29mX2RlbGV0ZXNcIiBBUyBudW1iZXJfZGVsZXRlZCxcbiAgXCJmb3JtX2lkXCIgQVMgZm9ybV9pZCxcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICBcImNsb3NlZF9ieV9pZFwiIEFTIFwiY2xvc2VkX2J5X2lkXCIsXG4gIFwiY3JlYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBcInVwZGF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcInVwZGF0ZWRfYnlcIixcbiAgXCJjbG9zZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNsb3NlZF9ieVwiXG5GUk9NIFwiY2hhbmdlc2V0c1wiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cInVwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNsb3NlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjbG9zZWRfYnlfaWRcIikgPSAoXCJjbG9zZWRfYnlcIi5cInVzZXJfaWRcIikpXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=