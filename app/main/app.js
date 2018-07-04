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

var _pluginLogger = require('./plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

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

    const pathOverride = this.args.homePath;

    this._appPath = pathOverride || _applicationPaths2.default.userData;
    this._homePath = pathOverride || _path2.default.join(_os2.default.homedir(), '.fulcrum');
    this._dataPath = this.args.dataPath || this.appPath('data');
    this._pluginPath = this.path('plugins');

    _mkdirp2.default.sync(this._appPath);
    _mkdirp2.default.sync(this._homePath);
    _mkdirp2.default.sync(this._dataPath);
    _mkdirp2.default.sync(this._pluginPath);

    this._environment = new _environment2.default({ app: this });
  }

  get environment() {
    return this._environment;
  }

  get api() {
    return this._api;
  }

  get yargs() {
    if (!this._yargs) {
      this._yargs = _yargs2.default.env('FULCRUM');
    }
    return this._yargs;
  }

  get args() {
    return this.yargs.argv;
  }

  appPath(name) {
    return _path2.default.join(this._appPath, name);
  }

  appDir(name) {
    return this.appPath(name);
  }

  path(name) {
    return _path2.default.join(this._homePath, name);
  }

  dir(name) {
    return this.path(name);
  }

  mkdirp(name) {
    _mkdirp2.default.sync(this.path(name));
  }

  get pluginPath() {
    return this._pluginPath;
  }

  get dataPath() {
    return this._dataPath;
  }

  get databaseFilePath() {
    return _path2.default.join(this.dataPath, 'fulcrum.db');
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
      const pluginPaths = _glob2.default.sync(_path2.default.join(_this4.pluginPath, '*'));

      for (const pluginPath of pluginPaths) {
        const fullPath = _path2.default.resolve(pluginPath);

        const logger = (0, _pluginLogger2.default)(pluginPath);

        try {
          const pluginModule = require(fullPath);

          const PluginClass = pluginModule.default || pluginModule;

          const plugin = new PluginClass();

          const nameParts = _path2.default.dirname(fullPath).split(_path2.default.sep);
          const name = nameParts[nameParts.length - 1].replace(/^fulcrum-desktop-/, '');

          _this4._pluginsByName[name] = plugin;
          _this4._plugins.push(plugin);

          if (_this4.args.debug) {
            logger.error('Loading plugin', fullPath);
          }
        } catch (ex) {
          logger.error('Failed to load plugin', ex);
          logger.error('This is most likely an error in the plugin.');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwicGF0aE92ZXJyaWRlIiwiYXJncyIsImhvbWVQYXRoIiwiX2FwcFBhdGgiLCJ1c2VyRGF0YSIsIl9ob21lUGF0aCIsImpvaW4iLCJob21lZGlyIiwiX2RhdGFQYXRoIiwiZGF0YVBhdGgiLCJhcHBQYXRoIiwiX3BsdWdpblBhdGgiLCJwYXRoIiwic3luYyIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJfeWFyZ3MiLCJlbnYiLCJhcmd2IiwibmFtZSIsImFwcERpciIsImRpciIsIm1rZGlycCIsInBsdWdpblBhdGgiLCJkYXRhYmFzZUZpbGVQYXRoIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJmdWxsUGF0aCIsInJlc29sdmUiLCJsb2dnZXIiLCJwbHVnaW5Nb2R1bGUiLCJyZXF1aXJlIiwiUGx1Z2luQ2xhc3MiLCJkZWZhdWx0IiwibmFtZVBhcnRzIiwiZGlybmFtZSIsInNwbGl0Iiwic2VwIiwibGVuZ3RoIiwicmVwbGFjZSIsImRlYnVnIiwiZXJyb3IiLCJleCIsImFjdGl2YXRlUGx1Z2lucyIsImFjdGl2YXRlIiwiZmV0Y2hBY2NvdW50Iiwid2hlcmUiLCJvcmdhbml6YXRpb25fbmFtZSIsImFjY291bnRzIiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsImxvY2FsRGF0YWJh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bSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGRhdGFiYXNlIGZyb20gJy4vZGIvZGF0YWJhc2UnO1xuaW1wb3J0IGFwaSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IHBhdGhzIGZyb20gJy4uL2FwcGxpY2F0aW9uLXBhdGhzJztcbmltcG9ydCBwbHVnaW5Mb2dnZXIgZnJvbSAnLi9wbHVnaW4tbG9nZ2VyJztcblxubGV0IGFwcCA9IG51bGw7XG5cbmNsYXNzIEFwcCB7XG4gIHN0YXRpYyBnZXQgaW5zdGFuY2UoKSB7XG4gICAgcmV0dXJuIGFwcDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX3BsdWdpbnMgPSBbXTtcbiAgICB0aGlzLl9wbHVnaW5zQnlOYW1lID0gW107XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5fYXBpID0gYXBpO1xuXG4gICAgY29uc3QgcGF0aE92ZXJyaWRlID0gdGhpcy5hcmdzLmhvbWVQYXRoO1xuXG4gICAgdGhpcy5fYXBwUGF0aCA9IHBhdGhPdmVycmlkZSB8fCBwYXRocy51c2VyRGF0YTtcbiAgICB0aGlzLl9ob21lUGF0aCA9IHBhdGhPdmVycmlkZSB8fCBwYXRoLmpvaW4ob3MuaG9tZWRpcigpLCAnLmZ1bGNydW0nKTtcbiAgICB0aGlzLl9kYXRhUGF0aCA9IHRoaXMuYXJncy5kYXRhUGF0aCB8fCB0aGlzLmFwcFBhdGgoJ2RhdGEnKTtcbiAgICB0aGlzLl9wbHVnaW5QYXRoID0gdGhpcy5wYXRoKCdwbHVnaW5zJyk7XG5cbiAgICBta2RpcnAuc3luYyh0aGlzLl9hcHBQYXRoKTtcbiAgICBta2RpcnAuc3luYyh0aGlzLl9ob21lUGF0aCk7XG4gICAgbWtkaXJwLnN5bmModGhpcy5fZGF0YVBhdGgpO1xuICAgIG1rZGlycC5zeW5jKHRoaXMuX3BsdWdpblBhdGgpO1xuXG4gICAgdGhpcy5fZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQoe2FwcDogdGhpc30pO1xuICB9XG5cbiAgZ2V0IGVudmlyb25tZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9lbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldCBhcGkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwaTtcbiAgfVxuXG4gIGdldCB5YXJncygpIHtcbiAgICBpZiAoIXRoaXMuX3lhcmdzKSB7XG4gICAgICB0aGlzLl95YXJncyA9IHlhcmdzLmVudignRlVMQ1JVTScpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5feWFyZ3M7XG4gIH1cblxuICBnZXQgYXJncygpIHtcbiAgICByZXR1cm4gdGhpcy55YXJncy5hcmd2O1xuICB9XG5cbiAgYXBwUGF0aChuYW1lKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLl9hcHBQYXRoLCBuYW1lKTtcbiAgfVxuXG4gIGFwcERpcihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwUGF0aChuYW1lKTtcbiAgfVxuXG4gIHBhdGgobmFtZSkge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5faG9tZVBhdGgsIG5hbWUpO1xuICB9XG5cbiAgZGlyKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRoKG5hbWUpO1xuICB9XG5cbiAgbWtkaXJwKG5hbWUpIHtcbiAgICBta2RpcnAuc3luYyh0aGlzLnBhdGgobmFtZSkpO1xuICB9XG5cbiAgZ2V0IHBsdWdpblBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BsdWdpblBhdGg7XG4gIH1cblxuICBnZXQgZGF0YVBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFQYXRoO1xuICB9XG5cbiAgZ2V0IGRhdGFiYXNlRmlsZVBhdGgoKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmRhdGFQYXRoLCAnZnVsY3J1bS5kYicpO1xuICB9XG5cbiAgZ2V0IGRiKCkge1xuICAgIHJldHVybiB0aGlzLl9kYjtcbiAgfVxuXG4gIG9uKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdLnB1c2goZnVuYyk7XG4gIH1cblxuICBvZmYobmFtZSwgZnVuYykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YoZnVuYyk7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGVtaXQobmFtZSwgLi4uYXJncykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgIGF3YWl0IGxpc3RlbmVyKC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy5fZGIgPSBhd2FpdCBkYXRhYmFzZSh7ZmlsZTogdGhpcy5kYXRhYmFzZUZpbGVQYXRofSk7XG5cbiAgICBpZiAoIXRoaXMuYXJncy5zYWZlKSB7XG4gICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQbHVnaW5zKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZGlzcG9zZSgpIHtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9wbHVnaW5zKSB7XG4gICAgICBpZiAocGx1Z2luLmRlYWN0aXZhdGUpIHtcbiAgICAgICAgYXdhaXQgcGx1Z2luLmRlYWN0aXZhdGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZGIpIHtcbiAgICAgIGF3YWl0IHRoaXMuX2RiLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgaW5pdGlhbGl6ZVBsdWdpbnMoKSB7XG4gICAgY29uc3QgcGx1Z2luUGF0aHMgPSBnbG9iLnN5bmMocGF0aC5qb2luKHRoaXMucGx1Z2luUGF0aCwgJyonKSk7XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpblBhdGggb2YgcGx1Z2luUGF0aHMpIHtcbiAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5yZXNvbHZlKHBsdWdpblBhdGgpO1xuXG4gICAgICBjb25zdCBsb2dnZXIgPSBwbHVnaW5Mb2dnZXIocGx1Z2luUGF0aCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbk1vZHVsZSA9IHJlcXVpcmUoZnVsbFBhdGgpO1xuXG4gICAgICAgIGNvbnN0IFBsdWdpbkNsYXNzID0gcGx1Z2luTW9kdWxlLmRlZmF1bHQgfHwgcGx1Z2luTW9kdWxlO1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBQbHVnaW5DbGFzcygpO1xuXG4gICAgICAgIGNvbnN0IG5hbWVQYXJ0cyA9IHBhdGguZGlybmFtZShmdWxsUGF0aCkuc3BsaXQocGF0aC5zZXApO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZVBhcnRzW25hbWVQYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9eZnVsY3J1bS1kZXNrdG9wLS8sICcnKTtcblxuICAgICAgICB0aGlzLl9wbHVnaW5zQnlOYW1lW25hbWVdID0gcGx1Z2luO1xuICAgICAgICB0aGlzLl9wbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgICAgICBpZiAodGhpcy5hcmdzLmRlYnVnKSB7XG4gICAgICAgICAgbG9nZ2VyLmVycm9yKCdMb2FkaW5nIHBsdWdpbicsIGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdGYWlsZWQgdG8gbG9hZCBwbHVnaW4nLCBleCk7XG4gICAgICAgIGxvZ2dlci5lcnJvcignVGhpcyBpcyBtb3N0IGxpa2VseSBhbiBlcnJvciBpbiB0aGUgcGx1Z2luLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGFjdGl2YXRlUGx1Z2lucygpIHtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9wbHVnaW5zKSB7XG4gICAgICBhd2FpdCBwbHVnaW4uYWN0aXZhdGUoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmZXRjaEFjY291bnQobmFtZSkge1xuICAgIGNvbnN0IHdoZXJlID0ge307XG5cbiAgICBpZiAobmFtZSkge1xuICAgICAgd2hlcmUub3JnYW5pemF0aW9uX25hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5maW5kQWxsKHRoaXMuZGIsIHdoZXJlKTtcblxuICAgIHJldHVybiBhY2NvdW50c1swXTtcbiAgfVxuXG4gIGFzeW5jIGNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCkge1xuICAgIGxldCBkYXRhU291cmNlID0gbmV3IERhdGFTb3VyY2UoKTtcblxuICAgIGNvbnN0IGxvY2FsRGF0YWJhc2UgPSBuZXcgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UoYWNjb3VudCk7XG5cbiAgICBkYXRhU291cmNlLmFkZChsb2NhbERhdGFiYXNlKTtcblxuICAgIGF3YWl0IGxvY2FsRGF0YWJhc2UubG9hZCh0aGlzLmRiKTtcblxuICAgIHJldHVybiBkYXRhU291cmNlO1xuICB9XG59XG5cbmFwcCA9IG5ldyBBcHAoKTtcblxuRW52aXJvbm1lbnQuYXBwID0gYXBwO1xuXG5nbG9iYWwuX19hcHBfXyA9IGFwcDtcbmdsb2JhbC5fX2FwaV9fID0gYXBpO1xuZ2xvYmFsLmZ1bGNydW0gPSBhcHAuZW52aXJvbm1lbnQ7XG5cbmV4cG9ydCBkZWZhdWx0IGFwcDtcbiJdfQ==