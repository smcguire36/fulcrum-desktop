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

    const parts = options.cwd.split(_path2.default.sep);
    const name = parts[parts.length - 1];

    return new Promise((resolve, reject) => {
      try {
        const child = (0, _child_process.exec)(wrappedCommand, _extends({}, options, { env }));

        child.stdout.on('data', data => {
          process.stdout.write(name.green + ' ' + data.toString());
        });

        child.stderr.on('data', data => {
          process.stderr.write(name.red + ' ' + data.toString());
        });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3lhcm4uanMiXSwibmFtZXMiOlsiWWFybiIsInlhcm5CaW4iLCJwcm9jZXNzIiwiZW52IiwiREVWRUxPUE1FTlQiLCJyZXNvbHZlIiwiam9pbiIsIl9fZGlybmFtZSIsInBsYXRmb3JtIiwiZGlybmFtZSIsImV4ZWNQYXRoIiwicnVuIiwiY29tbWFuZCIsIm9wdGlvbnMiLCJFTEVDVFJPTl9SVU5fQVNfTk9ERSIsIndyYXBwZWRDb21tYW5kIiwicGFydHMiLCJjd2QiLCJzcGxpdCIsInNlcCIsIm5hbWUiLCJsZW5ndGgiLCJQcm9taXNlIiwicmVqZWN0IiwiY2hpbGQiLCJzdGRvdXQiLCJvbiIsImRhdGEiLCJ3cml0ZSIsImdyZWVuIiwidG9TdHJpbmciLCJzdGRlcnIiLCJyZWQiLCJleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxJQUFOLENBQVc7QUFDeEIsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixRQUFJQyxRQUFRQyxHQUFSLENBQVlDLFdBQWhCLEVBQTZCO0FBQzNCLGFBQU8sZUFBS0MsT0FBTCxDQUFhLGVBQUtDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxXQUFqQyxFQUE4QyxTQUE5QyxFQUF5RCxTQUF6RCxDQUFiLENBQVA7QUFDRDs7QUFFRCxRQUFJTCxRQUFRTSxRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDLGFBQU8sZUFBS0gsT0FBTCxDQUFhLGVBQUtDLElBQUwsQ0FBVSxlQUFLRyxPQUFMLENBQWFQLFFBQVFRLFFBQXJCLENBQVYsRUFBMEMsSUFBMUMsRUFBZ0QsU0FBaEQsRUFBMkQsU0FBM0QsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxlQUFLSixJQUFMLENBQVUsZUFBS0csT0FBTCxDQUFhUCxRQUFRUSxRQUFyQixDQUFWLEVBQTBDLFNBQTFDLEVBQXFELFNBQXJELENBQVA7QUFDRDs7QUFFRCxTQUFPQyxHQUFQLENBQVdDLE9BQVgsRUFBb0JDLFVBQVUsRUFBOUIsRUFBa0M7QUFDaEMsVUFBTVYsbUJBQ0RELFFBQVFDLEdBRFAsRUFFRFUsUUFBUVYsR0FGUDtBQUlKVyw0QkFBc0I7QUFKbEIsTUFBTjs7QUFPQSxVQUFNQyxpQkFBaUIsQ0FDckJiLFFBQVFRLFFBRGEsRUFFckIsS0FBS1QsT0FGZ0IsRUFHckJXLE9BSHFCLEVBSXJCTixJQUpxQixDQUloQixHQUpnQixDQUF2Qjs7QUFNQSxVQUFNVSxRQUFRSCxRQUFRSSxHQUFSLENBQVlDLEtBQVosQ0FBa0IsZUFBS0MsR0FBdkIsQ0FBZDtBQUNBLFVBQU1DLE9BQU9KLE1BQU1BLE1BQU1LLE1BQU4sR0FBZSxDQUFyQixDQUFiOztBQUVBLFdBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNqQixPQUFELEVBQVVrQixNQUFWLEtBQXFCO0FBQ3RDLFVBQUk7QUFDRixjQUFNQyxRQUFRLHlCQUFLVCxjQUFMLGVBQXlCRixPQUF6QixJQUFrQ1YsR0FBbEMsSUFBZDs7QUFFQXFCLGNBQU1DLE1BQU4sQ0FBYUMsRUFBYixDQUFnQixNQUFoQixFQUF5QkMsSUFBRCxJQUFVO0FBQ2hDekIsa0JBQVF1QixNQUFSLENBQWVHLEtBQWYsQ0FBcUJSLEtBQUtTLEtBQUwsR0FBYSxHQUFiLEdBQW1CRixLQUFLRyxRQUFMLEVBQXhDO0FBQ0QsU0FGRDs7QUFJQU4sY0FBTU8sTUFBTixDQUFhTCxFQUFiLENBQWdCLE1BQWhCLEVBQXlCQyxJQUFELElBQVU7QUFDaEN6QixrQkFBUTZCLE1BQVIsQ0FBZUgsS0FBZixDQUFxQlIsS0FBS1ksR0FBTCxHQUFXLEdBQVgsR0FBaUJMLEtBQUtHLFFBQUwsRUFBdEM7QUFDRCxTQUZEOztBQUlBTixjQUFNRSxFQUFOLENBQVMsTUFBVCxFQUFpQixZQUFXO0FBQzFCckI7QUFDRCxTQUZEO0FBR0QsT0FkRCxDQWNFLE9BQU80QixFQUFQLEVBQVc7QUFDWFYsZUFBT1UsRUFBUDtBQUNEO0FBQ0YsS0FsQk0sQ0FBUDtBQW1CRDtBQWpEdUI7a0JBQUxqQyxJIiwiZmlsZSI6Inlhcm4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4vcGx1Z2luLWVudic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlhcm4ge1xuICBzdGF0aWMgZ2V0IHlhcm5CaW4oKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52LkRFVkVMT1BNRU5UKSB7XG4gICAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICcuLicsICdyZXNvdXJjZXMnLCAnc2NyaXB0cycsICd5YXJuLmpzJykpO1xuICAgIH1cblxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnLi4nLCAnc2NyaXB0cycsICd5YXJuLmpzJykpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLmpvaW4ocGF0aC5kaXJuYW1lKHByb2Nlc3MuZXhlY1BhdGgpLCAnc2NyaXB0cycsICd5YXJuLmpzJyk7XG4gIH1cblxuICBzdGF0aWMgcnVuKGNvbW1hbmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGVudiA9IHtcbiAgICAgIC4uLnByb2Nlc3MuZW52LFxuICAgICAgLi4ub3B0aW9ucy5lbnYsXG4gICAgICAuLi5wbHVnaW5FbnYsXG4gICAgICBFTEVDVFJPTl9SVU5fQVNfTk9ERTogMVxuICAgIH07XG5cbiAgICBjb25zdCB3cmFwcGVkQ29tbWFuZCA9IFtcbiAgICAgIHByb2Nlc3MuZXhlY1BhdGgsXG4gICAgICB0aGlzLnlhcm5CaW4sXG4gICAgICBjb21tYW5kXG4gICAgXS5qb2luKCcgJyk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IG9wdGlvbnMuY3dkLnNwbGl0KHBhdGguc2VwKTtcbiAgICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgY2hpbGQgPSBleGVjKHdyYXBwZWRDb21tYW5kLCB7Li4ub3B0aW9ucywgZW52fSk7XG5cbiAgICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShuYW1lLmdyZWVuICsgJyAnICsgZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcbiAgICAgICAgICBwcm9jZXNzLnN0ZGVyci53cml0ZShuYW1lLnJlZCArICcgJyArIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoaWxkLm9uKCdleGl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIHJlamVjdChleCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuIl19