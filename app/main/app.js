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

var _applicationPaths = require('../application-paths');

var _applicationPaths2 = _interopRequireDefault(_applicationPaths);

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

    this._appDirectory = _applicationPaths2.default.userData;
    this._dotDirectory = _path2.default.join(_os2.default.homedir(), '.fulcrum');

    _mkdirp2.default.sync(this._appDirectory);
    _mkdirp2.default.sync(this._dotDirectory);

    _mkdirp2.default.sync(_path2.default.join(this._appDirectory, 'data'));
    _mkdirp2.default.sync(_path2.default.join(this._dotDirectory, 'plugins'));

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

  appDir(dir) {
    return _path2.default.join(this._appDirectory, dir);
  }

  dir(dir) {
    return _path2.default.join(this._dotDirectory, dir);
  }

  mkdirp(name) {
    _mkdirp2.default.sync(this.dir(name));
  }

  get databaseFilePath() {
    return _path2.default.join(this.appDir('data'), 'fulcrum.db');
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
      _this2._db = yield (0, _database2.default)({ file: _this2.databaseFilePath });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwiX2FwcERpcmVjdG9yeSIsInVzZXJEYXRhIiwiX2RvdERpcmVjdG9yeSIsImpvaW4iLCJob21lZGlyIiwic3luYyIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJhcmdzIiwiYXJndiIsImFwcERpciIsImRpciIsIm1rZGlycCIsIm5hbWUiLCJkYXRhYmFzZUZpbGVQYXRoIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJwbHVnaW5QYXRoIiwiZnVsbFBhdGgiLCJyZXNvbHZlIiwicGx1Z2luTW9kdWxlIiwicmVxdWlyZSIsIlBsdWdpbkNsYXNzIiwiZGVmYXVsdCIsIm5hbWVQYXJ0cyIsImRpcm5hbWUiLCJzcGxpdCIsInNlcCIsImxlbmd0aCIsInJlcGxhY2UiLCJkZWJ1ZyIsImNvbnNvbGUiLCJlcnJvciIsImV4IiwiYWN0aXZhdGVQbHVnaW5zIiwiYWN0aXZhdGUiLCJmZXRjaEFjY291bnQiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwibG9jYWxEYXRhYmFzZSIsImFkZCIsImxvYWQiLCJnbG9iYWwiLCJfX2FwcF9fIiwiX19hcGlfXyIsImZ1bGNydW0iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FB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WCxDQUFlRCxhQUFmOztBQUVBLFlBQU1BLGNBQWNFLElBQWQsQ0FBbUIsT0FBS2pELEVBQXhCLENBQU47O0FBRUEsYUFBTzhDLFVBQVA7QUFUOEI7QUFVL0I7QUFqS087O0FBb0tWdkUsTUFBTSxJQUFJQyxHQUFKLEVBQU47O0FBRUEsc0JBQVlELEdBQVosR0FBa0JBLEdBQWxCOztBQUVBMkUsT0FBT0MsT0FBUCxHQUFpQjVFLEdBQWpCO0FBQ0EyRSxPQUFPRSxPQUFQO0FBQ0FGLE9BQU9HLE9BQVAsR0FBaUI5RSxJQUFJZSxXQUFyQjs7a0JBRWVmLEciLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGRhdGFiYXNlIGZyb20gJy4vZGIvZGF0YWJhc2UnO1xuaW1wb3J0IGFwaSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IHBhdGhzIGZyb20gJy4uL2FwcGxpY2F0aW9uLXBhdGhzJztcblxubGV0IGFwcCA9IG51bGw7XG5cbmNsYXNzIEFwcCB7XG4gIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XG4gICAgcmV0dXJuIGFwcDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3BsdWdpbnMgPSBbXTtcbiAgICB0aGlzLl9wbHVnaW5zQnlOYW1lID0gW107XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5fYXBpID0gYXBpO1xuXG4gICAgdGhpcy5fYXBwRGlyZWN0b3J5ID0gcGF0aHMudXNlckRhdGE7XG4gICAgdGhpcy5fZG90RGlyZWN0b3J5ID0gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJy5mdWxjcnVtJyk7XG5cbiAgICBta2RpcnAuc3luYyh0aGlzLl9hcHBEaXJlY3RvcnkpO1xuICAgIG1rZGlycC5zeW5jKHRoaXMuX2RvdERpcmVjdG9yeSk7XG5cbiAgICBta2RpcnAuc3luYyhwYXRoLmpvaW4odGhpcy5fYXBwRGlyZWN0b3J5LCAnZGF0YScpKTtcbiAgICBta2RpcnAuc3luYyhwYXRoLmpvaW4odGhpcy5fZG90RGlyZWN0b3J5LCAncGx1Z2lucycpKTtcblxuICAgIHRoaXMuX2Vudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHthcHA6IHRoaXN9KTtcbiAgfVxuXG4gIGdldCBlbnZpcm9ubWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXQgYXBpKCkge1xuICAgIHJldHVybiB0aGlzLl9hcGk7XG4gIH1cblxuICBnZXQgeWFyZ3MoKSB7XG4gICAgcmV0dXJuIHlhcmdzO1xuICB9XG5cbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMueWFyZ3MuYXJndjtcbiAgfVxuXG4gIGFwcERpcihkaXIpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX2FwcERpcmVjdG9yeSwgZGlyKTtcbiAgfVxuXG4gIGRpcihkaXIpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX2RvdERpcmVjdG9yeSwgZGlyKTtcbiAgfVxuXG4gIG1rZGlycChuYW1lKSB7XG4gICAgbWtkaXJwLnN5bmModGhpcy5kaXIobmFtZSkpO1xuICB9XG5cbiAgZ2V0IGRhdGFiYXNlRmlsZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmFwcERpcignZGF0YScpLCAnZnVsY3J1bS5kYicpO1xuICB9XG5cbiAgZ2V0IGRiKCkge1xuICAgIHJldHVybiB0aGlzLl9kYjtcbiAgfVxuXG4gIG9uKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdLnB1c2goZnVuYyk7XG4gIH1cblxuICBvZmYobmFtZSwgZnVuYykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YoZnVuYyk7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGVtaXQobmFtZSwgLi4uYXJncykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgIGF3YWl0IGxpc3RlbmVyKC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fZGIgPSBhd2FpdCBkYXRhYmFzZSh7ZmlsZTogdGhpcy5kYXRhYmFzZUZpbGVQYXRofSk7XG5cbiAgICBpZiAoIXRoaXMuYXJncy5zYWZlKSB7XG4gICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQbHVnaW5zKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlzcG9zZSgpIHtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9wbHVnaW5zKSB7XG4gICAgICBpZiAocGx1Z2luLmRlYWN0aXZhdGUpIHtcbiAgICAgICAgYXdhaXQgcGx1Z2luLmRlYWN0aXZhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGIpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2RiLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5pdGlhbGl6ZVBsdWdpbnMoKSB7XG4gICAgY29uc3QgcGx1Z2luUGF0aHMgPSBnbG9iLnN5bmMocGF0aC5qb2luKHRoaXMuZGlyKCdwbHVnaW5zJyksICcqJykpO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZShwbHVnaW5QYXRoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGx1Z2luTW9kdWxlID0gcmVxdWlyZShmdWxsUGF0aCk7XG5cbiAgICAgICAgY29uc3QgUGx1Z2luQ2xhc3MgPSBwbHVnaW5Nb2R1bGUuZGVmYXVsdCB8fCBwbHVnaW5Nb2R1bGU7XG5cbiAgICAgICAgY29uc3QgcGx1Z2luID0gbmV3IFBsdWdpbkNsYXNzKCk7XG5cbiAgICAgICAgY29uc3QgbmFtZVBhcnRzID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKS5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lUGFydHNbbmFtZVBhcnRzLmxlbmd0aCAtIDFdLnJlcGxhY2UoL15mdWxjcnVtLWRlc2t0b3AtLywgJycpO1xuXG4gICAgICAgIHRoaXMuX3BsdWdpbnNCeU5hbWVbbmFtZV0gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuX3BsdWdpbnMucHVzaChwbHVnaW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmFyZ3MuZGVidWcpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdMb2FkaW5nIHBsdWdpbicsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgcGx1Z2luJywgZXgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlUGx1Z2lucygpIHtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9wbHVnaW5zKSB7XG4gICAgICBhd2FpdCBwbHVnaW4uYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaEFjY291bnQobmFtZSkge1xuICAgIGNvbnN0IHdoZXJlID0ge307XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgd2hlcmUub3JnYW5pemF0aW9uX25hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5maW5kQWxsKHRoaXMuZGIsIHdoZXJlKTtcblxuICAgIHJldHVybiBhY2NvdW50c1swXTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCkge1xuICAgIGxldCBkYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2UoKTtcblxuICAgIGNvbnN0IGxvY2FsRGF0YWJhc2UgPSBuZXcgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICBkYXRhU291cmNlLmFkZChsb2NhbERhdGFiYXNlKTtcblxuICAgIGF3YWl0IGxvY2FsRGF0YWJhc2UubG9hZCh0aGlzLmRiKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlO1xuICB9XG59XG5cbmFwcCA9IG5ldyBBcHAoKTtcblxuRW52aXJvbm1lbnQuYXBwID0gYXBwO1xuXG5nbG9iYWwuX19hcHBfXyA9IGFwcDtcbmdsb2JhbC5fX2FwaV9fID0gYXBpO1xuZ2xvYmFsLmZ1bGNydW0gPSBhcHAuZW52aXJvbm1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcbiJdfQ==