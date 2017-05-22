'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _version_ = require('./migrations/version_001');

var _version_2 = _interopRequireDefault(_version_);

var _version_3 = require('./migrations/version_002');

var _version_4 = _interopRequireDefault(_version_3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const MIGRATIONS = {
  '001': _version_2.default,
  '002': _version_4.default
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbi5qcyJdLCJuYW1lcyI6WyJNSUdSQVRJT05TIiwiTWlncmF0aW9uIiwiY29uc3RydWN0b3IiLCJkYiIsInZlcnNpb25OYW1lIiwiZXhlY3V0ZU1pZ3JhdGlvblNRTCIsInN1ZmZpeCIsImRhdGEiLCJzcWwiLCJwYXJ0Iiwic3BsaXQiLCJ0cmltIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwicHVzaCIsInJlc3VsdHMiLCJzY3JpcHQiLCJ2ZXJib3NlIiwiY29uc29sZSIsImxvZyIsImV4ZWN1dGUiLCJleGVjdXRlVXBncmFkZVNRTCIsImV4ZWN1dGVEb3duZ3JhZGVTUUwiLCJ1cCIsImRvd24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUEsYUFBYTtBQUNqQiwyQkFEaUI7QUFFakI7QUFGaUIsQ0FBbkI7O0FBS2UsTUFBTUMsU0FBTixDQUFnQjtBQUM3QkMsY0FBWUMsRUFBWixFQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0IsU0FBS0QsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkEsV0FBbkI7QUFDRDs7QUFFS0MscUJBQU4sQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaEMsWUFBTUMsT0FBT1AsV0FBVyxNQUFLSSxXQUFoQixDQUFiOztBQUVBLFlBQU1JLE1BQU0sRUFBWjs7QUFFQSxXQUFLLElBQUlDLElBQVQsSUFBaUJGLEtBQUtHLEtBQUwsQ0FBVyxNQUFYLENBQWpCLEVBQXFDO0FBQ25DLFlBQUlELEtBQUtFLElBQUwsR0FBWUMsTUFBWixJQUFzQkgsS0FBS0UsSUFBTCxHQUFZRSxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLE1BQWdDLElBQTFELEVBQWdFO0FBQzlETCxjQUFJTSxJQUFKLENBQVNMLEtBQUtFLElBQUwsRUFBVDtBQUNEO0FBQ0Y7O0FBRUQsVUFBSUgsSUFBSUksTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLGVBQU8sRUFBUDtBQUNEOztBQUVELFlBQU1HLFVBQVUsRUFBaEI7O0FBRUEsV0FBSyxJQUFJQyxNQUFULElBQW1CUixHQUFuQixFQUF3QjtBQUN0QixZQUFJLE1BQUtMLEVBQUwsQ0FBUWMsT0FBWixFQUFxQjtBQUNuQkMsa0JBQVFDLEdBQVIsQ0FBWUgsTUFBWixFQUFvQixJQUFwQjtBQUNEOztBQUVERCxnQkFBUUQsSUFBUixFQUFhLE1BQU0sTUFBS1gsRUFBTCxDQUFRaUIsT0FBUixDQUFnQkosTUFBaEIsQ0FBbkI7QUFDRDs7QUFFRCxhQUFPRCxPQUFQO0FBekJnQztBQTBCakM7O0FBRUtNLG1CQUFOLEdBQTBCO0FBQUE7O0FBQUE7QUFDeEIsYUFBTyxNQUFNLE9BQUtoQixtQkFBTCxDQUF5QixJQUF6QixDQUFiO0FBRHdCO0FBRXpCOztBQUVLaUIscUJBQU4sR0FBNEI7QUFBQTs7QUFBQTtBQUMxQixhQUFPLE1BQU0sT0FBS2pCLG1CQUFMLENBQXlCLE1BQXpCLENBQWI7QUFEMEI7QUFFM0I7O0FBRUtrQixJQUFOLEdBQVc7QUFBQTs7QUFBQTtBQUNULGFBQU8sTUFBTSxPQUFLRixpQkFBTCxFQUFiO0FBRFM7QUFFVjs7QUFFS0csTUFBTixHQUFhO0FBQUE7O0FBQUE7QUFDWCxhQUFPLE1BQU0sT0FBS0YsbUJBQUwsRUFBYjtBQURXO0FBRVo7QUFoRDRCO2tCQUFWckIsUyIsImZpbGUiOiJtaWdyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVjEgZnJvbSAnLi9taWdyYXRpb25zL3ZlcnNpb25fMDAxJztcbmltcG9ydCBWMiBmcm9tICcuL21pZ3JhdGlvbnMvdmVyc2lvbl8wMDInO1xuXG5jb25zdCBNSUdSQVRJT05TID0ge1xuICAnMDAxJzogVjEsXG4gICcwMDInOiBWMlxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWlncmF0aW9uIHtcbiAgY29uc3RydWN0b3IoZGIsIHZlcnNpb25OYW1lKSB7XG4gICAgdGhpcy5kYiA9IGRiO1xuICAgIHRoaXMudmVyc2lvbk5hbWUgPSB2ZXJzaW9uTmFtZTtcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVNaWdyYXRpb25TUUwoc3VmZml4KSB7XG4gICAgY29uc3QgZGF0YSA9IE1JR1JBVElPTlNbdGhpcy52ZXJzaW9uTmFtZV07XG5cbiAgICBjb25zdCBzcWwgPSBbXTtcblxuICAgIGZvciAobGV0IHBhcnQgb2YgZGF0YS5zcGxpdCgnXFxuXFxuJykpIHtcbiAgICAgIGlmIChwYXJ0LnRyaW0oKS5sZW5ndGggJiYgcGFydC50cmltKCkuc3Vic3RyaW5nKDAsIDIpICE9PSAnLS0nKSB7XG4gICAgICAgIHNxbC5wdXNoKHBhcnQudHJpbSgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3FsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcblxuICAgIGZvciAobGV0IHNjcmlwdCBvZiBzcWwpIHtcbiAgICAgIGlmICh0aGlzLmRiLnZlcmJvc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coc2NyaXB0LCAnXFxuJyk7XG4gICAgICB9XG5cbiAgICAgIHJlc3VsdHMucHVzaChhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoc2NyaXB0KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH1cblxuICBhc3luYyBleGVjdXRlVXBncmFkZVNRTCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlTWlncmF0aW9uU1FMKCd1cCcpO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZURvd25ncmFkZVNRTCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlTWlncmF0aW9uU1FMKCdkb3duJyk7XG4gIH1cblxuICBhc3luYyB1cCgpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlVXBncmFkZVNRTCgpO1xuICB9XG5cbiAgYXN5bmMgZG93bigpIHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5leGVjdXRlRG93bmdyYWRlU1FMKCk7XG4gIH1cbn1cbiJdfQ==