'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      const files = ['package.json', 'plugin.js', '.gitignore'];

      const commands = [];

      const newPluginPath = _path2.default.join(pluginPath, fulcrum.args.name);

      commands.push(`mkdir -p ${newPluginPath}`);

      for (const file of files) {
        const sourcePath = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));

        commands.push(`cp ${sourcePath} ${newPluginPath}`);
      }

      commands.push('yarn');
      commands.push(`cd ${newPluginPath}`);
      commands.push('git init');

      const string = commands.join(' && ');

      console.log('Installing...');

      (0, _child_process.execSync)(string, { env: _pluginEnv2.default });

      console.log('Plugin created at', _path2.default.join(pluginPath, fulcrum.args.name));
      console.log('Run the plugin task using:\n');
      console.log('  fulcrum ' + fulcrum.args.name);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NyZWF0ZS1wbHVnaW4uanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGgiLCJmdWxjcnVtIiwiZGlyIiwiZmlsZXMiLCJjb21tYW5kcyIsIm5ld1BsdWdpblBhdGgiLCJqb2luIiwiYXJncyIsIm5hbWUiLCJwdXNoIiwiZmlsZSIsInNvdXJjZVBhdGgiLCJyZXNvbHZlIiwiX19kaXJuYW1lIiwic3RyaW5nIiwiY29uc29sZSIsImxvZyIsImVudiIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwicmVxdWlyZWQiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7OztrQkFFZSxNQUFNO0FBQUE7QUFBQSxTQWdCbkJBLFVBaEJtQixxQkFnQk4sYUFBWTtBQUN2QixZQUFNQyxhQUFhQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFuQjs7QUFFQSxZQUFNQyxRQUFRLENBQ1osY0FEWSxFQUVaLFdBRlksRUFHWixZQUhZLENBQWQ7O0FBTUEsWUFBTUMsV0FBVyxFQUFqQjs7QUFFQSxZQUFNQyxnQkFBZ0IsZUFBS0MsSUFBTCxDQUFVTixVQUFWLEVBQXNCQyxRQUFRTSxJQUFSLENBQWFDLElBQW5DLENBQXRCOztBQUVBSixlQUFTSyxJQUFULENBQWUsWUFBV0osYUFBYyxFQUF4Qzs7QUFFQSxXQUFLLE1BQU1LLElBQVgsSUFBbUJQLEtBQW5CLEVBQTBCO0FBQ3hCLGNBQU1RLGFBQWEsZUFBS0MsT0FBTCxDQUFhLGVBQUtOLElBQUwsQ0FBVU8sU0FBVixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxJQUFqQyxFQUF1QyxXQUF2QyxFQUFvRCxnQkFBcEQsRUFBc0VILElBQXRFLENBQWIsQ0FBbkI7O0FBRUFOLGlCQUFTSyxJQUFULENBQWUsTUFBS0UsVUFBVyxJQUFHTixhQUFjLEVBQWhEO0FBQ0Q7O0FBRURELGVBQVNLLElBQVQsQ0FBYyxNQUFkO0FBQ0FMLGVBQVNLLElBQVQsQ0FBZSxNQUFLSixhQUFjLEVBQWxDO0FBQ0FELGVBQVNLLElBQVQsQ0FBYyxVQUFkOztBQUVBLFlBQU1LLFNBQVNWLFNBQVNFLElBQVQsQ0FBYyxNQUFkLENBQWY7O0FBRUFTLGNBQVFDLEdBQVIsQ0FBWSxlQUFaOztBQUVBLG1DQUFTRixNQUFULEVBQWlCLEVBQUNHLHdCQUFELEVBQWpCOztBQUVBRixjQUFRQyxHQUFSLENBQVksbUJBQVosRUFBaUMsZUFBS1YsSUFBTCxDQUFVTixVQUFWLEVBQXNCQyxRQUFRTSxJQUFSLENBQWFDLElBQW5DLENBQWpDO0FBQ0FPLGNBQVFDLEdBQVIsQ0FBWSw4QkFBWjtBQUNBRCxjQUFRQyxHQUFSLENBQVksZUFBZWYsUUFBUU0sSUFBUixDQUFhQyxJQUF4QztBQUNELEtBbERrQjtBQUFBOztBQUNiVSxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxxQkFGVztBQUdqQkMsaUJBQVM7QUFDUGQsZ0JBQU07QUFDSmUsa0JBQU0sUUFERjtBQUVKRixrQkFBTSxxQkFGRjtBQUdKRyxzQkFBVTtBQUhOO0FBREMsU0FIUTtBQVVqQkMsaUJBQVMsTUFBSzFCO0FBVkcsT0FBWixDQUFQO0FBRGM7QUFhZjs7QUFka0IsQyIsImZpbGUiOiJjcmVhdGUtcGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHBsdWdpbkVudiBmcm9tICcuLi9wbHVnaW4tZW52JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnY3JlYXRlLXBsdWdpbicsXG4gICAgICBkZXNjOiAnY3JlYXRlIGEgbmV3IHBsdWdpbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIG5ldyBwbHVnaW4gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRoID0gZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKTtcblxuICAgIGNvbnN0IGZpbGVzID0gW1xuICAgICAgJ3BhY2thZ2UuanNvbicsXG4gICAgICAncGx1Z2luLmpzJyxcbiAgICAgICcuZ2l0aWdub3JlJ1xuICAgIF07XG5cbiAgICBjb25zdCBjb21tYW5kcyA9IFtdO1xuXG4gICAgY29uc3QgbmV3UGx1Z2luUGF0aCA9IHBhdGguam9pbihwbHVnaW5QYXRoLCBmdWxjcnVtLmFyZ3MubmFtZSk7XG5cbiAgICBjb21tYW5kcy5wdXNoKGBta2RpciAtcCAke25ld1BsdWdpblBhdGh9YCk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ3Jlc291cmNlcycsICdkZWZhdWx0LXBsdWdpbicsIGZpbGUpKTtcblxuICAgICAgY29tbWFuZHMucHVzaChgY3AgJHtzb3VyY2VQYXRofSAke25ld1BsdWdpblBhdGh9YCk7XG4gICAgfVxuXG4gICAgY29tbWFuZHMucHVzaCgneWFybicpO1xuICAgIGNvbW1hbmRzLnB1c2goYGNkICR7bmV3UGx1Z2luUGF0aH1gKTtcbiAgICBjb21tYW5kcy5wdXNoKCdnaXQgaW5pdCcpO1xuXG4gICAgY29uc3Qgc3RyaW5nID0gY29tbWFuZHMuam9pbignICYmICcpO1xuXG4gICAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcuLi4nKTtcblxuICAgIGV4ZWNTeW5jKHN0cmluZywge2VudjogcGx1Z2luRW52fSk7XG5cbiAgICBjb25zb2xlLmxvZygnUGx1Z2luIGNyZWF0ZWQgYXQnLCBwYXRoLmpvaW4ocGx1Z2luUGF0aCwgZnVsY3J1bS5hcmdzLm5hbWUpKTtcbiAgICBjb25zb2xlLmxvZygnUnVuIHRoZSBwbHVnaW4gdGFzayB1c2luZzpcXG4nKTtcbiAgICBjb25zb2xlLmxvZygnICBmdWxjcnVtICcgKyBmdWxjcnVtLmFyZ3MubmFtZSk7XG4gIH1cbn1cbiJdfQ==