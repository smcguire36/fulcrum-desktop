'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _signature = require('../../models/signature');

var _signature2 = _interopRequireDefault(_signature);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadSignatures extends _downloadQuerySequence2.default {
  get syncResourceName() {
    return 'signatures';
  }

  get syncLabel() {
    return 'signatures';
  }

  get resourceName() {
    return 'signatures';
  }

  get lastSync() {
    return this.account._lastSyncSignatures;
  }

  get useRestAPI() {
    return false;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getSignatures(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _signature2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
  }

  process(object, attributes) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const isChanged = !object.isPersisted || _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at).getTime() !== object.updatedAt.getTime();

      object.updateFromAPIAttributes(attributes);

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

      _this2.account._lastSyncSignatures = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('signature:save', { signature: object });
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
      created_by: row[12],
      updated_by: row[13]
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "signature_id" AS "access_key",
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
  "created_by"."name" AS "created_by",
  "updated_by"."name" AS "updated_by"
FROM "signatures" AS "records"
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
exports.default = DownloadSignatures;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2lnbmF0dXJlcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFNpZ25hdHVyZXMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jU2lnbmF0dXJlcyIsInVzZVJlc3RBUEkiLCJmZXRjaE9iamVjdHMiLCJzZXF1ZW5jZSIsImdldFNpZ25hdHVyZXMiLCJwYWdlU2l6ZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsImFjY291bnRfaWQiLCJyb3dJRCIsInJlc291cmNlX2lkIiwiYWNjZXNzX2tleSIsInByb2Nlc3MiLCJvYmplY3QiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0Iiwic2F2ZSIsInRyaWdnZXIiLCJzaWduYXR1cmUiLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9ieSIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwi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LENBQUosQ0FEUDtBQUVMQyxrQkFBWUQsSUFBSSxDQUFKLENBRlA7QUFHTDNCLGtCQUFZMkIsSUFBSSxDQUFKLENBSFA7QUFJTEUsZ0JBQVVGLElBQUksQ0FBSixDQUpMO0FBS0xHLGNBQVFILElBQUksQ0FBSixDQUxIO0FBTUxJLGlCQUFXSixJQUFJLENBQUosQ0FOTjtBQU9McEIscUJBQWVvQixJQUFJLENBQUosQ0FQVjtBQVFMbkIscUJBQWVtQixJQUFJLENBQUosQ0FSVjtBQVNMckIsZUFBU3FCLElBQUksQ0FBSixDQVRKO0FBVUxmLGlCQUFXZSxJQUFJLENBQUosQ0FWTjtBQVdMSyxvQkFBY0wsSUFBSSxFQUFKLENBWFQ7QUFZTE0saUJBQVdOLElBQUksRUFBSixDQVpOO0FBYUxPLGtCQUFZUCxJQUFJLEVBQUosQ0FiUDtBQWNMUSxrQkFBWVIsSUFBSSxFQUFKO0FBZFAsS0FBUDtBQWdCRDs7QUFFRFMsZ0JBQWNuRCxRQUFkLEVBQXdCb0QsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDdEQsUUFBVixFQUFvQnVELFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQW9CZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQXZCVjtBQXlCRDtBQXBIbUU7a0JBQWpEN0Qsa0IiLCJmaWxlIjoiZG93bmxvYWQtc2lnbmF0dXJlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZnJvbSAnLi9kb3dubG9hZC1xdWVyeS1zZXF1ZW5jZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IFNpZ25hdHVyZSBmcm9tICcuLi8uLi9tb2RlbHMvc2lnbmF0dXJlJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkU2lnbmF0dXJlcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnc2lnbmF0dXJlcyc7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiAnc2lnbmF0dXJlcyc7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnc2lnbmF0dXJlcyc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNTaWduYXR1cmVzO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBDbGllbnQuZ2V0U2lnbmF0dXJlcyhhY2NvdW50LCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gU2lnbmF0dXJlLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IGFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIERhdGVVdGlscy5wYXJzZUlTT1RpbWVzdGFtcChhdHRyaWJ1dGVzLnVwZGF0ZWRfYXQpLmdldFRpbWUoKSAhPT0gb2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCk7XG5cbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNTaWduYXR1cmVzID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG5cbiAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdzaWduYXR1cmU6c2F2ZScsIHtzaWduYXR1cmU6IG9iamVjdH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICAvLyB1cGRhdGUgdGhlIGxhc3RTeW5jIGRhdGVcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEyXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxM11cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJzaWduYXR1cmVfaWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIFwiY3JlYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwiY3JlYXRlZF9ieVwiLFxuICBcInVwZGF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcInVwZGF0ZWRfYnlcIlxuRlJPTSBcInNpZ25hdHVyZXNcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==