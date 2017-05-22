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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2lnbmF0dXJlcy5qcyJdLCJuYW1lcyI6WyJEb3dubG9hZFNpZ25hdHVyZXMiLCJzeW5jUmVzb3VyY2VOYW1lIiwic3luY0xhYmVsIiwicmVzb3VyY2VOYW1lIiwibGFzdFN5bmMiLCJhY2NvdW50IiwiX2xhc3RTeW5jU2lnbmF0dXJlcyIsImZldGNoT2JqZWN0cyIsInNlcXVlbmNlIiwiZ2V0U2lnbmF0dXJlcyIsInBhZ2VTaXplIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwiYWNjb3VudF9pZCIsInJvd0lEIiwicmVzb3VyY2VfaWQiLCJhY2Nlc3Nfa2V5IiwicHJvY2VzcyIsIm9iamVjdCIsInVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzIiwiaXNDaGFuZ2VkIiwiaXNQZXJzaXN0ZWQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsInVwZGF0ZWRfYXQiLCJnZXRUaW1lIiwidXBkYXRlZEF0IiwiaXNEb3dubG9hZGVkIiwibG9va3VwIiwiZm9ybV9pZCIsImNyZWF0ZWRfYnlfaWQiLCJ1cGRhdGVkX2J5X2lkIiwiX2Zvcm1Sb3dJRCIsInJlY29yZCIsImZpbmRGaXJzdFJlY29yZCIsInJlY29yZF9pZCIsIl9yZWNvcmRSb3dJRCIsIl91cGRhdGVkQXQiLCJzYXZlIiwidHJpZ2dlciIsInNpZ25hdHVyZSIsImZpbmlzaCIsImZhaWwiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm9yZ2FuaXphdGlvbk5hbWUiLCJncmVlbiIsInJlZCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsInJvdyIsImNyZWF0ZWRfYXQiLCJ1cGxvYWRlZCIsInN0b3JlZCIsInByb2Nlc3NlZCIsImNvbnRlbnRfdHlwZSIsImZpbGVfc2l6ZSIsImNyZWF0ZWRfYnkiLCJ1cGRhdGVkX2J5IiwiZ2VuZXJhdGVRdWVyeSIsImxpbWl0Iiwic2VxdWVuY2VTdHJpbmciLCJEYXRlIiwidG9JU09T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QUksQ0FBSixDQUhQO0FBSUxFLGdCQUFVRixJQUFJLENBQUosQ0FKTDtBQUtMRyxjQUFRSCxJQUFJLENBQUosQ0FMSDtBQU1MSSxpQkFBV0osSUFBSSxDQUFKLENBTk47QUFPTHBCLHFCQUFlb0IsSUFBSSxDQUFKLENBUFY7QUFRTG5CLHFCQUFlbUIsSUFBSSxDQUFKLENBUlY7QUFTTHJCLGVBQVNxQixJQUFJLENBQUosQ0FUSjtBQVVMZixpQkFBV2UsSUFBSSxDQUFKLENBVk47QUFXTEssb0JBQWNMLElBQUksRUFBSixDQVhUO0FBWUxNLGlCQUFXTixJQUFJLEVBQUosQ0FaTjtBQWFMTyxrQkFBWVAsSUFBSSxFQUFKLENBYlA7QUFjTFEsa0JBQVlSLElBQUksRUFBSjtBQWRQLEtBQVA7QUFnQkQ7O0FBRURTLGdCQUFjbkQsUUFBZCxFQUF3Qm9ELEtBQXhCLEVBQStCO0FBQzdCLFVBQU1DLGlCQUFpQixJQUFJQyxJQUFKLENBQVMsQ0FBQ3RELFFBQVYsRUFBb0J1RCxXQUFwQixFQUF2Qjs7QUFFQSxXQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkFvQmdCRixjQUFlOzs7UUFHbkNELEtBQU07Q0F2QlY7QUF5QkQ7QUFoSG1FO2tCQUFqRDVELGtCIiwiZmlsZSI6ImRvd25sb2FkLXNpZ25hdHVyZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtcXVlcnktc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBTaWduYXR1cmUgZnJvbSAnLi4vLi4vbW9kZWxzL3NpZ25hdHVyZSc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFNpZ25hdHVyZXMgZXh0ZW5kcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2Uge1xuICBnZXQgc3luY1Jlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgICByZXR1cm4gJ3NpZ25hdHVyZXMnO1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICAgIHJldHVybiB0aGlzLmFjY291bnQuX2xhc3RTeW5jU2lnbmF0dXJlcztcbiAgfVxuXG4gIGFzeW5jIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgICByZXR1cm4gQ2xpZW50LmdldFNpZ25hdHVyZXMoYWNjb3VudCwgc2VxdWVuY2UsIHRoaXMucGFnZVNpemUpO1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIFNpZ25hdHVyZS5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIHthY2NvdW50X2lkOiBhY2NvdW50LnJvd0lELCByZXNvdXJjZV9pZDogYXR0cmlidXRlcy5hY2Nlc3Nfa2V5fSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcblxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KS5nZXRUaW1lKCkgIT09IG9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpO1xuXG4gICAgaWYgKG9iamVjdC5pc0Rvd25sb2FkZWQgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0LmlzRG93bmxvYWRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy5mb3JtX2lkLCAnX2Zvcm1Sb3dJRCcsICdnZXRGb3JtJyk7XG4gICAgYXdhaXQgdGhpcy5sb29rdXAob2JqZWN0LCBhdHRyaWJ1dGVzLmNyZWF0ZWRfYnlfaWQsICdfY3JlYXRlZEJ5Um93SUQnLCAnZ2V0VXNlcicpO1xuICAgIGF3YWl0IHRoaXMubG9va3VwKG9iamVjdCwgYXR0cmlidXRlcy51cGRhdGVkX2J5X2lkLCAnX3VwZGF0ZWRCeVJvd0lEJywgJ2dldFVzZXInKTtcblxuICAgIGlmIChvYmplY3QuX2Zvcm1Sb3dJRCkge1xuICAgICAgY29uc3QgcmVjb3JkID0gYXdhaXQgdGhpcy5hY2NvdW50LmZpbmRGaXJzdFJlY29yZCh7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMucmVjb3JkX2lkfSk7XG5cbiAgICAgIGlmIChyZWNvcmQpIHtcbiAgICAgICAgb2JqZWN0Ll9yZWNvcmRSb3dJRCA9IHJlY29yZC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFjY291bnQuX2xhc3RTeW5jU2lnbmF0dXJlcyA9IG9iamVjdC5fdXBkYXRlZEF0O1xuXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcignc2lnbmF0dXJlOnNhdmUnLCB7c2lnbmF0dXJlOiBvYmplY3R9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgLy8gdXBkYXRlIHRoZSBsYXN0U3luYyBkYXRlXG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxuXG4gIGZhaWwoYWNjb3VudCwgcmVzdWx0cykge1xuICAgIGNvbnNvbGUubG9nKGFjY291bnQub3JnYW5pemF0aW9uTmFtZS5ncmVlbiwgJ2ZhaWxlZCcucmVkKTtcbiAgfVxuXG4gIGF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhyb3cpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWNjZXNzX2tleTogcm93WzBdLFxuICAgICAgY3JlYXRlZF9hdDogcm93WzFdLFxuICAgICAgdXBkYXRlZF9hdDogcm93WzJdLFxuICAgICAgdXBsb2FkZWQ6IHJvd1szXSxcbiAgICAgIHN0b3JlZDogcm93WzRdLFxuICAgICAgcHJvY2Vzc2VkOiByb3dbNV0sXG4gICAgICBjcmVhdGVkX2J5X2lkOiByb3dbNl0sXG4gICAgICB1cGRhdGVkX2J5X2lkOiByb3dbN10sXG4gICAgICBmb3JtX2lkOiByb3dbOF0sXG4gICAgICByZWNvcmRfaWQ6IHJvd1s5XSxcbiAgICAgIGNvbnRlbnRfdHlwZTogcm93WzEwXSxcbiAgICAgIGZpbGVfc2l6ZTogcm93WzExXSxcbiAgICAgIGNyZWF0ZWRfYnk6IHJvd1sxMl0sXG4gICAgICB1cGRhdGVkX2J5OiByb3dbMTNdXG4gICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlUXVlcnkoc2VxdWVuY2UsIGxpbWl0KSB7XG4gICAgY29uc3Qgc2VxdWVuY2VTdHJpbmcgPSBuZXcgRGF0ZSgrc2VxdWVuY2UpLnRvSVNPU3RyaW5nKCk7XG5cbiAgICByZXR1cm4gYFxuU0VMRUNUXG4gIFwic2lnbmF0dXJlX2lkXCIgQVMgXCJhY2Nlc3Nfa2V5XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJjcmVhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJjcmVhdGVkX2F0XCIsXG4gIHRvX2NoYXIocGdfY2F0YWxvZy50aW1lem9uZSgnVVRDJywgXCJyZWNvcmRzXCIuXCJ1cGRhdGVkX2F0XCIpLCAnWVlZWS1NTS1ERFwiVFwiSEgyNDpNSTpTU1wiWlwiJykgQVMgXCJ1cGRhdGVkX2F0XCIsXG4gIFwidXBsb2FkZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyB1cGxvYWRlZCxcbiAgXCJzdG9yZWRfYXRcIiBJUyBOT1QgTlVMTCBBUyBzdG9yZWQsXG4gIFwicHJvY2Vzc2VkX2F0XCIgSVMgTk9UIE5VTEwgQVMgcHJvY2Vzc2VkLFxuICBcImNyZWF0ZWRfYnlfaWRcIiBBUyBcImNyZWF0ZWRfYnlfaWRcIixcbiAgXCJ1cGRhdGVkX2J5X2lkXCIgQVMgXCJ1cGRhdGVkX2J5X2lkXCIsXG4gIFwiZm9ybV9pZFwiIEFTIFwiZm9ybV9pZFwiLFxuICBcInJlY29yZF9pZFwiIEFTIFwicmVjb3JkX2lkXCIsXG4gIFwiY29udGVudF90eXBlXCIgQVMgXCJjb250ZW50X3R5cGVcIixcbiAgXCJmaWxlX3NpemVcIiBBUyBcImZpbGVfc2l6ZVwiLFxuICBcImNyZWF0ZWRfYnlcIi5cIm5hbWVcIiBBUyBcImNyZWF0ZWRfYnlcIixcbiAgXCJ1cGRhdGVkX2J5XCIuXCJuYW1lXCIgQVMgXCJ1cGRhdGVkX2J5XCJcbkZST00gXCJzaWduYXR1cmVzXCIgQVMgXCJyZWNvcmRzXCJcbkxFRlQgT1VURVIgSk9JTiBcIm1lbWJlcnNoaXBzXCIgQVMgXCJjcmVhdGVkX2J5XCIgT04gKChcInJlY29yZHNcIi5cImNyZWF0ZWRfYnlfaWRcIikgPSAoXCJjcmVhdGVkX2J5XCIuXCJ1c2VyX2lkXCIpKVxuTEVGVCBPVVRFUiBKT0lOIFwibWVtYmVyc2hpcHNcIiBBUyBcInVwZGF0ZWRfYnlcIiBPTiAoKFwicmVjb3Jkc1wiLlwidXBkYXRlZF9ieV9pZFwiKSA9IChcInVwZGF0ZWRfYnlcIi5cInVzZXJfaWRcIikpXG5XSEVSRVxuICBcInJlY29yZHNcIi51cGRhdGVkX2F0ID4gJyR7c2VxdWVuY2VTdHJpbmd9J1xuT1JERVIgQllcbiAgXCJyZWNvcmRzXCIudXBkYXRlZF9hdCBBU0NcbkxJTUlUICR7bGltaXR9IE9GRlNFVCAwXG5gO1xuICB9XG59XG4iXX0=