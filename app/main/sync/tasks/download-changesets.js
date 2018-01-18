'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _changeset = require('../../models/changeset');

var _changeset2 = _interopRequireDefault(_changeset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChangesets extends _downloadQuerySequence2.default {
  get resourceName() {
    return 'changesets';
  }

  get typeName() {
    return 'changeset';
  }

  get lastSync() {
    return this.account._lastSyncChangesets;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _changeset2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.id });
  }

  loadObject(object, attributes) {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
      yield _this.lookup(object, attributes.closed_by_id, '_closedByRowID', 'getUser');
      yield _this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');

      _this.account._lastSyncChangesets = object._updatedAt;
    })();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENoYW5nZXNldHMiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY0NoYW5nZXNldHMiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJpZCIsImxvYWRPYmplY3QiLCJvYmplY3QiLCJsb29rdXAiLCJmb3JtX2lkIiwiY2xvc2VkX2J5X2lkIiwiY3JlYXRlZF9ieV9pZCIsIl91cGRhdGVkQXQiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBkYXRlZF9hdCIsImNsb3NlZF9hdCIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwibWluX2xhdCIsIm1heF9sYXQiLCJtaW5fbG9uIiwibWF4X2xvbiIsIm51bWJlcl9vZl9jaGFuZ2VzIiwibnVtYmVyX2NyZWF0ZWQiLCJudW1iZXJfdXBkYXRlZCIsIm51bWJlcl9kZWxldGVkIiwidXBkYXRlZF9ieV9pZCIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiY2xvc2VkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDcEUsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFlBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLFdBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsbUJBQXBCO0FBQ0Q7O0FBRUQsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZLEtBQUtOLE9BQUwsQ0FBYU8sS0FBMUIsRUFBaUNDLGFBQWFILFdBQVdJLEVBQXpELEVBQWpDLENBQVA7QUFDRDs7QUFFS0MsWUFBTixDQUFpQkMsTUFBakIsRUFBeUJOLFVBQXpCLEVBQXFDO0FBQUE7O0FBQUE7QUFDbkMsWUFBTSxNQUFLTyxNQUFMLENBQVlELE1BQVosRUFBb0JOLFdBQVdRLE9BQS9CLEVBQXdDLFlBQXhDLEVBQXNELFNBQXRELENBQU47QUFDQSxZQUFNLE1BQUtELE1BQUwsQ0FBWUQsTUFBWixFQUFvQk4sV0FBV1MsWUFBL0IsRUFBNkMsZ0JBQTdDLEVBQStELFNBQS9ELENBQU47QUFDQSxZQUFNLE1BQUtGLE1BQUwsQ0FBWUQsTUFBWixFQUFvQk4sV0FBV1UsYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47O0FBRUEsWUFBS2YsT0FBTCxDQUFhQyxtQkFBYixHQUFtQ1UsT0FBT0ssVUFBMUM7QUFMbUM7QUFNcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMVCxVQUFJUyxJQUFJLENBQUosQ0FEQztBQUVMQyxrQkFBWUQsSUFBSSxDQUFKLENBRlA7QUFHTEUsa0JBQVlGLElBQUksQ0FBSixDQUhQO0FBSUxHLGlCQUFXSCxJQUFJLENBQUosQ0FKTjtBQUtMSSxnQkFBVUosSUFBSSxDQUFKLEtBQVVLLEtBQUtDLEtBQUwsQ0FBV04sSUFBSSxDQUFKLENBQVgsQ0FMZjtBQU1MTyxlQUFTUCxJQUFJLENBQUosQ0FOSjtBQU9MUSxlQUFTUixJQUFJLENBQUosQ0FQSjtBQVFMUyxlQUFTVCxJQUFJLENBQUosQ0FSSjtBQVNMVSxlQUFTVixJQUFJLENBQUosQ0FUSjtBQVVMVyx5QkFBbUJYLElBQUksQ0FBSixDQVZkO0FBV0xZLHNCQUFnQlosSUFBSSxFQUFKLENBWFg7QUFZTGEsc0JBQWdCYixJQUFJLEVBQUosQ0FaWDtBQWFMYyxzQkFBZ0JkLElBQUksRUFBSixDQWJYO0FBY0xMLGVBQVNLLElBQUksRUFBSixDQWRKO0FBZUxILHFCQUFlRyxJQUFJLEVBQUosQ0FmVjtBQWdCTGUscUJBQWVmLElBQUksRUFBSixDQWhCVjtBQWlCTEosb0JBQWNJLElBQUksRUFBSixDQWpCVDtBQWtCTGdCLGtCQUFZaEIsSUFBSSxFQUFKLENBbEJQO0FBbUJMaUIsa0JBQVlqQixJQUFJLEVBQUosQ0FuQlA7QUFvQkxrQixpQkFBV2xCLElBQUksRUFBSjtBQXBCTixLQUFQO0FBc0JEOztBQUVEbUIsZ0JBQWNDLFFBQWQsRUFBd0JDLEtBQXhCLEVBQStCO0FBQzdCLFVBQU1DLGlCQUFpQixJQUFJQyxJQUFKLENBQVMsQ0FBQ0gsUUFBVixFQUFvQkksV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQTJCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQTlCVjtBQWdDRDtBQXpGbUU7a0JBQWpEM0Msa0IiLCJmaWxlIjoiZG93bmxvYWQtY2hhbmdlc2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2hhbmdlc2V0IGZyb20gJy4uLy4uL21vZGVscy9jaGFuZ2VzZXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZENoYW5nZXNldHMgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnY2hhbmdlc2V0cyc7XG4gIH1cblxuICBnZXQgdHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuICdjaGFuZ2VzZXQnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jQ2hhbmdlc2V0cztcbiAgfVxuXG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBDaGFuZ2VzZXQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogdGhpcy5hY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZH0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZE9iamVjdChvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jbG9zZWRfYnlfaWQsICdfY2xvc2VkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY0NoYW5nZXNldHMgPSBvYmplY3QuX3VwZGF0ZWRBdDtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIGNsb3NlZF9hdDogcm93WzNdLFxuICAgICAgbWV0YWRhdGE6IHJvd1s0XSAmJiBKU09OLnBhcnNlKHJvd1s0XSksXG4gICAgICBtaW5fbGF0OiByb3dbNV0sXG4gICAgICBtYXhfbGF0OiByb3dbNl0sXG4gICAgICBtaW5fbG9uOiByb3dbN10sXG4gICAgICBtYXhfbG9uOiByb3dbOF0sXG4gICAgICBudW1iZXJfb2ZfY2hhbmdlczogcm93WzldLFxuICAgICAgbnVtYmVyX2NyZWF0ZWQ6IHJvd1sxMF0sXG4gICAgICBudW1iZXJfdXBkYXRlZDogcm93WzExXSxcbiAgICAgIG51bWJlcl9kZWxldGVkOiByb3dbMTJdLFxuICAgICAgZm9ybV9pZDogcm93WzEzXSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1sxNF0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbMTVdLFxuICAgICAgY2xvc2VkX2J5X2lkOiByb3dbMTZdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzE3XSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxOF0sXG4gICAgICBjbG9zZWRfYnk6IHJvd1sxOV1cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJjaGFuZ2VzZXRfaWRcIiBBUyBcImlkXCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjbG9zZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNsb3NlZF9hdFwiLFxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxuICBcIm1pbl9sYXRcIiBBUyBtaW5fbGF0LFxuICBcIm1heF9sYXRcIiBBUyBtYXhfbGF0LFxuICBcIm1pbl9sb25cIiBBUyBtaW5fbG9uLFxuICBcIm1heF9sb25cIiBBUyBtYXhfbG9uLFxuICBcIm51bWJlcl9vZl9jaGFuZ2VzXCIgQVMgbnVtYmVyX29mX2NoYW5nZXMsXG4gIFwibnVtYmVyX29mX2NyZWF0ZXNcIiBBUyBudW1iZXJfY3JlYXRlZCxcbiAgXCJudW1iZXJfb2ZfdXBkYXRlc1wiIEFTIG51bWJlcl91cGRhdGVkLFxuICBcIm51bWJlcl9vZl9kZWxldGVzXCIgQVMgbnVtYmVyX2RlbGV0ZWQsXG4gIFwiZm9ybV9pZFwiIEFTIGZvcm1faWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJjbG9zZWRfYnlfaWRcIiBBUyBcImNsb3NlZF9ieV9pZFwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwiY2xvc2VkX2J5XCIuXCJuYW1lXCIgQVMgXCJjbG9zZWRfYnlcIlxuRlJPTSBcImNoYW5nZXNldHNcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjbG9zZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY2xvc2VkX2J5X2lkXCIpID0gKFwiY2xvc2VkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19