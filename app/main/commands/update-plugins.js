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

var _pluginLogger = require('../plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(_path2.default.dirname(pluginPath));

        const logger = (0, _pluginLogger2.default)(pluginDir);

        try {
          logger.log('Pulling changes...');

          yield _git2.default.pull(pluginDir);

          logger.log('Installing dependencies...');

          yield _yarn2.default.run('install', { cwd: pluginDir, logger });

          logger.log('Plugin updated.');
        } catch (ex) {
          logger.error('Error updating plugin', pluginPath, ex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3VwZGF0ZS1wbHVnaW5zLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRocyIsInN5bmMiLCJqb2luIiwiZnVsY3J1bSIsImRpciIsInBsdWdpblBhdGgiLCJwbHVnaW5EaXIiLCJyZXNvbHZlIiwiZGlybmFtZSIsImxvZ2dlciIsImxvZyIsInB1bGwiLCJydW4iLCJjd2QiLCJleCIsImVycm9yIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FTbkJBLFVBVG1CLHFCQVNOLGFBQVk7QUFDdkIsWUFBTUMsY0FBYyxlQUFLQyxJQUFMLENBQVUsZUFBS0MsSUFBTCxDQUFVQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWLEVBQWtDLEdBQWxDLEVBQXVDLFdBQXZDLENBQVYsQ0FBcEI7O0FBRUEsV0FBSyxNQUFNQyxVQUFYLElBQXlCTCxXQUF6QixFQUFzQztBQUNwQyxjQUFNTSxZQUFZLGVBQUtDLE9BQUwsQ0FBYSxlQUFLQyxPQUFMLENBQWFILFVBQWIsQ0FBYixDQUFsQjs7QUFFQSxjQUFNSSxTQUFTLDRCQUFhSCxTQUFiLENBQWY7O0FBRUEsWUFBSTtBQUNGRyxpQkFBT0MsR0FBUCxDQUFXLG9CQUFYOztBQUVBLGdCQUFNLGNBQUlDLElBQUosQ0FBU0wsU0FBVCxDQUFOOztBQUVBRyxpQkFBT0MsR0FBUCxDQUFXLDRCQUFYOztBQUVBLGdCQUFNLGVBQUtFLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLEtBQUtQLFNBQU4sRUFBaUJHLE1BQWpCLEVBQXBCLENBQU47O0FBRUFBLGlCQUFPQyxHQUFQLENBQVcsaUJBQVg7QUFDRCxTQVZELENBVUUsT0FBT0ksRUFBUCxFQUFXO0FBQ1hMLGlCQUFPTSxLQUFQLENBQWEsdUJBQWIsRUFBc0NWLFVBQXRDLEVBQWtEUyxFQUFsRDtBQUNEO0FBQ0Y7QUFDRixLQS9Ca0I7QUFBQTs7QUFDYkUsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGdCQURRO0FBRWpCQyxjQUFNLG9CQUZXO0FBR2pCQyxpQkFBUyxNQUFLckI7QUFIRyxPQUFaLENBQVA7QUFEYztBQU1mOztBQVBrQixDIiwiZmlsZSI6InVwZGF0ZS1wbHVnaW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xyXG5pbXBvcnQgeWFybiBmcm9tICcuLi95YXJuJztcclxuaW1wb3J0IGdpdCBmcm9tICcuLi9naXQnO1xyXG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGFzeW5jIHRhc2soY2xpKSB7XHJcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gICAgICBjb21tYW5kOiAndXBkYXRlLXBsdWdpbnMnLFxyXG4gICAgICBkZXNjOiAndXBkYXRlIGFsbCBwbHVnaW5zJyxcclxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonLCAncGx1Z2luLmpzJykpO1xyXG5cclxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xyXG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHBsdWdpblBhdGgpKTtcclxuXHJcbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5EaXIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsb2dnZXIubG9nKCdQdWxsaW5nIGNoYW5nZXMuLi4nKTtcclxuXHJcbiAgICAgICAgYXdhaXQgZ2l0LnB1bGwocGx1Z2luRGlyKTtcclxuXHJcbiAgICAgICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcclxuXHJcbiAgICAgICAgYXdhaXQgeWFybi5ydW4oJ2luc3RhbGwnLCB7Y3dkOiBwbHVnaW5EaXIsIGxvZ2dlcn0pO1xyXG5cclxuICAgICAgICBsb2dnZXIubG9nKCdQbHVnaW4gdXBkYXRlZC4nKTtcclxuICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICBsb2dnZXIuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHBsdWdpbicsIHBsdWdpblBhdGgsIGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=