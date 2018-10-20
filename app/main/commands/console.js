'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _repl = require('repl');

var _repl2 = _interopRequireDefault(_repl);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _version = require('../../version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      yield _this.app.activatePlugins();

      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      const code = fulcrum.args.file ? _fs2.default.readFileSync(fulcrum.args.file).toString() : fulcrum.args.code;

      if (code) {
        eval(code);
        return;
      }

      console.log('');
      console.log('Fulcrum'.green, _version2.default.version.green, fulcrum.databaseFilePath);
      console.log('');

      const server = _repl2.default.start({ prompt: '> ', terminal: true });

      server.context.account = account;
      server.context.app = _this.app;

      // the process quits immediately unless we wire up an exit event
      yield new Promise(function (resolve) {
        server.on('exit', resolve);
      });
    });
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'console',
        desc: 'run the console',
        builder: {
          org: {
            desc: 'organization name',
            type: 'string'
          },
          file: {
            desc: 'file to execute',
            type: 'string'
          },
          code: {
            desc: 'code to execute',
            type: 'string'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NvbnNvbGUuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvZGUiLCJmaWxlIiwicmVhZEZpbGVTeW5jIiwidG9TdHJpbmciLCJldmFsIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwidmVyc2lvbiIsImRhdGFiYXNlRmlsZVBhdGgiLCJzZXJ2ZXIiLCJzdGFydCIsInByb21wdCIsInRlcm1pbmFsIiwiY29udGV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwib24iLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUE7O0FBQUEsU0F1Qm5CQSxVQXZCbUIscUJBdUJOLGFBQVk7QUFDdkIsWUFBTSxNQUFLQyxHQUFMLENBQVNDLGVBQVQsRUFBTjs7QUFFQSxZQUFNQyxVQUFVLE1BQU1DLFFBQVFDLFlBQVIsQ0FBcUJELFFBQVFFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsWUFBTUMsT0FBT0osUUFBUUUsSUFBUixDQUFhRyxJQUFiLEdBQW9CLGFBQUdDLFlBQUgsQ0FBZ0JOLFFBQVFFLElBQVIsQ0FBYUcsSUFBN0IsRUFBbUNFLFFBQW5DLEVBQXBCLEdBQW9FUCxRQUFRRSxJQUFSLENBQWFFLElBQTlGOztBQUVBLFVBQUlBLElBQUosRUFBVTtBQUNSSSxhQUFLSixJQUFMO0FBQ0E7QUFDRDs7QUFFREssY0FBUUMsR0FBUixDQUFZLEVBQVo7QUFDQUQsY0FBUUMsR0FBUixDQUFZLFVBQVVDLEtBQXRCLEVBQTZCLGtCQUFJQyxPQUFKLENBQVlELEtBQXpDLEVBQWdEWCxRQUFRYSxnQkFBeEQ7QUFDQUosY0FBUUMsR0FBUixDQUFZLEVBQVo7O0FBRUEsWUFBTUksU0FBUyxlQUFLQyxLQUFMLENBQVcsRUFBQ0MsUUFBUSxJQUFULEVBQWVDLFVBQVUsSUFBekIsRUFBWCxDQUFmOztBQUVBSCxhQUFPSSxPQUFQLENBQWVuQixPQUFmLEdBQXlCQSxPQUF6QjtBQUNBZSxhQUFPSSxPQUFQLENBQWVyQixHQUFmLEdBQXFCLE1BQUtBLEdBQTFCOztBQUVBO0FBQ0EsWUFBTSxJQUFJc0IsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM3Qk4sZUFBT08sRUFBUCxDQUFVLE1BQVYsRUFBa0JELE9BQWxCO0FBQ0QsT0FGSyxDQUFOO0FBR0QsS0FoRGtCO0FBQUE7O0FBQ2JFLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxTQURRO0FBRWpCQyxjQUFNLGlCQUZXO0FBR2pCQyxpQkFBUztBQUNQdkIsZUFBSztBQUNIc0Isa0JBQU0sbUJBREg7QUFFSEUsa0JBQU07QUFGSCxXQURFO0FBS1B0QixnQkFBTTtBQUNKb0Isa0JBQU0saUJBREY7QUFFSkUsa0JBQU07QUFGRixXQUxDO0FBU1B2QixnQkFBTTtBQUNKcUIsa0JBQU0saUJBREY7QUFFSkUsa0JBQU07QUFGRjtBQVRDLFNBSFE7QUFpQmpCQyxpQkFBUyxPQUFLaEM7QUFqQkcsT0FBWixDQUFQO0FBRGM7QUFvQmY7O0FBckJrQixDIiwiZmlsZSI6ImNvbnNvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVwbCBmcm9tICdyZXBsJztcclxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0IHBrZyBmcm9tICcuLi8uLi92ZXJzaW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBhc3luYyB0YXNrKGNsaSkge1xyXG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcclxuICAgICAgY29tbWFuZDogJ2NvbnNvbGUnLFxyXG4gICAgICBkZXNjOiAncnVuIHRoZSBjb25zb2xlJyxcclxuICAgICAgYnVpbGRlcjoge1xyXG4gICAgICAgIG9yZzoge1xyXG4gICAgICAgICAgZGVzYzogJ29yZ2FuaXphdGlvbiBuYW1lJyxcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmaWxlOiB7XHJcbiAgICAgICAgICBkZXNjOiAnZmlsZSB0byBleGVjdXRlJyxcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2RlOiB7XHJcbiAgICAgICAgICBkZXNjOiAnY29kZSB0byBleGVjdXRlJyxcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xyXG5cclxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcclxuXHJcbiAgICBjb25zdCBjb2RlID0gZnVsY3J1bS5hcmdzLmZpbGUgPyBmcy5yZWFkRmlsZVN5bmMoZnVsY3J1bS5hcmdzLmZpbGUpLnRvU3RyaW5nKCkgOiBmdWxjcnVtLmFyZ3MuY29kZTtcclxuXHJcbiAgICBpZiAoY29kZSkge1xyXG4gICAgICBldmFsKGNvZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS5sb2coJycpO1xyXG4gICAgY29uc29sZS5sb2coJ0Z1bGNydW0nLmdyZWVuLCBwa2cudmVyc2lvbi5ncmVlbiwgZnVsY3J1bS5kYXRhYmFzZUZpbGVQYXRoKTtcclxuICAgIGNvbnNvbGUubG9nKCcnKTtcclxuXHJcbiAgICBjb25zdCBzZXJ2ZXIgPSByZXBsLnN0YXJ0KHtwcm9tcHQ6ICc+ICcsIHRlcm1pbmFsOiB0cnVlfSk7XHJcblxyXG4gICAgc2VydmVyLmNvbnRleHQuYWNjb3VudCA9IGFjY291bnQ7XHJcbiAgICBzZXJ2ZXIuY29udGV4dC5hcHAgPSB0aGlzLmFwcDtcclxuXHJcbiAgICAvLyB0aGUgcHJvY2VzcyBxdWl0cyBpbW1lZGlhdGVseSB1bmxlc3Mgd2Ugd2lyZSB1cCBhbiBleGl0IGV2ZW50XHJcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICBzZXJ2ZXIub24oJ2V4aXQnLCByZXNvbHZlKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=