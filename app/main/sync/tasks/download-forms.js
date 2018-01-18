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

      yield object.save();

      const newForm = {
        id: object.id,
        row_id: object.rowID,
        name: object._name,
        elements: object._elementsJSON
      };

      const statements = yield _this.updateFormTables(oldForm, newForm);

      if (isChanged) {
        yield _this.triggerEvent('save', { form: object, account: _this.account, statements, oldForm, newForm });
      }
    })();
  }

  updateFormTables(oldForm, newForm) {
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

      yield _this2.db.transaction((() => {
        var _ref = _asyncToGenerator(function* (db) {
          for (const statement of statements) {
            yield db.execute(statement);
          }
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      return statements;
    })();
  }
}
exports.default = DownloadForms;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtZm9ybXMuanMiXSwibmFtZXMiOlsiU2NoZW1hRGlmZmVyIiwiU3FsaXRlIiwiRG93bmxvYWRGb3JtcyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsImdldEZvcm1zIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZEZvcm1zIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCIsInByb2Nlc3MiLCJvYmplY3QiLCJpc0NoYW5nZWQiLCJpc1BlcnNpc3RlZCIsInZlcnNpb24iLCJvbGRGb3JtIiwiX2lkIiwicm93X2lkIiwibmFtZSIsIl9uYW1lIiwiZWxlbWVudHMiLCJfZWxlbWVudHNKU09OIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsIm5ld0Zvcm0iLCJzdGF0ZW1lbnRzIiwidXBkYXRlRm9ybVRhYmxlcyIsInRyaWdnZXJFdmVudCIsImZvcm0iLCJvbGRTY2hlbWEiLCJuZXdTY2hlbWEiLCJ0YWJsZVByZWZpeCIsImRpZmZlciIsIm1ldGEiLCJxdW90ZSIsImluY2x1ZGVDb2x1bW5zIiwiZ2VuZXJhdG9yIiwiYWZ0ZXJUcmFuc2Zvcm0iLCJidWlsZCIsImJpbmQiLCJnZW5lcmF0ZSIsImRiIiwidHJhbnNhY3Rpb24iLCJzdGF0ZW1lbnQiLCJleGVjdXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNLEVBQUNBLFlBQUQsRUFBZUMsTUFBZixzQkFBTjs7QUFFZSxNQUFNQyxhQUFOLG9DQUE2QztBQUMxRCxNQUFJQyxZQUFKLEdBQW1CO0FBQ2pCLFdB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TUFBTUUsU0FBWCxJQUF3QmxCLFVBQXhCLEVBQW9DO0FBQ2xDLGtCQUFNZ0IsR0FBR0csT0FBSCxDQUFXRCxTQUFYLENBQU47QUFDRDtBQUNGLFNBSks7O0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBTjs7QUFNQSxhQUFPbEIsVUFBUDtBQTlCdUM7QUErQnhDO0FBckZ5RDtrQkFBdkNqQyxhIiwiZmlsZSI6ImRvd25sb2FkLWZvcm1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBGb3JtIGZyb20gJy4uLy4uL21vZGVscy9mb3JtJztcbmltcG9ydCBTY2hlbWEgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWEnO1xuaW1wb3J0IE1ldGFkYXRhIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3QvbWV0YWRhdGEnO1xuaW1wb3J0IFYyIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3Qvc2NoZW1hcy9wb3N0Z3Jlcy1xdWVyeS12Mic7XG5pbXBvcnQgc3FsZGlmZiBmcm9tICdzcWxkaWZmJztcbmltcG9ydCBEb3dubG9hZFJlc291cmNlIGZyb20gJy4vZG93bmxvYWQtcmVzb3VyY2UnO1xuXG5jb25zdCB7U2NoZW1hRGlmZmVyLCBTcWxpdGV9ID0gc3FsZGlmZjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRGb3JtcyBleHRlbmRzIERvd25sb2FkUmVzb3VyY2Uge1xuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiAnZm9ybXMnO1xuICB9XG5cbiAgZ2V0IHR5cGVOYW1lKCkge1xuICAgIHJldHVybiAnZm9ybSc7XG4gIH1cblxuICBmZXRjaE9iamVjdHMobGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gICAgcmV0dXJuIENsaWVudC5nZXRGb3Jtcyh0aGlzLmFjY291bnQpO1xuICB9XG5cbiAgZmV0Y2hMb2NhbE9iamVjdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5maW5kRm9ybXMoKTtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xuICAgIHJldHVybiBGb3JtLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwge3Jlc291cmNlX2lkOiBhdHRyaWJ1dGVzLmlkLCBhY2NvdW50X2lkOiB0aGlzLmFjY291bnQucm93SUR9KTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIW9iamVjdC5pc1BlcnNpc3RlZCB8fCBhdHRyaWJ1dGVzLnZlcnNpb24gIT09IG9iamVjdC52ZXJzaW9uO1xuXG4gICAgbGV0IG9sZEZvcm0gPSBudWxsO1xuXG4gICAgaWYgKG9iamVjdC5pc1BlcnNpc3RlZCkge1xuICAgICAgb2xkRm9ybSA9IHtcbiAgICAgICAgaWQ6IG9iamVjdC5faWQsXG4gICAgICAgIHJvd19pZDogb2JqZWN0LnJvd0lELFxuICAgICAgICBuYW1lOiBvYmplY3QuX25hbWUsXG4gICAgICAgIGVsZW1lbnRzOiBvYmplY3QuX2VsZW1lbnRzSlNPTlxuICAgICAgfTtcbiAgICB9XG5cbiAgICBvYmplY3QudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgIGNvbnN0IG5ld0Zvcm0gPSB7XG4gICAgICBpZDogb2JqZWN0LmlkLFxuICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXG4gICAgICBuYW1lOiBvYmplY3QuX25hbWUsXG4gICAgICBlbGVtZW50czogb2JqZWN0Ll9lbGVtZW50c0pTT05cbiAgICB9O1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IGF3YWl0IHRoaXMudXBkYXRlRm9ybVRhYmxlcyhvbGRGb3JtLCBuZXdGb3JtKTtcblxuICAgIGlmIChpc0NoYW5nZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlckV2ZW50KCdzYXZlJywge2Zvcm06IG9iamVjdCwgYWNjb3VudDogdGhpcy5hY2NvdW50LCBzdGF0ZW1lbnRzLCBvbGRGb3JtLCBuZXdGb3JtfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgdXBkYXRlRm9ybVRhYmxlcyhvbGRGb3JtLCBuZXdGb3JtKSB7XG4gICAgbGV0IG9sZFNjaGVtYSA9IG51bGw7XG4gICAgbGV0IG5ld1NjaGVtYSA9IG51bGw7XG5cbiAgICBpZiAob2xkRm9ybSkge1xuICAgICAgb2xkU2NoZW1hID0gbmV3IFNjaGVtYShvbGRGb3JtLCBWMiwgbnVsbCk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Zvcm0pIHtcbiAgICAgIG5ld1NjaGVtYSA9IG5ldyBTY2hlbWEobmV3Rm9ybSwgVjIsIG51bGwpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlUHJlZml4ID0gJ2FjY291bnRfJyArIHRoaXMuYWNjb3VudC5yb3dJRCArICdfJztcblxuICAgIGNvbnN0IGRpZmZlciA9IG5ldyBTY2hlbWFEaWZmZXIob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuXG4gICAgY29uc3QgbWV0YSA9IG5ldyBNZXRhZGF0YShkaWZmZXIsIHt0YWJsZVByZWZpeCwgcXVvdGU6ICdgJywgaW5jbHVkZUNvbHVtbnM6IHRydWV9KTtcblxuICAgIGNvbnN0IGdlbmVyYXRvciA9IG5ldyBTcWxpdGUoZGlmZmVyLCB7YWZ0ZXJUcmFuc2Zvcm06IG1ldGEuYnVpbGQuYmluZChtZXRhKX0pO1xuXG4gICAgZ2VuZXJhdG9yLnRhYmxlUHJlZml4ID0gdGFibGVQcmVmaXg7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gZ2VuZXJhdG9yLmdlbmVyYXRlKCk7XG5cbiAgICBhd2FpdCB0aGlzLmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYikgPT4ge1xuICAgICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2Ygc3RhdGVtZW50cykge1xuICAgICAgICBhd2FpdCBkYi5leGVjdXRlKHN0YXRlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxufVxuIl19