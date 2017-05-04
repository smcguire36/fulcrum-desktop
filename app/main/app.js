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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwiX2FwcERpcmVjdG9yeSIsInVzZXJEYXRhIiwiX2RvdERpcmVjdG9yeSIsImpvaW4iLCJob21lZGlyIiwic3luYyIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJhcmdzIiwiYXJndiIsImFwcERpciIsImRpciIsIm1rZGlycCIsIm5hbWUiLCJkYXRhYmFzZUZpbGVQYXRoIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJwbHVnaW5QYXRoIiwiZnVsbFBhdGgiLCJyZXNvbHZlIiwibG9nZ2VyIiwicGx1Z2luTW9kdWxlIiwicmVxdWlyZSIsIlBsdWdpbkNsYXNzIiwiZGVmYXVsdCIsIm5hbWVQYXJ0cyIsImRpcm5hbWUiLCJzcGxpdCIsInNlcCIsImxlbmd0aCIsInJlcGxhY2UiLCJkZWJ1ZyIsImVycm9yIiwiZXgiLCJhY3RpdmF0ZVBsdWdpbnMiLCJhY3RpdmF0ZSIsImZldGNoQWNjb3VudCIsIndoZXJlIiwib3JnYW5pemF0aW9uX25hbWUiLCJhY2NvdW50cyIsImZpbmRBbGwiLCJjcmVhdGVEYXRhU291cmNlIiwiYWNjb3VudCIsImRhdGFTb3VyY2UiLCJsb2NhbERhdGFiYXNlIiwiYWRkIiwibG9hZCIsImdsb2JhbCIsIl9fYXBwX18iLCJfX2FwaV9fIiwiZnVsY3J1bSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFD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QyxhQUFhLDZCQUFqQjs7QUFFQSxZQUFNQyxnQkFBZ0Isc0NBQTRCRixPQUE1QixDQUF0Qjs7QUFFQUMsaUJBQVdFLEdBQVgsQ0FBZUQsYUFBZjs7QUFFQSxZQUFNQSxjQUFjRSxJQUFkLENBQW1CLE9BQUtqRCxFQUF4QixDQUFOOztBQUVBLGFBQU84QyxVQUFQO0FBVDhCO0FBVS9CO0FBcEtPOztBQXVLVnZFLE1BQU0sSUFBSUMsR0FBSixFQUFOOztBQUVBLHNCQUFZRCxHQUFaLEdBQWtCQSxHQUFsQjs7QUFFQTJFLE9BQU9DLE9BQVAsR0FBaUI1RSxHQUFqQjtBQUNBMkUsT0FBT0UsT0FBUDtBQUNBRixPQUFPRyxPQUFQLEdBQWlCOUUsSUFBSWUsV0FBckI7O2tCQUVlZixHIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeWFyZ3MgZnJvbSAneWFyZ3MnO1xuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBkYXRhYmFzZSBmcm9tICcuL2RiL2RhdGFiYXNlJztcbmltcG9ydCBhcGkgZnJvbSAnLi9hcGknO1xuaW1wb3J0IEVudmlyb25tZW50IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnLi9tb2RlbHMvYWNjb3VudCc7XG5pbXBvcnQgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UgZnJvbSAnLi9sb2NhbC1kYXRhYmFzZS1kYXRhLXNvdXJjZSc7XG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBwYXRocyBmcm9tICcuLi9hcHBsaWNhdGlvbi1wYXRocyc7XG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4vcGx1Z2luLWxvZ2dlcic7XG5cbmxldCBhcHAgPSBudWxsO1xuXG5jbGFzcyBBcHAge1xuICBzdGF0aWMgZ2V0IGluc3RhbmNlKCkge1xuICAgIHJldHVybiBhcHA7XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9wbHVnaW5zID0gW107XG4gICAgdGhpcy5fcGx1Z2luc0J5TmFtZSA9IFtdO1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuX2FwaSA9IGFwaTtcblxuICAgIHRoaXMuX2FwcERpcmVjdG9yeSA9IHBhdGhzLnVzZXJEYXRhO1xuICAgIHRoaXMuX2RvdERpcmVjdG9yeSA9IHBhdGguam9pbihvcy5ob21lZGlyKCksICcuZnVsY3J1bScpO1xuXG4gICAgbWtkaXJwLnN5bmModGhpcy5fYXBwRGlyZWN0b3J5KTtcbiAgICBta2RpcnAuc3luYyh0aGlzLl9kb3REaXJlY3RvcnkpO1xuXG4gICAgbWtkaXJwLnN5bmMocGF0aC5qb2luKHRoaXMuX2FwcERpcmVjdG9yeSwgJ2RhdGEnKSk7XG4gICAgbWtkaXJwLnN5bmMocGF0aC5qb2luKHRoaXMuX2RvdERpcmVjdG9yeSwgJ3BsdWdpbnMnKSk7XG5cbiAgICB0aGlzLl9lbnZpcm9ubWVudCA9IG5ldyBFbnZpcm9ubWVudCh7YXBwOiB0aGlzfSk7XG4gIH1cblxuICBnZXQgZW52aXJvbm1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Vudmlyb25tZW50O1xuICB9XG5cbiAgZ2V0IGFwaSgpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBpO1xuICB9XG5cbiAgZ2V0IHlhcmdzKCkge1xuICAgIHJldHVybiB5YXJncztcbiAgfVxuXG4gIGdldCBhcmdzKCkge1xuICAgIHJldHVybiB0aGlzLnlhcmdzLmFyZ3Y7XG4gIH1cblxuICBhcHBEaXIoZGlyKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLl9hcHBEaXJlY3RvcnksIGRpcik7XG4gIH1cblxuICBkaXIoZGlyKSB7XG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLl9kb3REaXJlY3RvcnksIGRpcik7XG4gIH1cblxuICBta2RpcnAobmFtZSkge1xuICAgIG1rZGlycC5zeW5jKHRoaXMuZGlyKG5hbWUpKTtcbiAgfVxuXG4gIGdldCBkYXRhYmFzZUZpbGVQYXRoKCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5hcHBEaXIoJ2RhdGEnKSwgJ2Z1bGNydW0uZGInKTtcbiAgfVxuXG4gIGdldCBkYigpIHtcbiAgICByZXR1cm4gdGhpcy5fZGI7XG4gIH1cblxuICBvbihuYW1lLCBmdW5jKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuX2xpc3RlbmVyc1tuYW1lXS5wdXNoKGZ1bmMpO1xuICB9XG5cbiAgb2ZmKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2xpc3RlbmVycy5pbmRleE9mKGZ1bmMpO1xuXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBlbWl0KG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIHRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgICBhd2FpdCBsaXN0ZW5lciguLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuX2RiID0gYXdhaXQgZGF0YWJhc2Uoe2ZpbGU6IHRoaXMuZGF0YWJhc2VGaWxlUGF0aH0pO1xuXG4gICAgaWYgKCF0aGlzLmFyZ3Muc2FmZSkge1xuICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUGx1Z2lucygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xuICAgICAgaWYgKHBsdWdpbi5kZWFjdGl2YXRlKSB7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5kZWFjdGl2YXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICBhd2FpdCB0aGlzLl9kYi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemVQbHVnaW5zKCkge1xuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbih0aGlzLmRpcigncGx1Z2lucycpLCAnKicpKTtcblxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XG5cbiAgICAgIGNvbnN0IGxvZ2dlciA9IHBsdWdpbkxvZ2dlcihwbHVnaW5QYXRoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGx1Z2luTW9kdWxlID0gcmVxdWlyZShmdWxsUGF0aCk7XG5cbiAgICAgICAgY29uc3QgUGx1Z2luQ2xhc3MgPSBwbHVnaW5Nb2R1bGUuZGVmYXVsdCB8fCBwbHVnaW5Nb2R1bGU7XG5cbiAgICAgICAgY29uc3QgcGx1Z2luID0gbmV3IFBsdWdpbkNsYXNzKCk7XG5cbiAgICAgICAgY29uc3QgbmFtZVBhcnRzID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKS5zcGxpdChwYXRoLnNlcCk7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuYW1lUGFydHNbbmFtZVBhcnRzLmxlbmd0aCAtIDFdLnJlcGxhY2UoL15mdWxjcnVtLWRlc2t0b3AtLywgJycpO1xuXG4gICAgICAgIHRoaXMuX3BsdWdpbnNCeU5hbWVbbmFtZV0gPSBwbHVnaW47XG4gICAgICAgIHRoaXMuX3BsdWdpbnMucHVzaChwbHVnaW4pO1xuXG4gICAgICAgIGlmICh0aGlzLmFyZ3MuZGVidWcpIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoJ0xvYWRpbmcgcGx1Z2luJywgZnVsbFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHBsdWdpbicsIGV4KTtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdUaGlzIGlzIG1vc3QgbGlrZWx5IGFuIGVycm9yIGluIHRoZSBwbHVnaW4uJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgYWN0aXZhdGVQbHVnaW5zKCkge1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuX3BsdWdpbnMpIHtcbiAgICAgIGF3YWl0IHBsdWdpbi5hY3RpdmF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZldGNoQWNjb3VudChuYW1lKSB7XG4gICAgY29uc3Qgd2hlcmUgPSB7fTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICB3aGVyZS5vcmdhbml6YXRpb25fbmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LmZpbmRBbGwodGhpcy5kYiwgd2hlcmUpO1xuXG4gICAgcmV0dXJuIGFjY291bnRzWzBdO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlRGF0YVNvdXJjZShhY2NvdW50KSB7XG4gICAgbGV0IGRhdGFTb3VyY2UgPSBuZXcgRGF0YVNvdXJjZSgpO1xuXG4gICAgY29uc3QgbG9jYWxEYXRhYmFzZSA9IG5ldyBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZShhY2NvdW50KTtcblxuICAgIGRhdGFTb3VyY2UuYWRkKGxvY2FsRGF0YWJhc2UpO1xuXG4gICAgYXdhaXQgbG9jYWxEYXRhYmFzZS5sb2FkKHRoaXMuZGIpO1xuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2U7XG4gIH1cbn1cblxuYXBwID0gbmV3IEFwcCgpO1xuXG5FbnZpcm9ubWVudC5hcHAgPSBhcHA7XG5cbmdsb2JhbC5fX2FwcF9fID0gYXBwO1xuZ2xvYmFsLl9fYXBpX18gPSBhcGk7XG5nbG9iYWwuZnVsY3J1bSA9IGFwcC5lbnZpcm9ubWVudDtcblxuZXhwb3J0IGRlZmF1bHQgYXBwO1xuIl19