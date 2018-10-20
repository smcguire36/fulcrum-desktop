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
  NULL AS "created_by",
  NULL AS "updated_by",
  NULL AS "assigned_to",
  NULL AS "project",
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
WHERE
  _server_updated_at > '${sequenceString}'
ORDER BY
  _server_updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlU2NvcGUiLCJpZCIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiX2xhc3RTeW5jIiwiZmV0Y2hPYmplY3RzIiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwiYWNjb3VudCIsInBhZ2VTaXplIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsInByb2Nlc3MiLCJvYmplY3QiLCJoaXN0b3J5X2NoYW5nZV90eXBlIiwiX2Zvcm0iLCJfZm9ybVJvd0lEIiwiZGVsZXRlIiwiX2hhc0NoYW5nZXMiLCJ0cmlnZ2VyIiwicmVjb3JkIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJ2ZXJzaW9uIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJ1cGRhdGVkQXQiLCJsb29rdXAiLCJwcm9qZWN0X2lkIiwiYXNzaWduZWRfdG9faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsImNoYW5nZXNldF9pZCIsInNhdmUiLCJzeW5jaHJvbml6ZXIiLCJpbmNyZW1lbnRSZWNvcmRDb3VudCIsImZpbmlzaCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImhhc0NyZWF0ZWRMb2NhdGlvbiIsImhhc1VwZGF0ZWRMb2NhdGlvbiIsInN0YXR1cyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50X2NyZWF0ZWRfYXQiLCJjbGllbnRfdXBkYXRlZF9hdCIsImZvcm1faWQiLCJmb3JtX3ZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiYWx0aXR1ZGUiLCJzcGVlZCIsImNvdXJzZSIsImhvcml6b250YWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsImVkaXRlZF9kdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJhc3NpZ25lZF90byIsInByb2plY3QiLCJjcmVhdGVkX2xvY2F0aW9uIiwidXBkYXRlZF9sb2NhdGlvbiIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLHlDQUFvRDtBQUNqRUMsb0JBQTZCO0FBQUEsUUFBakIsRUFBQ0MsSUFBRCxFQUFpQjtBQUFBLFFBQVBDLElBQU87O0FBQzNCLFVBQU1BLElBQU47O0FBRUEsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQsTUFBSUUsaUJBQUosR0FBd0I7QUFDdEIsV0FBTyxLQUFLRixJQUFMLENBQVVHLEVBQWpCO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sS0FBS0osSUFBTCxDQUFVSyxJQUFqQjtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLUixJQUFMLENBQVVTLFNBQWpCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJGLFFBQW5CLEVBQTZCRyxRQUE3QixFQUF1QztBQUFBOztBQUFBO0FBQ3JDLGFBQU9ILFlBQVksSUFBWixHQUFvQixNQUFNLGlCQUFPSSxVQUFQLENBQWtCLE1BQUtDLE9BQXZCLEVBQWdDLE1BQUtiLElBQXJDLEVBQTJDVyxRQUEzQyxFQUFxRCxNQUFLRyxRQUEx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LG1CQUFheEIsSUFBSSxFQUFKLENBMUJSO0FBMkJMeUIsZUFBU3pCLElBQUksRUFBSixDQTNCSjtBQTRCTE4sb0JBQWNNLElBQUksRUFBSixDQTVCVDtBQTZCTDBCLHdCQUFrQnpCLHNCQUFzQjtBQUN0Q1csa0JBQVVaLElBQUksRUFBSixDQUQ0QjtBQUV0Q2EsbUJBQVdiLElBQUksRUFBSixDQUYyQjtBQUd0Q2Msa0JBQVVkLElBQUksRUFBSixDQUg0QjtBQUl0Q2lCLDZCQUFxQmpCLElBQUksRUFBSjtBQUppQixPQTdCbkM7QUFtQ0wyQix3QkFBa0J6QixzQkFBc0I7QUFDdENVLGtCQUFVWixJQUFJLEVBQUosQ0FENEI7QUFFdENhLG1CQUFXYixJQUFJLEVBQUosQ0FGMkI7QUFHdENjLGtCQUFVZCxJQUFJLEVBQUosQ0FINEI7QUFJdENpQiw2QkFBcUJqQixJQUFJLEVBQUo7QUFKaUI7QUFuQ25DLEtBQVA7QUEwQ0Q7O0FBRUQ0QixnQkFBY2hFLFFBQWQsRUFBd0JpRSxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUNuRSxRQUFWLEVBQW9Cb0UsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7S0FXTixLQUFLL0UsSUFBTCxDQUFVRyxFQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUEyQlgsS0FBS0gsSUFBTCxDQUFVRyxFQUFJOzswQkFFRzBFLGNBQWU7OztRQUdqQ0QsS0FBTTtDQTNDVjtBQTZDRDtBQTNMZ0U7a0JBQTlDOUUsZSIsImZpbGUiOiJkb3dubG9hZC1yZWNvcmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcclxuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcclxuaW1wb3J0IFJlY29yZCBmcm9tICcuLi8uLi9tb2RlbHMvcmVjb3JkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUmVjb3JkcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XHJcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XHJcbiAgICBzdXBlcihhcmdzKTtcclxuXHJcbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN5bmNSZXNvdXJjZVNjb3BlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZm9ybS5pZDtcclxuICB9XHJcblxyXG4gIGdldCBzeW5jTGFiZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xyXG4gICAgcmV0dXJuICdyZWNvcmRzJztcclxuICB9XHJcblxyXG4gIGdldCB0eXBlTmFtZSgpIHtcclxuICAgIHJldHVybiAncmVjb3JkJztcclxuICB9XHJcblxyXG4gIGdldCBsYXN0U3luYygpIHtcclxuICAgIHJldHVybiB0aGlzLmZvcm0uX2xhc3RTeW5jO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xyXG4gICAgcmV0dXJuIGxhc3RTeW5jID09IG51bGwgPyAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHModGhpcy5hY2NvdW50LCB0aGlzLmZvcm0sIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGF3YWl0IENsaWVudC5nZXRSZWNvcmRzSGlzdG9yeSh0aGlzLmFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKTtcclxuICB9XHJcblxyXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xyXG4gICAgcmV0dXJuIFJlY29yZC5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xyXG4gICAgaWYgKGF0dHJpYnV0ZXMuaGlzdG9yeV9jaGFuZ2VfdHlwZSA9PT0gJ2QnKSB7XHJcbiAgICAgIGlmIChvYmplY3QpIHtcclxuICAgICAgICBvYmplY3QuX2Zvcm0gPSB0aGlzLmZvcm07XHJcbiAgICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XHJcblxyXG4gICAgICAgIGF3YWl0IG9iamVjdC5kZWxldGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5faGFzQ2hhbmdlcyA9IHRydWU7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOmRlbGV0ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XHJcblxyXG4gICAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcclxuICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XHJcblxyXG4gICAgICB0aGlzLmZvcm0uX2xhc3RTeW5jID0gb2JqZWN0LnVwZGF0ZWRBdDtcclxuXHJcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5wcm9qZWN0X2lkLCAnX3Byb2plY3RSb3dJRCcsICdnZXRQcm9qZWN0Jyk7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xyXG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcclxuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNoYW5nZXNldF9pZCwgJ19jaGFuZ2VzZXRSb3dJRCcsICdnZXRDaGFuZ2VzZXQnKTtcclxuXHJcbiAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XHJcblxyXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgdGhpcy5faGFzQ2hhbmdlcyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zeW5jaHJvbml6ZXIuaW5jcmVtZW50UmVjb3JkQ291bnQoKTtcclxuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZDpzYXZlJywge3JlY29yZDogb2JqZWN0fSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGZpbmlzaCgpIHtcclxuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxyXG4gICAgYXdhaXQgdGhpcy5mb3JtLnNhdmUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5faGFzQ2hhbmdlcykge1xyXG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZHM6ZmluaXNoJywge2Zvcm06IHRoaXMuZm9ybX0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xyXG4gICAgY29uc3QgaGFzQ3JlYXRlZExvY2F0aW9uID1cclxuICAgICAgcm93WzI4XSAhPSBudWxsIHx8XHJcbiAgICAgIHJvd1syOV0gIT0gbnVsbCB8fFxyXG4gICAgICByb3dbMzBdICE9IG51bGwgfHxcclxuICAgICAgcm93WzMxXSAhPSBudWxsO1xyXG5cclxuICAgIGNvbnN0IGhhc1VwZGF0ZWRMb2NhdGlvbiA9XHJcbiAgICAgIHJvd1szMl0gIT0gbnVsbCB8fFxyXG4gICAgICByb3dbMzNdICE9IG51bGwgfHxcclxuICAgICAgcm93WzM0XSAhPSBudWxsIHx8XHJcbiAgICAgIHJvd1szNV0gIT0gbnVsbDtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzdGF0dXM6IHJvd1swXSxcclxuICAgICAgdmVyc2lvbjogcm93WzFdLFxyXG4gICAgICBpZDogcm93WzJdLFxyXG4gICAgICBjcmVhdGVkX2F0OiByb3dbM10sXHJcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1s0XSxcclxuICAgICAgY2xpZW50X2NyZWF0ZWRfYXQ6IHJvd1s1XSxcclxuICAgICAgY2xpZW50X3VwZGF0ZWRfYXQ6IHJvd1s2XSxcclxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzddLFxyXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbOF0sXHJcbiAgICAgIGZvcm1faWQ6IHJvd1s5XSxcclxuICAgICAgcHJvamVjdF9pZDogcm93WzEwXSxcclxuICAgICAgYXNzaWduZWRfdG9faWQ6IHJvd1sxMV0sXHJcbiAgICAgIGZvcm1fdmFsdWVzOiBKU09OLnBhcnNlKHJvd1sxMl0pLFxyXG4gICAgICBsYXRpdHVkZTogcm93WzEzXSxcclxuICAgICAgbG9uZ2l0dWRlOiByb3dbMTRdLFxyXG4gICAgICBhbHRpdHVkZTogcm93WzE1XSxcclxuICAgICAgc3BlZWQ6IHJvd1sxNl0sXHJcbiAgICAgIGNvdXJzZTogcm93WzE3XSxcclxuICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzE4XSxcclxuICAgICAgdmVydGljYWxfYWNjdXJhY3k6IHJvd1sxOV0sXHJcbiAgICAgIGVkaXRlZF9kdXJhdGlvbjogcm93WzIwXSxcclxuICAgICAgdXBkYXRlZF9kdXJhdGlvbjogcm93WzIxXSxcclxuICAgICAgY3JlYXRlZF9kdXJhdGlvbjogcm93WzIyXSxcclxuICAgICAgY3JlYXRlZF9ieTogcm93WzIzXSxcclxuICAgICAgdXBkYXRlZF9ieTogcm93WzI0XSxcclxuICAgICAgYXNzaWduZWRfdG86IHJvd1syNV0sXHJcbiAgICAgIHByb2plY3Q6IHJvd1syNl0sXHJcbiAgICAgIGNoYW5nZXNldF9pZDogcm93WzI3XSxcclxuICAgICAgY3JlYXRlZF9sb2NhdGlvbjogaGFzQ3JlYXRlZExvY2F0aW9uICYmIHtcclxuICAgICAgICBsYXRpdHVkZTogcm93WzI4XSxcclxuICAgICAgICBsb25naXR1ZGU6IHJvd1syOV0sXHJcbiAgICAgICAgYWx0aXR1ZGU6IHJvd1szMF0sXHJcbiAgICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzMxXVxyXG4gICAgICB9LFxyXG4gICAgICB1cGRhdGVkX2xvY2F0aW9uOiBoYXNVcGRhdGVkTG9jYXRpb24gJiYge1xyXG4gICAgICAgIGxhdGl0dWRlOiByb3dbMzJdLFxyXG4gICAgICAgIGxvbmdpdHVkZTogcm93WzMzXSxcclxuICAgICAgICBhbHRpdHVkZTogcm93WzM0XSxcclxuICAgICAgICBob3Jpem9udGFsX2FjY3VyYWN5OiByb3dbMzVdXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xyXG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XHJcblxyXG4gICAgcmV0dXJuIGBcclxuU0VMRUNUXHJcbiAgXCJfc3RhdHVzXCIgQVMgXCJzdGF0dXNcIixcclxuICBcIl92ZXJzaW9uXCIgQVMgXCJ2ZXJzaW9uXCIsXHJcbiAgXCJfcmVjb3JkX2lkXCIgQVMgXCJpZFwiLFxyXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfc2VydmVyX2NyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcclxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3NlcnZlcl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXHJcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9jcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbGllbnRfY3JlYXRlZF9hdFwiLFxyXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfdXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xpZW50X3VwZGF0ZWRfYXRcIixcclxuICBcIl9jcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXHJcbiAgXCJfdXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxyXG4gICckeyB0aGlzLmZvcm0uaWQgfSc6OnRleHQgQVMgXCJmb3JtX2lkXCIsXHJcbiAgXCJfcHJvamVjdF9pZFwiIEFTIFwicHJvamVjdF9pZFwiLFxyXG4gIFwiX2Fzc2lnbmVkX3RvX2lkXCIgQVMgXCJhc3NpZ25lZF90b19pZFwiLFxyXG4gIFwiX2Zvcm1fdmFsdWVzXCIgQVMgXCJmb3JtX3ZhbHVlc1wiLFxyXG4gIFwiX2xhdGl0dWRlXCIgQVMgXCJsYXRpdHVkZVwiLFxyXG4gIFwiX2xvbmdpdHVkZVwiIEFTIFwibG9uZ2l0dWRlXCIsXHJcbiAgXCJfYWx0aXR1ZGVcIiBBUyBcImFsdGl0dWRlXCIsXHJcbiAgXCJfc3BlZWRcIiBBUyBcInNwZWVkXCIsXHJcbiAgXCJfY291cnNlXCIgQVMgXCJjb3Vyc2VcIixcclxuICBcIl9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJob3Jpem9udGFsX2FjY3VyYWN5XCIsXHJcbiAgXCJfdmVydGljYWxfYWNjdXJhY3lcIiBBUyBcInZlcnRpY2FsX2FjY3VyYWN5XCIsXHJcbiAgXCJfZWRpdGVkX2R1cmF0aW9uXCIgQVMgXCJlZGl0ZWRfZHVyYXRpb25cIixcclxuICBcIl91cGRhdGVkX2R1cmF0aW9uXCIgQVMgXCJ1cGRhdGVkX2R1cmF0aW9uXCIsXHJcbiAgXCJfY3JlYXRlZF9kdXJhdGlvblwiIEFTIFwiY3JlYXRlZF9kdXJhdGlvblwiLFxyXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXHJcbiAgTlVMTCBBUyBcInVwZGF0ZWRfYnlcIixcclxuICBOVUxMIEFTIFwiYXNzaWduZWRfdG9cIixcclxuICBOVUxMIEFTIFwicHJvamVjdFwiLFxyXG4gIFwiX2NoYW5nZXNldF9pZFwiIEFTIFwiY2hhbmdlc2V0X2lkXCIsXHJcbiAgXCJfY3JlYXRlZF9sYXRpdHVkZVwiIEFTIFwiY3JlYXRlZF9sYXRpdHVkZVwiLFxyXG4gIFwiX2NyZWF0ZWRfbG9uZ2l0dWRlXCIgQVMgXCJjcmVhdGVkX2xvbmdpdHVkZVwiLFxyXG4gIFwiX2NyZWF0ZWRfYWx0aXR1ZGVcIiBBUyBcImNyZWF0ZWRfYWx0aXR1ZGVcIixcclxuICBcIl9jcmVhdGVkX2hvcml6b250YWxfYWNjdXJhY3lcIiBBUyBcImNyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeVwiLFxyXG4gIFwiX3VwZGF0ZWRfbGF0aXR1ZGVcIiBBUyBcInVwZGF0ZWRfbGF0aXR1ZGVcIixcclxuICBcIl91cGRhdGVkX2xvbmdpdHVkZVwiIEFTIFwidXBkYXRlZF9sb25naXR1ZGVcIixcclxuICBcIl91cGRhdGVkX2FsdGl0dWRlXCIgQVMgXCJ1cGRhdGVkX2FsdGl0dWRlXCIsXHJcbiAgXCJfdXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3lcIlxyXG5GUk9NIFwiJHsgdGhpcy5mb3JtLmlkIH0vX2Z1bGxcIiBBUyBcInJlY29yZHNcIlxyXG5XSEVSRVxyXG4gIF9zZXJ2ZXJfdXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcclxuT1JERVIgQllcclxuICBfc2VydmVyX3VwZGF0ZWRfYXQgQVNDXHJcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXHJcbmA7XHJcbiAgfVxyXG59XHJcbiJdfQ==