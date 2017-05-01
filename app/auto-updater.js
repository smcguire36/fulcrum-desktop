'use strict';

var _electron = require('electron');

var _electronLog = require('electron-log');

var _electronLog2 = _interopRequireDefault(_electronLog);

var _electronUpdater = require('electron-updater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_electronUpdater.autoUpdater.logger = _electronLog2.default;
_electronUpdater.autoUpdater.logger.transports.file.level = 'info';

_electronLog2.default.info('Auto-updater starting...');

_electronUpdater.autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

_electronUpdater.autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.');
});

_electronUpdater.autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.');
});

_electronUpdater.autoUpdater.on('error', (ev, err) => {
  console.log('Error in auto-updater.');
});

_electronUpdater.autoUpdater.on('download-progress', (ev, progressObj) => {
  console.log('Download progress...');
});

_electronUpdater.autoUpdater.on('update-downloaded', (ev, info) => {
  console.log('Update downloaded; will install in 5 seconds');
});

_electronUpdater.autoUpdater.on('update-downloaded', (ev, info) => {
  setTimeout(function () {
    _electronUpdater.autoUpdater.quitAndInstall();
  }, 5000);
});

_electron.app.on('ready', function () {
  _electronUpdater.autoUpdater.checkForUpdates();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRvLXVwZGF0ZXIuanMiXSwibmFtZXMiOlsibG9nZ2VyIiwidHJhbnNwb3J0cyIsImZpbGUiLCJsZXZlbCIsImluZm8iLCJvbiIsImNvbnNvbGUiLCJsb2ciLCJldiIsImVyciIsInByb2dyZXNzT2JqIiwic2V0VGltZW91dCIsInF1aXRBbmRJbnN0YWxsIiwiY2hlY2tGb3JVcGRhdGVzIl0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSw2QkFBWUEsTUFBWjtBQUNBLDZCQUFZQSxNQUFaLENBQW1CQyxVQUFuQixDQUE4QkMsSUFBOUIsQ0FBbUNDLEtBQW5DLEdBQTJDLE1BQTNDOztBQUVBLHNCQUFJQyxJQUFKLENBQVMsMEJBQVQ7O0FBRUEsNkJBQVlDLEVBQVosQ0FBZSxxQkFBZixFQUFzQyxNQUFNO0FBQzFDQyxVQUFRQyxHQUFSLENBQVksd0JBQVo7QUFDRCxDQUZEOztBQUlBLDZCQUFZRixFQUFaLENBQWUsa0JBQWYsRUFBbUMsQ0FBQ0csRUFBRCxFQUFLSixJQUFMLEtBQWM7QUFDL0NFLFVBQVFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNELENBRkQ7O0FBSUEsNkJBQVlGLEVBQVosQ0FBZSxzQkFBZixFQUF1QyxDQUFDRyxFQUFELEVBQUtKLElBQUwsS0FBYztBQUNuREUsVUFBUUMsR0FBUixDQUFZLHVCQUFaO0FBQ0QsQ0FGRDs7QUFJQSw2QkFBWUYsRUFBWixDQUFlLE9BQWYsRUFBd0IsQ0FBQ0csRUFBRCxFQUFLQyxHQUFMLEtBQWE7QUFDbkNILFVBQVFDLEdBQVIsQ0FBWSx3QkFBWjtBQUNELENBRkQ7O0FBSUEsNkJBQVlGLEVBQVosQ0FBZSxtQkFBZixFQUFvQyxDQUFDRyxFQUFELEVBQUtFLFdBQUwsS0FBcUI7QUFDdkRKLFVBQVFDLEdBQVIsQ0FBWSxzQkFBWjtBQUNELENBRkQ7O0FBSUEsNkJBQVlGLEVBQVosQ0FBZSxtQkFBZixFQUFvQyxDQUFDRyxFQUFELEVBQUtKLElBQUwsS0FBYztBQUNoREUsVUFBUUMsR0FBUixDQUFZLDhDQUFaO0FBQ0QsQ0FGRDs7QUFJQSw2QkFBWUYsRUFBWixDQUFlLG1CQUFmLEVBQW9DLENBQUNHLEVBQUQsRUFBS0osSUFBTCxLQUFjO0FBQ2hETyxhQUFXLFlBQVc7QUFDcEIsaUNBQVlDLGNBQVo7QUFDRCxHQUZELEVBRUcsSUFGSDtBQUdELENBSkQ7O0FBTUEsY0FBSVAsRUFBSixDQUFPLE9BQVAsRUFBZ0IsWUFBVztBQUN6QiwrQkFBWVEsZUFBWjtBQUNELENBRkQiLCJmaWxlIjoiYXV0by11cGRhdGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXBwIH0gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IGxvZyBmcm9tICdlbGVjdHJvbi1sb2cnO1xuaW1wb3J0IHsgYXV0b1VwZGF0ZXIgfSBmcm9tICdlbGVjdHJvbi11cGRhdGVyJztcblxuYXV0b1VwZGF0ZXIubG9nZ2VyID0gbG9nO1xuYXV0b1VwZGF0ZXIubG9nZ2VyLnRyYW5zcG9ydHMuZmlsZS5sZXZlbCA9ICdpbmZvJztcblxubG9nLmluZm8oJ0F1dG8tdXBkYXRlciBzdGFydGluZy4uLicpO1xuXG5hdXRvVXBkYXRlci5vbignY2hlY2tpbmctZm9yLXVwZGF0ZScsICgpID0+IHtcbiAgY29uc29sZS5sb2coJ0NoZWNraW5nIGZvciB1cGRhdGUuLi4nKTtcbn0pO1xuXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLWF2YWlsYWJsZScsIChldiwgaW5mbykgPT4ge1xuICBjb25zb2xlLmxvZygnVXBkYXRlIGF2YWlsYWJsZS4nKTtcbn0pO1xuXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLW5vdC1hdmFpbGFibGUnLCAoZXYsIGluZm8pID0+IHtcbiAgY29uc29sZS5sb2coJ1VwZGF0ZSBub3QgYXZhaWxhYmxlLicpO1xufSk7XG5cbmF1dG9VcGRhdGVyLm9uKCdlcnJvcicsIChldiwgZXJyKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdFcnJvciBpbiBhdXRvLXVwZGF0ZXIuJyk7XG59KTtcblxuYXV0b1VwZGF0ZXIub24oJ2Rvd25sb2FkLXByb2dyZXNzJywgKGV2LCBwcm9ncmVzc09iaikgPT4ge1xuICBjb25zb2xlLmxvZygnRG93bmxvYWQgcHJvZ3Jlc3MuLi4nKTtcbn0pO1xuXG5hdXRvVXBkYXRlci5vbigndXBkYXRlLWRvd25sb2FkZWQnLCAoZXYsIGluZm8pID0+IHtcbiAgY29uc29sZS5sb2coJ1VwZGF0ZSBkb3dubG9hZGVkOyB3aWxsIGluc3RhbGwgaW4gNSBzZWNvbmRzJyk7XG59KTtcblxuYXV0b1VwZGF0ZXIub24oJ3VwZGF0ZS1kb3dubG9hZGVkJywgKGV2LCBpbmZvKSA9PiB7XG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgYXV0b1VwZGF0ZXIucXVpdEFuZEluc3RhbGwoKTtcbiAgfSwgNTAwMCk7XG59KTtcblxuYXBwLm9uKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICBhdXRvVXBkYXRlci5jaGVja0ZvclVwZGF0ZXMoKTtcbn0pO1xuIl19