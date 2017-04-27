'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _migration = require('./migration');

var _migration2 = _interopRequireDefault(_migration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CURRENT_VERSION = 1;

class Migrations {
  static get currentVersion() {
    return CURRENT_VERSION;
  }

  constructor(db) {
    this.db = db;
  }

  executeMigrations() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const methods = [];
      const versions = [];

      let upgrade = true;

      if (_this.version !== CURRENT_VERSION) {
        if (_this.version > CURRENT_VERSION) {
          for (let i = _this.version; i > CURRENT_VERSION + 1; --i) {
            versions.push(i);
          }
          upgrade = false;
        } else {
          for (let i = _this.version + 1; i < CURRENT_VERSION + 1; ++i) {
            versions.push(i);
          }
        }
      }

      if (versions.length > 0) {
        for (let version of versions) {
          yield _this.runMigration(version, upgrade);
        }
      }

      return methods;
    })();
  }

  runMigration(version, upgrade) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let versionName = '000' + version.toString();

      versionName = versionName.slice(-3);

      const newVersion = upgrade ? version : version - 1;

      yield _this2.db.execute('BEGIN TRANSACTION');

      const migration = new _migration2.default(_this2.db, versionName);

      if (upgrade) {
        _this2.log('\nUpgrading database to version ' + version + '\n');
        yield migration.up();
        _this2.log('\nUpgraded database to version ' + version + '\n');
      } else {
        _this2.log('\nDowngrading database to version ' + newVersion + '\n');
        yield migration.down();
        _this2.log('\nDowngraded database to version ' + newVersion);
      }

      yield _this2.updateDatabaseVersion(newVersion);

      yield _this2.db.execute('COMMIT TRANSACTION');
    })();
  }

  updateDatabaseVersion(version) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3.db.execute("UPDATE metadata SET value = '" + version + "' WHERE key = 'database_version'", null);
    })();
  }

  log(message) {
    if (this.db.verbose) {
      return console.log(message);
    }

    return null;
  }

  migrate() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      yield _this4.createMetadataTable();
      yield _this4.getDatabaseVersion();
      yield _this4.executeMigrations();
    })();
  }

  getDatabaseVersion() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const result = yield _this5.db.get("SELECT key, value FROM metadata WHERE key = 'database_version'");
      _this5.version = result ? +result.value : 0;
    })();
  }

  createMetadataTable() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      yield _this6.db.execute('CREATE TABLE IF NOT EXISTS metadata (key TEXT, value TEXT)', null);
      yield _this6.db.execute("INSERT INTO metadata (key, value) SELECT 'database_version', 0 WHERE NOT EXISTS (SELECT 1 FROM metadata WHERE key = 'database_version')", null);
    })();
  }
}
exports.default = Migrations;
//# sourceMappingURL=migrations.js.map