'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// we need this file because we want to get these paths from Nodejs-only processes

/*
 *  Windows: %LOCALAPPDATA%
 *  macOS:   ~/Library/Application Support
 *  Linux:   ~/.config
 */

let appData = '';
let userData = '';

const APPNAME = 'Fulcrum';

if (process.platform === 'win32') {
  appData = process.env.LOCALAPPDATA;
} else if (process.platform === 'darwin') {
  appData = _path2.default.join(_os2.default.homedir(), 'Library', 'Application Support');
} else {
  appData = process.env.XDG_CONFIG_HOME || _path2.default.join(_os2.default.homedir(), '.config');
}

userData = _path2.default.join(appData, APPNAME);

const paths = {
  appData,
  userData
};

exports.default = paths;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHBsaWNhdGlvbi1wYXRocy5qcyJdLCJuYW1lcyI6WyJhcHBEYXRhIiwidXNlckRhdGEiLCJBUFBOQU1FIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiZW52IiwiTE9DQUxBUFBEQVRBIiwiam9pbiIsImhvbWVkaXIiLCJYREdfQ09ORklHX0hPTUUiLCJwYXRocyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUE7O0FBRUE7Ozs7OztBQU1BLElBQUlBLFVBQVUsRUFBZDtBQUNBLElBQUlDLFdBQVcsRUFBZjs7QUFFQSxNQUFNQyxVQUFVLFNBQWhCOztBQUVBLElBQUlDLFFBQVFDLFFBQVIsS0FBcUIsT0FBekIsRUFBa0M7QUFDaENKLFlBQVVHLFFBQVFFLEdBQVIsQ0FBWUMsWUFBdEI7QUFDRCxDQUZELE1BRU8sSUFBSUgsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUN4Q0osWUFBVSxlQUFLTyxJQUFMLENBQVUsYUFBR0MsT0FBSCxFQUFWLEVBQXdCLFNBQXhCLEVBQW1DLHFCQUFuQyxDQUFWO0FBQ0QsQ0FGTSxNQUVBO0FBQ0xSLFlBQVVHLFFBQVFFLEdBQVIsQ0FBWUksZUFBWixJQUErQixlQUFLRixJQUFMLENBQVUsYUFBR0MsT0FBSCxFQUFWLEVBQXdCLFNBQXhCLENBQXpDO0FBQ0Q7O0FBRURQLFdBQVcsZUFBS00sSUFBTCxDQUFVUCxPQUFWLEVBQW1CRSxPQUFuQixDQUFYOztBQUVBLE1BQU1RLFFBQVE7QUFDWlYsU0FEWTtBQUVaQztBQUZZLENBQWQ7O2tCQUtlUyxLIiwiZmlsZSI6ImFwcGxpY2F0aW9uLXBhdGhzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBvcyBmcm9tICdvcyc7XHJcblxyXG4vLyB3ZSBuZWVkIHRoaXMgZmlsZSBiZWNhdXNlIHdlIHdhbnQgdG8gZ2V0IHRoZXNlIHBhdGhzIGZyb20gTm9kZWpzLW9ubHkgcHJvY2Vzc2VzXHJcblxyXG4vKlxyXG4gKiAgV2luZG93czogJUxPQ0FMQVBQREFUQSVcclxuICogIG1hY09TOiAgIH4vTGlicmFyeS9BcHBsaWNhdGlvbiBTdXBwb3J0XHJcbiAqICBMaW51eDogICB+Ly5jb25maWdcclxuICovXHJcblxyXG5sZXQgYXBwRGF0YSA9ICcnO1xyXG5sZXQgdXNlckRhdGEgPSAnJztcclxuXHJcbmNvbnN0IEFQUE5BTUUgPSAnRnVsY3J1bSc7XHJcblxyXG5pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xyXG4gIGFwcERhdGEgPSBwcm9jZXNzLmVudi5MT0NBTEFQUERBVEE7XHJcbn0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcclxuICBhcHBEYXRhID0gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJ0xpYnJhcnknLCAnQXBwbGljYXRpb24gU3VwcG9ydCcpO1xyXG59IGVsc2Uge1xyXG4gIGFwcERhdGEgPSBwcm9jZXNzLmVudi5YREdfQ09ORklHX0hPTUUgfHwgcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJy5jb25maWcnKTtcclxufVxyXG5cclxudXNlckRhdGEgPSBwYXRoLmpvaW4oYXBwRGF0YSwgQVBQTkFNRSk7XHJcblxyXG5jb25zdCBwYXRocyA9IHtcclxuICBhcHBEYXRhLFxyXG4gIHVzZXJEYXRhXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwYXRocztcclxuIl19