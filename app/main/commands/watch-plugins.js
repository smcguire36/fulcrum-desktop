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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3dhdGNoLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicHJvbWlzZXMiLCJwbHVnaW5QYXRoIiwicGx1Z2luRGlyIiwicmVzb2x2ZSIsImxvZ2dlciIsInBhcnRzIiwic3BsaXQiLCJzZXAiLCJuYW1lIiwibGVuZ3RoIiwiYXJncyIsImxvZyIsInB1c2giLCJydW4iLCJjd2QiLCJQcm9taXNlIiwiYWxsIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FlbkJBLFVBZm1CLHFCQWVOLGFBQVk7QUFDdkIsWUFBTUMsY0FBYyxlQUFLQyxJQUFMLENBQVUsZUFBS0MsSUFBTCxDQUFVQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWLEVBQWtDLEdBQWxDLENBQVYsQ0FBcEI7O0FBRUEsWUFBTUMsV0FBVyxFQUFqQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJOLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQU1PLFlBQVksZUFBS0MsT0FBTCxDQUFhRixVQUFiLENBQWxCOztBQUVBLGNBQU1HLFNBQVMsNEJBQWFGLFNBQWIsQ0FBZjs7QUFFQSxjQUFNRyxRQUFRSixXQUFXSyxLQUFYLENBQWlCLGVBQUtDLEdBQXRCLENBQWQ7QUFDQSxjQUFNQyxPQUFPSCxNQUFNQSxNQUFNSSxNQUFOLEdBQWUsQ0FBckIsQ0FBYjs7QUFFQSxZQUFJWCxRQUFRWSxJQUFSLENBQWFGLElBQWIsSUFBcUJBLFNBQVNWLFFBQVFZLElBQVIsQ0FBYUYsSUFBL0MsRUFBcUQ7QUFDbkQ7QUFDRDs7QUFFREosZUFBT08sR0FBUCxDQUFXLG9CQUFYLEVBQWlDVixVQUFqQzs7QUFFQUQsaUJBQVNZLElBQVQsQ0FBYyxlQUFLQyxHQUFMLENBQVMsT0FBVCxFQUFrQixFQUFDQyxLQUFLWixTQUFOLEVBQWlCRSxNQUFqQixFQUFsQixDQUFkO0FBQ0Q7O0FBRUQsWUFBTVcsUUFBUUMsR0FBUixDQUFZaEIsUUFBWixDQUFOO0FBQ0QsS0F0Q2tCO0FBQUE7O0FBQ2JpQixNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxpQ0FGVztBQUdqQkMsaUJBQVM7QUFDUGIsZ0JBQU07QUFDSlksa0JBQU0sc0JBREY7QUFFSkUsa0JBQU07QUFGRjtBQURDLFNBSFE7QUFTakJDLGlCQUFTLE1BQUs3QjtBQVRHLE9BQVosQ0FBUDtBQURjO0FBWWY7O0FBYmtCLEMiLCJmaWxlIjoid2F0Y2gtcGx1Z2lucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgc3Bhd24sIGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICd3YXRjaC1wbHVnaW5zJyxcbiAgICAgIGRlc2M6ICd3YXRjaCBhbmQgcmVjb21waWxlIGFsbCBwbHVnaW5zJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlc2M6ICdwbHVnaW4gbmFtZSB0byB3YXRjaCcsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonKSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XG5cbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5EaXIpO1xuXG4gICAgICBjb25zdCBwYXJ0cyA9IHBsdWdpblBhdGguc3BsaXQocGF0aC5zZXApO1xuICAgICAgY29uc3QgbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLm5hbWUgJiYgbmFtZSAhPT0gZnVsY3J1bS5hcmdzLm5hbWUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxvZ2dlci5sb2coJ1dhdGNoaW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICBwcm9taXNlcy5wdXNoKHlhcm4ucnVuKCd3YXRjaCcsIHtjd2Q6IHBsdWdpbkRpciwgbG9nZ2VyfSkpO1xuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKTtcbiAgfVxufVxuIl19