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
    const hasCreatedLocation = row[28] != null || row[29] != null || row[30] != null || row[31] != null;

    const hasUpdatedLocation = row[32] != null || row[33] != null || row[34] != null || row[35] != null;

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
      changeset_id: row[27],
      created_location: hasCreatedLocation && {
        latitude: row[28],
        longitude: row[29],
        altitude: row[30],
        horizontal_accuracy: row[31]
      },
      updated_location: hasUpdatedLocation && {
        latitude: row[32],
        longitude: row[33],
        altitude: row[34],
        horizontal_accuracy: row[35]
      }
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
  "_changeset_id" AS "changeset_id",
  "_created_latitude" AS "created_latitude",
  "_created_longitude" AS "created_longitude",
  "_created_altitude" AS "created_altitude",
  "_created_horizontal_accuracy" AS "created_horizontal_accuracy",
  "_updated_latitude" AS "updated_latitude",
  "_updated_longitude" AS "updated_longitude",
  "_updated_altitude" AS "updated_altitude",
  "_updated_horizontal_accuracy" AS "updated_horizontal_accuracy"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNSZXNvdXJjZVNjb3BlIiwiaWQiLCJzeW5jTGFiZWwiLCJuYW1lIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJfbGFzdFN5bmMiLCJmZXRjaE9iamVjdHMiLCJhY2NvdW50Iiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwicGFnZVNpemUiLCJnZXRSZWNvcmRzSGlzdG9yeSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwicHJvY2VzcyIsIm9iamVjdCIsImhpc3RvcnlfY2hhbmdlX3R5cGUiLCJfZm9ybSIsIl9mb3JtUm93SUQiLCJkZWxldGUiLCJfaGFzQ2hhbmdlcyIsInRyaWdnZXIiLCJyZWNvcmQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsInVwZGF0ZWRBdCIsImxvb2t1cCIsInByb2plY3RfaWQiLCJhc3NpZ25lZF90b19pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiY2hhbmdlc2V0X2lkIiwic2F2ZSIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImhhc0NyZWF0ZWRMb2NhdGlvbiIsImhhc1VwZGF0ZWRMb2NhdGlvbiIsInN0YXR1cyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50X2NyZWF0ZWRfYXQiLCJjbGllbnRfdXBkYXRlZF9hdCIsImZvcm1faWQiLCJmb3JtX3ZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiYWx0aXR1ZGUiLCJzcGVlZCIsImNvdXJzZSIsImhvcml6b250YWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsImVkaXRlZF9kdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJhc3NpZ25lZF90byIsInByb2plY3QiLCJjcmVhdGVkX2xvY2F0aW9uIiwidXBkYXRlZF9sb2NhdGlvbiIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLHlDQUFvRDtBQUNqRUMsb0JBQTZCO0FBQUEsUUFBakIsRUFBQ0MsSUFBRCxFQUFpQjtBQUFBLFFBQVBDLElBQU87O0FBQzNCLFVBQU1BLElBQU47O0FBRUEsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQsTUFBSUUsZ0JBQUosR0FBdUI7QUFDckIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsaUJBQUosR0FBd0I7QUFDdEIsV0FBTyxLQUFLSCxJQUFMLENBQVVJLEVBQWpCO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sS0FBS0wsSUFBTCxDQUFVTSxJQUFqQjtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLUixJQUFMLENBQVVTLFNBQWpCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJDLE9BQW5CLEVBQTRCSCxRQUE1QixFQUFzQ0ksUUFBdEMsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxhQUFPSixZQUFZLElBQVosR0FBb0IsTUFBTSxpQkFBT0ssVUFBUCxDQUFrQkYsT0FBbEIs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QUFrQnBCLElBQUksRUFBSixDQXRCYjtBQXVCTHFCLHdCQUFrQnJCLElBQUksRUFBSixDQXZCYjtBQXdCTHNCLGtCQUFZdEIsSUFBSSxFQUFKLENBeEJQO0FBeUJMdUIsa0JBQVl2QixJQUFJLEVBQUosQ0F6QlA7QUEwQkx3QixtQkFBYXhCLElBQUksRUFBSixDQTFCUjtBQTJCTHlCLGVBQVN6QixJQUFJLEVBQUosQ0EzQko7QUE0QkxYLG9CQUFjVyxJQUFJLEVBQUosQ0E1QlQ7QUE2QkwwQix3QkFBa0J6QixzQkFBc0I7QUFDdENXLGtCQUFVWixJQUFJLEVBQUosQ0FENEI7QUFFdENhLG1CQUFXYixJQUFJLEVBQUosQ0FGMkI7QUFHdENjLGtCQUFVZCxJQUFJLEVBQUosQ0FINEI7QUFJdENpQiw2QkFBcUJqQixJQUFJLEVBQUo7QUFKaUIsT0E3Qm5DO0FBbUNMMkIsd0JBQWtCekIsc0JBQXNCO0FBQ3RDVSxrQkFBVVosSUFBSSxFQUFKLENBRDRCO0FBRXRDYSxtQkFBV2IsSUFBSSxFQUFKLENBRjJCO0FBR3RDYyxrQkFBVWQsSUFBSSxFQUFKLENBSDRCO0FBSXRDaUIsNkJBQXFCakIsSUFBSSxFQUFKO0FBSmlCO0FBbkNuQyxLQUFQO0FBMENEOztBQUVENEIsZ0JBQWNwRSxRQUFkLEVBQXdCcUUsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDdkUsUUFBVixFQUFvQndFLFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7O0tBV04sS0FBS3BGLElBQUwsQ0FBVUksRUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBMkJYLEtBQUtKLElBQUwsQ0FBVUksRUFBSTs7Ozs7OzBCQU1HOEUsY0FBZTs7O1FBR2pDRCxLQUFNO0NBL0NWO0FBaUREO0FBbE1nRTtrQkFBOUNuRixlIiwiZmlsZSI6ImRvd25sb2FkLXJlY29yZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBSZWNvcmQgZnJvbSAnLi4vLi4vbW9kZWxzL3JlY29yZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUmVjb3JkcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGNvbnN0cnVjdG9yKHtmb3JtLCAuLi5hcmdzfSkge1xuICAgIHN1cGVyKGFyZ3MpO1xuXG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncmVjb3Jkcyc7XG4gIH1cblxuICBnZXQgc3luY1Jlc291cmNlU2NvcGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5pZDtcbiAgfVxuXG4gIGdldCBzeW5jTGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5uYW1lO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3JlY29yZHMnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uX2xhc3RTeW5jO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBsYXN0U3luYyA9PSBudWxsID8gKGF3YWl0IENsaWVudC5nZXRSZWNvcmRzKGFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGF3YWl0IENsaWVudC5nZXRSZWNvcmRzSGlzdG9yeShhY2NvdW50LCB0aGlzLmZvcm0sIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gUmVjb3JkLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkfSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIGlmIChhdHRyaWJ1dGVzLmhpc3RvcnlfY2hhbmdlX3R5cGUgPT09ICdkJykge1xuICAgICAgaWYgKG9iamVjdCkge1xuICAgICAgICBvYmplY3QuX2Zvcm0gPSB0aGlzLmZvcm07XG4gICAgICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgICAgIGF3YWl0IG9iamVjdC5kZWxldGUoKTtcblxuICAgICAgICB0aGlzLl9oYXNDaGFuZ2VzID0gdHJ1ZTtcblxuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZDpkZWxldGUnLCB7cmVjb3JkOiBvYmplY3R9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fCBhdHRyaWJ1dGVzLnZlcnNpb24gIT09IG9iamVjdC52ZXJzaW9uO1xuXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgICBvYmplY3QuX2Zvcm0gPSB0aGlzLmZvcm07XG4gICAgICBvYmplY3QuX2Zvcm1Sb3dJRCA9IHRoaXMuZm9ybS5yb3dJRDtcblxuICAgICAgdGhpcy5mb3JtLl9sYXN0U3luYyA9IG9iamVjdC51cGRhdGVkQXQ7XG5cbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5wcm9qZWN0X2lkLCAnX3Byb2plY3RSb3dJRCcsICdnZXRQcm9qZWN0Jyk7XG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuYXNzaWduZWRfdG9faWQsICdfYXNzaWduZWRUb1Jvd0lEJywgJ2dldFVzZXInKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jaGFuZ2VzZXRfaWQsICdfY2hhbmdlc2V0Um93SUQnLCAnZ2V0Q2hhbmdlc2V0Jyk7XG5cbiAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgICAgdGhpcy5faGFzQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOnNhdmUnLCB7cmVjb3JkOiBvYmplY3R9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgLy8gdXBkYXRlIHRoZSBsYXN0U3luYyBkYXRlXG4gICAgYXdhaXQgdGhpcy5mb3JtLnNhdmUoKTtcblxuICAgIGlmICh0aGlzLl9oYXNDaGFuZ2VzKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZHM6ZmluaXNoJywge2Zvcm06IHRoaXMuZm9ybX0pO1xuICAgIH1cbiAgfVxuXG4gIGZhaWwoYWNjb3VudCwgcmVzdWx0cykge1xuICAgIGNvbnNvbGUubG9nKGFjY291bnQub3JnYW5pemF0aW9uTmFtZS5ncmVlbiwgJ2ZhaWxlZCcucmVkKTtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICBjb25zdCBoYXNDcmVhdGVkTG9jYXRpb24gPVxuICAgICAgcm93WzI4XSAhPSBudWxsIHx8XG4gICAgICByb3dbMjldICE9IG51bGwgfHxcbiAgICAgIHJvd1szMF0gIT0gbnVsbCB8fFxuICAgICAgcm93WzMxXSAhPSBudWxsO1xuXG4gICAgY29uc3QgaGFzVXBkYXRlZExvY2F0aW9uID1cbiAgICAgIHJvd1szMl0gIT0gbnVsbCB8fFxuICAgICAgcm93WzMzXSAhPSBudWxsIHx8XG4gICAgICByb3dbMzRdICE9IG51bGwgfHxcbiAgICAgIHJvd1szNV0gIT0gbnVsbDtcblxuICAgIHJldHVybiB7XG4gICAgICBzdGF0dXM6IHJvd1swXSxcbiAgICAgIHZlcnNpb246IHJvd1sxXSxcbiAgICAgIGlkOiByb3dbMl0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbM10sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbNF0sXG4gICAgICBjbGllbnRfY3JlYXRlZF9hdDogcm93WzVdLFxuICAgICAgY2xpZW50X3VwZGF0ZWRfYXQ6IHJvd1s2XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s4XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s5XSxcbiAgICAgIHByb2plY3RfaWQ6IHJvd1sxMF0sXG4gICAgICBhc3NpZ25lZF90b19pZDogcm93WzExXSxcbiAgICAgIGZvcm1fdmFsdWVzOiBKU09OLnBhcnNlKHJvd1sxMl0pLFxuICAgICAgbGF0aXR1ZGU6IHJvd1sxM10sXG4gICAgICBsb25naXR1ZGU6IHJvd1sxNF0sXG4gICAgICBhbHRpdHVkZTogcm93WzE1XSxcbiAgICAgIHNwZWVkOiByb3dbMTZdLFxuICAgICAgY291cnNlOiByb3dbMTddLFxuICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzE4XSxcbiAgICAgIHZlcnRpY2FsX2FjY3VyYWN5OiByb3dbMTldLFxuICAgICAgZWRpdGVkX2R1cmF0aW9uOiByb3dbMjBdLFxuICAgICAgdXBkYXRlZF9kdXJhdGlvbjogcm93WzIxXSxcbiAgICAgIGNyZWF0ZWRfZHVyYXRpb246IHJvd1syMl0sXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMjNdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzI0XSxcbiAgICAgIGFzc2lnbmVkX3RvOiByb3dbMjVdLFxuICAgICAgcHJvamVjdDogcm93WzI2XSxcbiAgICAgIGNoYW5nZXNldF9pZDogcm93WzI3XSxcbiAgICAgIGNyZWF0ZWRfbG9jYXRpb246IGhhc0NyZWF0ZWRMb2NhdGlvbiAmJiB7XG4gICAgICAgIGxhdGl0dWRlOiByb3dbMjhdLFxuICAgICAgICBsb25naXR1ZGU6IHJvd1syOV0sXG4gICAgICAgIGFsdGl0dWRlOiByb3dbMzBdLFxuICAgICAgICBob3Jpem9udGFsX2FjY3VyYWN5OiByb3dbMzFdXG4gICAgICB9LFxuICAgICAgdXBkYXRlZF9sb2NhdGlvbjogaGFzVXBkYXRlZExvY2F0aW9uICYmIHtcbiAgICAgICAgbGF0aXR1ZGU6IHJvd1szMl0sXG4gICAgICAgIGxvbmdpdHVkZTogcm93WzMzXSxcbiAgICAgICAgYWx0aXR1ZGU6IHJvd1szNF0sXG4gICAgICAgIGhvcml6b250YWxfYWNjdXJhY3k6IHJvd1szNV1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJfc3RhdHVzXCIgQVMgXCJzdGF0dXNcIixcbiAgXCJfdmVyc2lvblwiIEFTIFwidmVyc2lvblwiLFxuICBcIl9yZWNvcmRfaWRcIiBBUyBcImlkXCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfc2VydmVyX2NyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9zZXJ2ZXJfdXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwidXBkYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX2NyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNsaWVudF9jcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfdXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xpZW50X3VwZGF0ZWRfYXRcIixcbiAgXCJfY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcIl91cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gICckeyB0aGlzLmZvcm0uaWQgfSc6OnRleHQgQVMgXCJmb3JtX2lkXCIsXG4gIFwiX3Byb2plY3RfaWRcIiBBUyBcInByb2plY3RfaWRcIixcbiAgXCJfYXNzaWduZWRfdG9faWRcIiBBUyBcImFzc2lnbmVkX3RvX2lkXCIsXG4gIFwiX2Zvcm1fdmFsdWVzXCIgQVMgXCJmb3JtX3ZhbHVlc1wiLFxuICBcIl9sYXRpdHVkZVwiIEFTIFwibGF0aXR1ZGVcIixcbiAgXCJfbG9uZ2l0dWRlXCIgQVMgXCJsb25naXR1ZGVcIixcbiAgXCJfYWx0aXR1ZGVcIiBBUyBcImFsdGl0dWRlXCIsXG4gIFwiX3NwZWVkXCIgQVMgXCJzcGVlZFwiLFxuICBcIl9jb3Vyc2VcIiBBUyBcImNvdXJzZVwiLFxuICBcIl9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJob3Jpem9udGFsX2FjY3VyYWN5XCIsXG4gIFwiX3ZlcnRpY2FsX2FjY3VyYWN5XCIgQVMgXCJ2ZXJ0aWNhbF9hY2N1cmFjeVwiLFxuICBcIl9lZGl0ZWRfZHVyYXRpb25cIiBBUyBcImVkaXRlZF9kdXJhdGlvblwiLFxuICBcIl91cGRhdGVkX2R1cmF0aW9uXCIgQVMgXCJ1cGRhdGVkX2R1cmF0aW9uXCIsXG4gIFwiX2NyZWF0ZWRfZHVyYXRpb25cIiBBUyBcImNyZWF0ZWRfZHVyYXRpb25cIixcbiAgXCJjcmVhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIFwidXBkYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwidXBkYXRlZF9ieVwiLFxuICBcImFzc2lnbmVkX3RvXCIuXCJuYW1lXCIgQVMgXCJhc3NpZ25lZF90b1wiLFxuICBcInByb2plY3RcIi5cIm5hbWVcIiBBUyBcInByb2plY3RcIixcbiAgXCJfY2hhbmdlc2V0X2lkXCIgQVMgXCJjaGFuZ2VzZXRfaWRcIixcbiAgXCJfY3JlYXRlZF9sYXRpdHVkZVwiIEFTIFwiY3JlYXRlZF9sYXRpdHVkZVwiLFxuICBcIl9jcmVhdGVkX2xvbmdpdHVkZVwiIEFTIFwiY3JlYXRlZF9sb25naXR1ZGVcIixcbiAgXCJfY3JlYXRlZF9hbHRpdHVkZVwiIEFTIFwiY3JlYXRlZF9hbHRpdHVkZVwiLFxuICBcIl9jcmVhdGVkX2hvcml6b250YWxfYWNjdXJhY3lcIiBBUyBcImNyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeVwiLFxuICBcIl91cGRhdGVkX2xhdGl0dWRlXCIgQVMgXCJ1cGRhdGVkX2xhdGl0dWRlXCIsXG4gIFwiX3VwZGF0ZWRfbG9uZ2l0dWRlXCIgQVMgXCJ1cGRhdGVkX2xvbmdpdHVkZVwiLFxuICBcIl91cGRhdGVkX2FsdGl0dWRlXCIgQVMgXCJ1cGRhdGVkX2FsdGl0dWRlXCIsXG4gIFwiX3VwZGF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeVwiIEFTIFwidXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCJcbkZST00gXCIkeyB0aGlzLmZvcm0uaWQgfS9fZnVsbFwiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJfY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJfdXBkYXRlZF9ieV9pZFwiKSA9IChcInVwZGF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiYXNzaWduZWRfdG9cIiBPTiAoKFwicmVjb3Jkc1wiLlwiX2Fzc2lnbmVkX3RvX2lkXCIpID0gKFwiYXNzaWduZWRfdG9cIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJwcm9qZWN0c1wiIEFTIFwicHJvamVjdFwiIE9OICgoXCJyZWNvcmRzXCIuXCJfcHJvamVjdF9pZFwiKSA9IChcInByb2plY3RcIi5cInByb2plY3RfaWRcIikpXG5XSEVSRVxuICBfc2VydmVyX3VwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBfc2VydmVyX3VwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19