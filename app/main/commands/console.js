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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NvbnNvbGUuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvZGUiLCJmaWxlIiwicmVhZEZpbGVTeW5jIiwidG9TdHJpbmciLCJldmFsIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwidmVyc2lvbiIsImRhdGFiYXNlRmlsZVBhdGgiLCJzZXJ2ZXIiLCJzdGFydCIsInByb21wdCIsInRlcm1pbmFsIiwiY29udGV4dCIsIlByb21pc2UiLCJyZXNvbHZlIiwib24iLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUE7O0FBQUEsU0F1Qm5CQSxVQXZCbUIscUJBdUJOLGFBQVk7QUFDdkIsWUFBTSxNQUFLQyxHQUFMLENBQVNDLGVBQVQsRUFBTjs7QUFFQSxZQUFNQyxVQUFVLE1BQU1DLFFBQVFDLFlBQVIsQ0FBcUJELFFBQVFFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsWUFBTUMsT0FBT0osUUFBUUUsSUFBUixDQUFhRyxJQUFiLEdBQW9CLGFBQUdDLFlBQUgsQ0FBZ0JOLFFBQVFFLElBQVIsQ0FBYUcsSUFBN0IsRUFBbUNFLFFBQW5DLEVBQXBCLEdBQW9FUCxRQUFRRSxJQUFSLENBQWFFLElBQTlGOztBQUVBLFVBQUlBLElBQUosRUFBVTtBQUNSSSxhQUFLSixJQUFMO0FBQ0E7QUFDRDs7QUFFREssY0FBUUMsR0FBUixDQUFZLEVBQVo7QUFDQUQsY0FBUUMsR0FBUixDQUFZLFVBQVVDLEtBQXRCLEVBQTZCLGtCQUFJQyxPQUFKLENBQVlELEtBQXpDLEVBQWdEWCxRQUFRYSxnQkFBeEQ7QUFDQUosY0FBUUMsR0FBUixDQUFZLEVBQVo7O0FBRUEsWUFBTUksU0FBUyxlQUFLQyxLQUFMLENBQVcsRUFBQ0MsUUFBUSxJQUFULEVBQWVDLFVBQVUsSUFBekIsRUFBWCxDQUFmOztBQUVBSCxhQUFPSSxPQUFQLENBQWVuQixPQUFmLEdBQXlCQSxPQUF6QjtBQUNBZSxhQUFPSSxPQUFQLENBQWVyQixHQUFmLEdBQXFCLE1BQUtBLEdBQTFCOztBQUVBO0FBQ0EsWUFBTSxJQUFJc0IsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM3Qk4sZUFBT08sRUFBUCxDQUFVLE1BQVYsRUFBa0JELE9BQWxCO0FBQ0QsT0FGSyxDQUFOO0FBR0QsS0FoRGtCO0FBQUE7O0FBQ2JFLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxTQURRO0FBRWpCQyxjQUFNLGlCQUZXO0FBR2pCQyxpQkFBUztBQUNQdkIsZUFBSztBQUNIc0Isa0JBQU0sbUJBREg7QUFFSEUsa0JBQU07QUFGSCxXQURFO0FBS1B0QixnQkFBTTtBQUNKb0Isa0JBQU0saUJBREY7QUFFSkUsa0JBQU07QUFGRixXQUxDO0FBU1B2QixnQkFBTTtBQUNKcUIsa0JBQU0saUJBREY7QUFFSkUsa0JBQU07QUFGRjtBQVRDLFNBSFE7QUFpQmpCQyxpQkFBUyxPQUFLaEM7QUFqQkcsT0FBWixDQUFQO0FBRGM7QUFvQmY7O0FBckJrQixDIiwiZmlsZSI6ImNvbnNvbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVwbCBmcm9tICdyZXBsJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGtnIGZyb20gJy4uLy4uL3ZlcnNpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdjb25zb2xlJyxcbiAgICAgIGRlc2M6ICdydW4gdGhlIGNvbnNvbGUnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGZpbGU6IHtcbiAgICAgICAgICBkZXNjOiAnZmlsZSB0byBleGVjdXRlJyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9LFxuICAgICAgICBjb2RlOiB7XG4gICAgICAgICAgZGVzYzogJ2NvZGUgdG8gZXhlY3V0ZScsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB0aGlzLmFwcC5hY3RpdmF0ZVBsdWdpbnMoKTtcblxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcblxuICAgIGNvbnN0IGNvZGUgPSBmdWxjcnVtLmFyZ3MuZmlsZSA/IGZzLnJlYWRGaWxlU3luYyhmdWxjcnVtLmFyZ3MuZmlsZSkudG9TdHJpbmcoKSA6IGZ1bGNydW0uYXJncy5jb2RlO1xuXG4gICAgaWYgKGNvZGUpIHtcbiAgICAgIGV2YWwoY29kZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJycpO1xuICAgIGNvbnNvbGUubG9nKCdGdWxjcnVtJy5ncmVlbiwgcGtnLnZlcnNpb24uZ3JlZW4sIGZ1bGNydW0uZGF0YWJhc2VGaWxlUGF0aCk7XG4gICAgY29uc29sZS5sb2coJycpO1xuXG4gICAgY29uc3Qgc2VydmVyID0gcmVwbC5zdGFydCh7cHJvbXB0OiAnPiAnLCB0ZXJtaW5hbDogdHJ1ZX0pO1xuXG4gICAgc2VydmVyLmNvbnRleHQuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgc2VydmVyLmNvbnRleHQuYXBwID0gdGhpcy5hcHA7XG5cbiAgICAvLyB0aGUgcHJvY2VzcyBxdWl0cyBpbW1lZGlhdGVseSB1bmxlc3Mgd2Ugd2lyZSB1cCBhbiBleGl0IGV2ZW50XG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHNlcnZlci5vbignZXhpdCcsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=