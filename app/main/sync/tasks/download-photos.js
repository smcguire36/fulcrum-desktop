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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcGhvdG9zLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkUGhvdG9zIiwic3luY1Jlc291cmNlTmFtZSIsInN5bmNMYWJlbCIsInJlc291cmNlTmFtZSIsImxhc3RTeW5jIiwiYWNjb3VudCIsIl9sYXN0U3luY1Bob3RvcyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0UGhvdG9zIiwicGFnZVNpemUiLCJmaW5kT3JDcmVhdGUiLCJkYXRhYmFzZSIsImF0dHJpYnV0ZXMiLCJhY2NvdW50X2lkIiwicm93SUQiLCJyZXNvdXJjZV9pZCIsImFjY2Vzc19rZXkiLCJwcm9jZXNzIiwib2JqZWN0IiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInBhcnNlSVNPVGltZXN0YW1wIiwidXBkYXRlZF9hdCIsImdldFRpbWUiLCJ1cGRhdGVkQXQiLCJpc0Rvd25sb2FkZWQiLCJsb29rdXAiLCJmb3JtX2lkIiwiY3JlYXRlZF9ieV9pZCIsInVwZGF0ZWRfYnlfaWQiLCJfZm9ybVJvd0lEIiwicmVjb3JkIiwiZmluZEZpcnN0UmVjb3JkIiwicmVjb3JkX2lkIiwiX3JlY29yZFJvd0lEIiwiX3VwZGF0ZWRBdCIsInNhdmUiLCJ0cmlnZ2VyIiwicGhvdG8iLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJyb3ciLCJjcmVhdGVkX2F0IiwidXBsb2FkZWQiLCJzdG9yZWQiLCJwcm9jZXNzZWQiLCJjb250ZW50X3R5cGUiLCJmaWxlX3NpemUiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImV4aWYiLCJKU09OIiwicGFyc2UiLCJjcmVhdGVkX2J5IiwidXBkYXRlZF9ieSIsImdlbmVyYXRlUXVlcnkiLCJsaW1pdCIsInNlcXVlbmNlU3RyaW5nIiwiRGF0ZSIsInRvSVNPU3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsY0FBTix5Q0FBbUQ7QUFDaEUsTUFBSUMsZ0JBQUosR0FBdUI7QUFDckIsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsU0FBSixHQUFnQjtBQUNkLFdBQU8sUUFBUDtBQUNEOztBQUVELE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxLQUFLQyxPQUFMLENBQWFDLGVBQXBCO0FBQ0Q7O0FBRUtDLGNBQU4sQ0FBbUJGLE9BQW5CLEVBQTRCRCxRQUE1QixFQUFzQ0ksUUFBdEMsRUFBZ0Q7QUFBQTs7QUFBQTtBQUM5QyxhQUFPLGlCQUFPQyxTQUFQLENBQWlCSixPQUFqQixFQUEwQkcsUUFBMUIsRUFBb0MsTUFBS0UsUUFBekMsQ0FBUDtBQUQ4QztBQUUvQzs7QUFFREMsZUFBYUMsUUFBYixFQUF1QlAsT0FBdkIsRUFBZ0NRLFVBQWhDLEVBQTRDO0FBQzFDLFdBQU8sZ0JBQU1GLFlBQU4sQ0FBbUJDLFFBQW5CLEVBQTZCLEVBQUNFLFlBQVlULFFBQVFVLEtBQXJCLEVBQTRCQyxhQUFhSCxXQUFXSSxVQUFwRCxFQUE3QixDQUFQO0FBQ0Q7O0FBRUtDLFNBQU4sQ0FBY0MsTUFBZCxFQUFzQk4sVUFBdEIsRUFBa0M7QUFBQTs7QUFBQTtBQUNoQ00sYUFBT0MsdUJBQVAsQ0FBK0JQLFVBQS9COztBQUVBLFlBQU1RLFlBQVksQ0FBQ0YsT0FBT0csV0FBUixJQUNBLHVCQUFVQyxpQkFBVixDQUE0QlYsV0FBV1csVUFBdkMsRUFBbURDLE9BQW5ELE9BQWlFTixPQUFPTyxTQUFQLENBQWlCRCxPQUFqQixFQURuRjs7QUFHQSxVQUFJTixPQUFPUSxZQUFQLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CUixlQUFPUSxZQUFQLEdBQXNCLEtBQXRCO0FBQ0Q7O0FBRUQsWUFBTSxPQUFLQyxNQUFMLENBQVlULE1BQVosRUFBb0JOLFdBQVdnQixPQUEvQixFQUF3QyxZQUF4QyxFQUFzRCxTQUF0RCxDQUFOO0FBQ0EsWUFBTSxPQUFLRCxNQUFMLENBQVlULE1BQVosRUFBb0JOLFdBQVdpQixhQUEvQixFQUE4QyxpQkFBOUMsRUFBaUUsU0FBakUsQ0FBTjtBQUNBLFlBQU0sT0FBS0YsTUFBTCxDQUFZVCxNQUFaLEVBQW9CTixXQUFXa0IsYUFBL0IsRUFBOEMsaUJBQTlDLEVBQWlFLFNBQWpFLENBQU47O0FBRUEsVUFBSVosT0FBT2EsVUFBWCxFQUF1QjtBQUNyQixjQUFNQyxTQUFTLE1BQU0sT0FBSzVCLE9BQUwsQ0FBYTZCLGVBQWIsQ0FBNkIsRUFBQ2xCLGFBQWFILFdBQVdzQixTQUF6QixFQUE3QixDQUFyQjs7QUFFQSxZQUFJRixNQUFKLEVBQVk7QUFDVmQsaUJBQU9pQixZQUFQLEdBQXNCSCxPQUFPbEIsS0FBN0I7QUFDRDtBQUNGOztBQUVELGFBQUtWLE9BQUwsQ0FBYUMsZUFBYixHQUErQmEsT0FBT2tCLFVBQXRDOztBQUVBLFlBQU1sQixPQUFPbUIsSUFBUCxFQUFOOztBQUVBLFVBQUlqQixTQUFKLEVBQWU7QUFDYixjQUFNLE9BQUtrQixPQUFMLENBQWEsWUFBYixFQUEyQixFQUFDQyxPQUFPckIsTUFBUixFQUEzQixDQUFOO0FBQ0Q7QUE1QitCO0FBNkJqQzs7QUFFS3NCLFFBQU4sR0FBZTtBQUFBOztBQUFBO0FBQ2I7QUFDQSxZQUFNLE9BQUtwQyxPQUFMLENBQWFpQyxJQUFiLEVBQU47QUFGYTtBQUdkOztBQUVESSxPQUFLckMsT0FBTCxFQUFjc0MsT0FBZCxFQUF1QjtBQUNyQkMsWUFBUUMsR0FBUixDQUFZeEMsUUFBUXlDLGdCQUFSLENBQXlCQyxLQUFyQyxFQUE0QyxTQUFTQyxHQUFyRDtBQUNEOztBQUVEQyx3QkFBc0JDLEdBQXRCLEVBQTJCO0FBQ3pCLFdBQU87QUFDTGpDLGtCQUFZaUMsSUFBSSxDQUFKLENBRFA7QUFFTEMsa0JBQVlELElBQUksQ0FBSixDQUZQO0FBR0wxQixrQkFBWTBCLElBQUksQ0FBSixDQUhQO0FBSUxFLGdCQUFVRixJQUFJLENBQUosQ0FKTDtBQUtMRyxjQUFRSCxJQUFJLENBQUosQ0FMSDtBQU1MSSxpQkFBV0osSUFBSSxDQUFKLENBTk47QUFPTHBCLHFCQUFlb0IsSUFBSSxDQUFKLENBUFY7QUFRTG5CLHFCQUFlbUIsSUFBSSxDQUFKLENBUlY7QUFTTHJCLGVBQVNxQixJQUFJLENBQUosQ0FUSjtBQVVMZixpQkFBV2UsSUFBSSxDQUFKLENBVk47QUFXTEssb0JBQWNMLElBQUksRUFBSixDQVhUO0FBWUxNLGlCQUFXTixJQUFJLEVBQUosQ0FaTjtBQWFMTyxnQkFBVVAsSUFBSSxFQUFKLENBYkw7QUFjTFEsaUJBQVdSLElBQUksRUFBSixDQWROO0FBZUxTLFlBQU1ULElBQUksRUFBSixLQUFXVSxLQUFLQyxLQUFMLENBQVdYLElBQUksRUFBSixDQUFYLENBZlo7QUFnQkxZLGtCQUFZWixJQUFJLEVBQUosQ0FoQlA7QUFpQkxhLGtCQUFZYixJQUFJLEVBQUo7QUFqQlAsS0FBUDtBQW1CRDs7QUFFRGMsZ0JBQWN4RCxRQUFkLEVBQXdCeUQsS0FBeEIsRUFBK0I7QUFDN0IsVUFBTUMsaUJBQWlCLElBQUlDLElBQUosQ0FBUyxDQUFDM0QsUUFBVixFQUFvQjRELFdBQXBCLEVBQXZCOztBQUVBLFdBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQXVCZ0JGLGNBQWU7OztRQUduQ0QsS0FBTTtDQTFCVjtBQTRCRDtBQXRIK0Q7a0JBQTdDakUsYyIsImZpbGUiOiJkb3dubG9hZC1waG90b3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBQaG90byBmcm9tICcuLi8uLi9tb2RlbHMvcGhvdG8nO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRQaG90b3MgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgc3luY1Jlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3Bob3Rvcyc7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiAncGhvdG9zJztcbiAgfVxuXG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gICAgcmV0dXJuICdwaG90b3MnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jUGhvdG9zO1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICAgIHJldHVybiBDbGllbnQuZ2V0UGhvdG9zKGFjY291bnQsIHNlcXVlbmNlLCB0aGlzLnBhZ2VTaXplKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBQaG90by5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiBhY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jUGhvdG9zID0gb2JqZWN0Ll91cGRhdGVkQXQ7XG5cbiAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKCdwaG90bzpzYXZlJywge3Bob3RvOiBvYmplY3R9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgLy8gdXBkYXRlIHRoZSBsYXN0U3luYyBkYXRlXG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxuXG4gIGZhaWwoYWNjb3VudCwgcmVzdWx0cykge1xuICAgIGNvbnNvbGUubG9nKGFjY291bnQub3JnYW5pemF0aW9uTmFtZS5ncmVlbiwgJ2ZhaWxlZCcucmVkKTtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcbiAgICAgIHN0b3JlZDogcm93WzRdLFxuICAgICAgcHJvY2Vzc2VkOiByb3dbNV0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICBmb3JtX2lkOiByb3dbOF0sXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcbiAgICAgIGNvbnRlbnRfdHlwZTogcm93WzEwXSxcbiAgICAgIGZpbGVfc2l6ZTogcm93WzExXSxcbiAgICAgIGxhdGl0dWRlOiByb3dbMTJdLFxuICAgICAgbG9uZ2l0dWRlOiByb3dbMTNdLFxuICAgICAgZXhpZjogcm93WzE0XSAmJiBKU09OLnBhcnNlKHJvd1sxNF0pLFxuICAgICAgY3JlYXRlZF9ieTogcm93WzE1XSxcbiAgICAgIHVwZGF0ZWRfYnk6IHJvd1sxNl1cbiAgICB9O1xuICB9XG5cbiAgZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSwgbGltaXQpIHtcbiAgICBjb25zdCBzZXF1ZW5jZVN0cmluZyA9IG5ldyBEYXRlKCtzZXF1ZW5jZSkudG9JU09TdHJpbmcoKTtcblxuICAgIHJldHVybiBgXG5TRUxFQ1RcbiAgXCJwaG90b19pZFwiIEFTIFwiYWNjZXNzX2tleVwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwiY3JlYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwiY3JlYXRlZF9hdFwiLFxuICB0b19jaGFyKHBnX2NhdGFsb2cudGltZXpvbmUoJ1VUQycsIFwicmVjb3Jkc1wiLlwidXBkYXRlZF9hdFwiKSwgJ1lZWVktTU0tRERcIlRcIkhIMjQ6TUk6U1NcIlpcIicpIEFTIFwidXBkYXRlZF9hdFwiLFxuICBcInVwbG9hZGVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgdXBsb2FkZWQsXG4gIFwic3RvcmVkX2F0XCIgSVMgTk9UIE5VTEwgQVMgc3RvcmVkLFxuICBcInByb2Nlc3NlZF9hdFwiIElTIE5PVCBOVUxMIEFTIHByb2Nlc3NlZCxcbiAgXCJjcmVhdGVkX2J5X2lkXCIgQVMgXCJjcmVhdGVkX2J5X2lkXCIsXG4gIFwidXBkYXRlZF9ieV9pZFwiIEFTIFwidXBkYXRlZF9ieV9pZFwiLFxuICBcImZvcm1faWRcIiBBUyBcImZvcm1faWRcIixcbiAgXCJyZWNvcmRfaWRcIiBBUyBcInJlY29yZF9pZFwiLFxuICBcImNvbnRlbnRfdHlwZVwiIEFTIFwiY29udGVudF90eXBlXCIsXG4gIFwiZmlsZV9zaXplXCIgQVMgXCJmaWxlX3NpemVcIixcbiAgXCJsYXRpdHVkZVwiIEFTIFwibGF0aXR1ZGVcIixcbiAgXCJsb25naXR1ZGVcIiBBUyBcImxvbmdpdHVkZVwiLFxuICBcImV4aWZcIiBBUyBcImV4aWZcIixcbiAgXCJjcmVhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJjcmVhdGVkX2J5XCIsXG4gIFwidXBkYXRlZF9ieVwiLlwibmFtZVwiIEFTIFwidXBkYXRlZF9ieVwiXG5GUk9NIFwicGhvdG9zXCIgQVMgXCJyZWNvcmRzXCJcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjcmVhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cImNyZWF0ZWRfYnlfaWRcIikgPSAoXCJjcmVhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcInVwZGF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwidXBkYXRlZF9ieV9pZFwiKSA9IChcInVwZGF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=