'use strict';

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

require('./auto-updater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Don't store the app data in the roaming dir.
// https://github.com/electron/electron/issues/1404#issuecomment-194391247
if (process.platform === 'win32') {
  _electron.app.setAppUserModelId('com.spatialnetworks.fulcrum');
  _electron.app.setPath('appData', process.env.LOCALAPPDATA);
  _electron.app.setPath('userData', _path2.default.join(process.env.LOCALAPPDATA, 'Fulcrum'));
}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJicm93c2VyV2luZG93IiwiY3JlYXRlV2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJsb2FkVVJMIiwiZm9ybWF0IiwicGF0aG5hbWUiLCJfX2Rpcm5hbWUiLCJwcm90b2NvbCIsInNsYXNoZXMiLCJvbiIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQVVBOzs7O0FBUkE7QUFDQTtBQUNBLElBQUlBLFFBQVFDLFFBQVIsS0FBcUIsT0FBekIsRUFBa0M7QUFDaEMsZ0JBQUlDLGlCQUFKLENBQXNCLDZCQUF0QjtBQUNBLGdCQUFJQyxPQUFKLENBQVksU0FBWixFQUF1QkgsUUFBUUksR0FBUixDQUFZQyxZQUFuQztBQUNBLGdCQUFJRixPQUFKLENBQVksVUFBWixFQUF3QixlQUFLRyxJQUFMLENBQVVOLFFBQVFJLEdBQVIsQ0FBWUMsWUFBdEIsRUFBb0MsU0FBcEMsQ0FBeEI7QUFDRDs7QUFJRDtBQUNBO0FBQ0EsSUFBSUUsZ0JBQWdCLElBQXBCOztBQUVBLFNBQVNDLFlBQVQsR0FBd0I7QUFDdEJELGtCQUFnQiw0QkFBa0IsRUFBQ0UsT0FBTyxHQUFSLEVBQWFDLFFBQVEsRUFBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUgsZ0JBQWNJLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxjQUFVLGVBQUtQLElBQUwsQ0FBVVEsU0FBVixFQUFxQixZQUFyQixDQURxQjtBQUUvQkMsY0FBVSxPQUZxQjtBQUcvQkMsYUFBUztBQUhzQixHQUFYLENBQXRCOztBQU1BOztBQUVBVCxnQkFBY1UsRUFBZCxDQUFpQixRQUFqQixFQUEyQixNQUFNO0FBQy9CO0FBQ0E7QUFDQTtBQUNBVixvQkFBZ0IsSUFBaEI7QUFDRCxHQUxEO0FBTUQ7O0FBRUQsY0FBSVUsRUFBSixDQUFPLE9BQVAsRUFBZ0JULFlBQWhCOztBQUVBLGNBQUlTLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2hDO0FBQ0E7QUFDQSxNQUFJakIsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxrQkFBSWlCLElBQUo7QUFDRDtBQUNGLENBTkQ7O0FBUUEsY0FBSUQsRUFBSixDQUFPLFVBQVAsRUFBbUIsTUFBTTtBQUN2QjtBQUNBO0FBQ0EsTUFBSVYsa0JBQWtCLElBQXRCLEVBQTRCO0FBQzFCQztBQUNEO0FBQ0YsQ0FORCIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthcHAsIEJyb3dzZXJXaW5kb3d9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG4vLyBEb24ndCBzdG9yZSB0aGUgYXBwIGRhdGEgaW4gdGhlIHJvYW1pbmcgZGlyLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNDA0I2lzc3VlY29tbWVudC0xOTQzOTEyNDdcbmlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gIGFwcC5zZXRBcHBVc2VyTW9kZWxJZCgnY29tLnNwYXRpYWxuZXR3b3Jrcy5mdWxjcnVtJyk7XG4gIGFwcC5zZXRQYXRoKCdhcHBEYXRhJywgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKTtcbiAgYXBwLnNldFBhdGgoJ3VzZXJEYXRhJywgcGF0aC5qb2luKHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSwgJ0Z1bGNydW0nKSk7XG59XG5cbmltcG9ydCAnLi9hdXRvLXVwZGF0ZXInO1xuXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcbi8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxubGV0IGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG4gIGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7d2lkdGg6IDIxMCwgaGVpZ2h0OiA3NH0pO1xuXG4gIC8vIGFuZCBsb2FkIHRoZSBpbmRleC5odG1sIG9mIHRoZSBhcHAuXG4gIGJyb3dzZXJXaW5kb3cubG9hZFVSTCh1cmwuZm9ybWF0KHtcbiAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICBwcm90b2NvbDogJ2ZpbGU6JyxcbiAgICBzbGFzaGVzOiB0cnVlXG4gIH0pKTtcblxuICAvLyBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuXG4gIGJyb3dzZXJXaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xuICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcbiAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXG4gICAgYnJvd3NlcldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KTtcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgLy8gT24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXG4gIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgaWYgKGJyb3dzZXJXaW5kb3cgPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG4iXX0=