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

var _version = require('../../version');

var _version2 = _interopRequireDefault(_version);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_yargs2.default.$0 = 'fulcrum';

require('source-map-support').install();

const COMMANDS = [_setup2.default, _sync2.default, _reset2.default, _installPlugin2.default, _createPlugin2.default, _updatePlugins2.default, _buildPlugins2.default, _watchPlugins2.default, _query2.default];

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

      if (_this._yargs.argv.colors === false) {
        _colors2.default.enabled = false;
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJDTEkiLCJ3cmFwQXN5bmMiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiX3lhcmdzIiwiZW52IiwiYXJndiIsImNvbG9ycyIsImVuYWJsZWQiLCJkZWJ1Z3NxbCIsImRlYnVnIiwiaW5pdGlhbGl6ZSIsImRlc3Ryb3kiLCJkaXNwb3NlIiwicnVuIiwiY2xpIiwieWFyZ3MiLCJ1c2FnZSIsInByb21pc2VSZXNvbHZlIiwicHJvbWlzZVJlamVjdCIsImNvbXBsZXRpb24iLCJQcm9taXNlIiwiQ29tbWFuZENsYXNzIiwiY29tbWFuZENsaSIsInRhc2siLCJwbHVnaW4iLCJfcGx1Z2lucyIsInBsdWdpbkNvbW1hbmQiLCJkZW1hbmRDb21tYW5kIiwidmVyc2lvbiIsImhlbHAiLCJkYiIsImZldGNoQWNjb3VudCIsIm5hbWUiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwibG9jYWxEYXRhYmFzZSIsImFkZCIsImxvYWQiLCJzdGFydCIsInByb2Nlc3MiLCJvbiIsImV4aXQiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUVBLGdCQUFNQSxFQUFOLEdBQVcs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QUFDRixjQUFNLE9BQUs3QyxLQUFMLEVBQU47QUFDQSxjQUFNLE9BQUtZLEdBQUwsRUFBTjtBQUNBLGNBQU0sT0FBS0YsT0FBTCxFQUFOO0FBQ0QsT0FKRCxDQUlFLE9BQU9vQyxHQUFQLEVBQVk7QUFDWkMsZ0JBQVFDLEtBQVIsQ0FBY0YsSUFBSUcsS0FBbEI7QUFDQSxjQUFNLE9BQUt2QyxPQUFMLEVBQU47QUFDRDs7QUFFRDtBQUNBaUMsY0FBUUUsSUFBUjtBQWhCWTtBQWlCYjs7QUFFRDtBQXhJdUI7O2tCQUFKMUQsRztBQWdLckIsSUFBSUEsR0FBSixHQUFVdUQsS0FBVixHQUFrQjVDLElBQWxCLENBQXVCLE1BQU0sQ0FDNUIsQ0FERCxFQUNHQyxLQURILENBQ1UrQyxHQUFELElBQVM7QUFDaEJDLFVBQVFDLEtBQVIsQ0FBY0YsR0FBZDtBQUNELENBSEQiLCJmaWxlIjoiY2xpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbG9ycyBmcm9tICdjb2xvcnMnO1xuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4uL21vZGVscy9hY2NvdW50JztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IExvY2FsRGF0YWJhc2VEYXRhU291cmNlIGZyb20gJy4uL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCBhcHAgZnJvbSAnLi4vYXBwJztcblxuaW1wb3J0IFNldHVwIGZyb20gJy4vc2V0dXAnO1xuaW1wb3J0IEluc3RhbGxQbHVnaW4gZnJvbSAnLi9pbnN0YWxsLXBsdWdpbic7XG5pbXBvcnQgQ3JlYXRlUGx1Z2luIGZyb20gJy4vY3JlYXRlLXBsdWdpbic7XG5pbXBvcnQgVXBkYXRlUGx1Z2lucyBmcm9tICcuL3VwZGF0ZS1wbHVnaW5zJztcbmltcG9ydCBCdWlsZFBsdWdpbnMgZnJvbSAnLi9idWlsZC1wbHVnaW5zJztcbmltcG9ydCBXYXRjaFBsdWdpbnMgZnJvbSAnLi93YXRjaC1wbHVnaW5zJztcbmltcG9ydCBTeW5jIGZyb20gJy4vc3luYyc7XG5pbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeSc7XG5pbXBvcnQgUmVzZXQgZnJvbSAnLi9yZXNldCc7XG5pbXBvcnQgZnVsY3J1bVBhY2thZ2UgZnJvbSAnLi4vLi4vdmVyc2lvbic7XG5cbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnbWluaWRiJztcblxueWFyZ3MuJDAgPSAnZnVsY3J1bSc7XG5cbnJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcblxuY29uc3QgQ09NTUFORFMgPSBbXG4gIFNldHVwLFxuICBTeW5jLFxuICBSZXNldCxcbiAgSW5zdGFsbFBsdWdpbixcbiAgQ3JlYXRlUGx1Z2luLFxuICBVcGRhdGVQbHVnaW5zLFxuICBCdWlsZFBsdWdpbnMsXG4gIFdhdGNoUGx1Z2lucyxcbiAgUXVlcnlcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENMSSB7XG4gIGFzeW5jIHNldHVwKCkge1xuICAgIHRoaXMuYXBwID0gYXBwO1xuXG4gICAgdGhpcy5feWFyZ3MgPSB5YXJncy5lbnYoJ0ZVTENSVU0nKTtcblxuICAgIGlmICh0aGlzLl95YXJncy5hcmd2LmNvbG9ycyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbG9ycy5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXJncy5kZWJ1Z3NxbCkge1xuICAgICAgRGF0YWJhc2UuZGVidWcgPSB0cnVlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYXBwLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgYXdhaXQgdGhpcy5hcHAuZGlzcG9zZSgpO1xuICB9XG5cbiAgYXN5bmMgcnVuKCkge1xuICAgIGxldCBjbGkgPSB0aGlzLnlhcmdzLnVzYWdlKCdVc2FnZTogZnVsY3J1bSA8Y21kPiBbYXJnc10nKTtcblxuICAgIGNsaS4kMCA9ICdmdWxjcnVtJztcblxuICAgIC8vIHRoaXMgaXMgc29tZSBoYWNrcyB0byBjb29yZGluYXRlIHRoZSB5YXJncyBoYW5kbGVyIGZ1bmN0aW9uIHdpdGggdGhpcyBhc3luYyBmdW5jdGlvbi5cbiAgICAvLyBpZiB5YXJncyBhZGRzIHN1cHBvcnQgZm9yIHByb21pc2VzIGluIHRoZSBjb21tYW5kIGhhbmRsZXJzIHRoaXMgY2FuIGdvIGF3YXkuXG4gICAgbGV0IHByb21pc2VSZXNvbHZlID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZVJlamVjdCA9IG51bGw7XG5cbiAgICBjb25zdCBjb21wbGV0aW9uID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcHJvbWlzZVJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcblxuICAgIC8vIGNsaSA9IGF3YWl0IHRoaXMuYWRkRGVmYXVsdCh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICBmb3IgKGNvbnN0IENvbW1hbmRDbGFzcyBvZiBDT01NQU5EUykge1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDb21tYW5kQ2xhc3MoKTtcblxuICAgICAgY29tbWFuZC5hcHAgPSB0aGlzLmFwcDtcblxuICAgICAgY29uc3QgY29tbWFuZENsaSA9IGF3YWl0IGNvbW1hbmQudGFzayh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICAgIGlmIChjb21tYW5kQ2xpKSB7XG4gICAgICAgIGNsaSA9IGNvbW1hbmRDbGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5hcHAuX3BsdWdpbnMpIHtcbiAgICAgIGlmIChwbHVnaW4udGFzaykge1xuICAgICAgICBjb25zdCBwbHVnaW5Db21tYW5kID0gYXdhaXQgcGx1Z2luLnRhc2sodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgICAgIGlmIChwbHVnaW5Db21tYW5kKSB7XG4gICAgICAgICAgY2xpID0gcGx1Z2luQ29tbWFuZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJndiA9XG4gICAgICBjbGkuZGVtYW5kQ29tbWFuZCgpXG4gICAgICAgICAudmVyc2lvbihmdWxjcnVtUGFja2FnZS52ZXJzaW9uKVxuICAgICAgICAgLmhlbHAoKVxuICAgICAgICAgLmFyZ3Y7XG5cbiAgICBhd2FpdCBjb21wbGV0aW9uO1xuICB9XG5cbiAgLy8gYWRkRGVmYXVsdCA9IGFzeW5jIChjbGkpID0+IHtcbiAgLy8gICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAvLyAgICAgY29tbWFuZDogJ3lveW8nLFxuICAvLyAgICAgZGVzYzogJ3l5bycsXG4gIC8vICAgICBidWlsZGVyOiB7fSxcbiAgLy8gICAgIGhhbmRsZXI6IHRoaXMucnVuRGVmYXVsdENvbW1hbmRcbiAgLy8gICB9KTtcbiAgLy8gfVxuXG4gIC8vIHJ1bkRlZmF1bHRDb21tYW5kID0gYXN5bmMgKCkgPT4ge1xuICAvLyB9XG5cbiAgZ2V0IGRiKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC5kYjtcbiAgfVxuXG4gIGdldCB5YXJncygpIHtcbiAgICByZXR1cm4gdGhpcy5feWFyZ3M7XG4gIH1cblxuICBnZXQgYXJncygpIHtcbiAgICByZXR1cm4geWFyZ3MuYXJndjtcbiAgfVxuXG4gIGFzeW5jIGZldGNoQWNjb3VudChuYW1lKSB7XG4gICAgY29uc3Qgd2hlcmUgPSB7fTtcblxuICAgIGlmIChuYW1lKSB7XG4gICAgICB3aGVyZS5vcmdhbml6YXRpb25fbmFtZSA9IG5hbWU7XG4gICAgfVxuXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCBBY2NvdW50LmZpbmRBbGwodGhpcy5kYiwgd2hlcmUpO1xuXG4gICAgcmV0dXJuIGFjY291bnRzO1xuICB9XG5cbiAgYXN5bmMgY3JlYXRlRGF0YVNvdXJjZShhY2NvdW50KSB7XG4gICAgbGV0IGRhdGFTb3VyY2UgPSBuZXcgRGF0YVNvdXJjZSgpO1xuXG4gICAgY29uc3QgbG9jYWxEYXRhYmFzZSA9IG5ldyBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZShhY2NvdW50KTtcblxuICAgIGRhdGFTb3VyY2UuYWRkKGxvY2FsRGF0YWJhc2UpO1xuXG4gICAgYXdhaXQgbG9jYWxEYXRhYmFzZS5sb2FkKHRoaXMuZGIpO1xuXG4gICAgcmV0dXJuIGRhdGFTb3VyY2U7XG4gIH1cblxuICBhc3luYyBzdGFydCgpIHtcbiAgICAvLyBUT0RPKHpobSkgcmVxdWlyZWQgb3IgaXQgaGFuZ3MgZm9yIH4zMHNlYyBodHRwczovL2dpdGh1Yi5jb20vZWxlY3Ryb24vZWxlY3Ryb24vaXNzdWVzLzQ5NDRcbiAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHByb2Nlc3MuZXhpdCgpO1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuc2V0dXAoKTtcbiAgICAgIGF3YWl0IHRoaXMucnVuKCk7XG4gICAgICBhd2FpdCB0aGlzLmRlc3Ryb3koKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIGF3YWl0IHRoaXMuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8vIFRPRE8oemhtKSByZXF1aXJlZCBvciBpdCBoYW5ncyBmb3IgfjMwc2VjIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvNDk0NFxuICAgIHByb2Nlc3MuZXhpdCgpO1xuICB9XG5cbiAgLy8gdGhpcyBoYWNrcyB0aGUgeWFyZ3MgY29tbWFuZCBoYW5kbGVyIHRvIGFsbG93IGl0IHRvIHJldHVybiBhIHByb21pc2UgKGFzeW5jIGZ1bmN0aW9uKVxuICB3cmFwQXN5bmMgPSAob2JqLCByZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBfX2NvbW1hbmQgPSBvYmouY29tbWFuZC5iaW5kKG9iaik7XG5cbiAgICBvYmouY29tbWFuZCA9ICguLi5hcmdzKSA9PiB7XG4gICAgICBpZiAoYXJncyAmJiBhcmdzWzBdICYmIGFyZ3NbMF0uaGFuZGxlcikge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gYXJnc1swXS5oYW5kbGVyO1xuXG4gICAgICAgIGFyZ3NbMF0uaGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSBoYW5kbGVyKCk7XG5cbiAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7XG4gICAgICAgICAgICByZXN1bHQudGhlbihyZXNvbHZlKS5jYXRjaChyZWplY3QpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9fY29tbWFuZCguLi5hcmdzKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxufVxuXG5uZXcgQ0xJKCkuc3RhcnQoKS50aGVuKCgpID0+IHtcbn0pLmNhdGNoKChlcnIpID0+IHtcbiAgY29uc29sZS5lcnJvcihlcnIpO1xufSk7XG4iXX0=