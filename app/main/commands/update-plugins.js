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

        commands.push('git pull');
        commands.push('yarn');

        const string = commands.join(' && ');

        console.log('Updating plugin...', pluginPath);

        try {
          const result = (0, _child_process.execSync)(string, { cwd: pluginDir, env: _pluginEnv2.default });
          console.log(result.toString());
          console.log('Plugin updated.\n\n');
        } catch (ex) {
          console.error('Error updating plugin', pluginPath, ex.stderr.toString());
        }
      }
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'update-plugins',
        desc: 'update all plugins',
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3VwZGF0ZS1wbHVnaW5zLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRocyIsInN5bmMiLCJqb2luIiwiZnVsY3J1bSIsImRpciIsInBsdWdpblBhdGgiLCJwbHVnaW5EaXIiLCJyZXNvbHZlIiwiZGlybmFtZSIsImNvbW1hbmRzIiwicHVzaCIsInN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJyZXN1bHQiLCJjd2QiLCJlbnYiLCJ0b1N0cmluZyIsImV4IiwiZXJyb3IiLCJzdGRlcnIiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBU25CQSxVQVRtQixxQkFTTixhQUFZO0FBQ3ZCLFlBQU1DLGNBQWMsZUFBS0MsSUFBTCxDQUFVLGVBQUtDLElBQUwsQ0FBVUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVixFQUFrQyxHQUFsQyxFQUF1QyxXQUF2QyxDQUFWLENBQXBCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5QkwsV0FBekIsRUFBc0M7QUFDcEMsY0FBTU0sWUFBWSxlQUFLQyxPQUFMLENBQWEsZUFBS0MsT0FBTCxDQUFhSCxVQUFiLENBQWIsQ0FBbEI7O0FBRUEsY0FBTUksV0FBVyxFQUFqQjs7QUFFQUEsaUJBQVNDLElBQVQsQ0FBYyxVQUFkO0FBQ0FELGlCQUFTQyxJQUFULENBQWMsTUFBZDs7QUFFQSxjQUFNQyxTQUFTRixTQUFTUCxJQUFULENBQWMsTUFBZCxDQUFmOztBQUVBVSxnQkFBUUMsR0FBUixDQUFZLG9CQUFaLEVBQWtDUixVQUFsQzs7QUFFQSxZQUFJO0FBQ0YsZ0JBQU1TLFNBQVMsNkJBQVNILE1BQVQsRUFBaUIsRUFBQ0ksS0FBS1QsU0FBTixFQUFpQlUsd0JBQWpCLEVBQWpCLENBQWY7QUFDQUosa0JBQVFDLEdBQVIsQ0FBWUMsT0FBT0csUUFBUCxFQUFaO0FBQ0FMLGtCQUFRQyxHQUFSLENBQVkscUJBQVo7QUFDRCxTQUpELENBSUUsT0FBT0ssRUFBUCxFQUFXO0FBQ1hOLGtCQUFRTyxLQUFSLENBQWMsdUJBQWQsRUFBdUNkLFVBQXZDLEVBQW1EYSxHQUFHRSxNQUFILENBQVVILFFBQVYsRUFBbkQ7QUFDRDtBQUNGO0FBQ0YsS0FoQ2tCO0FBQUE7O0FBQ2JJLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxnQkFEUTtBQUVqQkMsY0FBTSxvQkFGVztBQUdqQkMsaUJBQVMsTUFBSzFCO0FBSEcsT0FBWixDQUFQO0FBRGM7QUFNZjs7QUFQa0IsQyIsImZpbGUiOiJ1cGRhdGUtcGx1Z2lucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBsdWdpbkVudiBmcm9tICcuLi9wbHVnaW4tZW52JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAndXBkYXRlLXBsdWdpbnMnLFxuICAgICAgZGVzYzogJ3VwZGF0ZSBhbGwgcGx1Z2lucycsXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGx1Z2luUGF0aHMgPSBnbG9iLnN5bmMocGF0aC5qb2luKGZ1bGNydW0uZGlyKCdwbHVnaW5zJyksICcqJywgJ3BsdWdpbi5qcycpKTtcblxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xuICAgICAgY29uc3QgcGx1Z2luRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwbHVnaW5QYXRoKSk7XG5cbiAgICAgIGNvbnN0IGNvbW1hbmRzID0gW107XG5cbiAgICAgIGNvbW1hbmRzLnB1c2goJ2dpdCBwdWxsJyk7XG4gICAgICBjb21tYW5kcy5wdXNoKCd5YXJuJyk7XG5cbiAgICAgIGNvbnN0IHN0cmluZyA9IGNvbW1hbmRzLmpvaW4oJyAmJiAnKTtcblxuICAgICAgY29uc29sZS5sb2coJ1VwZGF0aW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBleGVjU3luYyhzdHJpbmcsIHtjd2Q6IHBsdWdpbkRpciwgZW52OiBwbHVnaW5FbnZ9KTtcbiAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIHVwZGF0ZWQuXFxuXFxuJyk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciB1cGRhdGluZyBwbHVnaW4nLCBwbHVnaW5QYXRoLCBleC5zdGRlcnIudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=