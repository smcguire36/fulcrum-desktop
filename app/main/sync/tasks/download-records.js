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

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tempy = require('tempy');

var _tempy2 = _interopRequireDefault(_tempy);

var _jsonseq = require('../../../jsonseq');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const QUERY_PAGE_SIZE = 50000;

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

  download(account, lastSync, sequence, state) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (lastSync != null) {
        yield _downloadSequence2.default.prototype.download.call(_this4, account, lastSync, sequence, state);
      } else {
        const sql = _this4.recordQuery(_this4.form, sequence || 0);

        const options = _client2.default.getQueryURL(account, sql);

        const filePath = _tempy2.default.file({ extension: 'jsonseq' });

        _this4.progress({ message: _this4.downloading + ' ' + _this4.syncLabel.blue });

        yield _this4.downloadQuery(options, filePath);

        const { count, lastRecord } = yield _this4.processRecords(account, filePath);

        const message = (0, _util.format)(_this4.finished + ' %s', _this4.syncLabel.blue);

        _this4.progress({ message, count: count, total: -1 });

        if (count >= QUERY_PAGE_SIZE) {
          const nextSequence = Math.ceil(lastRecord.updatedAt.getTime() - 1);
          yield _this4.download(account, lastSync, nextSequence, state);
        } else {
          yield state.update();
          yield _this4.finish();
        }
      }
    })();
  }

  processRecords(account, filePath) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      _this5.progress({ message: _this5.processing + ' ' + _this5.syncLabel.blue, count: 0, total: -1 });

      let index = 0;
      let lastRecord = null;

      yield account.db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          yield new Promise(function (resolve, reject) {
            const onObject = function (json, done) {
              if (json.row) {
                _this5.processRecord(json, account, database, function (record) {
                  lastRecord = record;
                  _this5.progress({ message: _this5.processing + ' ' + _this5.syncLabel.blue, count: index + 1, total: -1 });
                  ++index;
                  done();
                });
              } else {
                done();
              }
            };

            const onInvalid = function (data, done) {
              console.error('Invalid', data);
              done();
            };

            const onTruncated = function (data, done) {
              console.error('Truncated:', data, done);
              done();
            };

            const onEnd = function () {
              resolve();
            };

            const onError = function (err) {
              reject(err);
            };

            (0, _jsonseq.parseFile)(filePath, { onObject, onInvalid, onTruncated }).on('end', onEnd).on('error', onError);
          });
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      return { count: index, lastRecord };
    })();
  }

  processRecord(json, account, database, done) {
    this.processRecordAsync(json, account, database).then(done).catch(done);
  }

  processRecordAsync(json, account, database) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const { row } = json;

      const attributes = {
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
        project: row[26]
      };

      const object = yield _record2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.id });

      const isChanged = !object.isPersisted || attributes.version !== object.version;

      object.updateFromAPIAttributes(attributes);
      object._form = _this6.form;
      object._formRowID = _this6.form.rowID;

      _this6.form._lastSync = object.updatedAt;

      yield _this6.lookup(object, attributes.project_id, '_projectRowID', 'getProject');
      yield _this6.lookup(object, attributes.assigned_to_id, '_assignedToRowID', 'getUser');
      yield _this6.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      yield _this6.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

      yield object.save({ timestamps: false });

      if (isChanged) {
        _this6._hasChanges = true;
        yield _this6.trigger('record:save', { record: object });
      }

      return object;
    })();
  }

  downloadQuery(options, to) {
    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        const rq = (0, _request2.default)(options).pipe(_fs2.default.createWriteStream(to));
        rq.on('close', function () {
          return resolve(rq);
        });
        rq.on('error', reject);
      });
    })();
  }

  recordQuery(form, sequence = 0, limit = QUERY_PAGE_SIZE) {
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
  '${form.id}'::text AS "form_id",
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
  "project"."name" AS "project"
FROM "${form.id}/_full" AS "records"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcmVjb3Jkcy5qcyJdLCJuYW1lcyI6WyJRVUVSWV9QQUdFX1NJWkUiLCJEb3dubG9hZFJlY29yZHMiLCJjb25zdHJ1Y3RvciIsImZvcm0iLCJhcmdzIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNSZXNvdXJjZVNjb3BlIiwiaWQiLCJzeW5jTGFiZWwiLCJuYW1lIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJfbGFzdFN5bmMiLCJmZXRjaE9iamVjdHMiLCJhY2NvdW50Iiwic2VxdWVuY2UiLCJnZXRSZWNvcmRzIiwicGFnZVNpemUiLCJnZXRSZWNvcmRzSGlzdG9yeSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwicHJvY2VzcyIsIm9iamVjdCIsImhpc3RvcnlfY2hhbmdlX3R5cGUiLCJfZm9ybSIsIl9mb3JtUm93SUQiLCJkZWxldGUiLCJfaGFzQ2hhbmdlcyIsInRyaWdnZXIiLCJyZWNvcmQiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsInVwZGF0ZWRBdCIsImxvb2t1cCIsInByb2plY3RfaWQiLCJhc3NpZ25lZF90b19pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwic2F2ZSIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCIsImRvd25sb2FkIiwic3RhdGUiLCJwcm90b3R5cGUiLCJjYWxsIiwic3FsIiwicmVjb3JkUXVlcnkiLCJvcHRpb25zIiwiZ2V0UXVlcnlVUkwiLCJmaWxlUGF0aCIsImZpbGUiLCJleHRlbnNpb24iLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsImJsdWUiLCJkb3dubG9hZFF1ZXJ5IiwiY291bnQiLCJsYXN0UmVjb3JkIiwicHJvY2Vzc1JlY29yZHMiLCJmaW5pc2hlZCIsInRvdGFsIiwibmV4dFNlcXVlbmNlIiwiTWF0aCIsImNlaWwiLCJnZXRUaW1lIiwidXBkYXRlIiwicHJvY2Vzc2luZyIsImluZGV4IiwiZGIiLCJ0cmFuc2FjdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25PYmplY3QiLCJqc29uIiwiZG9uZSIsInJvdyIsInByb2Nlc3NSZWNvcmQiLCJvbkludmFsaWQiLCJkYXRhIiwiZXJyb3IiLCJvblRydW5jYXRlZCIsIm9uRW5kIiwib25FcnJvciIsImVyciIsIm9uIiwicHJvY2Vzc1JlY29yZEFzeW5jIiwidGhlbiIsImNhdGNoIiwic3RhdHVzIiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJjbGllbnRfY3JlYXRlZF9hdCIsImNsaWVudF91cGRhdGVkX2F0IiwiZm9ybV9pZCIsImZvcm1fdmFsdWVzIiwiSlNPTiIsInBhcnNlIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJhbHRpdHVkZSIsInNwZWVkIiwiY291cnNlIiwiaG9yaXpvbnRhbF9hY2N1cmFjeSIsInZlcnRpY2FsX2FjY3VyYWN5IiwiZWRpdGVkX2R1cmF0aW9uIiwidXBkYXRlZF9kdXJhdGlvbiIsImNyZWF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9ieSIsImFzc2lnbmVkX3RvIiwicHJvamVjdCIsInRpbWVzdGFtcHMiLCJ0byIsInJxIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUEsa0JBQWtCLEtBQXhCOztBQUVlLE1BQU1DLGVBQU4sb0NBQStDO0FBQzVEQyxvQkFBNkI7QUFBQSxRQUFq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LEVBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQWtCTkosS0FBS0ksRUFBSTs7Ozs7OzBCQU1RNEgsY0FBZTs7O1FBR2pDRCxLQUFNO0NBdENWO0FBd0NEO0FBcFIyRDtrQkFBekNqSSxlIiwiZmlsZSI6ImRvd25sb2FkLXJlY29yZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgUmVjb3JkIGZyb20gJy4uLy4uL21vZGVscy9yZWNvcmQnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHRlbXB5IGZyb20gJ3RlbXB5JztcbmltcG9ydCB7IHBhcnNlRmlsZSB9IGZyb20gJy4uLy4uLy4uL2pzb25zZXEnO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IFFVRVJZX1BBR0VfU0laRSA9IDUwMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFJlY29yZHMgZXh0ZW5kcyBEb3dubG9hZFNlcXVlbmNlIHtcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdyZWNvcmRzJztcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VTY29wZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLmlkO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncmVjb3Jkcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5fbGFzdFN5bmM7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIGxhc3RTeW5jID09IG51bGwgPyAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHMoYWNjb3VudCwgdGhpcy5mb3JtLCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAoYXdhaXQgQ2xpZW50LmdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIHRoaXMuZm9ybSwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWR9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKGF0dHJpYnV0ZXMuaGlzdG9yeV9jaGFuZ2VfdHlwZSA9PT0gJ2QnKSB7XG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgICAgb2JqZWN0Ll9mb3JtUm93SUQgPSB0aGlzLmZvcm0ucm93SUQ7XG5cbiAgICAgICAgYXdhaXQgb2JqZWN0LmRlbGV0ZSgpO1xuXG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuXG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigncmVjb3JkOmRlbGV0ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZm9ybSA9IHRoaXMuZm9ybTtcbiAgICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgICB0aGlzLmZvcm0uX2xhc3RTeW5jID0gb2JqZWN0LnVwZGF0ZWRBdDtcblxuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnByb2plY3RfaWQsICdfcHJvamVjdFJvd0lEJywgJ2dldFByb2plY3QnKTtcbiAgICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3JlY29yZDpzYXZlJywge3JlY29yZDogb2JqZWN0fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxuICAgIGF3YWl0IHRoaXMuZm9ybS5zYXZlKCk7XG5cbiAgICBpZiAodGhpcy5faGFzQ2hhbmdlcykge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmRzOmZpbmlzaCcsIHtmb3JtOiB0aGlzLmZvcm19KTtcbiAgICB9XG4gIH1cblxuICBmYWlsKGFjY291bnQsIHJlc3VsdHMpIHtcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50Lm9yZ2FuaXphdGlvbk5hbWUuZ3JlZW4sICdmYWlsZWQnLnJlZCk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgaWYgKGxhc3RTeW5jICE9IG51bGwpIHtcbiAgICAgIGF3YWl0IERvd25sb2FkU2VxdWVuY2UucHJvdG90eXBlLmRvd25sb2FkLmNhbGwodGhpcywgYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNxbCA9IHRoaXMucmVjb3JkUXVlcnkodGhpcy5mb3JtLCBzZXF1ZW5jZSB8fCAwKTtcblxuICAgICAgY29uc3Qgb3B0aW9ucyA9IENsaWVudC5nZXRRdWVyeVVSTChhY2NvdW50LCBzcWwpO1xuXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHRlbXB5LmZpbGUoe2V4dGVuc2lvbjogJ2pzb25zZXEnfSk7XG5cbiAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XG5cbiAgICAgIGF3YWl0IHRoaXMuZG93bmxvYWRRdWVyeShvcHRpb25zLCBmaWxlUGF0aCk7XG5cbiAgICAgIGNvbnN0IHtjb3VudCwgbGFzdFJlY29yZH0gPSBhd2FpdCB0aGlzLnByb2Nlc3NSZWNvcmRzKGFjY291bnQsIGZpbGVQYXRoKTtcblxuICAgICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY0xhYmVsLmJsdWUpO1xuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogY291bnQsIHRvdGFsOiAtMX0pO1xuXG4gICAgICBpZiAoY291bnQgPj0gUVVFUllfUEFHRV9TSVpFKSB7XG4gICAgICAgIGNvbnN0IG5leHRTZXF1ZW5jZSA9IE1hdGguY2VpbChsYXN0UmVjb3JkLnVwZGF0ZWRBdC5nZXRUaW1lKCkgLSAxKTtcbiAgICAgICAgYXdhaXQgdGhpcy5kb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgbmV4dFNlcXVlbmNlLCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCBzdGF0ZS51cGRhdGUoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5maW5pc2goKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVjb3JkcyhhY2NvdW50LCBmaWxlUGF0aCkge1xuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogLTF9KTtcblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGxhc3RSZWNvcmQgPSBudWxsO1xuXG4gICAgYXdhaXQgYWNjb3VudC5kYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgb25PYmplY3QgPSAoanNvbiwgZG9uZSkgPT4ge1xuICAgICAgICAgIGlmIChqc29uLnJvdykge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUmVjb3JkKGpzb24sIGFjY291bnQsIGRhdGFiYXNlLCAocmVjb3JkKSA9PiB7XG4gICAgICAgICAgICAgIGxhc3RSZWNvcmQgPSByZWNvcmQ7XG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiAtMX0pO1xuICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkludmFsaWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQnLCBkYXRhKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25UcnVuY2F0ZWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RydW5jYXRlZDonLCBkYXRhLCBkb25lKTtcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGFyc2VGaWxlKGZpbGVQYXRoLCB7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9KVxuICAgICAgICAgIC5vbignZW5kJywgb25FbmQpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge2NvdW50OiBpbmRleCwgbGFzdFJlY29yZH07XG4gIH1cblxuICBwcm9jZXNzUmVjb3JkKGpzb24sIGFjY291bnQsIGRhdGFiYXNlLCBkb25lKSB7XG4gICAgdGhpcy5wcm9jZXNzUmVjb3JkQXN5bmMoanNvbiwgYWNjb3VudCwgZGF0YWJhc2UpLnRoZW4oZG9uZSkuY2F0Y2goZG9uZSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUmVjb3JkQXN5bmMoanNvbiwgYWNjb3VudCwgZGF0YWJhc2UpIHtcbiAgICBjb25zdCB7cm93fSA9IGpzb247XG5cbiAgICBjb25zdCBhdHRyaWJ1dGVzID0ge1xuICAgICAgc3RhdHVzOiByb3dbMF0sXG4gICAgICB2ZXJzaW9uOiByb3dbMV0sXG4gICAgICBpZDogcm93WzJdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzNdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzRdLFxuICAgICAgY2xpZW50X2NyZWF0ZWRfYXQ6IHJvd1s1XSxcbiAgICAgIGNsaWVudF91cGRhdGVkX2F0OiByb3dbNl0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbOF0sXG4gICAgICBmb3JtX2lkOiByb3dbOV0sXG4gICAgICBwcm9qZWN0X2lkOiByb3dbMTBdLFxuICAgICAgYXNzaWduZWRfdG9faWQ6IHJvd1sxMV0sXG4gICAgICBmb3JtX3ZhbHVlczogSlNPTi5wYXJzZShyb3dbMTJdKSxcbiAgICAgIGxhdGl0dWRlOiByb3dbMTNdLFxuICAgICAgbG9uZ2l0dWRlOiByb3dbMTRdLFxuICAgICAgYWx0aXR1ZGU6IHJvd1sxNV0sXG4gICAgICBzcGVlZDogcm93WzE2XSxcbiAgICAgIGNvdXJzZTogcm93WzE3XSxcbiAgICAgIGhvcml6b250YWxfYWNjdXJhY3k6IHJvd1sxOF0sXG4gICAgICB2ZXJ0aWNhbF9hY2N1cmFjeTogcm93WzE5XSxcbiAgICAgIGVkaXRlZF9kdXJhdGlvbjogcm93WzIwXSxcbiAgICAgIHVwZGF0ZWRfZHVyYXRpb246IHJvd1syMV0sXG4gICAgICBjcmVhdGVkX2R1cmF0aW9uOiByb3dbMjJdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzIzXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1syNF0sXG4gICAgICBhc3NpZ25lZF90bzogcm93WzI1XSxcbiAgICAgIHByb2plY3Q6IHJvd1syNl1cbiAgICB9O1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgUmVjb3JkLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkfSk7XG5cbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgb2JqZWN0Ll9mb3JtID0gdGhpcy5mb3JtO1xuICAgIG9iamVjdC5fZm9ybVJvd0lEID0gdGhpcy5mb3JtLnJvd0lEO1xuXG4gICAgdGhpcy5mb3JtLl9sYXN0U3luYyA9IG9iamVjdC51cGRhdGVkQXQ7XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMucHJvamVjdF9pZCwgJ19wcm9qZWN0Um93SUQnLCAnZ2V0UHJvamVjdCcpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5hc3NpZ25lZF90b19pZCwgJ19hc3NpZ25lZFRvUm93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICBhd2FpdCBvYmplY3Quc2F2ZSh7dGltZXN0YW1wczogZmFsc2V9KTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIHRoaXMuX2hhc0NoYW5nZXMgPSB0cnVlO1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdyZWNvcmQ6c2F2ZScsIHtyZWNvcmQ6IG9iamVjdH0pO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJxID0gcmVxdWVzdChvcHRpb25zKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XG4gICAgICBycS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVjb3JkUXVlcnkoZm9ybSwgc2VxdWVuY2UgPSAwLCBsaW1pdCA9IFFVRVJZX1BBR0VfU0laRSkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcIl9zdGF0dXNcIiBBUyBcInN0YXR1c1wiLFxuICBcIl92ZXJzaW9uXCIgQVMgXCJ2ZXJzaW9uXCIsXG4gIFwiX3JlY29yZF9pZFwiIEFTIFwiaWRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl9zZXJ2ZXJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwiX3NlcnZlcl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJfY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY2xpZW50X2NyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcIl91cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjbGllbnRfdXBkYXRlZF9hdFwiLFxuICBcIl9jcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwiX3VwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgJyR7IGZvcm0uaWQgfSc6OnRleHQgQVMgXCJmb3JtX2lkXCIsXG4gIFwiX3Byb2plY3RfaWRcIiBBUyBcInByb2plY3RfaWRcIixcbiAgXCJfYXNzaWduZWRfdG9faWRcIiBBUyBcImFzc2lnbmVkX3RvX2lkXCIsXG4gIFwiX2Zvcm1fdmFsdWVzXCIgQVMgXCJmb3JtX3ZhbHVlc1wiLFxuICBcIl9sYXRpdHVkZVwiIEFTIFwibGF0aXR1ZGVcIixcbiAgXCJfbG9uZ2l0dWRlXCIgQVMgXCJsb25naXR1ZGVcIixcbiAgXCJfYWx0aXR1ZGVcIiBBUyBcImFsdGl0dWRlXCIsXG4gIFwiX3NwZWVkXCIgQVMgXCJzcGVlZFwiLFxuICBcIl9jb3Vyc2VcIiBBUyBcImNvdXJzZVwiLFxuICBcIl9ob3Jpem9udGFsX2FjY3VyYWN5XCIgQVMgXCJob3Jpem9udGFsX2FjY3VyYWN5XCIsXG4gIFwiX3ZlcnRpY2FsX2FjY3VyYWN5XCIgQVMgXCJ2ZXJ0aWNhbF9hY2N1cmFjeVwiLFxuICBcIl9lZGl0ZWRfZHVyYXRpb25cIiBBUyBcImVkaXRlZF9kdXJhdGlvblwiLFxuICBcIl91cGRhdGVkX2R1cmF0aW9uXCIgQVMgXCJ1cGRhdGVkX2R1cmF0aW9uXCIsXG4gIFwiX2NyZWF0ZWRfZHVyYXRpb25cIiBBUyBcImNyZWF0ZWRfZHVyYXRpb25cIixcbiAgXCJjcmVhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIFwidXBkYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwidXBkYXRlZF9ieVwiLFxuICBcImFzc2lnbmVkX3RvXCIuXCJuYW1lXCIgQVMgXCJhc3NpZ25lZF90b1wiLFxuICBcInByb2plY3RcIi5cIm5hbWVcIiBBUyBcInByb2plY3RcIlxuRlJPTSBcIiR7IGZvcm0uaWQgfS9fZnVsbFwiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJfY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJfdXBkYXRlZF9ieV9pZFwiKSA9IChcInVwZGF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiYXNzaWduZWRfdG9cIiBPTiAoKFwicmVjb3Jkc1wiLlwiX2Fzc2lnbmVkX3RvX2lkXCIpID0gKFwiYXNzaWduZWRfdG9cIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJwcm9qZWN0c1wiIEFTIFwicHJvamVjdFwiIE9OICgoXCJyZWNvcmRzXCIuXCJfcHJvamVjdF9pZFwiKSA9IChcInByb2plY3RcIi5cInByb2plY3RfaWRcIikpXG5XSEVSRVxuICBfc2VydmVyX3VwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBfc2VydmVyX3VwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19