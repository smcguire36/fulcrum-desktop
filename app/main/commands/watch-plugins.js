'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*'));

      const promises = [];

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(pluginPath);

        if (pluginDir.indexOf('hello') > -1) {
          continue;
        }

        const parts = pluginPath.split(_path2.default.sep);
        const name = parts[parts.length - 1];

        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        console.log('Watching plugin...', pluginPath);

        promises.push(new Promise(function (resolve, reject) {
          try {
            const child = (0, _child_process.exec)('yarn watch', { cwd: pluginDir, env: _pluginEnv2.default });

            child.stdout.on('data', function (data) {
              process.stdout.write(name.green + ' ' + data.toString());
            });

            child.stderr.on('data', function (data) {
              process.stderr.write(name.red + ' ' + data.toString());
            });

            child.on('exit', function () {
              console.log(name.green, 'Done!');
              resolve();
            });

            console.log('Watching...\n\n');
          } catch (ex) {
            console.error('Error watching plugin', pluginPath, ex);
          }
        }));
      }

      yield Promise.all(promises);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'watch-plugins',
        desc: 'watch and recompile all plugins',
        builder: {
          name: {
            desc: 'plugin name to watch',
            type: 'string'
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3dhdGNoLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicHJvbWlzZXMiLCJwbHVnaW5QYXRoIiwicGx1Z2luRGlyIiwicmVzb2x2ZSIsImluZGV4T2YiLCJwYXJ0cyIsInNwbGl0Iiwic2VwIiwibmFtZSIsImxlbmd0aCIsImFyZ3MiLCJjb25zb2xlIiwibG9nIiwicHVzaCIsIlByb21pc2UiLCJyZWplY3QiLCJjaGlsZCIsImN3ZCIsImVudiIsInN0ZG91dCIsIm9uIiwiZGF0YSIsInByb2Nlc3MiLCJ3cml0ZSIsImdyZWVuIiwidG9TdHJpbmciLCJzdGRlcnIiLCJyZWQiLCJleCIsImVycm9yIiwiYWxsIiwidGFzayIsImNsaSIsImNvbW1hbmQiLCJkZXNjIiwiYnVpbGRlciIsInR5cGUiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLFNBZW5CQSxVQWZtQixxQkFlTixhQUFZO0FBQ3ZCLFlBQU1DLGNBQWMsZUFBS0MsSUFBTCxDQUFVLGVBQUtDLElBQUwsQ0FBVUMsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVixFQUFrQyxHQUFsQyxDQUFWLENBQXBCOztBQUVBLFlBQU1DLFdBQVcsRUFBakI7O0FBRUEsV0FBSyxNQUFNQyxVQUFYLElBQXlCTixXQUF6QixFQUFzQztBQUNwQyxjQUFNTyxZQUFZLGVBQUtDLE9BQUwsQ0FBYUYsVUFBYixDQUFsQjs7QUFFQSxZQUFJQyxVQUFVRSxPQUFWLENBQWtCLE9BQWxCLElBQTZCLENBQUMsQ0FBbEMsRUFBcUM7QUFDbkM7QUFDRDs7QUFFRCxjQUFNQyxRQUFRSixXQUFXSyxLQUFYLENBQWlCLGVBQUtDLEdBQXRCLENBQWQ7QUFDQSxjQUFNQyxPQUFPSCxNQUFNQSxNQUFNSSxNQUFOLEdBQWUsQ0FBckIsQ0FBYjs7QUFFQSxZQUFJWCxRQUFRWSxJQUFSLENBQWFGLElBQWIsSUFBcUJBLFNBQVNWLFFBQVFZLElBQVIsQ0FBYUYsSUFBL0MsRUFBcUQ7QUFDbkQ7QUFDRDs7QUFFREcsZ0JBQVFDLEdBQVIsQ0FBWSxvQkFBWixFQUFrQ1gsVUFBbEM7O0FBRUFELGlCQUFTYSxJQUFULENBQWMsSUFBSUMsT0FBSixDQUFZLFVBQUNYLE9BQUQsRUFBVVksTUFBVixFQUFxQjtBQUM3QyxjQUFJO0FBQ0Ysa0JBQU1DLFFBQVEseUJBQUssWUFBTCxFQUFtQixFQUFDQyxLQUFLZixTQUFOLEVBQWlCZ0Isd0JBQWpCLEVBQW5CLENBQWQ7O0FBRUFGLGtCQUFNRyxNQUFOLENBQWFDLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0IsVUFBQ0MsSUFBRCxFQUFVO0FBQ2hDQyxzQkFBUUgsTUFBUixDQUFlSSxLQUFmLENBQXFCZixLQUFLZ0IsS0FBTCxHQUFhLEdBQWIsR0FBbUJILEtBQUtJLFFBQUwsRUFBeEM7QUFDRCxhQUZEOztBQUlBVCxrQkFBTVUsTUFBTixDQUFhTixFQUFiLENBQWdCLE1BQWhCLEVBQXdCLFVBQUNDLElBQUQsRUFBVTtBQUNoQ0Msc0JBQVFJLE1BQVIsQ0FBZUgsS0FBZixDQUFxQmYsS0FBS21CLEdBQUwsR0FBVyxHQUFYLEdBQWlCTixLQUFLSSxRQUFMLEVBQXRDO0FBQ0QsYUFGRDs7QUFJQVQsa0JBQU1JLEVBQU4sQ0FBUyxNQUFULEVBQWlCLFlBQVc7QUFDMUJULHNCQUFRQyxHQUFSLENBQVlKLEtBQUtnQixLQUFqQixFQUF3QixPQUF4QjtBQUNBckI7QUFDRCxhQUhEOztBQUtBUSxvQkFBUUMsR0FBUixDQUFZLGlCQUFaO0FBQ0QsV0FqQkQsQ0FpQkUsT0FBT2dCLEVBQVAsRUFBVztBQUNYakIsb0JBQVFrQixLQUFSLENBQWMsdUJBQWQsRUFBdUM1QixVQUF2QyxFQUFtRDJCLEVBQW5EO0FBQ0Q7QUFDRixTQXJCYSxDQUFkO0FBc0JEOztBQUVELFlBQU1kLFFBQVFnQixHQUFSLENBQVk5QixRQUFaLENBQU47QUFDRCxLQTdEa0I7QUFBQTs7QUFDYitCLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxlQURRO0FBRWpCQyxjQUFNLGlDQUZXO0FBR2pCQyxpQkFBUztBQUNQM0IsZ0JBQU07QUFDSjBCLGtCQUFNLHNCQURGO0FBRUpFLGtCQUFNO0FBRkY7QUFEQyxTQUhRO0FBU2pCQyxpQkFBUyxNQUFLM0M7QUFURyxPQUFaLENBQVA7QUFEYztBQVlmOztBQWJrQixDIiwiZmlsZSI6IndhdGNoLXBsdWdpbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduLCBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBwbHVnaW5FbnYgZnJvbSAnLi4vcGx1Z2luLWVudic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3dhdGNoLXBsdWdpbnMnLFxuICAgICAgZGVzYzogJ3dhdGNoIGFuZCByZWNvbXBpbGUgYWxsIHBsdWdpbnMnLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgZGVzYzogJ3BsdWdpbiBuYW1lIHRvIHdhdGNoJyxcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgaGFuZGxlcjogdGhpcy5ydW5Db21tYW5kXG4gICAgfSk7XG4gIH1cblxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbihmdWxjcnVtLmRpcigncGx1Z2lucycpLCAnKicpKTtcblxuICAgIGNvbnN0IHByb21pc2VzID0gW107XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpblBhdGggb2YgcGx1Z2luUGF0aHMpIHtcbiAgICAgIGNvbnN0IHBsdWdpbkRpciA9IHBhdGgucmVzb2x2ZShwbHVnaW5QYXRoKTtcblxuICAgICAgaWYgKHBsdWdpbkRpci5pbmRleE9mKCdoZWxsbycpID4gLTEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcGx1Z2luUGF0aC5zcGxpdChwYXRoLnNlcCk7XG4gICAgICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MubmFtZSAmJiBuYW1lICE9PSBmdWxjcnVtLmFyZ3MubmFtZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ1dhdGNoaW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBjaGlsZCA9IGV4ZWMoJ3lhcm4gd2F0Y2gnLCB7Y3dkOiBwbHVnaW5EaXIsIGVudjogcGx1Z2luRW52fSk7XG5cbiAgICAgICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobmFtZS5ncmVlbiArICcgJyArIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUobmFtZS5yZWQgKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY2hpbGQub24oJ2V4aXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5hbWUuZ3JlZW4sICdEb25lIScpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coJ1dhdGNoaW5nLi4uXFxuXFxuJyk7XG4gICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igd2F0Y2hpbmcgcGx1Z2luJywgcGx1Z2luUGF0aCwgZXgpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xuICB9XG59XG4iXX0=