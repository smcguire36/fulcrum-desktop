'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _video = require('../../models/video');

var _video2 = _interopRequireDefault(_video);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadVideos extends _downloadQuerySequence2.default {
  get syncResourceName() {
    return 'videos';
  }

  get syncLabel() {
    return 'videos';
  }

  get resourceName() {
    return 'videos';
  }

  get lastSync() {
    return this.account._lastSyncVideos;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getVideos(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _video2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
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

      _this2.account._lastSyncVideos = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('video:save', { video: object });
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

  convertTrack(track) {
    // convert a V1 style track to a V2 style track
    if (Array.isArray(track)) {
      return { tracks: [{ track }] };
    }

    return track;
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
      track: row[15] && this.convertTrack(JSON.parse(row[15]))
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "video_id" AS "access_key",
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
FROM "videos" AS "records"
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
exports.default = DownloadVideos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNMYWJlbCIsInJlc291cmNlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1ZpZGVvcyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0VmlkZW9zIiwicGFnZVNpemUiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsImFjY2Vzc19rZXkiLCJwcm9jZXNzIiwib2JqZWN0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY3JlYXRlZF9ieV9pZCIsInVwZGF0ZWRfYnlfaWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwidmlkZW8iLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJjb252ZXJ0VHJhY2siLCJ0cmFjayIsIkFycmF5IiwiaXNBcnJheSIsInRyYWNrcyIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImNyZWF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnki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ZmlsZSI6ImRvd25sb2FkLXZpZGVvcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFZpZGVvIGZyb20gJy4uLy4uL21vZGVscy92aWRlbyc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFZpZGVvcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW9zJztcbiAgfVxuXG4gIGdldCBzeW5jTGFiZWwoKSB7XG4gICAgcmV0dXJuICd2aWRlb3MnO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3ZpZGVvcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNWaWRlb3M7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIENsaWVudC5nZXRWaWRlb3MoYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFZpZGVvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNWaWRlb3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3ZpZGVvOnNhdmUnLCB7dmlkZW86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgY29udmVydFRyYWNrKHRyYWNrKSB7XG4gICAgLy8gY29udmVydCBhIFYxIHN0eWxlIHRyYWNrIHRvIGEgVjIgc3R5bGUgdHJhY2tcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmFjaykpIHtcbiAgICAgIHJldHVybiB7IHRyYWNrczogWyB7IHRyYWNrIH0gXSB9O1xuICAgIH1cblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcbiAgICAgIHN0b3JlZDogcm93WzRdLFxuICAgICAgcHJvY2Vzc2VkOiByb3dbNV0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICBmb3JtX2lkOiByb3dbOF0sXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcbiAgICAgIGNvbnRlbnRfdHlwZTogcm93WzEwXSxcbiAgICAgIGZpbGVfc2l6ZTogcm93WzExXSxcbiAgICAgIG1ldGFkYXRhOiByb3dbMTJdICYmIEpTT04ucGFyc2Uocm93WzEyXSksXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTNdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzE0XSxcbiAgICAgIHRyYWNrOiByb3dbMTVdICYmIHRoaXMuY29udmVydFRyYWNrKEpTT04ucGFyc2Uocm93WzE1XSkpXG4gICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlUXVlcnkoc2VxdWVuY2UsIGxpbWl0KSB7XG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gYFxuU0VMRUNUXG4gIFwidmlkZW9faWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIFwibWV0YWRhdGFcIiBBUyBcIm1ldGFkYXRhXCIsXG4gIFwiY3JlYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBcInVwZGF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcInVwZGF0ZWRfYnlcIixcbiAgXCJ0cmFja1wiIEFTIFwidHJhY2tcIlxuRlJPTSBcInZpZGVvc1wiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cInVwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19