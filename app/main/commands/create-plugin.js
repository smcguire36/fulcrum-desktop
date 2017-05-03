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
        const sourcePath = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NyZWF0ZS1wbHVnaW4uanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGgiLCJmdWxjcnVtIiwiZGlyIiwiZmlsZXMiLCJuZXdQbHVnaW5QYXRoIiwiam9pbiIsImFyZ3MiLCJuYW1lIiwic3luYyIsImZpbGUiLCJzb3VyY2VQYXRoIiwicmVzb2x2ZSIsIl9fZGlybmFtZSIsIndyaXRlRmlsZVN5bmMiLCJyZWFkRmlsZVN5bmMiLCJjb25zb2xlIiwibG9nIiwicnVuIiwiY3dkIiwiaW5pdCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwicmVxdWlyZWQiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztrQkFFZSxNQUFNO0FBQUE7QUFBQSxTQWdCbkJBLFVBaEJtQixxQkFnQk4sYUFBWTtBQUN2QixZQUFNQyxhQUFhQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFuQjs7QUFFQSxZQUFNQyxRQUFRLENBQ1osY0FEWSxFQUVaLFdBRlksRUFHWixZQUhZLENBQWQ7O0FBTUEsWUFBTUMsZ0JBQWdCLGVBQUtDLElBQUwsQ0FBVUwsVUFBVixFQUFzQkMsUUFBUUssSUFBUixDQUFhQyxJQUFuQyxDQUF0Qjs7QUFFQSx1QkFBT0MsSUFBUCxDQUFZSixhQUFaOztBQUVBLFdBQUssTUFBTUssSUFBWCxJQUFtQk4sS0FBbkIsRUFBMEI7QUFDeEIsY0FBTU8sYUFBYSxlQUFLQyxPQUFMLENBQWEsZUFBS04sSUFBTCxDQUFVTyxTQUFWLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLElBQWpDLEVBQXVDLFdBQXZDLEVBQW9ELGdCQUFwRCxFQUFzRUgsSUFBdEUsQ0FBYixDQUFuQjs7QUFFQSxxQkFBR0ksYUFBSCxDQUFpQixlQUFLUixJQUFMLENBQVVELGFBQVYsRUFBeUJLLElBQXpCLENBQWpCLEVBQWlELGFBQUdLLFlBQUgsQ0FBZ0JKLFVBQWhCLENBQWpEO0FBQ0Q7O0FBRURLLGNBQVFDLEdBQVIsQ0FBWSw0QkFBWjs7QUFFQSxZQUFNLGVBQUtDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLEtBQUtkLGFBQU4sRUFBcEIsQ0FBTjs7QUFFQVcsY0FBUUMsR0FBUixDQUFZLDhCQUFaOztBQUVBLFlBQU0sY0FBSUcsSUFBSixDQUFTZixhQUFULENBQU47O0FBRUFXLGNBQVFDLEdBQVIsQ0FBWSxtQkFBWixFQUFpQyxlQUFLWCxJQUFMLENBQVVMLFVBQVYsRUFBc0JDLFFBQVFLLElBQVIsQ0FBYUMsSUFBbkMsQ0FBakM7QUFDQVEsY0FBUUMsR0FBUixDQUFZLDhCQUFaO0FBQ0FELGNBQVFDLEdBQVIsQ0FBWSxlQUFlZixRQUFRSyxJQUFSLENBQWFDLElBQXhDO0FBQ0QsS0E5Q2tCO0FBQUE7O0FBQ2JhLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxlQURRO0FBRWpCQyxjQUFNLHFCQUZXO0FBR2pCQyxpQkFBUztBQUNQakIsZ0JBQU07QUFDSmtCLGtCQUFNLFFBREY7QUFFSkYsa0JBQU0scUJBRkY7QUFHSkcsc0JBQVU7QUFITjtBQURDLFNBSFE7QUFVakJDLGlCQUFTLE1BQUs1QjtBQVZHLE9BQVosQ0FBUDtBQURjO0FBYWY7O0FBZGtCLEMiLCJmaWxlIjoiY3JlYXRlLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHlhcm4gZnJvbSAnLi4veWFybic7XG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdjcmVhdGUtcGx1Z2luJyxcbiAgICAgIGRlc2M6ICdjcmVhdGUgYSBuZXcgcGx1Z2luJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgIGRlc2M6ICd0aGUgbmV3IHBsdWdpbiBuYW1lJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpblBhdGggPSBmdWxjcnVtLmRpcigncGx1Z2lucycpO1xuXG4gICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAncGFja2FnZS5qc29uJyxcbiAgICAgICdwbHVnaW4uanMnLFxuICAgICAgJy5naXRpZ25vcmUnXG4gICAgXTtcblxuICAgIGNvbnN0IG5ld1BsdWdpblBhdGggPSBwYXRoLmpvaW4ocGx1Z2luUGF0aCwgZnVsY3J1bS5hcmdzLm5hbWUpO1xuXG4gICAgbWtkaXJwLnN5bmMobmV3UGx1Z2luUGF0aCk7XG5cbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJy4uJywgJ3Jlc291cmNlcycsICdkZWZhdWx0LXBsdWdpbicsIGZpbGUpKTtcblxuICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4obmV3UGx1Z2luUGF0aCwgZmlsZSksIGZzLnJlYWRGaWxlU3luYyhzb3VyY2VQYXRoKSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcgZGVwZW5kZW5jaWVzLi4uJyk7XG5cbiAgICBhd2FpdCB5YXJuLnJ1bignaW5zdGFsbCcsIHtjd2Q6IG5ld1BsdWdpblBhdGh9KTtcblxuICAgIGNvbnNvbGUubG9nKCdTZXR0aW5nIHVwIGdpdCByZXBvc2l0b3J5Li4uJyk7XG5cbiAgICBhd2FpdCBnaXQuaW5pdChuZXdQbHVnaW5QYXRoKTtcblxuICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gY3JlYXRlZCBhdCcsIHBhdGguam9pbihwbHVnaW5QYXRoLCBmdWxjcnVtLmFyZ3MubmFtZSkpO1xuICAgIGNvbnNvbGUubG9nKCdSdW4gdGhlIHBsdWdpbiB0YXNrIHVzaW5nOlxcbicpO1xuICAgIGNvbnNvbGUubG9nKCcgIGZ1bGNydW0gJyArIGZ1bGNydW0uYXJncy5uYW1lKTtcbiAgfVxufVxuIl19