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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3lhcm4uanMiXSwibmFtZXMiOlsiWWFybiIsInlhcm5CaW4iLCJwcm9jZXNzIiwiZW52IiwiREVWRUxPUE1FTlQiLCJyZXNvbHZlIiwiam9pbiIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwicnVuIiwiY29tbWFuZCIsIm9wdGlvbnMiLCJFTEVDVFJPTl9SVU5fQVNfTk9ERSIsIndyYXBwZWRDb21tYW5kIiwiUHJvbWlzZSIsInJlamVjdCIsImNoaWxkIiwic3Rkb3V0Iiwib24iLCJsb2dnZXIiLCJzdGRvdXRXcml0ZSIsInN0ZGVyciIsInN0ZGVycldyaXRlIiwiZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsSUFBTixDQUFXO0FBQ3hCLGFBQVdDLE9BQVgsR0FBcUI7QUFDbkIsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxXQUFoQixFQUE2QjtBQUMzQixhQUFPLGVBQUtDLE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsV0FBakMsRUFBOEMsU0FBOUMsRUFBeUQsU0FBekQsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsUUFBSUwsUUFBUU0sUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxhQUFPLGVBQUtILE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVUsZUFBS0csT0FBTCxDQUFhUCxRQUFRUSxRQUFyQixDQUFWLEVBQTBDLElBQTFDLEVBQWdELFNBQWhELEVBQTJELFNBQTNELENBQWIsQ0FBUDtBQUNEOztBQUVELFdBQU8sZUFBS0osSUFBTCxDQUFVLGVBQUtHLE9BQUwsQ0FBYVAsUUFBUVEsUUFBckIsQ0FBVixFQUEwQyxTQUExQyxFQUFxRCxTQUFyRCxDQUFQO0FBQ0Q7O0FBRUQsU0FBT0MsR0FBUCxDQUFXQyxPQUFYLEVBQW9CQyxVQUFVLEVBQTlCLEVBQWtDO0FBQ2hDLFVBQU1WLG1CQUNERCxRQUFRQyxHQURQLEVBRURVLFFBQVFWLEdBRlA7QUFJSlcsNEJBQXNCO0FBSmxCLE1BQU47O0FBT0EsVUFBTUMsaUJBQWlCLENBQ3JCYixRQUFRUSxRQURhLEVBRXJCLEtBQUtULE9BRmdCLEVBR3JCVyxPQUhxQixFQUlyQk4sSUFKcUIsQ0FJaEIsR0FKZ0IsQ0FBdkI7O0FBTUEsV0FBTyxJQUFJVSxPQUFKLENBQVksQ0FBQ1gsT0FBRCxFQUFVWSxNQUFWLEtBQXFCO0FBQ3RDLFVBQUk7QUFDRixjQUFNQyxRQUFRLHlCQUFLSCxjQUFMLGVBQXlCRixPQUF6QixJQUFrQ1YsR0FBbEMsSUFBZDs7QUFFQWUsY0FBTUMsTUFBTixDQUFhQyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCUCxRQUFRUSxNQUFSLENBQWVDLFdBQXZDOztBQUVBSixjQUFNSyxNQUFOLENBQWFILEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0JQLFFBQVFRLE1BQVIsQ0FBZUcsV0FBdkM7O0FBRUFOLGNBQU1FLEVBQU4sQ0FBUyxNQUFULEVBQWlCLFlBQVc7QUFDMUJmO0FBQ0QsU0FGRDtBQUdELE9BVkQsQ0FVRSxPQUFPb0IsRUFBUCxFQUFXO0FBQ1hSLGVBQU9RLEVBQVA7QUFDRDtBQUNGLEtBZE0sQ0FBUDtBQWVEO0FBMUN1QjtrQkFBTHpCLEkiLCJmaWxlIjoieWFybi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXhlY30gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4vcGx1Z2luLWVudic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBZYXJuIHtcclxuICBzdGF0aWMgZ2V0IHlhcm5CaW4oKSB7XHJcbiAgICBpZiAocHJvY2Vzcy5lbnYuREVWRUxPUE1FTlQpIHtcclxuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncmVzb3VyY2VzJywgJ3NjcmlwdHMnLCAneWFybi5qcycpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcclxuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnLi4nLCAnc2NyaXB0cycsICd5YXJuLmpzJykpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnc2NyaXB0cycsICd5YXJuLmpzJyk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcnVuKGNvbW1hbmQsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgZW52ID0ge1xyXG4gICAgICAuLi5wcm9jZXNzLmVudixcclxuICAgICAgLi4ub3B0aW9ucy5lbnYsXHJcbiAgICAgIC4uLnBsdWdpbkVudixcclxuICAgICAgRUxFQ1RST05fUlVOX0FTX05PREU6IDFcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlZENvbW1hbmQgPSBbXHJcbiAgICAgIHByb2Nlc3MuZXhlY1BhdGgsXHJcbiAgICAgIHRoaXMueWFybkJpbixcclxuICAgICAgY29tbWFuZFxyXG4gICAgXS5qb2luKCcgJyk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjaGlsZCA9IGV4ZWMod3JhcHBlZENvbW1hbmQsIHsuLi5vcHRpb25zLCBlbnZ9KTtcclxuXHJcbiAgICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgb3B0aW9ucy5sb2dnZXIuc3Rkb3V0V3JpdGUpO1xyXG5cclxuICAgICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBvcHRpb25zLmxvZ2dlci5zdGRlcnJXcml0ZSk7XHJcblxyXG4gICAgICAgIGNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgICAgcmVqZWN0KGV4KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=