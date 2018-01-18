'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _video = require('../../models/video');

var _video2 = _interopRequireDefault(_video);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadVideos extends _downloadQuerySequence2.default {
  get resourceName() {
    return 'videos';
  }

  get typeName() {
    return 'video';
  }

  get lastSync() {
    return this.account._lastSyncVideos;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _video2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.access_key });
  }

  process(object, attributes) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      object.updateFromAPIAttributes(attributes);

      if (object.isDownloaded == null) {
        object.isDownloaded = false;
      }

      yield _this.lookup(object, attributes.form_id, '_formRowID', 'getForm');
      yield _this.lookup(object, attributes.created_by_id, '_createdByRowID', 'getUser');
      yield _this.lookup(object, attributes.updated_by_id, '_updatedByRowID', 'getUser');

      if (object._formRowID) {
        const record = yield _this.account.findFirstRecord({ resource_id: attributes.record_id });

        if (record) {
          object._recordRowID = record.rowID;
        }
      }

      _this.account._lastSyncVideos = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this.trigger('video:save', { video: object });
      }
    })();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNWaWRlb3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInZpZGVvIiwiY29udmVydFRyYWNrIiwidHJhY2siLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFja3MiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxj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TyxnQkFBVVAsSUFBSSxFQUFKLEtBQVdRLEtBQUtDLEtBQUwsQ0FBV1QsSUFBSSxFQUFKLENBQVgsQ0FiaEI7QUFjTFUsa0JBQVlWLElBQUksRUFBSixDQWRQO0FBZUxXLGtCQUFZWCxJQUFJLEVBQUosQ0FmUDtBQWdCTEwsYUFBT0ssSUFBSSxFQUFKLEtBQVcsS0FBS04sWUFBTCxDQUFrQmMsS0FBS0MsS0FBTCxDQUFXVCxJQUFJLEVBQUosQ0FBWCxDQUFsQjtBQWhCYixLQUFQO0FBa0JEOztBQUVEWSxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQXNCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQXpCVjtBQTJCRDtBQWhIK0Q7a0JBQTdDekQsYyIsImZpbGUiOiJkb3dubG9hZC12aWRlb3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IFZpZGVvIGZyb20gJy4uLy4uL21vZGVscy92aWRlbyc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFZpZGVvcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICd2aWRlb3MnO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW8nO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jVmlkZW9zO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFZpZGVvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICBpZiAob2JqZWN0Ll9mb3JtUm93SUQpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xuXG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY1ZpZGVvcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigndmlkZW86c2F2ZScsIHt2aWRlbzogb2JqZWN0fSk7XG4gICAgfVxuICB9XG5cbiAgY29udmVydFRyYWNrKHRyYWNrKSB7XG4gICAgLy8gY29udmVydCBhIFYxIHN0eWxlIHRyYWNrIHRvIGEgVjIgc3R5bGUgdHJhY2tcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmFjaykpIHtcbiAgICAgIHJldHVybiB7IHRyYWNrczogWyB7IHRyYWNrIH0gXSB9O1xuICAgIH1cblxuICAgIHJldHVybiB0cmFjaztcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcbiAgICAgIHN0b3JlZDogcm93WzRdLFxuICAgICAgcHJvY2Vzc2VkOiByb3dbNV0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICBmb3JtX2lkOiByb3dbOF0sXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcbiAgICAgIGNvbnRlbnRfdHlwZTogcm93WzEwXSxcbiAgICAgIGZpbGVfc2l6ZTogcm93WzExXSxcbiAgICAgIG1ldGFkYXRhOiByb3dbMTJdICYmIEpTT04ucGFyc2Uocm93WzEyXSksXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTNdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzE0XSxcbiAgICAgIHRyYWNrOiByb3dbMTVdICYmIHRoaXMuY29udmVydFRyYWNrKEpTT04ucGFyc2Uocm93WzE1XSkpXG4gICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlUXVlcnkoc2VxdWVuY2UsIGxpbWl0KSB7XG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gYFxuU0VMRUNUXG4gIFwidmlkZW9faWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIFwibWV0YWRhdGFcIiBBUyBcIm1ldGFkYXRhXCIsXG4gIFwiY3JlYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBcInVwZGF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcInVwZGF0ZWRfYnlcIixcbiAgXCJ0cmFja1wiIEFTIFwidHJhY2tcIlxuRlJPTSBcInZpZGVvc1wiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cInVwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19