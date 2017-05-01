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

      const commands = [];

      const parts = fulcrum.args.url.split('/');

      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path2.default.join(pluginPath, name);

      commands.push(`git clone ${fulcrum.args.url} ${newPluginPath}`);
      commands.push(`cd ${newPluginPath}`);
      commands.push('yarn');

      const string = commands.join(' && ');

      console.log('Installing...');

      (0, _child_process.execSync)(string, { env: _pluginEnv2.default });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsImNvbW1hbmRzIiwicGFydHMiLCJhcmdzIiwidXJsIiwic3BsaXQiLCJuYW1lIiwibGVuZ3RoIiwicmVwbGFjZSIsIm5ld1BsdWdpblBhdGgiLCJqb2luIiwicHVzaCIsInN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJlbnYiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsInJlcXVpcmVkIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUEsU0FnQm5CQSxVQWhCbUIscUJBZ0JOLGFBQVk7QUFDdkIsWUFBTUMsYUFBYUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBbkI7O0FBRUEsWUFBTUMsV0FBVyxFQUFqQjs7QUFFQSxZQUFNQyxRQUFRSCxRQUFRSSxJQUFSLENBQWFDLEdBQWIsQ0FBaUJDLEtBQWpCLENBQXVCLEdBQXZCLENBQWQ7O0FBRUEsWUFBTUMsT0FBT0osTUFBTUEsTUFBTUssTUFBTixHQUFlLENBQXJCLEVBQXdCQyxPQUF4QixDQUFnQyxPQUFoQyxFQUF5QyxFQUF6QyxDQUFiOztBQUVBLFlBQU1DLGdCQUFnQixlQUFLQyxJQUFMLENBQVVaLFVBQVYsRUFBc0JRLElBQXRCLENBQXRCOztBQUVBTCxlQUFTVSxJQUFULENBQWUsYUFBWVosUUFBUUksSUFBUixDQUFhQyxHQUFJLElBQUdLLGFBQWMsRUFBN0Q7QUFDQVIsZUFBU1UsSUFBVCxDQUFlLE1BQUtGLGFBQWMsRUFBbEM7QUFDQVIsZUFBU1UsSUFBVCxDQUFjLE1BQWQ7O0FBRUEsWUFBTUMsU0FBU1gsU0FBU1MsSUFBVCxDQUFjLE1BQWQsQ0FBZjs7QUFFQUcsY0FBUUMsR0FBUixDQUFZLGVBQVo7O0FBRUEsbUNBQVNGLE1BQVQsRUFBaUIsRUFBQ0csd0JBQUQsRUFBakI7O0FBRUFGLGNBQVFDLEdBQVIsQ0FBWSxxQkFBWixFQUFtQ0wsYUFBbkM7QUFDRCxLQXRDa0I7QUFBQTs7QUFDYk8sTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGdCQURRO0FBRWpCQyxjQUFNLGtCQUZXO0FBR2pCQyxpQkFBUztBQUNQaEIsZUFBSztBQUNIaUIsa0JBQU0sUUFESDtBQUVIRixrQkFBTSx1QkFGSDtBQUdIRyxzQkFBVTtBQUhQO0FBREUsU0FIUTtBQVVqQkMsaUJBQVMsTUFBSzFCO0FBVkcsT0FBWixDQUFQO0FBRGM7QUFhZjs7QUFka0IsQyIsImZpbGUiOiJpbnN0YWxsLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBwbHVnaW5FbnYgZnJvbSAnLi4vcGx1Z2luLWVudic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ2luc3RhbGwtcGx1Z2luJyxcbiAgICAgIGRlc2M6ICdpbnN0YWxsIGEgcGx1Z2luJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgdXJsOiB7XG4gICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgZGVzYzogJ3RoZSBVUkwgdG8gYSBnaXQgcmVwbycsXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRoID0gZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKTtcblxuICAgIGNvbnN0IGNvbW1hbmRzID0gW107XG5cbiAgICBjb25zdCBwYXJ0cyA9IGZ1bGNydW0uYXJncy51cmwuc3BsaXQoJy8nKTtcblxuICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9cXC5naXQvLCAnJyk7XG5cbiAgICBjb25zdCBuZXdQbHVnaW5QYXRoID0gcGF0aC5qb2luKHBsdWdpblBhdGgsIG5hbWUpO1xuXG4gICAgY29tbWFuZHMucHVzaChgZ2l0IGNsb25lICR7ZnVsY3J1bS5hcmdzLnVybH0gJHtuZXdQbHVnaW5QYXRofWApO1xuICAgIGNvbW1hbmRzLnB1c2goYGNkICR7bmV3UGx1Z2luUGF0aH1gKTtcbiAgICBjb21tYW5kcy5wdXNoKCd5YXJuJyk7XG5cbiAgICBjb25zdCBzdHJpbmcgPSBjb21tYW5kcy5qb2luKCcgJiYgJyk7XG5cbiAgICBjb25zb2xlLmxvZygnSW5zdGFsbGluZy4uLicpO1xuXG4gICAgZXhlY1N5bmMoc3RyaW5nLCB7ZW52OiBwbHVnaW5FbnZ9KTtcblxuICAgIGNvbnNvbGUubG9nKCdQbHVnaW4gaW5zdGFsbGVkIGF0JywgbmV3UGx1Z2luUGF0aCk7XG4gIH1cbn1cbiJdfQ==