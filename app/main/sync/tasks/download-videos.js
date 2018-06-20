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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNWaWRlb3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsImlzQ2hhbmdlZCIsImlzUGVyc2lzdGVkIiwicGFyc2VJU09UaW1lc3RhbXAiLCJ1cGRhdGVkX2F0IiwiZ2V0VGltZSIsInVwZGF0ZWRBdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInZpZGVvIiwiY29udmVydFRyYWNrIiwidHJhY2siLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFja3MiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxj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TyxnQkFBVVAsSUFBSSxFQUFKLEtBQVdRLEtBQUtDLEtBQUwsQ0FBV1QsSUFBSSxFQUFKLENBQVgsQ0FiaEI7QUFjTFUsa0JBQVlWLElBQUksRUFBSixDQWRQO0FBZUxXLGtCQUFZWCxJQUFJLEVBQUosQ0FmUDtBQWdCTEwsYUFBT0ssSUFBSSxFQUFKLEtBQVcsS0FBS04sWUFBTCxDQUFrQmMsS0FBS0MsS0FBTCxDQUFXVCxJQUFJLEVBQUosQ0FBWCxDQUFsQjtBQWhCYixLQUFQO0FBa0JEOztBQUVEWSxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFvQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F2QlY7QUF5QkQ7QUE5RytEO2tCQUE3Q3pELGMiLCJmaWxlIjoiZG93bmxvYWQtdmlkZW9zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBWaWRlbyBmcm9tICcuLi8uLi9tb2RlbHMvdmlkZW8nO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRWaWRlb3MgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW9zJztcbiAgfVxuXG4gIGdldCB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3ZpZGVvJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY1ZpZGVvcztcbiAgfVxuXG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBWaWRlby5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNWaWRlb3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3ZpZGVvOnNhdmUnLCB7dmlkZW86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRUcmFjayh0cmFjaykge1xuICAgIC8vIGNvbnZlcnQgYSBWMSBzdHlsZSB0cmFjayB0byBhIFYyIHN0eWxlIHRyYWNrXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodHJhY2spKSB7XG4gICAgICByZXR1cm4geyB0cmFja3M6IFsgeyB0cmFjayB9IF0gfTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhY2s7XG4gIH1cblxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc19rZXk6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIHVwbG9hZGVkOiByb3dbM10sXG4gICAgICBzdG9yZWQ6IHJvd1s0XSxcbiAgICAgIHByb2Nlc3NlZDogcm93WzVdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzZdLFxuICAgICAgdXBkYXRlZF9ieV9pZDogcm93WzddLFxuICAgICAgZm9ybV9pZDogcm93WzhdLFxuICAgICAgcmVjb3JkX2lkOiByb3dbOV0sXG4gICAgICBjb250ZW50X3R5cGU6IHJvd1sxMF0sXG4gICAgICBmaWxlX3NpemU6IHJvd1sxMV0sXG4gICAgICBtZXRhZGF0YTogcm93WzEyXSAmJiBKU09OLnBhcnNlKHJvd1sxMl0pLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEzXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNF0sXG4gICAgICB0cmFjazogcm93WzE1XSAmJiB0aGlzLmNvbnZlcnRUcmFjayhKU09OLnBhcnNlKHJvd1sxNV0pKVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcInZpZGVvX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcIm1ldGFkYXRhXCIgQVMgXCJtZXRhZGF0YVwiLFxuICBOVUxMIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBOVUxMIEFTIFwidXBkYXRlZF9ieVwiLFxuICBcInRyYWNrXCIgQVMgXCJ0cmFja1wiXG5GUk9NIFwidmlkZW9zXCIgQVMgXCJyZWNvcmRzXCJcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==