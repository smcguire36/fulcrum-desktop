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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZENoYW5nZXNldHMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jQ2hhbmdlc2V0cyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0Q2hhbmdlc2V0cyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJpZCIsInByb2Nlc3MiLCJvYmplY3QiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsImxvb2t1cCIsImZvcm1faWQiLCJjbG9zZWRfYnlfaWQiLCJjcmVhdGVkX2J5X2lkIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwiY2hhbmdlc2V0IiwiZmluaXNoIiwiZmFpbCIsInJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwib3JnYW5pemF0aW9uTmFtZSIsImdyZWVuIiwicmVkIiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsImNsb3NlZF9hdCIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwibWluX2xhdCIsIm1heF9sYXQiLCJtaW5fbG9uIiwibWF4X2xvbiIsIm51bWJlcl9vZl9jaGFuZ2VzIiwibnVtYmVyX2NyZWF0ZWQiLCJudW1iZXJfdXBkYXRlZCIsIm51bWJlcl9kZWxldGVkIiwidXBkYXRlZF9ieV9pZCIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiY2xvc2VkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsImxpbWl0Iiwic2VxdWVuY2VTdHJpbmciLCJEYXRlIiwidG9JU09TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDcEUsTUFBSUMsZ0JBQUosR0FBdUI7QUFDckIsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sWUFBUDtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxZQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLQyxPQUFMLENBQWFDLG1CQUFwQjtBQUNEOztBQUVLQyxjQUFOLENBQW1CRixPQUFuQixFQUE0QkQsUUFBNUIsRUFBc0NJLFFBQXRDLEVBQWdEO0FBQUE7O0FBQUE7QUFDOUMsYUFBTyxpQkFBT0MsYUFBUCxDQUFxQkosT0FBckIsRUFBOEJHLFFBQTlCLEVBQXdDLE1BQUtFLFFBQTdDLENBQVA7QUFEOEM7QUFFL0M7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJQLE9BQXZCLEVBQWdDUSxVQUFoQyxFQUE0QztBQUMxQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZVCxRQUFRVSxLQUFyQixFQUE0QkMsYUFBYUgsV0FBV0ksRUFBcEQsRUFBakMsQ0FBUDtBQUNEOztBQUVLQyxTQUFOLENBQWNDLE1BQWQsRUFBc0JOLFVBQXRCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaENNLGFBQU9DLHVCQUFQLENBQStCUCxVQUEvQjs7QUFFQSxZQUFNUSxZQUFZLENBQUNGLE9BQU9HLFdBQVIsSUFDQSx1QkFBVUMsaUJBQVYsQ0FBNEJWLFdBQVdXLFVBQXZDLEVBQW1EQyxPQUFuRCxPQUFpRU4sT0FBT08sU0FBUCxDQUFpQkQsT0FBakIsRUFEbkY7O0FBR0EsWUFBTSxPQUFLRSxNQUFMLENBQVlSLE1BQVosRUFBb0JOLFdBQVdlLE9BQS9CLEVBQXdDLFlBQXhDLEVBQXNELFNBQXRELENBQU47QUFDQSxZQUFNLE9BQUtELE1BQUwsQ0FBWVIsTUFBWixFQUFvQk4sV0FBV2dCLFlBQS9CLEVBQTZDLGdCQUE3QyxFQUErRCxTQUEvRCxDQUFOO0FBQ0EsWUFBTSxPQUFLRixNQUFMLENBQVlSLE1BQVosRUFBb0JOLFdBQVdpQixhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjs7QUFFQSxhQUFLekIsT0FBTCxDQUFhQyxtQkFBYixHQUFtQ2EsT0FBT1ksVUFBMUM7O0FBRUEsWUFBTVosT0FBT2EsSUFBUCxFQUFOOztBQUVBLFVBQUlYLFNBQUosRUFBZTtBQUNiLGNBQU0sT0FBS1ksT0FBTCxDQUFhLGdCQUFiLEVBQStCLEVBQUNDLFdBQVdmLE1BQVosRUFBL0IsQ0FBTjtBQUNEO0FBaEIrQjtBQWlCakM7O0FBRUtnQixRQUFOLEdBQWU7QUFBQTs7QUFBQTtBQUNiO0FBQ0EsWUFBTSxPQUFLOUIsT0FBTCxDQUFhMkIsSUFBYixFQUFOO0FBRmE7QUFHZDs7QUFFREksT0FBSy9CLE9BQUwsRUFBY2dDLE9BQWQsRUFBdUI7QUFDckJDLFlBQVFDLEdBQVIsQ0FBWWxDLFFBQVFtQyxnQkFBUixDQUF5QkMsS0FBckMsRUFBNEMsU0FBU0MsR0FBckQ7QUFDRDs7QUFFREMsd0JBQXNCQyxHQUF0QixFQUEyQjtBQUN6QixXQUFPO0FBQ0wzQixVQUFJMkIsSUFBSSxDQUFKLENBREM7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0xwQixrQkFBWW9CLElBQUksQ0FBSixDQUhQO0FBSUxFLGlCQUFXRixJQUFJLENBQUosQ0FKTjtBQUtMRyxnQkFBVUgsSUFBSSxDQUFKLEtBQVVJLEtBQUtDLEtBQUwsQ0FBV0wsSUFBSSxDQUFKLENBQVgsQ0FMZjtBQU1MTSxlQUFTTixJQUFJLENBQUosQ0FOSjtBQU9MTyxlQUFTUCxJQUFJLENBQUosQ0FQSjtBQVFMUSxlQUFTUixJQUFJLENBQUosQ0FSSjtBQVNMUyxlQUFTVCxJQUFJLENBQUosQ0FUSjtBQVVMVSx5QkFBbUJWLElBQUksQ0FBSixDQVZkO0FBV0xXLHNCQUFnQlgsSUFBSSxFQUFKLENBWFg7QUFZTFksc0JBQWdCWixJQUFJLEVBQUosQ0FaWDtBQWFMYSxzQkFBZ0JiLElBQUksRUFBSixDQWJYO0FBY0xoQixlQUFTZ0IsSUFBSSxFQUFKLENBZEo7QUFlTGQscUJBQWVjLElBQUksRUFBSixDQWZWO0FBZ0JMYyxxQkFBZWQsSUFBSSxFQUFKLENBaEJWO0FBaUJMZixvQkFBY2UsSUFBSSxFQUFKLENBakJUO0FBa0JMZSxrQkFBWWYsSUFBSSxFQUFKLENBbEJQO0FBbUJMZ0Isa0JBQVloQixJQUFJLEVBQUosQ0FuQlA7QUFvQkxpQixpQkFBV2pCLElBQUksRUFBSjtBQXBCTixLQUFQO0FBc0JEOztBQUVEa0IsZ0JBQWN0RCxRQUFkLEVBQXdCdUQsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDekQsUUFBVixFQUFvQjBELFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkEyQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0E5QlY7QUFnQ0Q7QUFqSG1FO2tCQUFqRC9ELGtCIiwiZmlsZSI6ImRvd25sb2FkLWNoYW5nZXNldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBDaGFuZ2VzZXQgZnJvbSAnLi4vLi4vbW9kZWxzL2NoYW5nZXNldCc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZENoYW5nZXNldHMgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgc3luY1Jlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2NoYW5nZXNldHMnO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ2NoYW5nZXNldHMnO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2NoYW5nZXNldHMnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jQ2hhbmdlc2V0cztcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldENoYW5nZXNldHMoYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIENoYW5nZXNldC5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiBhY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZH0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNsb3NlZF9ieV9pZCwgJ19jbG9zZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jQ2hhbmdlc2V0cyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcignY2hhbmdlc2V0OnNhdmUnLCB7Y2hhbmdlc2V0OiBvYmplY3R9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgLy8gdXBkYXRlIHRoZSBsYXN0U3luYyBkYXRlXG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxuXG4gIGZhaWwoYWNjb3VudCwgcmVzdWx0cykge1xuICAgIGNvbnNvbGUubG9nKGFjY291bnQub3JnYW5pemF0aW9uTmFtZS5ncmVlbiwgJ2ZhaWxlZCcucmVkKTtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIGNsb3NlZF9hdDogcm93WzNdLFxuICAgICAgbWV0YWRhdGE6IHJvd1s0XSAmJiBKU09OLnBhcnNlKHJvd1s0XSksXG4gICAgICBtaW5fbGF0OiByb3dbNV0sXG4gICAgICBtYXhfbGF0OiByb3dbNl0sXG4gICAgICBtaW5fbG9uOiByb3dbN10sXG4gICAgICBtYXhfbG9uOiByb3dbOF0sXG4gICAgICBudW1iZXJfb2ZfY2hhbmdlczogcm93WzldLFxuICAgICAgbnVtYmVyX2NyZWF0ZWQ6IHJvd1sxMF0sXG4gICAgICBudW1iZXJfdXBkYXRlZDogcm93WzExXSxcbiAgICAgIG51bWJlcl9kZWxldGVkOiByb3dbMTJdLFxuICAgICAgZm9ybV9pZDogcm93WzEzXSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1sxNF0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbMTVdLFxuICAgICAgY2xvc2VkX2J5X2lkOiByb3dbMTZdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzE3XSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxOF0sXG4gICAgICBjbG9zZWRfYnk6IHJvd1sxOV1cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJjaGFuZ2VzZXRfaWRcIiBBUyBcImlkXCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjbG9zZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNsb3NlZF9hdFwiLFxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxuICBcIm1pbl9sYXRcIiBBUyBtaW5fbGF0LFxuICBcIm1heF9sYXRcIiBBUyBtYXhfbGF0LFxuICBcIm1pbl9sb25cIiBBUyBtaW5fbG9uLFxuICBcIm1heF9sb25cIiBBUyBtYXhfbG9uLFxuICBcIm51bWJlcl9vZl9jaGFuZ2VzXCIgQVMgbnVtYmVyX29mX2NoYW5nZXMsXG4gIFwibnVtYmVyX29mX2NyZWF0ZXNcIiBBUyBudW1iZXJfY3JlYXRlZCxcbiAgXCJudW1iZXJfb2ZfdXBkYXRlc1wiIEFTIG51bWJlcl91cGRhdGVkLFxuICBcIm51bWJlcl9vZl9kZWxldGVzXCIgQVMgbnVtYmVyX2RlbGV0ZWQsXG4gIFwiZm9ybV9pZFwiIEFTIGZvcm1faWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJjbG9zZWRfYnlfaWRcIiBBUyBcImNsb3NlZF9ieV9pZFwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwiY2xvc2VkX2J5XCIuXCJuYW1lXCIgQVMgXCJjbG9zZWRfYnlcIlxuRlJPTSBcImNoYW5nZXNldHNcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjbG9zZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY2xvc2VkX2J5X2lkXCIpID0gKFwiY2xvc2VkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19