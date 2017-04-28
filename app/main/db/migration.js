'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _version_ = require('./migrations/version_001');

var _version_2 = _interopRequireDefault(_version_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const MIGRATIONS = {
  '001': _version_2.default
};

class Migration {
  constructor(db, versionName) {
    this.db = db;
    this.versionName = versionName;
  }

  executeMigrationSQL(suffix) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = MIGRATIONS[_this.versionName];

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