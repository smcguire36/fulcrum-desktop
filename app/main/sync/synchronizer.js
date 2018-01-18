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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3N5bmMvc3luY2hyb25pemVyLmpzIl0sIm5hbWVzIjpbIlN5bmNocm9uaXplciIsImNvbnN0cnVjdG9yIiwiX3Rhc2tzIiwiYWRkVGFzayIsInRhc2siLCJwdXNoIiwicG9wVGFzayIsInNoaWZ0IiwicnVuIiwiYWNjb3VudCIsImZvcm1OYW1lIiwiZGF0YVNvdXJjZSIsImZ1bGxTeW5jIiwic3RhcnQiLCJEYXRlIiwiZ2V0VGltZSIsInJlc3BvbnNlIiwiZ2V0U3luYyIsInN5bmNTdGF0ZSIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJyZXNvdXJjZXMiLCJ0YXNrUGFyYW1zIiwic3luY2hyb25pemVyIiwic291cmNlIiwibG9hZCIsImRiIiwiZW1pdCIsInRhc2tzIiwiZXhlY3V0ZSIsImxlbmd0aCIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBRUE7Ozs7Ozs7O0FBRWUsTUFBTUEsWUFBTixDQUFtQjtBQUNoQ0MsZ0JBQWM7QUFDWixTQUFLQyxNQUFMLEdBQWMsRUFBZDtBQUNEOztBQUVEQyxVQUFRQyxJQUFSLEVBQWM7QUFDWixTQUFLRixNQUFMLENBQVlHLElBQVosQ0FBaUJELElBQWpCO0FBQ0Q7O0FBRURFLFlBQVU7QUFDUixXQUFPLEtBQUtKLE1BQUwsQ0FBWUssS0FBWixFQUFQO0FBQ0Q7O0FBRUtDLEtBQU4sQ0FBVUMsT0FBVixFQUFtQkMsUUFBbkIsRUFBNkJDLFVBQTdCLEVBQXlDLEVBQUNDLFFBQUQsRUFBekMsRUFBcUQ7QUFBQTs7QUFBQTtBQUNuRCxZQUFNQyxRQUFRLElBQUlDLElBQUosR0FBV0MsT0FBWCxFQUFkOztBQUVBLFlBQU1DLFdBQVcsTUFBTSxpQkFBT0MsT0FBUCxDQUFlUixPQUFmLENBQXZCOztBQUVBLFlBQUtTLFNBQUwsR0FBaUJOLFdBQVcsRUFBWCxHQUFnQk8sS0FBS0MsS0FBTCxDQUFXSixTQUFTSyxJQUFwQixFQUEwQkMsU0FBM0Q7QUFDQSxZQUFLQyxVQUFMLEdBQWtCLEVBQUVDLG1CQUFGLEVBQXNCTixXQUFXLE1BQUtBLFNBQXRDLEVBQWxCOztBQUVBLFlBQUtmLE9BQUwsQ0FBYSw0QkFBa0IsTUFBS29CLFVBQXZCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGtDQUF3QixNQUFLb0IsVUFBN0IsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsa0NBQXdCLE1BQUtvQixVQUE3QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSx5Q0FBK0IsTUFBS29CLFVBQXBDLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLCtCQUFxQixNQUFLb0IsVUFBMUIsQ0FBYjtBQUNBLFlBQUtwQixPQUFMLENBQWEsNEJBQWtCLE1BQUtvQixVQUF2QixDQUFiO0FBQ0EsWUFBS3BCLE9BQUwsQ0FBYSxpQ0FBdUIsTUFBS29CLFVBQTVCLENBQWI7QUFDQSxZQUFLcEIsT0FBTCxDQUFhLGlDQUF1QixNQUFLb0IsVUFBNUIsQ0FBYjs7QUFFQSxZQUFNWixXQUFXYyxNQUFYLENBQWtCQyxJQUFsQixDQUF1QmpCLFFBQVFrQixFQUEvQixDQUFOOztBQUVBLFlBQU0sY0FBSUMsSUFBSixDQUFTLFlBQVQsRUFBdUIsRUFBQ25CLE9BQUQsRUFBVW9CLE9BQU8sTUFBSzNCLE1BQXRCLEVBQXZCLENBQU47O0FBRUEsU0FBRztBQUNELGNBQU1FLE9BQU8sTUFBS0UsT0FBTCxFQUFiOztBQUVBLGNBQU1GLEtBQUswQixPQUFMLENBQWEsRUFBQ3JCLE9BQUQsRUFBVUUsVUFBVixFQUFiLENBQU47QUFDRCxPQUpELFFBSVMsTUFBS1QsTUFBTCxDQUFZNkIsTUFKckI7O0FBTUEsWUFBTSxjQUFJSCxJQUFKLENBQVMsYUFBVCxFQUF3QixFQUFDbkIsT0FBRCxFQUF4QixDQUFOOztBQUVBdUIsY0FBUUMsR0FBUixDQUFZLFFBQVosRUFBc0IsZ0NBQWlCLElBQUluQixJQUFKLEdBQVdDLE9BQVgsS0FBdUJGLEtBQXhDLENBQXRCO0FBN0JtRDtBQThCcEQ7QUEzQytCO2tCQUFiYixZIiwiZmlsZSI6InN5bmNocm9uaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFJvbGVzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtcm9sZXMnO1xuaW1wb3J0IERvd25sb2FkTWVtYmVyc2hpcHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1tZW1iZXJzaGlwcyc7XG5pbXBvcnQgRG93bmxvYWRDaG9pY2VMaXN0cyBmcm9tICcuL3Rhc2tzL2Rvd25sb2FkLWNob2ljZS1saXN0cyc7XG5pbXBvcnQgRG93bmxvYWRDbGFzc2lmaWNhdGlvblNldHMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1jbGFzc2lmaWNhdGlvbi1zZXRzJztcbmltcG9ydCBEb3dubG9hZFByb2plY3RzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtcHJvamVjdHMnO1xuaW1wb3J0IERvd25sb2FkRm9ybXMgZnJvbSAnLi90YXNrcy9kb3dubG9hZC1mb3Jtcyc7XG5pbXBvcnQgRG93bmxvYWRDaGFuZ2VzZXRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtY2hhbmdlc2V0cyc7XG5pbXBvcnQgRG93bmxvYWRBbGxSZWNvcmRzIGZyb20gJy4vdGFza3MvZG93bmxvYWQtYWxsLXJlY29yZHMnO1xuaW1wb3J0IGFwcCBmcm9tICcuLi9hcHAnO1xuXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL2FwaS9jbGllbnQnO1xuXG5pbXBvcnQgaHVtYW5pemVEdXJhdGlvbiBmcm9tICdodW1hbml6ZS1kdXJhdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9uaXplciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3Rhc2tzID0gW107XG4gIH1cblxuICBhZGRUYXNrKHRhc2spIHtcbiAgICB0aGlzLl90YXNrcy5wdXNoKHRhc2spO1xuICB9XG5cbiAgcG9wVGFzaygpIHtcbiAgICByZXR1cm4gdGhpcy5fdGFza3Muc2hpZnQoKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bihhY2NvdW50LCBmb3JtTmFtZSwgZGF0YVNvdXJjZSwge2Z1bGxTeW5jfSkge1xuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IENsaWVudC5nZXRTeW5jKGFjY291bnQpO1xuXG4gICAgdGhpcy5zeW5jU3RhdGUgPSBmdWxsU3luYyA/IFtdIDogSlNPTi5wYXJzZShyZXNwb25zZS5ib2R5KS5yZXNvdXJjZXM7XG4gICAgdGhpcy50YXNrUGFyYW1zID0geyBzeW5jaHJvbml6ZXI6IHRoaXMsIHN5bmNTdGF0ZTogdGhpcy5zeW5jU3RhdGUgfTtcblxuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRSb2xlcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkTWVtYmVyc2hpcHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZENob2ljZUxpc3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRDbGFzc2lmaWNhdGlvblNldHModGhpcy50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5hZGRUYXNrKG5ldyBEb3dubG9hZFByb2plY3RzKHRoaXMudGFza1BhcmFtcykpO1xuICAgIHRoaXMuYWRkVGFzayhuZXcgRG93bmxvYWRGb3Jtcyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQ2hhbmdlc2V0cyh0aGlzLnRhc2tQYXJhbXMpKTtcbiAgICB0aGlzLmFkZFRhc2sobmV3IERvd25sb2FkQWxsUmVjb3Jkcyh0aGlzLnRhc2tQYXJhbXMpKTtcblxuICAgIGF3YWl0IGRhdGFTb3VyY2Uuc291cmNlLmxvYWQoYWNjb3VudC5kYik7XG5cbiAgICBhd2FpdCBhcHAuZW1pdCgnc3luYzpzdGFydCcsIHthY2NvdW50LCB0YXNrczogdGhpcy5fdGFza3N9KTtcblxuICAgIGRvIHtcbiAgICAgIGNvbnN0IHRhc2sgPSB0aGlzLnBvcFRhc2soKTtcblxuICAgICAgYXdhaXQgdGFzay5leGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSk7XG4gICAgfSB3aGlsZSAodGhpcy5fdGFza3MubGVuZ3RoKTtcblxuICAgIGF3YWl0IGFwcC5lbWl0KCdzeW5jOmZpbmlzaCcsIHthY2NvdW50fSk7XG5cbiAgICBjb25zb2xlLmxvZygnU3luY2VkJywgaHVtYW5pemVEdXJhdGlvbihuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0KSk7XG4gIH1cbn1cbiJdfQ==