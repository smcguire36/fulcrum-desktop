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
          logger.log('Installing dependencies...', pluginPath);

          yield _yarn2.default.run('install', { cwd: pluginDir, logger });

          logger.log('Compiling plugin...', pluginPath);

          yield _yarn2.default.run('build', { cwd: pluginDir, logger });

          logger.log('Plugin built.');
        } catch (ex) {
          logger.error('Error building plugin', pluginPath, ex);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2J1aWxkLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicGx1Z2luUGF0aCIsInBsdWdpbkRpciIsInJlc29sdmUiLCJkaXJuYW1lIiwibG9nZ2VyIiwibG9nIiwicnVuIiwiY3dkIiwiZXgiLCJlcnJvciIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztrQkFFZSxNQUFNO0FBQUE7QUFBQSxTQVNuQkEsVUFUbUIscUJBU04sYUFBWTtBQUN2QixZQUFNQyxjQUFjLGVBQUtDLElBQUwsQ0FBVSxlQUFLQyxJQUFMLENBQVVDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVYsRUFBa0MsR0FBbEMsRUFBdUMsV0FBdkMsQ0FBVixDQUFwQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJMLFdBQXpCLEVBQXNDO0FBQ3BDLGNBQU1NLFlBQVksZUFBS0MsT0FBTCxDQUFhLGVBQUtDLE9BQUwsQ0FBYUgsVUFBYixDQUFiLENBQWxCO0FBQ0EsY0FBTUksU0FBUyw0QkFBYUgsU0FBYixDQUFmOztBQUVBLFlBQUk7QUFDRkcsaUJBQU9DLEdBQVAsQ0FBVyw0QkFBWCxFQUF5Q0wsVUFBekM7O0FBRUEsZ0JBQU0sZUFBS00sR0FBTCxDQUFTLFNBQVQsRUFBb0IsRUFBQ0MsS0FBS04sU0FBTixFQUFpQkcsTUFBakIsRUFBcEIsQ0FBTjs7QUFFQUEsaUJBQU9DLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQ0wsVUFBbEM7O0FBRUEsZ0JBQU0sZUFBS00sR0FBTCxDQUFTLE9BQVQsRUFBa0IsRUFBQ0MsS0FBS04sU0FBTixFQUFpQkcsTUFBakIsRUFBbEIsQ0FBTjs7QUFFQUEsaUJBQU9DLEdBQVAsQ0FBVyxlQUFYO0FBQ0QsU0FWRCxDQVVFLE9BQU9HLEVBQVAsRUFBVztBQUNYSixpQkFBT0ssS0FBUCxDQUFhLHVCQUFiLEVBQXNDVCxVQUF0QyxFQUFrRFEsRUFBbEQ7QUFDRDtBQUNGO0FBQ0YsS0E5QmtCO0FBQUE7O0FBQ2JFLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxlQURRO0FBRWpCQyxjQUFNLG1CQUZXO0FBR2pCQyxpQkFBUyxNQUFLcEI7QUFIRyxPQUFaLENBQVA7QUFEYztBQU1mOztBQVBrQixDIiwiZmlsZSI6ImJ1aWxkLXBsdWdpbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XHJcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xyXG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGFzeW5jIHRhc2soY2xpKSB7XHJcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gICAgICBjb21tYW5kOiAnYnVpbGQtcGx1Z2lucycsXHJcbiAgICAgIGRlc2M6ICdidWlsZCBhbGwgcGx1Z2lucycsXHJcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgcGx1Z2luUGF0aHMgPSBnbG9iLnN5bmMocGF0aC5qb2luKGZ1bGNydW0uZGlyKCdwbHVnaW5zJyksICcqJywgJ3BsdWdpbi5qcycpKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHBsdWdpblBhdGggb2YgcGx1Z2luUGF0aHMpIHtcclxuICAgICAgY29uc3QgcGx1Z2luRGlyID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShwbHVnaW5QYXRoKSk7XHJcbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5EaXIpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBsb2dnZXIubG9nKCdJbnN0YWxsaW5nIGRlcGVuZGVuY2llcy4uLicsIHBsdWdpblBhdGgpO1xyXG5cclxuICAgICAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtjd2Q6IHBsdWdpbkRpciwgbG9nZ2VyfSk7XHJcblxyXG4gICAgICAgIGxvZ2dlci5sb2coJ0NvbXBpbGluZyBwbHVnaW4uLi4nLCBwbHVnaW5QYXRoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgeWFybi5ydW4oJ2J1aWxkJywge2N3ZDogcGx1Z2luRGlyLCBsb2dnZXJ9KTtcclxuXHJcbiAgICAgICAgbG9nZ2VyLmxvZygnUGx1Z2luIGJ1aWx0LicpO1xyXG4gICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignRXJyb3IgYnVpbGRpbmcgcGx1Z2luJywgcGx1Z2luUGF0aCwgZXgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==