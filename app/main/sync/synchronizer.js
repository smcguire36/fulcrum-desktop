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

var _client = require('../api/client');

var _client2 = _interopRequireDefault(_client);

var _humanizeDuration = require('humanize-duration');

var _humanizeDuration2 = _interopRequireDefault(_humanizeDuration);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import { Database } from 'minidb';
// Database.debug = true;

require('colors');

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

      console.log('Synced', (0, _humanizeDuration2.default)(new Date().getTime() - start));
    })();
  }
}
exports.default = Synchronizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3N5bmMvc3luY2hyb25pemVyLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJTeW5jaHJvbml6ZXIiLCJjb25zdHJ1Y3RvciIsIl90YXNrcyIsImFkZFRhc2siLCJ0YXNrIiwicHVzaCIsInBvcFRhc2siLCJzaGlmdCIsInJ1biIsImFjY291bnQiLCJmb3JtTmFtZSIsImRhdGFTb3VyY2UiLCJmdWxsU3luYyIsInN0YXJ0IiwiRGF0ZSIsImdldFRpbWUiLCJyZXNwb25zZSIsImdldFN5bmMiLCJzeW5jU3RhdGUiLCJKU09OIiwicGFyc2UiLCJib2R5IiwicmVzb3VyY2VzIiwidGFza1BhcmFtcyIsInN5bmNocm9uaXplciIsInNvdXJjZSIsImxvYWQiLCJkYiIsImVtaXQiLCJ0YXNrcyIsImV4ZWN1dGUiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBOzs7Ozs7OztBQUVBO0FBQ0E7O0FBRUFBLFFBQVEsUUFBUjs7QUFFZSxNQUFNQyxZQUFOLENBQW1CO0FBQ2hDQyxnQkFBYztBQUNaLFNBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0Q7O0FBRURDLFVBQVFDLElBQVIsRUFBYztBQUNaLFNBQUtGLE1BQUwsQ0FBWUcsSUFBWixDQUFpQkQsSUFBakI7QUFDRDs7QUFFREUsWUFBVTtBQUNSLFdBQU8sS0FBS0osTUFBTCxDQUFZSyxLQUFaLEVBQVA7QUFDRDs7QUFFS0MsS0FBTixDQUFVQyxPQUFWLEVBQW1CQyxRQUFuQixFQUE2QkMsVUFBN0IsRUFBeUMsRUFBQ0MsUUFBRCxFQUF6QyxFQUFxRDtBQUFBOztBQUFBO0FBQ25ELFlBQU1DLFFBQVEsSUFBSUMsSUFBSixHQUFXQyxPQUFYLEVBQWQ7O0FBRUEsWUFBTUMsV0FBVyxNQUFNLGlCQUFPQyxPQUFQLENBQWVSLE9BQWYsQ0FBdkI7O0FBRUEsWUFBS1MsU0FBTCxHQUFpQk4sV0FBVyxFQUFYLEdBQWdCTyxLQUFLQyxLQUFMLENBQVdKLFNBQVNLLElBQXBCLEVBQTBCQyxTQUEzRDtBQUNBLFlBQUtDLFVBQUwsR0FBa0IsRUFBRUMsbUJBQUYsRUFBc0JOLFdBQVcsTUFBS0EsU0FBdEMsRUFBbEI7O0FBRUEsWUFBS2YsT0FBTCxDQUFhLDRCQUFrQixNQUFLb0IsVUFBdkIsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsa0NBQXdCLE1BQUtvQixVQUE3QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSxrQ0FBd0IsTUFBS29CLFVBQTdCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLHlDQUErQixNQUFLb0IsVUFBcEMsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsK0JBQXFCLE1BQUtvQixVQUExQixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSw0QkFBa0IsTUFBS29CLFVBQXZCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGlDQUF1QixNQUFLb0IsVUFBNUIsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsaUNBQXVCLE1BQUtvQixVQUE1QixDQUFiOztBQUVBLFlBQU1aLFdBQVdjLE1BQVgsQ0FBa0JDLElBQWxCLENBQXVCakIsUUFBUWtCLEVBQS9CLENBQU47O0FBRUEsWUFBTSxjQUFJQyxJQUFKLENBQVMsWUFBVCxFQUF1QixFQUFDbkIsT0FBRCxFQUFVb0IsT0FBTyxNQUFLM0IsTUFBdEIsRUFBdkIsQ0FBTjs7QUFFQSxTQUFHO0FBQ0QsY0FBTUUsT0FBTyxNQUFLRSxPQUFMLEVBQWI7O0FBRUEsY0FBTUYsS0FBSzBCLE9BQUwsQ0FBYSxFQUFDckIsT0FBRCxFQUFVRSxVQUFWLEVBQWIsQ0FBTjtBQUNELE9BSkQsUUFJUyxNQUFLVCxNQUFMLENBQVk2QixNQUpyQjs7QUFNQSxZQUFNLGNBQUlILElBQUosQ0FBUyxhQUFULEVBQXdCLEVBQUNuQixPQUFELEVBQXhCLENBQU47O0FBRUF1QixjQUFRQyxHQUFSLENBQVksUUFBWixFQUFzQixnQ0FBaUIsSUFBSW5CLElBQUosR0FBV0MsT0FBWCxLQUF1QkYsS0FBeEMsQ0FBdEI7QUE3Qm1EO0FBOEJwRDtBQTNDK0I7a0JBQWJiLFkiLCJmaWxlIjoic3luY2hyb25pemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUm9sZXMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1yb2xlcyc7XG5pbXBvcnQgRG93bmxvYWRNZW1iZXJzaGlwcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLW1lbWJlcnNoaXBzJztcbmltcG9ydCBEb3dubG9hZENob2ljZUxpc3RzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2hvaWNlLWxpc3RzJztcbmltcG9ydCBEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWNsYXNzaWZpY2F0aW9uLXNldHMnO1xuaW1wb3J0IERvd25sb2FkUHJvamVjdHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1wcm9qZWN0cyc7XG5pbXBvcnQgRG93bmxvYWRGb3JtcyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWZvcm1zJztcbmltcG9ydCBEb3dubG9hZENoYW5nZXNldHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1jaGFuZ2VzZXRzJztcbmltcG9ydCBEb3dubG9hZEFsbFJlY29yZHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1hbGwtcmVjb3Jkcyc7XG5pbXBvcnQgYXBwIGZyb20gJy4uL2FwcCc7XG5cbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vYXBpL2NsaWVudCc7XG5cbmltcG9ydCBodW1hbml6ZUR1cmF0aW9uIGZyb20gJ2h1bWFuaXplLWR1cmF0aW9uJztcblxuLy8gaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tICdtaW5pZGInO1xuLy8gRGF0YWJhc2UuZGVidWcgPSB0cnVlO1xuXG5yZXF1aXJlKCdjb2xvcnMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3luY2hyb25pemVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fdGFza3MgPSBbXTtcbiAgfVxuXG4gIGFkZFRhc2sodGFzaykge1xuICAgIHRoaXMuX3Rhc2tzLnB1c2godGFzayk7XG4gIH1cblxuICBwb3BUYXNrKCkge1xuICAgIHJldHVybiB0aGlzLl90YXNrcy5zaGlmdCgpO1xuICB9XG5cbiAgYXN5bmMgcnVuKGFjY291bnQsIGZvcm1OYW1lLCBkYXRhU291cmNlLCB7ZnVsbFN5bmN9KSB7XG4gICAgY29uc3Qgc3RhcnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgQ2xpZW50LmdldFN5bmMoYWNjb3VudCk7XG5cbiAgICB0aGlzLnN5bmNTdGF0ZSA9IGZ1bGxTeW5jID8gW10gOiBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpLnJlc291cmNlcztcbiAgICB0aGlzLnRhc2tQYXJhbXMgPSB7IHN5bmNocm9uaXplcjogdGhpcywgc3luY1N0YXRlOiB0aGlzLnN5bmNTdGF0ZSB9O1xuXG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZFJvbGVzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRNZW1iZXJzaGlwcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2hvaWNlTGlzdHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZENsYXNzaWZpY2F0aW9uU2V0cyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkUHJvamVjdHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZEZvcm1zKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRDaGFuZ2VzZXRzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRBbGxSZWNvcmRzKHRoaXMudGFza1BhcmFtcykpO1xuXG4gICAgYXdhaXQgZGF0YVNvdXJjZS5zb3VyY2UubG9hZChhY2NvdW50LmRiKTtcblxuICAgIGF3YWl0IGFwcC5lbWl0KCdzeW5jOnN0YXJ0Jywge2FjY291bnQsIHRhc2tzOiB0aGlzLl90YXNrc30pO1xuXG4gICAgZG8ge1xuICAgICAgY29uc3QgdGFzayA9IHRoaXMucG9wVGFzaygpO1xuXG4gICAgICBhd2FpdCB0YXNrLmV4ZWN1dGUoe2FjY291bnQsIGRhdGFTb3VyY2V9KTtcbiAgICB9IHdoaWxlICh0aGlzLl90YXNrcy5sZW5ndGgpO1xuXG4gICAgYXdhaXQgYXBwLmVtaXQoJ3N5bmM6ZmluaXNoJywge2FjY291bnR9KTtcblxuICAgIGNvbnNvbGUubG9nKCdTeW5jZWQnLCBodW1hbml6ZUR1cmF0aW9uKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnQpKTtcbiAgfVxufVxuIl19