'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _package = require('electron/package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _extends({}, process.env, {
  npm_config_target: _package2.default.version,
  npm_config_arch: process.arch,
  npm_config_target_arch: process.arch,
  npm_config_disturl: 'https://atom.io/download/electron',
  npm_config_runtime: 'electron',
  npm_config_build_from_source: 'true'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL3BsdWdpbi1lbnYuanMiXSwibmFtZXMiOlsicHJvY2VzcyIsImVudiIsIm5wbV9jb25maWdfdGFyZ2V0IiwidmVyc2lvbiIsIm5wbV9jb25maWdfYXJjaCIsImFyY2giLCJucG1fY29uZmlnX3RhcmdldF9hcmNoIiwibnBtX2NvbmZpZ19kaXN0dXJsIiwibnBtX2NvbmZpZ19ydW50aW1lIiwibnBtX2NvbmZpZ19idWlsZF9mcm9tX3NvdXJjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7OytCQUdLQSxRQUFRQyxHO0FBQ1hDLHFCQUFtQixrQkFBZ0JDLE87QUFDbkNDLG1CQUFpQkosUUFBUUssSTtBQUN6QkMsMEJBQXdCTixRQUFRSyxJO0FBQ2hDRSxzQkFBb0IsbUM7QUFDcEJDLHNCQUFvQixVO0FBQ3BCQyxnQ0FBOEIiLCJmaWxlIjoicGx1Z2luLWVudi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBlbGVjdHJvblBhY2thZ2UgZnJvbSAnZWxlY3Ryb24vcGFja2FnZS5qc29uJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAuLi5wcm9jZXNzLmVudixcbiAgbnBtX2NvbmZpZ190YXJnZXQ6IGVsZWN0cm9uUGFja2FnZS52ZXJzaW9uLFxuICBucG1fY29uZmlnX2FyY2g6IHByb2Nlc3MuYXJjaCxcbiAgbnBtX2NvbmZpZ190YXJnZXRfYXJjaDogcHJvY2Vzcy5hcmNoLFxuICBucG1fY29uZmlnX2Rpc3R1cmw6ICdodHRwczovL2F0b20uaW8vZG93bmxvYWQvZWxlY3Ryb24nLFxuICBucG1fY29uZmlnX3J1bnRpbWU6ICdlbGVjdHJvbicsXG4gIG5wbV9jb25maWdfYnVpbGRfZnJvbV9zb3VyY2U6ICd0cnVlJ1xufTtcbiJdfQ==