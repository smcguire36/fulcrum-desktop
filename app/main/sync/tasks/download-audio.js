'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _audio = require('../../models/audio');

var _audio2 = _interopRequireDefault(_audio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadAudio extends _downloadQuerySequence2.default {
  get resourceName() {
    return 'audio';
  }

  get typeName() {
    return 'audio';
  }

  get lastSync() {
    return this.account._lastSyncAudio;
  }

  get useRestAPI() {
    return false;
  }

  findOrCreate(database, attributes) {
    return _audio2.default.findOrCreate(database, { account_id: this.account.rowID, resource_id: attributes.access_key });
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

      _this.account._lastSyncAudio = object._updatedAt;
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
      metadata: row[12] && JSON.parse(row[12]),
      created_by: row[13],
      updated_by: row[14],
      track: row[15] && JSON.parse(row[15])
    };
  }

  generateQuery(sequence, limit) {
    const sequenceString = new Date(+sequence).toISOString();

    return `
SELECT
  "audio_id" AS "access_key",
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
FROM "audio" AS "records"
WHERE
  "records".updated_at > '${sequenceString}'
ORDER BY
  "records".updated_at ASC
LIMIT ${limit} OFFSET 0
`;
  }
}
exports.default = DownloadAudio;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtYXVkaW8uanMiXSwibmFtZXMiOlsiRG93bmxvYWRBdWRpbyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jQXVkaW8iLCJ1c2VSZXN0QVBJIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwibG9hZE9iamVjdCIsIm9iamVjdCIsImlzRG93bmxvYWRlZCIsImxvb2t1cCIsImZvcm1faWQiLCJjcmVhdGVkX2J5X2lkIiwidXBkYXRlZF9ieV9pZCIsIl9mb3JtUm93SUQiLCJyZWNvcmQiLCJmaW5kRmlyc3RSZWNvcmQiLCJyZWNvcmRfaWQiLCJfcmVjb3JkUm93SUQiLCJfdXBkYXRlZEF0IiwiYXR0cmlidXRlc0ZvclF1ZXJ5Um93Iiwicm93IiwiY3JlYXRlZF9hdCIsInVwZGF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsIm1ldGFkYXRhIiwiSlNPTiIsInBhcnNlIiwiY3JlYXRlZF9ieSIsInVwZGF0ZWRfYnkiLCJ0cmFjayIsImdlbmVyYXRlUXVlcnkiLCJzZXF1ZW5jZSIsImxpbWl0Iiwic2VxdWVuY2VTdHJpbmciLCJEYXRlIiwidG9JU09TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsYUFBTix5Q0FBa0Q7QUFDL0QsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLE9BQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsY0FBcEI7QUFDRDs7QUFFRCxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxLQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQU8sZ0JBQU1GLFlBQU4sQ0FBbUJDLFFBQW5CLEVBQTZCLEVBQUNFLFlBQVksS0FBS04sT0FBTCxDQUFhTyxLQUExQixFQUFpQ0MsYUFBYUgsV0FBV0ksVUFBekQsRUFBN0IsQ0FBUDtBQUNEOztBQUVLQyxZQUFOLENBQWlCQyxNQUFqQixFQUF5Qk4sVUFBekIsRUFBcUM7QUFBQTs7QUFBQTtBQUNuQyxVQUFJTSxPQUFPQyxZQUFQLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CRCxlQUFPQyxZQUFQLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQsWUFBTSxNQUFLQyxNQUFMLENBQVlGLE1BQVosRUFBb0JOLFdBQVdTLE9BQS9CLEVBQXdDLFlBQXhDLEVBQXNELFNBQXRELENBQU47QUFDQSxZQUFNLE1BQUtELE1BQUwsQ0FBWUYsTUFBWixFQUFvQk4sV0FBV1UsYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47QUFDQSxZQUFNLE1BQUtGLE1BQUwsQ0FBWUYsTUFBWixFQUFvQk4sV0FBV1csYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47O0FBRUEsVUFBSUwsT0FBT00sVUFBWCxFQUF1QjtBQUNyQixjQUFNQyxTQUFTLE1BQU0sTUFBS2xCLE9BQUwsQ0FBYW1CLGVBQWIsQ0FBNkIsRUFBQ1gsYUFBYUgsV0FBV2UsU0FBekIsRUFBN0IsQ0FBckI7O0FBRUEsWUFBSUYsTUFBSixFQUFZO0FBQ1ZQLGlCQUFPVSxZQUFQLEdBQXNCSCxPQUFPWCxLQUE3QjtBQUNEO0FBQ0Y7O0FBRUQsWUFBS1AsT0FBTCxDQUFhQyxjQUFiLEdBQThCVSxPQUFPVyxVQUFyQztBQWpCbUM7QUFrQnBDOztBQUVEQyx3QkFBc0JDLEdBQXRCLEVBQTJCO0FBQ3pCLFdBQU87QUFDTGYsa0JBQVllLElBQUksQ0FBSixDQURQO0FBRUxDLGtCQUFZRCxJQUFJLENBQUosQ0FGUDtBQUdMRSxrQkFBWUYsSUFBSSxDQUFKLENBSFA7QUFJTEcsZ0JBQVVILElBQUksQ0FBSixDQUpMO0FBS0xJLGNBQVFKLElBQUksQ0FBSixDQUxIO0FBTUxLLGlCQUFXTCxJQUFJLENBQUosQ0FOTjtBQU9MVCxxQkFBZVMsSUFBSSxDQUFKLENBUFY7QUFRTFIscUJBQWVRLElBQUksQ0FBSixDQVJWO0FBU0xWLGVBQVNVLElBQUksQ0FBSixDQVRKO0FBVUxKLGlCQUFXSSxJQUFJLENBQUosQ0FWTjtBQVdMTSxvQkFBY04sSUFBSSxFQUFKLENBWFQ7QUFZTE8saUJBQVdQLElBQUksRUFBSixDQVpOO0FBYUxRLGdCQUFVUixJQUFJLEVBQUosS0FBV1MsS0FBS0MsS0FBTCxDQUFXVixJQUFJLEVBQUosQ0FBWCxDQWJoQjtBQWNMVyxrQkFBWVgsSUFBSSxFQUFKLENBZFA7QUFlTFksa0JBQVlaLElBQUksRUFBSixDQWZQO0FBZ0JMYSxhQUFPYixJQUFJLEVBQUosS0FBV1MsS0FBS0MsS0FBTCxDQUFXVixJQUFJLEVBQUosQ0FBWDtBQWhCYixLQUFQO0FBa0JEOztBQUVEYyxnQkFBY0MsUUFBZCxFQUF3QkMsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDSCxRQUFWLEVBQW9CSSxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFvQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F2QlY7QUF5QkQ7QUExRjhEO2tCQUE1QzVDLGEiLCJmaWxlIjoiZG93bmxvYWQtYXVkaW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IEF1ZGlvIGZyb20gJy4uLy4uL21vZGVscy9hdWRpbyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQXVkaW8gZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnYXVkaW8nO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAnYXVkaW8nO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jQXVkaW87XG4gIH1cblxuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gQXVkaW8uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogdGhpcy5hY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBsb2FkT2JqZWN0KG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICBpZiAob2JqZWN0Ll9mb3JtUm93SUQpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xuXG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY0F1ZGlvID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG4gIH1cblxuICBhdHRyaWJ1dGVzRm9yUXVlcnlSb3cocm93KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjY2Vzc19rZXk6IHJvd1swXSxcbiAgICAgIGNyZWF0ZWRfYXQ6IHJvd1sxXSxcbiAgICAgIHVwZGF0ZWRfYXQ6IHJvd1syXSxcbiAgICAgIHVwbG9hZGVkOiByb3dbM10sXG4gICAgICBzdG9yZWQ6IHJvd1s0XSxcbiAgICAgIHByb2Nlc3NlZDogcm93WzVdLFxuICAgICAgY3JlYXRlZF9ieV9pZDogcm93WzZdLFxuICAgICAgdXBkYXRlZF9ieV9pZDogcm93WzddLFxuICAgICAgZm9ybV9pZDogcm93WzhdLFxuICAgICAgcmVjb3JkX2lkOiByb3dbOV0sXG4gICAgICBjb250ZW50X3R5cGU6IHJvd1sxMF0sXG4gICAgICBmaWxlX3NpemU6IHJvd1sxMV0sXG4gICAgICBtZXRhZGF0YTogcm93WzEyXSAmJiBKU09OLnBhcnNlKHJvd1sxMl0pLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzEzXSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNF0sXG4gICAgICB0cmFjazogcm93WzE1XSAmJiBKU09OLnBhcnNlKHJvd1sxNV0pXG4gICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlUXVlcnkoc2VxdWVuY2UsIGxpbWl0KSB7XG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gYFxuU0VMRUNUXG4gIFwiYXVkaW9faWRcIiBBUyBcImFjY2Vzc19rZXlcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cImNyZWF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcImNyZWF0ZWRfYXRcIixcbiAgdG9fY2hhcihwZ19jYXRhbG9nLnRpbWV6b25lKCdVVEMnLCBcInJlY29yZHNcIi5cInVwZGF0ZWRfYXRcIiksICdZWVlZLU1NLUREXCJUXCJISDI0Ok1JOlNTXCJaXCInKSBBUyBcInVwZGF0ZWRfYXRcIixcbiAgXCJ1cGxvYWRlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHVwbG9hZGVkLFxuICBcInN0b3JlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHN0b3JlZCxcbiAgXCJwcm9jZXNzZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBwcm9jZXNzZWQsXG4gIFwiY3JlYXRlZF9ieV9pZFwiIEFTIFwiY3JlYXRlZF9ieV9pZFwiLFxuICBcInVwZGF0ZWRfYnlfaWRcIiBBUyBcInVwZGF0ZWRfYnlfaWRcIixcbiAgXCJmb3JtX2lkXCIgQVMgXCJmb3JtX2lkXCIsXG4gIFwicmVjb3JkX2lkXCIgQVMgXCJyZWNvcmRfaWRcIixcbiAgXCJjb250ZW50X3R5cGVcIiBBUyBcImNvbnRlbnRfdHlwZVwiLFxuICBcImZpbGVfc2l6ZVwiIEFTIFwiZmlsZV9zaXplXCIsXG4gIFwibWV0YWRhdGFcIiBBUyBcIm1ldGFkYXRhXCIsXG4gIE5VTEwgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIE5VTEwgQVMgXCJ1cGRhdGVkX2J5XCIsXG4gIFwidHJhY2tcIiBBUyBcInRyYWNrXCJcbkZST00gXCJhdWRpb1wiIEFTIFwicmVjb3Jkc1wiXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=