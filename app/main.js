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

// import menubar from 'menubar';

// const options = {
//   dir: __dirname,
//   width: 200,
//   height: 90,
//   icon: path.join(__dirname, 'assets', 'images', 'IconTemplate.png')
// };

// const bar = menubar(options);

// bar.on('ready', () => {
//   // ready
// });

let browserWindow = null;

function start() {
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  function createWindow() {
    browserWindow = new _electron.BrowserWindow({ width: 210, height: 114 });

    // and load the index.html of the app.
    browserWindow.loadURL(_url2.default.format({
      pathname: _path2.default.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));

    // browserWindow.webContents.openDevTools({mode: 'detach'});

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

start();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJicm93c2VyV2luZG93Iiwic3RhcnQiLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxvYWRVUkwiLCJmb3JtYXQiLCJwYXRobmFtZSIsIl9fZGlybmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsIm9uIiwicXVpdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBVUE7Ozs7QUFSQTtBQUNBO0FBQ0EsSUFBSUEsUUFBUUMsUUFBUixLQUFxQixPQUF6QixFQUFrQztBQUNoQyxnQkFBSUMsaUJBQUosQ0FBc0IsNkJBQXRCO0FBQ0EsZ0JBQUlDLE9BQUosQ0FBWSxTQUFaLEVBQXVCSCxRQUFRSSxHQUFSLENBQVlDLFlBQW5DO0FBQ0EsZ0JBQUlGLE9BQUosQ0FBWSxVQUFaLEVBQXdCLGVBQUtHLElBQUwsQ0FBVU4sUUFBUUksR0FBUixDQUFZQyxZQUF0QixFQUFvQyxTQUFwQyxDQUF4QjtBQUNEOztBQUlEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsSUFBSUUsZ0JBQWdCLElBQXBCOztBQUVBLFNBQVNDLEtBQVQsR0FBaUI7QUFDZjtBQUNBO0FBQ0EsV0FBU0MsWUFBVCxHQUF3QjtBQUN0QkYsb0JBQWdCLDRCQUFrQixFQUFDRyxPQUFPLEdBQVIsRUFBYUMsUUFBUSxHQUFyQixFQUFsQixDQUFoQjs7QUFFQTtBQUNBSixrQkFBY0ssT0FBZCxDQUFzQixjQUFJQyxNQUFKLENBQVc7QUFDL0JDLGdCQUFVLGVBQUtSLElBQUwsQ0FBVVMsU0FBVixFQUFxQixZQUFyQixDQURxQjtBQUUvQkMsZ0JBQVUsT0FGcUI7QUFHL0JDLGVBQVM7QUFIc0IsS0FBWCxDQUF0Qjs7QUFNQTs7QUFFQVYsa0JBQWNXLEVBQWQsQ0FBaUIsUUFBakIsRUFBMkIsTUFBTTtBQUMvQjtBQUNBO0FBQ0E7QUFDQVgsc0JBQWdCLElBQWhCO0FBQ0QsS0FMRDtBQU1EOztBQUVELGdCQUFJVyxFQUFKLENBQU8sT0FBUCxFQUFnQlQsWUFBaEI7O0FBRUEsZ0JBQUlTLEVBQUosQ0FBTyxtQkFBUCxFQUE0QixNQUFNO0FBQ2hDO0FBQ0E7QUFDQSxRQUFJbEIsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxvQkFBSWtCLElBQUo7QUFDRDtBQUNGLEdBTkQ7O0FBUUEsZ0JBQUlELEVBQUosQ0FBTyxVQUFQLEVBQW1CLE1BQU07QUFDdkI7QUFDQTtBQUNBLFFBQUlYLGtCQUFrQixJQUF0QixFQUE0QjtBQUMxQkU7QUFDRDtBQUNGLEdBTkQ7QUFPRDs7QUFFREQiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwLCBCcm93c2VyV2luZG93fSBmcm9tICdlbGVjdHJvbic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuLy8gRG9uJ3Qgc3RvcmUgdGhlIGFwcCBkYXRhIGluIHRoZSByb2FtaW5nIGRpci5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMTQwNCNpc3N1ZWNvbW1lbnQtMTk0MzkxMjQ3XG5pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICBhcHAuc2V0QXBwVXNlck1vZGVsSWQoJ2NvbS5zcGF0aWFsbmV0d29ya3MuZnVsY3J1bScpO1xuICBhcHAuc2V0UGF0aCgnYXBwRGF0YScsIHByb2Nlc3MuZW52LkxPQ0FMQVBQREFUQSk7XG4gIGFwcC5zZXRQYXRoKCd1c2VyRGF0YScsIHBhdGguam9pbihwcm9jZXNzLmVudi5MT0NBTEFQUERBVEEsICdGdWxjcnVtJykpO1xufVxuXG5pbXBvcnQgJy4vYXV0by11cGRhdGVyJztcblxuLy8gaW1wb3J0IG1lbnViYXIgZnJvbSAnbWVudWJhcic7XG5cbi8vIGNvbnN0IG9wdGlvbnMgPSB7XG4vLyAgIGRpcjogX19kaXJuYW1lLFxuLy8gICB3aWR0aDogMjAwLFxuLy8gICBoZWlnaHQ6IDkwLFxuLy8gICBpY29uOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXNzZXRzJywgJ2ltYWdlcycsICdJY29uVGVtcGxhdGUucG5nJylcbi8vIH07XG5cbi8vIGNvbnN0IGJhciA9IG1lbnViYXIob3B0aW9ucyk7XG5cbi8vIGJhci5vbigncmVhZHknLCAoKSA9PiB7XG4vLyAgIC8vIHJlYWR5XG4vLyB9KTtcblxubGV0IGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgLy8gS2VlcCBhIGdsb2JhbCByZWZlcmVuY2Ugb2YgdGhlIHdpbmRvdyBvYmplY3QsIGlmIHlvdSBkb24ndCwgdGhlIHdpbmRvdyB3aWxsXG4gIC8vIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIEphdmFTY3JpcHQgb2JqZWN0IGlzIGdhcmJhZ2UgY29sbGVjdGVkLlxuICBmdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XG4gICAgYnJvd3NlcldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHt3aWR0aDogMjEwLCBoZWlnaHQ6IDExNH0pO1xuXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cbiAgICBicm93c2VyV2luZG93LmxvYWRVUkwodXJsLmZvcm1hdCh7XG4gICAgICBwYXRobmFtZTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2luZGV4Lmh0bWwnKSxcbiAgICAgIHByb3RvY29sOiAnZmlsZTonLFxuICAgICAgc2xhc2hlczogdHJ1ZVxuICAgIH0pKTtcblxuICAgIC8vIGJyb3dzZXJXaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKHttb2RlOiAnZGV0YWNoJ30pO1xuXG4gICAgYnJvd3NlcldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xuICAgICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAgIC8vIGluIGFuIGFycmF5IGlmIHlvdXIgYXBwIHN1cHBvcnRzIG11bHRpIHdpbmRvd3MsIHRoaXMgaXMgdGhlIHRpbWVcbiAgICAgIC8vIHdoZW4geW91IHNob3VsZCBkZWxldGUgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudC5cbiAgICAgIGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuICAgIH0pO1xuICB9XG5cbiAgYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdyk7XG5cbiAgYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgICAvLyBPbiBtYWNPUyBpdCBpcyBjb21tb24gZm9yIGFwcGxpY2F0aW9ucyBhbmQgdGhlaXIgbWVudSBiYXJcbiAgICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnZGFyd2luJykge1xuICAgICAgYXBwLnF1aXQoKTtcbiAgICB9XG4gIH0pO1xuXG4gIGFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XG4gICAgLy8gT24gbWFjT1MgaXQncyBjb21tb24gdG8gcmUtY3JlYXRlIGEgd2luZG93IGluIHRoZSBhcHAgd2hlbiB0aGVcbiAgICAvLyBkb2NrIGljb24gaXMgY2xpY2tlZCBhbmQgdGhlcmUgYXJlIG5vIG90aGVyIHdpbmRvd3Mgb3Blbi5cbiAgICBpZiAoYnJvd3NlcldpbmRvdyA9PT0gbnVsbCkge1xuICAgICAgY3JlYXRlV2luZG93KCk7XG4gICAgfVxuICB9KTtcbn1cblxuc3RhcnQoKTtcbiJdfQ==