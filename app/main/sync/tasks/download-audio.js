'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _audio = require('../../models/audio');

var _audio2 = _interopRequireDefault(_audio);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadAudio extends _downloadQuerySequence2.default {
  get syncResourceName() {
    return 'audio';
  }

  get syncLabel() {
    return 'audio';
  }

  get resourceName() {
    return 'audio';
  }

  get lastSync() {
    return this.account._lastSyncAudio;
  }

  get useRestAPI() {
    return false;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getAudio(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _audio2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      object.updateFromAPIAttributes(attributes);

      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      if (object.isDownloaded == null) {
        object.isDownloaded = false;
      }

      yield _this2.lookup(object, attributes.form_id, '_formRowID', 'getForm');
      yield _this2.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      yield _this2.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

      if (object._formRowID) {
        const record = yield _this2.account.findFirstRecord({ resource_id: attributes.record_id });

        if (record) {
          object._recordRowID = record.rowID;
        }
      }

      _this2.account._lastSyncAudio = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('audio:save', { audio: object });
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
      access_key: row[0],
      created_at: row[1],
      updated_at: row[2],
      uploaded: row[3],
      stored: row[4],
      processed: row[5],
      created_by_id: row[6],
      updated_by_id: row[7],
      form_id: row[8],
      record_id: row[9],
      content_type: row[10],
      file_size: row[11],
      metadata: row[12] && JSON.parse(row[12]),
      created_by: row[13],
      updated_by: row[14],
      track: row[15] && JSON.parse(row[15])
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "audio_id" AS "access_key",
  to_char(pg_catalog.timezone('UTC', "records"."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "created_at",
  to_char(pg_catalog.timezone('UTC', "records"."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "updated_at",
  "uploaded_at" IS NOT NULL AS uploaded,
  "stored_at" IS NOT NULL AS stored,
  "processed_at" IS NOT NULL AS processed,
  "created_by_id" AS "created_by_id",
  "updated_by_id" AS "updated_by_id",
  "form_id" AS "form_id",
  "record_id" AS "record_id",
  "content_type" AS "content_type",
  "file_size" AS "file_size",
  "metadata" AS "metadata",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by",
  "track" AS "track"
FROM "audio" AS "records"
LEFT OUTER JOIN "memberships" AS "created_by" ON (("records"."created_by_id") = ("created_by"."user_id"))
LEFT OUTER JOIN "memberships" AS "updated_by" ON (("records"."updated_by_id") = ("updated_by"."user_id"))
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadAudio;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtYXVkaW8uanMiXSwibmFtZXMiOlsiRG93bmxvYWRBdWRpbyIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jTGFiZWwiLCJyZXNvdXJjZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNBdWRpbyIsInVzZVJlc3RBUEkiLCJmZXRjaE9iamVjdHMiLCJzZXF1ZW5jZSIsImdldEF1ZGlvIiwicGFnZVNpemUiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsImFjY2Vzc19rZXkiLCJwcm9jZXNzIiwib2JqZWN0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY3JlYXRlZF9ieV9pZCIsInVwZGF0ZWRfYnlfaWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwiYXVkaW8iLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwidHJhY2siLCJnZW5lcmF0ZVF1ZXJ5IiwibGltaXQiLCJzZXF1ZW5j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QyxJQUFJLENBQUosQ0FEUDtBQUVMQyxrQkFBWUQsSUFBSSxDQUFKLENBRlA7QUFHTDFCLGtCQUFZMEIsSUFBSSxDQUFKLENBSFA7QUFJTEUsZ0JBQVVGLElBQUksQ0FBSixDQUpMO0FBS0xHLGNBQVFILElBQUksQ0FBSixDQUxIO0FBTUxJLGlCQUFXSixJQUFJLENBQUosQ0FOTjtBQU9McEIscUJBQWVvQixJQUFJLENBQUosQ0FQVjtBQVFMbkIscUJBQWVtQixJQUFJLENBQUosQ0FSVjtBQVNMckIsZUFBU3FCLElBQUksQ0FBSixDQVRKO0FBVUxmLGlCQUFXZSxJQUFJLENBQUosQ0FWTjtBQVdMSyxvQkFBY0wsSUFBSSxFQUFKLENBWFQ7QUFZTE0saUJBQVdOLElBQUksRUFBSixDQVpOO0FBYUxPLGdCQUFVUCxJQUFJLEVBQUosS0FBV1EsS0FBS0MsS0FBTCxDQUFXVCxJQUFJLEVBQUosQ0FBWCxDQWJoQjtBQWNMVSxrQkFBWVYsSUFBSSxFQUFKLENBZFA7QUFlTFcsa0JBQVlYLElBQUksRUFBSixDQWZQO0FBZ0JMWSxhQUFPWixJQUFJLEVBQUosS0FBV1EsS0FBS0MsS0FBTCxDQUFXVCxJQUFJLEVBQUosQ0FBWDtBQWhCYixLQUFQO0FBa0JEOztBQUVEYSxnQkFBY3ZELFFBQWQsRUFBd0J3RCxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUMxRCxRQUFWLEVBQW9CMkQsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFzQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F6QlY7QUEyQkQ7QUF4SDhEO2tCQUE1Q2pFLGEiLCJmaWxlIjoiZG93bmxvYWQtYXVkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBBdWRpbyBmcm9tICcuLi8uLi9tb2RlbHMvYXVkaW8nO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRBdWRpbyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnYXVkaW8nO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ2F1ZGlvJztcbiAgfVxuXG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhdWRpbyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNBdWRpbztcbiAgfVxuXG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldEF1ZGlvKGFjY291bnQsIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBBdWRpby5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiBhY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jQXVkaW8gPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ2F1ZGlvOnNhdmUnLCB7YXVkaW86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgbWV0YWRhdGE6IHJvd1sxMl0gJiYgSlNPTi5wYXJzZShyb3dbMTJdKSxcbiAgICAgIGNyZWF0ZWRfYnk6IHJvd1sxM10sXG4gICAgICB1cGRhdGVkX2J5OiByb3dbMTRdLFxuICAgICAgdHJhY2s6IHJvd1sxNV0gJiYgSlNPTi5wYXJzZShyb3dbMTVdKVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcImF1ZGlvX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwidHJhY2tcIiBBUyBcInRyYWNrXCJcbkZST00gXCJhdWRpb1wiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cInVwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19