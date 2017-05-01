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
    this._rootDirectory = _path2.default.join(_os2.default.homedir(), 'Documents', 'fulcrum-sync');

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
          const name = nameParts[nameParts.length - 1].replace(/^fulcrum-sync-/, '');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwcC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJBcHAiLCJpbnN0YW5jZSIsImNvbnN0cnVjdG9yIiwiX3BsdWdpbnMiLCJfcGx1Z2luc0J5TmFtZSIsIl9saXN0ZW5lcnMiLCJfYXBpIiwiX3Jvb3REaXJlY3RvcnkiLCJqb2luIiwiaG9tZWRpciIsIm1rZGlycCIsIl9lbnZpcm9ubWVudCIsImVudmlyb25tZW50IiwiYXBpIiwieWFyZ3MiLCJhcmdzIiwiYXJndiIsImRpciIsIm5hbWUiLCJzeW5jIiwiZGIiLCJfZGIiLCJvbiIsImZ1bmMiLCJwdXNoIiwib2ZmIiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIiwiZW1pdCIsImxpc3RlbmVyIiwiaW5pdGlhbGl6ZSIsImZpbGUiLCJzYWZlIiwiaW5pdGlhbGl6ZVBsdWdpbnMiLCJkaXNwb3NlIiwicGx1Z2luIiwiZGVhY3RpdmF0ZSIsImNsb3NlIiwicGx1Z2luUGF0aHMiLCJwbHVnaW5QYXRoIiwiZnVsbFBhdGgiLCJyZXNvbHZlIiwicGx1Z2luTW9kdWxlIiwicmVxdWlyZSIsIlBsdWdpbkNsYXNzIiwiZGVmYXVsdCIsIm5hbWVQYXJ0cyIsImRpcm5hbWUiLCJzcGxpdCIsInNlcCIsImxlbmd0aCIsInJlcGxhY2UiLCJkZWJ1ZyIsImNvbnNvbGUiLCJlcnJvciIsImV4IiwiYWN0aXZhdGVQbHVnaW5zIiwiYWN0aXZhdGUiLCJmZXRjaEFjY291bnQiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwibG9jYWxEYXRhYmFzZSIsImFkZCIsImxvYWQiLCJnbG9iYWwiLCJfX2FwcF9fIiwiX19hcGlfXyIsImZ1bGNydW0iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7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ZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGRhdGFiYXNlIGZyb20gJy4vZGIvZGF0YWJhc2UnO1xuaW1wb3J0IGFwaSBmcm9tICcuL2FwaSc7XG5pbXBvcnQgRW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5sZXQgYXBwID0gbnVsbDtcblxuY2xhc3MgQXBwIHtcbiAgc3RhdGljIGdldCBpbnN0YW5jZSgpIHtcbiAgICByZXR1cm4gYXBwO1xuICB9XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fcGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuX3BsdWdpbnNCeU5hbWUgPSBbXTtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLl9hcGkgPSBhcGk7XG5cbiAgICAvLyBUT0RPKHpobSkgdGhpcyBuZWVkcyB0byBiZSBhZGp1c3RlZCBmb3IgV2luZG93cyBhbmQgTGludXhcbiAgICB0aGlzLl9yb290RGlyZWN0b3J5ID0gcGF0aC5qb2luKG9zLmhvbWVkaXIoKSwgJ0RvY3VtZW50cycsICdmdWxjcnVtLXN5bmMnKTtcblxuICAgIHRoaXMubWtkaXJwKCdkYXRhJyk7XG4gICAgdGhpcy5ta2RpcnAoJ3BsdWdpbnMnKTtcbiAgICB0aGlzLm1rZGlycCgnbWVkaWEnKTtcbiAgICB0aGlzLm1rZGlycCgncmVwb3J0cycpO1xuXG4gICAgdGhpcy5fZW52aXJvbm1lbnQgPSBuZXcgRW52aXJvbm1lbnQoe2FwcDogdGhpc30pO1xuICB9XG5cbiAgZ2V0IGVudmlyb25tZW50KCkge1xuICAgIHJldHVybiB0aGlzLl9lbnZpcm9ubWVudDtcbiAgfVxuXG4gIGdldCBhcGkoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FwaTtcbiAgfVxuXG4gIGdldCB5YXJncygpIHtcbiAgICByZXR1cm4geWFyZ3M7XG4gIH1cblxuICBnZXQgYXJncygpIHtcbiAgICByZXR1cm4gdGhpcy55YXJncy5hcmd2O1xuICB9XG5cbiAgZGlyKGRpcikge1xuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5fcm9vdERpcmVjdG9yeSwgZGlyKTtcbiAgfVxuXG4gIG1rZGlycChuYW1lKSB7XG4gICAgbWtkaXJwLnN5bmModGhpcy5kaXIobmFtZSkpO1xuICB9XG5cbiAgZ2V0IGRiKCkge1xuICAgIHJldHVybiB0aGlzLl9kYjtcbiAgfVxuXG4gIG9uKG5hbWUsIGZ1bmMpIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tuYW1lXSkge1xuICAgICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5fbGlzdGVuZXJzW25hbWVdLnB1c2goZnVuYyk7XG4gIH1cblxuICBvZmYobmFtZSwgZnVuYykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdGVuZXJzLmluZGV4T2YoZnVuYyk7XG5cbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIHRoaXMuX2xpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGVtaXQobmFtZSwgLi4uYXJncykge1xuICAgIGlmICh0aGlzLl9saXN0ZW5lcnNbbmFtZV0pIHtcbiAgICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5fbGlzdGVuZXJzW25hbWVdKSB7XG4gICAgICAgIGF3YWl0IGxpc3RlbmVyKC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3QgZmlsZSA9IHBhdGguam9pbih0aGlzLmRpcignZGF0YScpLCAnZnVsY3J1bS5kYicpO1xuXG4gICAgdGhpcy5fZGIgPSBhd2FpdCBkYXRhYmFzZSh7ZmlsZX0pO1xuXG4gICAgaWYgKCF0aGlzLmFyZ3Muc2FmZSkge1xuICAgICAgYXdhaXQgdGhpcy5pbml0aWFsaXplUGx1Z2lucygpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xuICAgICAgaWYgKHBsdWdpbi5kZWFjdGl2YXRlKSB7XG4gICAgICAgIGF3YWl0IHBsdWdpbi5kZWFjdGl2YXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RiKSB7XG4gICAgICBhd2FpdCB0aGlzLl9kYi5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemVQbHVnaW5zKCkge1xuICAgIGNvbnN0IHBsdWdpblBhdGhzID0gZ2xvYi5zeW5jKHBhdGguam9pbih0aGlzLmRpcigncGx1Z2lucycpLCAnKicpKTtcblxuICAgIGZvciAoY29uc3QgcGx1Z2luUGF0aCBvZiBwbHVnaW5QYXRocykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLnJlc29sdmUocGx1Z2luUGF0aCk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbk1vZHVsZSA9IHJlcXVpcmUoZnVsbFBhdGgpO1xuXG4gICAgICAgIGNvbnN0IFBsdWdpbkNsYXNzID0gcGx1Z2luTW9kdWxlLmRlZmF1bHQgfHwgcGx1Z2luTW9kdWxlO1xuXG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IG5ldyBQbHVnaW5DbGFzcygpO1xuXG4gICAgICAgIGNvbnN0IG5hbWVQYXJ0cyA9IHBhdGguZGlybmFtZShmdWxsUGF0aCkuc3BsaXQocGF0aC5zZXApO1xuICAgICAgICBjb25zdCBuYW1lID0gbmFtZVBhcnRzW25hbWVQYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9eZnVsY3J1bS1zeW5jLS8sICcnKTtcblxuICAgICAgICB0aGlzLl9wbHVnaW5zQnlOYW1lW25hbWVdID0gcGx1Z2luO1xuICAgICAgICB0aGlzLl9wbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgICAgICBpZiAodGhpcy5hcmdzLmRlYnVnKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignTG9hZGluZyBwbHVnaW4nLCBmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHBsdWdpbicsIGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZVBsdWdpbnMoKSB7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5fcGx1Z2lucykge1xuICAgICAgYXdhaXQgcGx1Z2luLmFjdGl2YXRlKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHdoZXJlLm9yZ2FuaXphdGlvbl9uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQuZmluZEFsbCh0aGlzLmRiLCB3aGVyZSk7XG5cbiAgICByZXR1cm4gYWNjb3VudHNbMF07XG4gIH1cblxuICBhc3luYyBjcmVhdGVEYXRhU291cmNlKGFjY291bnQpIHtcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XG5cbiAgICBjb25zdCBsb2NhbERhdGFiYXNlID0gbmV3IExvY2FsRGF0YWJhc2VEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XG5cbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxufVxuXG5hcHAgPSBuZXcgQXBwKCk7XG5cbkVudmlyb25tZW50LmFwcCA9IGFwcDtcblxuZ2xvYmFsLl9fYXBwX18gPSBhcHA7XG5nbG9iYWwuX19hcGlfXyA9IGFwaTtcbmdsb2JhbC5mdWxjcnVtID0gYXBwLmVudmlyb25tZW50O1xuXG5leHBvcnQgZGVmYXVsdCBhcHA7XG4iXX0=