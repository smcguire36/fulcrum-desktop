'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadRoles = require('./tasks/download-roles');

var _downloadRoles2 = _interopRequireDefault(_downloadRoles);

var _downloadMemberships = require('./tasks/download-memberships');

var _downloadMemberships2 = _interopRequireDefault(_downloadMemberships);

var _downloadChoiceLists = require('./tasks/download-choice-lists');

var _downloadChoiceLists2 = _interopRequireDefault(_downloadChoiceLists);

var _downloadClassificationSets = require('./tasks/download-classification-sets');

var _downloadClassificationSets2 = _interopRequireDefault(_downloadClassificationSets);

var _downloadProjects = require('./tasks/download-projects');

var _downloadProjects2 = _interopRequireDefault(_downloadProjects);

var _downloadForms = require('./tasks/download-forms');

var _downloadForms2 = _interopRequireDefault(_downloadForms);

var _downloadChangesets = require('./tasks/download-changesets');

var _downloadChangesets2 = _interopRequireDefault(_downloadChangesets);

var _downloadAllRecords = require('./tasks/download-all-records');

var _downloadAllRecords2 = _interopRequireDefault(_downloadAllRecords);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _exec = require('../utils/exec');

var _exec2 = _interopRequireDefault(_exec);

var _client = require('../api/client');

var _client2 = _interopRequireDefault(_client);

var _humanizeDuration = require('humanize-duration');

var _humanizeDuration2 = _interopRequireDefault(_humanizeDuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Synchronizer {
  constructor() {
    this._tasks = [];
  }

  addTask(task) {
    this._tasks.push(task);
  }

  popTask() {
    return this._tasks.shift();
  }

  run(account, formName, dataSource, { fullSync }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const start = new Date().getTime();

      const response = yield _client2.default.getSync(account);

      _this.syncState = fullSync ? [] : JSON.parse(response.body).resources;
      _this.taskParams = { synchronizer: _this, syncState: _this.syncState };

      _this.addTask(new _downloadRoles2.default(_this.taskParams));
      _this.addTask(new _downloadMemberships2.default(_this.taskParams));
      _this.addTask(new _downloadChoiceLists2.default(_this.taskParams));
      _this.addTask(new _downloadClassificationSets2.default(_this.taskParams));
      _this.addTask(new _downloadProjects2.default(_this.taskParams));
      _this.addTask(new _downloadForms2.default(_this.taskParams));
      _this.addTask(new _downloadChangesets2.default(_this.taskParams));
      _this.addTask(new _downloadAllRecords2.default(_this.taskParams));

      yield dataSource.source.load(account.db);

      yield _app2.default.emit('sync:start', { account, tasks: _this._tasks });

      do {
        const task = _this.popTask();

        yield task.execute({ account, dataSource });
      } while (_this._tasks.length);

      yield _app2.default.emit('sync:finish', { account });

      if (_app2.default.args.afterSyncCommand) {
        yield (0, _exec2.default)(_app2.default.args.afterSyncCommand, null, 'after-sync');
      }

      console.log('Synced', (0, _humanizeDuration2.default)(new Date().getTime() - start));
    })();
  }
}
exports.default = Synchronizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3N5bmMvc3luY2hyb25pemVyLmpzIl0sIm5hbWVzIjpbIlN5bmNocm9uaXplciIsImNvbnN0cnVjdG9yIiwiX3Rhc2tzIiwiYWRkVGFzayIsInRhc2siLCJwdXNoIiwicG9wVGFzayIsInNoaWZ0IiwicnVuIiwiYWNjb3VudCIsImZvcm1OYW1lIiwiZGF0YVNvdXJjZSIsImZ1bGxTeW5jIiwic3RhcnQiLCJEYXRlIiwiZ2V0VGltZSIsInJlc3BvbnNlIiwiZ2V0U3luYyIsInN5bmNTdGF0ZSIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJyZXNvdXJjZXMiLCJ0YXNrUGFyYW1zIiwic3luY2hyb25pemVyIiwic291cmNlIiwibG9hZCIsImRiIiwiZW1pdCIsInRhc2tzIiwiZXhlY3V0ZSIsImxlbmd0aCIsImFyZ3MiLCJhZnRlclN5bmNDb21tYW5kIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7OztBQUVlLE1BQU1BLFlBQU4sQ0FBbUI7QUFDaENDLGdCQUFjO0FBQ1osU0FBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDRDs7QUFFREMsVUFBUUMsSUFBUixFQUFjO0FBQ1osU0FBS0YsTUFBTCxDQUFZRyxJQUFaLENBQWlCRCxJQUFqQjtBQUNEOztBQUVERSxZQUFVO0FBQ1IsV0FBTyxLQUFLSixNQUFMLENBQVlLLEtBQVosRUFBUDtBQUNEOztBQUVLQyxLQUFOLENBQVVDLE9BQVYsRUFBbUJDLFFBQW5CLEVBQTZCQyxVQUE3QixFQUF5QyxFQUFDQyxRQUFELEVBQXpDLEVBQXFEO0FBQUE7O0FBQUE7QUFDbkQsWUFBTUMsUUFBUSxJQUFJQyxJQUFKLEdBQVdDLE9BQVgsRUFBZDs7QUFFQSxZQUFNQyxXQUFXLE1BQU0saUJBQU9DLE9BQVAsQ0FBZVIsT0FBZixDQUF2Qjs7QUFFQSxZQUFLUyxTQUFMLEdBQWlCTixXQUFXLEVBQVgsR0FBZ0JPLEtBQUtDLEtBQUwsQ0FBV0osU0FBU0ssSUFBcEIsRUFBMEJDLFNBQTNEO0FBQ0EsWUFBS0MsVUFBTCxHQUFrQixFQUFFQyxtQkFBRixFQUFzQk4sV0FBVyxNQUFLQSxTQUF0QyxFQUFsQjs7QUFFQSxZQUFLZixPQUFMLENBQWEsNEJBQWtCLE1BQUtvQixVQUF2QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSxrQ0FBd0IsTUFBS29CLFVBQTdCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGtDQUF3QixNQUFLb0IsVUFBN0IsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEseUNBQStCLE1BQUtvQixVQUFwQyxDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSwrQkFBcUIsTUFBS29CLFVBQTFCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLDRCQUFrQixNQUFLb0IsVUFBdkIsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsaUNBQXVCLE1BQUtvQixVQUE1QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSxpQ0FBdUIsTUFBS29CLFVBQTVCLENBQWI7O0FBRUEsWUFBTVosV0FBV2MsTUFBWCxDQUFrQkMsSUFBbEIsQ0FBdUJqQixRQUFRa0IsRUFBL0IsQ0FBTjs7QUFFQSxZQUFNLGNBQUlDLElBQUosQ0FBUyxZQUFULEVBQXVCLEVBQUNuQixPQUFELEVBQVVvQixPQUFPLE1BQUszQixNQUF0QixFQUF2QixDQUFOOztBQUVBLFNBQUc7QUFDRCxjQUFNRSxPQUFPLE1BQUtFLE9BQUwsRUFBYjs7QUFFQSxjQUFNRixLQUFLMEIsT0FBTCxDQUFhLEVBQUNyQixPQUFELEVBQVVFLFVBQVYsRUFBYixDQUFOO0FBQ0QsT0FKRCxRQUlTLE1BQUtULE1BQUwsQ0FBWTZCLE1BSnJCOztBQU1BLFlBQU0sY0FBSUgsSUFBSixDQUFTLGFBQVQsRUFBd0IsRUFBQ25CLE9BQUQsRUFBeEIsQ0FBTjs7QUFFQSxVQUFJLGNBQUl1QixJQUFKLENBQVNDLGdCQUFiLEVBQStCO0FBQzdCLGNBQU0sb0JBQUssY0FBSUQsSUFBSixDQUFTQyxnQkFBZCxFQUFnQyxJQUFoQyxFQUFzQyxZQUF0QyxDQUFOO0FBQ0Q7O0FBRURDLGNBQVFDLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLGdDQUFpQixJQUFJckIsSUFBSixHQUFXQyxPQUFYLEtBQXVCRixLQUF4QyxDQUF0QjtBQWpDbUQ7QUFrQ3BEO0FBL0MrQjtrQkFBYmIsWSIsImZpbGUiOiJzeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRSb2xlcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLXJvbGVzJztcbmltcG9ydCBEb3dubG9hZE1lbWJlcnNoaXBzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtbWVtYmVyc2hpcHMnO1xuaW1wb3J0IERvd25sb2FkQ2hvaWNlTGlzdHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1jaG9pY2UtbGlzdHMnO1xuaW1wb3J0IERvd25sb2FkQ2xhc3NpZmljYXRpb25TZXRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2xhc3NpZmljYXRpb24tc2V0cyc7XG5pbXBvcnQgRG93bmxvYWRQcm9qZWN0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLXByb2plY3RzJztcbmltcG9ydCBEb3dubG9hZEZvcm1zIGZyb20gJy4vdGFza3MvZG93bmxvYWQtZm9ybXMnO1xuaW1wb3J0IERvd25sb2FkQ2hhbmdlc2V0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWNoYW5nZXNldHMnO1xuaW1wb3J0IERvd25sb2FkQWxsUmVjb3JkcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWFsbC1yZWNvcmRzJztcbmltcG9ydCBhcHAgZnJvbSAnLi4vYXBwJztcbmltcG9ydCBleGVjIGZyb20gJy4uL3V0aWxzL2V4ZWMnO1xuXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL2FwaS9jbGllbnQnO1xuXG5pbXBvcnQgaHVtYW5pemVEdXJhdGlvbiBmcm9tICdodW1hbml6ZS1kdXJhdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Rhc2tzID0gW107XG4gIH1cblxuICBhZGRUYXNrKHRhc2spIHtcbiAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xuICB9XG5cbiAgcG9wVGFzaygpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bihhY2NvdW50LCBmb3JtTmFtZSwgZGF0YVNvdXJjZSwge2Z1bGxTeW5jfSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRTeW5jKGFjY291bnQpO1xuXG4gICAgdGhpcy5zeW5jU3RhdGUgPSBmdWxsU3luYyA/IFtdIDogSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5yZXNvdXJjZXM7XG4gICAgdGhpcy50YXNrUGFyYW1zID0geyBzeW5jaHJvbml6ZXI6IHRoaXMsIHN5bmNTdGF0ZTogdGhpcy5zeW5jU3RhdGUgfTtcblxuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRSb2xlcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkTWVtYmVyc2hpcHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZENob2ljZUxpc3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRDbGFzc2lmaWNhdGlvblNldHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZFByb2plY3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRGb3Jtcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2hhbmdlc2V0cyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQWxsUmVjb3Jkcyh0aGlzLnRhc2tQYXJhbXMpKTtcblxuICAgIGF3YWl0IGRhdGFTb3VyY2Uuc291cmNlLmxvYWQoYWNjb3VudC5kYik7XG5cbiAgICBhd2FpdCBhcHAuZW1pdCgnc3luYzpzdGFydCcsIHthY2NvdW50LCB0YXNrczogdGhpcy5fdGFza3N9KTtcblxuICAgIGRvIHtcbiAgICAgIGNvbnN0IHRhc2sgPSB0aGlzLnBvcFRhc2soKTtcblxuICAgICAgYXdhaXQgdGFzay5leGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSk7XG4gICAgfSB3aGlsZSAodGhpcy5fdGFza3MubGVuZ3RoKTtcblxuICAgIGF3YWl0IGFwcC5lbWl0KCdzeW5jOmZpbmlzaCcsIHthY2NvdW50fSk7XG5cbiAgICBpZiAoYXBwLmFyZ3MuYWZ0ZXJTeW5jQ29tbWFuZCkge1xuICAgICAgYXdhaXQgZXhlYyhhcHAuYXJncy5hZnRlclN5bmNDb21tYW5kLCBudWxsLCAnYWZ0ZXItc3luYycpO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdTeW5jZWQnLCBodW1hbml6ZUR1cmF0aW9uKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQpKTtcbiAgfVxufVxuIl19