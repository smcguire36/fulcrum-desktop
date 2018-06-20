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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlU2NvcGUiLCJpZCIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiX2xhc3RTeW5jIiwiZmV0Y2hPYmplY3RzIiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwiYWNjb3VudCIsInBhZ2VTaXplIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsInByb2Nlc3MiLCJvYmplY3QiLCJoaXN0b3J5X2NoYW5nZV90eXBlIiwiX2Zvcm0iLCJfZm9ybVJvd0lEIiwiZGVsZXRlIiwiX2hhc0NoYW5nZXMiLCJ0cmlnZ2VyIiwicmVjb3JkIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJ2ZXJzaW9uIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJ1cGRhdGVkQXQiLCJsb29rdXAiLCJwcm9qZWN0X2lkIiwiYXNzaWduZWRfdG9faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsImNoYW5nZXNldF9pZCIsInNhdmUiLCJzeW5jaHJvbml6ZXIiLCJpbmNyZW1lbnRSZWNvcmRDb3VudCIsImZpbmlzaCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImhhc0NyZWF0ZWRMb2NhdGlvbiIsImhhc1VwZGF0ZWRMb2NhdGlvbiIsInN0YXR1cyIsImNyZWF0ZWRfYXQiLCJ1cGRhdGVkX2F0IiwiY2xpZW50X2NyZWF0ZWRfYXQiLCJjbGllbnRfdXBkYXRlZF9hdCIsImZvcm1faWQiLCJmb3JtX3ZhbHVlcyIsIkpTT04iLCJwYXJzZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiYWx0aXR1ZGUiLCJzcGVlZCIsImNvdXJzZSIsImhvcml6b250YWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsImVkaXRlZF9kdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2R1cmF0aW9uIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJhc3NpZ25lZF90byIsInByb2plY3QiLCJjcmVhdGVkX2xvY2F0aW9uIiwidXBkYXRlZF9sb2NhdGlvbiIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFZSxNQUFNQSxlQUFOLHlDQUFvRDtBQUNqRUMsb0JBQTZCO0FBQUEsUUFBakIsRUFBQ0MsSUFBRCxFQUFpQjtBQUFBLFFBQVBDLElBQU87O0FBQzNCLFVBQU1BLElBQU47O0FBRUEsU0FBS0QsSUFBTCxHQUFZQSxJQUFaO0FBQ0Q7O0FBRUQsTUFBSUUsaUJBQUosR0FBd0I7QUFDdEIsV0FBTyxLQUFLRixJQUFMLENBQVVHLEVBQWpCO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sS0FBS0osSUFBTCxDQUFVSyxJQUFqQjtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLUixJQUFMLENBQVVTLFNBQWpCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJGLFFBQW5CLEVBQTZCRyxRQUE3QixFQUF1QztBQUFBOztBQUFBO0FBQ3JDLGFBQU9ILFlBQVksSUFBWixHQUFvQixNQUFNLGlCQUFPSSxVQUFQLENBQWtCLE1BQUtDLE9BQXZCLEVBQWdDLE1BQUtiLElBQXJDLEVBQTJDVyxRQUEzQyxFQUFxRCxNQUFLRyxRQUEx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LG1CQUFheEIsSUFBSSxFQUFKLENBMUJSO0FBMkJMeUIsZUFBU3pCLElBQUksRUFBSixDQTNCSjtBQTRCTE4sb0JBQWNNLElBQUksRUFBSixDQTVCVDtBQTZCTDBCLHdCQUFrQnpCLHNCQUFzQjtBQUN0Q1csa0JBQVVaLElBQUksRUFBSixDQUQ0QjtBQUV0Q2EsbUJBQVdiLElBQUksRUFBSixDQUYyQjtBQUd0Q2Msa0JBQVVkLElBQUksRUFBSixDQUg0QjtBQUl0Q2lCLDZCQUFxQmpCLElBQUksRUFBSjtBQUppQixPQTdCbkM7QUFtQ0wyQix3QkFBa0J6QixzQkFBc0I7QUFDdENVLGtCQUFVWixJQUFJLEVBQUosQ0FENEI7QUFFdENhLG1CQUFXYixJQUFJLEVBQUosQ0FGMkI7QUFHdENjLGtCQUFVZCxJQUFJLEVBQUosQ0FINEI7QUFJdENpQiw2QkFBcUJqQixJQUFJLEVBQUo7QUFKaUI7QUFuQ25DLEtBQVA7QUEwQ0Q7O0FBRUQ0QixnQkFBY2hFLFFBQWQsRUFBd0JpRSxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUNuRSxRQUFWLEVBQW9Cb0UsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7S0FXTixLQUFLL0UsSUFBTCxDQUFVRyxFQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7UUEyQlgsS0FBS0gsSUFBTCxDQUFVRyxFQUFJOzswQkFFRzBFLGNBQWU7OztRQUdqQ0QsS0FBTTtDQTNDVjtBQTZDRDtBQTNMZ0U7a0JBQTlDOUUsZSIsImZpbGUiOiJkb3dubG9hZC1yZWNvcmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgUmVjb3JkIGZyb20gJy4uLy4uL21vZGVscy9yZWNvcmQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFJlY29yZHMgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBjb25zdHJ1Y3Rvcih7Zm9ybSwgLi4uYXJnc30pIHtcbiAgICBzdXBlcihhcmdzKTtcblxuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gIH1cblxuICBnZXQgc3luY1Jlc291cmNlU2NvcGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5pZDtcbiAgfVxuXG4gIGdldCBzeW5jTGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5uYW1lO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3JlY29yZHMnO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAncmVjb3JkJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLl9sYXN0U3luYztcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gbGFzdFN5bmMgPT0gbnVsbCA/IChhd2FpdCBDbGllbnQuZ2V0UmVjb3Jkcyh0aGlzLmFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKGF3YWl0IENsaWVudC5nZXRSZWNvcmRzSGlzdG9yeSh0aGlzLmFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogdGhpcy5hY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZH0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoYXR0cmlidXRlcy5oaXN0b3J5X2NoYW5nZV90eXBlID09PSAnZCcpIHtcbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgb2JqZWN0Ll9mb3JtID0gdGhpcy5mb3JtO1xuICAgICAgICBvYmplY3QuX2Zvcm1Sb3dJRCA9IHRoaXMuZm9ybS5yb3dJRDtcblxuICAgICAgICBhd2FpdCBvYmplY3QuZGVsZXRlKCk7XG5cbiAgICAgICAgdGhpcy5faGFzQ2hhbmdlcyA9IHRydWU7XG5cbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmQ6ZGVsZXRlJywge3JlY29yZDogb2JqZWN0fSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHwgYXR0cmlidXRlcy52ZXJzaW9uICE9PSBvYmplY3QudmVyc2lvbjtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgb2JqZWN0Ll9mb3JtID0gdGhpcy5mb3JtO1xuICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XG5cbiAgICAgIHRoaXMuZm9ybS5fbGFzdFN5bmMgPSBvYmplY3QudXBkYXRlZEF0O1xuXG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMucHJvamVjdF9pZCwgJ19wcm9qZWN0Um93SUQnLCAnZ2V0UHJvamVjdCcpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmFzc2lnbmVkX3RvX2lkLCAnX2Fzc2lnbmVkVG9Sb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY2hhbmdlc2V0X2lkLCAnX2NoYW5nZXNldFJvd0lEJywgJ2dldENoYW5nZXNldCcpO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgICB0aGlzLnN5bmNocm9uaXplci5pbmNyZW1lbnRSZWNvcmRDb3VudCgpO1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZDpzYXZlJywge3JlY29yZDogb2JqZWN0fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxuICAgIGF3YWl0IHRoaXMuZm9ybS5zYXZlKCk7XG5cbiAgICBpZiAodGhpcy5faGFzQ2hhbmdlcykge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmRzOmZpbmlzaCcsIHtmb3JtOiB0aGlzLmZvcm19KTtcbiAgICB9XG4gIH1cblxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XG4gICAgY29uc3QgaGFzQ3JlYXRlZExvY2F0aW9uID1cbiAgICAgIHJvd1syOF0gIT0gbnVsbCB8fFxuICAgICAgcm93WzI5XSAhPSBudWxsIHx8XG4gICAgICByb3dbMzBdICE9IG51bGwgfHxcbiAgICAgIHJvd1szMV0gIT0gbnVsbDtcblxuICAgIGNvbnN0IGhhc1VwZGF0ZWRMb2NhdGlvbiA9XG4gICAgICByb3dbMzJdICE9IG51bGwgfHxcbiAgICAgIHJvd1szM10gIT0gbnVsbCB8fFxuICAgICAgcm93WzM0XSAhPSBudWxsIHx8XG4gICAgICByb3dbMzVdICE9IG51bGw7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RhdHVzOiByb3dbMF0sXG4gICAgICB2ZXJzaW9uOiByb3dbMV0sXG4gICAgICBpZDogcm93WzJdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzNdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzRdLFxuICAgICAgY2xpZW50X2NyZWF0ZWRfYXQ6IHJvd1s1XSxcbiAgICAgIGNsaWVudF91cGRhdGVkX2F0OiByb3dbNl0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbOF0sXG4gICAgICBmb3JtX2lkOiByb3dbOV0sXG4gICAgICBwcm9qZWN0X2lkOiByb3dbMTBdLFxuICAgICAgYXNzaWduZWRfdG9faWQ6IHJvd1sxMV0sXG4gICAgICBmb3JtX3ZhbHVlczogSlNPTi5wYXJzZShyb3dbMTJdKSxcbiAgICAgIGxhdGl0dWRlOiByb3dbMTNdLFxuICAgICAgbG9uZ2l0dWRlOiByb3dbMTRdLFxuICAgICAgYWx0aXR1ZGU6IHJvd1sxNV0sXG4gICAgICBzcGVlZDogcm93WzE2XSxcbiAgICAgIGNvdXJzZTogcm93WzE3XSxcbiAgICAgIGhvcml6b250YWxfYWNjdXJhY3k6IHJvd1sxOF0sXG4gICAgICB2ZXJ0aWNhbF9hY2N1cmFjeTogcm93WzE5XSxcbiAgICAgIGVkaXRlZF9kdXJhdGlvbjogcm93WzIwXSxcbiAgICAgIHVwZGF0ZWRfZHVyYXRpb246IHJvd1syMV0sXG4gICAgICBjcmVhdGVkX2R1cmF0aW9uOiByb3dbMjJdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzIzXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1syNF0sXG4gICAgICBhc3NpZ25lZF90bzogcm93WzI1XSxcbiAgICAgIHByb2plY3Q6IHJvd1syNl0sXG4gICAgICBjaGFuZ2VzZXRfaWQ6IHJvd1syN10sXG4gICAgICBjcmVhdGVkX2xvY2F0aW9uOiBoYXNDcmVhdGVkTG9jYXRpb24gJiYge1xuICAgICAgICBsYXRpdHVkZTogcm93WzI4XSxcbiAgICAgICAgbG9uZ2l0dWRlOiByb3dbMjldLFxuICAgICAgICBhbHRpdHVkZTogcm93WzMwXSxcbiAgICAgICAgaG9yaXpvbnRhbF9hY2N1cmFjeTogcm93WzMxXVxuICAgICAgfSxcbiAgICAgIHVwZGF0ZWRfbG9jYXRpb246IGhhc1VwZGF0ZWRMb2NhdGlvbiAmJiB7XG4gICAgICAgIGxhdGl0dWRlOiByb3dbMzJdLFxuICAgICAgICBsb25naXR1ZGU6IHJvd1szM10sXG4gICAgICAgIGFsdGl0dWRlOiByb3dbMzRdLFxuICAgICAgICBob3Jpem9udGFsX2FjY3VyYWN5OiByb3dbMzVdXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlUXVlcnkoc2VxdWVuY2UsIGxpbWl0KSB7XG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gYFxuU0VMRUNUXG4gIFwiX3N0YXR1c1wiIEFTIFwic3RhdHVzXCIsXG4gIFwiX3ZlcnNpb25cIiBBUyBcInZlcnNpb25cIixcbiAgXCJfcmVjb3JkX2lkXCIgQVMgXCJpZFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3NlcnZlcl9jcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfc2VydmVyX3VwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9jcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbGllbnRfY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3VwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNsaWVudF91cGRhdGVkX2F0XCIsXG4gIFwiX2NyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJfdXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICAnJHsgdGhpcy5mb3JtLmlkIH0nOjp0ZXh0IEFTIFwiZm9ybV9pZFwiLFxuICBcIl9wcm9qZWN0X2lkXCIgQVMgXCJwcm9qZWN0X2lkXCIsXG4gIFwiX2Fzc2lnbmVkX3RvX2lkXCIgQVMgXCJhc3NpZ25lZF90b19pZFwiLFxuICBcIl9mb3JtX3ZhbHVlc1wiIEFTIFwiZm9ybV92YWx1ZXNcIixcbiAgXCJfbGF0aXR1ZGVcIiBBUyBcImxhdGl0dWRlXCIsXG4gIFwiX2xvbmdpdHVkZVwiIEFTIFwibG9uZ2l0dWRlXCIsXG4gIFwiX2FsdGl0dWRlXCIgQVMgXCJhbHRpdHVkZVwiLFxuICBcIl9zcGVlZFwiIEFTIFwic3BlZWRcIixcbiAgXCJfY291cnNlXCIgQVMgXCJjb3Vyc2VcIixcbiAgXCJfaG9yaXpvbnRhbF9hY2N1cmFjeVwiIEFTIFwiaG9yaXpvbnRhbF9hY2N1cmFjeVwiLFxuICBcIl92ZXJ0aWNhbF9hY2N1cmFjeVwiIEFTIFwidmVydGljYWxfYWNjdXJhY3lcIixcbiAgXCJfZWRpdGVkX2R1cmF0aW9uXCIgQVMgXCJlZGl0ZWRfZHVyYXRpb25cIixcbiAgXCJfdXBkYXRlZF9kdXJhdGlvblwiIEFTIFwidXBkYXRlZF9kdXJhdGlvblwiLFxuICBcIl9jcmVhdGVkX2R1cmF0aW9uXCIgQVMgXCJjcmVhdGVkX2R1cmF0aW9uXCIsXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIE5VTEwgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIE5VTEwgQVMgXCJhc3NpZ25lZF90b1wiLFxuICBOVUxMIEFTIFwicHJvamVjdFwiLFxuICBcIl9jaGFuZ2VzZXRfaWRcIiBBUyBcImNoYW5nZXNldF9pZFwiLFxuICBcIl9jcmVhdGVkX2xhdGl0dWRlXCIgQVMgXCJjcmVhdGVkX2xhdGl0dWRlXCIsXG4gIFwiX2NyZWF0ZWRfbG9uZ2l0dWRlXCIgQVMgXCJjcmVhdGVkX2xvbmdpdHVkZVwiLFxuICBcIl9jcmVhdGVkX2FsdGl0dWRlXCIgQVMgXCJjcmVhdGVkX2FsdGl0dWRlXCIsXG4gIFwiX2NyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeVwiIEFTIFwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCIsXG4gIFwiX3VwZGF0ZWRfbGF0aXR1ZGVcIiBBUyBcInVwZGF0ZWRfbGF0aXR1ZGVcIixcbiAgXCJfdXBkYXRlZF9sb25naXR1ZGVcIiBBUyBcInVwZGF0ZWRfbG9uZ2l0dWRlXCIsXG4gIFwiX3VwZGF0ZWRfYWx0aXR1ZGVcIiBBUyBcInVwZGF0ZWRfYWx0aXR1ZGVcIixcbiAgXCJfdXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3lcIlxuRlJPTSBcIiR7IHRoaXMuZm9ybS5pZCB9L19mdWxsXCIgQVMgXCJyZWNvcmRzXCJcbldIRVJFXG4gIF9zZXJ2ZXJfdXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIF9zZXJ2ZXJfdXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=