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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbnMuanMiXSwibmFtZXMiOlsiQ1VSUkVOVF9WRVJTSU9OIiwiTWlncmF0aW9ucyIsImN1cnJlbnRWZXJzaW9uIiwiY29uc3RydWN0b3IiLCJkYiIsImV4ZWN1dGVNaWdyYXRpb25zIiwibWV0aG9kcyIsInZlcnNpb25zIiwidXBncmFkZSIsInZlcnNpb24iLCJpIiwicHVzaCIsImxlbmd0aCIsInJ1bk1pZ3JhdGlvbiIsInZlcnNpb25OYW1lIiwidG9TdHJpbmciLCJzbGljZSIsIm5ld1ZlcnNpb24iLCJleGVjdXRlIiwibWlncmF0aW9uIiwibG9nIiwidXAiLCJkb3duIiwidXBkYXRlRGF0YWJhc2VWZXJzaW9uIiwibWVzc2FnZSIsInByb2Nlc3MiLCJlbnYiLCJGVUxDUlVNX0RFQlVHIiwiY29uc29sZSIsIm1pZ3JhdGUiLCJjcmVhdGVNZXRhZGF0YVRhYmxlIiwiZ2V0RGF0YWJhc2VWZXJzaW9uIiwicmVzdWx0IiwiZ2V0IiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixDQUF4Qjs7QUFFZSxNQUFNQyxVQUFOLENBQWlCO0FBQzlCLGFBQVdDLGNBQVgsR0FBNEI7QUFDMUIsV0FBT0YsZUFBUDtBQUNEOztBQUVERyxjQUFZQyxFQUFaLEVBQWdCO0FBQ2QsU0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0Q7O0FBRUtDLG1CQUFOLEdBQTBCO0FBQUE7O0FBQUE7QUFDeEIsWUFBTUMsVUFBVSxFQUFoQjtBQUNBLFlBQU1DLFdBQVcsRUFBakI7O0FBRUEsVUFBSUMsVUFBVSxJQUFkOztBQUVBLFVBQUksTUFBS0MsT0FBTCxLQUFpQlQsZUFBckIsRUFBc0M7QUFDcEMsWUFBSSxNQUFLUyxPQUFMLEdBQWVULGVBQW5CLEVBQW9DO0FBQ2xDLGVBQUssSUFBSVUsSUFBSSxNQUFLRCxPQUFsQixFQUEyQkMsSUFBSVYsa0JBQWtCLENBQWpELEVBQW9ELEVBQUVV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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1pZ3JhdGlvbiBmcm9tICcuL21pZ3JhdGlvbic7XHJcblxyXG5jb25zdCBDVVJSRU5UX1ZFUlNJT04gPSAzO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlncmF0aW9ucyB7XHJcbiAgc3RhdGljIGdldCBjdXJyZW50VmVyc2lvbigpIHtcclxuICAgIHJldHVybiBDVVJSRU5UX1ZFUlNJT047XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihkYikge1xyXG4gICAgdGhpcy5kYiA9IGRiO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZXhlY3V0ZU1pZ3JhdGlvbnMoKSB7XHJcbiAgICBjb25zdCBtZXRob2RzID0gW107XHJcbiAgICBjb25zdCB2ZXJzaW9ucyA9IFtdO1xyXG5cclxuICAgIGxldCB1cGdyYWRlID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAodGhpcy52ZXJzaW9uICE9PSBDVVJSRU5UX1ZFUlNJT04pIHtcclxuICAgICAgaWYgKHRoaXMudmVyc2lvbiA+IENVUlJFTlRfVkVSU0lPTikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLnZlcnNpb247IGkgPiBDVVJSRU5UX1ZFUlNJT04gKyAxOyAtLWkpIHtcclxuICAgICAgICAgIHZlcnNpb25zLnB1c2goaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVwZ3JhZGUgPSBmYWxzZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy52ZXJzaW9uICsgMTsgaSA8IENVUlJFTlRfVkVSU0lPTiArIDE7ICsraSkge1xyXG4gICAgICAgICAgdmVyc2lvbnMucHVzaChpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodmVyc2lvbnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBmb3IgKGxldCB2ZXJzaW9uIG9mIHZlcnNpb25zKSB7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5ydW5NaWdyYXRpb24odmVyc2lvbiwgdXBncmFkZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWV0aG9kcztcclxuICB9XHJcblxyXG4gIGFzeW5jIHJ1bk1pZ3JhdGlvbih2ZXJzaW9uLCB1cGdyYWRlKSB7XHJcbiAgICBsZXQgdmVyc2lvbk5hbWUgPSAnMDAwJyArIHZlcnNpb24udG9TdHJpbmcoKTtcclxuXHJcbiAgICB2ZXJzaW9uTmFtZSA9IHZlcnNpb25OYW1lLnNsaWNlKC0zKTtcclxuXHJcbiAgICBjb25zdCBuZXdWZXJzaW9uID0gdXBncmFkZSA/IHZlcnNpb24gOiB2ZXJzaW9uIC0gMTtcclxuXHJcbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoJ0JFR0lOIFRSQU5TQUNUSU9OJyk7XHJcblxyXG4gICAgY29uc3QgbWlncmF0aW9uID0gbmV3IE1pZ3JhdGlvbih0aGlzLmRiLCB2ZXJzaW9uTmFtZSk7XHJcblxyXG4gICAgaWYgKHVwZ3JhZGUpIHtcclxuICAgICAgdGhpcy5sb2coJ1xcblVwZ3JhZGluZyBkYXRhYmFzZSB0byB2ZXJzaW9uICcgKyB2ZXJzaW9uICsgJ1xcbicpO1xyXG4gICAgICBhd2FpdCBtaWdyYXRpb24udXAoKTtcclxuICAgICAgdGhpcy5sb2coJ1xcblVwZ3JhZGVkIGRhdGFiYXNlIHRvIHZlcnNpb24gJyArIHZlcnNpb24gKyAnXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxvZygnXFxuRG93bmdyYWRpbmcgZGF0YWJhc2UgdG8gdmVyc2lvbiAnICsgbmV3VmVyc2lvbiArICdcXG4nKTtcclxuICAgICAgYXdhaXQgbWlncmF0aW9uLmRvd24oKTtcclxuICAgICAgdGhpcy5sb2coJ1xcbkRvd25ncmFkZWQgZGF0YWJhc2UgdG8gdmVyc2lvbiAnICsgbmV3VmVyc2lvbik7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgdGhpcy51cGRhdGVEYXRhYmFzZVZlcnNpb24obmV3VmVyc2lvbik7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKCdDT01NSVQgVFJBTlNBQ1RJT04nKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHVwZGF0ZURhdGFiYXNlVmVyc2lvbih2ZXJzaW9uKSB7XHJcbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoXCJVUERBVEUgbWV0YWRhdGEgU0VUIHZhbHVlID0gJ1wiICsgdmVyc2lvbiArIFwiJyBXSEVSRSBrZXkgPSAnZGF0YWJhc2VfdmVyc2lvbidcIiwgbnVsbCk7XHJcbiAgfVxyXG5cclxuICBsb2cobWVzc2FnZSkge1xyXG4gICAgaWYgKHByb2Nlc3MuZW52LkZVTENSVU1fREVCVUcpIHtcclxuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBtaWdyYXRlKCkge1xyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVNZXRhZGF0YVRhYmxlKCk7XHJcbiAgICBhd2FpdCB0aGlzLmdldERhdGFiYXNlVmVyc2lvbigpO1xyXG4gICAgYXdhaXQgdGhpcy5leGVjdXRlTWlncmF0aW9ucygpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZ2V0RGF0YWJhc2VWZXJzaW9uKCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5kYi5nZXQoXCJTRUxFQ1Qga2V5LCB2YWx1ZSBGUk9NIG1ldGFkYXRhIFdIRVJFIGtleSA9ICdkYXRhYmFzZV92ZXJzaW9uJ1wiKTtcclxuICAgIHRoaXMudmVyc2lvbiA9IHJlc3VsdCA/ICtyZXN1bHQudmFsdWUgOiAwO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgY3JlYXRlTWV0YWRhdGFUYWJsZSgpIHtcclxuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZSgnQ1JFQVRFIFRBQkxFIElGIE5PVCBFWElTVFMgbWV0YWRhdGEgKGtleSBURVhULCB2YWx1ZSBURVhUKScsIG51bGwpO1xyXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKFwiSU5TRVJUIElOVE8gbWV0YWRhdGEgKGtleSwgdmFsdWUpIFNFTEVDVCAnZGF0YWJhc2VfdmVyc2lvbicsIDAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBtZXRhZGF0YSBXSEVSRSBrZXkgPSAnZGF0YWJhc2VfdmVyc2lvbicpXCIsIG51bGwpO1xyXG4gIH1cclxufVxyXG4iXX0=