'use strict';

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

require('./auto-updater');

var _menubar = require('menubar');

var _menubar2 = _interopRequireDefault(_menubar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Don't store the app data in the roaming dir.
// https://github.com/electron/electron/issues/1404#issuecomment-194391247
if (process.platform === 'win32') {
  _electron.app.setAppUserModelId('com.spatialnetworks.fulcrum');
  _electron.app.setPath('appData', process.env.LOCALAPPDATA);
  _electron.app.setPath('userData', _path2.default.join(process.env.LOCALAPPDATA, 'Fulcrum'));
}

const options = {
  dir: __dirname,
  width: 200,
  height: 90,
  icon: _path2.default.join(__dirname, 'assets', 'images', 'IconTemplate.png')
};

const bar = (0, _menubar2.default)(options);

bar.on('ready', () => {
  // ready
});

function start() {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let browserWindow = null;

  function createWindow() {
    browserWindow = new _electron.BrowserWindow({ width: 210, height: 74 });

    // and load the index.html of the app.
    browserWindow.loadURL(_url2.default.format({
      pathname: _path2.default.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    browserWindow.webContents.openDevTools({ mode: 'detach' });

    browserWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      browserWindow = null;
    });
  }

  _electron.app.on('ready', createWindow);

  _electron.app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      _electron.app.quit();
    }
  });

  _electron.app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (browserWindow === null) {
      createWindow();
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJvcHRpb25zIiwiZGlyIiwiX19kaXJuYW1lIiwid2lkdGgiLCJoZWlnaHQiLCJpY29uIiwiYmFyIiwib24iLCJzdGFydCIsImJyb3dzZXJXaW5kb3ciLCJjcmVhdGVXaW5kb3ciLCJsb2FkVVJMIiwiZm9ybWF0IiwicGF0aG5hbWUiLCJwcm90b2NvbCIsInNsYXNoZXMiLCJ3ZWJDb250ZW50cyIsIm9wZW5EZXZUb29scyIsIm1vZGUiLCJxdWl0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFVQTs7QUFFQTs7Ozs7O0FBVkE7QUFDQTtBQUNBLElBQUlBLFFBQVFDLFFBQVIsS0FBcUIsT0FBekIsRUFBa0M7QUFDaEMsZ0JBQUlDLGlCQUFKLENBQXNCLDZCQUF0QjtBQUNBLGdCQUFJQyxPQUFKLENBQVksU0FBWixFQUF1QkgsUUFBUUksR0FBUixDQUFZQyxZQUFuQztBQUNBLGdCQUFJRixPQUFKLENBQVksVUFBWixFQUF3QixlQUFLRyxJQUFMLENBQVVOLFFBQVFJLEdBQVIsQ0FBWUMsWUFBdEIsRUFBb0MsU0FBcEMsQ0FBeEI7QUFDRDs7QUFNRCxNQUFNRSxVQUFVO0FBQ2RDLE9BQUtDLFNBRFM7QUFFZEMsU0FBTyxHQUZPO0FBR2RDLFVBQVEsRUFITTtBQUlkQyxRQUFNLGVBQUtOLElBQUwsQ0FBVUcsU0FBVixFQUFxQixRQUFyQixFQUErQixRQUEvQixFQUF5QyxrQkFBekM7QUFKUSxDQUFoQjs7QUFPQSxNQUFNSSxNQUFNLHVCQUFRTixPQUFSLENBQVo7O0FBRUFNLElBQUlDLEVBQUosQ0FBTyxPQUFQLEVBQWdCLE1BQU07QUFDcEI7QUFDRCxDQUZEOztBQUlBLFNBQVNDLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0EsTUFBSUMsZ0JBQWdCLElBQXBCOztBQUVBLFdBQVNDLFlBQVQsR0FBd0I7QUFDdEJELG9CQUFnQiw0QkFBa0IsRUFBQ04sT0FBTyxHQUFSLEVBQWFDLFFBQVEsRUFBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUssa0JBQWNFLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxnQkFBVSxlQUFLZCxJQUFMLENBQVVHLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JZLGdCQUFVLE9BRnFCO0FBRy9CQyxlQUFTO0FBSHNCLEtBQVgsQ0FBdEI7O0FBTUFOLGtCQUFjTyxXQUFkLENBQTBCQyxZQUExQixDQUF1QyxFQUFDQyxNQUFNLFFBQVAsRUFBdkM7O0FBRUFULGtCQUFjRixFQUFkLENBQWlCLFFBQWpCLEVBQTJCLE1BQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0FFLHNCQUFnQixJQUFoQjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxnQkFBSUYsRUFBSixDQUFPLE9BQVAsRUFBZ0JHLFlBQWhCOztBQUVBLGdCQUFJSCxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0EsUUFBSWQsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxvQkFBSXlCLElBQUo7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsZ0JBQUlaLEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDdkI7QUFDQTtBQUNBLFFBQUlFLGtCQUFrQixJQUF0QixFQUE0QjtBQUMxQkM7QUFDRDtBQUNGLEdBTkQ7QUFPRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG4vLyBEb24ndCBzdG9yZSB0aGUgYXBwIGRhdGEgaW4gdGhlIHJvYW1pbmcgZGlyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNDA0I2lzc3VlY29tbWVudC0xOTQzOTEyNDdcbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gIGFwcC5zZXRBcHBVc2VyTW9kZWxJZCgnY29tLnNwYXRpYWxuZXR3b3Jrcy5mdWxjcnVtJyk7XG4gIGFwcC5zZXRQYXRoKCdhcHBEYXRhJywgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKTtcbiAgYXBwLnNldFBhdGgoJ3VzZXJEYXRhJywgcGF0aC5qb2luKHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSwgJ0Z1bGNydW0nKSk7XG59XG5cbmltcG9ydCAnLi9hdXRvLXVwZGF0ZXInO1xuXG5pbXBvcnQgbWVudWJhciBmcm9tICdtZW51YmFyJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgZGlyOiBfX2Rpcm5hbWUsXG4gIHdpZHRoOiAyMDAsXG4gIGhlaWdodDogOTAsXG4gIGljb246IHBhdGguam9pbihfX2Rpcm5hbWUsICdhc3NldHMnLCAnaW1hZ2VzJywgJ0ljb25UZW1wbGF0ZS5wbmcnKVxufTtcblxuY29uc3QgYmFyID0gbWVudWJhcihvcHRpb25zKTtcblxuYmFyLm9uKCdyZWFkeScsICgpID0+IHtcbiAgLy8gcmVhZHlcbn0pO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gS2VlcCBhIGdsb2JhbCByZWZlcmVuY2Ugb2YgdGhlIHdpbmRvdyBvYmplY3QsIGlmIHlvdSBkb24ndCwgdGhlIHdpbmRvdyB3aWxsXG4gIC8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxuICBsZXQgYnJvd3NlcldpbmRvdyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICAgIGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7d2lkdGg6IDIxMCwgaGVpZ2h0OiA3NH0pO1xuXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cbiAgICBicm93c2VyV2luZG93LmxvYWRVUkwodXJsLmZvcm1hdCh7XG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIHByb3RvY29sOiAnZmlsZTonLFxuICAgICAgc2xhc2hlczogdHJ1ZVxuICAgIH0pKTtcblxuICAgIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKHttb2RlOiAnZGV0YWNoJ30pO1xuXG4gICAgYnJvd3NlcldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcbiAgICAgIC8vIHdoZW4geW91IHNob3VsZCBkZWxldGUgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudC5cbiAgICAgIGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdyk7XG5cbiAgYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUyBpdCBpcyBjb21tb24gZm9yIGFwcGxpY2F0aW9ucyBhbmQgdGhlaXIgbWVudSBiYXJcbiAgICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgICAgYXBwLnF1aXQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gICAgLy8gT24gbWFjT1MgaXQncyBjb21tb24gdG8gcmUtY3JlYXRlIGEgd2luZG93IGluIHRoZSBhcHAgd2hlbiB0aGVcbiAgICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgICBpZiAoYnJvd3NlcldpbmRvdyA9PT0gbnVsbCkge1xuICAgICAgY3JlYXRlV2luZG93KCk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==