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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tYWluLmpzIl0sIm5hbWVzIjpbInByb2Nlc3MiLCJwbGF0Zm9ybSIsInNldEFwcFVzZXJNb2RlbElkIiwic2V0UGF0aCIsImVudiIsIkxPQ0FMQVBQREFUQSIsImpvaW4iLCJicm93c2VyV2luZG93Iiwic3RhcnQiLCJjcmVhdGVXaW5kb3ciLCJ3aWR0aCIsImhlaWdodCIsImxvYWRVUkwiLCJmb3JtYXQiLCJwYXRobmFtZSIsIl9fZGlybmFtZSIsInByb3RvY29sIiwic2xhc2hlcyIsIm9uIiwicXVpdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBVUE7Ozs7QUFSQTtBQUNBO0FBQ0EsSUFBSUEsUUFBUUMsUUFBUixLQUFxQixPQUF6QixFQUFrQztBQUNoQyxnQkFBSUMsaUJBQUosQ0FBc0IsNkJBQXRCO0FBQ0EsZ0JBQUlDLE9BQUosQ0FBWSxTQUFaLEVBQXVCSCxRQUFRSSxHQUFSLENBQVlDLFlBQW5DO0FBQ0EsZ0JBQUlGLE9BQUosQ0FBWSxVQUFaLEVBQXdCLGVBQUtHLElBQUwsQ0FBVU4sUUFBUUksR0FBUixDQUFZQyxZQUF0QixFQUFvQyxTQUFwQyxDQUF4QjtBQUNEOztBQUlELElBQUlFLGdCQUFnQixJQUFwQjs7QUFFQSxTQUFTQyxLQUFULEdBQWlCO0FBQ2Y7QUFDQTtBQUNBLFdBQVNDLFlBQVQsR0FBd0I7QUFDdEJGLG9CQUFnQiw0QkFBa0IsRUFBQ0csT0FBTyxHQUFSLEVBQWFDLFFBQVEsR0FBckIsRUFBbEIsQ0FBaEI7O0FBRUE7QUFDQUosa0JBQWNLLE9BQWQsQ0FBc0IsY0FBSUMsTUFBSixDQUFXO0FBQy9CQyxnQkFBVSxlQUFLUixJQUFMLENBQVVTLFNBQVYsRUFBcUIsWUFBckIsQ0FEcUI7QUFFL0JDLGdCQUFVLE9BRnFCO0FBRy9CQyxlQUFTO0FBSHNCLEtBQVgsQ0FBdEI7O0FBTUE7O0FBRUFWLGtCQUFjVyxFQUFkLENBQWlCLFFBQWpCLEVBQTJCLE1BQU07QUFDL0I7QUFDQTtBQUNBO0FBQ0FYLHNCQUFnQixJQUFoQjtBQUNELEtBTEQ7QUFNRDs7QUFFRCxnQkFBSVcsRUFBSixDQUFPLE9BQVAsRUFBZ0JULFlBQWhCOztBQUVBLGdCQUFJUyxFQUFKLENBQU8sbUJBQVAsRUFBNEIsTUFBTTtBQUNoQztBQUNBO0FBQ0EsUUFBSWxCLFFBQVFDLFFBQVIsS0FBcUIsUUFBekIsRUFBbUM7QUFDakMsb0JBQUlrQixJQUFKO0FBQ0Q7QUFDRixHQU5EOztBQVFBLGdCQUFJRCxFQUFKLENBQU8sVUFBUCxFQUFtQixNQUFNO0FBQ3ZCO0FBQ0E7QUFDQSxRQUFJWCxrQkFBa0IsSUFBdEIsRUFBNEI7QUFDMUJFO0FBQ0Q7QUFDRixHQU5EO0FBT0Q7O0FBRUREIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcCwgQnJvd3NlcldpbmRvd30gZnJvbSAnZWxlY3Ryb24nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbi8vIERvbid0IHN0b3JlIHRoZSBhcHAgZGF0YSBpbiB0aGUgcm9hbWluZyBkaXIuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzE0MDQjaXNzdWVjb21tZW50LTE5NDM5MTI0N1xuaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgYXBwLnNldEFwcFVzZXJNb2RlbElkKCdjb20uc3BhdGlhbG5ldHdvcmtzLmZ1bGNydW0nKTtcbiAgYXBwLnNldFBhdGgoJ2FwcERhdGEnLCBwcm9jZXNzLmVudi5MT0NBTEFQUERBVEEpO1xuICBhcHAuc2V0UGF0aCgndXNlckRhdGEnLCBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuTE9DQUxBUFBEQVRBLCAnRnVsY3J1bScpKTtcbn1cblxuaW1wb3J0ICcuL2F1dG8tdXBkYXRlcic7XG5cbmxldCBicm93c2VyV2luZG93ID0gbnVsbDtcblxuZnVuY3Rpb24gc3RhcnQoKSB7XG4gIC8vIEtlZXAgYSBnbG9iYWwgcmVmZXJlbmNlIG9mIHRoZSB3aW5kb3cgb2JqZWN0LCBpZiB5b3UgZG9uJ3QsIHRoZSB3aW5kb3cgd2lsbFxuICAvLyBiZSBjbG9zZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSBKYXZhU2NyaXB0IG9iamVjdCBpcyBnYXJiYWdlIGNvbGxlY3RlZC5cbiAgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICAgIGJyb3dzZXJXaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7d2lkdGg6IDIxMCwgaGVpZ2h0OiAxMTR9KTtcblxuICAgIC8vIGFuZCBsb2FkIHRoZSBpbmRleC5odG1sIG9mIHRoZSBhcHAuXG4gICAgYnJvd3NlcldpbmRvdy5sb2FkVVJMKHVybC5mb3JtYXQoe1xuICAgICAgcGF0aG5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICBwcm90b2NvbDogJ2ZpbGU6JyxcbiAgICAgIHNsYXNoZXM6IHRydWVcbiAgICB9KSk7XG5cbiAgICAvLyBicm93c2VyV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scyh7bW9kZTogJ2RldGFjaCd9KTtcblxuICAgIGJyb3dzZXJXaW5kb3cub24oJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgIC8vIERlcmVmZXJlbmNlIHRoZSB3aW5kb3cgb2JqZWN0LCB1c3VhbGx5IHlvdSB3b3VsZCBzdG9yZSB3aW5kb3dzXG4gICAgICAvLyBpbiBhbiBhcnJheSBpZiB5b3VyIGFwcCBzdXBwb3J0cyBtdWx0aSB3aW5kb3dzLCB0aGlzIGlzIHRoZSB0aW1lXG4gICAgICAvLyB3aGVuIHlvdSBzaG91bGQgZGVsZXRlIHRoZSBjb3JyZXNwb25kaW5nIGVsZW1lbnQuXG4gICAgICBicm93c2VyV2luZG93ID0gbnVsbDtcbiAgICB9KTtcbiAgfVxuXG4gIGFwcC5vbigncmVhZHknLCBjcmVhdGVXaW5kb3cpO1xuXG4gIGFwcC5vbignd2luZG93LWFsbC1jbG9zZWQnLCAoKSA9PiB7XG4gICAgLy8gT24gbWFjT1MgaXQgaXMgY29tbW9uIGZvciBhcHBsaWNhdGlvbnMgYW5kIHRoZWlyIG1lbnUgYmFyXG4gICAgLy8gdG8gc3RheSBhY3RpdmUgdW50aWwgdGhlIHVzZXIgcXVpdHMgZXhwbGljaXRseSB3aXRoIENtZCArIFFcbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2RhcndpbicpIHtcbiAgICAgIGFwcC5xdWl0KCk7XG4gICAgfVxuICB9KTtcblxuICBhcHAub24oJ2FjdGl2YXRlJywgKCkgPT4ge1xuICAgIC8vIE9uIG1hY09TIGl0J3MgY29tbW9uIHRvIHJlLWNyZWF0ZSBhIHdpbmRvdyBpbiB0aGUgYXBwIHdoZW4gdGhlXG4gICAgLy8gZG9jayBpY29uIGlzIGNsaWNrZWQgYW5kIHRoZXJlIGFyZSBubyBvdGhlciB3aW5kb3dzIG9wZW4uXG4gICAgaWYgKGJyb3dzZXJXaW5kb3cgPT09IG51bGwpIHtcbiAgICAgIGNyZWF0ZVdpbmRvdygpO1xuICAgIH1cbiAgfSk7XG59XG5cbnN0YXJ0KCk7XG4iXX0=