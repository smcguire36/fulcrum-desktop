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
  NULL AS "created_by",
  NULL AS "updated_by"
FROM "photos" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadPhotos;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcGhvdG9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkUGhvdG9zIiwicmVzb3VyY2VOYW1lIiwidHlwZU5hbWUiLCJsYXN0U3luYyIsImFjY291bnQiLCJfbGFzdFN5bmNQaG90b3MiLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwibG9hZE9iamVjdCIsIm9iamVjdCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0IiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsImxhdGl0dWRlIiwibG9uZ2l0dWRlIiwiZXhpZiIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsInNlcXVlbmNlIiwibGltaXQiLCJzZXF1ZW5jZVN0cmluZyIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxjQUFOLHlDQUFtRDtBQUNoRSxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sUUFBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sT0FBUDtBQUNEOztBQUVELE1BQUlDLFFBQUosR0FBZTtBQUNiLFdBQU8sS0FBS0MsT0FBTCxDQUFhQyxlQUFwQjtBQUNEOztBQUVELE1BQUlDLFVBQUosR0FBaUI7QUFDZixXQUFPLEtBQVA7QUFDRDs7QUFFREMsZUFBYUMsUUFBYixFQUF1QkMsVUFBdkIsRUFBbUM7QUFDakMsV0FBTyxnQkFBTUYsWUFBTixDQUFtQkMsUUFBbkIsRUFBNkIsRUFBQ0UsWUFBWSxLQUFLTixPQUFMLENBQWFPLEtBQTFCLEVBQWlDQyxhQUFhSCxXQUFXSSxVQUF6RCxFQUE3QixDQUFQO0FBQ0Q7O0FBRUtDLFlBQU4sQ0FBaUJDLE1BQWpCLEVBQXlCTixVQUF6QixFQUFxQztBQUFBOztBQUFBO0FBQ25DLFVBQUlNLE9BQU9DLFlBQVAsSUFBdUIsSUFBM0IsRUFBaUM7QUFDL0JELGVBQU9DLFlBQVAsR0FBc0IsS0FBdEI7QUFDRDs7QUFFRCxZQUFNLE1BQUtDLE1BQUwsQ0FBWUYsTUFBWixFQUFvQk4sV0FBV1MsT0FBL0IsRUFBd0MsWUFBeEMsRUFBc0QsU0FBdEQsQ0FBTjtBQUNBLFlBQU0sTUFBS0QsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXVSxhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjtBQUNBLFlBQU0sTUFBS0YsTUFBTCxDQUFZRixNQUFaLEVBQW9CTixXQUFXVyxhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjs7QUFFQSxVQUFJTCxPQUFPTSxVQUFYLEVBQXVCO0FBQ3JCLGNBQU1DLFNBQVMsTUFBTSxNQUFLbEIsT0FBTCxDQUFhbUIsZUFBYixDQUE2QixFQUFDWCxhQUFhSCxXQUFXZSxTQUF6QixFQUE3QixDQUFyQjs7QUFFQSxZQUFJRixNQUFKLEVBQVk7QUFDVlAsaUJBQU9VLFlBQVAsR0FBc0JILE9BQU9YLEtBQTdCO0FBQ0Q7QUFDRjs7QUFFRCxZQUFLUCxPQUFMLENBQWFDLGVBQWIsR0FBK0JVLE9BQU9XLFVBQXRDO0FBakJtQztBQWtCcEM7O0FBRURDLHdCQUFzQkMsR0FBdEIsRUFBMkI7QUFDekIsV0FBTztBQUNMZixrQkFBWWUsSUFBSSxDQUFKLENBRFA7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0xFLGtCQUFZRixJQUFJLENBQUosQ0FIUDtBQUlMRyxnQkFBVUgsSUFBSSxDQUFKLENBSkw7QUFLTEksY0FBUUosSUFBSSxDQUFKLENBTEg7QUFNTEssaUJBQVdMLElBQUksQ0FBSixDQU5OO0FBT0xULHFCQUFlUyxJQUFJLENBQUosQ0FQVjtBQVFMUixxQkFBZVEsSUFBSSxDQUFKLENBUlY7QUFTTFYsZUFBU1UsSUFBSSxDQUFKLENBVEo7QUFVTEosaUJBQVdJLElBQUksQ0FBSixDQVZOO0FBV0xNLG9CQUFjTixJQUFJLEVBQUosQ0FYVDtBQVlMTyxpQkFBV1AsSUFBSSxFQUFKLENBWk47QUFhTFEsZ0JBQVVSLElBQUksRUFBSixDQWJMO0FBY0xTLGlCQUFXVCxJQUFJLEVBQUosQ0FkTjtBQWVMVSxZQUFNVixJQUFJLEVBQUosS0FBV1csS0FBS0MsS0FBTCxDQUFXWixJQUFJLEVBQUosQ0FBWCxDQWZaO0FBZ0JMYSxrQkFBWWIsSUFBSSxFQUFKLENBaEJQO0FBaUJMYyxrQkFBWWQsSUFBSSxFQUFKO0FBakJQLEtBQVA7QUFtQkQ7O0FBRURlLGdCQUFjQyxRQUFkLEVBQXdCQyxLQUF4QixFQUErQjtBQUM3QixVQUFNQyxpQkFBaUIsSUFBSUMsSUFBSixDQUFTLENBQUNILFFBQVYsRUFBb0JJLFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFxQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F4QlY7QUEwQkQ7QUE1RitEO2tCQUE3QzdDLGMiLCJmaWxlIjoiZG93bmxvYWQtcGhvdG9zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBQaG90byBmcm9tICcuLi8uLi9tb2RlbHMvcGhvdG8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFBob3RvcyBleHRlbmRzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSB7XG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwaG90b3MnO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAncGhvdG8nO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jUGhvdG9zO1xuICB9XG5cbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFBob3RvLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge2FjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xuICB9XG5cbiAgYXN5bmMgbG9hZE9iamVjdChvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAob2JqZWN0LmlzRG93bmxvYWRlZCA9PSBudWxsKSB7XG4gICAgICBvYmplY3QuaXNEb3dubG9hZGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmZvcm1faWQsICdfZm9ybVJvd0lEJywgJ2dldEZvcm0nKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuY3JlYXRlZF9ieV9pZCwgJ19jcmVhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLnVwZGF0ZWRfYnlfaWQsICdfdXBkYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuXG4gICAgaWYgKG9iamVjdC5fZm9ybVJvd0lEKSB7XG4gICAgICBjb25zdCByZWNvcmQgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEZpcnN0UmVjb3JkKHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5yZWNvcmRfaWR9KTtcblxuICAgICAgaWYgKHJlY29yZCkge1xuICAgICAgICBvYmplY3QuX3JlY29yZFJvd0lEID0gcmVjb3JkLnJvd0lEO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYWNjb3VudC5fbGFzdFN5bmNQaG90b3MgPSBvYmplY3QuX3VwZGF0ZWRBdDtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcbiAgICAgIHN0b3JlZDogcm93WzRdLFxuICAgICAgcHJvY2Vzc2VkOiByb3dbNV0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICBmb3JtX2lkOiByb3dbOF0sXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcbiAgICAgIGNvbnRlbnRfdHlwZTogcm93WzEwXSxcbiAgICAgIGZpbGVfc2l6ZTogcm93WzExXSxcbiAgICAgIGxhdGl0dWRlOiByb3dbMTJdLFxuICAgICAgbG9uZ2l0dWRlOiByb3dbMTNdLFxuICAgICAgZXhpZjogcm93WzE0XSAmJiBKU09OLnBhcnNlKHJvd1sxNF0pLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzE1XSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNl1cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJwaG90b19pZFwiIEFTIFwiYWNjZXNzX2tleVwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwidXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwidXBkYXRlZF9hdFwiLFxuICBcInVwbG9hZGVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgdXBsb2FkZWQsXG4gIFwic3RvcmVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgc3RvcmVkLFxuICBcInByb2Nlc3NlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHByb2Nlc3NlZCxcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICBcImZvcm1faWRcIiBBUyBcImZvcm1faWRcIixcbiAgXCJyZWNvcmRfaWRcIiBBUyBcInJlY29yZF9pZFwiLFxuICBcImNvbnRlbnRfdHlwZVwiIEFTIFwiY29udGVudF90eXBlXCIsXG4gIFwiZmlsZV9zaXplXCIgQVMgXCJmaWxlX3NpemVcIixcbiAgXCJsYXRpdHVkZVwiIEFTIFwibGF0aXR1ZGVcIixcbiAgXCJsb25naXR1ZGVcIiBBUyBcImxvbmdpdHVkZVwiLFxuICBcImV4aWZcIiBBUyBcImV4aWZcIixcbiAgTlVMTCBBUyBcImNyZWF0ZWRfYnlcIixcbiAgTlVMTCBBUyBcInVwZGF0ZWRfYnlcIlxuRlJPTSBcInBob3Rvc1wiIEFTIFwicmVjb3Jkc1wiXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=