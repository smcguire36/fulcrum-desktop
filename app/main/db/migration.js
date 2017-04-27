'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const readFile = _bluebird2.default.promisify(_fs2.default.readFile);

class Migration {
  constructor(db, versionName) {
    this.db = db;
    this.versionName = versionName;
  }

  executeMigrationSQL(suffix) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const dialect = '.' + _this.db.dialect;

      const fileName = './src/db/migrations/version_' + _this.versionName + '.' + suffix + dialect + '.sql';

      const data = yield readFile(fileName, { encoding: 'utf8' });

      const sql = [];

      for (let part of data.split('\n\n')) {
        if (part.trim().length && part.trim().substring(0, 2) !== '--') {
          sql.push(part.trim());
        }
      }

      if (sql.length === 0) {
        return [];
      }

      const results = [];

      for (let script of sql) {
        if (_this.db.verbose) {
          console.log(script, '\n');
        }

        results.push((yield _this.db.execute(script)));
      }

      return results;
    })();
  }

  executeUpgradeSQL() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return yield _this2.executeMigrationSQL('up');
    })();
  }

  executeDowngradeSQL() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return yield _this3.executeMigrationSQL('down');
    })();
  }

  up() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return yield _this4.executeUpgradeSQL();
    })();
  }

  down() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return yield _this5.executeDowngradeSQL();
    })();
  }
}
exports.default = Migration;
//# sourceMappingURL=migration.js.map