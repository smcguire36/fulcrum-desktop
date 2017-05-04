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

      console.log('Installing dependencies...');

      yield _yarn2.default.run('install', { cwd: newPluginPath });

      console.log('Setting up git repository...');

      yield _git2.default.init(newPluginPath);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NyZWF0ZS1wbHVnaW4uanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGgiLCJmdWxjcnVtIiwiZGlyIiwiZmlsZXMiLCJuZXdQbHVnaW5QYXRoIiwiam9pbiIsImFyZ3MiLCJuYW1lIiwic3luYyIsImZpbGUiLCJzb3VyY2VQYXRoIiwicHJvY2VzcyIsImVudiIsIkRFVkVMT1BNRU5UIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwid3JpdGVGaWxlU3luYyIsInJlYWRGaWxlU3luYyIsImNvbnNvbGUiLCJsb2ciLCJydW4iLCJjd2QiLCJpbml0IiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJyZXF1aXJlZCIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBZ0JuQkEsVUFoQm1CLHFCQWdCTixhQUFZO0FBQ3ZCLFlBQU1DLGFBQWFDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQW5COztBQUVBLFlBQU1DLFFBQVEsQ0FDWixjQURZLEVBRVosV0FGWSxFQUdaLFlBSFksQ0FBZDs7QUFNQSxZQUFNQyxnQkFBZ0IsZUFBS0MsSUFBTCxDQUFVTCxVQUFWLEVBQXNCQyxRQUFRSyxJQUFSLENBQWFDLElBQW5DLENBQXRCOztBQUVBLHVCQUFPQyxJQUFQLENBQVlKLGFBQVo7O0FBRUEsV0FBSyxNQUFNSyxJQUFYLElBQW1CTixLQUFuQixFQUEwQjtBQUN4QixZQUFJTyxhQUFhLElBQWpCOztBQUVBLFlBQUlDLFFBQVFDLEdBQVIsQ0FBWUMsV0FBaEIsRUFBNkI7QUFDM0JILHVCQUFhLGVBQUtJLE9BQUwsQ0FBYSxlQUFLVCxJQUFMLENBQVVVLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsSUFBakMsRUFBdUMsV0FBdkMsRUFBb0QsZ0JBQXBELEVBQXNFTixJQUF0RSxDQUFiLENBQWI7QUFDRCxTQUZELE1BRU8sSUFBSUUsUUFBUUssUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUN4Q04sdUJBQWEsZUFBS0wsSUFBTCxDQUFVLGVBQUtZLE9BQUwsQ0FBYU4sUUFBUU8sUUFBckIsQ0FBVixFQUEwQyxJQUExQyxFQUFnRCxnQkFBaEQsRUFBa0VULElBQWxFLENBQWI7QUFDRCxTQUZNLE1BRUE7QUFDTEMsdUJBQWEsZUFBS0wsSUFBTCxDQUFVLGVBQUtZLE9BQUwsQ0FBYU4sUUFBUU8sUUFBckIsQ0FBVixFQUEwQyxnQkFBMUMsRUFBNERULElBQTVELENBQWI7QUFDRDs7QUFFRCxxQkFBR1UsYUFBSCxDQUFpQixlQUFLZCxJQUFMLENBQVVELGFBQVYsRUFBeUJLLElBQXpCLENBQWpCLEVBQWlELGFBQUdXLFlBQUgsQ0FBZ0JWLFVBQWhCLENBQWpEO0FBQ0Q7O0FBRURXLGNBQVFDLEdBQVIsQ0FBWSw0QkFBWjs7QUFFQSxZQUFNLGVBQUtDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLEtBQUtwQixhQUFOLEVBQXBCLENBQU47O0FBRUFpQixjQUFRQyxHQUFSLENBQVksOEJBQVo7O0FBRUEsWUFBTSxjQUFJRyxJQUFKLENBQVNyQixhQUFULENBQU47O0FBRUFpQixjQUFRQyxHQUFSLENBQVksbUJBQVosRUFBaUMsZUFBS2pCLElBQUwsQ0FBVUwsVUFBVixFQUFzQkMsUUFBUUssSUFBUixDQUFhQyxJQUFuQyxDQUFqQztBQUNBYyxjQUFRQyxHQUFSLENBQVksOEJBQVo7QUFDQUQsY0FBUUMsR0FBUixDQUFZLGVBQWVyQixRQUFRSyxJQUFSLENBQWFDLElBQXhDO0FBQ0QsS0F0RGtCO0FBQUE7O0FBQ2JtQixNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsZUFEUTtBQUVqQkMsY0FBTSxxQkFGVztBQUdqQkMsaUJBQVM7QUFDUHZCLGdCQUFNO0FBQ0p3QixrQkFBTSxRQURGO0FBRUpGLGtCQUFNLHFCQUZGO0FBR0pHLHNCQUFVO0FBSE47QUFEQyxTQUhRO0FBVWpCQyxpQkFBUyxNQUFLbEM7QUFWRyxPQUFaLENBQVA7QUFEYztBQWFmOztBQWRrQixDIiwiZmlsZSI6ImNyZWF0ZS1wbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xuaW1wb3J0IGdpdCBmcm9tICcuLi9naXQnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnY3JlYXRlLXBsdWdpbicsXG4gICAgICBkZXNjOiAnY3JlYXRlIGEgbmV3IHBsdWdpbicsXG4gICAgICBidWlsZGVyOiB7XG4gICAgICAgIG5hbWU6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIG5ldyBwbHVnaW4gbmFtZScsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRoID0gZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKTtcblxuICAgIGNvbnN0IGZpbGVzID0gW1xuICAgICAgJ3BhY2thZ2UuanNvbicsXG4gICAgICAncGx1Z2luLmpzJyxcbiAgICAgICcuZ2l0aWdub3JlJ1xuICAgIF07XG5cbiAgICBjb25zdCBuZXdQbHVnaW5QYXRoID0gcGF0aC5qb2luKHBsdWdpblBhdGgsIGZ1bGNydW0uYXJncy5uYW1lKTtcblxuICAgIG1rZGlycC5zeW5jKG5ld1BsdWdpblBhdGgpO1xuXG4gICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICBsZXQgc291cmNlUGF0aCA9IG51bGw7XG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5ERVZFTE9QTUVOVCkge1xuICAgICAgICBzb3VyY2VQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKSk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICAgIHNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnLi4nLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZVBhdGggPSBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnZGVmYXVsdC1wbHVnaW4nLCBmaWxlKTtcbiAgICAgIH1cblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4obmV3UGx1Z2luUGF0aCwgZmlsZSksIGZzLnJlYWRGaWxlU3luYyhzb3VyY2VQYXRoKSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcgZGVwZW5kZW5jaWVzLi4uJyk7XG5cbiAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtjd2Q6IG5ld1BsdWdpblBhdGh9KTtcblxuICAgIGNvbnNvbGUubG9nKCdTZXR0aW5nIHVwIGdpdCByZXBvc2l0b3J5Li4uJyk7XG5cbiAgICBhd2FpdCBnaXQuaW5pdChuZXdQbHVnaW5QYXRoKTtcblxuICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gY3JlYXRlZCBhdCcsIHBhdGguam9pbihwbHVnaW5QYXRoLCBmdWxjcnVtLmFyZ3MubmFtZSkpO1xuICAgIGNvbnNvbGUubG9nKCdSdW4gdGhlIHBsdWdpbiB0YXNrIHVzaW5nOlxcbicpO1xuICAgIGNvbnNvbGUubG9nKCcgIGZ1bGNydW0gJyArIGZ1bGNydW0uYXJncy5uYW1lKTtcbiAgfVxufVxuIl19