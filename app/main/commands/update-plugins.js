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

var _git = require('../git');

var _git2 = _interopRequireDefault(_git);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(_path2.default.dirname(pluginPath));

        try {
          console.log('Pulling changes...');
          yield _git2.default.pull(pluginDir);

          console.log('Installing dependencies...');

          yield _yarn2.default.run('install', { cwd: pluginDir });

          console.log('Plugin updated.\n\n');
        } catch (ex) {
          console.error('Error updating plugin', pluginPath, ex.toString());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3VwZGF0ZS1wbHVnaW5zLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRocyIsInN5bmMiLCJqb2luIiwiZnVsY3J1bSIsImRpciIsInBsdWdpblBhdGgiLCJwbHVnaW5EaXIiLCJyZXNvbHZlIiwiZGlybmFtZSIsImNvbnNvbGUiLCJsb2ciLCJwdWxsIiwicnVuIiwiY3dkIiwiZXgiLCJlcnJvciIsInRvU3RyaW5nIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBU25CQSxVQVRtQixxQkFTTixhQUFZO0FBQ3ZCLFlBQU1DLGNBQWMsZUFBS0MsSUFBTCxDQUFVLGVBQUtDLElBQUwsQ0FBVUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVixFQUFrQyxHQUFsQyxFQUF1QyxXQUF2QyxDQUFWLENBQXBCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5QkwsV0FBekIsRUFBc0M7QUFDcEMsY0FBTU0sWUFBWSxlQUFLQyxPQUFMLENBQWEsZUFBS0MsT0FBTCxDQUFhSCxVQUFiLENBQWIsQ0FBbEI7O0FBRUEsWUFBSTtBQUNGSSxrQkFBUUMsR0FBUixDQUFZLG9CQUFaO0FBQ0EsZ0JBQU0sY0FBSUMsSUFBSixDQUFTTCxTQUFULENBQU47O0FBRUFHLGtCQUFRQyxHQUFSLENBQVksNEJBQVo7O0FBRUEsZ0JBQU0sZUFBS0UsR0FBTCxDQUFTLFNBQVQsRUFBb0IsRUFBQ0MsS0FBS1AsU0FBTixFQUFwQixDQUFOOztBQUVBRyxrQkFBUUMsR0FBUixDQUFZLHFCQUFaO0FBQ0QsU0FURCxDQVNFLE9BQU9JLEVBQVAsRUFBVztBQUNYTCxrQkFBUU0sS0FBUixDQUFjLHVCQUFkLEVBQXVDVixVQUF2QyxFQUFtRFMsR0FBR0UsUUFBSCxFQUFuRDtBQUNEO0FBQ0Y7QUFDRixLQTVCa0I7QUFBQTs7QUFDYkMsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGdCQURRO0FBRWpCQyxjQUFNLG9CQUZXO0FBR2pCQyxpQkFBUyxNQUFLdEI7QUFIRyxPQUFaLENBQVA7QUFEYztBQU1mOztBQVBrQixDIiwiZmlsZSI6InVwZGF0ZS1wbHVnaW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xuaW1wb3J0IGdpdCBmcm9tICcuLi9naXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICd1cGRhdGUtcGx1Z2lucycsXG4gICAgICBkZXNjOiAndXBkYXRlIGFsbCBwbHVnaW5zJyxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonLCAncGx1Z2luLmpzJykpO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHBsdWdpblBhdGgpKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coJ1B1bGxpbmcgY2hhbmdlcy4uLicpO1xuICAgICAgICBhd2FpdCBnaXQucHVsbChwbHVnaW5EaXIpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicpO1xuXG4gICAgICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2N3ZDogcGx1Z2luRGlyfSk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ1BsdWdpbiB1cGRhdGVkLlxcblxcbicpO1xuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdXBkYXRpbmcgcGx1Z2luJywgcGx1Z2luUGF0aCwgZXgudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=