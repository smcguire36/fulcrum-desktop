'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(_path2.default.dirname(pluginPath));

        try {
          console.log('Installing dependencies...', pluginPath);

          yield _yarn2.default.run('install', { cwd: pluginDir });

          console.log('Compiling plugin...', pluginPath);

          yield _yarn2.default.run('build', { cwd: pluginDir });

          console.log('Plugin built.\n\n');
        } catch (ex) {
          console.error('Error building plugin', pluginPath, ex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2J1aWxkLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicGx1Z2luUGF0aCIsInBsdWdpbkRpciIsInJlc29sdmUiLCJkaXJuYW1lIiwiY29uc29sZSIsImxvZyIsInJ1biIsImN3ZCIsImV4IiwiZXJyb3IiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBU25CQSxVQVRtQixxQkFTTixhQUFZO0FBQ3ZCLFlBQU1DLGNBQWMsZUFBS0MsSUFBTCxDQUFVLGVBQUtDLElBQUwsQ0FBVUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVixFQUFrQyxHQUFsQyxFQUF1QyxXQUF2QyxDQUFWLENBQXBCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5QkwsV0FBekIsRUFBc0M7QUFDcEMsY0FBTU0sWUFBWSxlQUFLQyxPQUFMLENBQWEsZUFBS0MsT0FBTCxDQUFhSCxVQUFiLENBQWIsQ0FBbEI7O0FBRUEsWUFBSTtBQUNGSSxrQkFBUUMsR0FBUixDQUFZLDRCQUFaLEVBQTBDTCxVQUExQzs7QUFFQSxnQkFBTSxlQUFLTSxHQUFMLENBQVMsU0FBVCxFQUFvQixFQUFDQyxLQUFLTixTQUFOLEVBQXBCLENBQU47O0FBRUFHLGtCQUFRQyxHQUFSLENBQVkscUJBQVosRUFBbUNMLFVBQW5DOztBQUVBLGdCQUFNLGVBQUtNLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEVBQUNDLEtBQUtOLFNBQU4sRUFBbEIsQ0FBTjs7QUFFQUcsa0JBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNELFNBVkQsQ0FVRSxPQUFPRyxFQUFQLEVBQVc7QUFDWEosa0JBQVFLLEtBQVIsQ0FBYyx1QkFBZCxFQUF1Q1QsVUFBdkMsRUFBbURRLEVBQW5EO0FBQ0Q7QUFDRjtBQUNGLEtBN0JrQjtBQUFBOztBQUNiRSxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxtQkFGVztBQUdqQkMsaUJBQVMsTUFBS3BCO0FBSEcsT0FBWixDQUFQO0FBRGM7QUFNZjs7QUFQa0IsQyIsImZpbGUiOiJidWlsZC1wbHVnaW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdidWlsZC1wbHVnaW5zJyxcbiAgICAgIGRlc2M6ICdidWlsZCBhbGwgcGx1Z2lucycsXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGx1Z2luUGF0aHMgPSBnbG9iLnN5bmMocGF0aC5qb2luKGZ1bGNydW0uZGlyKCdwbHVnaW5zJyksICcqJywgJ3BsdWdpbi5qcycpKTtcblxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xuICAgICAgY29uc3QgcGx1Z2luRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwbHVnaW5QYXRoKSk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2N3ZDogcGx1Z2luRGlyfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ0NvbXBpbGluZyBwbHVnaW4uLi4nLCBwbHVnaW5QYXRoKTtcblxuICAgICAgICBhd2FpdCB5YXJuLnJ1bignYnVpbGQnLCB7Y3dkOiBwbHVnaW5EaXJ9KTtcblxuICAgICAgICBjb25zb2xlLmxvZygnUGx1Z2luIGJ1aWx0LlxcblxcbicpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYnVpbGRpbmcgcGx1Z2luJywgcGx1Z2luUGF0aCwgZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19