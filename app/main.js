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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJicm93c2VyV2luZG93Iiwic3RhcnQiLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxvYWRVUkwiLCJmb3JtYXQiLCJwYXRobmFtZSIsIl9fZGlybmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsIm9uIiwicXVpdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBVUE7Ozs7QUFSQTtBQUNBO0FBQ0EsSUFBSUEsUUFBUUMsUUFBUixLQUFxQixPQUF6QixFQUFrQztBQUNoQyxnQkFBSUMsaUJBQUosQ0FBc0IsNkJBQXRCO0FBQ0EsZ0JBQUlDLE9BQUosQ0FBWSxTQUFaLEVBQXVCSCxRQUFRSSxHQUFSLENBQVlDLFlBQW5DO0FBQ0EsZ0JBQUlGLE9BQUosQ0FBWSxVQUFaLEVBQXdCLGVBQUtHLElBQUwsQ0FBVU4sUUFBUUksR0FBUixDQUFZQyxZQUF0QixFQUFvQyxTQUFwQyxDQUF4QjtBQUNEOztBQUlELElBQUlFLGdCQUFnQixJQUFwQjs7QUFFQSxTQUFTQyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBLFdBQVNDLFlBQVQsR0FBd0I7QUFDdEJGLG9CQUFnQiw0QkFBa0IsRUFBQ0csT0FBTyxHQUFSLEVBQWFDLFFBQVEsR0FBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUosa0JBQWNLLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxnQkFBVSxlQUFLUixJQUFMLENBQVVTLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JDLGdCQUFVLE9BRnFCO0FBRy9CQyxlQUFTO0FBSHNCLEtBQVgsQ0FBdEI7O0FBTUE7O0FBRUFWLGtCQUFjVyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLE1BQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0FYLHNCQUFnQixJQUFoQjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxnQkFBSVcsRUFBSixDQUFPLE9BQVAsRUFBZ0JULFlBQWhCOztBQUVBLGdCQUFJUyxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0EsUUFBSWxCLFFBQVFDLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDakMsb0JBQUlrQixJQUFKO0FBQ0Q7QUFDRixHQU5EOztBQVFBLGdCQUFJRCxFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxRQUFJWCxrQkFBa0IsSUFBdEIsRUFBNEI7QUFDMUJFO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7O0FBRUREIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcCwgQnJvd3NlcldpbmRvd30gZnJvbSAnZWxlY3Ryb24nO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5cclxuLy8gRG9uJ3Qgc3RvcmUgdGhlIGFwcCBkYXRhIGluIHRoZSByb2FtaW5nIGRpci5cclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy8xNDA0I2lzc3VlY29tbWVudC0xOTQzOTEyNDdcclxuaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcclxuICBhcHAuc2V0QXBwVXNlck1vZGVsSWQoJ2NvbS5zcGF0aWFsbmV0d29ya3MuZnVsY3J1bScpO1xyXG4gIGFwcC5zZXRQYXRoKCdhcHBEYXRhJywgcHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBKTtcclxuICBhcHAuc2V0UGF0aCgndXNlckRhdGEnLCBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBLCAnRnVsY3J1bScpKTtcclxufVxyXG5cclxuaW1wb3J0ICcuL2F1dG8tdXBkYXRlcic7XHJcblxyXG5sZXQgYnJvd3NlcldpbmRvdyA9IG51bGw7XHJcblxyXG5mdW5jdGlvbiBzdGFydCgpIHtcclxuICAvLyBLZWVwIGEgZ2xvYmFsIHJlZmVyZW5jZSBvZiB0aGUgd2luZG93IG9iamVjdCwgaWYgeW91IGRvbid0LCB0aGUgd2luZG93IHdpbGxcclxuICAvLyBiZSBjbG9zZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSBKYXZhU2NyaXB0IG9iamVjdCBpcyBnYXJiYWdlIGNvbGxlY3RlZC5cclxuICBmdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XHJcbiAgICBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe3dpZHRoOiAyMTAsIGhlaWdodDogMTE0fSk7XHJcblxyXG4gICAgLy8gYW5kIGxvYWQgdGhlIGluZGV4Lmh0bWwgb2YgdGhlIGFwcC5cclxuICAgIGJyb3dzZXJXaW5kb3cubG9hZFVSTCh1cmwuZm9ybWF0KHtcclxuICAgICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXHJcbiAgICAgIHByb3RvY29sOiAnZmlsZTonLFxyXG4gICAgICBzbGFzaGVzOiB0cnVlXHJcbiAgICB9KSk7XHJcblxyXG4gICAgLy8gYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoe21vZGU6ICdkZXRhY2gnfSk7XHJcblxyXG4gICAgYnJvd3NlcldpbmRvdy5vbignY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgICAvLyBEZXJlZmVyZW5jZSB0aGUgd2luZG93IG9iamVjdCwgdXN1YWxseSB5b3Ugd291bGQgc3RvcmUgd2luZG93c1xyXG4gICAgICAvLyBpbiBhbiBhcnJheSBpZiB5b3VyIGFwcCBzdXBwb3J0cyBtdWx0aSB3aW5kb3dzLCB0aGlzIGlzIHRoZSB0aW1lXHJcbiAgICAgIC8vIHdoZW4geW91IHNob3VsZCBkZWxldGUgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudC5cclxuICAgICAgYnJvd3NlcldpbmRvdyA9IG51bGw7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpO1xyXG5cclxuICBhcHAub24oJ3dpbmRvdy1hbGwtY2xvc2VkJywgKCkgPT4ge1xyXG4gICAgLy8gT24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXHJcbiAgICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxyXG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICdkYXJ3aW4nKSB7XHJcbiAgICAgIGFwcC5xdWl0KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGFwcC5vbignYWN0aXZhdGUnLCAoKSA9PiB7XHJcbiAgICAvLyBPbiBtYWNPUyBpdCdzIGNvbW1vbiB0byByZS1jcmVhdGUgYSB3aW5kb3cgaW4gdGhlIGFwcCB3aGVuIHRoZVxyXG4gICAgLy8gZG9jayBpY29uIGlzIGNsaWNrZWQgYW5kIHRoZXJlIGFyZSBubyBvdGhlciB3aW5kb3dzIG9wZW4uXHJcbiAgICBpZiAoYnJvd3NlcldpbmRvdyA9PT0gbnVsbCkge1xyXG4gICAgICBjcmVhdGVXaW5kb3coKTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuc3RhcnQoKTtcclxuIl19