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
  static get yarnRoot() {
    if (process.env.DEVELOPMENT) {
      return _path2.default.resolve(_path2.default.join(__dirname, '..', '..', 'resources', 'yarn', 'yarn'));
    }

    if (process.platform === 'darwin') {
      return _path2.default.resolve(_path2.default.join(process.execPath, '..', 'yarn'));
    }

    return _path2.default.join(process.execPath, 'yarn');
  }

  static get yarnBin() {
    return _path2.default.join(this.yarnRoot, 'bin', 'yarn.js');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3lhcm4uanMiXSwibmFtZXMiOlsiWWFybiIsInlhcm5Sb290IiwicHJvY2VzcyIsImVudiIsIkRFVkVMT1BNRU5UIiwicmVzb2x2ZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJwbGF0Zm9ybSIsImV4ZWNQYXRoIiwieWFybkJpbiIsInJ1biIsImNvbW1hbmQiLCJvcHRpb25zIiwiRUxFQ1RST05fUlVOX0FTX05PREUiLCJ3cmFwcGVkQ29tbWFuZCIsInBhcnRzIiwiY3dkIiwic3BsaXQiLCJzZXAiLCJuYW1lIiwibGVuZ3RoIiwiUHJvbWlzZSIsInJlamVjdCIsImNoaWxkIiwic3Rkb3V0Iiwib24iLCJkYXRhIiwid3JpdGUiLCJncmVlbiIsInRvU3RyaW5nIiwic3RkZXJyIiwicmVkIiwiZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsSUFBTixDQUFXO0FBQ3hCLGFBQVdDLFFBQVgsR0FBc0I7QUFDcEIsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxXQUFoQixFQUE2QjtBQUMzQixhQUFPLGVBQUtDLE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsSUFBckIsRUFBMkIsSUFBM0IsRUFBaUMsV0FBakMsRUFBOEMsTUFBOUMsRUFBc0QsTUFBdEQsQ0FBYixDQUFQO0FBQ0Q7O0FBRUQsUUFBSUwsUUFBUU0sUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxhQUFPLGVBQUtILE9BQUwsQ0FBYSxlQUFLQyxJQUFMLENBQVVKLFFBQVFPLFFBQWxCLEVBQTRCLElBQTVCLEVBQWtDLE1BQWxDLENBQWIsQ0FBUDtBQUNEOztBQUVELFdBQU8sZUFBS0gsSUFBTCxDQUFVSixRQUFRTyxRQUFsQixFQUE0QixNQUE1QixDQUFQO0FBQ0Q7O0FBRUQsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixXQUFPLGVBQUtKLElBQUwsQ0FBVSxLQUFLTCxRQUFmLEVBQXlCLEtBQXpCLEVBQWdDLFNBQWhDLENBQVA7QUFDRDs7QUFFRCxTQUFPVSxHQUFQLENBQVdDLE9BQVgsRUFBb0JDLFVBQVUsRUFBOUIsRUFBa0M7QUFDaEMsVUFBTVYsbUJBQ0RELFFBQVFDLEdBRFAsRUFFRFUsUUFBUVYsR0FGUDtBQUlKVyw0QkFBc0I7QUFKbEIsTUFBTjs7QUFPQSxVQUFNQyxpQkFBaUIsQ0FDckJiLFFBQVFPLFFBRGEsRUFFckIsS0FBS0MsT0FGZ0IsRUFHckJFLE9BSHFCLEVBSXJCTixJQUpxQixDQUloQixHQUpnQixDQUF2Qjs7QUFNQSxVQUFNVSxRQUFRSCxRQUFRSSxHQUFSLENBQVlDLEtBQVosQ0FBa0IsZUFBS0MsR0FBdkIsQ0FBZDtBQUNBLFVBQU1DLE9BQU9KLE1BQU1BLE1BQU1LLE1BQU4sR0FBZSxDQUFyQixDQUFiOztBQUVBLFdBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNqQixPQUFELEVBQVVrQixNQUFWLEtBQXFCO0FBQ3RDLFVBQUk7QUFDRixjQUFNQyxRQUFRLHlCQUFLVCxjQUFMLGVBQXlCRixPQUF6QixJQUFrQ1YsR0FBbEMsSUFBZDs7QUFFQXFCLGNBQU1DLE1BQU4sQ0FBYUMsRUFBYixDQUFnQixNQUFoQixFQUF5QkMsSUFBRCxJQUFVO0FBQ2hDekIsa0JBQVF1QixNQUFSLENBQWVHLEtBQWYsQ0FBcUJSLEtBQUtTLEtBQUwsR0FBYSxHQUFiLEdBQW1CRixLQUFLRyxRQUFMLEVBQXhDO0FBQ0QsU0FGRDs7QUFJQU4sY0FBTU8sTUFBTixDQUFhTCxFQUFiLENBQWdCLE1BQWhCLEVBQXlCQyxJQUFELElBQVU7QUFDaEN6QixrQkFBUTZCLE1BQVIsQ0FBZUgsS0FBZixDQUFxQlIsS0FBS1ksR0FBTCxHQUFXLEdBQVgsR0FBaUJMLEtBQUtHLFFBQUwsRUFBdEM7QUFDRCxTQUZEOztBQUlBTixjQUFNRSxFQUFOLENBQVMsTUFBVCxFQUFpQixZQUFXO0FBQzFCckI7QUFDRCxTQUZEO0FBR0QsT0FkRCxDQWNFLE9BQU80QixFQUFQLEVBQVc7QUFDWFYsZUFBT1UsRUFBUDtBQUNEO0FBQ0YsS0FsQk0sQ0FBUDtBQW1CRDtBQXJEdUI7a0JBQUxqQyxJIiwiZmlsZSI6Inlhcm4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2V4ZWN9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4vcGx1Z2luLWVudic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFlhcm4ge1xuICBzdGF0aWMgZ2V0IHlhcm5Sb290KCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5ERVZFTE9QTUVOVCkge1xuICAgICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnLi4nLCAncmVzb3VyY2VzJywgJ3lhcm4nLCAneWFybicpKTtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICAgIHJldHVybiBwYXRoLnJlc29sdmUocGF0aC5qb2luKHByb2Nlc3MuZXhlY1BhdGgsICcuLicsICd5YXJuJykpO1xuICAgIH1cblxuICAgIHJldHVybiBwYXRoLmpvaW4ocHJvY2Vzcy5leGVjUGF0aCwgJ3lhcm4nKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgeWFybkJpbigpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMueWFyblJvb3QsICdiaW4nLCAneWFybi5qcycpO1xuICB9XG5cbiAgc3RhdGljIHJ1bihjb21tYW5kLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBlbnYgPSB7XG4gICAgICAuLi5wcm9jZXNzLmVudixcbiAgICAgIC4uLm9wdGlvbnMuZW52LFxuICAgICAgLi4ucGx1Z2luRW52LFxuICAgICAgRUxFQ1RST05fUlVOX0FTX05PREU6IDFcbiAgICB9O1xuXG4gICAgY29uc3Qgd3JhcHBlZENvbW1hbmQgPSBbXG4gICAgICBwcm9jZXNzLmV4ZWNQYXRoLFxuICAgICAgdGhpcy55YXJuQmluLFxuICAgICAgY29tbWFuZFxuICAgIF0uam9pbignICcpO1xuXG4gICAgY29uc3QgcGFydHMgPSBvcHRpb25zLmN3ZC5zcGxpdChwYXRoLnNlcCk7XG4gICAgY29uc3QgbmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gZXhlYyh3cmFwcGVkQ29tbWFuZCwgey4uLm9wdGlvbnMsIGVudn0pO1xuXG4gICAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobmFtZS5ncmVlbiArICcgJyArIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PiB7XG4gICAgICAgICAgcHJvY2Vzcy5zdGRlcnIud3JpdGUobmFtZS5yZWQgKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjaGlsZC5vbignZXhpdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZWplY3QoZXgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==