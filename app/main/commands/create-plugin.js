'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

var _git = require('../git');

var _git2 = _interopRequireDefault(_git);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _pluginLogger = require('../plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      const files = ['package.json', 'plugin.js', '.gitignore'];

      const newPluginPath = _path2.default.join(pluginPath, fulcrum.args.name);

      _mkdirp2.default.sync(newPluginPath);

      for (const file of files) {
        let sourcePath = null;

        if (process.env.DEVELOPMENT) {
          sourcePath = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));
        } else if (process.platform === 'darwin') {
          sourcePath = _path2.default.join(_path2.default.dirname(process.execPath), '..', 'default-plugin', file);
        } else {
          sourcePath = _path2.default.join(_path2.default.dirname(process.execPath), 'default-plugin', file);
        }

        _fs2.default.writeFileSync(_path2.default.join(newPluginPath, file), _fs2.default.readFileSync(sourcePath));
      }

      const logger = (0, _pluginLogger2.default)(newPluginPath);

      logger.log('Installing dependencies...');

      yield _yarn2.default.run('install', { cwd: newPluginPath, logger });

      logger.log('Compiling...');

      yield _yarn2.default.run('build', { cwd: newPluginPath, logger });

      logger.log('Setting up git repository...');

      yield _git2.default.init(newPluginPath);

      logger.log('Plugin created at', _path2.default.join(pluginPath, fulcrum.args.name));
      logger.log('Run the plugin task using:');
      logger.log('  fulcrum ' + fulcrum.args.name);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'create-plugin',
        desc: 'create a new plugin',
        builder: {
          name: {
            type: 'string',
            desc: 'the new plugin name',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NyZWF0ZS1wbHVnaW4uanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGgiLCJmdWxjcnVtIiwiZGlyIiwiZmlsZXMiLCJuZXdQbHVnaW5QYXRoIiwiam9pbiIsImFyZ3MiLCJuYW1lIiwic3luYyIsImZpbGUiLCJzb3VyY2VQYXRoIiwicHJvY2VzcyIsImVudiIsIkRFVkVMT1BNRU5UIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwid3JpdGVGaWxlU3luYyIsInJlYWRGaWxlU3luYyIsImxvZ2dlciIsImxvZyIsInJ1biIsImN3ZCIsImluaXQiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsInJlcXVpcmVkIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztrQkFFZSxNQUFNO0FBQUE7QUFBQSxTQWdCbkJBLFVBaEJtQixxQkFnQk4sYUFBWTtBQUN2QixZQUFNQyxhQUFhQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFuQjs7QUFFQSxZQUFNQyxRQUFRLENBQ1osY0FEWSxFQUVaLFdBRlksRUFHWixZQUhZLENBQWQ7O0FBTUEsWUFBTUMsZ0JBQWdCLGVBQUtDLElBQUwsQ0FBVUwsVUFBVixFQUFzQkMsUUFBUUssSUFBUixDQUFhQyxJQUFuQyxDQUF0Qjs7QUFFQSx1QkFBT0MsSUFBUCxDQUFZSixhQUFaOztBQUVBLFdBQUssTUFBTUssSUFBWCxJQUFtQk4sS0FBbkIsRUFBMEI7QUFDeEIsWUFBSU8sYUFBYSxJQUFqQjs7QUFFQSxZQUFJQyxRQUFRQyxHQUFSLENBQVlDLFdBQWhCLEVBQTZCO0FBQzNCSCx1QkFBYSxlQUFLSSxPQUFMLENBQWEsZUFBS1QsSUFBTCxDQUFVVSxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLElBQWpDLEVBQXVDLFdBQXZDLEVBQW9ELGdCQUFwRCxFQUFzRU4sSUFBdEUsQ0FBYixDQUFiO0FBQ0QsU0FGRCxNQUVPLElBQUlFLFFBQVFLLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDeENOLHVCQUFhLGVBQUtMLElBQUwsQ0FBVSxlQUFLWSxPQUFMLENBQWFOLFFBQVFPLFFBQXJCLENBQVYsRUFBMEMsSUFBMUMsRUFBZ0QsZ0JBQWhELEVBQWtFVCxJQUFsRSxDQUFiO0FBQ0QsU0FGTSxNQUVBO0FBQ0xDLHVCQUFhLGVBQUtMLElBQUwsQ0FBVSxlQUFLWSxPQUFMLENBQWFOLFFBQVFPLFFBQXJCLENBQVYsRUFBMEMsZ0JBQTFDLEVBQTREVCxJQUE1RCxDQUFiO0FBQ0Q7O0FBRUQscUJBQUdVLGFBQUgsQ0FBaUIsZUFBS2QsSUFBTCxDQUFVRCxhQUFWLEVBQXlCSyxJQUF6QixDQUFqQixFQUFpRCxhQUFHVyxZQUFILENBQWdCVixVQUFoQixDQUFqRDtBQUNEOztBQUVELFlBQU1XLFNBQVMsNEJBQWFqQixhQUFiLENBQWY7O0FBRUFpQixhQUFPQyxHQUFQLENBQVcsNEJBQVg7O0FBRUEsWUFBTSxlQUFLQyxHQUFMLENBQVMsU0FBVCxFQUFvQixFQUFDQyxLQUFLcEIsYUFBTixFQUFxQmlCLE1BQXJCLEVBQXBCLENBQU47O0FBRUFBLGFBQU9DLEdBQVAsQ0FBVyxjQUFYOztBQUVBLFlBQU0sZUFBS0MsR0FBTCxDQUFTLE9BQVQsRUFBa0IsRUFBQ0MsS0FBS3BCLGFBQU4sRUFBcUJpQixNQUFyQixFQUFsQixDQUFOOztBQUVBQSxhQUFPQyxHQUFQLENBQVcsOEJBQVg7O0FBRUEsWUFBTSxjQUFJRyxJQUFKLENBQVNyQixhQUFULENBQU47O0FBRUFpQixhQUFPQyxHQUFQLENBQVcsbUJBQVgsRUFBZ0MsZUFBS2pCLElBQUwsQ0FBVUwsVUFBVixFQUFzQkMsUUFBUUssSUFBUixDQUFhQyxJQUFuQyxDQUFoQztBQUNBYyxhQUFPQyxHQUFQLENBQVcsNEJBQVg7QUFDQUQsYUFBT0MsR0FBUCxDQUFXLGVBQWVyQixRQUFRSyxJQUFSLENBQWFDLElBQXZDO0FBQ0QsS0E1RGtCO0FBQUE7O0FBQ2JtQixNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxxQkFGVztBQUdqQkMsaUJBQVM7QUFDUHZCLGdCQUFNO0FBQ0p3QixrQkFBTSxRQURGO0FBRUpGLGtCQUFNLHFCQUZGO0FBR0pHLHNCQUFVO0FBSE47QUFEQyxTQUhRO0FBVWpCQyxpQkFBUyxNQUFLbEM7QUFWRyxPQUFaLENBQVA7QUFEYztBQWFmOztBQWRrQixDIiwiZmlsZSI6ImNyZWF0ZS1wbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XHJcbmltcG9ydCBnaXQgZnJvbSAnLi4vZ2l0JztcclxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGFzeW5jIHRhc2soY2xpKSB7XHJcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gICAgICBjb21tYW5kOiAnY3JlYXRlLXBsdWdpbicsXHJcbiAgICAgIGRlc2M6ICdjcmVhdGUgYSBuZXcgcGx1Z2luJyxcclxuICAgICAgYnVpbGRlcjoge1xyXG4gICAgICAgIG5hbWU6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgZGVzYzogJ3RoZSBuZXcgcGx1Z2luIG5hbWUnLFxyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgcGx1Z2luUGF0aCA9IGZ1bGNydW0uZGlyKCdwbHVnaW5zJyk7XHJcblxyXG4gICAgY29uc3QgZmlsZXMgPSBbXHJcbiAgICAgICdwYWNrYWdlLmpzb24nLFxyXG4gICAgICAncGx1Z2luLmpzJyxcclxuICAgICAgJy5naXRpZ25vcmUnXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IG5ld1BsdWdpblBhdGggPSBwYXRoLmpvaW4ocGx1Z2luUGF0aCwgZnVsY3J1bS5hcmdzLm5hbWUpO1xyXG5cclxuICAgIG1rZGlycC5zeW5jKG5ld1BsdWdpblBhdGgpO1xyXG5cclxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xyXG4gICAgICBsZXQgc291cmNlUGF0aCA9IG51bGw7XHJcblxyXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuREVWRUxPUE1FTlQpIHtcclxuICAgICAgICBzb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKSk7XHJcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcclxuICAgICAgICBzb3VyY2VQYXRoID0gcGF0aC5qb2luKHBhdGguZGlybmFtZShwcm9jZXNzLmV4ZWNQYXRoKSwgJy4uJywgJ2RlZmF1bHQtcGx1Z2luJywgZmlsZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc291cmNlUGF0aCA9IHBhdGguam9pbihwYXRoLmRpcm5hbWUocHJvY2Vzcy5leGVjUGF0aCksICdkZWZhdWx0LXBsdWdpbicsIGZpbGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihuZXdQbHVnaW5QYXRoLCBmaWxlKSwgZnMucmVhZEZpbGVTeW5jKHNvdXJjZVBhdGgpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBsb2dnZXIgPSBwbHVnaW5Mb2dnZXIobmV3UGx1Z2luUGF0aCk7XHJcblxyXG4gICAgbG9nZ2VyLmxvZygnSW5zdGFsbGluZyBkZXBlbmRlbmNpZXMuLi4nKTtcclxuXHJcbiAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtjd2Q6IG5ld1BsdWdpblBhdGgsIGxvZ2dlcn0pO1xyXG5cclxuICAgIGxvZ2dlci5sb2coJ0NvbXBpbGluZy4uLicpO1xyXG5cclxuICAgIGF3YWl0IHlhcm4ucnVuKCdidWlsZCcsIHtjd2Q6IG5ld1BsdWdpblBhdGgsIGxvZ2dlcn0pO1xyXG5cclxuICAgIGxvZ2dlci5sb2coJ1NldHRpbmcgdXAgZ2l0IHJlcG9zaXRvcnkuLi4nKTtcclxuXHJcbiAgICBhd2FpdCBnaXQuaW5pdChuZXdQbHVnaW5QYXRoKTtcclxuXHJcbiAgICBsb2dnZXIubG9nKCdQbHVnaW4gY3JlYXRlZCBhdCcsIHBhdGguam9pbihwbHVnaW5QYXRoLCBmdWxjcnVtLmFyZ3MubmFtZSkpO1xyXG4gICAgbG9nZ2VyLmxvZygnUnVuIHRoZSBwbHVnaW4gdGFzayB1c2luZzonKTtcclxuICAgIGxvZ2dlci5sb2coJyAgZnVsY3J1bSAnICsgZnVsY3J1bS5hcmdzLm5hbWUpO1xyXG4gIH1cclxufVxyXG4iXX0=