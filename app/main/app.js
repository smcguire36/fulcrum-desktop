'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _database = require('./db/database');

var _database2 = _interopRequireDefault(_database);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _environment = require('./environment');

var _environment2 = _interopRequireDefault(_environment);

var _account = require('./models/account');

var _account2 = _interopRequireDefault(_account);

var _localDatabaseDataSource = require('./local-database-data-source');

var _localDatabaseDataSource2 = _interopRequireDefault(_localDatabaseDataSource);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let app = null;

class App {
  static get instance() {
    return app;
  }

  constructor() {
    this._plugins = [];
    this._pluginsByName = [];
    this._listeners = {};
    this._api = _api2.default;

    // TODO(zhm) this needs to be adjusted for Windows and Linux
    this._rootDirectory = _path2.default.join(_os2.default.homedir(), 'Documents', 'fulcrum');

    this.mkdirp('data');
    this.mkdirp('plugins');
    this.mkdirp('media');
    this.mkdirp('reports');

    this._environment = new _environment2.default({ app: this });
  }

  get environment() {
    return this._environment;
  }

  get api() {
    return this._api;
  }

  get yargs() {
    return _yargs2.default;
  }

  get args() {
    return this.yargs.argv;
  }

  dir(dir) {
    return _path2.default.join(this._rootDirectory, dir);
  }

  mkdirp(name) {
    _mkdirp2.default.sync(this.dir(name));
  }

  get db() {
    return this._db;
  }

  on(name, func) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }

    this._listeners[name].push(func);
  }

  off(name, func) {
    if (this._listeners[name]) {
      const index = this._listeners.indexOf(func);

      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    }
  }

  emit(name, ...args) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this._listeners[name]) {
        for (const listener of _this._listeners[name]) {
          yield listener(...args);
        }
      }
    })();
  }

  initialize() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const file = _path2.default.join(_this2.dir('data'), 'fulcrum.db');

      _this2._db = yield (0, _database2.default)({ file });

      if (!_this2.args.safe) {
        yield _this2.initializePlugins();
      }
    })();
  }

  dispose() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      for (const plugin of _this3._plugins) {
        if (plugin.deactivate) {
          yield plugin.deactivate();
        }
      }

      if (_this3._db) {
        yield _this3._db.close();
      }
    })();
  }

  initializePlugins() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(_this4.dir('plugins'), '*'));

      for (const pluginPath of pluginPaths) {
        const fullPath = _path2.default.resolve(pluginPath);

        try {
          const pluginModule = require(fullPath);

          const PluginClass = pluginModule.default || pluginModule;

          const plugin = new PluginClass();

          const nameParts = _path2.default.dirname(fullPath).split(_path2.default.sep);
          const name = nameParts[nameParts.length - 1].replace(/^fulcrum-desktop-/, '');

          _this4._pluginsByName[name] = plugin;
          _this4._plugins.push(plugin);

          if (_this4.args.debug) {
            console.error('Loading plugin', fullPath);
          }
        } catch (ex) {
          console.error('Failed to load plugin', ex);
        }
      }
    })();
  }

  activatePlugins() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      for (const plugin of _this5._plugins) {
        yield plugin.activate();
      }
    })();
  }

  fetchAccount(name) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const where = {};

      if (name) {
        where.organization_name = name;
      }

      const accounts = yield _account2.default.findAll(_this6.db, where);

      return accounts[0];
    })();
  }

  createDataSource(account) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      let dataSource = new _fulcrumCore.DataSource();

      const localDatabase = new _localDatabaseDataSource2.default(account);

      dataSource.add(localDatabase);

      yield localDatabase.load(_this7.db);

      return dataSource;
    })();
  }
}

app = new App();

_environment2.default.app = app;

global.__app__ = app;
global.__api__ = _api2.default;
global.fulcrum = app.environment;

exports.default = app;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwiX3Jvb3REaXJlY3RvcnkiLCJqb2luIiwiaG9tZWRpciIsIm1rZGlycCIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJhcmdzIiwiYXJndiIsImRpciIsIm5hbWUiLCJzeW5jIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJwbHVnaW5QYXRoIiwiZnVsbFBhdGgiLCJyZXNvbHZlIiwicGx1Z2luTW9kdWxlIiwicmVxdWlyZSIsIlBsdWdpbkNsYXNzIiwiZGVmYXVsdCIsIm5hbWVQYXJ0cyIsImRpcm5hbWUiLCJzcGxpdCIsInNlcCIsImxlbmd0aCIsInJlcGxhY2UiLCJkZWJ1ZyIsImNvbnNvbGUiLCJlcnJvciIsImV4IiwiYWN0aXZhdGVQbHVnaW5zIiwiYWN0aXZhdGUiLCJmZXRjaEFjY291bnQiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwibG9jYWxEYXRhYmFzZSIsImFkZCIsImxvYWQiLCJnbG9iYWwiLCJfX2FwcF9fIiwiX19hcGlfXyIsImZ1bGNydW0iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7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ZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGRhdGFiYXNlIGZyb20gJy4vZGIvZGF0YWJhc2UnO1xuaW1wb3J0IGFwaSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5sZXQgYXBwID0gbnVsbDtcblxuY2xhc3MgQXBwIHtcbiAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICByZXR1cm4gYXBwO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuX3BsdWdpbnNCeU5hbWUgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLl9hcGkgPSBhcGk7XG5cbiAgICAvLyBUT0RPKHpobSkgdGhpcyBuZWVkcyB0byBiZSBhZGp1c3RlZCBmb3IgV2luZG93cyBhbmQgTGludXhcbiAgICB0aGlzLl9yb290RGlyZWN0b3J5ID0gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJ0RvY3VtZW50cycsICdmdWxjcnVtJyk7XG5cbiAgICB0aGlzLm1rZGlycCgnZGF0YScpO1xuICAgIHRoaXMubWtkaXJwKCdwbHVnaW5zJyk7XG4gICAgdGhpcy5ta2RpcnAoJ21lZGlhJyk7XG4gICAgdGhpcy5ta2RpcnAoJ3JlcG9ydHMnKTtcblxuICAgIHRoaXMuX2Vudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHthcHA6IHRoaXN9KTtcbiAgfVxuXG4gIGdldCBlbnZpcm9ubWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXQgYXBpKCkge1xuICAgIHJldHVybiB0aGlzLl9hcGk7XG4gIH1cblxuICBnZXQgeWFyZ3MoKSB7XG4gICAgcmV0dXJuIHlhcmdzO1xuICB9XG5cbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMueWFyZ3MuYXJndjtcbiAgfVxuXG4gIGRpcihkaXIpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX3Jvb3REaXJlY3RvcnksIGRpcik7XG4gIH1cblxuICBta2RpcnAobmFtZSkge1xuICAgIG1rZGlycC5zeW5jKHRoaXMuZGlyKG5hbWUpKTtcbiAgfVxuXG4gIGdldCBkYigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGI7XG4gIH1cblxuICBvbihuYW1lLCBmdW5jKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXS5wdXNoKGZ1bmMpO1xuICB9XG5cbiAgb2ZmKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGZ1bmMpO1xuXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBlbWl0KG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgICBhd2FpdCBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGZpbGUgPSBwYXRoLmpvaW4odGhpcy5kaXIoJ2RhdGEnKSwgJ2Z1bGNydW0uZGInKTtcblxuICAgIHRoaXMuX2RiID0gYXdhaXQgZGF0YWJhc2Uoe2ZpbGV9KTtcblxuICAgIGlmICghdGhpcy5hcmdzLnNhZmUpIHtcbiAgICAgIGF3YWl0IHRoaXMuaW5pdGlhbGl6ZVBsdWdpbnMoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuX3BsdWdpbnMpIHtcbiAgICAgIGlmIChwbHVnaW4uZGVhY3RpdmF0ZSkge1xuICAgICAgICBhd2FpdCBwbHVnaW4uZGVhY3RpdmF0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9kYikge1xuICAgICAgYXdhaXQgdGhpcy5fZGIuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0aWFsaXplUGx1Z2lucygpIHtcbiAgICBjb25zdCBwbHVnaW5QYXRocyA9IGdsb2Iuc3luYyhwYXRoLmpvaW4odGhpcy5kaXIoJ3BsdWdpbnMnKSwgJyonKSk7XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpblBhdGggb2YgcGx1Z2luUGF0aHMpIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5yZXNvbHZlKHBsdWdpblBhdGgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwbHVnaW5Nb2R1bGUgPSByZXF1aXJlKGZ1bGxQYXRoKTtcblxuICAgICAgICBjb25zdCBQbHVnaW5DbGFzcyA9IHBsdWdpbk1vZHVsZS5kZWZhdWx0IHx8IHBsdWdpbk1vZHVsZTtcblxuICAgICAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luQ2xhc3MoKTtcblxuICAgICAgICBjb25zdCBuYW1lUGFydHMgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpLnNwbGl0KHBhdGguc2VwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVQYXJ0c1tuYW1lUGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXmZ1bGNydW0tZGVza3RvcC0vLCAnJyk7XG5cbiAgICAgICAgdGhpcy5fcGx1Z2luc0J5TmFtZVtuYW1lXSA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5fcGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICAgICAgaWYgKHRoaXMuYXJncy5kZWJ1Zykge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0xvYWRpbmcgcGx1Z2luJywgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBwbHVnaW4nLCBleCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGVQbHVnaW5zKCkge1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuX3BsdWdpbnMpIHtcbiAgICAgIGF3YWl0IHBsdWdpbi5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoQWNjb3VudChuYW1lKSB7XG4gICAgY29uc3Qgd2hlcmUgPSB7fTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICB3aGVyZS5vcmdhbml6YXRpb25fbmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LmZpbmRBbGwodGhpcy5kYiwgd2hlcmUpO1xuXG4gICAgcmV0dXJuIGFjY291bnRzWzBdO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlRGF0YVNvdXJjZShhY2NvdW50KSB7XG4gICAgbGV0IGRhdGFTb3VyY2UgPSBuZXcgRGF0YVNvdXJjZSgpO1xuXG4gICAgY29uc3QgbG9jYWxEYXRhYmFzZSA9IG5ldyBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZShhY2NvdW50KTtcblxuICAgIGRhdGFTb3VyY2UuYWRkKGxvY2FsRGF0YWJhc2UpO1xuXG4gICAgYXdhaXQgbG9jYWxEYXRhYmFzZS5sb2FkKHRoaXMuZGIpO1xuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2U7XG4gIH1cbn1cblxuYXBwID0gbmV3IEFwcCgpO1xuXG5FbnZpcm9ubWVudC5hcHAgPSBhcHA7XG5cbmdsb2JhbC5fX2FwcF9fID0gYXBwO1xuZ2xvYmFsLl9fYXBpX18gPSBhcGk7XG5nbG9iYWwuZnVsY3J1bSA9IGFwcC5lbnZpcm9ubWVudDtcblxuZXhwb3J0IGRlZmF1bHQgYXBwO1xuIl19