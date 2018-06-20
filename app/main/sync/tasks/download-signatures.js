'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _signature = require('../../models/signature');

var _signature2 = _interopRequireDefault(_signature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadSignatures extends _downloadQuerySequence2.default {
  get resourceName() {
    return 'signatures';
  }

  get typeName() {
    return 'signature';
  }

  get lastSync() {
    return this.account._lastSyncSignatures;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _signature2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.access_key });
  }

  loadObject(object, attributes) {
    var _this = this;

    return _asyncToGenerator(function* () {
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

      _this.account._lastSyncSignatures = object._updatedAt;
    })();
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
  NULL AS "created_by",
  NULL AS "updated_by"
FROM "signatures" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadSignatures;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2lnbmF0dXJlcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFNpZ25hdHVyZXMiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1NpZ25hdHVyZXMiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwibG9hZE9iamVjdCIsIm9iamVjdCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0IiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDcEUsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFlBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLFdBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsbUJBQXBCO0FBQ0Q7O0FBRUQsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZLEtBQUtOLE9BQUwsQ0FBYU8sS0FBMUIsRUFBaUNDLGFBQWFILFdBQVdJLFVBQXpELEVBQWpDLENBQVA7QUFDRDs7QUFFS0MsWUFBTixDQUFpQkMsTUFBakIsRUFBeUJOLFVBQXpCLEVBQXFDO0FBQUE7O0FBQUE7QUFDbkMsVUFBSU0sT0FBT0MsWUFBUCxJQUF1QixJQUEzQixFQUFpQztBQUMvQkQsZUFBT0MsWUFBUCxHQUFzQixLQUF0QjtBQUNEOztBQUVELFlBQU0sTUFBS0MsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXUyxPQUEvQixFQUF3QyxZQUF4QyxFQUFzRCxTQUF0RCxDQUFOO0FBQ0EsWUFBTSxNQUFLRCxNQUFMLENBQVlGLE1BQVosRUFBb0JOLFdBQVdVLGFBQS9CLEVBQThDLGlCQUE5QyxFQUFpRSxTQUFqRSxDQUFOO0FBQ0EsWUFBTSxNQUFLRixNQUFMLENBQVlGLE1BQVosRUFBb0JOLFdBQVdXLGFBQS9CLEVBQThDLGlCQUE5QyxFQUFpRSxTQUFqRSxDQUFOOztBQUVBLFVBQUlMLE9BQU9NLFVBQVgsRUFBdUI7QUFDckIsY0FBTUMsU0FBUyxNQUFNLE1BQUtsQixPQUFMLENBQWFtQixlQUFiLENBQTZCLEVBQUNYLGFBQWFILFdBQVdlLFNBQXpCLEVBQTdCLENBQXJCOztBQUVBLFlBQUlGLE1BQUosRUFBWTtBQUNWUCxpQkFBT1UsWUFBUCxHQUFzQkgsT0FBT1gsS0FBN0I7QUFDRDtBQUNGOztBQUVELFlBQUtQLE9BQUwsQ0FBYUMsbUJBQWIsR0FBbUNVLE9BQU9XLFVBQTFDO0FBakJtQztBQWtCcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMZixrQkFBWWUsSUFBSSxDQUFKLENBRFA7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0xFLGtCQUFZRixJQUFJLENBQUosQ0FIUDtBQUlMRyxnQkFBVUgsSUFBSSxDQUFKLENBSkw7QUFLTEksY0FBUUosSUFBSSxDQUFKLENBTEg7QUFNTEssaUJBQVdMLElBQUksQ0FBSixDQU5OO0FBT0xULHFCQUFlUyxJQUFJLENBQUosQ0FQVjtBQVFMUixxQkFBZVEsSUFBSSxDQUFKLENBUlY7QUFTTFYsZUFBU1UsSUFBSSxDQUFKLENBVEo7QUFVTEosaUJBQVdJLElBQUksQ0FBSixDQVZOO0FBV0xNLG9CQUFjTixJQUFJLEVBQUosQ0FYVDtBQVlMTyxpQkFBV1AsSUFBSSxFQUFKLENBWk47QUFhTFEsa0JBQVlSLElBQUksRUFBSixDQWJQO0FBY0xTLGtCQUFZVCxJQUFJLEVBQUo7QUFkUCxLQUFQO0FBZ0JEOztBQUVEVSxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBa0JnQkYsY0FBZTs7O1FBR25DRCxLQUFNO0NBckJWO0FBdUJEO0FBdEZtRTtrQkFBakR4QyxrQiIsImZpbGUiOiJkb3dubG9hZC1zaWduYXR1cmVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBTaWduYXR1cmUgZnJvbSAnLi4vLi4vbW9kZWxzL3NpZ25hdHVyZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkU2lnbmF0dXJlcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdzaWduYXR1cmVzJztcbiAgfVxuXG4gIGdldCB0eXBlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZSc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNTaWduYXR1cmVzO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFNpZ25hdHVyZS5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUQsIHJlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmFjY2Vzc19rZXl9KTtcbiAgfVxuXG4gIGFzeW5jIGxvYWRPYmplY3Qob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jU2lnbmF0dXJlcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEyXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxM11cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJzaWduYXR1cmVfaWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIE5VTEwgQVMgXCJ1cGRhdGVkX2J5XCJcbkZST00gXCJzaWduYXR1cmVzXCIgQVMgXCJyZWNvcmRzXCJcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==