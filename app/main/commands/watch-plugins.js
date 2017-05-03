'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*'));

      const promises = [];

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(pluginPath);

        const parts = pluginPath.split(_path2.default.sep);
        const name = parts[parts.length - 1];

        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        console.log('Watching plugin...', pluginPath);

        promises.push(_yarn2.default.run('watch', { cwd: pluginDir }));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3dhdGNoLXBsdWdpbnMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsInBsdWdpblBhdGhzIiwic3luYyIsImpvaW4iLCJmdWxjcnVtIiwiZGlyIiwicHJvbWlzZXMiLCJwbHVnaW5QYXRoIiwicGx1Z2luRGlyIiwicmVzb2x2ZSIsInBhcnRzIiwic3BsaXQiLCJzZXAiLCJuYW1lIiwibGVuZ3RoIiwiYXJncyIsImNvbnNvbGUiLCJsb2ciLCJwdXNoIiwicnVuIiwiY3dkIiwiUHJvbWlzZSIsImFsbCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJ0eXBlIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7OztrQkFFZSxNQUFNO0FBQUE7QUFBQSxTQWVuQkEsVUFmbUIscUJBZU4sYUFBWTtBQUN2QixZQUFNQyxjQUFjLGVBQUtDLElBQUwsQ0FBVSxlQUFLQyxJQUFMLENBQVVDLFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVYsRUFBa0MsR0FBbEMsQ0FBVixDQUFwQjs7QUFFQSxZQUFNQyxXQUFXLEVBQWpCOztBQUVBLFdBQUssTUFBTUMsVUFBWCxJQUF5Qk4sV0FBekIsRUFBc0M7QUFDcEMsY0FBTU8sWUFBWSxlQUFLQyxPQUFMLENBQWFGLFVBQWIsQ0FBbEI7O0FBRUEsY0FBTUcsUUFBUUgsV0FBV0ksS0FBWCxDQUFpQixlQUFLQyxHQUF0QixDQUFkO0FBQ0EsY0FBTUMsT0FBT0gsTUFBTUEsTUFBTUksTUFBTixHQUFlLENBQXJCLENBQWI7O0FBRUEsWUFBSVYsUUFBUVcsSUFBUixDQUFhRixJQUFiLElBQXFCQSxTQUFTVCxRQUFRVyxJQUFSLENBQWFGLElBQS9DLEVBQXFEO0FBQ25EO0FBQ0Q7O0FBRURHLGdCQUFRQyxHQUFSLENBQVksb0JBQVosRUFBa0NWLFVBQWxDOztBQUVBRCxpQkFBU1ksSUFBVCxDQUFjLGVBQUtDLEdBQUwsQ0FBUyxPQUFULEVBQWtCLEVBQUNDLEtBQUtaLFNBQU4sRUFBbEIsQ0FBZDtBQUNEOztBQUVELFlBQU1hLFFBQVFDLEdBQVIsQ0FBWWhCLFFBQVosQ0FBTjtBQUNELEtBcENrQjtBQUFBOztBQUNiaUIsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLGVBRFE7QUFFakJDLGNBQU0saUNBRlc7QUFHakJDLGlCQUFTO0FBQ1BkLGdCQUFNO0FBQ0phLGtCQUFNLHNCQURGO0FBRUpFLGtCQUFNO0FBRkY7QUFEQyxTQUhRO0FBU2pCQyxpQkFBUyxNQUFLN0I7QUFURyxPQUFaLENBQVA7QUFEYztBQVlmOztBQWJrQixDIiwiZmlsZSI6IndhdGNoLXBsdWdpbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduLCBleGVjIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICd3YXRjaC1wbHVnaW5zJyxcbiAgICAgIGRlc2M6ICd3YXRjaCBhbmQgcmVjb21waWxlIGFsbCBwbHVnaW5zJyxcbiAgICAgIGJ1aWxkZXI6IHtcbiAgICAgICAgbmFtZToge1xuICAgICAgICAgIGRlc2M6ICdwbHVnaW4gbmFtZSB0byB3YXRjaCcsXG4gICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4oZnVsY3J1bS5kaXIoJ3BsdWdpbnMnKSwgJyonKSk7XG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBwbHVnaW5EaXIgPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XG5cbiAgICAgIGNvbnN0IHBhcnRzID0gcGx1Z2luUGF0aC5zcGxpdChwYXRoLnNlcCk7XG4gICAgICBjb25zdCBuYW1lID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV07XG5cbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MubmFtZSAmJiBuYW1lICE9PSBmdWxjcnVtLmFyZ3MubmFtZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ1dhdGNoaW5nIHBsdWdpbi4uLicsIHBsdWdpblBhdGgpO1xuXG4gICAgICBwcm9taXNlcy5wdXNoKHlhcm4ucnVuKCd3YXRjaCcsIHtjd2Q6IHBsdWdpbkRpcn0pKTtcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcyk7XG4gIH1cbn1cbiJdfQ==