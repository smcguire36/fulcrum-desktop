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

var _sqliteRecordValues = require('../../models/record-values/sqlite-record-values');

var _sqliteRecordValues2 = _interopRequireDefault(_sqliteRecordValues);

var _schema = require('fulcrum-schema/dist/schema');

var _schema2 = _interopRequireDefault(_schema);

var _sqldiff = require('sqldiff');

var _sqldiff2 = _interopRequireDefault(_sqldiff);

var _postgresQueryV = require('fulcrum-schema/dist/schemas/postgres-query-v2');

var _postgresQueryV2 = _interopRequireDefault(_postgresQueryV);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { SchemaDiffer, Sqlite, Postgres } = _sqldiff2.default;

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

        const newForm = { row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON };

        yield account.db.execute((0, _util.format)('DROP VIEW IF EXISTS %s', account.db.ident(object.name)));

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

      let generator = null;

      if (account.db.dialect === 'sqlite') {
        generator = new Sqlite(differ, { afterTransform: null });
      } else if (account.db.dialect === 'postgresql') {
        generator = new Postgres(differ, { afterTransform: null });
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtZm9ybXMuanMiXSwibmFtZXMiOlsiU2NoZW1hRGlmZmVyIiwiU3FsaXRlIiwiUG9zdGdyZXMiLCJEb3dubG9hZEZvcm1zIiwicnVuIiwiYWNjb3VudCIsImRhdGFTb3VyY2UiLCJzeW5jIiwiY2hlY2tTeW5jU3RhdGUiLCJuZWVkc1VwZGF0ZSIsInByb2dyZXNzIiwibWVzc2FnZSIsImRvd25sb2FkaW5nIiwicmVzcG9uc2UiLCJnZXRGb3JtcyIsIm9iamVjdHMiLCJKU09OIiwicGFyc2UiLCJib2R5IiwiZm9ybXMiLCJwcm9jZXNzaW5nIiwiY291bnQiLCJ0b3RhbCIsImxlbmd0aCIsImxvY2FsT2JqZWN0cyIsImZpbmRGb3JtcyIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImluZGV4IiwiYXR0cmlidXRlcyIsIm9iamVjdCIsImZpbmRPckNyZWF0ZSIsImRiIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCIsIm9sZEZvcm0iLCJpc1BlcnNpc3RlZCIsIl9pZCIsInJvd19pZCIsIm5hbWUiLCJfbmFtZSIsImVsZW1lbnRzIiwiX2VsZW1lbnRzSlNPTiIsImlzQ2hhbmdlZCIsInZlcnNpb24iLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsIl9kZWxldGVkQXQiLCJzYXZlIiwibmV3Rm9ybSIsImV4ZWN1dGUiLCJpZGVudCIsInN0YXRlbWVudHMiLCJ1cGRhdGVGb3JtVGFibGVzIiwidHJpZ2dlciIsImZvcm0iLCJ1cGRhdGUiLCJzb3VyY2UiLCJpbnZhbGlkYXRlIiwiZmluaXNoZWQiLCJvbGRTY2hlbWEiLCJuZXdTY2hlbWEiLCJkaWZmZXIiLCJnZW5lcmF0b3IiLCJkaWFsZWN0IiwiYWZ0ZXJUcmFuc2Zvcm0iLCJ0YWJsZVByZWZpeCIsImdlbmVyYXRlIiwidHJhbnNhY3Rpb24iLCJzdGF0ZW1lbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7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VUFBVUksUUFBVixFQUFuQjs7QUFFQSxZQUFNOUQsUUFBUTBCLEVBQVIsQ0FBV3FDLFdBQVg7QUFBQSxxQ0FBdUIsV0FBT3JDLEVBQVAsRUFBYztBQUN6QyxlQUFLLE1BQU1zQyxTQUFYLElBQXdCakIsVUFBeEIsRUFBb0M7QUFDbEMsa0JBQU1yQixHQUFHbUIsT0FBSCxDQUFXbUIsU0FBWCxDQUFOO0FBQ0Q7QUFDRixTQUpLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQU47O0FBTUEsYUFBT2pCLFVBQVA7QUFoQ2dEO0FBaUNqRDtBQXZHNkM7a0JBQTNCakQsYSIsImZpbGUiOiJkb3dubG9hZC1mb3Jtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IEZvcm0gZnJvbSAnLi4vLi4vbW9kZWxzL2Zvcm0nO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IFNRTGl0ZVJlY29yZFZhbHVlcyBmcm9tICcuLi8uLi9tb2RlbHMvcmVjb3JkLXZhbHVlcy9zcWxpdGUtcmVjb3JkLXZhbHVlcyc7XG5cbmltcG9ydCBTY2hlbWEgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWEnO1xuaW1wb3J0IHNxbGRpZmYgZnJvbSAnc3FsZGlmZic7XG5pbXBvcnQgVjIgZnJvbSAnZnVsY3J1bS1zY2hlbWEvZGlzdC9zY2hlbWFzL3Bvc3RncmVzLXF1ZXJ5LXYyJztcblxuY29uc3Qge1NjaGVtYURpZmZlciwgU3FsaXRlLCBQb3N0Z3Jlc30gPSBzcWxkaWZmO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZEZvcm1zIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzeW5jID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCAnZm9ybXMnKTtcblxuICAgIGlmICghc3luYy5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnIGZvcm1zJ30pO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBDbGllbnQuZ2V0Rm9ybXMoYWNjb3VudCk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5mb3JtcztcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgZm9ybXMnLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBjb25zdCBsb2NhbE9iamVjdHMgPSBhd2FpdCBhY2NvdW50LmZpbmRGb3JtcygpO1xuXG4gICAgdGhpcy5tYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBvYmplY3RzKTtcblxuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCBGb3JtLmZpbmRPckNyZWF0ZShhY2NvdW50LmRiLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IGFjY291bnQucm93SUR9KTtcblxuICAgICAgbGV0IG9sZEZvcm0gPSBudWxsO1xuXG4gICAgICBpZiAob2JqZWN0LmlzUGVyc2lzdGVkKSB7XG4gICAgICAgIG9sZEZvcm0gPSB7XG4gICAgICAgICAgaWQ6IG9iamVjdC5faWQsXG4gICAgICAgICAgcm93X2lkOiBvYmplY3Qucm93SUQsXG4gICAgICAgICAgbmFtZTogb2JqZWN0Ll9uYW1lLFxuICAgICAgICAgIGVsZW1lbnRzOiBvYmplY3QuX2VsZW1lbnRzSlNPTlxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpc0NoYW5nZWQgPSAhb2JqZWN0LmlzUGVyc2lzdGVkIHx8IGF0dHJpYnV0ZXMudmVyc2lvbiAhPT0gb2JqZWN0LnZlcnNpb247XG5cbiAgICAgIG9iamVjdC51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gbnVsbDtcblxuICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgY29uc3QgbmV3Rm9ybSA9IHtyb3dfaWQ6IG9iamVjdC5yb3dJRCxcbiAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogb2JqZWN0Ll9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50czogb2JqZWN0Ll9lbGVtZW50c0pTT059O1xuXG4gICAgICBhd2FpdCBhY2NvdW50LmRiLmV4ZWN1dGUoZm9ybWF0KCdEUk9QIFZJRVcgSUYgRVhJU1RTICVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWNjb3VudC5kYi5pZGVudChvYmplY3QubmFtZSkpKTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50cyA9IGF3YWl0IHRoaXMudXBkYXRlRm9ybVRhYmxlcyhhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtKTtcblxuICAgICAgLy8gYXdhaXQgYWNjb3VudC5kYi5leGVjdXRlKGZvcm1hdCgnQ1JFQVRFIFZJRVcgJXMgQVMgU0VMRUNUICogRlJPTSAlc192aWV3X2Z1bGwnLFxuICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY2NvdW50LmRiLmlkZW50KG9iamVjdC5uYW1lKSxcbiAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU1FMaXRlUmVjb3JkVmFsdWVzLnRhYmxlTmFtZVdpdGhGb3JtKG9iamVjdCkpKTtcblxuICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoJ2Zvcm06c2F2ZScsIHtmb3JtOiBvYmplY3QsIGFjY291bnQsIHN0YXRlbWVudHMsIG9sZEZvcm0sIG5ld0Zvcm19KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyBmb3JtcycsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgIH1cblxuICAgIGF3YWl0IHN5bmMudXBkYXRlKCk7XG5cbiAgICBkYXRhU291cmNlLnNvdXJjZS5pbnZhbGlkYXRlKCdmb3JtcycpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5maW5pc2hlZCArICcgZm9ybXMnLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRm9ybVRhYmxlcyhhY2NvdW50LCBvbGRGb3JtLCBuZXdGb3JtKSB7XG4gICAgbGV0IG9sZFNjaGVtYSA9IG51bGw7XG4gICAgbGV0IG5ld1NjaGVtYSA9IG51bGw7XG5cbiAgICBpZiAob2xkRm9ybSkge1xuICAgICAgb2xkU2NoZW1hID0gbmV3IFNjaGVtYShvbGRGb3JtLCBWMiwgbnVsbCk7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Zvcm0pIHtcbiAgICAgIG5ld1NjaGVtYSA9IG5ldyBTY2hlbWEobmV3Rm9ybSwgVjIsIG51bGwpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpZmZlciA9IG5ldyBTY2hlbWFEaWZmZXIob2xkU2NoZW1hLCBuZXdTY2hlbWEpO1xuXG4gICAgbGV0IGdlbmVyYXRvciA9IG51bGw7XG5cbiAgICBpZiAoYWNjb3VudC5kYi5kaWFsZWN0ID09PSAnc3FsaXRlJykge1xuICAgICAgZ2VuZXJhdG9yID0gbmV3IFNxbGl0ZShkaWZmZXIsIHthZnRlclRyYW5zZm9ybTogbnVsbH0pO1xuICAgIH0gZWxzZSBpZiAoYWNjb3VudC5kYi5kaWFsZWN0ID09PSAncG9zdGdyZXNxbCcpIHtcbiAgICAgIGdlbmVyYXRvciA9IG5ldyBQb3N0Z3JlcyhkaWZmZXIsIHthZnRlclRyYW5zZm9ybTogbnVsbH0pO1xuICAgIH1cblxuICAgIGdlbmVyYXRvci50YWJsZVByZWZpeCA9ICdhY2NvdW50XycgKyBhY2NvdW50LnJvd0lEICsgJ18nO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IGdlbmVyYXRvci5nZW5lcmF0ZSgpO1xuXG4gICAgYXdhaXQgYWNjb3VudC5kYi50cmFuc2FjdGlvbihhc3luYyAoZGIpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHN0YXRlbWVudHMpIHtcbiAgICAgICAgYXdhaXQgZGIuZXhlY3V0ZShzdGF0ZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cbn1cbiJdfQ==