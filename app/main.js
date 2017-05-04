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
  height: 52,
  icon: _path2.default.join(__dirname, 'static', 'images', 'IconTemplate.png')
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

    // browserWindow.webContents.openDevTools();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJvcHRpb25zIiwiZGlyIiwiX19kaXJuYW1lIiwid2lkdGgiLCJoZWlnaHQiLCJpY29uIiwiYmFyIiwib24iLCJzdGFydCIsImJyb3dzZXJXaW5kb3ciLCJjcmVhdGVXaW5kb3ciLCJsb2FkVVJMIiwiZm9ybWF0IiwicGF0aG5hbWUiLCJwcm90b2NvbCIsInNsYXNoZXMiLCJxdWl0Il0sIm1hcHBpbmdzIjoiOztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFVQTs7QUFFQTs7Ozs7O0FBVkE7QUFDQTtBQUNBLElBQUlBLFFBQVFDLFFBQVIsS0FBcUIsT0FBekIsRUFBa0M7QUFDaEMsZ0JBQUlDLGlCQUFKLENBQXNCLDZCQUF0QjtBQUNBLGdCQUFJQyxPQUFKLENBQVksU0FBWixFQUF1QkgsUUFBUUksR0FBUixDQUFZQyxZQUFuQztBQUNBLGdCQUFJRixPQUFKLENBQVksVUFBWixFQUF3QixlQUFLRyxJQUFMLENBQVVOLFFBQVFJLEdBQVIsQ0FBWUMsWUFBdEIsRUFBb0MsU0FBcEMsQ0FBeEI7QUFDRDs7QUFNRCxNQUFNRSxVQUFVO0FBQ2RDLE9BQUtDLFNBRFM7QUFFZEMsU0FBTyxHQUZPO0FBR2RDLFVBQVEsRUFITTtBQUlkQyxRQUFNLGVBQUtOLElBQUwsQ0FBVUcsU0FBVixFQUFxQixRQUFyQixFQUErQixRQUEvQixFQUF5QyxrQkFBekM7QUFKUSxDQUFoQjs7QUFPQSxNQUFNSSxNQUFNLHVCQUFRTixPQUFSLENBQVo7O0FBRUFNLElBQUlDLEVBQUosQ0FBTyxPQUFQLEVBQWdCLE1BQU07QUFDcEI7QUFDRCxDQUZEOztBQUlBLFNBQVNDLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0EsTUFBSUMsZ0JBQWdCLElBQXBCOztBQUVBLFdBQVNDLFlBQVQsR0FBd0I7QUFDdEJELG9CQUFnQiw0QkFBa0IsRUFBQ04sT0FBTyxHQUFSLEVBQWFDLFFBQVEsRUFBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUssa0JBQWNFLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxnQkFBVSxlQUFLZCxJQUFMLENBQVVHLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JZLGdCQUFVLE9BRnFCO0FBRy9CQyxlQUFTO0FBSHNCLEtBQVgsQ0FBdEI7O0FBTUE7O0FBRUFOLGtCQUFjRixFQUFkLENBQWlCLFFBQWpCLEVBQTJCLE1BQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0FFLHNCQUFnQixJQUFoQjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxnQkFBSUYsRUFBSixDQUFPLE9BQVAsRUFBZ0JHLFlBQWhCOztBQUVBLGdCQUFJSCxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0EsUUFBSWQsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxvQkFBSXNCLElBQUo7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsZ0JBQUlULEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDdkI7QUFDQTtBQUNBLFFBQUlFLGtCQUFrQixJQUF0QixFQUE0QjtBQUMxQkM7QUFDRDtBQUNGLEdBTkQ7QUFPRCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG4vLyBEb24ndCBzdG9yZSB0aGUgYXBwIGRhdGEgaW4gdGhlIHJvYW1pbmcgZGlyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNDA0I2lzc3VlY29tbWVudC0xOTQzOTEyNDdcbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gIGFwcC5zZXRBcHBVc2VyTW9kZWxJZCgnY29tLnNwYXRpYWxuZXR3b3Jrcy5mdWxjcnVtJyk7XG4gIGFwcC5zZXRQYXRoKCdhcHBEYXRhJywgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKTtcbiAgYXBwLnNldFBhdGgoJ3VzZXJEYXRhJywgcGF0aC5qb2luKHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSwgJ0Z1bGNydW0nKSk7XG59XG5cbmltcG9ydCAnLi9hdXRvLXVwZGF0ZXInO1xuXG5pbXBvcnQgbWVudWJhciBmcm9tICdtZW51YmFyJztcblxuY29uc3Qgb3B0aW9ucyA9IHtcbiAgZGlyOiBfX2Rpcm5hbWUsXG4gIHdpZHRoOiAyMDAsXG4gIGhlaWdodDogNTIsXG4gIGljb246IHBhdGguam9pbihfX2Rpcm5hbWUsICdzdGF0aWMnLCAnaW1hZ2VzJywgJ0ljb25UZW1wbGF0ZS5wbmcnKVxufTtcblxuY29uc3QgYmFyID0gbWVudWJhcihvcHRpb25zKTtcblxuYmFyLm9uKCdyZWFkeScsICgpID0+IHtcbiAgLy8gcmVhZHlcbn0pO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gS2VlcCBhIGdsb2JhbCByZWZlcmVuY2Ugb2YgdGhlIHdpbmRvdyBvYmplY3QsIGlmIHlvdSBkb24ndCwgdGhlIHdpbmRvdyB3aWxsXG4gIC8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxuICBsZXQgYnJvd3NlcldpbmRvdyA9IG51bGw7XG5cbiAgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICAgIGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7d2lkdGg6IDIxMCwgaGVpZ2h0OiA3NH0pO1xuXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cbiAgICBicm93c2VyV2luZG93LmxvYWRVUkwodXJsLmZvcm1hdCh7XG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIHByb3RvY29sOiAnZmlsZTonLFxuICAgICAgc2xhc2hlczogdHJ1ZVxuICAgIH0pKTtcblxuICAgIC8vIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG5cbiAgICBicm93c2VyV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xuICAgICAgLy8gaW4gYW4gYXJyYXkgaWYgeW91ciBhcHAgc3VwcG9ydHMgbXVsdGkgd2luZG93cywgdGhpcyBpcyB0aGUgdGltZVxuICAgICAgLy8gd2hlbiB5b3Ugc2hvdWxkIGRlbGV0ZSB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50LlxuICAgICAgYnJvd3NlcldpbmRvdyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBhcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KTtcblxuICBhcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xuICAgIC8vIE9uIG1hY09TIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAgIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XG4gICAgICBhcHAucXVpdCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAgIC8vIGRvY2sgaWNvbiBpcyBjbGlja2VkIGFuZCB0aGVyZSBhcmUgbm8gb3RoZXIgd2luZG93cyBvcGVuLlxuICAgIGlmIChicm93c2VyV2luZG93ID09PSBudWxsKSB7XG4gICAgICBjcmVhdGVXaW5kb3coKTtcbiAgICB9XG4gIH0pO1xufVxuIl19