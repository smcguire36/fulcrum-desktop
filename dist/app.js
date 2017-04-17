'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

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

  initialize({ db }) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.initializePlugins({ db });
    })();
  }

  runTask(command) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const name = command.args._[1];

      const plugin = _this3._pluginsByName[name];

      if (plugin && plugin.runTask) {
        yield plugin.runTask({ app: _this3, yargs: _yargs2.default });
      } else {
        console.error('Plugin named', name, 'not found');
      }
    })();
  }

  initializePlugins({ db }) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join('.', 'plugins', '*', 'plugin.js'));

      for (const pluginPath of pluginPaths) {
        const fullPath = _path2.default.resolve(pluginPath);

        const PluginClass = require(fullPath).default;

        const plugin = new PluginClass({ db });

        const nameParts = _path2.default.dirname(fullPath).split(_path2.default.sep);
        const name = nameParts[nameParts.length - 1];

        _this4._pluginsByName[name] = plugin;
        _this4._plugins.push(plugin);

        // if (plugin.enabled) {
        console.log('Loading plugin', fullPath);

        yield plugin.initialize({ app: _this4 });
        // }
      }
    })();
  }

  // emit(name, ...args) {
  //   this.emit(name, {app: this, ...args[0]});
  // }
}

app = new App();

exports.default = app;
//# sourceMappingURL=app.js.map