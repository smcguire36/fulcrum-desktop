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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJDTEkiLCJ3cmFwQXN5bmMiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiY29sb3JzIiwiZW5hYmxlZCIsImRlYnVnc3FsIiwiZGVidWciLCJjb25zb2xlIiwibG9nIiwiaW5pdGlhbGl6ZSIsImRlc3Ryb3kiLCJkaXNwb3NlIiwicnVuIiwiY2xpIiwieWFyZ3MiLCJ1c2FnZSIsInByb21pc2VSZXNvbHZlIiwicHJvbWlzZVJlamVjdCIsImNvbXBsZXRpb24iLCJQcm9taXNlIiwiQ29tbWFuZENsYXNzIiwiY29tbWFuZENsaSIsInRhc2siLCJwbHVnaW4iLCJfcGx1Z2lucyIsInBsdWdpbkNvbW1hbmQiLCJhcmd2IiwiZGVtYW5kQ29tbWFuZCIsInZlcnNpb24iLCJoZWxwIiwiZGIiLCJmZXRjaEFjY291bnQiLCJuYW1lIiwid2hlcmUiLCJvcmdhbml6YXRpb25fbmFtZSIsImFjY291bnRzIiwiZmluZEFsbCIsImNyZWF0ZURhdGFTb3VyY2UiLCJhY2NvdW50IiwiZGF0YVNvdXJjZSIsImxvY2FsRGF0YWJhc2UiLCJhZGQiLCJsb2FkIiwic3RhcnQiLCJwcm9jZXNzIiwib24iLCJleGl0IiwiZXJyIiwiZXJyb3IiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsZ0JBQU1BLEVBQU4sR0FBVyxT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RUFBcUIsWUFBVztBQUM5QkQsZ0JBQVFFLElBQVI7QUFDRCxPQUZEOztBQUlBLFVBQUk7QUFDRixjQUFNLE9BQUs3QyxLQUFMLEVBQU47QUFDQSxjQUFNLE9BQUtXLEdBQUwsRUFBTjtBQUNBLGNBQU0sT0FBS0YsT0FBTCxFQUFOO0FBQ0QsT0FKRCxDQUlFLE9BQU9xQyxHQUFQLEVBQVk7QUFDWnhDLGdCQUFReUMsS0FBUixDQUFjRCxJQUFJRSxLQUFsQjtBQUNBLGNBQU0sT0FBS3ZDLE9BQUwsRUFBTjtBQUNEOztBQUVEO0FBQ0FrQyxjQUFRRSxJQUFSO0FBaEJZO0FBaUJiOztBQUVEO0FBMUl1Qjs7a0JBQUoxRCxHO0FBa0tyQixJQUFJQSxHQUFKLEdBQVV1RCxLQUFWLEdBQWtCNUMsSUFBbEIsQ0FBdUIsTUFBTSxDQUM1QixDQURELEVBQ0dDLEtBREgsQ0FDVStDLEdBQUQsSUFBUztBQUNoQnhDLFVBQVF5QyxLQUFSLENBQWNELEdBQWQ7QUFDRCxDQUhEIiwiZmlsZSI6ImNsaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb2xvcnMgZnJvbSAnY29sb3JzJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuLi9tb2RlbHMvYWNjb3VudCc7XG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuLi9sb2NhbC1kYXRhYmFzZS1kYXRhLXNvdXJjZSc7XG5pbXBvcnQgYXBwIGZyb20gJy4uL2FwcCc7XG5cbmltcG9ydCBTZXR1cCBmcm9tICcuL3NldHVwJztcbmltcG9ydCBJbnN0YWxsUGx1Z2luIGZyb20gJy4vaW5zdGFsbC1wbHVnaW4nO1xuaW1wb3J0IENyZWF0ZVBsdWdpbiBmcm9tICcuL2NyZWF0ZS1wbHVnaW4nO1xuaW1wb3J0IFVwZGF0ZVBsdWdpbnMgZnJvbSAnLi91cGRhdGUtcGx1Z2lucyc7XG5pbXBvcnQgQnVpbGRQbHVnaW5zIGZyb20gJy4vYnVpbGQtcGx1Z2lucyc7XG5pbXBvcnQgV2F0Y2hQbHVnaW5zIGZyb20gJy4vd2F0Y2gtcGx1Z2lucyc7XG5pbXBvcnQgU3luYyBmcm9tICcuL3N5bmMnO1xuaW1wb3J0IFF1ZXJ5IGZyb20gJy4vcXVlcnknO1xuaW1wb3J0IFJlc2V0IGZyb20gJy4vcmVzZXQnO1xuaW1wb3J0IENvbnNvbGUgZnJvbSAnLi9jb25zb2xlJztcbmltcG9ydCBmdWxjcnVtUGFja2FnZSBmcm9tICcuLi8uLi92ZXJzaW9uJztcblxuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tICdtaW5pZGInO1xuXG55YXJncy4kMCA9ICdmdWxjcnVtJztcblxucmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1xuXG5jb25zdCBDT01NQU5EUyA9IFtcbiAgU2V0dXAsXG4gIFN5bmMsXG4gIFJlc2V0LFxuICBJbnN0YWxsUGx1Z2luLFxuICBDcmVhdGVQbHVnaW4sXG4gIFVwZGF0ZVBsdWdpbnMsXG4gIEJ1aWxkUGx1Z2lucyxcbiAgV2F0Y2hQbHVnaW5zLFxuICBRdWVyeSxcbiAgQ29uc29sZVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0xJIHtcbiAgYXN5bmMgc2V0dXAoKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgICBpZiAodGhpcy5hcmdzLmNvbG9ycyA9PT0gZmFsc2UpIHtcbiAgICAgIGNvbG9ycy5lbmFibGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXJncy5kZWJ1Z3NxbCkge1xuICAgICAgRGF0YWJhc2UuZGVidWcgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFyZ3MuZGVidWcpIHtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuYXJncyk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5hcHAuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgYXN5bmMgZGVzdHJveSgpIHtcbiAgICBhd2FpdCB0aGlzLmFwcC5kaXNwb3NlKCk7XG4gIH1cblxuICBhc3luYyBydW4oKSB7XG4gICAgbGV0IGNsaSA9IHRoaXMueWFyZ3MudXNhZ2UoJ1VzYWdlOiBmdWxjcnVtIDxjbWQ+IFthcmdzXScpO1xuXG4gICAgY2xpLiQwID0gJ2Z1bGNydW0nO1xuXG4gICAgLy8gdGhpcyBpcyBzb21lIGhhY2tzIHRvIGNvb3JkaW5hdGUgdGhlIHlhcmdzIGhhbmRsZXIgZnVuY3Rpb24gd2l0aCB0aGlzIGFzeW5jIGZ1bmN0aW9uLlxuICAgIC8vIGlmIHlhcmdzIGFkZHMgc3VwcG9ydCBmb3IgcHJvbWlzZXMgaW4gdGhlIGNvbW1hbmQgaGFuZGxlcnMgdGhpcyBjYW4gZ28gYXdheS5cbiAgICBsZXQgcHJvbWlzZVJlc29sdmUgPSBudWxsO1xuICAgIGxldCBwcm9taXNlUmVqZWN0ID0gbnVsbDtcblxuICAgIGNvbnN0IGNvbXBsZXRpb24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBwcm9taXNlUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gY2xpID0gYXdhaXQgdGhpcy5hZGREZWZhdWx0KHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgIGZvciAoY29uc3QgQ29tbWFuZENsYXNzIG9mIENPTU1BTkRTKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gbmV3IENvbW1hbmRDbGFzcygpO1xuXG4gICAgICBjb21tYW5kLmFwcCA9IHRoaXMuYXBwO1xuXG4gICAgICBjb25zdCBjb21tYW5kQ2xpID0gYXdhaXQgY29tbWFuZC50YXNrKHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgICAgaWYgKGNvbW1hbmRDbGkpIHtcbiAgICAgICAgY2xpID0gY29tbWFuZENsaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLmFwcC5fcGx1Z2lucykge1xuICAgICAgaWYgKHBsdWdpbi50YXNrKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbkNvbW1hbmQgPSBhd2FpdCBwbHVnaW4udGFzayh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICAgICAgaWYgKHBsdWdpbkNvbW1hbmQpIHtcbiAgICAgICAgICBjbGkgPSBwbHVnaW5Db21tYW5kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcmd2ID1cbiAgICAgIGNsaS5kZW1hbmRDb21tYW5kKClcbiAgICAgICAgIC52ZXJzaW9uKGZ1bGNydW1QYWNrYWdlLnZlcnNpb24pXG4gICAgICAgICAuaGVscCgpXG4gICAgICAgICAuYXJndjtcblxuICAgIGF3YWl0IGNvbXBsZXRpb247XG4gIH1cblxuICAvLyBhZGREZWZhdWx0ID0gYXN5bmMgKGNsaSkgPT4ge1xuICAvLyAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gIC8vICAgICBjb21tYW5kOiAneW95bycsXG4gIC8vICAgICBkZXNjOiAneXlvJyxcbiAgLy8gICAgIGJ1aWxkZXI6IHt9LFxuICAvLyAgICAgaGFuZGxlcjogdGhpcy5ydW5EZWZhdWx0Q29tbWFuZFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gcnVuRGVmYXVsdENvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gIC8vIH1cblxuICBnZXQgZGIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmRiO1xuICB9XG5cbiAgZ2V0IHlhcmdzKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC55YXJncztcbiAgfVxuXG4gIGdldCBhcmdzKCkge1xuICAgIHJldHVybiB0aGlzLmFwcC55YXJncy5hcmd2O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHdoZXJlLm9yZ2FuaXphdGlvbl9uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQuZmluZEFsbCh0aGlzLmRiLCB3aGVyZSk7XG5cbiAgICByZXR1cm4gYWNjb3VudHM7XG4gIH1cblxuICBhc3luYyBjcmVhdGVEYXRhU291cmNlKGFjY291bnQpIHtcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XG5cbiAgICBjb25zdCBsb2NhbERhdGFiYXNlID0gbmV3IExvY2FsRGF0YWJhc2VEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XG5cbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KCkge1xuICAgIC8vIFRPRE8oemhtKSByZXF1aXJlZCBvciBpdCBoYW5ncyBmb3IgfjMwc2VjIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvNDk0NFxuICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5leGl0KCk7XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zZXR1cCgpO1xuICAgICAgYXdhaXQgdGhpcy5ydW4oKTtcbiAgICAgIGF3YWl0IHRoaXMuZGVzdHJveSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyh6aG0pIHJlcXVpcmVkIG9yIGl0IGhhbmdzIGZvciB+MzBzZWMgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy80OTQ0XG4gICAgcHJvY2Vzcy5leGl0KCk7XG4gIH1cblxuICAvLyB0aGlzIGhhY2tzIHRoZSB5YXJncyBjb21tYW5kIGhhbmRsZXIgdG8gYWxsb3cgaXQgdG8gcmV0dXJuIGEgcHJvbWlzZSAoYXN5bmMgZnVuY3Rpb24pXG4gIHdyYXBBc3luYyA9IChvYmosIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IF9fY29tbWFuZCA9IG9iai5jb21tYW5kLmJpbmQob2JqKTtcblxuICAgIG9iai5jb21tYW5kID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzICYmIGFyZ3NbMF0gJiYgYXJnc1swXS5oYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBhcmdzWzBdLmhhbmRsZXI7XG5cbiAgICAgICAgYXJnc1swXS5oYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGhhbmRsZXIoKTtcblxuICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgICAgICAgIHJlc3VsdC50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX19jb21tYW5kKC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm5ldyBDTEkoKS5zdGFydCgpLnRoZW4oKCkgPT4ge1xufSkuY2F0Y2goKGVycikgPT4ge1xuICBjb25zb2xlLmVycm9yKGVycik7XG59KTtcbiJdfQ==