'use strict';

var _electron = require('electron');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

require('./auto-updater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbImJyb3dzZXJXaW5kb3ciLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxvYWRVUkwiLCJmb3JtYXQiLCJwYXRobmFtZSIsImpvaW4iLCJfX2Rpcm5hbWUiLCJwcm90b2NvbCIsInNsYXNoZXMiLCJvbiIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsInF1aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7QUFDQTtBQUNBLElBQUlBLGdCQUFnQixJQUFwQjs7QUFFQSxTQUFTQyxZQUFULEdBQXdCO0FBQ3RCRCxrQkFBZ0IsNEJBQWtCLEVBQUNFLE9BQU8sR0FBUixFQUFhQyxRQUFRLEVBQXJCLEVBQWxCLENBQWhCOztBQUVBO0FBQ0FILGdCQUFjSSxPQUFkLENBQXNCLGNBQUlDLE1BQUosQ0FBVztBQUMvQkMsY0FBVSxlQUFLQyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JDLGNBQVUsT0FGcUI7QUFHL0JDLGFBQVM7QUFIc0IsR0FBWCxDQUF0Qjs7QUFNQTs7QUFFQVYsZ0JBQWNXLEVBQWQsQ0FBaUIsUUFBakIsRUFBMkIsTUFBTTtBQUMvQjtBQUNBO0FBQ0E7QUFDQVgsb0JBQWdCLElBQWhCO0FBQ0QsR0FMRDtBQU1EOztBQUVELGNBQUlXLEVBQUosQ0FBTyxPQUFQLEVBQWdCVixZQUFoQjs7QUFFQSxjQUFJVSxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0EsTUFBSUMsUUFBUUMsUUFBUixLQUFxQixRQUF6QixFQUFtQztBQUNqQyxrQkFBSUMsSUFBSjtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxjQUFJSCxFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxNQUFJWCxrQkFBa0IsSUFBdEIsRUFBNEI7QUFDMUJDO0FBQ0Q7QUFDRixDQU5EIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcCwgQnJvd3NlcldpbmRvd30gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgJy4vYXV0by11cGRhdGVyJztcblxuLy8gS2VlcCBhIGdsb2JhbCByZWZlcmVuY2Ugb2YgdGhlIHdpbmRvdyBvYmplY3QsIGlmIHlvdSBkb24ndCwgdGhlIHdpbmRvdyB3aWxsXG4vLyBiZSBjbG9zZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSBKYXZhU2NyaXB0IG9iamVjdCBpcyBnYXJiYWdlIGNvbGxlY3RlZC5cbmxldCBicm93c2VyV2luZG93ID0gbnVsbDtcblxuZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICBicm93c2VyV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe3dpZHRoOiAyMTAsIGhlaWdodDogNzR9KTtcblxuICAvLyBhbmQgbG9hZCB0aGUgaW5kZXguaHRtbCBvZiB0aGUgYXBwLlxuICBicm93c2VyV2luZG93LmxvYWRVUkwodXJsLmZvcm1hdCh7XG4gICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgcHJvdG9jb2w6ICdmaWxlOicsXG4gICAgc2xhc2hlczogdHJ1ZVxuICB9KSk7XG5cbiAgLy8gYnJvd3NlcldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcblxuICBicm93c2VyV2luZG93Lm9uKCdjbG9zZWQnLCAoKSA9PiB7XG4gICAgLy8gRGVyZWZlcmVuY2UgdGhlIHdpbmRvdyBvYmplY3QsIHVzdWFsbHkgeW91IHdvdWxkIHN0b3JlIHdpbmRvd3NcbiAgICAvLyBpbiBhbiBhcnJheSBpZiB5b3VyIGFwcCBzdXBwb3J0cyBtdWx0aSB3aW5kb3dzLCB0aGlzIGlzIHRoZSB0aW1lXG4gICAgLy8gd2hlbiB5b3Ugc2hvdWxkIGRlbGV0ZSB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50LlxuICAgIGJyb3dzZXJXaW5kb3cgPSBudWxsO1xuICB9KTtcbn1cblxuYXBwLm9uKCdyZWFkeScsIGNyZWF0ZVdpbmRvdyk7XG5cbmFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gIC8vIE9uIG1hY09TIGl0IGlzIGNvbW1vbiBmb3IgYXBwbGljYXRpb25zIGFuZCB0aGVpciBtZW51IGJhclxuICAvLyB0byBzdGF5IGFjdGl2ZSB1bnRpbCB0aGUgdXNlciBxdWl0cyBleHBsaWNpdGx5IHdpdGggQ21kICsgUVxuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKCdhY3RpdmF0ZScsICgpID0+IHtcbiAgLy8gT24gbWFjT1MgaXQncyBjb21tb24gdG8gcmUtY3JlYXRlIGEgd2luZG93IGluIHRoZSBhcHAgd2hlbiB0aGVcbiAgLy8gZG9jayBpY29uIGlzIGNsaWNrZWQgYW5kIHRoZXJlIGFyZSBubyBvdGhlciB3aW5kb3dzIG9wZW4uXG4gIGlmIChicm93c2VyV2luZG93ID09PSBudWxsKSB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuIl19