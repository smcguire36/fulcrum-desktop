'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _synchronizer = require('../sync/synchronizer');

var _synchronizer2 = _interopRequireDefault(_synchronizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      yield _this.app.activatePlugins();

      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      if (account == null) {
        console.error('Unable to find organization:', fulcrum.args.org);
        return;
      }

      yield _this.syncLoop(account, fulcrum.args.full);
    });
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'sync',
        desc: 'sync an organization',
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          },
          forever: {
            default: false,
            type: 'boolean',
            describe: 'keep the sync running forever'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

  syncLoop(account, fullSync) {
    return _asyncToGenerator(function* () {
      const sync = true;

      const dataSource = yield fulcrum.createDataSource(account);

      while (sync) {
        const synchronizer = new _synchronizer2.default();

        yield synchronizer.run(account, fulcrum.args.form, dataSource, { fullSync });

        fullSync = false;

        if (!fulcrum.args.forever) {
          break;
        }

        const interval = fulcrum.args.interval ? +fulcrum.args.interval * 1000 : 15000;

        yield new Promise(function (resolve) {
          return setTimeout(resolve, interval);
        });
      }
    })();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3N5bmMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvbnNvbGUiLCJlcnJvciIsInN5bmNMb29wIiwiZnVsbCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsInR5cGUiLCJmb3JldmVyIiwiZGVmYXVsdCIsImRlc2NyaWJlIiwiaGFuZGxlciIsImZ1bGxTeW5jIiwic3luYyIsImRhdGFTb3VyY2UiLCJjcmVhdGVEYXRhU291cmNlIiwic3luY2hyb25pemVyIiwicnVuIiwiZm9ybSIsImludGVydmFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUE7O0FBQUEsU0FxQm5CQSxVQXJCbUIscUJBcUJOLGFBQVk7QUFDdkIsWUFBTSxNQUFLQyxHQUFMLENBQVNDLGVBQVQsRUFBTjs7QUFFQSxZQUFNQyxVQUFVLE1BQU1DLFFBQVFDLFlBQVIsQ0FBcUJELFFBQVFFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsVUFBSUosV0FBVyxJQUFmLEVBQXFCO0FBQ25CSyxnQkFBUUMsS0FBUixDQUFjLDhCQUFkLEVBQThDTCxRQUFRRSxJQUFSLENBQWFDLEdBQTNEO0FBQ0E7QUFDRDs7QUFFRCxZQUFNLE1BQUtHLFFBQUwsQ0FBY1AsT0FBZCxFQUF1QkMsUUFBUUUsSUFBUixDQUFhSyxJQUFwQyxDQUFOO0FBQ0QsS0FoQ2tCO0FBQUE7O0FBQ2JDLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxNQURRO0FBRWpCQyxjQUFNLHNCQUZXO0FBR2pCQyxpQkFBUztBQUNQVCxlQUFLO0FBQ0hRLGtCQUFNLG1CQURIO0FBRUhFLHNCQUFVLElBRlA7QUFHSEMsa0JBQU07QUFISCxXQURFO0FBTVBDLG1CQUFTO0FBQ1BDLHFCQUFTLEtBREY7QUFFUEYsa0JBQU0sU0FGQztBQUdQRyxzQkFBVTtBQUhIO0FBTkYsU0FIUTtBQWVqQkMsaUJBQVMsT0FBS3RCO0FBZkcsT0FBWixDQUFQO0FBRGM7QUFrQmY7O0FBZUtVLFVBQU4sQ0FBZVAsT0FBZixFQUF3Qm9CLFFBQXhCLEVBQWtDO0FBQUE7QUFDaEMsWUFBTUMsT0FBTyxJQUFiOztBQUVBLFlBQU1DLGFBQWEsTUFBTXJCLFFBQVFzQixnQkFBUixDQUF5QnZCLE9BQXpCLENBQXpCOztBQUVBLGFBQU9xQixJQUFQLEVBQWE7QUFDWCxjQUFNRyxlQUFlLDRCQUFyQjs7QUFFQSxjQUFNQSxhQUFhQyxHQUFiLENBQWlCekIsT0FBakIsRUFBMEJDLFFBQVFFLElBQVIsQ0FBYXVCLElBQXZDLEVBQTZDSixVQUE3QyxFQUF5RCxFQUFDRixRQUFELEVBQXpELENBQU47O0FBRUFBLG1CQUFXLEtBQVg7O0FBRUEsWUFBSSxDQUFDbkIsUUFBUUUsSUFBUixDQUFhYSxPQUFsQixFQUEyQjtBQUN6QjtBQUNEOztBQUVELGNBQU1XLFdBQVcxQixRQUFRRSxJQUFSLENBQWF3QixRQUFiLEdBQXlCLENBQUMxQixRQUFRRSxJQUFSLENBQWF3QixRQUFkLEdBQXlCLElBQWxELEdBQTBELEtBQTNFOztBQUVBLGNBQU0sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxpQkFBYUMsV0FBV0QsT0FBWCxFQUFvQkYsUUFBcEIsQ0FBYjtBQUFBLFNBQVosQ0FBTjtBQUNEO0FBbkIrQjtBQW9CakM7QUF0RGtCLEMiLCJmaWxlIjoic3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTeW5jaHJvbml6ZXIgZnJvbSAnLi4vc3luYy9zeW5jaHJvbml6ZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdzeW5jJyxcbiAgICAgIGRlc2M6ICdzeW5jIGFuIG9yZ2FuaXphdGlvbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG9yZzoge1xuICAgICAgICAgIGRlc2M6ICdvcmdhbml6YXRpb24gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgZm9yZXZlcjoge1xuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICBkZXNjcmliZTogJ2tlZXAgdGhlIHN5bmMgcnVubmluZyBmb3JldmVyJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xuXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGZ1bGNydW0uZmV0Y2hBY2NvdW50KGZ1bGNydW0uYXJncy5vcmcpO1xuXG4gICAgaWYgKGFjY291bnQgPT0gbnVsbCkge1xuICAgICAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGZpbmQgb3JnYW5pemF0aW9uOicsIGZ1bGNydW0uYXJncy5vcmcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc3luY0xvb3AoYWNjb3VudCwgZnVsY3J1bS5hcmdzLmZ1bGwpO1xuICB9XG5cbiAgYXN5bmMgc3luY0xvb3AoYWNjb3VudCwgZnVsbFN5bmMpIHtcbiAgICBjb25zdCBzeW5jID0gdHJ1ZTtcblxuICAgIGNvbnN0IGRhdGFTb3VyY2UgPSBhd2FpdCBmdWxjcnVtLmNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICB3aGlsZSAoc3luYykge1xuICAgICAgY29uc3Qgc3luY2hyb25pemVyID0gbmV3IFN5bmNocm9uaXplcigpO1xuXG4gICAgICBhd2FpdCBzeW5jaHJvbml6ZXIucnVuKGFjY291bnQsIGZ1bGNydW0uYXJncy5mb3JtLCBkYXRhU291cmNlLCB7ZnVsbFN5bmN9KTtcblxuICAgICAgZnVsbFN5bmMgPSBmYWxzZTtcblxuICAgICAgaWYgKCFmdWxjcnVtLmFyZ3MuZm9yZXZlcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW50ZXJ2YWwgPSBmdWxjcnVtLmFyZ3MuaW50ZXJ2YWwgPyAoK2Z1bGNydW0uYXJncy5pbnRlcnZhbCAqIDEwMDApIDogMTUwMDA7XG5cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsKSk7XG4gICAgfVxuICB9XG59XG4iXX0=