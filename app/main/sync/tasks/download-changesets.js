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
  NULL AS "created_by",
  NULL AS "updated_by",
  NULL AS "closed_by"
FROM "changesets" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadChangesets;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENoYW5nZXNldHMiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY0NoYW5nZXNldHMiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJpZCIsImxvYWRPYmplY3QiLCJvYmplY3QiLCJsb29rdXAiLCJmb3JtX2lkIiwiY2xvc2VkX2J5X2lkIiwiY3JlYXRlZF9ieV9pZCIsIl91cGRhdGVkQXQiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBkYXRlZF9hdCIsImNsb3NlZF9hdCIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwibWluX2xhdCIsIm1heF9sYXQiLCJtaW5fbG9uIiwibWF4X2xvbiIsIm51bWJlcl9vZl9jaGFuZ2VzIiwibnVtYmVyX2NyZWF0ZWQiLCJudW1iZXJfdXBkYXRlZCIsIm51bWJlcl9kZWxldGVkIiwidXBkYXRlZF9ieV9pZCIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiY2xvc2VkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDcEUsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFlBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLFdBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsbUJBQXBCO0FBQ0Q7O0FBRUQsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZLEtBQUtOLE9BQUwsQ0FBYU8sS0FBMUIsRUFBaUNDLGFBQWFILFdBQVdJLEVBQXpELEVBQWpDLENBQVA7QUFDRDs7QUFFS0MsWUFBTixDQUFpQkMsTUFBakIsRUFBeUJOLFVBQXpCLEVBQXFDO0FBQUE7O0FBQUE7QUFDbkMsWUFBTSxNQUFLTyxNQUFMLENBQVlELE1BQVosRUFBb0JOLFdBQVdRLE9BQS9CLEVBQXdDLFlBQXhDLEVBQXNELFNBQXRELENBQU47QUFDQSxZQUFNLE1BQUtELE1BQUwsQ0FBWUQsTUFBWixFQUFvQk4sV0FBV1MsWUFBL0IsRUFBNkMsZ0JBQTdDLEVBQStELFNBQS9ELENBQU47QUFDQSxZQUFNLE1BQUtGLE1BQUwsQ0FBWUQsTUFBWixFQUFvQk4sV0FBV1UsYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47O0FBRUEsWUFBS2YsT0FBTCxDQUFhQyxtQkFBYixHQUFtQ1UsT0FBT0ssVUFBMUM7QUFMbUM7QUFNcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMVCxVQUFJUyxJQUFJLENBQUosQ0FEQztBQUVMQyxrQkFBWUQsSUFBSSxDQUFKLENBRlA7QUFHTEUsa0JBQVlGLElBQUksQ0FBSixDQUhQO0FBSUxHLGlCQUFXSCxJQUFJLENBQUosQ0FKTjtBQUtMSSxnQkFBVUosSUFBSSxDQUFKLEtBQVVLLEtBQUtDLEtBQUwsQ0FBV04sSUFBSSxDQUFKLENBQVgsQ0FMZjtBQU1MTyxlQUFTUCxJQUFJLENBQUosQ0FOSjtBQU9MUSxlQUFTUixJQUFJLENBQUosQ0FQSjtBQVFMUyxlQUFTVCxJQUFJLENBQUosQ0FSSjtBQVNMVSxlQUFTVixJQUFJLENBQUosQ0FUSjtBQVVMVyx5QkFBbUJYLElBQUksQ0FBSixDQVZkO0FBV0xZLHNCQUFnQlosSUFBSSxFQUFKLENBWFg7QUFZTGEsc0JBQWdCYixJQUFJLEVBQUosQ0FaWDtBQWFMYyxzQkFBZ0JkLElBQUksRUFBSixDQWJYO0FBY0xMLGVBQVNLLElBQUksRUFBSixDQWRKO0FBZUxILHFCQUFlRyxJQUFJLEVBQUosQ0FmVjtBQWdCTGUscUJBQWVmLElBQUksRUFBSixDQWhCVjtBQWlCTEosb0JBQWNJLElBQUksRUFBSixDQWpCVDtBQWtCTGdCLGtCQUFZaEIsSUFBSSxFQUFKLENBbEJQO0FBbUJMaUIsa0JBQVlqQixJQUFJLEVBQUosQ0FuQlA7QUFvQkxrQixpQkFBV2xCLElBQUksRUFBSjtBQXBCTixLQUFQO0FBc0JEOztBQUVEbUIsZ0JBQWNDLFFBQWQsRUFBd0JDLEtBQXhCLEVBQStCO0FBQzdCLFVBQU1DLGlCQUFpQixJQUFJQyxJQUFKLENBQVMsQ0FBQ0gsUUFBVixFQUFvQkksV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQXdCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQTNCVjtBQTZCRDtBQXRGbUU7a0JBQWpEM0Msa0IiLCJmaWxlIjoiZG93bmxvYWQtY2hhbmdlc2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XHJcbmltcG9ydCBDaGFuZ2VzZXQgZnJvbSAnLi4vLi4vbW9kZWxzL2NoYW5nZXNldCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZENoYW5nZXNldHMgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xyXG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gJ2NoYW5nZXNldHMnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHR5cGVOYW1lKCkge1xyXG4gICAgcmV0dXJuICdjaGFuZ2VzZXQnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxhc3RTeW5jKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpIHtcclxuICAgIHJldHVybiBDaGFuZ2VzZXQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogdGhpcy5hY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZE9iamVjdChvYmplY3QsIGF0dHJpYnV0ZXMpIHtcclxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XHJcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY2xvc2VkX2J5X2lkLCAnX2Nsb3NlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xyXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xyXG5cclxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNDaGFuZ2VzZXRzID0gb2JqZWN0Ll91cGRhdGVkQXQ7XHJcbiAgfVxyXG5cclxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBpZDogcm93WzBdLFxyXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXHJcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcclxuICAgICAgY2xvc2VkX2F0OiByb3dbM10sXHJcbiAgICAgIG1ldGFkYXRhOiByb3dbNF0gJiYgSlNPTi5wYXJzZShyb3dbNF0pLFxyXG4gICAgICBtaW5fbGF0OiByb3dbNV0sXHJcbiAgICAgIG1heF9sYXQ6IHJvd1s2XSxcclxuICAgICAgbWluX2xvbjogcm93WzddLFxyXG4gICAgICBtYXhfbG9uOiByb3dbOF0sXHJcbiAgICAgIG51bWJlcl9vZl9jaGFuZ2VzOiByb3dbOV0sXHJcbiAgICAgIG51bWJlcl9jcmVhdGVkOiByb3dbMTBdLFxyXG4gICAgICBudW1iZXJfdXBkYXRlZDogcm93WzExXSxcclxuICAgICAgbnVtYmVyX2RlbGV0ZWQ6IHJvd1sxMl0sXHJcbiAgICAgIGZvcm1faWQ6IHJvd1sxM10sXHJcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1sxNF0sXHJcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1sxNV0sXHJcbiAgICAgIGNsb3NlZF9ieV9pZDogcm93WzE2XSxcclxuICAgICAgY3JlYXRlZF9ieTogcm93WzE3XSxcclxuICAgICAgdXBkYXRlZF9ieTogcm93WzE4XSxcclxuICAgICAgY2xvc2VkX2J5OiByb3dbMTldXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcclxuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xyXG5cclxuICAgIHJldHVybiBgXHJcblNFTEVDVFxyXG4gIFwiY2hhbmdlc2V0X2lkXCIgQVMgXCJpZFwiLFxyXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXHJcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcclxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY2xvc2VkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbG9zZWRfYXRcIixcclxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxyXG4gIFwibWluX2xhdFwiIEFTIG1pbl9sYXQsXHJcbiAgXCJtYXhfbGF0XCIgQVMgbWF4X2xhdCxcclxuICBcIm1pbl9sb25cIiBBUyBtaW5fbG9uLFxyXG4gIFwibWF4X2xvblwiIEFTIG1heF9sb24sXHJcbiAgXCJudW1iZXJfb2ZfY2hhbmdlc1wiIEFTIG51bWJlcl9vZl9jaGFuZ2VzLFxyXG4gIFwibnVtYmVyX29mX2NyZWF0ZXNcIiBBUyBudW1iZXJfY3JlYXRlZCxcclxuICBcIm51bWJlcl9vZl91cGRhdGVzXCIgQVMgbnVtYmVyX3VwZGF0ZWQsXHJcbiAgXCJudW1iZXJfb2ZfZGVsZXRlc1wiIEFTIG51bWJlcl9kZWxldGVkLFxyXG4gIFwiZm9ybV9pZFwiIEFTIGZvcm1faWQsXHJcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXHJcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXHJcbiAgXCJjbG9zZWRfYnlfaWRcIiBBUyBcImNsb3NlZF9ieV9pZFwiLFxyXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXHJcbiAgTlVMTCBBUyBcInVwZGF0ZWRfYnlcIixcclxuICBOVUxMIEFTIFwiY2xvc2VkX2J5XCJcclxuRlJPTSBcImNoYW5nZXNldHNcIiBBUyBcInJlY29yZHNcIlxyXG5XSEVSRVxyXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXHJcbk9SREVSIEJZXHJcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcclxuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcclxuYDtcclxuICB9XHJcbn1cclxuIl19