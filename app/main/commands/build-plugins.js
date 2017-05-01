'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(_path2.default.dirname(pluginPath));

        const commands = [];

        commands.push('yarn');
        commands.push('yarn build');

        const string = commands.join(' && ');

        console.log('Building plugin...', pluginPath);

        try {
          const result = (0, _child_process.execSync)(string, { cwd: pluginDir, env: _pluginEnv2.default });
          console.log(result.toString());
          console.log('Plugin built.\n\n');
        } catch (ex) {
          console.error('Error building plugin', pluginPath, ex.stderr.toString());
        }
      }
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'build-plugins',
        desc: 'build all plugins',
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2J1aWxkLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicGx1Z2luUGF0aCIsInBsdWdpbkRpciIsInJlc29sdmUiLCJkaXJuYW1lIiwiY29tbWFuZHMiLCJwdXNoIiwic3RyaW5nIiwiY29uc29sZSIsImxvZyIsInJlc3VsdCIsImN3ZCIsImVudiIsInRvU3RyaW5nIiwiZXgiLCJlcnJvciIsInN0ZGVyciIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FTbkJBLFVBVG1CLHFCQVNOLGFBQVk7QUFDdkIsWUFBTUMsY0FBYyxlQUFLQyxJQUFMLENBQVUsZUFBS0MsSUFBTCxDQUFVQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWLEVBQWtDLEdBQWxDLEVBQXVDLFdBQXZDLENBQVYsQ0FBcEI7O0FBRUEsV0FBSyxNQUFNQyxVQUFYLElBQXlCTCxXQUF6QixFQUFzQztBQUNwQyxjQUFNTSxZQUFZLGVBQUtDLE9BQUwsQ0FBYSxlQUFLQyxPQUFMLENBQWFILFVBQWIsQ0FBYixDQUFsQjs7QUFFQSxjQUFNSSxXQUFXLEVBQWpCOztBQUVBQSxpQkFBU0MsSUFBVCxDQUFjLE1BQWQ7QUFDQUQsaUJBQVNDLElBQVQsQ0FBYyxZQUFkOztBQUVBLGNBQU1DLFNBQVNGLFNBQVNQLElBQVQsQ0FBYyxNQUFkLENBQWY7O0FBRUFVLGdCQUFRQyxHQUFSLENBQVksb0JBQVosRUFBa0NSLFVBQWxDOztBQUVBLFlBQUk7QUFDRixnQkFBTVMsU0FBUyw2QkFBU0gsTUFBVCxFQUFpQixFQUFDSSxLQUFLVCxTQUFOLEVBQWlCVSx3QkFBakIsRUFBakIsQ0FBZjtBQUNBSixrQkFBUUMsR0FBUixDQUFZQyxPQUFPRyxRQUFQLEVBQVo7QUFDQUwsa0JBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNELFNBSkQsQ0FJRSxPQUFPSyxFQUFQLEVBQVc7QUFDWE4sa0JBQVFPLEtBQVIsQ0FBYyx1QkFBZCxFQUF1Q2QsVUFBdkMsRUFBbURhLEdBQUdFLE1BQUgsQ0FBVUgsUUFBVixFQUFuRDtBQUNEO0FBQ0Y7QUFDRixLQWhDa0I7QUFBQTs7QUFDYkksTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGVBRFE7QUFFakJDLGNBQU0sbUJBRlc7QUFHakJDLGlCQUFTLE1BQUsxQjtBQUhHLE9BQVosQ0FBUDtBQURjO0FBTWY7O0FBUGtCLEMiLCJmaWxlIjoiYnVpbGQtcGx1Z2lucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBsdWdpbkVudiBmcm9tICcuLi9wbHVnaW4tZW52JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnYnVpbGQtcGx1Z2lucycsXG4gICAgICBkZXNjOiAnYnVpbGQgYWxsIHBsdWdpbnMnLFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbihmdWxjcnVtLmRpcigncGx1Z2lucycpLCAnKicsICdwbHVnaW4uanMnKSk7XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpblBhdGggb2YgcGx1Z2luUGF0aHMpIHtcbiAgICAgIGNvbnN0IHBsdWdpbkRpciA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUocGx1Z2luUGF0aCkpO1xuXG4gICAgICBjb25zdCBjb21tYW5kcyA9IFtdO1xuXG4gICAgICBjb21tYW5kcy5wdXNoKCd5YXJuJyk7XG4gICAgICBjb21tYW5kcy5wdXNoKCd5YXJuIGJ1aWxkJyk7XG5cbiAgICAgIGNvbnN0IHN0cmluZyA9IGNvbW1hbmRzLmpvaW4oJyAmJiAnKTtcblxuICAgICAgY29uc29sZS5sb2coJ0J1aWxkaW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBleGVjU3luYyhzdHJpbmcsIHtjd2Q6IHBsdWdpbkRpciwgZW52OiBwbHVnaW5FbnZ9KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIGJ1aWx0LlxcblxcbicpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYnVpbGRpbmcgcGx1Z2luJywgcGx1Z2luUGF0aCwgZXguc3RkZXJyLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19