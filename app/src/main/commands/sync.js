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

        yield synchronizer.run(account, fulcrum.args.form, dataSource, { fullSync });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3N5bmMuanMiXSwibmFtZXMiOlsicnVuQ29tbWFuZCIsImFwcCIsImFjdGl2YXRlUGx1Z2lucyIsImFjY291bnQiLCJmdWxjcnVtIiwiZmV0Y2hBY2NvdW50IiwiYXJncyIsIm9yZyIsInN5bmNMb29wIiwiZnVsbCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsInR5cGUiLCJmb3JldmVyIiwiZGVmYXVsdCIsImRlc2NyaWJlIiwiaGFuZGxlciIsImZ1bGxTeW5jIiwic3luYyIsImRhdGFTb3VyY2UiLCJjcmVhdGVEYXRhU291cmNlIiwic3luY2hyb25pemVyIiwicnVuIiwiZm9ybSIsImludGVydmFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7a0JBRWUsTUFBTTtBQUFBO0FBQUE7O0FBQUEsU0FxQm5CQSxVQXJCbUIscUJBcUJOLGFBQVk7QUFDdkIsWUFBTSxNQUFLQyxHQUFMLENBQVNDLGVBQVQsRUFBTjs7QUFFQSxZQUFNQyxVQUFVLE1BQU1DLFFBQVFDLFlBQVIsQ0FBcUJELFFBQVFFLElBQVIsQ0FBYUMsR0FBbEMsQ0FBdEI7O0FBRUEsWUFBTSxNQUFLQyxRQUFMLENBQWNMLE9BQWQsRUFBdUJDLFFBQVFFLElBQVIsQ0FBYUcsSUFBcEMsQ0FBTjtBQUNELEtBM0JrQjtBQUFBOztBQUNiQyxNQUFOLENBQVdDLEdBQVgsRUFBZ0I7QUFBQTs7QUFBQTtBQUNkLGFBQU9BLElBQUlDLE9BQUosQ0FBWTtBQUNqQkEsaUJBQVMsTUFEUTtBQUVqQkMsY0FBTSxzQkFGVztBQUdqQkMsaUJBQVM7QUFDUFAsZUFBSztBQUNITSxrQkFBTSxtQkFESDtBQUVIRSxzQkFBVSxJQUZQO0FBR0hDLGtCQUFNO0FBSEgsV0FERTtBQU1QQyxtQkFBUztBQUNQQyxxQkFBUyxLQURGO0FBRVBGLGtCQUFNLFNBRkM7QUFHUEcsc0JBQVU7QUFISDtBQU5GLFNBSFE7QUFlakJDLGlCQUFTLE9BQUtwQjtBQWZHLE9BQVosQ0FBUDtBQURjO0FBa0JmOztBQVVLUSxVQUFOLENBQWVMLE9BQWYsRUFBd0JrQixRQUF4QixFQUFrQztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sSUFBYjs7QUFFQSxZQUFNQyxhQUFhLE1BQU1uQixRQUFRb0IsZ0JBQVIsQ0FBeUJyQixPQUF6QixDQUF6Qjs7QUFFQSxhQUFPbUIsSUFBUCxFQUFhO0FBQ1gsY0FBTUcsZUFBZSw0QkFBckI7O0FBRUEsY0FBTUEsYUFBYUMsR0FBYixDQUFpQnZCLE9BQWpCLEVBQTBCQyxRQUFRRSxJQUFSLENBQWFxQixJQUF2QyxFQUE2Q0osVUFBN0MsRUFBeUQsRUFBQ0YsUUFBRCxFQUF6RCxDQUFOOztBQUVBQSxtQkFBVyxLQUFYOztBQUVBLFlBQUksQ0FBQ2pCLFFBQVFFLElBQVIsQ0FBYVcsT0FBbEIsRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxjQUFNVyxXQUFXeEIsUUFBUUUsSUFBUixDQUFhc0IsUUFBYixHQUF5QixDQUFDeEIsUUFBUUUsSUFBUixDQUFhc0IsUUFBZCxHQUF5QixJQUFsRCxHQUEwRCxLQUEzRTs7QUFFQSxjQUFNLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFEO0FBQUEsaUJBQWFDLFdBQVdELE9BQVgsRUFBb0JGLFFBQXBCLENBQWI7QUFBQSxTQUFaLENBQU47QUFDRDtBQW5CK0I7QUFvQmpDO0FBakRrQixDIiwiZmlsZSI6InN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3luY2hyb25pemVyIGZyb20gJy4uL3N5bmMvc3luY2hyb25pemVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICBhc3luYyB0YXNrKGNsaSkge1xuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gICAgICBjb21tYW5kOiAnc3luYycsXG4gICAgICBkZXNjOiAnc3luYyBhbiBvcmdhbml6YXRpb24nLFxuICAgICAgYnVpbGRlcjoge1xuICAgICAgICBvcmc6IHtcbiAgICAgICAgICBkZXNjOiAnb3JnYW5pemF0aW9uIG5hbWUnLFxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgIH0sXG4gICAgICAgIGZvcmV2ZXI6IHtcbiAgICAgICAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgZGVzY3JpYmU6ICdrZWVwIHRoZSBzeW5jIHJ1bm5pbmcgZm9yZXZlcidcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCB0aGlzLmFwcC5hY3RpdmF0ZVBsdWdpbnMoKTtcblxuICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBmdWxjcnVtLmZldGNoQWNjb3VudChmdWxjcnVtLmFyZ3Mub3JnKTtcblxuICAgIGF3YWl0IHRoaXMuc3luY0xvb3AoYWNjb3VudCwgZnVsY3J1bS5hcmdzLmZ1bGwpO1xuICB9XG5cbiAgYXN5bmMgc3luY0xvb3AoYWNjb3VudCwgZnVsbFN5bmMpIHtcbiAgICBjb25zdCBzeW5jID0gdHJ1ZTtcblxuICAgIGNvbnN0IGRhdGFTb3VyY2UgPSBhd2FpdCBmdWxjcnVtLmNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICB3aGlsZSAoc3luYykge1xuICAgICAgY29uc3Qgc3luY2hyb25pemVyID0gbmV3IFN5bmNocm9uaXplcigpO1xuXG4gICAgICBhd2FpdCBzeW5jaHJvbml6ZXIucnVuKGFjY291bnQsIGZ1bGNydW0uYXJncy5mb3JtLCBkYXRhU291cmNlLCB7ZnVsbFN5bmN9KTtcblxuICAgICAgZnVsbFN5bmMgPSBmYWxzZTtcblxuICAgICAgaWYgKCFmdWxjcnVtLmFyZ3MuZm9yZXZlcikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW50ZXJ2YWwgPSBmdWxjcnVtLmFyZ3MuaW50ZXJ2YWwgPyAoK2Z1bGNydW0uYXJncy5pbnRlcnZhbCAqIDEwMDApIDogMTUwMDA7XG5cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsKSk7XG4gICAgfVxuICB9XG59XG4iXX0=