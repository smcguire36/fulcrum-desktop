'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _Client = require('../../api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _form = require('../../models/form');

var _form2 = _interopRequireDefault(_form);

var _util = require('util');

var _recordValues = require('../../record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

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

      const response = yield _Client2.default.getForms(account);

      const objects = JSON.parse(response.body).forms;

      _this.progress({ message: _this.processing + ' forms', count: 0, total: objects.length });

      const localForms = yield account.findForms({});

      // delete all forms that don't exist on the server anymore
      for (const form of localForms) {
        let formExistsOnServer = false;

        for (const attributes of objects) {
          if (attributes.id === form.id) {
            formExistsOnServer = true;
            break;
          }
        }

        if (!formExistsOnServer) {
          form._deletedAt = form._deletedAt ? form._deletedAt : new Date();
          yield form.save();
        }
      }

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

        yield object.save();

        const newForm = { row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON };

        yield account.db.execute((0, _util.format)('DROP VIEW IF EXISTS %s', account.db.ident(object.name)));

        const statements = yield _this.updateFormTables(account, oldForm, newForm);

        yield account.db.execute((0, _util.format)('CREATE VIEW %s AS SELECT * FROM %s_view_full', account.db.ident(object.name), _recordValues2.default.tableNameWithForm(object)));

        if (isChanged) {
          yield _this.trigger('form:save', { form: object, account, statements, oldForm, newForm });
        }

        _this.progress({ message: _this.processing + ' forms', count: index + 1, total: objects.length });
      }

      yield sync.update();

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
//# sourceMappingURL=download-forms.js.map