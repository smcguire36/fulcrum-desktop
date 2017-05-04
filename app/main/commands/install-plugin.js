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

      const parts = fulcrum.args.url.split('/');

      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path2.default.join(pluginPath, name);

      const logger = (0, _pluginLogger2.default)(newPluginPath);

      logger.log('Cloning...');

      yield _git2.default.clone(fulcrum.args.url, newPluginPath);

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
          url: {
            type: 'string',
            desc: 'the URL to a git repo',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsInBhcnRzIiwiYXJncyIsInVybCIsInNwbGl0IiwibmFtZSIsImxlbmd0aCIsInJlcGxhY2UiLCJuZXdQbHVnaW5QYXRoIiwiam9pbiIsImxvZ2dlciIsImxvZyIsImNsb25lIiwicnVuIiwiZW52IiwiY3dkIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJyZXF1aXJlZCIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBZ0JuQkEsVUFoQm1CLHFCQWdCTixhQUFZO0FBQ3ZCLFlBQU1DLGFBQWFDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5COztBQUVBLFlBQU1DLFFBQVFGLFFBQVFHLElBQVIsQ0FBYUMsR0FBYixDQUFpQkMsS0FBakIsQ0FBdUIsR0FBdkIsQ0FBZDs7QUFFQSxZQUFNQyxPQUFPSixNQUFNQSxNQUFNSyxNQUFOLEdBQWUsQ0FBckIsRUFBd0JDLE9BQXhCLENBQWdDLE9BQWhDLEVBQXlDLEVBQXpDLENBQWI7O0FBRUEsWUFBTUMsZ0JBQWdCLGVBQUtDLElBQUwsQ0FBVVgsVUFBVixFQUFzQk8sSUFBdEIsQ0FBdEI7O0FBRUEsWUFBTUssU0FBUyw0QkFBYUYsYUFBYixDQUFmOztBQUVBRSxhQUFPQyxHQUFQLENBQVcsWUFBWDs7QUFFQSxZQUFNLGNBQUlDLEtBQUosQ0FBVWIsUUFBUUcsSUFBUixDQUFhQyxHQUF2QixFQUE0QkssYUFBNUIsQ0FBTjs7QUFFQUUsYUFBT0MsR0FBUCxDQUFXLDRCQUFYOztBQUVBLFlBQU0sZUFBS0UsR0FBTCxDQUFTLFNBQVQsRUFBb0IsRUFBQ0Msd0JBQUQsRUFBaUJDLEtBQUtQLGFBQXRCLEVBQXFDRSxNQUFyQyxFQUFwQixDQUFOOztBQUVBQSxhQUFPQyxHQUFQLENBQVcscUJBQVgsRUFBa0NILGFBQWxDO0FBQ0QsS0FwQ2tCO0FBQUE7O0FBQ2JRLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxnQkFEUTtBQUVqQkMsY0FBTSxrQkFGVztBQUdqQkMsaUJBQVM7QUFDUGpCLGVBQUs7QUFDSGtCLGtCQUFNLFFBREg7QUFFSEYsa0JBQU0sdUJBRkg7QUFHSEcsc0JBQVU7QUFIUDtBQURFLFNBSFE7QUFVakJDLGlCQUFTLE1BQUsxQjtBQVZHLE9BQVosQ0FBUDtBQURjO0FBYWY7O0FBZGtCLEMiLCJmaWxlIjoiaW5zdGFsbC1wbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4uL3BsdWdpbi1lbnYnO1xuaW1wb3J0IGdpdCBmcm9tICcuLi9naXQnO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdpbnN0YWxsLXBsdWdpbicsXG4gICAgICBkZXNjOiAnaW5zdGFsbCBhIHBsdWdpbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIHVybDoge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICd0aGUgVVJMIHRvIGEgZ2l0IHJlcG8nLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGx1Z2luUGF0aCA9IGZ1bGNydW0uZGlyKCdwbHVnaW5zJyk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IGZ1bGNydW0uYXJncy51cmwuc3BsaXQoJy8nKTtcblxuICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9cXC5naXQvLCAnJyk7XG5cbiAgICBjb25zdCBuZXdQbHVnaW5QYXRoID0gcGF0aC5qb2luKHBsdWdpblBhdGgsIG5hbWUpO1xuXG4gICAgY29uc3QgbG9nZ2VyID0gcGx1Z2luTG9nZ2VyKG5ld1BsdWdpblBhdGgpO1xuXG4gICAgbG9nZ2VyLmxvZygnQ2xvbmluZy4uLicpO1xuXG4gICAgYXdhaXQgZ2l0LmNsb25lKGZ1bGNydW0uYXJncy51cmwsIG5ld1BsdWdpblBhdGgpO1xuXG4gICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcblxuICAgIGF3YWl0IHlhcm4ucnVuKCdpbnN0YWxsJywge2VudjogcGx1Z2luRW52LCBjd2Q6IG5ld1BsdWdpblBhdGgsIGxvZ2dlcn0pO1xuXG4gICAgbG9nZ2VyLmxvZygnUGx1Z2luIGluc3RhbGxlZCBhdCcsIG5ld1BsdWdpblBhdGgpO1xuICB9XG59XG4iXX0=