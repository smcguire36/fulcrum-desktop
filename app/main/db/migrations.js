'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _migration = require('./migration');

var _migration2 = _interopRequireDefault(_migration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const CURRENT_VERSION = 3;

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
    if (process.env.FULCRUM_DEBUG) {
      console.log(message);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbnMuanMiXSwibmFtZXMiOlsiQ1VSUkVOVF9WRVJTSU9OIiwiTWlncmF0aW9ucyIsImN1cnJlbnRWZXJzaW9uIiwiY29uc3RydWN0b3IiLCJkYiIsImV4ZWN1dGVNaWdyYXRpb25zIiwibWV0aG9kcyIsInZlcnNpb25zIiwidXBncmFkZSIsInZlcnNpb24iLCJpIiwicHVzaCIsImxlbmd0aCIsInJ1bk1pZ3JhdGlvbiIsInZlcnNpb25OYW1lIiwidG9TdHJpbmciLCJzbGljZSIsIm5ld1ZlcnNpb24iLCJleGVjdXRlIiwibWlncmF0aW9uIiwibG9nIiwidXAiLCJkb3duIiwidXBkYXRlRGF0YWJhc2VWZXJzaW9uIiwibWVzc2FnZSIsInByb2Nlc3MiLCJlbnYiLCJGVUxDUlVNX0RFQlVHIiwiY29uc29sZSIsIm1pZ3JhdGUiLCJjcmVhdGVNZXRhZGF0YVRhYmxlIiwiZ2V0RGF0YWJhc2VWZXJzaW9uIiwicmVzdWx0IiwiZ2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixDQUF4Qjs7QUFFZSxNQUFNQyxVQUFOLENBQWlCO0FBQzlCLGFBQVdDLGNBQVgsR0FBNEI7QUFDMUIsV0FBT0YsZUFBUDtBQUNEOztBQUVERyxjQUFZQyxFQUFaLEVBQWdCO0FBQ2QsU0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0Q7O0FBRUtDLG1CQUFOLEdBQTBCO0FBQUE7O0FBQUE7QUFDeEIsWUFBTUMsVUFBVSxFQUFoQjtBQUNBLFlBQU1DLFdBQVcsRUFBakI7O0FBRUEsVUFBSUMsVUFBVSxJQUFkOztBQUVBLFVBQUksTUFBS0MsT0FBTCxLQUFpQlQsZUFBckIsRUFBc0M7QUFDcEMsWUFBSSxNQUFLUyxPQUFMLEdBQWVULGVBQW5CLEVBQW9DO0FBQ2xDLGVBQUssSUFBSVUsSUFBSSxNQUFLRCxPQUFsQixFQUEyQkMsSUFBSVYsa0JBQWtCLENBQWpELEVBQW9ELEVBQUVV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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1pZ3JhdGlvbiBmcm9tICcuL21pZ3JhdGlvbic7XG5cbmNvbnN0IENVUlJFTlRfVkVSU0lPTiA9IDM7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZ3JhdGlvbnMge1xuICBzdGF0aWMgZ2V0IGN1cnJlbnRWZXJzaW9uKCkge1xuICAgIHJldHVybiBDVVJSRU5UX1ZFUlNJT047XG4gIH1cblxuICBjb25zdHJ1Y3RvcihkYikge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVNaWdyYXRpb25zKCkge1xuICAgIGNvbnN0IG1ldGhvZHMgPSBbXTtcbiAgICBjb25zdCB2ZXJzaW9ucyA9IFtdO1xuXG4gICAgbGV0IHVwZ3JhZGUgPSB0cnVlO1xuXG4gICAgaWYgKHRoaXMudmVyc2lvbiAhPT0gQ1VSUkVOVF9WRVJTSU9OKSB7XG4gICAgICBpZiAodGhpcy52ZXJzaW9uID4gQ1VSUkVOVF9WRVJTSU9OKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnZlcnNpb247IGkgPiBDVVJSRU5UX1ZFUlNJT04gKyAxOyAtLWkpIHtcbiAgICAgICAgICB2ZXJzaW9ucy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHVwZ3JhZGUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnZlcnNpb24gKyAxOyBpIDwgQ1VSUkVOVF9WRVJTSU9OICsgMTsgKytpKSB7XG4gICAgICAgICAgdmVyc2lvbnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2ZXJzaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGxldCB2ZXJzaW9uIG9mIHZlcnNpb25zKSB7XG4gICAgICAgIGF3YWl0IHRoaXMucnVuTWlncmF0aW9uKHZlcnNpb24sIHVwZ3JhZGUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtZXRob2RzO1xuICB9XG5cbiAgYXN5bmMgcnVuTWlncmF0aW9uKHZlcnNpb24sIHVwZ3JhZGUpIHtcbiAgICBsZXQgdmVyc2lvbk5hbWUgPSAnMDAwJyArIHZlcnNpb24udG9TdHJpbmcoKTtcblxuICAgIHZlcnNpb25OYW1lID0gdmVyc2lvbk5hbWUuc2xpY2UoLTMpO1xuXG4gICAgY29uc3QgbmV3VmVyc2lvbiA9IHVwZ3JhZGUgPyB2ZXJzaW9uIDogdmVyc2lvbiAtIDE7XG5cbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoJ0JFR0lOIFRSQU5TQUNUSU9OJyk7XG5cbiAgICBjb25zdCBtaWdyYXRpb24gPSBuZXcgTWlncmF0aW9uKHRoaXMuZGIsIHZlcnNpb25OYW1lKTtcblxuICAgIGlmICh1cGdyYWRlKSB7XG4gICAgICB0aGlzLmxvZygnXFxuVXBncmFkaW5nIGRhdGFiYXNlIHRvIHZlcnNpb24gJyArIHZlcnNpb24gKyAnXFxuJyk7XG4gICAgICBhd2FpdCBtaWdyYXRpb24udXAoKTtcbiAgICAgIHRoaXMubG9nKCdcXG5VcGdyYWRlZCBkYXRhYmFzZSB0byB2ZXJzaW9uICcgKyB2ZXJzaW9uICsgJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZygnXFxuRG93bmdyYWRpbmcgZGF0YWJhc2UgdG8gdmVyc2lvbiAnICsgbmV3VmVyc2lvbiArICdcXG4nKTtcbiAgICAgIGF3YWl0IG1pZ3JhdGlvbi5kb3duKCk7XG4gICAgICB0aGlzLmxvZygnXFxuRG93bmdyYWRlZCBkYXRhYmFzZSB0byB2ZXJzaW9uICcgKyBuZXdWZXJzaW9uKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnVwZGF0ZURhdGFiYXNlVmVyc2lvbihuZXdWZXJzaW9uKTtcblxuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZSgnQ09NTUlUIFRSQU5TQUNUSU9OJyk7XG4gIH1cblxuICBhc3luYyB1cGRhdGVEYXRhYmFzZVZlcnNpb24odmVyc2lvbikge1xuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShcIlVQREFURSBtZXRhZGF0YSBTRVQgdmFsdWUgPSAnXCIgKyB2ZXJzaW9uICsgXCInIFdIRVJFIGtleSA9ICdkYXRhYmFzZV92ZXJzaW9uJ1wiLCBudWxsKTtcbiAgfVxuXG4gIGxvZyhtZXNzYWdlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52LkZVTENSVU1fREVCVUcpIHtcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1pZ3JhdGUoKSB7XG4gICAgYXdhaXQgdGhpcy5jcmVhdGVNZXRhZGF0YVRhYmxlKCk7XG4gICAgYXdhaXQgdGhpcy5nZXREYXRhYmFzZVZlcnNpb24oKTtcbiAgICBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25zKCk7XG4gIH1cblxuICBhc3luYyBnZXREYXRhYmFzZVZlcnNpb24oKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5kYi5nZXQoXCJTRUxFQ1Qga2V5LCB2YWx1ZSBGUk9NIG1ldGFkYXRhIFdIRVJFIGtleSA9ICdkYXRhYmFzZV92ZXJzaW9uJ1wiKTtcbiAgICB0aGlzLnZlcnNpb24gPSByZXN1bHQgPyArcmVzdWx0LnZhbHVlIDogMDtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZU1ldGFkYXRhVGFibGUoKSB7XG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKCdDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBtZXRhZGF0YSAoa2V5IFRFWFQsIHZhbHVlIFRFWFQpJywgbnVsbCk7XG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKFwiSU5TRVJUIElOVE8gbWV0YWRhdGEgKGtleSwgdmFsdWUpIFNFTEVDVCAnZGF0YWJhc2VfdmVyc2lvbicsIDAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBtZXRhZGF0YSBXSEVSRSBrZXkgPSAnZGF0YWJhc2VfdmVyc2lvbicpXCIsIG51bGwpO1xuICB9XG59XG4iXX0=