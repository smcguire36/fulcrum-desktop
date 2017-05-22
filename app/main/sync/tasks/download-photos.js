'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _photo = require('../../models/photo');

var _photo2 = _interopRequireDefault(_photo);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadPhotos extends _downloadQuerySequence2.default {
  get syncResourceName() {
    return 'photos';
  }

  get syncLabel() {
    return 'photos';
  }

  get resourceName() {
    return 'photos';
  }

  get lastSync() {
    return this.account._lastSyncPhotos;
  }

  get useRestAPI() {
    return false;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getPhotos(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _photo2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
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

      _this2.account._lastSyncPhotos = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('photo:save', { photo: object });
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
      latitude: row[12],
      longitude: row[13],
      exif: row[14] && JSON.parse(row[14]),
      created_by: row[15],
      updated_by: row[16]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "photo_id" AS "access_key",
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
  "latitude" AS "latitude",
  "longitude" AS "longitude",
  "exif" AS "exif",
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by"
FROM "photos" AS "records"
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
exports.default = DownloadPhotos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcGhvdG9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkUGhvdG9zIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNMYWJlbCIsInJlc291cmNlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1Bob3RvcyIsInVzZVJlc3RBUEkiLCJmZXRjaE9iamVjdHMiLCJzZXF1ZW5jZSIsImdldFBob3RvcyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInBob3RvIiwiZmluaXNoIiwiZmFpbCIsInJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwib3JnYW5pemF0aW9uTmFtZSIsImdyZWVuIiwicmVkIiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwbG9hZGVkIiwic3RvcmVkIiwicHJvY2Vzc2VkIiwiY29udGVudF90eXBlIiwiZmlsZV9zaXplIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJleGlmIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJnZW5lcmF0ZVF1ZXJ5Iiwi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TztBQUNMakMsa0JBQVlpQyxJQUFJLENBQUosQ0FEUDtBQUVMQyxrQkFBWUQsSUFBSSxDQUFKLENBRlA7QUFHTDFCLGtCQUFZMEIsSUFBSSxDQUFKLENBSFA7QUFJTEUsZ0JBQVVGLElBQUksQ0FBSixDQUpMO0FBS0xHLGNBQVFILElBQUksQ0FBSixDQUxIO0FBTUxJLGlCQUFXSixJQUFJLENBQUosQ0FOTjtBQU9McEIscUJBQWVvQixJQUFJLENBQUosQ0FQVjtBQVFMbkIscUJBQWVtQixJQUFJLENBQUosQ0FSVjtBQVNMckIsZUFBU3FCLElBQUksQ0FBSixDQVRKO0FBVUxmLGlCQUFXZSxJQUFJLENBQUosQ0FWTjtBQVdMSyxvQkFBY0wsSUFBSSxFQUFKLENBWFQ7QUFZTE0saUJBQVdOLElBQUksRUFBSixDQVpOO0FBYUxPLGdCQUFVUCxJQUFJLEVBQUosQ0FiTDtBQWNMUSxpQkFBV1IsSUFBSSxFQUFKLENBZE47QUFlTFMsWUFBTVQsSUFBSSxFQUFKLEtBQVdVLEtBQUtDLEtBQUwsQ0FBV1gsSUFBSSxFQUFKLENBQVgsQ0FmWjtBQWdCTFksa0JBQVlaLElBQUksRUFBSixDQWhCUDtBQWlCTGEsa0JBQVliLElBQUksRUFBSjtBQWpCUCxLQUFQO0FBbUJEOztBQUVEYyxnQkFBY3hELFFBQWQsRUFBd0J5RCxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUMzRCxRQUFWLEVBQW9CNEQsV0FBcEIsRUFBdkI7O0FBRUEsV0FBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBdUJnQkYsY0FBZTs7O1FBR25DRCxLQUFNO0NBMUJWO0FBNEJEO0FBMUgrRDtrQkFBN0NsRSxjIiwiZmlsZSI6ImRvd25sb2FkLXBob3Rvcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFBob3RvIGZyb20gJy4uLy4uL21vZGVscy9waG90byc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFBob3RvcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAncGhvdG9zJztcbiAgfVxuXG4gIGdldCBzeW5jTGFiZWwoKSB7XG4gICAgcmV0dXJuICdwaG90b3MnO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Bob3Rvcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNQaG90b3M7XG4gIH1cblxuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBhc3luYyBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIENsaWVudC5nZXRQaG90b3MoYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFBob3RvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuXG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNQaG90b3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcblxuICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ3Bob3RvOnNhdmUnLCB7cGhvdG86IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgbGF0aXR1ZGU6IHJvd1sxMl0sXG4gICAgICBsb25naXR1ZGU6IHJvd1sxM10sXG4gICAgICBleGlmOiByb3dbMTRdICYmIEpTT04ucGFyc2Uocm93WzE0XSksXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTVdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzE2XVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcInBob3RvX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcImxhdGl0dWRlXCIgQVMgXCJsYXRpdHVkZVwiLFxuICBcImxvbmdpdHVkZVwiIEFTIFwibG9uZ2l0dWRlXCIsXG4gIFwiZXhpZlwiIEFTIFwiZXhpZlwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCJcbkZST00gXCJwaG90b3NcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==