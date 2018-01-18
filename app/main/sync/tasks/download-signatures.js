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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2lnbmF0dXJlcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFNpZ25hdHVyZXMiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1NpZ25hdHVyZXMiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwibG9hZE9iamVjdCIsIm9iamVjdCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0IiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxrQkFBTix5Q0FBdUQ7QUFDcEUsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFlBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLFdBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsbUJBQXBCO0FBQ0Q7O0FBRUQsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sS0FBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxVQUF2QixFQUFtQztBQUNqQyxXQUFPLG9CQUFVRixZQUFWLENBQXVCQyxRQUF2QixFQUFpQyxFQUFDRSxZQUFZLEtBQUtOLE9BQUwsQ0FBYU8sS0FBMUIsRUFBaUNDLGFBQWFILFdBQVdJLFVBQXpELEVBQWpDLENBQVA7QUFDRDs7QUFFS0MsWUFBTixDQUFpQkMsTUFBakIsRUFBeUJOLFVBQXpCLEVBQXFDO0FBQUE7O0FBQUE7QUFDbkMsVUFBSU0sT0FBT0MsWUFBUCxJQUF1QixJQUEzQixFQUFpQztBQUMvQkQsZUFBT0MsWUFBUCxHQUFzQixLQUF0QjtBQUNEOztBQUVELFlBQU0sTUFBS0MsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXUyxPQUEvQixFQUF3QyxZQUF4QyxFQUFzRCxTQUF0RCxDQUFOO0FBQ0EsWUFBTSxNQUFLRCxNQUFMLENBQVlGLE1BQVosRUFBb0JOLFdBQVdVLGFBQS9CLEVBQThDLGlCQUE5QyxFQUFpRSxTQUFqRSxDQUFOO0FBQ0EsWUFBTSxNQUFLRixNQUFMLENBQVlGLE1BQVosRUFBb0JOLFdBQVdXLGFBQS9CLEVBQThDLGlCQUE5QyxFQUFpRSxTQUFqRSxDQUFOOztBQUVBLFVBQUlMLE9BQU9NLFVBQVgsRUFBdUI7QUFDckIsY0FBTUMsU0FBUyxNQUFNLE1BQUtsQixPQUFMLENBQWFtQixlQUFiLENBQTZCLEVBQUNYLGFBQWFILFdBQVdlLFNBQXpCLEVBQTdCLENBQXJCOztBQUVBLFlBQUlGLE1BQUosRUFBWTtBQUNWUCxpQkFBT1UsWUFBUCxHQUFzQkgsT0FBT1gsS0FBN0I7QUFDRDtBQUNGOztBQUVELFlBQUtQLE9BQUwsQ0FBYUMsbUJBQWIsR0FBbUNVLE9BQU9XLFVBQTFDO0FBakJtQztBQWtCcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMZixrQkFBWWUsSUFBSSxDQUFKLENBRFA7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0xFLGtCQUFZRixJQUFJLENBQUosQ0FIUDtBQUlMRyxnQkFBVUgsSUFBSSxDQUFKLENBSkw7QUFLTEksY0FBUUosSUFBSSxDQUFKLENBTEg7QUFNTEssaUJBQVdMLElBQUksQ0FBSixDQU5OO0FBT0xULHFCQUFlUyxJQUFJLENBQUosQ0FQVjtBQVFMUixxQkFBZVEsSUFBSSxDQUFKLENBUlY7QUFTTFYsZUFBU1UsSUFBSSxDQUFKLENBVEo7QUFVTEosaUJBQVdJLElBQUksQ0FBSixDQVZOO0FBV0xNLG9CQUFjTixJQUFJLEVBQUosQ0FYVDtBQVlMTyxpQkFBV1AsSUFBSSxFQUFKLENBWk47QUFhTFEsa0JBQVlSLElBQUksRUFBSixDQWJQO0FBY0xTLGtCQUFZVCxJQUFJLEVBQUo7QUFkUCxLQUFQO0FBZ0JEOztBQUVEVSxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFvQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F2QlY7QUF5QkQ7QUF4Rm1FO2tCQUFqRHhDLGtCIiwiZmlsZSI6ImRvd25sb2FkLXNpZ25hdHVyZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IFNpZ25hdHVyZSBmcm9tICcuLi8uLi9tb2RlbHMvc2lnbmF0dXJlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRTaWduYXR1cmVzIGV4dGVuZHMgRG93bmxvYWRRdWVyeVNlcXVlbmNlIHtcbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAnc2lnbmF0dXJlJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY1NpZ25hdHVyZXM7XG4gIH1cblxuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gU2lnbmF0dXJlLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZE9iamVjdChvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNTaWduYXR1cmVzID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG4gIH1cblxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc19rZXk6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIHVwbG9hZGVkOiByb3dbM10sXG4gICAgICBzdG9yZWQ6IHJvd1s0XSxcbiAgICAgIHByb2Nlc3NlZDogcm93WzVdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzZdLFxuICAgICAgdXBkYXRlZF9ieV9pZDogcm93WzddLFxuICAgICAgZm9ybV9pZDogcm93WzhdLFxuICAgICAgcmVjb3JkX2lkOiByb3dbOV0sXG4gICAgICBjb250ZW50X3R5cGU6IHJvd1sxMF0sXG4gICAgICBmaWxlX3NpemU6IHJvd1sxMV0sXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTJdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzEzXVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcInNpZ25hdHVyZV9pZFwiIEFTIFwiYWNjZXNzX2tleVwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwidXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwidXBkYXRlZF9hdFwiLFxuICBcInVwbG9hZGVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgdXBsb2FkZWQsXG4gIFwic3RvcmVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgc3RvcmVkLFxuICBcInByb2Nlc3NlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHByb2Nlc3NlZCxcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICBcImZvcm1faWRcIiBBUyBcImZvcm1faWRcIixcbiAgXCJyZWNvcmRfaWRcIiBBUyBcInJlY29yZF9pZFwiLFxuICBcImNvbnRlbnRfdHlwZVwiIEFTIFwiY29udGVudF90eXBlXCIsXG4gIFwiZmlsZV9zaXplXCIgQVMgXCJmaWxlX3NpemVcIixcbiAgXCJjcmVhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIFwidXBkYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwidXBkYXRlZF9ieVwiXG5GUk9NIFwic2lnbmF0dXJlc1wiIEFTIFwicmVjb3Jkc1wiXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwiY3JlYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2J5X2lkXCIpID0gKFwiY3JlYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJ1cGRhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cInVwZGF0ZWRfYnlfaWRcIikgPSAoXCJ1cGRhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuV0hFUkVcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCA+ICcke3NlcXVlbmNlU3RyaW5nfSdcbk9SREVSIEJZXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgQVNDXG5MSU1JVCAke2xpbWl0fSBPRkZTRVQgMFxuYDtcbiAgfVxufVxuIl19