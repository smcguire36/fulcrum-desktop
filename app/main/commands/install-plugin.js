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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      const parts = fulcrum.args.url.split('/');

      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path2.default.join(pluginPath, name);

      console.log('Cloning...');

      yield _git2.default.clone(fulcrum.args.url, newPluginPath);

      console.log('Installing...');

      yield _yarn2.default.run('install', { env: _pluginEnv2.default, cwd: newPluginPath });

      console.log('Plugin installed at', newPluginPath);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsInBhcnRzIiwiYXJncyIsInVybCIsInNwbGl0IiwibmFtZSIsImxlbmd0aCIsInJlcGxhY2UiLCJuZXdQbHVnaW5QYXRoIiwiam9pbiIsImNvbnNvbGUiLCJsb2ciLCJjbG9uZSIsInJ1biIsImVudiIsImN3ZCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwicmVxdWlyZWQiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FnQm5CQSxVQWhCbUIscUJBZ0JOLGFBQVk7QUFDdkIsWUFBTUMsYUFBYUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBbkI7O0FBRUEsWUFBTUMsUUFBUUYsUUFBUUcsSUFBUixDQUFhQyxHQUFiLENBQWlCQyxLQUFqQixDQUF1QixHQUF2QixDQUFkOztBQUVBLFlBQU1DLE9BQU9KLE1BQU1BLE1BQU1LLE1BQU4sR0FBZSxDQUFyQixFQUF3QkMsT0FBeEIsQ0FBZ0MsT0FBaEMsRUFBeUMsRUFBekMsQ0FBYjs7QUFFQSxZQUFNQyxnQkFBZ0IsZUFBS0MsSUFBTCxDQUFVWCxVQUFWLEVBQXNCTyxJQUF0QixDQUF0Qjs7QUFFQUssY0FBUUMsR0FBUixDQUFZLFlBQVo7O0FBRUEsWUFBTSxjQUFJQyxLQUFKLENBQVViLFFBQVFHLElBQVIsQ0FBYUMsR0FBdkIsRUFBNEJLLGFBQTVCLENBQU47O0FBRUFFLGNBQVFDLEdBQVIsQ0FBWSxlQUFaOztBQUVBLFlBQU0sZUFBS0UsR0FBTCxDQUFTLFNBQVQsRUFBb0IsRUFBQ0Msd0JBQUQsRUFBaUJDLEtBQUtQLGFBQXRCLEVBQXBCLENBQU47O0FBRUFFLGNBQVFDLEdBQVIsQ0FBWSxxQkFBWixFQUFtQ0gsYUFBbkM7QUFDRCxLQWxDa0I7QUFBQTs7QUFDYlEsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGdCQURRO0FBRWpCQyxjQUFNLGtCQUZXO0FBR2pCQyxpQkFBUztBQUNQakIsZUFBSztBQUNIa0Isa0JBQU0sUUFESDtBQUVIRixrQkFBTSx1QkFGSDtBQUdIRyxzQkFBVTtBQUhQO0FBREUsU0FIUTtBQVVqQkMsaUJBQVMsTUFBSzFCO0FBVkcsT0FBWixDQUFQO0FBRGM7QUFhZjs7QUFka0IsQyIsImZpbGUiOiJpbnN0YWxsLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBwbHVnaW5FbnYgZnJvbSAnLi4vcGx1Z2luLWVudic7XG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XG5pbXBvcnQgeWFybiBmcm9tICcuLi95YXJuJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnaW5zdGFsbC1wbHVnaW4nLFxuICAgICAgZGVzYzogJ2luc3RhbGwgYSBwbHVnaW4nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICB1cmw6IHtcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICBkZXNjOiAndGhlIFVSTCB0byBhIGdpdCByZXBvJyxcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpblBhdGggPSBmdWxjcnVtLmRpcigncGx1Z2lucycpO1xuXG4gICAgY29uc3QgcGFydHMgPSBmdWxjcnVtLmFyZ3MudXJsLnNwbGl0KCcvJyk7XG5cbiAgICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXFwuZ2l0LywgJycpO1xuXG4gICAgY29uc3QgbmV3UGx1Z2luUGF0aCA9IHBhdGguam9pbihwbHVnaW5QYXRoLCBuYW1lKTtcblxuICAgIGNvbnNvbGUubG9nKCdDbG9uaW5nLi4uJyk7XG5cbiAgICBhd2FpdCBnaXQuY2xvbmUoZnVsY3J1bS5hcmdzLnVybCwgbmV3UGx1Z2luUGF0aCk7XG5cbiAgICBjb25zb2xlLmxvZygnSW5zdGFsbGluZy4uLicpO1xuXG4gICAgYXdhaXQgeWFybi5ydW4oJ2luc3RhbGwnLCB7ZW52OiBwbHVnaW5FbnYsIGN3ZDogbmV3UGx1Z2luUGF0aH0pO1xuXG4gICAgY29uc29sZS5sb2coJ1BsdWdpbiBpbnN0YWxsZWQgYXQnLCBuZXdQbHVnaW5QYXRoKTtcbiAgfVxufVxuIl19