'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

var _git = require('../git');

var _git2 = _interopRequireDefault(_git);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

var _pluginLogger = require('../plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      let pluginName = fulcrum.args.name;

      if (pluginName && pluginName.indexOf('fulcrum-desktop') !== 0) {
        pluginName = `fulcrum-desktop-${pluginName}`;
      }

      const url = fulcrum.args.url || `https://github.com/fulcrumapp/${pluginName}`;

      const parts = url.split('/');

      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path2.default.join(pluginPath, name);

      const logger = (0, _pluginLogger2.default)(newPluginPath);

      logger.log('Cloning...');

      yield _git2.default.clone(url, newPluginPath);

      logger.log('Installing dependencies...');

      yield _yarn2.default.run('install', { env: _pluginEnv2.default, cwd: newPluginPath, logger });

      logger.log('Plugin installed at', newPluginPath);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'install-plugin',
        desc: 'install a plugin',
        builder: {
          name: {
            type: 'string',
            desc: 'the plugin name'
          },
          url: {
            type: 'string',
            desc: 'the URL to a git repo'
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsInBsdWdpbk5hbWUiLCJhcmdzIiwibmFtZSIsImluZGV4T2YiLCJ1cmwiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwicmVwbGFjZSIsIm5ld1BsdWdpblBhdGgiLCJqb2luIiwibG9nZ2VyIiwibG9nIiwiY2xvbmUiLCJydW4iLCJlbnYiLCJjd2QiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBbUJuQkEsVUFuQm1CLHFCQW1CTixhQUFZO0FBQ3ZCLFlBQU1DLGFBQWFDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5COztBQUVBLFVBQUlDLGFBQWFGLFFBQVFHLElBQVIsQ0FBYUMsSUFBOUI7O0FBRUEsVUFBSUYsY0FBY0EsV0FBV0csT0FBWCxDQUFtQixpQkFBbkIsTUFBMEMsQ0FBNUQsRUFBK0Q7QUFDN0RILHFCQUFjLG1CQUFtQkEsVUFBWSxFQUE3QztBQUNEOztBQUVELFlBQU1JLE1BQU1OLFFBQVFHLElBQVIsQ0FBYUcsR0FBYixJQUFxQixpQ0FBaUNKLFVBQVksRUFBOUU7O0FBRUEsWUFBTUssUUFBUUQsSUFBSUUsS0FBSixDQUFVLEdBQVYsQ0FBZDs7QUFFQSxZQUFNSixPQUFPRyxNQUFNQSxNQUFNRSxNQUFOLEdBQWUsQ0FBckIsRUFBd0JDLE9BQXhCLENBQWdDLE9BQWhDLEVBQXlDLEVBQXpDLENBQWI7O0FBRUEsWUFBTUMsZ0JBQWdCLGVBQUtDLElBQUwsQ0FBVWIsVUFBVixFQUFzQkssSUFBdEIsQ0FBdEI7O0FBRUEsWUFBTVMsU0FBUyw0QkFBYUYsYUFBYixDQUFmOztBQUVBRSxhQUFPQyxHQUFQLENBQVcsWUFBWDs7QUFFQSxZQUFNLGNBQUlDLEtBQUosQ0FBVVQsR0FBVixFQUFlSyxhQUFmLENBQU47O0FBRUFFLGFBQU9DLEdBQVAsQ0FBVyw0QkFBWDs7QUFFQSxZQUFNLGVBQUtFLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLHdCQUFELEVBQWlCQyxLQUFLUCxhQUF0QixFQUFxQ0UsTUFBckMsRUFBcEIsQ0FBTjs7QUFFQUEsYUFBT0MsR0FBUCxDQUFXLHFCQUFYLEVBQWtDSCxhQUFsQztBQUNELEtBL0NrQjtBQUFBOztBQUNiUSxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZ0JBRFE7QUFFakJDLGNBQU0sa0JBRlc7QUFHakJDLGlCQUFTO0FBQ1BuQixnQkFBTTtBQUNKb0Isa0JBQU0sUUFERjtBQUVKRixrQkFBTTtBQUZGLFdBREM7QUFLUGhCLGVBQUs7QUFDSGtCLGtCQUFNLFFBREg7QUFFSEYsa0JBQU07QUFGSDtBQUxFLFNBSFE7QUFhakJHLGlCQUFTLE1BQUszQjtBQWJHLE9BQVosQ0FBUDtBQURjO0FBZ0JmOztBQWpCa0IsQyIsImZpbGUiOiJpbnN0YWxsLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHBsdWdpbkVudiBmcm9tICcuLi9wbHVnaW4tZW52JztcbmltcG9ydCBnaXQgZnJvbSAnLi4vZ2l0JztcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xuaW1wb3J0IHBsdWdpbkxvZ2dlciBmcm9tICcuLi9wbHVnaW4tbG9nZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnaW5zdGFsbC1wbHVnaW4nLFxuICAgICAgZGVzYzogJ2luc3RhbGwgYSBwbHVnaW4nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzYzogJ3RoZSBwbHVnaW4gbmFtZSdcbiAgICAgICAgfSxcbiAgICAgICAgdXJsOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzYzogJ3RoZSBVUkwgdG8gYSBnaXQgcmVwbydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRoID0gZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKTtcblxuICAgIGxldCBwbHVnaW5OYW1lID0gZnVsY3J1bS5hcmdzLm5hbWU7XG5cbiAgICBpZiAocGx1Z2luTmFtZSAmJiBwbHVnaW5OYW1lLmluZGV4T2YoJ2Z1bGNydW0tZGVza3RvcCcpICE9PSAwKSB7XG4gICAgICBwbHVnaW5OYW1lID0gYGZ1bGNydW0tZGVza3RvcC0keyBwbHVnaW5OYW1lIH1gO1xuICAgIH1cblxuICAgIGNvbnN0IHVybCA9IGZ1bGNydW0uYXJncy51cmwgfHwgYGh0dHBzOi8vZ2l0aHViLmNvbS9mdWxjcnVtYXBwLyR7IHBsdWdpbk5hbWUgfWA7XG5cbiAgICBjb25zdCBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xuXG4gICAgY29uc3QgbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdLnJlcGxhY2UoL1xcLmdpdC8sICcnKTtcblxuICAgIGNvbnN0IG5ld1BsdWdpblBhdGggPSBwYXRoLmpvaW4ocGx1Z2luUGF0aCwgbmFtZSk7XG5cbiAgICBjb25zdCBsb2dnZXIgPSBwbHVnaW5Mb2dnZXIobmV3UGx1Z2luUGF0aCk7XG5cbiAgICBsb2dnZXIubG9nKCdDbG9uaW5nLi4uJyk7XG5cbiAgICBhd2FpdCBnaXQuY2xvbmUodXJsLCBuZXdQbHVnaW5QYXRoKTtcblxuICAgIGxvZ2dlci5sb2coJ0luc3RhbGxpbmcgZGVwZW5kZW5jaWVzLi4uJyk7XG5cbiAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtlbnY6IHBsdWdpbkVudiwgY3dkOiBuZXdQbHVnaW5QYXRoLCBsb2dnZXJ9KTtcblxuICAgIGxvZ2dlci5sb2coJ1BsdWdpbiBpbnN0YWxsZWQgYXQnLCBuZXdQbHVnaW5QYXRoKTtcbiAgfVxufVxuIl19