'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _form = require('../../models/form');

var _form2 = _interopRequireDefault(_form);

var _util = require('util');

var _schema = require('fulcrum-schema/dist/schema');

var _schema2 = _interopRequireDefault(_schema);

var _metadata = require('fulcrum-schema/dist/metadata');

var _metadata2 = _interopRequireDefault(_metadata);

var _postgresQueryV = require('fulcrum-schema/dist/schemas/postgres-query-v2');

var _postgresQueryV2 = _interopRequireDefault(_postgresQueryV);

var _sqldiff = require('sqldiff');

var _sqldiff2 = _interopRequireDefault(_sqldiff);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
// import SQLiteRecordValues from '../../models/record-values/sqlite-record-values';

const { SchemaDiffer, Sqlite } = _sqldiff2.default;

class DownloadForms extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'forms');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' forms' });

      const response = yield _client2.default.getForms(account);

      const objects = JSON.parse(response.body).forms;

      _this.progress({ message: _this.processing + ' forms', count: 0, total: objects.length });

      const localObjects = yield account.findForms();

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _form2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        let oldForm = null;

        if (object.isPersisted) {
          oldForm = {
            id: object._id,
            row_id: object.rowID,
            name: object._name,
            elements: object._elementsJSON
          };
        }

        const isChanged = !object.isPersisted || attributes.version !== object.version;

        object.updateFromAPIAttributes(attributes);
        object._deletedAt = null;

        yield object.save();

        const newForm = {
          id: object.id,
          row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON
        };

        // await account.db.execute(format('DROP VIEW IF EXISTS %s',
        //                                 account.db.ident(object.name)));

        const statements = yield _this.updateFormTables(account, oldForm, newForm);

        // await account.db.execute(format('CREATE VIEW %s AS SELECT * FROM %s_view_full',
        //                                 account.db.ident(object.name),
        //                                 SQLiteRecordValues.tableNameWithForm(object)));

        if (isChanged) {
          yield _this.trigger('form:save', { form: object, account, statements, oldForm, newForm });
        }

        _this.progress({ message: _this.processing + ' forms', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('forms');

      _this.progress({ message: _this.finished + ' forms', count: objects.length, total: objects.length });
    })();
  }

  updateFormTables(account, oldForm, newForm) {
    return _asyncToGenerator(function* () {
      let oldSchema = null;
      let newSchema = null;

      if (oldForm) {
        oldSchema = new _schema2.default(oldForm, _postgresQueryV2.default, null);
      }

      if (newForm) {
        newSchema = new _schema2.default(newForm, _postgresQueryV2.default, null);
      }

      const differ = new SchemaDiffer(oldSchema, newSchema);

      const meta = new _metadata2.default(differ, { quote: '`', includeColumns: true });

      const generator = new Sqlite(differ, { afterTransform: meta.build.bind(meta) });

      generator.tablePrefix = 'account_' + account.rowID + '_';

      const statements = generator.generate();

      yield account.db.transaction((() => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtZm9ybXMuanMiXSwibmFtZXMiOlsiU2NoZW1hRGlmZmVyIiwiU3FsaXRlIiwiRG93bmxvYWRGb3JtcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Rm9ybXMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsImZvcm1zIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kRm9ybXMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJvbGRGb3JtIiwiaXNQZXJzaXN0ZWQiLCJfaWQiLCJyb3dfaWQiLCJuYW1lIiwiX25hbWUiLCJlbGVtZW50cyIsIl9lbGVtZW50c0pTT04iLCJpc0NoYW5nZWQiLCJ2ZXJzaW9uIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsIm5ld0Zvcm0iLCJzdGF0ZW1lbnRzIiwidXBkYXRlRm9ybVRhYmxlcyIsInRyaWdnZXIiLCJmb3JtIiwidXBkYXRlIiwic291cmNlIiwiaW52YWxpZGF0ZSIsImZpbmlzaGVkIiwib2xkU2NoZW1hIiwibmV3U2NoZW1hIiwiZGlmZmVyIiwibWV0YSIsInF1b3RlIiwiaW5jbHVkZUNvbHVtbnMiLCJnZW5lcmF0b3IiLCJhZnRlclRyYW5zZm9ybSIsImJ1aWxkIiwiYmluZCIsInRhYmxlUHJlZml4IiwiZ2VuZXJhdGUiLCJ0cmFuc2FjdGlvbiIsInN0YXRlbWVudCIsImV4ZWN1dGUiXSwibWFwcGluZ3MiOiI7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U0FKSzs7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFOOztBQU1BLGFBQU9yQixVQUFQO0FBNUJnRDtBQTZCakQ7QUF0RzZDO2tCQUEzQi9DLGEiLCJmaWxlIjoiZG93bmxvYWQtZm9ybXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFzayBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCBGb3JtIGZyb20gJy4uLy4uL21vZGVscy9mb3JtJztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcbi8vIGltcG9ydCBTUUxpdGVSZWNvcmRWYWx1ZXMgZnJvbSAnLi4vLi4vbW9kZWxzL3JlY29yZC12YWx1ZXMvc3FsaXRlLXJlY29yZC12YWx1ZXMnO1xuXG5pbXBvcnQgU2NoZW1hIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3Qvc2NoZW1hJztcbmltcG9ydCBNZXRhZGF0YSBmcm9tICdmdWxjcnVtLXNjaGVtYS9kaXN0L21ldGFkYXRhJztcbmltcG9ydCBWMiBmcm9tICdmdWxjcnVtLXNjaGVtYS9kaXN0L3NjaGVtYXMvcG9zdGdyZXMtcXVlcnktdjInO1xuaW1wb3J0IHNxbGRpZmYgZnJvbSAnc3FsZGlmZic7XG5cbmNvbnN0IHtTY2hlbWFEaWZmZXIsIFNxbGl0ZX0gPSBzcWxkaWZmO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZEZvcm1zIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzeW5jID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCAnZm9ybXMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGZvcm1zJ30pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBDbGllbnQuZ2V0Rm9ybXMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5mb3JtcztcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgZm9ybXMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRGb3JtcygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBGb3JtLmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgbGV0IG9sZEZvcm0gPSBudWxsO1xuXG4gICAgICBpZiAob2JqZWN0LmlzUGVyc2lzdGVkKSB7XG4gICAgICAgIG9sZEZvcm0gPSB7XG4gICAgICAgICAgaWQ6IG9iamVjdC5faWQsXG4gICAgICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXG4gICAgICAgICAgbmFtZTogb2JqZWN0Ll9uYW1lLFxuICAgICAgICAgIGVsZW1lbnRzOiBvYmplY3QuX2VsZW1lbnRzSlNPTlxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgY29uc3QgbmV3Rm9ybSA9IHtcbiAgICAgICAgaWQ6IG9iamVjdC5pZCxcbiAgICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXG4gICAgICAgIG5hbWU6IG9iamVjdC5fbmFtZSxcbiAgICAgICAgZWxlbWVudHM6IG9iamVjdC5fZWxlbWVudHNKU09OXG4gICAgICB9O1xuXG4gICAgICAvLyBhd2FpdCBhY2NvdW50LmRiLmV4ZWN1dGUoZm9ybWF0KCdEUk9QIFZJRVcgSUYgRVhJU1RTICVzJyxcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudC5kYi5pZGVudChvYmplY3QubmFtZSkpKTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IGF3YWl0IHRoaXMudXBkYXRlRm9ybVRhYmxlcyhhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtKTtcblxuICAgICAgLy8gYXdhaXQgYWNjb3VudC5kYi5leGVjdXRlKGZvcm1hdCgnQ1JFQVRFIFZJRVcgJXMgQVMgU0VMRUNUICogRlJPTSAlc192aWV3X2Z1bGwnLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50LmRiLmlkZW50KG9iamVjdC5uYW1lKSxcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1FMaXRlUmVjb3JkVmFsdWVzLnRhYmxlTmFtZVdpdGhGb3JtKG9iamVjdCkpKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ2Zvcm06c2F2ZScsIHtmb3JtOiBvYmplY3QsIGFjY291bnQsIHN0YXRlbWVudHMsIG9sZEZvcm0sIG5ld0Zvcm19KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBmb3JtcycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdmb3JtcycpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgZm9ybXMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRm9ybVRhYmxlcyhhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtKSB7XG4gICAgbGV0IG9sZFNjaGVtYSA9IG51bGw7XG4gICAgbGV0IG5ld1NjaGVtYSA9IG51bGw7XG5cbiAgICBpZiAob2xkRm9ybSkge1xuICAgICAgb2xkU2NoZW1hID0gbmV3IFNjaGVtYShvbGRGb3JtLCBWMiwgbnVsbCk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Zvcm0pIHtcbiAgICAgIG5ld1NjaGVtYSA9IG5ldyBTY2hlbWEobmV3Rm9ybSwgVjIsIG51bGwpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmZlciA9IG5ldyBTY2hlbWFEaWZmZXIob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuXG4gICAgY29uc3QgbWV0YSA9IG5ldyBNZXRhZGF0YShkaWZmZXIsIHtxdW90ZTogJ2AnLCBpbmNsdWRlQ29sdW1uczogdHJ1ZX0pO1xuXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gbmV3IFNxbGl0ZShkaWZmZXIsIHthZnRlclRyYW5zZm9ybTogbWV0YS5idWlsZC5iaW5kKG1ldGEpfSk7XG5cbiAgICBnZW5lcmF0b3IudGFibGVQcmVmaXggPSAnYWNjb3VudF8nICsgYWNjb3VudC5yb3dJRCArICdfJztcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBnZW5lcmF0b3IuZ2VuZXJhdGUoKTtcblxuICAgIGF3YWl0IGFjY291bnQuZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRiKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBzdGF0ZW1lbnRzKSB7XG4gICAgICAgIGF3YWl0IGRiLmV4ZWN1dGUoc3RhdGVtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG59XG4iXX0=