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

      do {
        const task = _this.popTask();

        yield task.execute({ account, dataSource });
      } while (_this._tasks.length);

      console.log('Synced', (0, _humanizeDuration2.default)(new Date().getTime() - start));
    })();
  }
}
exports.default = Synchronizer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvc3luY2hyb25pemVyLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJTeW5jaHJvbml6ZXIiLCJjb25zdHJ1Y3RvciIsIl90YXNrcyIsImFkZFRhc2siLCJ0YXNrIiwicHVzaCIsInBvcFRhc2siLCJzaGlmdCIsInJ1biIsImFjY291bnQiLCJmb3JtTmFtZSIsImRhdGFTb3VyY2UiLCJmdWxsU3luYyIsInN0YXJ0IiwiRGF0ZSIsImdldFRpbWUiLCJyZXNwb25zZSIsImdldFN5bmMiLCJzeW5jU3RhdGUiLCJKU09OIiwicGFyc2UiLCJib2R5IiwicmVzb3VyY2VzIiwidGFza1BhcmFtcyIsInN5bmNocm9uaXplciIsInNvdXJjZSIsImxvYWQiLCJkYiIsImV4ZWN1dGUiLCJsZW5ndGgiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7Ozs7Ozs7QUFFQTtBQUNBOztBQUVBQSxRQUFRLFFBQVI7O0FBRWUsTUFBTUMsWUFBTixDQUFtQjtBQUNoQ0MsZ0JBQWM7QUFDWixTQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVEQyxVQUFRQyxJQUFSLEVBQWM7QUFDWixTQUFLRixNQUFMLENBQVlHLElBQVosQ0FBaUJELElBQWpCO0FBQ0Q7O0FBRURFLFlBQVU7QUFDUixXQUFPLEtBQUtKLE1BQUwsQ0FBWUssS0FBWixFQUFQO0FBQ0Q7O0FBRUtDLEtBQU4sQ0FBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLFVBQTdCLEVBQXlDLEVBQUNDLFFBQUQsRUFBekMsRUFBcUQ7QUFBQTs7QUFBQTtBQUNuRCxZQUFNQyxRQUFRLElBQUlDLElBQUosR0FBV0MsT0FBWCxFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsT0FBUCxDQUFlUixPQUFmLENBQXZCOztBQUVBLFlBQUtTLFNBQUwsR0FBaUJOLFdBQVcsRUFBWCxHQUFnQk8sS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsU0FBM0Q7QUFDQSxZQUFLQyxVQUFMLEdBQWtCLEVBQUVDLG1CQUFGLEVBQXNCTixXQUFXLE1BQUtBLFNBQXRDLEVBQWxCOztBQUVBLFlBQUtmLE9BQUwsQ0FBYSw0QkFBa0IsTUFBS29CLFVBQXZCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGtDQUF3QixNQUFLb0IsVUFBN0IsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsa0NBQXdCLE1BQUtvQixVQUE3QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSx5Q0FBK0IsTUFBS29CLFVBQXBDLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLCtCQUFxQixNQUFLb0IsVUFBMUIsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsNEJBQWtCLE1BQUtvQixVQUF2QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSxpQ0FBdUIsTUFBS29CLFVBQTVCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGlDQUF1QixNQUFLb0IsVUFBNUIsQ0FBYjs7QUFFQSxZQUFNWixXQUFXYyxNQUFYLENBQWtCQyxJQUFsQixDQUF1QmpCLFFBQVFrQixFQUEvQixDQUFOOztBQUVBLFNBQUc7QUFDRCxjQUFNdkIsT0FBTyxNQUFLRSxPQUFMLEVBQWI7O0FBRUEsY0FBTUYsS0FBS3dCLE9BQUwsQ0FBYSxFQUFDbkIsT0FBRCxFQUFVRSxVQUFWLEVBQWIsQ0FBTjtBQUNELE9BSkQsUUFJUyxNQUFLVCxNQUFMLENBQVkyQixNQUpyQjs7QUFNQUMsY0FBUUMsR0FBUixDQUFZLFFBQVosRUFBc0IsZ0NBQWlCLElBQUlqQixJQUFKLEdBQVdDLE9BQVgsS0FBdUJGLEtBQXhDLENBQXRCO0FBekJtRDtBQTBCcEQ7QUF2QytCO2tCQUFiYixZIiwiZmlsZSI6InN5bmNocm9uaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFJvbGVzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtcm9sZXMnO1xuaW1wb3J0IERvd25sb2FkTWVtYmVyc2hpcHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1tZW1iZXJzaGlwcyc7XG5pbXBvcnQgRG93bmxvYWRDaG9pY2VMaXN0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWNob2ljZS1saXN0cyc7XG5pbXBvcnQgRG93bmxvYWRDbGFzc2lmaWNhdGlvblNldHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1jbGFzc2lmaWNhdGlvbi1zZXRzJztcbmltcG9ydCBEb3dubG9hZFByb2plY3RzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtcHJvamVjdHMnO1xuaW1wb3J0IERvd25sb2FkRm9ybXMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1mb3Jtcyc7XG5pbXBvcnQgRG93bmxvYWRDaGFuZ2VzZXRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cyc7XG5pbXBvcnQgRG93bmxvYWRBbGxSZWNvcmRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtYWxsLXJlY29yZHMnO1xuXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL2FwaS9jbGllbnQnO1xuXG5pbXBvcnQgaHVtYW5pemVEdXJhdGlvbiBmcm9tICdodW1hbml6ZS1kdXJhdGlvbic7XG5cbi8vIGltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnbWluaWRiJztcbi8vIERhdGFiYXNlLmRlYnVnID0gdHJ1ZTtcblxucmVxdWlyZSgnY29sb3JzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Rhc2tzID0gW107XG4gIH1cblxuICBhZGRUYXNrKHRhc2spIHtcbiAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xuICB9XG5cbiAgcG9wVGFzaygpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bihhY2NvdW50LCBmb3JtTmFtZSwgZGF0YVNvdXJjZSwge2Z1bGxTeW5jfSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRTeW5jKGFjY291bnQpO1xuXG4gICAgdGhpcy5zeW5jU3RhdGUgPSBmdWxsU3luYyA/IFtdIDogSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5yZXNvdXJjZXM7XG4gICAgdGhpcy50YXNrUGFyYW1zID0geyBzeW5jaHJvbml6ZXI6IHRoaXMsIHN5bmNTdGF0ZTogdGhpcy5zeW5jU3RhdGUgfTtcblxuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRSb2xlcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkTWVtYmVyc2hpcHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZENob2ljZUxpc3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRDbGFzc2lmaWNhdGlvblNldHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZFByb2plY3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRGb3Jtcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2hhbmdlc2V0cyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQWxsUmVjb3Jkcyh0aGlzLnRhc2tQYXJhbXMpKTtcblxuICAgIGF3YWl0IGRhdGFTb3VyY2Uuc291cmNlLmxvYWQoYWNjb3VudC5kYik7XG5cbiAgICBkbyB7XG4gICAgICBjb25zdCB0YXNrID0gdGhpcy5wb3BUYXNrKCk7XG5cbiAgICAgIGF3YWl0IHRhc2suZXhlY3V0ZSh7YWNjb3VudCwgZGF0YVNvdXJjZX0pO1xuICAgIH0gd2hpbGUgKHRoaXMuX3Rhc2tzLmxlbmd0aCk7XG5cbiAgICBjb25zb2xlLmxvZygnU3luY2VkJywgaHVtYW5pemVEdXJhdGlvbihuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0KSk7XG4gIH1cbn1cbiJdfQ==