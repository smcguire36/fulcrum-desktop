'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

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

var _buildPlugins = require('./build-plugins');

var _buildPlugins2 = _interopRequireDefault(_buildPlugins);

var _watchPlugins = require('./watch-plugins');

var _watchPlugins2 = _interopRequireDefault(_watchPlugins);

var _sync = require('./sync');

var _sync2 = _interopRequireDefault(_sync);

var _query = require('./query');

var _query2 = _interopRequireDefault(_query);

var _reset = require('./reset');

var _reset2 = _interopRequireDefault(_reset);

var _console = require('./console');

var _console2 = _interopRequireDefault(_console);

var _version = require('../../version');

var _version2 = _interopRequireDefault(_version);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_yargs2.default.$0 = 'fulcrum';

require('source-map-support').install();

const COMMANDS = [_setup2.default, _sync2.default, _reset2.default, _installPlugin2.default, _createPlugin2.default, _updatePlugins2.default, _buildPlugins2.default, _watchPlugins2.default, _query2.default, _console2.default];

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

      if (_this.args.colors === false) {
        _colors2.default.enabled = false;
      }

      if (_this.args.debugsql) {
        _minidb.Database.debug = true;
      }

      if (_this.args.debug) {
        console.log(_this.args);
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

      const completion = new Promise(function (resolve, reject) {
        promiseResolve = resolve;
        promiseReject = reject;
      });

      // cli = await this.addDefault(this.wrapAsync(cli, promiseResolve, promiseReject));

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

      _this3.argv = cli.demandCommand().version(_version2.default.version).help().argv;

      yield completion;
    })();
  }

  // addDefault = async (cli) => {
  //   return cli.command({
  //     command: 'yoyo',
  //     desc: 'yyo',
  //     builder: {},
  //     handler: this.runDefaultCommand
  //   });
  // }

  // runDefaultCommand = async () => {
  // }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return this.app.yargs;
  }

  get args() {
    return this.app.yargs.argv;
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
      // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
      process.on('SIGINT', function () {
        process.exit();
      });

      try {
        yield _this6.setup();
        yield _this6.run();
        yield _this6.destroy();
      } catch (err) {
        console.error(err.stack);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJDTEkiLCJ3cmFwQXN5bmMiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiY29sb3JzIiwiZW5hYmxlZCIsImRlYnVnc3FsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwiaW5pdGlhbGl6ZSIsImRlc3Ryb3kiLCJkaXNwb3NlIiwicnVuIiwiY2xpIiwieWFyZ3MiLCJ1c2FnZSIsInByb21pc2VSZXNvbHZlIiwicHJvbWlzZVJlamVjdCIsImNvbXBsZXRpb24iLCJQcm9taXNlIiwiQ29tbWFuZENsYXNzIiwiY29tbWFuZENsaSIsInRhc2siLCJwbHVnaW4iLCJfcGx1Z2lucyIsInBsdWdpbkNvbW1hbmQiLCJhcmd2IiwiZGVtYW5kQ29tbWFuZCIsInZlcnNpb24iLCJoZWxwIiwiZGIiLCJmZXRjaEFjY291bnQiLCJuYW1lIiwid2hlcmUiLCJvcmdhbml6YXRpb25fbmFtZSIsImFjY291bnRzIiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsImxvY2FsRGF0YWJhc2UiLCJhZGQiLCJsb2FkIiwic3RhcnQiLCJwcm9jZXNzIiwib24iLCJleGl0IiwiZXJyIiwiZXJyb3IiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsZ0JBQU1BLEVBQU4sR0FBVyxT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RUFBcUIsWUFBVztBQUM5QkQsZ0JBQVFFLElBQVI7QUFDRCxPQUZEOztBQUlBLFVBQUk7QUFDRixjQUFNLE9BQUs3QyxLQUFMLEVBQU47QUFDQSxjQUFNLE9BQUtXLEdBQUwsRUFBTjtBQUNBLGNBQU0sT0FBS0YsT0FBTCxFQUFOO0FBQ0QsT0FKRCxDQUlFLE9BQU9xQyxHQUFQLEVBQVk7QUFDWnhDLGdCQUFReUMsS0FBUixDQUFjRCxJQUFJRSxLQUFsQjtBQUNBLGNBQU0sT0FBS3ZDLE9BQUwsRUFBTjtBQUNEOztBQUVEO0FBQ0FrQyxjQUFRRSxJQUFSO0FBaEJZO0FBaUJiOztBQUVEO0FBMUl1Qjs7a0JBQUoxRCxHO0FBa0tyQixJQUFJQSxHQUFKLEdBQVV1RCxLQUFWLEdBQWtCNUMsSUFBbEIsQ0FBdUIsTUFBTSxDQUM1QixDQURELEVBQ0dDLEtBREgsQ0FDVStDLEdBQUQsSUFBUztBQUNoQnhDLFVBQVF5QyxLQUFSLENBQWNELEdBQWQ7QUFDRCxDQUhEIiwiZmlsZSI6ImNsaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJztcclxuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi4vbW9kZWxzL2FjY291bnQnO1xyXG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcclxuaW1wb3J0IExvY2FsRGF0YWJhc2VEYXRhU291cmNlIGZyb20gJy4uL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcclxuaW1wb3J0IGFwcCBmcm9tICcuLi9hcHAnO1xyXG5cclxuaW1wb3J0IFNldHVwIGZyb20gJy4vc2V0dXAnO1xyXG5pbXBvcnQgSW5zdGFsbFBsdWdpbiBmcm9tICcuL2luc3RhbGwtcGx1Z2luJztcclxuaW1wb3J0IENyZWF0ZVBsdWdpbiBmcm9tICcuL2NyZWF0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgVXBkYXRlUGx1Z2lucyBmcm9tICcuL3VwZGF0ZS1wbHVnaW5zJztcclxuaW1wb3J0IEJ1aWxkUGx1Z2lucyBmcm9tICcuL2J1aWxkLXBsdWdpbnMnO1xyXG5pbXBvcnQgV2F0Y2hQbHVnaW5zIGZyb20gJy4vd2F0Y2gtcGx1Z2lucyc7XHJcbmltcG9ydCBTeW5jIGZyb20gJy4vc3luYyc7XHJcbmltcG9ydCBRdWVyeSBmcm9tICcuL3F1ZXJ5JztcclxuaW1wb3J0IFJlc2V0IGZyb20gJy4vcmVzZXQnO1xyXG5pbXBvcnQgQ29uc29sZSBmcm9tICcuL2NvbnNvbGUnO1xyXG5pbXBvcnQgZnVsY3J1bVBhY2thZ2UgZnJvbSAnLi4vLi4vdmVyc2lvbic7XHJcblxyXG5pbXBvcnQgeyBEYXRhYmFzZSB9IGZyb20gJ21pbmlkYic7XHJcblxyXG55YXJncy4kMCA9ICdmdWxjcnVtJztcclxuXHJcbnJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcclxuXHJcbmNvbnN0IENPTU1BTkRTID0gW1xyXG4gIFNldHVwLFxyXG4gIFN5bmMsXHJcbiAgUmVzZXQsXHJcbiAgSW5zdGFsbFBsdWdpbixcclxuICBDcmVhdGVQbHVnaW4sXHJcbiAgVXBkYXRlUGx1Z2lucyxcclxuICBCdWlsZFBsdWdpbnMsXHJcbiAgV2F0Y2hQbHVnaW5zLFxyXG4gIFF1ZXJ5LFxyXG4gIENvbnNvbGVcclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENMSSB7XHJcbiAgYXN5bmMgc2V0dXAoKSB7XHJcbiAgICB0aGlzLmFwcCA9IGFwcDtcclxuXHJcbiAgICBpZiAodGhpcy5hcmdzLmNvbG9ycyA9PT0gZmFsc2UpIHtcclxuICAgICAgY29sb3JzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcmdzLmRlYnVnc3FsKSB7XHJcbiAgICAgIERhdGFiYXNlLmRlYnVnID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hcmdzLmRlYnVnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgdGhpcy5hcHAuaW5pdGlhbGl6ZSgpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZGVzdHJveSgpIHtcclxuICAgIGF3YWl0IHRoaXMuYXBwLmRpc3Bvc2UoKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJ1bigpIHtcclxuICAgIGxldCBjbGkgPSB0aGlzLnlhcmdzLnVzYWdlKCdVc2FnZTogZnVsY3J1bSA8Y21kPiBbYXJnc10nKTtcclxuXHJcbiAgICBjbGkuJDAgPSAnZnVsY3J1bSc7XHJcblxyXG4gICAgLy8gdGhpcyBpcyBzb21lIGhhY2tzIHRvIGNvb3JkaW5hdGUgdGhlIHlhcmdzIGhhbmRsZXIgZnVuY3Rpb24gd2l0aCB0aGlzIGFzeW5jIGZ1bmN0aW9uLlxyXG4gICAgLy8gaWYgeWFyZ3MgYWRkcyBzdXBwb3J0IGZvciBwcm9taXNlcyBpbiB0aGUgY29tbWFuZCBoYW5kbGVycyB0aGlzIGNhbiBnbyBhd2F5LlxyXG4gICAgbGV0IHByb21pc2VSZXNvbHZlID0gbnVsbDtcclxuICAgIGxldCBwcm9taXNlUmVqZWN0ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdCBjb21wbGV0aW9uID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBwcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgIHByb21pc2VSZWplY3QgPSByZWplY3Q7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBjbGkgPSBhd2FpdCB0aGlzLmFkZERlZmF1bHQodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xyXG5cclxuICAgIGZvciAoY29uc3QgQ29tbWFuZENsYXNzIG9mIENPTU1BTkRTKSB7XHJcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgQ29tbWFuZENsYXNzKCk7XHJcblxyXG4gICAgICBjb21tYW5kLmFwcCA9IHRoaXMuYXBwO1xyXG5cclxuICAgICAgY29uc3QgY29tbWFuZENsaSA9IGF3YWl0IGNvbW1hbmQudGFzayh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XHJcblxyXG4gICAgICBpZiAoY29tbWFuZENsaSkge1xyXG4gICAgICAgIGNsaSA9IGNvbW1hbmRDbGk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLmFwcC5fcGx1Z2lucykge1xyXG4gICAgICBpZiAocGx1Z2luLnRhc2spIHtcclxuICAgICAgICBjb25zdCBwbHVnaW5Db21tYW5kID0gYXdhaXQgcGx1Z2luLnRhc2sodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xyXG5cclxuICAgICAgICBpZiAocGx1Z2luQ29tbWFuZCkge1xyXG4gICAgICAgICAgY2xpID0gcGx1Z2luQ29tbWFuZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFyZ3YgPVxyXG4gICAgICBjbGkuZGVtYW5kQ29tbWFuZCgpXHJcbiAgICAgICAgIC52ZXJzaW9uKGZ1bGNydW1QYWNrYWdlLnZlcnNpb24pXHJcbiAgICAgICAgIC5oZWxwKClcclxuICAgICAgICAgLmFyZ3Y7XHJcblxyXG4gICAgYXdhaXQgY29tcGxldGlvbjtcclxuICB9XHJcblxyXG4gIC8vIGFkZERlZmF1bHQgPSBhc3luYyAoY2xpKSA9PiB7XHJcbiAgLy8gICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gIC8vICAgICBjb21tYW5kOiAneW95bycsXHJcbiAgLy8gICAgIGRlc2M6ICd5eW8nLFxyXG4gIC8vICAgICBidWlsZGVyOiB7fSxcclxuICAvLyAgICAgaGFuZGxlcjogdGhpcy5ydW5EZWZhdWx0Q29tbWFuZFxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfVxyXG5cclxuICAvLyBydW5EZWZhdWx0Q29tbWFuZCA9IGFzeW5jICgpID0+IHtcclxuICAvLyB9XHJcblxyXG4gIGdldCBkYigpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcC5kYjtcclxuICB9XHJcblxyXG4gIGdldCB5YXJncygpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcC55YXJncztcclxuICB9XHJcblxyXG4gIGdldCBhcmdzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYXBwLnlhcmdzLmFyZ3Y7XHJcbiAgfVxyXG5cclxuICBhc3luYyBmZXRjaEFjY291bnQobmFtZSkge1xyXG4gICAgY29uc3Qgd2hlcmUgPSB7fTtcclxuXHJcbiAgICBpZiAobmFtZSkge1xyXG4gICAgICB3aGVyZS5vcmdhbml6YXRpb25fbmFtZSA9IG5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LmZpbmRBbGwodGhpcy5kYiwgd2hlcmUpO1xyXG5cclxuICAgIHJldHVybiBhY2NvdW50cztcclxuICB9XHJcblxyXG4gIGFzeW5jIGNyZWF0ZURhdGFTb3VyY2UoYWNjb3VudCkge1xyXG4gICAgbGV0IGRhdGFTb3VyY2UgPSBuZXcgRGF0YVNvdXJjZSgpO1xyXG5cclxuICAgIGNvbnN0IGxvY2FsRGF0YWJhc2UgPSBuZXcgTG9jYWxEYXRhYmFzZURhdGFTb3VyY2UoYWNjb3VudCk7XHJcblxyXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XHJcblxyXG4gICAgYXdhaXQgbG9jYWxEYXRhYmFzZS5sb2FkKHRoaXMuZGIpO1xyXG5cclxuICAgIHJldHVybiBkYXRhU291cmNlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAvLyBUT0RPKHpobSkgcmVxdWlyZWQgb3IgaXQgaGFuZ3MgZm9yIH4zMHNlYyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzQ5NDRcclxuICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBwcm9jZXNzLmV4aXQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuc2V0dXAoKTtcclxuICAgICAgYXdhaXQgdGhpcy5ydW4oKTtcclxuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xyXG4gICAgICBhd2FpdCB0aGlzLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPKHpobSkgcmVxdWlyZWQgb3IgaXQgaGFuZ3MgZm9yIH4zMHNlYyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzQ5NDRcclxuICAgIHByb2Nlc3MuZXhpdCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gdGhpcyBoYWNrcyB0aGUgeWFyZ3MgY29tbWFuZCBoYW5kbGVyIHRvIGFsbG93IGl0IHRvIHJldHVybiBhIHByb21pc2UgKGFzeW5jIGZ1bmN0aW9uKVxyXG4gIHdyYXBBc3luYyA9IChvYmosIHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3QgX19jb21tYW5kID0gb2JqLmNvbW1hbmQuYmluZChvYmopO1xyXG5cclxuICAgIG9iai5jb21tYW5kID0gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgaWYgKGFyZ3MgJiYgYXJnc1swXSAmJiBhcmdzWzBdLmhhbmRsZXIpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGVyID0gYXJnc1swXS5oYW5kbGVyO1xyXG5cclxuICAgICAgICBhcmdzWzBdLmhhbmRsZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBoYW5kbGVyKCk7XHJcblxyXG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQudGhlbikge1xyXG4gICAgICAgICAgICByZXN1bHQudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBfX2NvbW1hbmQoLi4uYXJncyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBvYmo7XHJcbiAgfVxyXG59XHJcblxyXG5uZXcgQ0xJKCkuc3RhcnQoKS50aGVuKCgpID0+IHtcclxufSkuY2F0Y2goKGVycikgPT4ge1xyXG4gIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxufSk7XHJcbiJdfQ==