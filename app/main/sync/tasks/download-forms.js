'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _form = require('../../models/form');

var _form2 = _interopRequireDefault(_form);

var _schema = require('fulcrum-schema/dist/schema');

var _schema2 = _interopRequireDefault(_schema);

var _metadata = require('fulcrum-schema/dist/metadata');

var _metadata2 = _interopRequireDefault(_metadata);

var _postgresQueryV = require('fulcrum-schema/dist/schemas/postgres-query-v2');

var _postgresQueryV2 = _interopRequireDefault(_postgresQueryV);

var _sqldiff = require('sqldiff');

var _sqldiff2 = _interopRequireDefault(_sqldiff);

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { SchemaDiffer, Sqlite } = _sqldiff2.default;

class DownloadForms extends _downloadResource2.default {
  get resourceName() {
    return 'forms';
  }

  get typeName() {
    return 'form';
  }

  fetchObjects(lastSync, sequence) {
    return _client2.default.getForms(this.account);
  }

  fetchLocalObjects() {
    return this.account.findForms();
  }

  findOrCreate(database, attributes) {
    return _form2.default.findOrCreate(database, { resource_id: attributes.id, account_id: this.account.rowID });
  }

  process(object, attributes) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const isChanged = !object.isPersisted || attributes.version !== object.version;

      let oldForm = null;

      if (object.isPersisted) {
        oldForm = {
          id: object._id,
          row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON
        };
      }

      object.updateFromAPIAttributes(attributes);
      object._deletedAt = null;

      yield _this.db.transaction((() => {
        var _ref = _asyncToGenerator(function* (db) {
          yield object.save({ db });

          const newForm = {
            id: object.id,
            row_id: object.rowID,
            name: object._name,
            elements: object._elementsJSON
          };

          const statements = yield _this.updateFormTables(db, oldForm, newForm);

          if (isChanged) {
            yield _this.triggerEvent('save', { form: object, account: _this.account, statements, oldForm, newForm });
          }
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());
    })();
  }

  updateFormTables(db, oldForm, newForm) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let oldSchema = null;
      let newSchema = null;

      if (oldForm) {
        oldSchema = new _schema2.default(oldForm, _postgresQueryV2.default, null);
      }

      if (newForm) {
        newSchema = new _schema2.default(newForm, _postgresQueryV2.default, null);
      }

      const tablePrefix = 'account_' + _this2.account.rowID + '_';

      const differ = new SchemaDiffer(oldSchema, newSchema);

      const meta = new _metadata2.default(differ, { tablePrefix, quote: '`', includeColumns: true });

      const generator = new Sqlite(differ, { afterTransform: meta.build.bind(meta) });

      generator.tablePrefix = tablePrefix;

      const statements = generator.generate();

      for (const statement of statements) {
        yield db.execute(statement);
      }

      return statements;
    })();
  }
}
exports.default = DownloadForms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtZm9ybXMuanMiXSwibmFtZXMiOlsiU2NoZW1hRGlmZmVyIiwiU3FsaXRlIiwiRG93bmxvYWRGb3JtcyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsImdldEZvcm1zIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZEZvcm1zIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCIsInByb2Nlc3MiLCJvYmplY3QiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJvbGRGb3JtIiwiX2lkIiwicm93X2lkIiwibmFtZSIsIl9uYW1lIiwiZWxlbWVudHMiLCJfZWxlbWVudHNKU09OIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0IiwiZGIiLCJ0cmFuc2FjdGlvbiIsInNhdmUiLCJuZXdGb3JtIiwic3RhdGVtZW50cyIsInVwZGF0ZUZvcm1UYWJsZXMiLCJ0cmlnZ2VyRXZlbnQiLCJmb3JtIiwib2xkU2NoZW1hIiwibmV3U2NoZW1hIiwidGFibGVQcmVmaXgiLCJkaWZmZXIiLCJtZXRhIiwicXVvdGUiLCJpbmNsdWRlQ29sdW1ucyIsImdlbmVyYXRvciIsImFmdGVyVHJhbnNmb3JtIiwiYnVpbGQiLCJiaW5kIiwiZ2VuZXJhdGUiLCJzdGF0ZW1lbnQiLCJleGVjdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNLEVBQUNBLFlBQUQsRUFBZUMsTUFBZixzQkFBTjs7QUFFZSxNQUFNQyxhQUFOLG9DQUE2QztBQUMxRCxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdB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LEVBQW5CLENBQWxCOztBQUVBRyxnQkFBVUwsV0FBVixHQUF3QkEsV0FBeEI7O0FBRUEsWUFBTU4sYUFBYVcsVUFBVUksUUFBVixFQUFuQjs7QUFFQSxXQUFLLE1BQU1DLFNBQVgsSUFBd0JoQixVQUF4QixFQUFvQztBQUNsQyxjQUFNSixHQUFHcUIsT0FBSCxDQUFXRCxTQUFYLENBQU47QUFDRDs7QUFFRCxhQUFPaEIsVUFBUDtBQTVCMkM7QUE2QjVDO0FBckZ5RDtrQkFBdkNuQyxhIiwiZmlsZSI6ImRvd25sb2FkLWZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcclxuaW1wb3J0IEZvcm0gZnJvbSAnLi4vLi4vbW9kZWxzL2Zvcm0nO1xyXG5pbXBvcnQgU2NoZW1hIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3Qvc2NoZW1hJztcclxuaW1wb3J0IE1ldGFkYXRhIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3QvbWV0YWRhdGEnO1xyXG5pbXBvcnQgVjIgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWFzL3Bvc3RncmVzLXF1ZXJ5LXYyJztcclxuaW1wb3J0IHNxbGRpZmYgZnJvbSAnc3FsZGlmZic7XHJcbmltcG9ydCBEb3dubG9hZFJlc291cmNlIGZyb20gJy4vZG93bmxvYWQtcmVzb3VyY2UnO1xyXG5cclxuY29uc3Qge1NjaGVtYURpZmZlciwgU3FsaXRlfSA9IHNxbGRpZmY7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZEZvcm1zIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XHJcbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcclxuICAgIHJldHVybiAnZm9ybXMnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHR5cGVOYW1lKCkge1xyXG4gICAgcmV0dXJuICdmb3JtJztcclxuICB9XHJcblxyXG4gIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcclxuICAgIHJldHVybiBDbGllbnQuZ2V0Rm9ybXModGhpcy5hY2NvdW50KTtcclxuICB9XHJcblxyXG4gIGZldGNoTG9jYWxPYmplY3RzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5maW5kRm9ybXMoKTtcclxuICB9XHJcblxyXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xyXG4gICAgcmV0dXJuIEZvcm0uZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcclxuICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHwgYXR0cmlidXRlcy52ZXJzaW9uICE9PSBvYmplY3QudmVyc2lvbjtcclxuXHJcbiAgICBsZXQgb2xkRm9ybSA9IG51bGw7XHJcblxyXG4gICAgaWYgKG9iamVjdC5pc1BlcnNpc3RlZCkge1xyXG4gICAgICBvbGRGb3JtID0ge1xyXG4gICAgICAgIGlkOiBvYmplY3QuX2lkLFxyXG4gICAgICAgIHJvd19pZDogb2JqZWN0LnJvd0lELFxyXG4gICAgICAgIG5hbWU6IG9iamVjdC5fbmFtZSxcclxuICAgICAgICBlbGVtZW50czogb2JqZWN0Ll9lbGVtZW50c0pTT05cclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG51bGw7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5kYi50cmFuc2FjdGlvbihhc3luYyAoZGIpID0+IHtcclxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoe2RifSk7XHJcblxyXG4gICAgICBjb25zdCBuZXdGb3JtID0ge1xyXG4gICAgICAgIGlkOiBvYmplY3QuaWQsXHJcbiAgICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXHJcbiAgICAgICAgbmFtZTogb2JqZWN0Ll9uYW1lLFxyXG4gICAgICAgIGVsZW1lbnRzOiBvYmplY3QuX2VsZW1lbnRzSlNPTlxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IGF3YWl0IHRoaXMudXBkYXRlRm9ybVRhYmxlcyhkYiwgb2xkRm9ybSwgbmV3Rm9ybSk7XHJcblxyXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyRXZlbnQoJ3NhdmUnLCB7Zm9ybTogb2JqZWN0LCBhY2NvdW50OiB0aGlzLmFjY291bnQsIHN0YXRlbWVudHMsIG9sZEZvcm0sIG5ld0Zvcm19KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyB1cGRhdGVGb3JtVGFibGVzKGRiLCBvbGRGb3JtLCBuZXdGb3JtKSB7XHJcbiAgICBsZXQgb2xkU2NoZW1hID0gbnVsbDtcclxuICAgIGxldCBuZXdTY2hlbWEgPSBudWxsO1xyXG5cclxuICAgIGlmIChvbGRGb3JtKSB7XHJcbiAgICAgIG9sZFNjaGVtYSA9IG5ldyBTY2hlbWEob2xkRm9ybSwgVjIsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChuZXdGb3JtKSB7XHJcbiAgICAgIG5ld1NjaGVtYSA9IG5ldyBTY2hlbWEobmV3Rm9ybSwgVjIsIG51bGwpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhYmxlUHJlZml4ID0gJ2FjY291bnRfJyArIHRoaXMuYWNjb3VudC5yb3dJRCArICdfJztcclxuXHJcbiAgICBjb25zdCBkaWZmZXIgPSBuZXcgU2NoZW1hRGlmZmVyKG9sZFNjaGVtYSwgbmV3U2NoZW1hKTtcclxuXHJcbiAgICBjb25zdCBtZXRhID0gbmV3IE1ldGFkYXRhKGRpZmZlciwge3RhYmxlUHJlZml4LCBxdW90ZTogJ2AnLCBpbmNsdWRlQ29sdW1uczogdHJ1ZX0pO1xyXG5cclxuICAgIGNvbnN0IGdlbmVyYXRvciA9IG5ldyBTcWxpdGUoZGlmZmVyLCB7YWZ0ZXJUcmFuc2Zvcm06IG1ldGEuYnVpbGQuYmluZChtZXRhKX0pO1xyXG5cclxuICAgIGdlbmVyYXRvci50YWJsZVByZWZpeCA9IHRhYmxlUHJlZml4O1xyXG5cclxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBzdGF0ZW1lbnRzKSB7XHJcbiAgICAgIGF3YWl0IGRiLmV4ZWN1dGUoc3RhdGVtZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGVtZW50cztcclxuICB9XHJcbn1cclxuIl19