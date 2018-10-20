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
    this._recordCount = 0;
  }

  addTask(task) {
    this._tasks.push(task);
  }

  popTask() {
    return this._tasks.shift();
  }

  incrementRecordCount() {
    this._recordCount++;
  }

  run(account, formName, dataSource, { fullSync }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const start = new Date().getTime();

      _this._recordCount = 0;

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
        yield (0, _exec2.default)(_app2.default.args.afterSyncCommand, _this.afterSyncCommandOptions, 'after-sync');
      }

      console.log('Synced'.green, (0, _humanizeDuration2.default)(new Date().getTime() - start));
    })();
  }

  get afterSyncCommandOptions() {
    const options = {
      changedRecordCount: this._recordCount,
      args: _app2.default.args
    };

    return {
      env: {
        FULCRUM_PAYLOAD: JSON.stringify(options),
        FULCRUM_CHANGED_RECORD_COUNT: options.recordCount
      }
    };
  }
}
exports.default = Synchronizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3N5bmMvc3luY2hyb25pemVyLmpzIl0sIm5hbWVzIjpbIlN5bmNocm9uaXplciIsImNvbnN0cnVjdG9yIiwiX3Rhc2tzIiwiX3JlY29yZENvdW50IiwiYWRkVGFzayIsInRhc2siLCJwdXNoIiwicG9wVGFzayIsInNoaWZ0IiwiaW5jcmVtZW50UmVjb3JkQ291bnQiLCJydW4iLCJhY2NvdW50IiwiZm9ybU5hbWUiLCJkYXRhU291cmNlIiwiZnVsbFN5bmMiLCJzdGFydCIsIkRhdGUiLCJnZXRUaW1lIiwicmVzcG9uc2UiLCJnZXRTeW5jIiwic3luY1N0YXRlIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsInJlc291cmNlcyIsInRhc2tQYXJhbXMiLCJzeW5jaHJvbml6ZXIiLCJzb3VyY2UiLCJsb2FkIiwiZGIiLCJlbWl0IiwidGFza3MiLCJleGVjdXRlIiwibGVuZ3RoIiwiYXJncyIsImFmdGVyU3luY0NvbW1hbmQiLCJhZnRlclN5bmNDb21tYW5kT3B0aW9ucyIsImNvbnNvbGUiLCJsb2ciLCJncmVlbiIsIm9wdGlvbnMiLCJjaGFuZ2VkUmVjb3JkQ291bnQiLCJlbnYiLCJGVUxDUlVNX1BBWUxPQUQiLCJzdHJpbmdpZnkiLCJGVUxDUlVNX0NIQU5HRURfUkVDT1JEX0NPVU5UIiwicmVjb3JkQ291bnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7Ozs7Ozs7QUFFZSxNQUFNQSxZQUFOLENBQW1CO0FBQ2hDQyxnQkFBYztBQUNaLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsU0FBS0MsWUFBTCxHQUFvQixDQUFwQjtBQUNEOztBQUVEQyxVQUFRQyxJQUFSLEVBQWM7QUFDWixTQUFLSCxNQUFMLENBQVlJLElBQVosQ0FBaUJELElBQWpCO0FBQ0Q7O0FBRURFLFlBQVU7QUFDUixXQUFPLEtBQUtMLE1BQUwsQ0FBWU0sS0FBWixFQUFQO0FBQ0Q7O0FBRURDLHlCQUF1QjtBQUNyQixTQUFLTixZQUFMO0FBQ0Q7O0FBRUtPLEtBQU4sQ0FBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLFVBQTdCLEVBQXlDLEVBQUNDLFFBQUQsRUFBekMsRUFBcUQ7QUFBQTs7QUFBQTtBQUNuRCxZQUFNQyxRQUFRLElBQUlDLElBQUosR0FBV0MsT0FBWCxFQUFkOztBQUVBLFlBQUtkLFlBQUwsR0FBb0IsQ0FBcEI7O0FBRUEsWUFBTWUsV0FBVyxNQUFNLGlCQUFPQyxPQUFQLENBQWVSLE9BQWYsQ0FBdkI7O0FBRUEsWUFBS1MsU0FBTCxHQUFpQk4sV0FBVyxFQUFYLEdBQWdCTyxLQUFLQyxLQUFMLENBQVdKLFNBQVNLLElBQXBCLEVBQTBCQyxTQUEzRDtBQUNBLFlBQUtDLFVBQUwsR0FBa0IsRUFBRUMsbUJBQUYsRUFBc0JOLFdBQVcsTUFBS0EsU0FBdEMsRUFBbEI7O0FBRUEsWUFBS2hCLE9BQUwsQ0FBYSw0QkFBa0IsTUFBS3FCLFVBQXZCLENBQWI7QUFDQSxZQUFLckIsT0FBTCxDQUFhLGtDQUF3QixNQUFLcUIsVUFBN0IsQ0FBYjtBQUNBLFlBQUtyQixPQUFMLENBQWEsa0NBQXdCLE1BQUtxQixVQUE3QixDQUFiO0FBQ0EsWUFBS3JCLE9BQUwsQ0FBYSx5Q0FBK0IsTUFBS3FCLFVBQXBDLENBQWI7QUFDQSxZQUFLckIsT0FBTCxDQUFhLCtCQUFxQixNQUFLcUIsVUFBMUIsQ0FBYjtBQUNBLFlBQUtyQixPQUFMLENBQWEsNEJBQWtCLE1BQUtxQixVQUF2QixDQUFiO0FBQ0EsWUFBS3JCLE9BQUwsQ0FBYSxpQ0FBdUIsTUFBS3FCLFVBQTVCLENBQWI7QUFDQSxZQUFLckIsT0FBTCxDQUFhLGlDQUF1QixNQUFLcUIsVUFBNUIsQ0FBYjs7QUFFQSxZQUFNWixXQUFXYyxNQUFYLENBQWtCQyxJQUFsQixDQUF1QmpCLFFBQVFrQixFQUEvQixDQUFOOztBQUVBLFlBQU0sY0FBSUMsSUFBSixDQUFTLFlBQVQsRUFBdUIsRUFBQ25CLE9BQUQsRUFBVW9CLE9BQU8sTUFBSzdCLE1BQXRCLEVBQXZCLENBQU47O0FBRUEsU0FBRztBQUNELGNBQU1HLE9BQU8sTUFBS0UsT0FBTCxFQUFiOztBQUVBLGNBQU1GLEtBQUsyQixPQUFMLENBQWEsRUFBQ3JCLE9BQUQsRUFBVUUsVUFBVixFQUFiLENBQU47QUFDRCxPQUpELFFBSVMsTUFBS1gsTUFBTCxDQUFZK0IsTUFKckI7O0FBTUEsWUFBTSxjQUFJSCxJQUFKLENBQVMsYUFBVCxFQUF3QixFQUFDbkIsT0FBRCxFQUF4QixDQUFOOztBQUVBLFVBQUksY0FBSXVCLElBQUosQ0FBU0MsZ0JBQWIsRUFBK0I7QUFDN0IsY0FBTSxvQkFBSyxjQUFJRCxJQUFKLENBQVNDLGdCQUFkLEVBQWdDLE1BQUtDLHVCQUFyQyxFQUE4RCxZQUE5RCxDQUFOO0FBQ0Q7O0FBRURDLGNBQVFDLEdBQVIsQ0FBWSxTQUFTQyxLQUFyQixFQUE0QixnQ0FBaUIsSUFBSXZCLElBQUosR0FBV0MsT0FBWCxLQUF1QkYsS0FBeEMsQ0FBNUI7QUFuQ21EO0FBb0NwRDs7QUFFRCxNQUFJcUIsdUJBQUosR0FBOEI7QUFDNUIsVUFBTUksVUFBVTtBQUNkQywwQkFBb0IsS0FBS3RDLFlBRFg7QUFFZCtCLFlBQU0sY0FBSUE7QUFGSSxLQUFoQjs7QUFLQSxXQUFPO0FBQ0xRLFdBQUs7QUFDSEMseUJBQWlCdEIsS0FBS3VCLFNBQUwsQ0FBZUosT0FBZixDQURkO0FBRUhLLHNDQUE4QkwsUUFBUU07QUFGbkM7QUFEQSxLQUFQO0FBTUQ7QUFwRStCO2tCQUFiOUMsWSIsImZpbGUiOiJzeW5jaHJvbml6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRSb2xlcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLXJvbGVzJztcclxuaW1wb3J0IERvd25sb2FkTWVtYmVyc2hpcHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1tZW1iZXJzaGlwcyc7XHJcbmltcG9ydCBEb3dubG9hZENob2ljZUxpc3RzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2hvaWNlLWxpc3RzJztcclxuaW1wb3J0IERvd25sb2FkQ2xhc3NpZmljYXRpb25TZXRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2xhc3NpZmljYXRpb24tc2V0cyc7XHJcbmltcG9ydCBEb3dubG9hZFByb2plY3RzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtcHJvamVjdHMnO1xyXG5pbXBvcnQgRG93bmxvYWRGb3JtcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWZvcm1zJztcclxuaW1wb3J0IERvd25sb2FkQ2hhbmdlc2V0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWNoYW5nZXNldHMnO1xyXG5pbXBvcnQgRG93bmxvYWRBbGxSZWNvcmRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtYWxsLXJlY29yZHMnO1xyXG5pbXBvcnQgYXBwIGZyb20gJy4uL2FwcCc7XHJcbmltcG9ydCBleGVjIGZyb20gJy4uL3V0aWxzL2V4ZWMnO1xyXG5cclxuaW1wb3J0IENsaWVudCBmcm9tICcuLi9hcGkvY2xpZW50JztcclxuXHJcbmltcG9ydCBodW1hbml6ZUR1cmF0aW9uIGZyb20gJ2h1bWFuaXplLWR1cmF0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplciB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLl90YXNrcyA9IFtdO1xyXG4gICAgdGhpcy5fcmVjb3JkQ291bnQgPSAwO1xyXG4gIH1cclxuXHJcbiAgYWRkVGFzayh0YXNrKSB7XHJcbiAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xyXG4gIH1cclxuXHJcbiAgcG9wVGFzaygpIHtcclxuICAgIHJldHVybiB0aGlzLl90YXNrcy5zaGlmdCgpO1xyXG4gIH1cclxuXHJcbiAgaW5jcmVtZW50UmVjb3JkQ291bnQoKSB7XHJcbiAgICB0aGlzLl9yZWNvcmRDb3VudCsrO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcnVuKGFjY291bnQsIGZvcm1OYW1lLCBkYXRhU291cmNlLCB7ZnVsbFN5bmN9KSB7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgIHRoaXMuX3JlY29yZENvdW50ID0gMDtcclxuXHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRTeW5jKGFjY291bnQpO1xyXG5cclxuICAgIHRoaXMuc3luY1N0YXRlID0gZnVsbFN5bmMgPyBbXSA6IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSkucmVzb3VyY2VzO1xyXG4gICAgdGhpcy50YXNrUGFyYW1zID0geyBzeW5jaHJvbml6ZXI6IHRoaXMsIHN5bmNTdGF0ZTogdGhpcy5zeW5jU3RhdGUgfTtcclxuXHJcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkUm9sZXModGhpcy50YXNrUGFyYW1zKSk7XHJcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkTWVtYmVyc2hpcHModGhpcy50YXNrUGFyYW1zKSk7XHJcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2hvaWNlTGlzdHModGhpcy50YXNrUGFyYW1zKSk7XHJcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2xhc3NpZmljYXRpb25TZXRzKHRoaXMudGFza1BhcmFtcykpO1xyXG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZFByb2plY3RzKHRoaXMudGFza1BhcmFtcykpO1xyXG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZEZvcm1zKHRoaXMudGFza1BhcmFtcykpO1xyXG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZENoYW5nZXNldHModGhpcy50YXNrUGFyYW1zKSk7XHJcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQWxsUmVjb3Jkcyh0aGlzLnRhc2tQYXJhbXMpKTtcclxuXHJcbiAgICBhd2FpdCBkYXRhU291cmNlLnNvdXJjZS5sb2FkKGFjY291bnQuZGIpO1xyXG5cclxuICAgIGF3YWl0IGFwcC5lbWl0KCdzeW5jOnN0YXJ0Jywge2FjY291bnQsIHRhc2tzOiB0aGlzLl90YXNrc30pO1xyXG5cclxuICAgIGRvIHtcclxuICAgICAgY29uc3QgdGFzayA9IHRoaXMucG9wVGFzaygpO1xyXG5cclxuICAgICAgYXdhaXQgdGFzay5leGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSk7XHJcbiAgICB9IHdoaWxlICh0aGlzLl90YXNrcy5sZW5ndGgpO1xyXG5cclxuICAgIGF3YWl0IGFwcC5lbWl0KCdzeW5jOmZpbmlzaCcsIHthY2NvdW50fSk7XHJcblxyXG4gICAgaWYgKGFwcC5hcmdzLmFmdGVyU3luY0NvbW1hbmQpIHtcclxuICAgICAgYXdhaXQgZXhlYyhhcHAuYXJncy5hZnRlclN5bmNDb21tYW5kLCB0aGlzLmFmdGVyU3luY0NvbW1hbmRPcHRpb25zLCAnYWZ0ZXItc3luYycpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdTeW5jZWQnLmdyZWVuLCBodW1hbml6ZUR1cmF0aW9uKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQpKTtcclxuICB9XHJcblxyXG4gIGdldCBhZnRlclN5bmNDb21tYW5kT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGNoYW5nZWRSZWNvcmRDb3VudDogdGhpcy5fcmVjb3JkQ291bnQsXHJcbiAgICAgIGFyZ3M6IGFwcC5hcmdzXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVudjoge1xyXG4gICAgICAgIEZVTENSVU1fUEFZTE9BRDogSlNPTi5zdHJpbmdpZnkob3B0aW9ucyksXHJcbiAgICAgICAgRlVMQ1JVTV9DSEFOR0VEX1JFQ09SRF9DT1VOVDogb3B0aW9ucy5yZWNvcmRDb3VudFxyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=