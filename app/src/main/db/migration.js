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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbi5qcyJdLCJuYW1lcyI6WyJNSUdSQVRJT05TIiwiTWlncmF0aW9uIiwiY29uc3RydWN0b3IiLCJkYiIsInZlcnNpb25OYW1lIiwiZXhlY3V0ZU1pZ3JhdGlvblNRTCIsInN1ZmZpeCIsImRhdGEiLCJzcWwiLCJwYXJ0Iiwic3BsaXQiLCJ0cmltIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwicHVzaCIsInJlc3VsdHMiLCJzY3JpcHQiLCJ2ZXJib3NlIiwiY29uc29sZSIsImxvZyIsImV4ZWN1dGUiLCJleGVjdXRlVXBncmFkZVNRTCIsImV4ZWN1dGVEb3duZ3JhZGVTUUwiLCJ1cCIsImRvd24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7OztBQUVBLE1BQU1BLGFBQWE7QUFDakI7QUFEaUIsQ0FBbkI7O0FBSWUsTUFBTUMsU0FBTixDQUFnQjtBQUM3QkMsY0FBWUMsRUFBWixFQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0IsU0FBS0QsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkEsV0FBbkI7QUFDRDs7QUFFS0MscUJBQU4sQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaEMsWUFBTUMsT0FBT1AsV0FBVyxNQUFLSSxXQUFoQixDQUFiOztBQUVBLFlBQU1JLE1BQU0sRUFBWjs7QUFFQSxXQUFLLElBQUlDLElBQVQsSUFBaUJGLEtBQUtHLEtBQUwsQ0FBVyxNQUFYLENBQWpCLEVBQXFDO0FBQ25DLFlBQUlELEtBQUtFLElBQUwsR0FBWUMsTUFBWixJQUFzQkgsS0FBS0UsSUFBTCxHQUFZRSxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLE1BQWdDLElBQTFELEVBQWdFO0FBQzlETCxjQUFJTSxJQUFKLENBQVNMLEtBQUtFLElBQUwsRUFBVDtBQUNEO0FBQ0Y7O0FBRUQsVUFBSUgsSUFBSUksTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLGVBQU8sRUFBUDtBQUNEOztBQUVELFlBQU1HLFVBQVUsRUFBaEI7O0FBRUEsV0FBSyxJQUFJQyxNQUFULElBQW1CUixHQUFuQixFQUF3QjtBQUN0QixZQUFJLE1BQUtMLEVBQUwsQ0FBUWMsT0FBWixFQUFxQjtBQUNuQkMsa0JBQVFDLEdBQVIsQ0FBWUgsTUFBWixFQUFvQixJQUFwQjtBQUNEOztBQUVERCxnQkFBUUQsSUFBUixFQUFhLE1BQU0sTUFBS1gsRUFBTCxDQUFRaUIsT0FBUixDQUFnQkosTUFBaEIsQ0FBbkI7QUFDRDs7QUFFRCxhQUFPRCxPQUFQO0FBekJnQztBQTBCakM7O0FBRUtNLG1CQUFOLEdBQTBCO0FBQUE7O0FBQUE7QUFDeEIsYUFBTyxNQUFNLE9BQUtoQixtQkFBTCxDQUF5QixJQUF6QixDQUFiO0FBRHdCO0FBRXpCOztBQUVLaUIscUJBQU4sR0FBNEI7QUFBQTs7QUFBQTtBQUMxQixhQUFPLE1BQU0sT0FBS2pCLG1CQUFMLENBQXlCLE1BQXpCLENBQWI7QUFEMEI7QUFFM0I7O0FBRUtrQixJQUFOLEdBQVc7QUFBQTs7QUFBQTtBQUNULGFBQU8sTUFBTSxPQUFLRixpQkFBTCxFQUFiO0FBRFM7QUFFVjs7QUFFS0csTUFBTixHQUFhO0FBQUE7O0FBQUE7QUFDWCxhQUFPLE1BQU0sT0FBS0YsbUJBQUwsRUFBYjtBQURXO0FBRVo7QUFoRDRCO2tCQUFWckIsUyIsImZpbGUiOiJtaWdyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVjEgZnJvbSAnLi9taWdyYXRpb25zL3ZlcnNpb25fMDAxJztcblxuY29uc3QgTUlHUkFUSU9OUyA9IHtcbiAgJzAwMSc6IFYxXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNaWdyYXRpb24ge1xuICBjb25zdHJ1Y3RvcihkYiwgdmVyc2lvbk5hbWUpIHtcbiAgICB0aGlzLmRiID0gZGI7XG4gICAgdGhpcy52ZXJzaW9uTmFtZSA9IHZlcnNpb25OYW1lO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZU1pZ3JhdGlvblNRTChzdWZmaXgpIHtcbiAgICBjb25zdCBkYXRhID0gTUlHUkFUSU9OU1t0aGlzLnZlcnNpb25OYW1lXTtcblxuICAgIGNvbnN0IHNxbCA9IFtdO1xuXG4gICAgZm9yIChsZXQgcGFydCBvZiBkYXRhLnNwbGl0KCdcXG5cXG4nKSkge1xuICAgICAgaWYgKHBhcnQudHJpbSgpLmxlbmd0aCAmJiBwYXJ0LnRyaW0oKS5zdWJzdHJpbmcoMCwgMikgIT09ICctLScpIHtcbiAgICAgICAgc3FsLnB1c2gocGFydC50cmltKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzcWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgc2NyaXB0IG9mIHNxbCkge1xuICAgICAgaWYgKHRoaXMuZGIudmVyYm9zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhzY3JpcHQsICdcXG4nKTtcbiAgICAgIH1cblxuICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShzY3JpcHQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVVcGdyYWRlU1FMKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25TUUwoJ3VwJyk7XG4gIH1cblxuICBhc3luYyBleGVjdXRlRG93bmdyYWRlU1FMKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVNaWdyYXRpb25TUUwoJ2Rvd24nKTtcbiAgfVxuXG4gIGFzeW5jIHVwKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVVcGdyYWRlU1FMKCk7XG4gIH1cblxuICBhc3luYyBkb3duKCkge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLmV4ZWN1dGVEb3duZ3JhZGVTUUwoKTtcbiAgfVxufVxuIl19