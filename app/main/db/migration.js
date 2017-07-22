'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _version_ = require('./migrations/version_001');

var _version_2 = _interopRequireDefault(_version_);

var _version_3 = require('./migrations/version_002');

var _version_4 = _interopRequireDefault(_version_3);

var _version_5 = require('./migrations/version_003');

var _version_6 = _interopRequireDefault(_version_5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const MIGRATIONS = {
  '001': _version_2.default,
  '002': _version_4.default,
  '003': _version_6.default
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2RiL21pZ3JhdGlvbi5qcyJdLCJuYW1lcyI6WyJNSUdSQVRJT05TIiwiTWlncmF0aW9uIiwiY29uc3RydWN0b3IiLCJkYiIsInZlcnNpb25OYW1lIiwiZXhlY3V0ZU1pZ3JhdGlvblNRTCIsInN1ZmZpeCIsImRhdGEiLCJzcWwiLCJwYXJ0Iiwic3BsaXQiLCJ0cmltIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwicHVzaCIsInJlc3VsdHMiLCJzY3JpcHQiLCJ2ZXJib3NlIiwiY29uc29sZSIsImxvZyIsImV4ZWN1dGUiLCJleGVjdXRlVXBncmFkZVNRTCIsImV4ZWN1dGVEb3duZ3JhZGVTUUwiLCJ1cCIsImRvd24iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxhQUFhO0FBQ2pCLDJCQURpQjtBQUVqQiwyQkFGaUI7QUFHakI7QUFIaUIsQ0FBbkI7O0FBTWUsTUFBTUMsU0FBTixDQUFnQjtBQUM3QkMsY0FBWUMsRUFBWixFQUFnQkMsV0FBaEIsRUFBNkI7QUFDM0IsU0FBS0QsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS0MsV0FBTCxHQUFtQkEsV0FBbkI7QUFDRDs7QUFFS0MscUJBQU4sQ0FBMEJDLE1BQTFCLEVBQWtDO0FBQUE7O0FBQUE7QUFDaEMsWUFBTUMsT0FBT1AsV0FBVyxNQUFLSSxXQUFoQixDQUFiOztBQUVBLFlBQU1JLE1BQU0sRUFBWjs7QUFFQSxXQUFLLElBQUlDLElBQVQsSUFBaUJGLEtBQUtHLEtBQUwsQ0FBVyxNQUFYLENBQWpCLEVBQXFDO0FBQ25DLFlBQUlELEtBQUtFLElBQUwsR0FBWUMsTUFBWixJQUFzQkgsS0FBS0UsSUFBTCxHQUFZRSxTQUFaLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLE1BQWdDLElBQTFELEVBQWdFO0FBQzlETCxjQUFJTSxJQUFKLENBQVNMLEtBQUtFLElBQUwsRUFBVDtBQUNEO0FBQ0Y7O0FBRUQsVUFBSUgsSUFBSUksTUFBSixLQUFlLENBQW5CLEVBQXNCO0FBQ3BCLGVBQU8sRUFBUDtBQUNEOztBQUVELFlBQU1HLFVBQVUsRUFBaEI7O0FBRUEsV0FBSyxJQUFJQyxNQUFULElBQW1CUixHQUFuQixFQUF3QjtBQUN0QixZQUFJLE1BQUtMLEVBQUwsQ0FBUWMsT0FBWixFQUFxQjtBQUNuQkMsa0JBQVFDLEdBQVIsQ0FBWUgsTUFBWixFQUFvQixJQUFwQjtBQUNEOztBQUVERCxnQkFBUUQsSUFBUixFQUFhLE1BQU0sTUFBS1gsRUFBTCxDQUFRaUIsT0FBUixDQUFnQkosTUFBaEIsQ0FBbkI7QUFDRDs7QUFFRCxhQUFPRCxPQUFQO0FBekJnQztBQTBCakM7O0FBRUtNLG1CQUFOLEdBQTBCO0FBQUE7O0FBQUE7QUFDeEIsYUFBTyxNQUFNLE9BQUtoQixtQkFBTCxDQUF5QixJQUF6QixDQUFiO0FBRHdCO0FBRXpCOztBQUVLaUIscUJBQU4sR0FBNEI7QUFBQTs7QUFBQTtBQUMxQixhQUFPLE1BQU0sT0FBS2pCLG1CQUFMLENBQXlCLE1BQXpCLENBQWI7QUFEMEI7QUFFM0I7O0FBRUtrQixJQUFOLEdBQVc7QUFBQTs7QUFBQTtBQUNULGFBQU8sTUFBTSxPQUFLRixpQkFBTCxFQUFiO0FBRFM7QUFFVjs7QUFFS0csTUFBTixHQUFhO0FBQUE7O0FBQUE7QUFDWCxhQUFPLE1BQU0sT0FBS0YsbUJBQUwsRUFBYjtBQURXO0FBRVo7QUFoRDRCO2tCQUFWckIsUyIsImZpbGUiOiJtaWdyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVjEgZnJvbSAnLi9taWdyYXRpb25zL3ZlcnNpb25fMDAxJztcbmltcG9ydCBWMiBmcm9tICcuL21pZ3JhdGlvbnMvdmVyc2lvbl8wMDInO1xuaW1wb3J0IFYzIGZyb20gJy4vbWlncmF0aW9ucy92ZXJzaW9uXzAwMyc7XG5cbmNvbnN0IE1JR1JBVElPTlMgPSB7XG4gICcwMDEnOiBWMSxcbiAgJzAwMic6IFYyLFxuICAnMDAzJzogVjNcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZ3JhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGRiLCB2ZXJzaW9uTmFtZSkge1xuICAgIHRoaXMuZGIgPSBkYjtcbiAgICB0aGlzLnZlcnNpb25OYW1lID0gdmVyc2lvbk5hbWU7XG4gIH1cblxuICBhc3luYyBleGVjdXRlTWlncmF0aW9uU1FMKHN1ZmZpeCkge1xuICAgIGNvbnN0IGRhdGEgPSBNSUdSQVRJT05TW3RoaXMudmVyc2lvbk5hbWVdO1xuXG4gICAgY29uc3Qgc3FsID0gW107XG5cbiAgICBmb3IgKGxldCBwYXJ0IG9mIGRhdGEuc3BsaXQoJ1xcblxcbicpKSB7XG4gICAgICBpZiAocGFydC50cmltKCkubGVuZ3RoICYmIHBhcnQudHJpbSgpLnN1YnN0cmluZygwLCAyKSAhPT0gJy0tJykge1xuICAgICAgICBzcWwucHVzaChwYXJ0LnRyaW0oKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNxbC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRzID0gW107XG5cbiAgICBmb3IgKGxldCBzY3JpcHQgb2Ygc3FsKSB7XG4gICAgICBpZiAodGhpcy5kYi52ZXJib3NlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHNjcmlwdCwgJ1xcbicpO1xuICAgICAgfVxuXG4gICAgICByZXN1bHRzLnB1c2goYXdhaXQgdGhpcy5kYi5leGVjdXRlKHNjcmlwdCkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZVVwZ3JhZGVTUUwoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZU1pZ3JhdGlvblNRTCgndXAnKTtcbiAgfVxuXG4gIGFzeW5jIGV4ZWN1dGVEb3duZ3JhZGVTUUwoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZU1pZ3JhdGlvblNRTCgnZG93bicpO1xuICB9XG5cbiAgYXN5bmMgdXAoKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZVVwZ3JhZGVTUUwoKTtcbiAgfVxuXG4gIGFzeW5jIGRvd24oKSB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZXhlY3V0ZURvd25ncmFkZVNRTCgpO1xuICB9XG59XG4iXX0=