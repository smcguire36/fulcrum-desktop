'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluginEnv = require('./plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Yarn {
  static get yarnBin() {
    if (process.env.DEVELOPMENT) {
      return _path2.default.resolve(_path2.default.join(__dirname, '..', '..', 'resources', 'scripts', 'yarn.js'));
    }

    if (process.platform === 'darwin') {
      return _path2.default.resolve(_path2.default.join(_path2.default.dirname(process.execPath), '..', 'scripts', 'yarn.js'));
    }

    return _path2.default.join(_path2.default.dirname(process.execPath), 'scripts', 'yarn.js');
  }

  static run(command, options = {}) {
    const env = _extends({}, process.env, options.env, _pluginEnv2.default, {
      ELECTRON_RUN_AS_NODE: 1
    });

    const wrappedCommand = [process.execPath, this.yarnBin, command].join(' ');

    return new Promise((resolve, reject) => {
      try {
        const child = (0, _child_process.exec)(wrappedCommand, _extends({}, options, { env }));

        child.stdout.on('data', options.logger.stdoutWrite);

        child.stderr.on('data', options.logger.stderrWrite);

        child.on('exit', function () {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}
exports.default = Yarn;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3lhcm4uanMiXSwibmFtZXMiOlsiWWFybiIsInlhcm5CaW4iLCJwcm9jZXNzIiwiZW52IiwiREVWRUxPUE1FTlQiLCJyZXNvbHZlIiwiam9pbiIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwicnVuIiwiY29tbWFuZCIsIm9wdGlvbnMiLCJFTEVDVFJPTl9SVU5fQVNfTk9ERSIsIndyYXBwZWRDb21tYW5kIiwiUHJvbWlzZSIsInJlamVjdCIsImNoaWxkIiwic3Rkb3V0Iiwib24iLCJsb2dnZXIiLCJzdGRvdXRXcml0ZSIsInN0ZGVyciIsInN0ZGVycldyaXRlIiwiZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsSUFBTixDQUFXO0FBQ3hCLGFBQVdDLE9BQVgsR0FBcUI7QUFDbkIsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxXQUFoQixFQUE2QjtBQUMzQixhQUFPLGVBQUtDLE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsV0FBakMsRUFBOEMsU0FBOUMsRUFBeUQsU0FBekQsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsUUFBSUwsUUFBUU0sUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxhQUFPLGVBQUtILE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVUsZUFBS0csT0FBTCxDQUFhUCxRQUFRUSxRQUFyQixDQUFWLEVBQTBDLElBQTFDLEVBQWdELFNBQWhELEVBQTJELFNBQTNELENBQWIsQ0FBUDtBQUNEOztBQUVELFdBQU8sZUFBS0osSUFBTCxDQUFVLGVBQUtHLE9BQUwsQ0FBYVAsUUFBUVEsUUFBckIsQ0FBVixFQUEwQyxTQUExQyxFQUFxRCxTQUFyRCxDQUFQO0FBQ0Q7O0FBRUQsU0FBT0MsR0FBUCxDQUFXQyxPQUFYLEVBQW9CQyxVQUFVLEVBQTlCLEVBQWtDO0FBQ2hDLFVBQU1WLG1CQUNERCxRQUFRQyxHQURQLEVBRURVLFFBQVFWLEdBRlA7QUFJSlcsNEJBQXNCO0FBSmxCLE1BQU47O0FBT0EsVUFBTUMsaUJBQWlCLENBQ3JCYixRQUFRUSxRQURhLEVBRXJCLEtBQUtULE9BRmdCLEVBR3JCVyxPQUhxQixFQUlyQk4sSUFKcUIsQ0FJaEIsR0FKZ0IsQ0FBdkI7O0FBTUEsV0FBTyxJQUFJVSxPQUFKLENBQVksQ0FBQ1gsT0FBRCxFQUFVWSxNQUFWLEtBQXFCO0FBQ3RDLFVBQUk7QUFDRixjQUFNQyxRQUFRLHlCQUFLSCxjQUFMLGVBQXlCRixPQUF6QixJQUFrQ1YsR0FBbEMsSUFBZDs7QUFFQWUsY0FBTUMsTUFBTixDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCUCxRQUFRUSxNQUFSLENBQWVDLFdBQXZDOztBQUVBSixjQUFNSyxNQUFOLENBQWFILEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0JQLFFBQVFRLE1BQVIsQ0FBZUcsV0FBdkM7O0FBRUFOLGNBQU1FLEVBQU4sQ0FBUyxNQUFULEVBQWlCLFlBQVc7QUFDMUJmO0FBQ0QsU0FGRDtBQUdELE9BVkQsQ0FVRSxPQUFPb0IsRUFBUCxFQUFXO0FBQ1hSLGVBQU9RLEVBQVA7QUFDRDtBQUNGLEtBZE0sQ0FBUDtBQWVEO0FBMUN1QjtrQkFBTHpCLEkiLCJmaWxlIjoieWFybi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY30gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwbHVnaW5FbnYgZnJvbSAnLi9wbHVnaW4tZW52JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWWFybiB7XG4gIHN0YXRpYyBnZXQgeWFybkJpbigpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWRUxPUE1FTlQpIHtcbiAgICAgIHJldHVybiBwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJy4uJywgJ3Jlc291cmNlcycsICdzY3JpcHRzJywgJ3lhcm4uanMnKSk7XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihwYXRoLmRpcm5hbWUocHJvY2Vzcy5leGVjUGF0aCksICcuLicsICdzY3JpcHRzJywgJ3lhcm4uanMnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhdGguam9pbihwYXRoLmRpcm5hbWUocHJvY2Vzcy5leGVjUGF0aCksICdzY3JpcHRzJywgJ3lhcm4uanMnKTtcbiAgfVxuXG4gIHN0YXRpYyBydW4oY29tbWFuZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgZW52ID0ge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICAuLi5vcHRpb25zLmVudixcbiAgICAgIC4uLnBsdWdpbkVudixcbiAgICAgIEVMRUNUUk9OX1JVTl9BU19OT0RFOiAxXG4gICAgfTtcblxuICAgIGNvbnN0IHdyYXBwZWRDb21tYW5kID0gW1xuICAgICAgcHJvY2Vzcy5leGVjUGF0aCxcbiAgICAgIHRoaXMueWFybkJpbixcbiAgICAgIGNvbW1hbmRcbiAgICBdLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjaGlsZCA9IGV4ZWMod3JhcHBlZENvbW1hbmQsIHsuLi5vcHRpb25zLCBlbnZ9KTtcblxuICAgICAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCBvcHRpb25zLmxvZ2dlci5zdGRvdXRXcml0ZSk7XG5cbiAgICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgb3B0aW9ucy5sb2dnZXIuc3RkZXJyV3JpdGUpO1xuXG4gICAgICAgIGNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuIl19