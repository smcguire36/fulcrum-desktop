'use strict';

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

require('./auto-updater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO(zhm) add this for notifications to work properly - https://github.com/electron-userland/electron-builder/wiki/NSIS
// app.setAppUserModelId(appId)

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbImJyb3dzZXJXaW5kb3ciLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxvYWRVUkwiLCJmb3JtYXQiLCJwYXRobmFtZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJwcm90b2NvbCIsInNsYXNoZXMiLCJvbiIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSUEsZ0JBQWdCLElBQXBCOztBQUVBLFNBQVNDLFlBQVQsR0FBd0I7QUFDdEJELGtCQUFnQiw0QkFBa0IsRUFBQ0UsT0FBTyxHQUFSLEVBQWFDLFFBQVEsRUFBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUgsZ0JBQWNJLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxjQUFVLGVBQUtDLElBQUwsQ0FBVUMsU0FBVixFQUFxQixZQUFyQixDQURxQjtBQUUvQkMsY0FBVSxPQUZxQjtBQUcvQkMsYUFBUztBQUhzQixHQUFYLENBQXRCOztBQU1BOztBQUVBVixnQkFBY1csRUFBZCxDQUFpQixRQUFqQixFQUEyQixNQUFNO0FBQy9CO0FBQ0E7QUFDQTtBQUNBWCxvQkFBZ0IsSUFBaEI7QUFDRCxHQUxEO0FBTUQ7O0FBRUQsY0FBSVcsRUFBSixDQUFPLE9BQVAsRUFBZ0JWLFlBQWhCOztBQUVBLGNBQUlVLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2hDO0FBQ0E7QUFDQSxNQUFJQyxRQUFRQyxRQUFSLEtBQXFCLFFBQXpCLEVBQW1DO0FBQ2pDLGtCQUFJQyxJQUFKO0FBQ0Q7QUFDRixDQU5EOztBQVFBLGNBQUlILEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDdkI7QUFDQTtBQUNBLE1BQUlYLGtCQUFrQixJQUF0QixFQUE0QjtBQUMxQkM7QUFDRDtBQUNGLENBTkQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwLCBCcm93c2VyV2luZG93fSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCAnLi9hdXRvLXVwZGF0ZXInO1xuXG4vLyBUT0RPKHpobSkgYWRkIHRoaXMgZm9yIG5vdGlmaWNhdGlvbnMgdG8gd29yayBwcm9wZXJseSAtIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi11c2VybGFuZC9lbGVjdHJvbi1idWlsZGVyL3dpa2kvTlNJU1xuLy8gYXBwLnNldEFwcFVzZXJNb2RlbElkKGFwcElkKVxuXG4vLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcbi8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxubGV0IGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG4gIGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7d2lkdGg6IDIxMCwgaGVpZ2h0OiA3NH0pO1xuXG4gIC8vIGFuZCBsb2FkIHRoZSBpbmRleC5odG1sIG9mIHRoZSBhcHAuXG4gIGJyb3dzZXJXaW5kb3cubG9hZFVSTCh1cmwuZm9ybWF0KHtcbiAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICBwcm90b2NvbDogJ2ZpbGU6JyxcbiAgICBzbGFzaGVzOiB0cnVlXG4gIH0pKTtcblxuICAvLyBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuXG4gIGJyb3dzZXJXaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xuICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcbiAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXG4gICAgYnJvd3NlcldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAub24oJ3JlYWR5JywgY3JlYXRlV2luZG93KTtcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgLy8gT24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXG4gIC8vIHRvIHN0YXkgYWN0aXZlIHVudGlsIHRoZSB1c2VyIHF1aXRzIGV4cGxpY2l0bHkgd2l0aCBDbWQgKyBRXG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxuICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgaWYgKGJyb3dzZXJXaW5kb3cgPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG4iXX0=