'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _fulcrumCore = require('fulcrum-core');

var _localDatabaseDataSource = require('../local-database-data-source');

var _localDatabaseDataSource2 = _interopRequireDefault(_localDatabaseDataSource);

var _app = require('../app');

var _app2 = _interopRequireDefault(_app);

var _setup = require('./setup');

var _setup2 = _interopRequireDefault(_setup);

var _installPlugin = require('./install-plugin');

var _installPlugin2 = _interopRequireDefault(_installPlugin);

var _createPlugin = require('./create-plugin');

var _createPlugin2 = _interopRequireDefault(_createPlugin);

var _updatePlugins = require('./update-plugins');

var _updatePlugins2 = _interopRequireDefault(_updatePlugins);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _version = require('../../version');

var _version2 = _interopRequireDefault(_version);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bluebird2.default.longStackTraces();

_yargs2.default.$0 = 'fulcrum';

const COMMANDS = [_setup2.default, _sync2.default, _installPlugin2.default, _createPlugin2.default, _updatePlugins2.default, _query2.default];

class CLI {
  constructor() {
    this.wrapAsync = (obj, resolve, reject) => {
      const __command = obj.command.bind(obj);

      obj.command = (...args) => {
        if (args && args[0] && args[0].handler) {
          const handler = args[0].handler;

          args[0].handler = () => {
            const result = handler();

            if (result && result.then) {
              result.then(resolve).catch(reject);
            }
          };
        }

        return __command(...args);
      };

      return obj;
    };
  }

  setup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.app = _app2.default;

      _this._yargs = _yargs2.default.env('FULCRUM');

      if (_this.args.debugsql) {
        _minidb.Database.debug = true;
      }

      yield _this.app.initialize();
    })();
  }

  destroy() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.app.dispose();
    })();
  }

  run() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      let cli = _this3.yargs.usage('Usage: fulcrum <cmd> [args]');

      cli.$0 = 'fulcrum';

      // this is some hacks to coordinate the yargs handler function with this async function.
      // if yargs adds support for promises in the command handlers this can go away.
      let promiseResolve = null;
      let promiseReject = null;

      const completion = new _bluebird2.default(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });

      for (const CommandClass of COMMANDS) {
        const command = new CommandClass();

        command.app = _this3.app;

        const commandCli = yield command.task(_this3.wrapAsync(cli, promiseResolve, promiseReject));

        if (commandCli) {
          cli = commandCli;
        }
      }

      for (const plugin of _this3.app._plugins) {
        if (plugin.task) {
          const pluginCommand = yield plugin.task(_this3.wrapAsync(cli, promiseResolve, promiseReject));

          if (pluginCommand) {
            cli = pluginCommand;
          }
        }
      }

      _this3.argv = cli.command('*', 'help', function (argv) {
        return cli.showHelp();
      }).demandCommand().version(_version2.default.fulcrum).help().argv;

      yield completion;
    })();
  }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return this._yargs;
  }

  get args() {
    return _yargs2.default.argv;
  }

  fetchAccount(name) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const where = {};

      if (name) {
        where.organization_name = name;
      }

      const accounts = yield _account2.default.findAll(_this4.db, where);

      return accounts;
    })();
  }

  createDataSource(account) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      let dataSource = new _fulcrumCore.DataSource();

      const localDatabase = new _localDatabaseDataSource2.default(account);

      dataSource.add(localDatabase);

      yield localDatabase.load(_this5.db);

      return dataSource;
    })();
  }

  start() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      try {
        // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
        process.on('SIGINT', function () {
          process.exit();
        });

        yield _this6.setup();
        yield _this6.run();
        yield _this6.destroy();
      } catch (err) {
        console.error(err.stack);
        // if (this.args.verbose) {
        //   console.error(err.stack);
        // } else {
        //   console.error(err.message);
        // }

        yield _this6.destroy();
      }

      // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
      process.exit();
    })();
  }

  // this hacks the yargs command handler to allow it to return a promise (async function)
}

exports.default = CLI;
new CLI().start().then(() => {}).catch(err => {
  console.error(err);
});
//# sourceMappingURL=cli.js.map