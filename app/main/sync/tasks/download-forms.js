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

var _fulcrumCore = require('fulcrum-core');

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

      _this.markDeletedObjects(localObjects, objects, 'form');

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

      const tablePrefix = 'account_' + account.rowID + '_';

      const differ = new SchemaDiffer(oldSchema, newSchema);

      const meta = new _metadata2.default(differ, { tablePrefix, quote: '`', includeColumns: true });

      const generator = new Sqlite(differ, { afterTransform: meta.build.bind(meta) });

      generator.tablePrefix = tablePrefix;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtZm9ybXMuanMiXSwibmFtZXMiOlsiU2NoZW1hRGlmZmVyIiwiU3FsaXRlIiwiRG93bmxvYWRGb3JtcyIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3luYyIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInJlc3BvbnNlIiwiZ2V0Rm9ybXMiLCJvYmplY3RzIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsImZvcm1zIiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJsb2NhbE9iamVjdHMiLCJmaW5kRm9ybXMiLCJtYXJrRGVsZXRlZE9iamVjdHMiLCJpbmRleCIsImF0dHJpYnV0ZXMiLCJvYmplY3QiLCJmaW5kT3JDcmVhdGUiLCJkYiIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiLCJvbGRGb3JtIiwiaXNQZXJzaXN0ZWQiLCJfaWQiLCJyb3dfaWQiLCJuYW1lIiwiX25hbWUiLCJlbGVtZW50cyIsIl9lbGVtZW50c0pTT04iLCJpc0NoYW5nZWQiLCJ2ZXJzaW9uIiwidXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMiLCJfZGVsZXRlZEF0Iiwic2F2ZSIsIm5ld0Zvcm0iLCJzdGF0ZW1lbnRzIiwidXBkYXRlRm9ybVRhYmxlcyIsInRyaWdnZXIiLCJmb3JtIiwidXBkYXRlIiwic291cmNlIiwiaW52YWxpZGF0ZSIsImZpbmlzaGVkIiwib2xkU2NoZW1hIiwibmV3U2NoZW1hIiwidGFibGVQcmVmaXgiLCJkaWZmZXIiLCJtZXRhIiwicXVvdGUiLCJpbmNsdWRlQ29sdW1ucyIsImdlbmVyYXRvciIsImFmdGVyVHJhbnNmb3JtIiwiYnVpbGQiLCJiaW5kIiwiZ2VuZXJhdGUiLCJ0cmFuc2FjdGlvbiIsInN0YXRlbWVudCIsImV4ZWN1dGUiXSwibWFwcGluZ3MiOiI7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QW9DO0FBQ2xDLGtCQUFNbkIsR0FBR3lDLE9BQUgsQ0FBV0QsU0FBWCxDQUFOO0FBQ0Q7QUFDRixTQUpLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQU47O0FBTUEsYUFBT3JCLFVBQVA7QUE5QmdEO0FBK0JqRDtBQXhHNkM7a0JBQTNCL0MsYSIsImZpbGUiOiJkb3dubG9hZC1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vLi4vbW9kZWxzL2Zvcm0nO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbi8vIGltcG9ydCBTUUxpdGVSZWNvcmRWYWx1ZXMgZnJvbSAnLi4vLi4vbW9kZWxzL3JlY29yZC12YWx1ZXMvc3FsaXRlLXJlY29yZC12YWx1ZXMnO1xuXG5pbXBvcnQgU2NoZW1hIGZyb20gJ2Z1bGNydW0tc2NoZW1hL2Rpc3Qvc2NoZW1hJztcbmltcG9ydCBNZXRhZGF0YSBmcm9tICdmdWxjcnVtLXNjaGVtYS9kaXN0L21ldGFkYXRhJztcbmltcG9ydCBWMiBmcm9tICdmdWxjcnVtLXNjaGVtYS9kaXN0L3NjaGVtYXMvcG9zdGdyZXMtcXVlcnktdjInO1xuaW1wb3J0IHNxbGRpZmYgZnJvbSAnc3FsZGlmZic7XG5cbmNvbnN0IHtTY2hlbWFEaWZmZXIsIFNxbGl0ZX0gPSBzcWxkaWZmO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZEZvcm1zIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzeW5jID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCAnZm9ybXMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGZvcm1zJ30pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBDbGllbnQuZ2V0Rm9ybXMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5mb3JtcztcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgZm9ybXMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRGb3JtcygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzLCAnZm9ybScpO1xuXG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IEZvcm0uZmluZE9yQ3JlYXRlKGFjY291bnQuZGIsIHtyZXNvdXJjZV9pZDogYXR0cmlidXRlcy5pZCwgYWNjb3VudF9pZDogYWNjb3VudC5yb3dJRH0pO1xuXG4gICAgICBsZXQgb2xkRm9ybSA9IG51bGw7XG5cbiAgICAgIGlmIChvYmplY3QuaXNQZXJzaXN0ZWQpIHtcbiAgICAgICAgb2xkRm9ybSA9IHtcbiAgICAgICAgICBpZDogb2JqZWN0Ll9pZCxcbiAgICAgICAgICByb3dfaWQ6IG9iamVjdC5yb3dJRCxcbiAgICAgICAgICBuYW1lOiBvYmplY3QuX25hbWUsXG4gICAgICAgICAgZWxlbWVudHM6IG9iamVjdC5fZWxlbWVudHNKU09OXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9ICFvYmplY3QuaXNQZXJzaXN0ZWQgfHwgYXR0cmlidXRlcy52ZXJzaW9uICE9PSBvYmplY3QudmVyc2lvbjtcblxuICAgICAgb2JqZWN0LnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xuICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBudWxsO1xuXG4gICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuXG4gICAgICBjb25zdCBuZXdGb3JtID0ge1xuICAgICAgICBpZDogb2JqZWN0LmlkLFxuICAgICAgICByb3dfaWQ6IG9iamVjdC5yb3dJRCxcbiAgICAgICAgbmFtZTogb2JqZWN0Ll9uYW1lLFxuICAgICAgICBlbGVtZW50czogb2JqZWN0Ll9lbGVtZW50c0pTT05cbiAgICAgIH07XG5cbiAgICAgIC8vIGF3YWl0IGFjY291bnQuZGIuZXhlY3V0ZShmb3JtYXQoJ0RST1AgVklFVyBJRiBFWElTVFMgJXMnLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50LmRiLmlkZW50KG9iamVjdC5uYW1lKSkpO1xuXG4gICAgICBjb25zdCBzdGF0ZW1lbnRzID0gYXdhaXQgdGhpcy51cGRhdGVGb3JtVGFibGVzKGFjY291bnQsIG9sZEZvcm0sIG5ld0Zvcm0pO1xuXG4gICAgICAvLyBhd2FpdCBhY2NvdW50LmRiLmV4ZWN1dGUoZm9ybWF0KCdDUkVBVEUgVklFVyAlcyBBUyBTRUxFQ1QgKiBGUk9NICVzX3ZpZXdfZnVsbCcsXG4gICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjY291bnQuZGIuaWRlbnQob2JqZWN0Lm5hbWUpLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTUUxpdGVSZWNvcmRWYWx1ZXMudGFibGVOYW1lV2l0aEZvcm0ob2JqZWN0KSkpO1xuXG4gICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcignZm9ybTpzYXZlJywge2Zvcm06IG9iamVjdCwgYWNjb3VudCwgc3RhdGVtZW50cywgb2xkRm9ybSwgbmV3Rm9ybX0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnIGZvcm1zJywgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3luYy51cGRhdGUoKTtcblxuICAgIGRhdGFTb3VyY2Uuc291cmNlLmludmFsaWRhdGUoJ2Zvcm1zJyk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmZpbmlzaGVkICsgJyBmb3JtcycsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVGb3JtVGFibGVzKGFjY291bnQsIG9sZEZvcm0sIG5ld0Zvcm0pIHtcbiAgICBsZXQgb2xkU2NoZW1hID0gbnVsbDtcbiAgICBsZXQgbmV3U2NoZW1hID0gbnVsbDtcblxuICAgIGlmIChvbGRGb3JtKSB7XG4gICAgICBvbGRTY2hlbWEgPSBuZXcgU2NoZW1hKG9sZEZvcm0sIFYyLCBudWxsKTtcbiAgICB9XG5cbiAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgbmV3U2NoZW1hID0gbmV3IFNjaGVtYShuZXdGb3JtLCBWMiwgbnVsbCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFibGVQcmVmaXggPSAnYWNjb3VudF8nICsgYWNjb3VudC5yb3dJRCArICdfJztcblxuICAgIGNvbnN0IGRpZmZlciA9IG5ldyBTY2hlbWFEaWZmZXIob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuXG4gICAgY29uc3QgbWV0YSA9IG5ldyBNZXRhZGF0YShkaWZmZXIsIHt0YWJsZVByZWZpeCwgcXVvdGU6ICdgJywgaW5jbHVkZUNvbHVtbnM6IHRydWV9KTtcblxuICAgIGNvbnN0IGdlbmVyYXRvciA9IG5ldyBTcWxpdGUoZGlmZmVyLCB7YWZ0ZXJUcmFuc2Zvcm06IG1ldGEuYnVpbGQuYmluZChtZXRhKX0pO1xuXG4gICAgZ2VuZXJhdG9yLnRhYmxlUHJlZml4ID0gdGFibGVQcmVmaXg7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gZ2VuZXJhdG9yLmdlbmVyYXRlKCk7XG5cbiAgICBhd2FpdCBhY2NvdW50LmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYikgPT4ge1xuICAgICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2Ygc3RhdGVtZW50cykge1xuICAgICAgICBhd2FpdCBkYi5leGVjdXRlKHN0YXRlbWVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxufVxuIl19