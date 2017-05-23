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

      if (fulcrum.args.clean) {
        yield account.reset();
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
          },
          clean: {
            default: false,
            type: 'boolean',
            describe: 'start a clean sync, all data will be deleted before starting'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3N5bmMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvbnNvbGUiLCJlcnJvciIsImNsZWFuIiwicmVzZXQiLCJzeW5jTG9vcCIsImZ1bGwiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwicmVxdWlyZWQiLCJ0eXBlIiwiZm9yZXZlciIsImRlZmF1bHQiLCJkZXNjcmliZSIsImhhbmRsZXIiLCJmdWxsU3luYyIsInN5bmMiLCJkYXRhU291cmNlIiwiY3JlYXRlRGF0YVNvdXJjZSIsInN5bmNocm9uaXplciIsInJ1biIsImZvcm0iLCJpbnRlcnZhbCIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBOztBQUFBLFNBMEJuQkEsVUExQm1CLHFCQTBCTixhQUFZO0FBQ3ZCLFlBQU0sTUFBS0MsR0FBTCxDQUFTQyxlQUFULEVBQU47O0FBRUEsWUFBTUMsVUFBVSxNQUFNQyxRQUFRQyxZQUFSLENBQXFCRCxRQUFRRSxJQUFSLENBQWFDLEdBQWxDLENBQXRCOztBQUVBLFVBQUlKLFdBQVcsSUFBZixFQUFxQjtBQUNuQkssZ0JBQVFDLEtBQVIsQ0FBYyw4QkFBZCxFQUE4Q0wsUUFBUUUsSUFBUixDQUFhQyxHQUEzRDtBQUNBO0FBQ0Q7O0FBRUQsVUFBSUgsUUFBUUUsSUFBUixDQUFhSSxLQUFqQixFQUF3QjtBQUN0QixjQUFNUCxRQUFRUSxLQUFSLEVBQU47QUFDRDs7QUFFRCxZQUFNLE1BQUtDLFFBQUwsQ0FBY1QsT0FBZCxFQUF1QkMsUUFBUUUsSUFBUixDQUFhTyxJQUFwQyxDQUFOO0FBQ0QsS0F6Q2tCO0FBQUE7O0FBQ2JDLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxNQURRO0FBRWpCQyxjQUFNLHNCQUZXO0FBR2pCQyxpQkFBUztBQUNQWCxlQUFLO0FBQ0hVLGtCQUFNLG1CQURIO0FBRUhFLHNCQUFVLElBRlA7QUFHSEMsa0JBQU07QUFISCxXQURFO0FBTVBDLG1CQUFTO0FBQ1BDLHFCQUFTLEtBREY7QUFFUEYsa0JBQU0sU0FGQztBQUdQRyxzQkFBVTtBQUhILFdBTkY7QUFXUGIsaUJBQU87QUFDTFkscUJBQVMsS0FESjtBQUVMRixrQkFBTSxTQUZEO0FBR0xHLHNCQUFVO0FBSEw7QUFYQSxTQUhRO0FBb0JqQkMsaUJBQVMsT0FBS3hCO0FBcEJHLE9BQVosQ0FBUDtBQURjO0FBdUJmOztBQW1CS1ksVUFBTixDQUFlVCxPQUFmLEVBQXdCc0IsUUFBeEIsRUFBa0M7QUFBQTtBQUNoQyxZQUFNQyxPQUFPLElBQWI7O0FBRUEsWUFBTUMsYUFBYSxNQUFNdkIsUUFBUXdCLGdCQUFSLENBQXlCekIsT0FBekIsQ0FBekI7O0FBRUEsYUFBT3VCLElBQVAsRUFBYTtBQUNYLGNBQU1HLGVBQWUsNEJBQXJCOztBQUVBLGNBQU1BLGFBQWFDLEdBQWIsQ0FBaUIzQixPQUFqQixFQUEwQkMsUUFBUUUsSUFBUixDQUFheUIsSUFBdkMsRUFBNkNKLFVBQTdDLEVBQXlELEVBQUNGLFFBQUQsRUFBekQsQ0FBTjs7QUFFQUEsbUJBQVcsS0FBWDs7QUFFQSxZQUFJLENBQUNyQixRQUFRRSxJQUFSLENBQWFlLE9BQWxCLEVBQTJCO0FBQ3pCO0FBQ0Q7O0FBRUQsY0FBTVcsV0FBVzVCLFFBQVFFLElBQVIsQ0FBYTBCLFFBQWIsR0FBeUIsQ0FBQzVCLFFBQVFFLElBQVIsQ0FBYTBCLFFBQWQsR0FBeUIsSUFBbEQsR0FBMEQsS0FBM0U7O0FBRUEsY0FBTSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRDtBQUFBLGlCQUFhQyxXQUFXRCxPQUFYLEVBQW9CRixRQUFwQixDQUFiO0FBQUEsU0FBWixDQUFOO0FBQ0Q7QUFuQitCO0FBb0JqQztBQS9Ea0IsQyIsImZpbGUiOiJzeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFN5bmNocm9uaXplciBmcm9tICcuLi9zeW5jL3N5bmNocm9uaXplcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3N5bmMnLFxuICAgICAgZGVzYzogJ3N5bmMgYW4gb3JnYW5pemF0aW9uJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgb3JnOiB7XG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBmb3JldmVyOiB7XG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaWJlOiAna2VlcCB0aGUgc3luYyBydW5uaW5nIGZvcmV2ZXInXG4gICAgICAgIH0sXG4gICAgICAgIGNsZWFuOiB7XG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIGRlc2NyaWJlOiAnc3RhcnQgYSBjbGVhbiBzeW5jLCBhbGwgZGF0YSB3aWxsIGJlIGRlbGV0ZWQgYmVmb3JlIHN0YXJ0aW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xuXG4gICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IGZ1bGNydW0uZmV0Y2hBY2NvdW50KGZ1bGNydW0uYXJncy5vcmcpO1xuXG4gICAgaWYgKGFjY291bnQgPT0gbnVsbCkge1xuICAgICAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGZpbmQgb3JnYW5pemF0aW9uOicsIGZ1bGNydW0uYXJncy5vcmcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChmdWxjcnVtLmFyZ3MuY2xlYW4pIHtcbiAgICAgIGF3YWl0IGFjY291bnQucmVzZXQoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0aGlzLnN5bmNMb29wKGFjY291bnQsIGZ1bGNydW0uYXJncy5mdWxsKTtcbiAgfVxuXG4gIGFzeW5jIHN5bmNMb29wKGFjY291bnQsIGZ1bGxTeW5jKSB7XG4gICAgY29uc3Qgc3luYyA9IHRydWU7XG5cbiAgICBjb25zdCBkYXRhU291cmNlID0gYXdhaXQgZnVsY3J1bS5jcmVhdGVEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgd2hpbGUgKHN5bmMpIHtcbiAgICAgIGNvbnN0IHN5bmNocm9uaXplciA9IG5ldyBTeW5jaHJvbml6ZXIoKTtcblxuICAgICAgYXdhaXQgc3luY2hyb25pemVyLnJ1bihhY2NvdW50LCBmdWxjcnVtLmFyZ3MuZm9ybSwgZGF0YVNvdXJjZSwge2Z1bGxTeW5jfSk7XG5cbiAgICAgIGZ1bGxTeW5jID0gZmFsc2U7XG5cbiAgICAgIGlmICghZnVsY3J1bS5hcmdzLmZvcmV2ZXIpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGludGVydmFsID0gZnVsY3J1bS5hcmdzLmludGVydmFsID8gKCtmdWxjcnVtLmFyZ3MuaW50ZXJ2YWwgKiAxMDAwKSA6IDE1MDAwO1xuXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbCkpO1xuICAgIH1cbiAgfVxufVxuIl19