'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _synchronizer = require('../sync/synchronizer');

var _synchronizer2 = _interopRequireDefault(_synchronizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      yield _this.app.activatePlugins();

      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      if (account == null) {
        console.error('Unable to find organization:', fulcrum.args.org);
        return;
      }

      if (fulcrum.args.clean) {
        yield account.reset();
      }

      yield _this.syncLoop(account, fulcrum.args.full);
    });
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'sync',
        desc: 'sync an organization',
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          },
          forever: {
            default: false,
            type: 'boolean',
            describe: 'keep the sync running forever'
          },
          clean: {
            default: false,
            type: 'boolean',
            describe: 'start a clean sync, all data will be deleted before starting'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

  syncLoop(account, fullSync) {
    return _asyncToGenerator(function* () {
      const sync = true;

      const dataSource = yield fulcrum.createDataSource(account);

      while (sync) {
        const synchronizer = new _synchronizer2.default();

        try {
          yield synchronizer.run(account, fulcrum.args.form, dataSource, { fullSync });
        } catch (ex) {
          console.error(ex);
        }

        fullSync = false;

        if (!fulcrum.args.forever) {
          break;
        }

        const interval = fulcrum.args.interval ? +fulcrum.args.interval * 1000 : 15000;

        yield new Promise(function (resolve) {
          return setTimeout(resolve, interval);
        });
      }
    })();
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3N5bmMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsImNvbnNvbGUiLCJlcnJvciIsImNsZWFuIiwicmVzZXQiLCJzeW5jTG9vcCIsImZ1bGwiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwicmVxdWlyZWQiLCJ0eXBlIiwiZm9yZXZlciIsImRlZmF1bHQiLCJkZXNjcmliZSIsImhhbmRsZXIiLCJmdWxsU3luYyIsInN5bmMiLCJkYXRhU291cmNlIiwiY3JlYXRlRGF0YVNvdXJjZSIsInN5bmNocm9uaXplciIsInJ1biIsImZvcm0iLCJleCIsImludGVydmFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUE7O0FBQUEsU0EwQm5CQSxVQTFCbUIscUJBMEJOLGFBQVk7QUFDdkIsWUFBTSxNQUFLQyxHQUFMLENBQVNDLGVBQVQsRUFBTjs7QUFFQSxZQUFNQyxVQUFVLE1BQU1DLFFBQVFDLFlBQVIsQ0FBcUJELFFBQVFFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsVUFBSUosV0FBVyxJQUFmLEVBQXFCO0FBQ25CSyxnQkFBUUMsS0FBUixDQUFjLDhCQUFkLEVBQThDTCxRQUFRRSxJQUFSLENBQWFDLEdBQTNEO0FBQ0E7QUFDRDs7QUFFRCxVQUFJSCxRQUFRRSxJQUFSLENBQWFJLEtBQWpCLEVBQXdCO0FBQ3RCLGNBQU1QLFFBQVFRLEtBQVIsRUFBTjtBQUNEOztBQUVELFlBQU0sTUFBS0MsUUFBTCxDQUFjVCxPQUFkLEVBQXVCQyxRQUFRRSxJQUFSLENBQWFPLElBQXBDLENBQU47QUFDRCxLQXpDa0I7QUFBQTs7QUFDYkMsTUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxhQUFPQSxJQUFJQyxPQUFKLENBQVk7QUFDakJBLGlCQUFTLE1BRFE7QUFFakJDLGNBQU0sc0JBRlc7QUFHakJDLGlCQUFTO0FBQ1BYLGVBQUs7QUFDSFUsa0JBQU0sbUJBREg7QUFFSEUsc0JBQVUsSUFGUDtBQUdIQyxrQkFBTTtBQUhILFdBREU7QUFNUEMsbUJBQVM7QUFDUEMscUJBQVMsS0FERjtBQUVQRixrQkFBTSxTQUZDO0FBR1BHLHNCQUFVO0FBSEgsV0FORjtBQVdQYixpQkFBTztBQUNMWSxxQkFBUyxLQURKO0FBRUxGLGtCQUFNLFNBRkQ7QUFHTEcsc0JBQVU7QUFITDtBQVhBLFNBSFE7QUFvQmpCQyxpQkFBUyxPQUFLeEI7QUFwQkcsT0FBWixDQUFQO0FBRGM7QUF1QmY7O0FBbUJLWSxVQUFOLENBQWVULE9BQWYsRUFBd0JzQixRQUF4QixFQUFrQztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sSUFBYjs7QUFFQSxZQUFNQyxhQUFhLE1BQU12QixRQUFRd0IsZ0JBQVIsQ0FBeUJ6QixPQUF6QixDQUF6Qjs7QUFFQSxhQUFPdUIsSUFBUCxFQUFhO0FBQ1gsY0FBTUcsZUFBZSw0QkFBckI7O0FBRUEsWUFBSTtBQUNGLGdCQUFNQSxhQUFhQyxHQUFiLENBQWlCM0IsT0FBakIsRUFBMEJDLFFBQVFFLElBQVIsQ0FBYXlCLElBQXZDLEVBQTZDSixVQUE3QyxFQUF5RCxFQUFDRixRQUFELEVBQXpELENBQU47QUFDRCxTQUZELENBRUUsT0FBT08sRUFBUCxFQUFXO0FBQ1h4QixrQkFBUUMsS0FBUixDQUFjdUIsRUFBZDtBQUNEOztBQUVEUCxtQkFBVyxLQUFYOztBQUVBLFlBQUksQ0FBQ3JCLFFBQVFFLElBQVIsQ0FBYWUsT0FBbEIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxjQUFNWSxXQUFXN0IsUUFBUUUsSUFBUixDQUFhMkIsUUFBYixHQUF5QixDQUFDN0IsUUFBUUUsSUFBUixDQUFhMkIsUUFBZCxHQUF5QixJQUFsRCxHQUEwRCxLQUEzRTs7QUFFQSxjQUFNLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsaUJBQWFDLFdBQVdELE9BQVgsRUFBb0JGLFFBQXBCLENBQWI7QUFBQSxTQUFaLENBQU47QUFDRDtBQXZCK0I7QUF3QmpDO0FBbkVrQixDIiwiZmlsZSI6InN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3luY2hyb25pemVyIGZyb20gJy4uL3N5bmMvc3luY2hyb25pemVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcclxuICBhc3luYyB0YXNrKGNsaSkge1xyXG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcclxuICAgICAgY29tbWFuZDogJ3N5bmMnLFxyXG4gICAgICBkZXNjOiAnc3luYyBhbiBvcmdhbml6YXRpb24nLFxyXG4gICAgICBidWlsZGVyOiB7XHJcbiAgICAgICAgb3JnOiB7XHJcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxyXG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9yZXZlcjoge1xyXG4gICAgICAgICAgZGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXHJcbiAgICAgICAgICBkZXNjcmliZTogJ2tlZXAgdGhlIHN5bmMgcnVubmluZyBmb3JldmVyJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgY2xlYW46IHtcclxuICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxyXG4gICAgICAgICAgZGVzY3JpYmU6ICdzdGFydCBhIGNsZWFuIHN5bmMsIGFsbCBkYXRhIHdpbGwgYmUgZGVsZXRlZCBiZWZvcmUgc3RhcnRpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGF3YWl0IHRoaXMuYXBwLmFjdGl2YXRlUGx1Z2lucygpO1xyXG5cclxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcclxuXHJcbiAgICBpZiAoYWNjb3VudCA9PSBudWxsKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuYWJsZSB0byBmaW5kIG9yZ2FuaXphdGlvbjonLCBmdWxjcnVtLmFyZ3Mub3JnKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChmdWxjcnVtLmFyZ3MuY2xlYW4pIHtcclxuICAgICAgYXdhaXQgYWNjb3VudC5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGF3YWl0IHRoaXMuc3luY0xvb3AoYWNjb3VudCwgZnVsY3J1bS5hcmdzLmZ1bGwpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc3luY0xvb3AoYWNjb3VudCwgZnVsbFN5bmMpIHtcclxuICAgIGNvbnN0IHN5bmMgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IGRhdGFTb3VyY2UgPSBhd2FpdCBmdWxjcnVtLmNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCk7XHJcblxyXG4gICAgd2hpbGUgKHN5bmMpIHtcclxuICAgICAgY29uc3Qgc3luY2hyb25pemVyID0gbmV3IFN5bmNocm9uaXplcigpO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBzeW5jaHJvbml6ZXIucnVuKGFjY291bnQsIGZ1bGNydW0uYXJncy5mb3JtLCBkYXRhU291cmNlLCB7ZnVsbFN5bmN9KTtcclxuICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGV4KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVsbFN5bmMgPSBmYWxzZTtcclxuXHJcbiAgICAgIGlmICghZnVsY3J1bS5hcmdzLmZvcmV2ZXIpIHtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaW50ZXJ2YWwgPSBmdWxjcnVtLmFyZ3MuaW50ZXJ2YWwgPyAoK2Z1bGNydW0uYXJncy5pbnRlcnZhbCAqIDEwMDApIDogMTUwMDA7XHJcblxyXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbCkpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=