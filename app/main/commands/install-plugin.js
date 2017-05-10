'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsInBsdWdpbk5hbWUiLCJhcmdzIiwibmFtZSIsImluZGV4T2YiLCJ1cmwiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwicmVwbGFjZSIsIm5ld1BsdWdpblBhdGgiLCJqb2luIiwibG9nZ2VyIiwibG9nIiwiY2xvbmUiLCJydW4iLCJlbnYiLCJjd2QiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBbUJuQkEsVUFuQm1CLHFCQW1CTixhQUFZO0FBQ3ZCLFlBQU1DLGFBQWFDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5COztBQUVBLFVBQUlDLGFBQWFGLFFBQVFHLElBQVIsQ0FBYUMsSUFBOUI7O0FBRUEsVUFBSUYsY0FBY0EsV0FBV0csT0FBWCxDQUFtQixpQkFBbkIsTUFBMEMsQ0FBNUQsRUFBK0Q7QUFDN0RILHFCQUFjLG1CQUFtQkEsVUFBWSxFQUE3QztBQUNEOztBQUVELFlBQU1JLE1BQU1OLFFBQVFHLElBQVIsQ0FBYUcsR0FBYixJQUFxQixpQ0FBaUNKLFVBQVksRUFBOUU7O0FBRUEsWUFBTUssUUFBUUQsSUFBSUUsS0FBSixDQUFVLEdBQVYsQ0FBZDs7QUFFQSxZQUFNSixPQUFPRyxNQUFNQSxNQUFNRSxNQUFOLEdBQWUsQ0FBckIsRUFBd0JDLE9BQXhCLENBQWdDLE9BQWhDLEVBQXlDLEVBQXpDLENBQWI7O0FBRUEsWUFBTUMsZ0JBQWdCLGVBQUtDLElBQUwsQ0FBVWIsVUFBVixFQUFzQkssSUFBdEIsQ0FBdEI7O0FBRUEsWUFBTVMsU0FBUyw0QkFBYUYsYUFBYixDQUFmOztBQUVBRSxhQUFPQyxHQUFQLENBQVcsWUFBWDs7QUFFQSxZQUFNLGNBQUlDLEtBQUosQ0FBVVQsR0FBVixFQUFlSyxhQUFmLENBQU47O0FBRUFFLGFBQU9DLEdBQVAsQ0FBVyw0QkFBWDs7QUFFQSxZQUFNLGVBQUtFLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLHdCQUFELEVBQWlCQyxLQUFLUCxhQUF0QixFQUFxQ0UsTUFBckMsRUFBcEIsQ0FBTjs7QUFFQUEsYUFBT0MsR0FBUCxDQUFXLHFCQUFYLEVBQWtDSCxhQUFsQztBQUNELEtBL0NrQjtBQUFBOztBQUNiUSxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZ0JBRFE7QUFFakJDLGNBQU0sa0JBRlc7QUFHakJDLGlCQUFTO0FBQ1BuQixnQkFBTTtBQUNKb0Isa0JBQU0sUUFERjtBQUVKRixrQkFBTTtBQUZGLFdBREM7QUFLUGhCLGVBQUs7QUFDSGtCLGtCQUFNLFFBREg7QUFFSEYsa0JBQU07QUFGSDtBQUxFLFNBSFE7QUFhakJHLGlCQUFTLE1BQUszQjtBQWJHLE9BQVosQ0FBUDtBQURjO0FBZ0JmOztBQWpCa0IsQyIsImZpbGUiOiJpbnN0YWxsLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBwbHVnaW5FbnYgZnJvbSAnLi4vcGx1Z2luLWVudic7XG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XG5pbXBvcnQgeWFybiBmcm9tICcuLi95YXJuJztcbmltcG9ydCBwbHVnaW5Mb2dnZXIgZnJvbSAnLi4vcGx1Z2luLWxvZ2dlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ2luc3RhbGwtcGx1Z2luJyxcbiAgICAgIGRlc2M6ICdpbnN0YWxsIGEgcGx1Z2luJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICd0aGUgcGx1Z2luIG5hbWUnXG4gICAgICAgIH0sXG4gICAgICAgIHVybDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICd0aGUgVVJMIHRvIGEgZ2l0IHJlcG8nXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGx1Z2luUGF0aCA9IGZ1bGNydW0uZGlyKCdwbHVnaW5zJyk7XG5cbiAgICBsZXQgcGx1Z2luTmFtZSA9IGZ1bGNydW0uYXJncy5uYW1lO1xuXG4gICAgaWYgKHBsdWdpbk5hbWUgJiYgcGx1Z2luTmFtZS5pbmRleE9mKCdmdWxjcnVtLWRlc2t0b3AnKSAhPT0gMCkge1xuICAgICAgcGx1Z2luTmFtZSA9IGBmdWxjcnVtLWRlc2t0b3AtJHsgcGx1Z2luTmFtZSB9YDtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSBmdWxjcnVtLmFyZ3MudXJsIHx8IGBodHRwczovL2dpdGh1Yi5jb20vZnVsY3J1bWFwcC8keyBwbHVnaW5OYW1lIH1gO1xuXG4gICAgY29uc3QgcGFydHMgPSB1cmwuc3BsaXQoJy8nKTtcblxuICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9cXC5naXQvLCAnJyk7XG5cbiAgICBjb25zdCBuZXdQbHVnaW5QYXRoID0gcGF0aC5qb2luKHBsdWdpblBhdGgsIG5hbWUpO1xuXG4gICAgY29uc3QgbG9nZ2VyID0gcGx1Z2luTG9nZ2VyKG5ld1BsdWdpblBhdGgpO1xuXG4gICAgbG9nZ2VyLmxvZygnQ2xvbmluZy4uLicpO1xuXG4gICAgYXdhaXQgZ2l0LmNsb25lKHVybCwgbmV3UGx1Z2luUGF0aCk7XG5cbiAgICBsb2dnZXIubG9nKCdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicpO1xuXG4gICAgYXdhaXQgeWFybi5ydW4oJ2luc3RhbGwnLCB7ZW52OiBwbHVnaW5FbnYsIGN3ZDogbmV3UGx1Z2luUGF0aCwgbG9nZ2VyfSk7XG5cbiAgICBsb2dnZXIubG9nKCdQbHVnaW4gaW5zdGFsbGVkIGF0JywgbmV3UGx1Z2luUGF0aCk7XG4gIH1cbn1cbiJdfQ==