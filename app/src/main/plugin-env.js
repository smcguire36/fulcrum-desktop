'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _package = require('electron/package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('ELEC', _package2.default.version);

exports.default = _extends({}, process.env, {
  npm_config_target: _package2.default.version,
  npm_config_arch: process.arch,
  npm_config_target_arch: process.arch,
  npm_config_disturl: 'https://atom.io/download/electron',
  npm_config_runtime: 'electron',
  npm_config_build_from_source: 'true'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3BsdWdpbi1lbnYuanMiXSwibmFtZXMiOlsiY29uc29sZSIsImxvZyIsInZlcnNpb24iLCJwcm9jZXNzIiwiZW52IiwibnBtX2NvbmZpZ190YXJnZXQiLCJucG1fY29uZmlnX2FyY2giLCJhcmNoIiwibnBtX2NvbmZpZ190YXJnZXRfYXJjaCIsIm5wbV9jb25maWdfZGlzdHVybCIsIm5wbV9jb25maWdfcnVudGltZSIsIm5wbV9jb25maWdfYnVpbGRfZnJvbV9zb3VyY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBQSxRQUFRQyxHQUFSLENBQVksTUFBWixFQUFvQixrQkFBZ0JDLE9BQXBDOzsrQkFHS0MsUUFBUUMsRztBQUNYQyxxQkFBbUIsa0JBQWdCSCxPO0FBQ25DSSxtQkFBaUJILFFBQVFJLEk7QUFDekJDLDBCQUF3QkwsUUFBUUksSTtBQUNoQ0Usc0JBQW9CLG1DO0FBQ3BCQyxzQkFBb0IsVTtBQUNwQkMsZ0NBQThCIiwiZmlsZSI6InBsdWdpbi1lbnYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZWxlY3Ryb25QYWNrYWdlIGZyb20gJ2VsZWN0cm9uL3BhY2thZ2UuanNvbic7XG5cbmNvbnNvbGUubG9nKCdFTEVDJywgZWxlY3Ryb25QYWNrYWdlLnZlcnNpb24pO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC4uLnByb2Nlc3MuZW52LFxuICBucG1fY29uZmlnX3RhcmdldDogZWxlY3Ryb25QYWNrYWdlLnZlcnNpb24sXG4gIG5wbV9jb25maWdfYXJjaDogcHJvY2Vzcy5hcmNoLFxuICBucG1fY29uZmlnX3RhcmdldF9hcmNoOiBwcm9jZXNzLmFyY2gsXG4gIG5wbV9jb25maWdfZGlzdHVybDogJ2h0dHBzOi8vYXRvbS5pby9kb3dubG9hZC9lbGVjdHJvbicsXG4gIG5wbV9jb25maWdfcnVudGltZTogJ2VsZWN0cm9uJyxcbiAgbnBtX2NvbmZpZ19idWlsZF9mcm9tX3NvdXJjZTogJ3RydWUnXG59O1xuIl19