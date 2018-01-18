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
    this._dataPath = this.appPath('data');
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
    return _yargs2.default;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwicGF0aE92ZXJyaWRlIiwiYXJncyIsImhvbWVQYXRoIiwiX2FwcFBhdGgiLCJ1c2VyRGF0YSIsIl9ob21lUGF0aCIsImpvaW4iLCJob21lZGlyIiwiX2RhdGFQYXRoIiwiYXBwUGF0aCIsIl9wbHVnaW5QYXRoIiwicGF0aCIsInN5bmMiLCJfZW52aXJvbm1lbnQiLCJlbnZpcm9ubWVudCIsImFwaSIsInlhcmdzIiwiYXJndiIsIm5hbWUiLCJhcHBEaXIiLCJkaXIiLCJta2RpcnAiLCJwbHVnaW5QYXRoIiwiZGF0YVBhdGgiLCJkYXRhYmFzZUZpbGVQYXRoIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJmdWxsUGF0aCIsInJlc29sdmUiLCJsb2dnZXIiLCJwbHVnaW5Nb2R1bGUiLCJyZXF1aXJlIiwiUGx1Z2luQ2xhc3MiLCJkZWZhdWx0IiwibmFtZVBhcnRzIiwiZGlybmFtZSIsInNwbGl0Iiwic2VwIiwibGVuZ3RoIiwicmVwbGFjZSIsImRlYnVnIiwiZXJyb3IiLCJleCIsImFjdGl2YXRlUGx1Z2lucyIsImFjdGl2YXRlIiwiZmV0Y2hBY2NvdW50Iiwid2hlcmUiLCJvcmdhbml6YXRpb25fbmFtZSIsImFjY291bnRzIiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsImxvY2FsRGF0YWJhc2UiLCJhZGQiLCJsb2Fk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TXBCLE1BQVgsSUFBcUIsT0FBSzdDLFFBQTFCLEVBQW9DO0FBQ2xDLGNBQU02QyxPQUFPcUIsUUFBUCxFQUFOO0FBQ0Q7QUFIcUI7QUFJdkI7O0FBRUtDLGNBQU4sQ0FBbUI3QyxJQUFuQixFQUF5QjtBQUFBOztBQUFBO0FBQ3ZCLFlBQU04QyxRQUFRLEVBQWQ7O0FBRUEsVUFBSTlDLElBQUosRUFBVTtBQUNSOEMsY0FBTUMsaUJBQU4sR0FBMEIvQyxJQUExQjtBQUNEOztBQUVELFlBQU1nRCxXQUFXLE1BQU0sa0JBQVFDLE9BQVIsQ0FBZ0IsT0FBSzFDLEVBQXJCLEVBQXlCdUMsS0FBekIsQ0FBdkI7O0FBRUEsYUFBT0UsU0FBUyxDQUFULENBQVA7QUFUdUI7QUFVeEI7O0FBRUtFLGtCQUFOLENBQXVCQyxPQUF2QixFQUFnQztBQUFBOztBQUFBO0FBQzlCLFVBQUlDLGFBQWEsNkJBQWpCOztBQUVBLFlBQU1DLGdCQUFnQixzQ0FBNEJGLE9BQTVCLENBQXRCOztBQUVBQyxpQkFBV0UsR0FBWCxDQUFlRCxhQUFmOztBQUVBLFlBQU1BLGNBQWNFLElBQWQsQ0FBbUIsT0FBS2hELEVBQXhCLENBQU47O0FBRUEsYUFBTzZDLFVBQVA7QUFUOEI7QUFVL0I7QUF2TE87O0FBMExWOUUsTUFBTSxJQUFJQyxHQUFKLEVBQU47O0FBRUEsc0JBQVlELEdBQVosR0FBa0JBLEdBQWxCOztBQUVBa0YsT0FBT0MsT0FBUCxHQUFpQm5GLEdBQWpCO0FBQ0FrRixPQUFPRSxPQUFQO0FBQ0FGLE9BQU9HLE9BQVAsR0FBaUJyRixJQUFJc0IsV0FBckI7O2tCQUVldEIsRyIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgZGF0YWJhc2UgZnJvbSAnLi9kYi9kYXRhYmFzZSc7XG5pbXBvcnQgYXBpIGZyb20gJy4vYXBpJztcbmltcG9ydCBFbnZpcm9ubWVudCBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4vbW9kZWxzL2FjY291bnQnO1xuaW1wb3J0IExvY2FsRGF0YWJhc2VEYXRhU291cmNlIGZyb20gJy4vbG9jYWwtZGF0YWJhc2UtZGF0YS1zb3VyY2UnO1xuaW1wb3J0IHsgRGF0YVNvdXJjZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgcGF0aHMgZnJvbSAnLi4vYXBwbGljYXRpb24tcGF0aHMnO1xuaW1wb3J0IHBsdWdpbkxvZ2dlciBmcm9tICcuL3BsdWdpbi1sb2dnZXInO1xuXG5sZXQgYXBwID0gbnVsbDtcblxuY2xhc3MgQXBwIHtcbiAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICByZXR1cm4gYXBwO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuX3BsdWdpbnNCeU5hbWUgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLl9hcGkgPSBhcGk7XG5cbiAgICBjb25zdCBwYXRoT3ZlcnJpZGUgPSB0aGlzLmFyZ3MuaG9tZVBhdGg7XG5cbiAgICB0aGlzLl9hcHBQYXRoID0gcGF0aE92ZXJyaWRlIHx8IHBhdGhzLnVzZXJEYXRhO1xuICAgIHRoaXMuX2hvbWVQYXRoID0gcGF0aE92ZXJyaWRlIHx8IHBhdGguam9pbihvcy5ob21lZGlyKCksICcuZnVsY3J1bScpO1xuICAgIHRoaXMuX2RhdGFQYXRoID0gdGhpcy5hcHBQYXRoKCdkYXRhJyk7XG4gICAgdGhpcy5fcGx1Z2luUGF0aCA9IHRoaXMucGF0aCgncGx1Z2lucycpO1xuXG4gICAgbWtkaXJwLnN5bmModGhpcy5fYXBwUGF0aCk7XG4gICAgbWtkaXJwLnN5bmModGhpcy5faG9tZVBhdGgpO1xuICAgIG1rZGlycC5zeW5jKHRoaXMuX2RhdGFQYXRoKTtcbiAgICBta2RpcnAuc3luYyh0aGlzLl9wbHVnaW5QYXRoKTtcblxuICAgIHRoaXMuX2Vudmlyb25tZW50ID0gbmV3IEVudmlyb25tZW50KHthcHA6IHRoaXN9KTtcbiAgfVxuXG4gIGdldCBlbnZpcm9ubWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW52aXJvbm1lbnQ7XG4gIH1cblxuICBnZXQgYXBpKCkge1xuICAgIHJldHVybiB0aGlzLl9hcGk7XG4gIH1cblxuICBnZXQgeWFyZ3MoKSB7XG4gICAgcmV0dXJuIHlhcmdzO1xuICB9XG5cbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMueWFyZ3MuYXJndjtcbiAgfVxuXG4gIGFwcFBhdGgobmFtZSkge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5fYXBwUGF0aCwgbmFtZSk7XG4gIH1cblxuICBhcHBEaXIobmFtZSkge1xuICAgIHJldHVybiB0aGlzLmFwcFBhdGgobmFtZSk7XG4gIH1cblxuICBwYXRoKG5hbWUpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuX2hvbWVQYXRoLCBuYW1lKTtcbiAgfVxuXG4gIGRpcihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aChuYW1lKTtcbiAgfVxuXG4gIG1rZGlycChuYW1lKSB7XG4gICAgbWtkaXJwLnN5bmModGhpcy5wYXRoKG5hbWUpKTtcbiAgfVxuXG4gIGdldCBwbHVnaW5QYXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9wbHVnaW5QYXRoO1xuICB9XG5cbiAgZ2V0IGRhdGFQYXRoKCkge1xuICAgIHJldHVybiB0aGlzLl9kYXRhUGF0aDtcbiAgfVxuXG4gIGdldCBkYXRhYmFzZUZpbGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kYXRhUGF0aCwgJ2Z1bGNydW0uZGInKTtcbiAgfVxuXG4gIGdldCBkYigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGI7XG4gIH1cblxuICBvbihuYW1lLCBmdW5jKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXS5wdXNoKGZ1bmMpO1xuICB9XG5cbiAgb2ZmKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGZ1bmMpO1xuXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBlbWl0KG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgICBhd2FpdCBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuX2RiID0gYXdhaXQgZGF0YWJhc2Uoe2ZpbGU6IHRoaXMuZGF0YWJhc2VGaWxlUGF0aH0pO1xuXG4gICAgaWYgKCF0aGlzLmFyZ3Muc2FmZSkge1xuICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUGx1Z2lucygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xuICAgICAgaWYgKHBsdWdpbi5kZWFjdGl2YXRlKSB7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5kZWFjdGl2YXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICBhd2FpdCB0aGlzLl9kYi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemVQbHVnaW5zKCkge1xuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbih0aGlzLnBsdWdpblBhdGgsICcqJykpO1xuXG4gICAgZm9yIChjb25zdCBwbHVnaW5QYXRoIG9mIHBsdWdpblBhdGhzKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGgucmVzb2x2ZShwbHVnaW5QYXRoKTtcblxuICAgICAgY29uc3QgbG9nZ2VyID0gcGx1Z2luTG9nZ2VyKHBsdWdpblBhdGgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwbHVnaW5Nb2R1bGUgPSByZXF1aXJlKGZ1bGxQYXRoKTtcblxuICAgICAgICBjb25zdCBQbHVnaW5DbGFzcyA9IHBsdWdpbk1vZHVsZS5kZWZhdWx0IHx8IHBsdWdpbk1vZHVsZTtcblxuICAgICAgICBjb25zdCBwbHVnaW4gPSBuZXcgUGx1Z2luQ2xhc3MoKTtcblxuICAgICAgICBjb25zdCBuYW1lUGFydHMgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpLnNwbGl0KHBhdGguc2VwKTtcbiAgICAgICAgY29uc3QgbmFtZSA9IG5hbWVQYXJ0c1tuYW1lUGFydHMubGVuZ3RoIC0gMV0ucmVwbGFjZSgvXmZ1bGNydW0tZGVza3RvcC0vLCAnJyk7XG5cbiAgICAgICAgdGhpcy5fcGx1Z2luc0J5TmFtZVtuYW1lXSA9IHBsdWdpbjtcbiAgICAgICAgdGhpcy5fcGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICAgICAgaWYgKHRoaXMuYXJncy5kZWJ1Zykge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcignTG9hZGluZyBwbHVnaW4nLCBmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignRmFpbGVkIHRvIGxvYWQgcGx1Z2luJywgZXgpO1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ1RoaXMgaXMgbW9zdCBsaWtlbHkgYW4gZXJyb3IgaW4gdGhlIHBsdWdpbi4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZVBsdWdpbnMoKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xuICAgICAgYXdhaXQgcGx1Z2luLmFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHdoZXJlLm9yZ2FuaXphdGlvbl9uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQuZmluZEFsbCh0aGlzLmRiLCB3aGVyZSk7XG5cbiAgICByZXR1cm4gYWNjb3VudHNbMF07XG4gIH1cblxuICBhc3luYyBjcmVhdGVEYXRhU291cmNlKGFjY291bnQpIHtcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XG5cbiAgICBjb25zdCBsb2NhbERhdGFiYXNlID0gbmV3IExvY2FsRGF0YWJhc2VEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XG5cbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxufVxuXG5hcHAgPSBuZXcgQXBwKCk7XG5cbkVudmlyb25tZW50LmFwcCA9IGFwcDtcblxuZ2xvYmFsLl9fYXBwX18gPSBhcHA7XG5nbG9iYWwuX19hcGlfXyA9IGFwaTtcbmdsb2JhbC5mdWxjcnVtID0gYXBwLmVudmlyb25tZW50O1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iXX0=