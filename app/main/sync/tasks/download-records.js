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

  get syncResourceScope() {
    return this.form.id;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {
    return 'records';
  }

  get typeName() {
    return 'record';
  }

  get lastSync() {
    return this.form._lastSync;
  }

  fetchObjects(lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return lastSync == null ? yield _client2.default.getRecords(_this.account, _this.form, sequence, _this.pageSize) : yield _client2.default.getRecordsHistory(_this.account, _this.form, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, attributes) {
    return _record2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.id });
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
          _this2.synchronizer.incrementRecordCount();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlU2NvcGUiLCJpZCIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiX2xhc3RTeW5jIiwiZmV0Y2hPYmplY3RzIiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwiYWNjb3VudCIsInBhZ2VTaXplIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsInByb2Nlc3MiLCJvYmplY3QiLCJoaXN0b3J5X2NoYW5nZV90eXBlIiwiX2Zvcm0iLCJfZm9ybVJvd0lEIiwiZGVsZXRlIiwiX2hhc0NoYW5nZXMiLCJ0cmlnZ2VyIiwicmVjb3JkIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJ2ZXJzaW9uIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJ1cGRhdGVkQXQiLCJsb29rdXAiLCJwcm9qZWN0X2lkIiwiYXNzaWduZWRfdG9faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsImNoYW5nZXNldF9pZCIsInNhdmUiLCJzeW5jaHJvbml6ZXIiLCJpbmNyZW1lbnRSZWNvcmRDb3VudCIsImZpbmlzaCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImhhc0NyZWF0ZWRMb2NhdGlvbiIsImhhc1VwZGF0ZWRMb2NhdGlvbiIsInN0YXR1cyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50X2NyZWF0ZWRfYXQiLCJjbGllbnRfdXBkYXRlZF9hdCIsImZvcm1faWQiLCJmb3JtX3ZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiYWx0aXR1ZGUiLCJzcGVlZCIsImNvdXJzZSIsImhvcml6b250YWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsImVkaXRlZF9kdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJhc3NpZ25lZF90byIsInByb2plY3QiLCJjcmVhdGVkX2xvY2F0aW9uIiwidXBkYXRlZF9sb2NhdGlvbiIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLHlDQUFvRDtBQUNqRUMsb0JBQTZCO0FBQUEsUUFBakIsRUFBQ0MsSUFBRCxFQUFpQjtBQUFBLFFBQVBDLElBQU87O0FBQzNCLFVBQU1BLElBQU47O0FBRUEsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQsTUFBSUUsaUJBQUosR0FBd0I7QUFDdEIsV0FBTyxLQUFLRixJQUFMLENBQVVHLEVBQWpCO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sS0FBS0osSUFBTCxDQUFVSyxJQUFqQjtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLUixJQUFMLENBQVVTLFNBQWpCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJGLFFBQW5CLEVBQTZCRyxRQUE3QixFQUF1QztBQUFBOztBQUFBO0FBQ3JDLGFBQU9ILFlBQVksSUFBWixHQUFvQixNQUFNLGlCQUFPSSxVQUFQLENBQWtCLE1BQUtDLE9BQXZCLEVBQWdDLE1BQUtiLElBQXJDLEVBQTJDVyxRQUEzQyxFQUFxRCxNQUFLRyxRQUExRCxDQUExQixHQUNvQixNQUFNLGlCQUFPQyxpQkFBUCxDQUF5QixNQUFLRixPQUE5QixFQUF1QyxNQUFLYixJQUE1QyxFQUFrRFcsUUFBbEQsRUFBNEQsTUFBS0csUUFBakUsQ0FEakM7QUFEcUM7QUFHdEM7O0FBRURFLGVBQWFDLFFBQWIsRUFBdUJDLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQU8saUJBQU9GLFlBQVAsQ0FBb0JDLFFBQXBCLEVBQThCLEVBQUNFLFlBQVksS0FBS04sT0FBTCxDQUFhTyxLQUExQixFQUFpQ0MsYUFBYUgsV0FBV2YsRUFBekQsRUFBOUIsQ0FBUDtBQUNEOztBQUVLbUIsU0FBTixDQUFjQyxNQUFkLEVBQXNCTCxVQUF0QixFQUFrQztBQUFBOztBQUFBO0FBQ2hDLFVBQUlBLFdBQVdNLG1CQUFYLEtBQW1DLEdBQXZDLEVBQTRDO0FBQzFDLFlBQUlELE1BQUosRUFBWTtBQUNWQSxpQkFBT0UsS0FBUCxHQUFlLE9BQUt6QixJQUFwQjtBQUNBdUIsaUJBQU9HLFVBQVAsR0FBb0IsT0FBSzFCLElBQUwsQ0FBVW9CLEtBQTlCOztBQUVBLGdCQUFNRyxPQUFPSSxNQUFQLEVBQU47O0FBRUEsaUJBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUEsZ0JBQU0sT0FBS0MsT0FBTCxDQUFhLGVBQWIsRUFBOEIsRUFBQ0MsUUFBUVAsTUFBVCxFQUE5QixDQUFOO0FBQ0Q7QUFDRixPQVhELE1BV087QUFDTCxjQUFNUSxZQUFZLENBQUNSLE9BQU9TLFdBQVIsSUFBdUJkLFdBQVdlLE9BQVgsS0FBdUJWLE9BQU9VLE9BQXZFOztBQUVBVixlQUFPVyx1QkFBUCxDQUErQmhCLFVBQS9CO0FBQ0FLLGVBQU9FLEtBQVAsR0FBZSxPQUFLekIsSUFBcEI7QUFDQXVCLGVBQU9HLFVBQVAsR0FBb0IsT0FBSzFCLElBQUwsQ0FBVW9CLEtBQTlCOztBQUVBLGVBQUtwQixJQUFMLENBQVVTLFNBQVYsR0FBc0JjLE9BQU9ZLFNBQTdCOztBQUVBLGNBQU0sT0FBS0MsTUFBTCxDQUFZYixNQUFaLEVBQW9CTCxXQUFXbUIsVUFBL0IsRUFBMkMsZUFBM0MsRUFBNEQsWUFBNUQsQ0FBTjtBQUNBLGNBQU0sT0FBS0QsTUFBTCxDQUFZYixNQUFaLEVBQW9CTCxXQUFXb0IsY0FBL0IsRUFBK0Msa0JBQS9DLEVBQW1FLFNBQW5FLENBQU47QUFDQSxjQUFNLE9BQUtGLE1BQUwsQ0FBWWIsTUFBWixFQUFvQkwsV0FBV3FCLGFBQS9CLEVBQThDLGlCQUE5QyxFQUFpRSxTQUFqRSxDQUFOO0FBQ0EsY0FBTSxPQUFLSCxNQUFMLENBQVliLE1BQVosRUFBb0JMLFdBQVdzQixhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjtBQUNBLGNBQU0sT0FBS0osTUFBTCxDQUFZYixNQUFaLEVBQW9CTCxXQUFXdUIsWUFBL0IsRUFBNkMsaUJBQTdDLEVBQWdFLGNBQWhFLENBQU47O0FBRUEsY0FBTWxCLE9BQU9tQixJQUFQLEVBQU47O0FBRUEsWUFBSVgsU0FBSixFQUFlO0FBQ2IsaUJBQUtILFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxpQkFBS2UsWUFBTCxDQUFrQkMsb0JBQWxCO0FBQ0EsZ0JBQU0sT0FBS2YsT0FBTCxDQUFhLGFBQWIsRUFBNEIsRUFBQ0MsUUFBUVAsTUFBVCxFQUE1QixDQUFOO0FBQ0Q7QUFDRjtBQWxDK0I7QUFtQ2pDOztBQUVLc0IsUUFBTixHQUFlO0FBQUE7O0FBQUE7QUFDYjtBQUNBLFlBQU0sT0FBSzdDLElBQUwsQ0FBVTBDLElBQVYsRUFBTjs7QUFFQSxVQUFJLE9BQUtkLFdBQVQsRUFBc0I7QUFDcEIsY0FBTSxPQUFLQyxPQUFMLENBQWEsZ0JBQWIsRUFBK0IsRUFBQzdCLE1BQU0sT0FBS0EsSUFBWixFQUEvQixDQUFOO0FBQ0Q7QUFOWTtBQU9kOztBQUVEOEMsd0JBQXNCQyxHQUF0QixFQUEyQjtBQUN6QixVQUFNQyxxQkFDSkQsSUFBSSxFQUFKLEtBQVcsSUFBWCxJQUNBQSxJQUFJLEVBQUosS0FBVyxJQURYLElBRUFBLElBQUksRUFBSixLQUFXLElBRlgsSUFHQUEsSUFBSSxFQUFKLEtBQVcsSUFKYjs7QUFNQSxVQUFNRSxxQkFDSkYsSUFBSSxFQUFKLEtBQVcsSUFBWCxJQUNBQSxJQUFJLEVBQUosS0FBVyxJQURYLElBRUFBLElBQUksRUFBSixLQUFXLElBRlgsSUFHQUEsSUFBSSxFQUFKLEtBQVcsSUFKYjs7QUFNQSxXQUFPO0FBQ0xHLGNBQVFILElBQUksQ0FBSixDQURIO0FBRUxkLGVBQVNjLElBQUksQ0FBSixDQUZKO0FBR0w1QyxVQUFJNEMsSUFBSSxDQUFKLENBSEM7QUFJTEksa0JBQVlKLElBQUksQ0FBSixDQUpQO0FBS0xLLGtCQUFZTCxJQUFJLENBQUosQ0FMUDtBQU1MTSx5QkFBbUJOLElBQUksQ0FBSixDQU5kO0FBT0xPLHlCQUFtQlAsSUFBSSxDQUFKLENBUGQ7QUFRTFIscUJBQWVRLElBQUksQ0FBSixDQVJWO0FBU0xQLHFCQUFlTyxJQUFJLENBQUosQ0FUVjtBQVVMUSxlQUFTUixJQUFJLENBQUosQ0FWSjtBQVdMVixrQkFBWVUsSUFBSSxFQUFKLENBWFA7QUFZTFQsc0JBQWdCUyxJQUFJLEVBQUosQ0FaWDtBQWFMUyxtQkFBYUMsS0FBS0MsS0FBTCxDQUFXWCxJQUFJLEVBQUosQ0FBWCxDQWJSO0FBY0xZLGdCQUFVWixJQUFJLEVBQUosQ0FkTDtBQWVMYSxpQkFBV2IsSUFBSSxFQUFKLENBZk47QUFnQkxjLGdCQUFVZCxJQUFJLEVBQUosQ0FoQkw7QUFpQkxlLGFBQU9mLElBQUksRUFBSixDQWpCRjtBQWtCTGdCLGNBQVFoQixJQUFJLEVBQUosQ0FsQkg7QUFtQkxpQiwyQkFBcUJqQixJQUFJLEVBQUosQ0FuQmhCO0FBb0JMa0IseUJBQW1CbEIsSUFBSSxFQUFKLENBcEJkO0FBcUJMbUIsdUJBQWlCbkIsSUFBSSxFQUFKLENBckJaO0FBc0JMb0Isd0JBQWtCcEIsSUFBSSxFQUFKLENBdEJiO0FBdUJMcUIsd0JBQWtCckIsSUFBSSxFQUFKLENBdkJiO0FBd0JMc0Isa0JBQVl0QixJQUFJLEVBQUosQ0F4QlA7QUF5Qkx1QixrQkFBWXZCLElBQUksRUFBSixDQXpCUDtBQTBCTHdCLG1CQUFheEIsSUFBSSxFQUFKLENBMUJSO0FBMkJMeUIsZUFBU3pCLElBQUksRUFBSixDQTNCSjtBQTRCTE4sb0JBQWNNLElBQUksRUFBSixDQTVCVDtBQTZCTDBCLHdCQUFrQnpCLHNCQUFzQjtBQUN0Q1csa0JBQVVaLElBQUksRUFBSixDQUQ0QjtBQUV0Q2EsbUJBQVdiLElBQUksRUFBSixDQUYyQjtBQUd0Q2Msa0JBQVVkLElBQUksRUFBSixDQUg0QjtBQUl0Q2lCLDZCQUFxQmpCLElBQUksRUFBSjtBQUppQixPQTdCbkM7QUFtQ0wyQix3QkFBa0J6QixzQkFBc0I7QUFDdENVLGtCQUFVWixJQUFJLEVBQUosQ0FENEI7QUFFdENhLG1CQUFXYixJQUFJLEVBQUosQ0FGMkI7QUFHdENjLGtCQUFVZCxJQUFJLEVBQUosQ0FINEI7QUFJdENpQiw2QkFBcUJqQixJQUFJLEVBQUo7QUFKaUI7QUFuQ25DLEtBQVA7QUEwQ0Q7O0FBRUQ0QixnQkFBY2hFLFFBQWQsRUFBd0JpRSxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUNuRSxRQUFWLEVBQW9Cb0UsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7S0FXTixLQUFLL0UsSUFBTCxDQUFVRyxFQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUEyQlgsS0FBS0gsSUFBTCxDQUFVRyxFQUFJOzs7Ozs7MEJBTUcwRSxjQUFlOzs7UUFHakNELEtBQU07Q0EvQ1Y7QUFpREQ7QUEvTGdFO2tCQUE5QzlFLGUiLCJmaWxlIjoiZG93bmxvYWQtcmVjb3Jkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFJlY29yZCBmcm9tICcuLi8uLi9tb2RlbHMvcmVjb3JkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRSZWNvcmRzIGV4dGVuZHMgRG93bmxvYWRRdWVyeVNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZVNjb3BlKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0uaWQ7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0ubmFtZTtcbiAgfVxuXG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZWNvcmRzJztcbiAgfVxuXG4gIGdldCB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3JlY29yZCc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5fbGFzdFN5bmM7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMobGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIGxhc3RTeW5jID09IG51bGwgPyAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHModGhpcy5hY2NvdW50LCB0aGlzLmZvcm0sIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IChhd2FpdCBDbGllbnQuZ2V0UmVjb3Jkc0hpc3RvcnkodGhpcy5hY2NvdW50LCB0aGlzLmZvcm0sIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gUmVjb3JkLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWR9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZXMuaGlzdG9yeV9jaGFuZ2VfdHlwZSA9PT0gJ2QnKSB7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XG5cbiAgICAgICAgYXdhaXQgb2JqZWN0LmRlbGV0ZSgpO1xuXG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOmRlbGV0ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgICB0aGlzLmZvcm0uX2xhc3RTeW5jID0gb2JqZWN0LnVwZGF0ZWRBdDtcblxuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnByb2plY3RfaWQsICdfcHJvamVjdFJvd0lEJywgJ2dldFByb2plY3QnKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNoYW5nZXNldF9pZCwgJ19jaGFuZ2VzZXRSb3dJRCcsICdnZXRDaGFuZ2VzZXQnKTtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICB0aGlzLl9oYXNDaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zeW5jaHJvbml6ZXIuaW5jcmVtZW50UmVjb3JkQ291bnQoKTtcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmQ6c2F2ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmZvcm0uc2F2ZSgpO1xuXG4gICAgaWYgKHRoaXMuX2hhc0NoYW5nZXMpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkczpmaW5pc2gnLCB7Zm9ybTogdGhpcy5mb3JtfSk7XG4gICAgfVxuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIGNvbnN0IGhhc0NyZWF0ZWRMb2NhdGlvbiA9XG4gICAgICByb3dbMjhdICE9IG51bGwgfHxcbiAgICAgIHJvd1syOV0gIT0gbnVsbCB8fFxuICAgICAgcm93WzMwXSAhPSBudWxsIHx8XG4gICAgICByb3dbMzFdICE9IG51bGw7XG5cbiAgICBjb25zdCBoYXNVcGRhdGVkTG9jYXRpb24gPVxuICAgICAgcm93WzMyXSAhPSBudWxsIHx8XG4gICAgICByb3dbMzNdICE9IG51bGwgfHxcbiAgICAgIHJvd1szNF0gIT0gbnVsbCB8fFxuICAgICAgcm93WzM1XSAhPSBudWxsO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHN0YXR1czogcm93WzBdLFxuICAgICAgdmVyc2lvbjogcm93WzFdLFxuICAgICAgaWQ6IHJvd1syXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1szXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1s0XSxcbiAgICAgIGNsaWVudF9jcmVhdGVkX2F0OiByb3dbNV0sXG4gICAgICBjbGllbnRfdXBkYXRlZF9hdDogcm93WzZdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzddLFxuICAgICAgdXBkYXRlZF9ieV9pZDogcm93WzhdLFxuICAgICAgZm9ybV9pZDogcm93WzldLFxuICAgICAgcHJvamVjdF9pZDogcm93WzEwXSxcbiAgICAgIGFzc2lnbmVkX3RvX2lkOiByb3dbMTFdLFxuICAgICAgZm9ybV92YWx1ZXM6IEpTT04ucGFyc2Uocm93WzEyXSksXG4gICAgICBsYXRpdHVkZTogcm93WzEzXSxcbiAgICAgIGxvbmdpdHVkZTogcm93WzE0XSxcbiAgICAgIGFsdGl0dWRlOiByb3dbMTVdLFxuICAgICAgc3BlZWQ6IHJvd1sxNl0sXG4gICAgICBjb3Vyc2U6IHJvd1sxN10sXG4gICAgICBob3Jpem9udGFsX2FjY3VyYWN5OiByb3dbMThdLFxuICAgICAgdmVydGljYWxfYWNjdXJhY3k6IHJvd1sxOV0sXG4gICAgICBlZGl0ZWRfZHVyYXRpb246IHJvd1syMF0sXG4gICAgICB1cGRhdGVkX2R1cmF0aW9uOiByb3dbMjFdLFxuICAgICAgY3JlYXRlZF9kdXJhdGlvbjogcm93WzIyXSxcbiAgICAgIGNyZWF0ZWRfYnk6IHJvd1syM10sXG4gICAgICB1cGRhdGVkX2J5OiByb3dbMjRdLFxuICAgICAgYXNzaWduZWRfdG86IHJvd1syNV0sXG4gICAgICBwcm9qZWN0OiByb3dbMjZdLFxuICAgICAgY2hhbmdlc2V0X2lkOiByb3dbMjddLFxuICAgICAgY3JlYXRlZF9sb2NhdGlvbjogaGFzQ3JlYXRlZExvY2F0aW9uICYmIHtcbiAgICAgICAgbGF0aXR1ZGU6IHJvd1syOF0sXG4gICAgICAgIGxvbmdpdHVkZTogcm93WzI5XSxcbiAgICAgICAgYWx0aXR1ZGU6IHJvd1szMF0sXG4gICAgICAgIGhvcml6b250YWxfYWNjdXJhY3k6IHJvd1szMV1cbiAgICAgIH0sXG4gICAgICB1cGRhdGVkX2xvY2F0aW9uOiBoYXNVcGRhdGVkTG9jYXRpb24gJiYge1xuICAgICAgICBsYXRpdHVkZTogcm93WzMyXSxcbiAgICAgICAgbG9uZ2l0dWRlOiByb3dbMzNdLFxuICAgICAgICBhbHRpdHVkZTogcm93WzM0XSxcbiAgICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzM1XVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcIl9zdGF0dXNcIiBBUyBcInN0YXR1c1wiLFxuICBcIl92ZXJzaW9uXCIgQVMgXCJ2ZXJzaW9uXCIsXG4gIFwiX3JlY29yZF9pZFwiIEFTIFwiaWRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9zZXJ2ZXJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3NlcnZlcl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xpZW50X2NyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbGllbnRfdXBkYXRlZF9hdFwiLFxuICBcIl9jcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwiX3VwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgJyR7IHRoaXMuZm9ybS5pZCB9Jzo6dGV4dCBBUyBcImZvcm1faWRcIixcbiAgXCJfcHJvamVjdF9pZFwiIEFTIFwicHJvamVjdF9pZFwiLFxuICBcIl9hc3NpZ25lZF90b19pZFwiIEFTIFwiYXNzaWduZWRfdG9faWRcIixcbiAgXCJfZm9ybV92YWx1ZXNcIiBBUyBcImZvcm1fdmFsdWVzXCIsXG4gIFwiX2xhdGl0dWRlXCIgQVMgXCJsYXRpdHVkZVwiLFxuICBcIl9sb25naXR1ZGVcIiBBUyBcImxvbmdpdHVkZVwiLFxuICBcIl9hbHRpdHVkZVwiIEFTIFwiYWx0aXR1ZGVcIixcbiAgXCJfc3BlZWRcIiBBUyBcInNwZWVkXCIsXG4gIFwiX2NvdXJzZVwiIEFTIFwiY291cnNlXCIsXG4gIFwiX2hvcml6b250YWxfYWNjdXJhY3lcIiBBUyBcImhvcml6b250YWxfYWNjdXJhY3lcIixcbiAgXCJfdmVydGljYWxfYWNjdXJhY3lcIiBBUyBcInZlcnRpY2FsX2FjY3VyYWN5XCIsXG4gIFwiX2VkaXRlZF9kdXJhdGlvblwiIEFTIFwiZWRpdGVkX2R1cmF0aW9uXCIsXG4gIFwiX3VwZGF0ZWRfZHVyYXRpb25cIiBBUyBcInVwZGF0ZWRfZHVyYXRpb25cIixcbiAgXCJfY3JlYXRlZF9kdXJhdGlvblwiIEFTIFwiY3JlYXRlZF9kdXJhdGlvblwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwiYXNzaWduZWRfdG9cIi5cIm5hbWVcIiBBUyBcImFzc2lnbmVkX3RvXCIsXG4gIFwicHJvamVjdFwiLlwibmFtZVwiIEFTIFwicHJvamVjdFwiLFxuICBcIl9jaGFuZ2VzZXRfaWRcIiBBUyBcImNoYW5nZXNldF9pZFwiLFxuICBcIl9jcmVhdGVkX2xhdGl0dWRlXCIgQVMgXCJjcmVhdGVkX2xhdGl0dWRlXCIsXG4gIFwiX2NyZWF0ZWRfbG9uZ2l0dWRlXCIgQVMgXCJjcmVhdGVkX2xvbmdpdHVkZVwiLFxuICBcIl9jcmVhdGVkX2FsdGl0dWRlXCIgQVMgXCJjcmVhdGVkX2FsdGl0dWRlXCIsXG4gIFwiX2NyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeVwiIEFTIFwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCIsXG4gIFwiX3VwZGF0ZWRfbGF0aXR1ZGVcIiBBUyBcInVwZGF0ZWRfbGF0aXR1ZGVcIixcbiAgXCJfdXBkYXRlZF9sb25naXR1ZGVcIiBBUyBcInVwZGF0ZWRfbG9uZ2l0dWRlXCIsXG4gIFwiX3VwZGF0ZWRfYWx0aXR1ZGVcIiBBUyBcInVwZGF0ZWRfYWx0aXR1ZGVcIixcbiAgXCJfdXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3lcIlxuRlJPTSBcIiR7IHRoaXMuZm9ybS5pZCB9L19mdWxsXCIgQVMgXCJyZWNvcmRzXCJcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjcmVhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cIl9jcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cIl91cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJhc3NpZ25lZF90b1wiIE9OICgoXCJyZWNvcmRzXCIuXCJfYXNzaWduZWRfdG9faWRcIikgPSAoXCJhc3NpZ25lZF90b1wiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcInByb2plY3RzXCIgQVMgXCJwcm9qZWN0XCIgT04gKChcInJlY29yZHNcIi5cIl9wcm9qZWN0X2lkXCIpID0gKFwicHJvamVjdFwiLlwicHJvamVjdF9pZFwiKSlcbldIRVJFXG4gIF9zZXJ2ZXJfdXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIF9zZXJ2ZXJfdXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=