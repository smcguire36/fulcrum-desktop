'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

var _pluginLogger = require('../plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*'));

      const promises = [];

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(pluginPath);

        const logger = (0, _pluginLogger2.default)(pluginDir);

        const parts = pluginPath.split(_path2.default.sep);
        const name = parts[parts.length - 1];

        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        logger.log('Watching plugin...', pluginPath);

        promises.push(_yarn2.default.run('watch', { cwd: pluginDir, logger }));
      }

      yield Promise.all(promises);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'watch-plugins',
        desc: 'watch and recompile all plugins',
        builder: {
          name: {
            desc: 'plugin name to watch',
            type: 'string'
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3dhdGNoLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicHJvbWlzZXMiLCJwbHVnaW5QYXRoIiwicGx1Z2luRGlyIiwicmVzb2x2ZSIsImxvZ2dlciIsInBhcnRzIiwic3BsaXQiLCJzZXAiLCJuYW1lIiwibGVuZ3RoIiwiYXJncyIsImxvZyIsInB1c2giLCJydW4iLCJjd2QiLCJQcm9taXNlIiwiYWxsIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FlbkJBLFVBZm1CLHFCQWVOLGFBQVk7QUFDdkIsWUFBTUMsY0FBYyxlQUFLQyxJQUFMLENBQVUsZUFBS0MsSUFBTCxDQUFVQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWLEVBQWtDLEdBQWxDLENBQVYsQ0FBcEI7O0FBRUEsWUFBTUMsV0FBVyxFQUFqQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJOLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQU1PLFlBQVksZUFBS0MsT0FBTCxDQUFhRixVQUFiLENBQWxCOztBQUVBLGNBQU1HLFNBQVMsNEJBQWFGLFNBQWIsQ0FBZjs7QUFFQSxjQUFNRyxRQUFRSixXQUFXSyxLQUFYLENBQWlCLGVBQUtDLEdBQXRCLENBQWQ7QUFDQSxjQUFNQyxPQUFPSCxNQUFNQSxNQUFNSSxNQUFOLEdBQWUsQ0FBckIsQ0FBYjs7QUFFQSxZQUFJWCxRQUFRWSxJQUFSLENBQWFGLElBQWIsSUFBcUJBLFNBQVNWLFFBQVFZLElBQVIsQ0FBYUYsSUFBL0MsRUFBcUQ7QUFDbkQ7QUFDRDs7QUFFREosZUFBT08sR0FBUCxDQUFXLG9CQUFYLEVBQWlDVixVQUFqQzs7QUFFQUQsaUJBQVNZLElBQVQsQ0FBYyxlQUFLQyxHQUFMLENBQVMsT0FBVCxFQUFrQixFQUFDQyxLQUFLWixTQUFOLEVBQWlCRSxNQUFqQixFQUFsQixDQUFkO0FBQ0Q7O0FBRUQsWUFBTVcsUUFBUUMsR0FBUixDQUFZaEIsUUFBWixDQUFOO0FBQ0QsS0F0Q2tCO0FBQUE7O0FBQ2JpQixNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxpQ0FGVztBQUdqQkMsaUJBQVM7QUFDUGIsZ0JBQU07QUFDSlksa0JBQU0sc0JBREY7QUFFSkUsa0JBQU07QUFGRjtBQURDLFNBSFE7QUFTakJDLGlCQUFTLE1BQUs3QjtBQVRHLE9BQVosQ0FBUDtBQURjO0FBWWY7O0FBYmtCLEMiLCJmaWxlIjoid2F0Y2gtcGx1Z2lucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBzcGF3biwgZXhlYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcclxuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XHJcbmltcG9ydCBwbHVnaW5Mb2dnZXIgZnJvbSAnLi4vcGx1Z2luLWxvZ2dlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgYXN5bmMgdGFzayhjbGkpIHtcclxuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XHJcbiAgICAgIGNvbW1hbmQ6ICd3YXRjaC1wbHVnaW5zJyxcclxuICAgICAgZGVzYzogJ3dhdGNoIGFuZCByZWNvbXBpbGUgYWxsIHBsdWdpbnMnLFxyXG4gICAgICBidWlsZGVyOiB7XHJcbiAgICAgICAgbmFtZToge1xyXG4gICAgICAgICAgZGVzYzogJ3BsdWdpbiBuYW1lIHRvIHdhdGNoJyxcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbihmdWxjcnVtLmRpcigncGx1Z2lucycpLCAnKicpKTtcclxuXHJcbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xyXG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XHJcblxyXG4gICAgICBjb25zdCBsb2dnZXIgPSBwbHVnaW5Mb2dnZXIocGx1Z2luRGlyKTtcclxuXHJcbiAgICAgIGNvbnN0IHBhcnRzID0gcGx1Z2luUGF0aC5zcGxpdChwYXRoLnNlcCk7XHJcbiAgICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTtcclxuXHJcbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MubmFtZSAmJiBuYW1lICE9PSBmdWxjcnVtLmFyZ3MubmFtZSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsb2dnZXIubG9nKCdXYXRjaGluZyBwbHVnaW4uLi4nLCBwbHVnaW5QYXRoKTtcclxuXHJcbiAgICAgIHByb21pc2VzLnB1c2goeWFybi5ydW4oJ3dhdGNoJywge2N3ZDogcGx1Z2luRGlyLCBsb2dnZXJ9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gIH1cclxufVxyXG4iXX0=