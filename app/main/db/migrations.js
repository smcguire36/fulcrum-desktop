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
    return console.log(message);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbnMuanMiXSwibmFtZXMiOlsiQ1VSUkVOVF9WRVJTSU9OIiwiTWlncmF0aW9ucyIsImN1cnJlbnRWZXJzaW9uIiwiY29uc3RydWN0b3IiLCJkYiIsImV4ZWN1dGVNaWdyYXRpb25zIiwibWV0aG9kcyIsInZlcnNpb25zIiwidXBncmFkZSIsInZlcnNpb24iLCJpIiwicHVzaCIsImxlbmd0aCIsInJ1bk1pZ3JhdGlvbiIsInZlcnNpb25OYW1lIiwidG9TdHJpbmciLCJzbGljZSIsIm5ld1ZlcnNpb24iLCJleGVjdXRlIiwibWlncmF0aW9uIiwibG9nIiwidXAiLCJkb3duIiwidXBkYXRlRGF0YWJhc2VWZXJzaW9uIiwibWVzc2FnZSIsImNvbnNvbGUiLCJtaWdyYXRlIiwiY3JlYXRlTWV0YWRhdGFUYWJsZSIsImdldERhdGFiYXNlVmVyc2lvbiIsInJlc3VsdCIsImdldCIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7QUFFQSxNQUFNQSxrQkFBa0IsQ0FBeEI7O0FBRWUsTUFBTUMsVUFBTixDQUFpQjtBQUM5QixhQUFXQyxjQUFYLEdBQTRCO0FBQzFCLFdBQU9GLGVBQVA7QUFDRDs7QUFFREcsY0FBWUMsRUFBWixFQUFnQjtBQUNkLFNBQUtBLEVBQUwsR0FBVUEsRUFBVjtBQUNEOztBQUVLQyxtQkFBTixHQUEwQjtBQUFBOztBQUFBO0FBQ3hCLFlBQU1DLFVBQVUsRUFBaEI7QUFDQSxZQUFNQyxXQUFXLEVBQWpCOztBQUVBLFVBQUlDLFVBQVUsSUFBZDs7QUFFQSxVQUFJLE1BQUtDLE9BQUwsS0FBaUJULGVBQXJCLEVBQXNDO0FBQ3BDLFlBQUksTUFBS1MsT0FBTCxHQUFlVCxlQUFuQixFQUFvQztBQUNsQyxlQUFLLElBQUlVLElBQUksTUFBS0QsT0FBbEIsRUFBMkJDLElBQUlWLGtCQUFrQixDQUFqRCxFQUFvRCxFQUFFVSxDQUF0RCxFQUF5RDtBQUN2REgscUJBQVNJLElBQVQsQ0FBY0QsQ0FBZDtBQUNEO0FBQ0RGLG9CQUFVLEtBQVY7QUFDRCxTQUxELE1BS087QUFDTCxlQUFLLElBQUlFLElBQUksTUFBS0QsT0FBTCxHQUFlLENBQTVCLEVBQStCQyxJQUFJVixrQkFBa0IsQ0FBckQsRUFBd0QsRUFBRVUsQ0FBMUQsRUFBNkQ7QUFDM0RILHFCQUFTSSxJQUFULENBQWNELENBQWQ7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsVUFBSUgsU0FBU0ssTUFBVCxHQUFrQixDQUF0QixFQUF5QjtBQUN2QixhQUFLLElBQUlILE9BQVQsSUFBb0JGLFFBQXBCLEVBQThCO0FBQzVCLGdCQUFNLE1BQUtNLFlBQUwsQ0FBa0JKLE9BQWxCLEVBQTJCRCxPQUEzQixDQUFOO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPRixPQUFQO0FBekJ3QjtBQTBCekI7O0FBRUtPLGNBQU4sQ0FBbUJKLE9BQW5CLEVBQTRCRCxPQUE1QixFQUFxQztBQUFBOztBQUFBO0FBQ25DLFVBQUlNLGNBQWMsUUFBUUwsUUFBUU0sUUFBUixFQUExQjs7QUFFQUQsb0JBQWNBLFlBQVlFLEtBQVosQ0FBa0IsQ0FBQyxDQUFuQixDQUFkOztBQUVBLFlBQU1DLGFBQWFULFVBQVVDLE9BQVYsR0FBb0JBLFVBQVUsQ0FBakQ7O0FBRUEsWUFBTSxPQUFLTCxFQUFMLENBQVFjLE9BQVIsQ0FBZ0IsbUJBQWhCLENBQU47O0FBRUEsWUFBTUMsWUFBWSx3QkFBYyxPQUFLZixFQUFuQixFQUF1QlUsV0FBdkIsQ0FBbEI7O0FBRUEsVUFBSU4sT0FBSixFQUFhO0FBQ1gsZUFBS1ksR0FBTCxDQUFTLHFDQUFxQ1gsT0FBckMsR0FBK0MsSUFBeEQ7QUFDQSxjQUFNVSxVQUFVRSxFQUFWLEVBQU47QUFDQSxlQUFLRCxHQUFMLENBQVMsb0NBQW9DWCxPQUFwQyxHQUE4QyxJQUF2RDtBQUNELE9BSkQsTUFJTztBQUNMLGVBQUtXLEdBQUwsQ0FBUyx1Q0FBdUNILFVBQXZDLEdBQW9ELElBQTdEO0FBQ0EsY0FBTUUsVUFBVUcsSUFBVixFQUFOO0FBQ0EsZUFBS0YsR0FBTCxDQUFTLHNDQUFzQ0gsVUFBL0M7QUFDRDs7QUFFRCxZQUFNLE9BQUtNLHFCQUFMLENBQTJCTixVQUEzQixDQUFOOztBQUVBLFlBQU0sT0FBS2IsRUFBTCxDQUFRYyxPQUFSLENBQWdCLG9CQUFoQixDQUFOO0FBdkJtQztBQXdCcEM7O0FBRUtLLHVCQUFOLENBQTRCZCxPQUE1QixFQUFxQztBQUFBOztBQUFBO0FBQ25DLFlBQU0sT0FBS0wsRUFBTCxDQUFRYyxPQUFSLENBQWdCLGtDQUFrQ1QsT0FBbEMsR0FBNEMsa0NBQTVELEVBQWdHLElBQWhHLENBQU47QUFEbUM7QUFFcEM7O0FBRURXLE1BQUlJLE9BQUosRUFBYTtBQUNYLFdBQU9DLFFBQVFMLEdBQVIsQ0FBWUksT0FBWixDQUFQO0FBQ0Q7O0FBRUtFLFNBQU4sR0FBZ0I7QUFBQTs7QUFBQTtBQUNkLFlBQU0sT0FBS0MsbUJBQUwsRUFBTjtBQUNBLFlBQU0sT0FBS0Msa0JBQUwsRUFBTjtBQUNBLFlBQU0sT0FBS3ZCLGlCQUFMLEVBQU47QUFIYztBQUlmOztBQUVLdUIsb0JBQU4sR0FBMkI7QUFBQTs7QUFBQTtBQUN6QixZQUFNQyxTQUFTLE1BQU0sT0FBS3pCLEVBQUwsQ0FBUTBCLEdBQVIsQ0FBWSxnRUFBWixDQUFyQjtBQUNBLGFBQUtyQixPQUFMLEdBQWVvQixTQUFTLENBQUNBLE9BQU9FLEtBQWpCLEdBQXlCLENBQXhDO0FBRnlCO0FBRzFCOztBQUVLSixxQkFBTixHQUE0QjtBQUFBOztBQUFBO0FBQzFCLFlBQU0sT0FBS3ZCLEVBQUwsQ0FBUWMsT0FBUixDQUFnQiw0REFBaEIsRUFBOEUsSUFBOUUsQ0FBTjtBQUNBLFlBQU0sT0FBS2QsRUFBTCxDQUFRYyxPQUFSLENBQWdCLHlJQUFoQixFQUEySixJQUEzSixDQUFOO0FBRjBCO0FBRzNCO0FBckY2QjtrQkFBWGpCLFUiLCJmaWxlIjoibWlncmF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNaWdyYXRpb24gZnJvbSAnLi9taWdyYXRpb24nO1xuXG5jb25zdCBDVVJSRU5UX1ZFUlNJT04gPSAzO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWdyYXRpb25zIHtcbiAgc3RhdGljIGdldCBjdXJyZW50VmVyc2lvbigpIHtcbiAgICByZXR1cm4gQ1VSUkVOVF9WRVJTSU9OO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZGIpIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gIH1cblxuICBhc3luYyBleGVjdXRlTWlncmF0aW9ucygpIHtcbiAgICBjb25zdCBtZXRob2RzID0gW107XG4gICAgY29uc3QgdmVyc2lvbnMgPSBbXTtcblxuICAgIGxldCB1cGdyYWRlID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLnZlcnNpb24gIT09IENVUlJFTlRfVkVSU0lPTikge1xuICAgICAgaWYgKHRoaXMudmVyc2lvbiA+IENVUlJFTlRfVkVSU0lPTikge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy52ZXJzaW9uOyBpID4gQ1VSUkVOVF9WRVJTSU9OICsgMTsgLS1pKSB7XG4gICAgICAgICAgdmVyc2lvbnMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgICB1cGdyYWRlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy52ZXJzaW9uICsgMTsgaSA8IENVUlJFTlRfVkVSU0lPTiArIDE7ICsraSkge1xuICAgICAgICAgIHZlcnNpb25zLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodmVyc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChsZXQgdmVyc2lvbiBvZiB2ZXJzaW9ucykge1xuICAgICAgICBhd2FpdCB0aGlzLnJ1bk1pZ3JhdGlvbih2ZXJzaW9uLCB1cGdyYWRlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWV0aG9kcztcbiAgfVxuXG4gIGFzeW5jIHJ1bk1pZ3JhdGlvbih2ZXJzaW9uLCB1cGdyYWRlKSB7XG4gICAgbGV0IHZlcnNpb25OYW1lID0gJzAwMCcgKyB2ZXJzaW9uLnRvU3RyaW5nKCk7XG5cbiAgICB2ZXJzaW9uTmFtZSA9IHZlcnNpb25OYW1lLnNsaWNlKC0zKTtcblxuICAgIGNvbnN0IG5ld1ZlcnNpb24gPSB1cGdyYWRlID8gdmVyc2lvbiA6IHZlcnNpb24gLSAxO1xuXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKCdCRUdJTiBUUkFOU0FDVElPTicpO1xuXG4gICAgY29uc3QgbWlncmF0aW9uID0gbmV3IE1pZ3JhdGlvbih0aGlzLmRiLCB2ZXJzaW9uTmFtZSk7XG5cbiAgICBpZiAodXBncmFkZSkge1xuICAgICAgdGhpcy5sb2coJ1xcblVwZ3JhZGluZyBkYXRhYmFzZSB0byB2ZXJzaW9uICcgKyB2ZXJzaW9uICsgJ1xcbicpO1xuICAgICAgYXdhaXQgbWlncmF0aW9uLnVwKCk7XG4gICAgICB0aGlzLmxvZygnXFxuVXBncmFkZWQgZGF0YWJhc2UgdG8gdmVyc2lvbiAnICsgdmVyc2lvbiArICdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sb2coJ1xcbkRvd25ncmFkaW5nIGRhdGFiYXNlIHRvIHZlcnNpb24gJyArIG5ld1ZlcnNpb24gKyAnXFxuJyk7XG4gICAgICBhd2FpdCBtaWdyYXRpb24uZG93bigpO1xuICAgICAgdGhpcy5sb2coJ1xcbkRvd25ncmFkZWQgZGF0YWJhc2UgdG8gdmVyc2lvbiAnICsgbmV3VmVyc2lvbik7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy51cGRhdGVEYXRhYmFzZVZlcnNpb24obmV3VmVyc2lvbik7XG5cbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoJ0NPTU1JVCBUUkFOU0FDVElPTicpO1xuICB9XG5cbiAgYXN5bmMgdXBkYXRlRGF0YWJhc2VWZXJzaW9uKHZlcnNpb24pIHtcbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoXCJVUERBVEUgbWV0YWRhdGEgU0VUIHZhbHVlID0gJ1wiICsgdmVyc2lvbiArIFwiJyBXSEVSRSBrZXkgPSAnZGF0YWJhc2VfdmVyc2lvbidcIiwgbnVsbCk7XG4gIH1cblxuICBsb2cobWVzc2FnZSkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgfVxuXG4gIGFzeW5jIG1pZ3JhdGUoKSB7XG4gICAgYXdhaXQgdGhpcy5jcmVhdGVNZXRhZGF0YVRhYmxlKCk7XG4gICAgYXdhaXQgdGhpcy5nZXREYXRhYmFzZVZlcnNpb24oKTtcbiAgICBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25zKCk7XG4gIH1cblxuICBhc3luYyBnZXREYXRhYmFzZVZlcnNpb24oKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5kYi5nZXQoXCJTRUxFQ1Qga2V5LCB2YWx1ZSBGUk9NIG1ldGFkYXRhIFdIRVJFIGtleSA9ICdkYXRhYmFzZV92ZXJzaW9uJ1wiKTtcbiAgICB0aGlzLnZlcnNpb24gPSByZXN1bHQgPyArcmVzdWx0LnZhbHVlIDogMDtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZU1ldGFkYXRhVGFibGUoKSB7XG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKCdDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyBtZXRhZGF0YSAoa2V5IFRFWFQsIHZhbHVlIFRFWFQpJywgbnVsbCk7XG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKFwiSU5TRVJUIElOVE8gbWV0YWRhdGEgKGtleSwgdmFsdWUpIFNFTEVDVCAnZGF0YWJhc2VfdmVyc2lvbicsIDAgV0hFUkUgTk9UIEVYSVNUUyAoU0VMRUNUIDEgRlJPTSBtZXRhZGF0YSBXSEVSRSBrZXkgPSAnZGF0YWJhc2VfdmVyc2lvbicpXCIsIG51bGwpO1xuICB9XG59XG4iXX0=