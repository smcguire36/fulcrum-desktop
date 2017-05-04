'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _version = require('../version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({}, process.env, {
  npm_config_target: _version2.default.electron,
  npm_config_arch: process.arch,
  npm_config_target_arch: process.arch,
  npm_config_disturl: 'https://atom.io/download/electron',
  npm_config_runtime: 'electron',
  npm_config_build_from_source: 'true'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3BsdWdpbi1lbnYuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsImVudiIsIm5wbV9jb25maWdfdGFyZ2V0IiwiZWxlY3Ryb24iLCJucG1fY29uZmlnX2FyY2giLCJhcmNoIiwibnBtX2NvbmZpZ190YXJnZXRfYXJjaCIsIm5wbV9jb25maWdfZGlzdHVybCIsIm5wbV9jb25maWdfcnVudGltZSIsIm5wbV9jb25maWdfYnVpbGRfZnJvbV9zb3VyY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OzsrQkFHS0EsUUFBUUMsRztBQUNYQyxxQkFBbUIsa0JBQUlDLFE7QUFDdkJDLG1CQUFpQkosUUFBUUssSTtBQUN6QkMsMEJBQXdCTixRQUFRSyxJO0FBQ2hDRSxzQkFBb0IsbUM7QUFDcEJDLHNCQUFvQixVO0FBQ3BCQyxnQ0FBOEIiLCJmaWxlIjoicGx1Z2luLWVudi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwa2cgZnJvbSAnLi4vdmVyc2lvbic7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLi4ucHJvY2Vzcy5lbnYsXG4gIG5wbV9jb25maWdfdGFyZ2V0OiBwa2cuZWxlY3Ryb24sXG4gIG5wbV9jb25maWdfYXJjaDogcHJvY2Vzcy5hcmNoLFxuICBucG1fY29uZmlnX3RhcmdldF9hcmNoOiBwcm9jZXNzLmFyY2gsXG4gIG5wbV9jb25maWdfZGlzdHVybDogJ2h0dHBzOi8vYXRvbS5pby9kb3dubG9hZC9lbGVjdHJvbicsXG4gIG5wbV9jb25maWdfcnVudGltZTogJ2VsZWN0cm9uJyxcbiAgbnBtX2NvbmZpZ19idWlsZF9mcm9tX3NvdXJjZTogJ3RydWUnXG59O1xuIl19