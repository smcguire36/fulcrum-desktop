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

      const accounts = yield _account2.default.findAll(_this6.db, where, 'updated_at DESC');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwicGF0aE92ZXJyaWRlIiwiYXJncyIsImhvbWVQYXRoIiwiX2FwcFBhdGgiLCJ1c2VyRGF0YSIsIl9ob21lUGF0aCIsImpvaW4iLCJob21lZGlyIiwiX2RhdGFQYXRoIiwiZGF0YVBhdGgiLCJhcHBQYXRoIiwiX3BsdWdpblBhdGgiLCJwYXRoIiwic3luYyIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJfeWFyZ3MiLCJlbnYiLCJhcmd2IiwibmFtZSIsImFwcERpciIsImRpciIsIm1rZGlycCIsInBsdWdpblBhdGgiLCJkYXRhYmFzZUZpbGVQYXRoIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJmdWxsUGF0aCIsInJlc29sdmUiLCJsb2dnZXIiLCJwbHVnaW5Nb2R1bGUiLCJyZXF1aXJlIiwiUGx1Z2luQ2xhc3MiLCJkZWZhdWx0IiwibmFtZVBhcnRzIiwiZGlybmFtZSIsInNwbGl0Iiwic2VwIiwibGVuZ3RoIiwicmVwbGFjZSIsImRlYnVnIiwiZXJyb3IiLCJleCIsImFjdGl2YXRlUGx1Z2lucyIsImFjdGl2YXRlIiwiZmV0Y2hBY2NvdW50Iiwid2hlcmUiLCJvcmdhbml6YXRpb25fbmFtZSIsImFjY291bnRzIiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsImxvY2FsRGF0YWJh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cG9ydCBnbG9iIGZyb20gJ2dsb2InO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcclxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xyXG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xyXG5pbXBvcnQgZGF0YWJhc2UgZnJvbSAnLi9kYi9kYXRhYmFzZSc7XHJcbmltcG9ydCBhcGkgZnJvbSAnLi9hcGknO1xyXG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XHJcbmltcG9ydCBBY2NvdW50IGZyb20gJy4vbW9kZWxzL2FjY291bnQnO1xyXG5pbXBvcnQgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UgZnJvbSAnLi9sb2NhbC1kYXRhYmFzZS1kYXRhLXNvdXJjZSc7XHJcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xyXG5pbXBvcnQgcGF0aHMgZnJvbSAnLi4vYXBwbGljYXRpb24tcGF0aHMnO1xyXG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4vcGx1Z2luLWxvZ2dlcic7XHJcblxyXG5sZXQgYXBwID0gbnVsbDtcclxuXHJcbmNsYXNzIEFwcCB7XHJcbiAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcclxuICAgIHJldHVybiBhcHA7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuX3BsdWdpbnMgPSBbXTtcclxuICAgIHRoaXMuX3BsdWdpbnNCeU5hbWUgPSBbXTtcclxuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xyXG4gICAgdGhpcy5fYXBpID0gYXBpO1xyXG5cclxuICAgIGNvbnN0IHBhdGhPdmVycmlkZSA9IHRoaXMuYXJncy5ob21lUGF0aDtcclxuXHJcbiAgICB0aGlzLl9hcHBQYXRoID0gcGF0aE92ZXJyaWRlIHx8IHBhdGhzLnVzZXJEYXRhO1xyXG4gICAgdGhpcy5faG9tZVBhdGggPSBwYXRoT3ZlcnJpZGUgfHwgcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJy5mdWxjcnVtJyk7XHJcbiAgICB0aGlzLl9kYXRhUGF0aCA9IHRoaXMuYXJncy5kYXRhUGF0aCB8fCB0aGlzLmFwcFBhdGgoJ2RhdGEnKTtcclxuICAgIHRoaXMuX3BsdWdpblBhdGggPSB0aGlzLnBhdGgoJ3BsdWdpbnMnKTtcclxuXHJcbiAgICBta2RpcnAuc3luYyh0aGlzLl9hcHBQYXRoKTtcclxuICAgIG1rZGlycC5zeW5jKHRoaXMuX2hvbWVQYXRoKTtcclxuICAgIG1rZGlycC5zeW5jKHRoaXMuX2RhdGFQYXRoKTtcclxuICAgIG1rZGlycC5zeW5jKHRoaXMuX3BsdWdpblBhdGgpO1xyXG5cclxuICAgIHRoaXMuX2Vudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHthcHA6IHRoaXN9KTtcclxuICB9XHJcblxyXG4gIGdldCBlbnZpcm9ubWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9lbnZpcm9ubWVudDtcclxuICB9XHJcblxyXG4gIGdldCBhcGkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fYXBpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHlhcmdzKCkge1xyXG4gICAgaWYgKCF0aGlzLl95YXJncykge1xyXG4gICAgICB0aGlzLl95YXJncyA9IHlhcmdzLmVudignRlVMQ1JVTScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuX3lhcmdzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGFyZ3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy55YXJncy5hcmd2O1xyXG4gIH1cclxuXHJcbiAgYXBwUGF0aChuYW1lKSB7XHJcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX2FwcFBhdGgsIG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgYXBwRGlyKG5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcFBhdGgobmFtZSk7XHJcbiAgfVxyXG5cclxuICBwYXRoKG5hbWUpIHtcclxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5faG9tZVBhdGgsIG5hbWUpO1xyXG4gIH1cclxuXHJcbiAgZGlyKG5hbWUpIHtcclxuICAgIHJldHVybiB0aGlzLnBhdGgobmFtZSk7XHJcbiAgfVxyXG5cclxuICBta2RpcnAobmFtZSkge1xyXG4gICAgbWtkaXJwLnN5bmModGhpcy5wYXRoKG5hbWUpKTtcclxuICB9XHJcblxyXG4gIGdldCBwbHVnaW5QYXRoKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3BsdWdpblBhdGg7XHJcbiAgfVxyXG5cclxuICBnZXQgZGF0YVBhdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0YVBhdGg7XHJcbiAgfVxyXG5cclxuICBnZXQgZGF0YWJhc2VGaWxlUGF0aCgpIHtcclxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kYXRhUGF0aCwgJ2Z1bGNydW0uZGInKTtcclxuICB9XHJcblxyXG4gIGdldCBkYigpIHtcclxuICAgIHJldHVybiB0aGlzLl9kYjtcclxuICB9XHJcblxyXG4gIG9uKG5hbWUsIGZ1bmMpIHtcclxuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XHJcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXS5wdXNoKGZ1bmMpO1xyXG4gIH1cclxuXHJcbiAgb2ZmKG5hbWUsIGZ1bmMpIHtcclxuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9saXN0ZW5lcnMuaW5kZXhPZihmdW5jKTtcclxuXHJcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGVtaXQobmFtZSwgLi4uYXJncykge1xyXG4gICAgaWYgKHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xyXG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xyXG4gICAgICAgIGF3YWl0IGxpc3RlbmVyKC4uLmFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBpbml0aWFsaXplKCkge1xyXG4gICAgdGhpcy5fZGIgPSBhd2FpdCBkYXRhYmFzZSh7ZmlsZTogdGhpcy5kYXRhYmFzZUZpbGVQYXRofSk7XHJcblxyXG4gICAgaWYgKCF0aGlzLmFyZ3Muc2FmZSkge1xyXG4gICAgICBhd2FpdCB0aGlzLmluaXRpYWxpemVQbHVnaW5zKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBkaXNwb3NlKCkge1xyXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xyXG4gICAgICBpZiAocGx1Z2luLmRlYWN0aXZhdGUpIHtcclxuICAgICAgICBhd2FpdCBwbHVnaW4uZGVhY3RpdmF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX2RiKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuX2RiLmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBpbml0aWFsaXplUGx1Z2lucygpIHtcclxuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbih0aGlzLnBsdWdpblBhdGgsICcqJykpO1xyXG5cclxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xyXG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZShwbHVnaW5QYXRoKTtcclxuXHJcbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5QYXRoKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGx1Z2luTW9kdWxlID0gcmVxdWlyZShmdWxsUGF0aCk7XHJcblxyXG4gICAgICAgIGNvbnN0IFBsdWdpbkNsYXNzID0gcGx1Z2luTW9kdWxlLmRlZmF1bHQgfHwgcGx1Z2luTW9kdWxlO1xyXG5cclxuICAgICAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luQ2xhc3MoKTtcclxuXHJcbiAgICAgICAgY29uc3QgbmFtZVBhcnRzID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKS5zcGxpdChwYXRoLnNlcCk7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVQYXJ0c1tuYW1lUGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXmZ1bGNydW0tZGVza3RvcC0vLCAnJyk7XHJcblxyXG4gICAgICAgIHRoaXMuX3BsdWdpbnNCeU5hbWVbbmFtZV0gPSBwbHVnaW47XHJcbiAgICAgICAgdGhpcy5fcGx1Z2lucy5wdXNoKHBsdWdpbik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFyZ3MuZGVidWcpIHtcclxuICAgICAgICAgIGxvZ2dlci5lcnJvcignTG9hZGluZyBwbHVnaW4nLCBmdWxsUGF0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIGxvYWQgcGx1Z2luJywgZXgpO1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcignVGhpcyBpcyBtb3N0IGxpa2VseSBhbiBlcnJvciBpbiB0aGUgcGx1Z2luLicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyBhY3RpdmF0ZVBsdWdpbnMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9wbHVnaW5zKSB7XHJcbiAgICAgIGF3YWl0IHBsdWdpbi5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcclxuICAgIGNvbnN0IHdoZXJlID0ge307XHJcblxyXG4gICAgaWYgKG5hbWUpIHtcclxuICAgICAgd2hlcmUub3JnYW5pemF0aW9uX25hbWUgPSBuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGFjY291bnRzID0gYXdhaXQgQWNjb3VudC5maW5kQWxsKHRoaXMuZGIsIHdoZXJlLCAndXBkYXRlZF9hdCBERVNDJyk7XHJcblxyXG4gICAgcmV0dXJuIGFjY291bnRzWzBdO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgY3JlYXRlRGF0YVNvdXJjZShhY2NvdW50KSB7XHJcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XHJcblxyXG4gICAgY29uc3QgbG9jYWxEYXRhYmFzZSA9IG5ldyBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZShhY2NvdW50KTtcclxuXHJcbiAgICBkYXRhU291cmNlLmFkZChsb2NhbERhdGFiYXNlKTtcclxuXHJcbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XHJcblxyXG4gICAgcmV0dXJuIGRhdGFTb3VyY2U7XHJcbiAgfVxyXG59XHJcblxyXG5hcHAgPSBuZXcgQXBwKCk7XHJcblxyXG5FbnZpcm9ubWVudC5hcHAgPSBhcHA7XHJcblxyXG5nbG9iYWwuX19hcHBfXyA9IGFwcDtcclxuZ2xvYmFsLl9fYXBpX18gPSBhcGk7XHJcbmdsb2JhbC5mdWxjcnVtID0gYXBwLmVudmlyb25tZW50O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXBwO1xyXG4iXX0=