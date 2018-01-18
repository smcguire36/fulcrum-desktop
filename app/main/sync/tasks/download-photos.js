'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _photo = require('../../models/photo');

var _photo2 = _interopRequireDefault(_photo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadPhotos extends _downloadQuerySequence2.default {
  get resourceName() {
    return 'photos';
  }

  get typeName() {
    return 'photo';
  }

  get lastSync() {
    return this.account._lastSyncPhotos;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _photo2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.access_key });
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

      _this.account._lastSyncPhotos = object._updatedAt;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcGhvdG9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkUGhvdG9zIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNQaG90b3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwibG9hZE9iamVjdCIsIm9iamVjdCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0IiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZXhpZiIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxjQUFOLHlDQUFtRDtBQUNoRSxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sUUFBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sT0FBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sS0FBS0MsT0FBTCxDQUFhQyxlQUFwQjtBQUNEOztBQUVELE1BQUlDLFVBQUosR0FBaUI7QUFDZixXQUFPLEtBQVA7QUFDRDs7QUFFREMsZUFBYUMsUUFBYixFQUF1QkMsVUFBdkIsRUFBbUM7QUFDakMsV0FBTyxnQkFBTUYsWUFBTixDQUFtQkMsUUFBbkIsRUFBNkIsRUFBQ0UsWUFBWSxLQUFLTixPQUFMLENBQWFPLEtBQTFCLEVBQWlDQyxhQUFhSCxXQUFXSSxVQUF6RCxFQUE3QixDQUFQO0FBQ0Q7O0FBRUtDLFlBQU4sQ0FBaUJDLE1BQWpCLEVBQXlCTixVQUF6QixFQUFxQztBQUFBOztBQUFBO0FBQ25DLFVBQUlNLE9BQU9DLFlBQVAsSUFBdUIsSUFBM0IsRUFBaUM7QUFDL0JELGVBQU9DLFlBQVAsR0FBc0IsS0FBdEI7QUFDRDs7QUFFRCxZQUFNLE1BQUtDLE1BQUwsQ0FBWUYsTUFBWixFQUFvQk4sV0FBV1MsT0FBL0IsRUFBd0MsWUFBeEMsRUFBc0QsU0FBdEQsQ0FBTjtBQUNBLFlBQU0sTUFBS0QsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXVSxhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjtBQUNBLFlBQU0sTUFBS0YsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXVyxhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjs7QUFFQSxVQUFJTCxPQUFPTSxVQUFYLEVBQXVCO0FBQ3JCLGNBQU1DLFNBQVMsTUFBTSxNQUFLbEIsT0FBTCxDQUFhbUIsZUFBYixDQUE2QixFQUFDWCxhQUFhSCxXQUFXZSxTQUF6QixFQUE3QixDQUFyQjs7QUFFQSxZQUFJRixNQUFKLEVBQVk7QUFDVlAsaUJBQU9VLFlBQVAsR0FBc0JILE9BQU9YLEtBQTdCO0FBQ0Q7QUFDRjs7QUFFRCxZQUFLUCxPQUFMLENBQWFDLGVBQWIsR0FBK0JVLE9BQU9XLFVBQXRDO0FBakJtQztBQWtCcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMZixrQkFBWWUsSUFBSSxDQUFKLENBRFA7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0xFLGtCQUFZRixJQUFJLENBQUosQ0FIUDtBQUlMRyxnQkFBVUgsSUFBSSxDQUFKLENBSkw7QUFLTEksY0FBUUosSUFBSSxDQUFKLENBTEg7QUFNTEssaUJBQVdMLElBQUksQ0FBSixDQU5OO0FBT0xULHFCQUFlUyxJQUFJLENBQUosQ0FQVjtBQVFMUixxQkFBZVEsSUFBSSxDQUFKLENBUlY7QUFTTFYsZUFBU1UsSUFBSSxDQUFKLENBVEo7QUFVTEosaUJBQVdJLElBQUksQ0FBSixDQVZOO0FBV0xNLG9CQUFjTixJQUFJLEVBQUosQ0FYVDtBQVlMTyxpQkFBV1AsSUFBSSxFQUFKLENBWk47QUFhTFEsZ0JBQVVSLElBQUksRUFBSixDQWJMO0FBY0xTLGlCQUFXVCxJQUFJLEVBQUosQ0FkTjtBQWVMVSxZQUFNVixJQUFJLEVBQUosS0FBV1csS0FBS0MsS0FBTCxDQUFXWixJQUFJLEVBQUosQ0FBWCxDQWZaO0FBZ0JMYSxrQkFBWWIsSUFBSSxFQUFKLENBaEJQO0FBaUJMYyxrQkFBWWQsSUFBSSxFQUFKO0FBakJQLEtBQVA7QUFtQkQ7O0FBRURlLGdCQUFjQyxRQUFkLEVBQXdCQyxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUNILFFBQVYsRUFBb0JJLFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQXVCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQTFCVjtBQTRCRDtBQTlGK0Q7a0JBQTdDN0MsYyIsImZpbGUiOiJkb3dubG9hZC1waG90b3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IFBob3RvIGZyb20gJy4uLy4uL21vZGVscy9waG90byc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUGhvdG9zIGV4dGVuZHMgRG93bmxvYWRRdWVyeVNlcXVlbmNlIHtcbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Bob3Rvcyc7XG4gIH1cblxuICBnZXQgdHlwZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwaG90byc7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNQaG90b3M7XG4gIH1cblxuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gUGhvdG8uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogdGhpcy5hY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBsb2FkT2JqZWN0KG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICBpZiAob2JqZWN0Ll9mb3JtUm93SUQpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xuXG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY1Bob3RvcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgbGF0aXR1ZGU6IHJvd1sxMl0sXG4gICAgICBsb25naXR1ZGU6IHJvd1sxM10sXG4gICAgICBleGlmOiByb3dbMTRdICYmIEpTT04ucGFyc2Uocm93WzE0XSksXG4gICAgICBjcmVhdGVkX2J5OiByb3dbMTVdLFxuICAgICAgdXBkYXRlZF9ieTogcm93WzE2XVxuICAgIH07XG4gIH1cblxuICBnZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlLCBsaW1pdCkge1xuICAgIGNvbnN0IHNlcXVlbmNlU3RyaW5nID0gbmV3IERhdGUoK3NlcXVlbmNlKS50b0lTT1N0cmluZygpO1xuXG4gICAgcmV0dXJuIGBcblNFTEVDVFxuICBcInBob3RvX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcImxhdGl0dWRlXCIgQVMgXCJsYXRpdHVkZVwiLFxuICBcImxvbmdpdHVkZVwiIEFTIFwibG9uZ2l0dWRlXCIsXG4gIFwiZXhpZlwiIEFTIFwiZXhpZlwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCJcbkZST00gXCJwaG90b3NcIiBBUyBcInJlY29yZHNcIlxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcImNyZWF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9ieV9pZFwiKSA9IChcImNyZWF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5MRUZUIE9VVEVSIEpPSU4gXCJtZW1iZXJzaGlwc1wiIEFTIFwidXBkYXRlZF9ieVwiIE9OICgoXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2J5X2lkXCIpID0gKFwidXBkYXRlZF9ieVwiLlwidXNlcl9pZFwiKSlcbldIRVJFXG4gIFwicmVjb3Jkc1wiLnVwZGF0ZWRfYXQgPiAnJHtzZXF1ZW5jZVN0cmluZ30nXG5PUkRFUiBCWVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0IEFTQ1xuTElNSVQgJHtsaW1pdH0gT0ZGU0VUIDBcbmA7XG4gIH1cbn1cbiJdfQ==