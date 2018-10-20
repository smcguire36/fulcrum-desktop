'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = execute;

var _child_process = require('child_process');

function execute(command, options = {}, logPrefix = 'execute') {
  if (options == null) {
    options = {};
  }

  const env = _extends({}, process.env, options.env, {
    ELECTRON_RUN_AS_NODE: 1
  });

  return new Promise((resolve, reject) => {
    try {
      const child = (0, _child_process.exec)(command, _extends({}, options, { env }));

      const stdoutWrite = data => {
        process.stdout.write(logPrefix.green + ' ' + data.toString());
      };

      const stderrWrite = data => {
        process.stderr.write(logPrefix.red + ' ' + data.toString());
      };

      stdoutWrite(command + '\n');

      child.stdout.on('data', stdoutWrite);
      child.stderr.on('data', stderrWrite);

      child.on('exit', resolve);
    } catch (ex) {
      reject(ex);
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3V0aWxzL2V4ZWMuanMiXSwibmFtZXMiOlsiZXhlY3V0ZSIsImNvbW1hbmQiLCJvcHRpb25zIiwibG9nUHJlZml4IiwiZW52IiwicHJvY2VzcyIsIkVMRUNUUk9OX1JVTl9BU19OT0RFIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjaGlsZCIsInN0ZG91dFdyaXRlIiwiZGF0YSIsInN0ZG91dCIsIndyaXRlIiwiZ3JlZW4iLCJ0b1N0cmluZyIsInN0ZGVycldyaXRlIiwic3RkZXJyIiwicmVkIiwib24iLCJleCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7a0JBRXdCQSxPOztBQUZ4Qjs7QUFFZSxTQUFTQSxPQUFULENBQWlCQyxPQUFqQixFQUEwQkMsVUFBVSxFQUFwQyxFQUF3Q0MsWUFBWSxTQUFwRCxFQUErRDtBQUM1RSxNQUFJRCxXQUFXLElBQWYsRUFBcUI7QUFDbkJBLGNBQVUsRUFBVjtBQUNEOztBQUVELFFBQU1FLG1CQUNEQyxRQUFRRCxHQURQLEVBRURGLFFBQVFFLEdBRlA7QUFHSkUsMEJBQXNCO0FBSGxCLElBQU47O0FBTUEsU0FBTyxJQUFJQyxPQUFKLENBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDLFFBQUk7QUFDRixZQUFNQyxRQUFRLHlCQUFLVCxPQUFMLGVBQWtCQyxPQUFsQixJQUEyQkUsR0FBM0IsSUFBZDs7QUFFQSxZQUFNTyxjQUFlQyxJQUFELElBQVU7QUFDNUJQLGdCQUFRUSxNQUFSLENBQWVDLEtBQWYsQ0FBcUJYLFVBQVVZLEtBQVYsR0FBa0IsR0FBbEIsR0FBd0JILEtBQUtJLFFBQUwsRUFBN0M7QUFDRCxPQUZEOztBQUlBLFlBQU1DLGNBQWVMLElBQUQsSUFBVTtBQUM1QlAsZ0JBQVFhLE1BQVIsQ0FBZUosS0FBZixDQUFxQlgsVUFBVWdCLEdBQVYsR0FBZ0IsR0FBaEIsR0FBc0JQLEtBQUtJLFFBQUwsRUFBM0M7QUFDRCxPQUZEOztBQUlBTCxrQkFBWVYsVUFBVSxJQUF0Qjs7QUFFQVMsWUFBTUcsTUFBTixDQUFhTyxFQUFiLENBQWdCLE1BQWhCLEVBQXdCVCxXQUF4QjtBQUNBRCxZQUFNUSxNQUFOLENBQWFFLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0JILFdBQXhCOztBQUVBUCxZQUFNVSxFQUFOLENBQVMsTUFBVCxFQUFpQlosT0FBakI7QUFDRCxLQWpCRCxDQWlCRSxPQUFPYSxFQUFQLEVBQVc7QUFDWFosYUFBT1ksRUFBUDtBQUNEO0FBQ0YsR0FyQk0sQ0FBUDtBQXNCRCIsImZpbGUiOiJleGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtleGVjfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV4ZWN1dGUoY29tbWFuZCwgb3B0aW9ucyA9IHt9LCBsb2dQcmVmaXggPSAnZXhlY3V0ZScpIHtcclxuICBpZiAob3B0aW9ucyA9PSBudWxsKSB7XHJcbiAgICBvcHRpb25zID0ge307XHJcbiAgfVxyXG5cclxuICBjb25zdCBlbnYgPSB7XHJcbiAgICAuLi5wcm9jZXNzLmVudixcclxuICAgIC4uLm9wdGlvbnMuZW52LFxyXG4gICAgRUxFQ1RST05fUlVOX0FTX05PREU6IDFcclxuICB9O1xyXG5cclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgY2hpbGQgPSBleGVjKGNvbW1hbmQsIHsuLi5vcHRpb25zLCBlbnZ9KTtcclxuXHJcbiAgICAgIGNvbnN0IHN0ZG91dFdyaXRlID0gKGRhdGEpID0+IHtcclxuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShsb2dQcmVmaXguZ3JlZW4gKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3Qgc3RkZXJyV3JpdGUgPSAoZGF0YSkgPT4ge1xyXG4gICAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGxvZ1ByZWZpeC5yZWQgKyAnICcgKyBkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgc3Rkb3V0V3JpdGUoY29tbWFuZCArICdcXG4nKTtcclxuXHJcbiAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIHN0ZG91dFdyaXRlKTtcclxuICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgc3RkZXJyV3JpdGUpO1xyXG5cclxuICAgICAgY2hpbGQub24oJ2V4aXQnLCByZXNvbHZlKTtcclxuICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgIHJlamVjdChleCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIl19