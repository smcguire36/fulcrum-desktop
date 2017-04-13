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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let app = null;

class App extends _events2.default {
  static get instance() {
    return app;
  }

  constructor() {
    super();

    this._plugins = [];
  }

  initialize() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.initializePlugins();
    })();
  }

  initializePlugins() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join('.', 'plugins', '*.js'));

      for (const pluginPath of pluginPaths) {
        const fullPath = _path2.default.resolve(pluginPath);

        console.log('Loading plugin', fullPath);

        const PluginClass = require(fullPath).default;

        const plugin = new PluginClass();

        yield plugin.initialize({ app: _this2 });

        _this2._plugins.push(plugin);
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