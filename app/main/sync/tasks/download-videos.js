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
  NULL AS "created_by",
  NULL AS "updated_by",
  "track" AS "track"
FROM "videos" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadVideos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNWaWRlb3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInZpZGVvIiwiY29udmVydFRyYWNrIiwidHJhY2siLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFja3MiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxj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TyxnQkFBVVAsSUFBSSxFQUFKLEtBQVdRLEtBQUtDLEtBQUwsQ0FBV1QsSUFBSSxFQUFKLENBQVgsQ0FiaEI7QUFjTFUsa0JBQVlWLElBQUksRUFBSixDQWRQO0FBZUxXLGtCQUFZWCxJQUFJLEVBQUosQ0FmUDtBQWdCTEwsYUFBT0ssSUFBSSxFQUFKLEtBQVcsS0FBS04sWUFBTCxDQUFrQmMsS0FBS0MsS0FBTCxDQUFXVCxJQUFJLEVBQUosQ0FBWCxDQUFsQjtBQWhCYixLQUFQO0FBa0JEOztBQUVEWSxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFvQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F2QlY7QUF5QkQ7QUE5RytEO2tCQUE3Q3pELGMiLCJmaWxlIjoiZG93bmxvYWQtdmlkZW9zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcclxuaW1wb3J0IFZpZGVvIGZyb20gJy4uLy4uL21vZGVscy92aWRlbyc7XHJcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFZpZGVvcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XHJcbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcclxuICAgIHJldHVybiAndmlkZW9zJztcclxuICB9XHJcblxyXG4gIGdldCB0eXBlTmFtZSgpIHtcclxuICAgIHJldHVybiAndmlkZW8nO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGxhc3RTeW5jKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNWaWRlb3M7XHJcbiAgfVxyXG5cclxuICBnZXQgdXNlUmVzdEFQSSgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xyXG4gICAgcmV0dXJuIFZpZGVvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcclxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcclxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XHJcblxyXG4gICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xyXG5cclxuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcclxuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XHJcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XHJcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XHJcblxyXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XHJcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xyXG5cclxuICAgICAgaWYgKHJlY29yZCkge1xyXG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jVmlkZW9zID0gb2JqZWN0Ll91cGRhdGVkQXQ7XHJcblxyXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcclxuXHJcbiAgICBpZiAoaXNDaGFuZ2VkKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigndmlkZW86c2F2ZScsIHt2aWRlbzogb2JqZWN0fSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb252ZXJ0VHJhY2sodHJhY2spIHtcclxuICAgIC8vIGNvbnZlcnQgYSBWMSBzdHlsZSB0cmFjayB0byBhIFYyIHN0eWxlIHRyYWNrXHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0cmFjaykpIHtcclxuICAgICAgcmV0dXJuIHsgdHJhY2tzOiBbIHsgdHJhY2sgfSBdIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRyYWNrO1xyXG4gIH1cclxuXHJcbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxyXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXHJcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcclxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcclxuICAgICAgc3RvcmVkOiByb3dbNF0sXHJcbiAgICAgIHByb2Nlc3NlZDogcm93WzVdLFxyXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXHJcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcclxuICAgICAgZm9ybV9pZDogcm93WzhdLFxyXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcclxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxyXG4gICAgICBmaWxlX3NpemU6IHJvd1sxMV0sXHJcbiAgICAgIG1ldGFkYXRhOiByb3dbMTJdICYmIEpTT04ucGFyc2Uocm93WzEyXSksXHJcbiAgICAgIGNyZWF0ZWRfYnk6IHJvd1sxM10sXHJcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNF0sXHJcbiAgICAgIHRyYWNrOiByb3dbMTVdICYmIHRoaXMuY29udmVydFRyYWNrKEpTT04ucGFyc2Uocm93WzE1XSkpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcclxuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xyXG5cclxuICAgIHJldHVybiBgXHJcblNFTEVDVFxyXG4gIFwidmlkZW9faWRcIiBBUyBcImFjY2Vzc19rZXlcIixcclxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxyXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXHJcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxyXG4gIFwic3RvcmVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgc3RvcmVkLFxyXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxyXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxyXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxyXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxyXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcclxuICBcImNvbnRlbnRfdHlwZVwiIEFTIFwiY29udGVudF90eXBlXCIsXHJcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxyXG4gIFwibWV0YWRhdGFcIiBBUyBcIm1ldGFkYXRhXCIsXHJcbiAgTlVMTCBBUyBcImNyZWF0ZWRfYnlcIixcclxuICBOVUxMIEFTIFwidXBkYXRlZF9ieVwiLFxyXG4gIFwidHJhY2tcIiBBUyBcInRyYWNrXCJcclxuRlJPTSBcInZpZGVvc1wiIEFTIFwicmVjb3Jkc1wiXHJcbldIRVJFXHJcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcclxuT1JERVIgQllcclxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xyXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxyXG5gO1xyXG4gIH1cclxufVxyXG4iXX0=