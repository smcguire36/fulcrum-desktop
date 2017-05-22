'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadQuerySequence = require('./download-query-sequence');

var _downloadQuerySequence2 = _interopRequireDefault(_downloadQuerySequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _video = require('../../models/video');

var _video2 = _interopRequireDefault(_video);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadVideos extends _downloadQuerySequence2.default {
  get syncResourceName() {
    return 'videos';
  }

  get syncLabel() {
    return 'videos';
  }

  get resourceName() {
    return 'videos';
  }

  get lastSync() {
    return this.account._lastSyncVideos;
  }

  get useRestAPI() {
    return false;
  }

  fetchObjects(account, lastSync, sequence) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _client2.default.getVideos(account, sequence, _this.pageSize);
    })();
  }

  findOrCreate(database, account, attributes) {
    return _video2.default.findOrCreate(database, { account_id: account.rowID, resource_id: attributes.access_key });
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

      _this2.account._lastSyncVideos = object._updatedAt;

      yield object.save();

      if (isChanged) {
        yield _this2.trigger('video:save', { video: object });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtdmlkZW9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkVmlkZW9zIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNMYWJlbCIsInJlc291cmNlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1ZpZGVvcyIsInVzZVJlc3RBUEkiLCJmZXRjaE9iamVjdHMiLCJzZXF1ZW5jZSIsImdldFZpZGVvcyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInZpZGVvIiwiZmluaXNoIiwiZmFpbCIsInJlc3VsdHMiLCJjb25zb2xlIiwibG9nIiwib3JnYW5pemF0aW9uTmFtZSIsImdyZWVuIiwicmVkIiwiY29udmVydFRyYWNrIiwidHJhY2siLCJBcnJheSIsImlzQXJyYXkiLCJ0cmFja3MiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJtZXRhZGF0YSIsIkpTT04iLCJwYXJzZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsImxpbWl0Iiwic2VxdWVuY2VTdHJpbmciLCJEYXRlIiwidG9JU09TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxjQUFOLHlDQUFtRDtBQUNoRSxNQUFJQyxnQkFBSixHQUF1QjtBQUNyQixXQUFPLFFBQVA7QUFDRDs7QUFFRCxNQUFJQyxTQUFKLEdBQWdCO0FBQ2QsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFFBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLEtBQUtDLE9BQUwsQ0FBYUMsZUFBcEI7QUFDRDs7QUFFRCxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxLQUFQO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJILE9BQW5CLEVBQTRCRCxRQUE1QixFQUFzQ0ssUUFBdEMsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxhQUFPLGlCQUFPQyxTQUFQLENBQWlCTCxPQUFqQixFQUEwQkksUUFBMUIsRUFBb0MsTUFBS0UsUUFBekMsQ0FBUDtBQUQ4QztBQUUvQzs7QUFFREMsZUFBYUMsUUFBYixFQUF1QlIsT0FBdkIsRUFBZ0NTLFVBQWhDLEVBQTRDO0FBQzFDLFdBQU8sZ0JBQU1GLFlBQU4sQ0FBbUJDLFFBQW5CLEVBQTZCLEVBQUNFLFlBQVlWLFFBQVFXLEtBQXJCLEVBQTRCQyxhQUFhSCxXQUFXSSxVQUFwRCxFQUE3QixDQUFQO0FBQ0Q7O0FBRUtDLFNBQU4sQ0FBY0MsTUFBZCxFQUFzQk4sVUFBdEIsRUFBa0M7QUFBQTs7QUFBQTtBQUNoQ00sYUFBT0MsdUJBQVAsQ0FBK0JQLFVBQS9COztBQUVBLFlBQU1RLFlBQVksQ0FBQ0YsT0FBT0csV0FBUixJQUNBLHVCQUFVQyxpQkFBVixDQUE0QlYsV0FBV1csVUFBdkMsRUFBbURDLE9BQW5ELE9BQWlFTixPQUFPTyxTQUFQLENBQWlCRCxPQUFqQixFQURu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QmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F6QlY7QUEyQkQ7QUFqSStEO2tCQUE3Q3JFLGMiLCJmaWxlIjoiZG93bmxvYWQtdmlkZW9zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUXVlcnlTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgVmlkZW8gZnJvbSAnLi4vLi4vbW9kZWxzL3ZpZGVvJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkVmlkZW9zIGV4dGVuZHMgRG93bmxvYWRRdWVyeVNlcXVlbmNlIHtcbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICd2aWRlb3MnO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ3ZpZGVvcyc7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAndmlkZW9zJztcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5hY2NvdW50Ll9sYXN0U3luY1ZpZGVvcztcbiAgfVxuXG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldFZpZGVvcyhhY2NvdW50LCBzZXF1ZW5jZSwgdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gVmlkZW8uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7YWNjb3VudF9pZDogYWNjb3VudC5yb3dJRCwgcmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuYWNjZXNzX2tleX0pO1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG5cbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMudXBkYXRlZF9hdCkuZ2V0VGltZSgpICE9PSBvYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKTtcblxuICAgIGlmIChvYmplY3QuaXNEb3dubG9hZGVkID09IG51bGwpIHtcbiAgICAgIG9iamVjdC5pc0Rvd25sb2FkZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMuZm9ybV9pZCwgJ19mb3JtUm93SUQnLCAnZ2V0Rm9ybScpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5jcmVhdGVkX2J5X2lkLCAnX2NyZWF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcbiAgICBhd2FpdCB0aGlzLmxvb2t1cChvYmplY3QsIGF0dHJpYnV0ZXMudXBkYXRlZF9ieV9pZCwgJ191cGRhdGVkQnlSb3dJRCcsICdnZXRVc2VyJyk7XG5cbiAgICBpZiAob2JqZWN0Ll9mb3JtUm93SUQpIHtcbiAgICAgIGNvbnN0IHJlY29yZCA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kRmlyc3RSZWNvcmQoe3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLnJlY29yZF9pZH0pO1xuXG4gICAgICBpZiAocmVjb3JkKSB7XG4gICAgICAgIG9iamVjdC5fcmVjb3JkUm93SUQgPSByZWNvcmQucm93SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hY2NvdW50Ll9sYXN0U3luY1ZpZGVvcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcigndmlkZW86c2F2ZScsIHt2aWRlbzogb2JqZWN0fSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICAgIC8vIHVwZGF0ZSB0aGUgbGFzdFN5bmMgZGF0ZVxuICAgIGF3YWl0IHRoaXMuYWNjb3VudC5zYXZlKCk7XG4gIH1cblxuICBmYWlsKGFjY291bnQsIHJlc3VsdHMpIHtcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50Lm9yZ2FuaXphdGlvbk5hbWUuZ3JlZW4sICdmYWlsZWQnLnJlZCk7XG4gIH1cblxuICBjb252ZXJ0VHJhY2sodHJhY2spIHtcbiAgICAvLyBjb252ZXJ0IGEgVjEgc3R5bGUgdHJhY2sgdG8gYSBWMiBzdHlsZSB0cmFja1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRyYWNrKSkge1xuICAgICAgcmV0dXJuIHsgdHJhY2tzOiBbIHsgdHJhY2sgfSBdIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyYWNrO1xuICB9XG5cbiAgYXR0cmlidXRlc0ZvclF1ZXJ5Um93KHJvdykge1xuICAgIHJldHVybiB7XG4gICAgICBhY2Nlc3Nfa2V5OiByb3dbMF0sXG4gICAgICBjcmVhdGVkX2F0OiByb3dbMV0sXG4gICAgICB1cGRhdGVkX2F0OiByb3dbMl0sXG4gICAgICB1cGxvYWRlZDogcm93WzNdLFxuICAgICAgc3RvcmVkOiByb3dbNF0sXG4gICAgICBwcm9jZXNzZWQ6IHJvd1s1XSxcbiAgICAgIGNyZWF0ZWRfYnlfaWQ6IHJvd1s2XSxcbiAgICAgIHVwZGF0ZWRfYnlfaWQ6IHJvd1s3XSxcbiAgICAgIGZvcm1faWQ6IHJvd1s4XSxcbiAgICAgIHJlY29yZF9pZDogcm93WzldLFxuICAgICAgY29udGVudF90eXBlOiByb3dbMTBdLFxuICAgICAgZmlsZV9zaXplOiByb3dbMTFdLFxuICAgICAgbWV0YWRhdGE6IHJvd1sxMl0gJiYgSlNPTi5wYXJzZShyb3dbMTJdKSxcbiAgICAgIGNyZWF0ZWRfYnk6IHJvd1sxM10sXG4gICAgICB1cGRhdGVkX2J5OiByb3dbMTRdLFxuICAgICAgdHJhY2s6IHJvd1sxNV0gJiYgdGhpcy5jb252ZXJ0VHJhY2soSlNPTi5wYXJzZShyb3dbMTVdKSlcbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJ2aWRlb19pZFwiIEFTIFwiYWNjZXNzX2tleVwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwidXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwidXBkYXRlZF9hdFwiLFxuICBcInVwbG9hZGVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgdXBsb2FkZWQsXG4gIFwic3RvcmVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgc3RvcmVkLFxuICBcInByb2Nlc3NlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHByb2Nlc3NlZCxcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICBcImZvcm1faWRcIiBBUyBcImZvcm1faWRcIixcbiAgXCJyZWNvcmRfaWRcIiBBUyBcInJlY29yZF9pZFwiLFxuICBcImNvbnRlbnRfdHlwZVwiIEFTIFwiY29udGVudF90eXBlXCIsXG4gIFwiZmlsZV9zaXplXCIgQVMgXCJmaWxlX3NpemVcIixcbiAgXCJtZXRhZGF0YVwiIEFTIFwibWV0YWRhdGFcIixcbiAgXCJjcmVhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIFwidXBkYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwidXBkYXRlZF9ieVwiLFxuICBcInRyYWNrXCIgQVMgXCJ0cmFja1wiXG5GUk9NIFwidmlkZW9zXCIgQVMgXCJyZWNvcmRzXCJcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjcmVhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cImNyZWF0ZWRfYnlfaWRcIikgPSAoXCJjcmVhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcInVwZGF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwidXBkYXRlZF9ieV9pZFwiKSA9IChcInVwZGF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=