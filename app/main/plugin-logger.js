'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = pluginPath => {
  const parts = pluginPath.split(_path2.default.sep);
  const name = parts[parts.length - 1];

  const stdoutWrite = data => {
    process.stdout.write(name.green + ' ' + data.toString());
  };

  const stderrWrite = data => {
    process.stderr.write(name.red + ' ' + data.toString());
  };

  return {
    stdoutWrite,
    stderrWrite,
    log: (...args) => {
      stdoutWrite(_util.format.apply(null, args) + '\n');
    },
    error: (...args) => {
      stderrWrite(_util.format.apply(null, args) + '\n');
    }
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3BsdWdpbi1sb2dnZXIuanMiXSwibmFtZXMiOlsicGx1Z2luUGF0aCIsInBhcnRzIiwic3BsaXQiLCJzZXAiLCJuYW1lIiwibGVuZ3RoIiwic3Rkb3V0V3JpdGUiLCJkYXRhIiwicHJvY2VzcyIsInN0ZG91dCIsIndyaXRlIiwiZ3JlZW4iLCJ0b1N0cmluZyIsInN0ZGVycldyaXRlIiwic3RkZXJyIiwicmVkIiwibG9nIiwiYXJncyIsImFwcGx5IiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7a0JBRWdCQSxVQUFELElBQWdCO0FBQzdCLFFBQU1DLFFBQVFELFdBQVdFLEtBQVgsQ0FBaUIsZUFBS0MsR0FBdEIsQ0FBZDtBQUNBLFFBQU1DLE9BQU9ILE1BQU1BLE1BQU1JLE1BQU4sR0FBZSxDQUFyQixDQUFiOztBQUVBLFFBQU1DLGNBQWVDLElBQUQsSUFBVTtBQUM1QkMsWUFBUUMsTUFBUixDQUFlQyxLQUFmLENBQXFCTixLQUFLTyxLQUFMLEdBQWEsR0FBYixHQUFtQkosS0FBS0ssUUFBTCxFQUF4QztBQUNELEdBRkQ7O0FBSUEsUUFBTUMsY0FBZU4sSUFBRCxJQUFVO0FBQzVCQyxZQUFRTSxNQUFSLENBQWVKLEtBQWYsQ0FBcUJOLEtBQUtXLEdBQUwsR0FBVyxHQUFYLEdBQWlCUixLQUFLSyxRQUFMLEVBQXRDO0FBQ0QsR0FGRDs7QUFJQSxTQUFPO0FBQ0xOLGVBREs7QUFFTE8sZUFGSztBQUdMRyxTQUFLLENBQUMsR0FBR0MsSUFBSixLQUFhO0FBQ2hCWCxrQkFBWSxhQUFPWSxLQUFQLENBQWEsSUFBYixFQUFtQkQsSUFBbkIsSUFBMkIsSUFBdkM7QUFDRCxLQUxJO0FBTUxFLFdBQU8sQ0FBQyxHQUFHRixJQUFKLEtBQWE7QUFDbEJKLGtCQUFZLGFBQU9LLEtBQVAsQ0FBYSxJQUFiLEVBQW1CRCxJQUFuQixJQUEyQixJQUF2QztBQUNEO0FBUkksR0FBUDtBQVVELEMiLCJmaWxlIjoicGx1Z2luLWxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuXG5leHBvcnQgZGVmYXVsdCAocGx1Z2luUGF0aCkgPT4ge1xuICBjb25zdCBwYXJ0cyA9IHBsdWdpblBhdGguc3BsaXQocGF0aC5zZXApO1xuICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cbiAgY29uc3Qgc3Rkb3V0V3JpdGUgPSAoZGF0YSkgPT4ge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG5hbWUuZ3JlZW4gKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xuICB9O1xuXG4gIGNvbnN0IHN0ZGVycldyaXRlID0gKGRhdGEpID0+IHtcbiAgICBwcm9jZXNzLnN0ZGVyci53cml0ZShuYW1lLnJlZCArICcgJyArIGRhdGEudG9TdHJpbmcoKSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzdGRvdXRXcml0ZSxcbiAgICBzdGRlcnJXcml0ZSxcbiAgICBsb2c6ICguLi5hcmdzKSA9PiB7XG4gICAgICBzdGRvdXRXcml0ZShmb3JtYXQuYXBwbHkobnVsbCwgYXJncykgKyAnXFxuJyk7XG4gICAgfSxcbiAgICBlcnJvcjogKC4uLmFyZ3MpID0+IHtcbiAgICAgIHN0ZGVycldyaXRlKGZvcm1hdC5hcHBseShudWxsLCBhcmdzKSArICdcXG4nKTtcbiAgICB9XG4gIH07XG59O1xuIl19