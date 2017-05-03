'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

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

var _package = require('../../../package.json');

var _package2 = _interopRequireDefault(_package);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_yargs2.default.$0 = 'fulcrum';

require('source-map-support').install();

const COMMANDS = [_setup2.default, _sync2.default, _installPlugin2.default, _createPlugin2.default, _updatePlugins2.default, _buildPlugins2.default, _watchPlugins2.default, _query2.default];

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

      _this3.argv = cli.demandCommand().version(_package2.default.version).help().argv;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJDTEkiLCJ3cmFwQXN5bmMiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiX3lhcmdzIiwiZW52IiwiZGVidWdzcWwiLCJkZWJ1ZyIsImluaXRpYWxpemUiLCJkZXN0cm95IiwiZGlzcG9zZSIsInJ1biIsImNsaSIsInlhcmdzIiwidXNhZ2UiLCJwcm9taXNlUmVzb2x2ZSIsInByb21pc2VSZWplY3QiLCJjb21wbGV0aW9uIiwiUHJvbWlzZSIsIkNvbW1hbmRDbGFzcyIsImNvbW1hbmRDbGkiLCJ0YXNrIiwicGx1Z2luIiwiX3BsdWdpbnMiLCJwbHVnaW5Db21tYW5kIiwiYXJndiIsImRlbWFuZENvbW1hbmQiLCJ2ZXJzaW9uIiwiaGVscCIsImRiIiwiZmV0Y2hBY2NvdW50IiwibmFtZSIsIndoZXJlIiwib3JnYW5pemF0aW9uX25hbWUiLCJhY2NvdW50cyIsImZpbmRBbGwiLCJjcmVhdGVEYXRhU291cmNlIiwiYWNjb3VudCIsImRhdGFTb3VyY2UiLCJsb2NhbERhdGFiYXNlIiwiYWRkIiwibG9hZCIsInN0YXJ0IiwicHJvY2VzcyIsIm9uIiwiZXhpdCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxnQkFBTUEsRUFBTixHQUFXLFNBQVg7O0FBRUFDLFFBQVEsb0JBQVIsRUFB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QVIsQ0FBY0YsSUFBSUcsS0FBbEI7QUFDQSxjQUFNLE9BQUt4QyxPQUFMLEVBQU47QUFDRDs7QUFFRDtBQUNBa0MsY0FBUUUsSUFBUjtBQWhCWTtBQWlCYjs7QUFFRDtBQXBJdUI7O2tCQUFKeEQsRztBQTRKckIsSUFBSUEsR0FBSixHQUFVcUQsS0FBVixHQUFrQjFDLElBQWxCLENBQXVCLE1BQU0sQ0FDNUIsQ0FERCxFQUNHQyxLQURILENBQ1U2QyxHQUFELElBQVM7QUFDaEJDLFVBQVFDLEtBQVIsQ0FBY0YsR0FBZDtBQUNELENBSEQiLCJmaWxlIjoiY2xpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjb2xvcnMnO1xuaW1wb3J0IHlhcmdzIGZyb20gJ3lhcmdzJztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4uL21vZGVscy9hY2NvdW50JztcbmltcG9ydCB7IERhdGFTb3VyY2UgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IExvY2FsRGF0YWJhc2VEYXRhU291cmNlIGZyb20gJy4uL2xvY2FsLWRhdGFiYXNlLWRhdGEtc291cmNlJztcbmltcG9ydCBhcHAgZnJvbSAnLi4vYXBwJztcblxuaW1wb3J0IFNldHVwIGZyb20gJy4vc2V0dXAnO1xuaW1wb3J0IEluc3RhbGxQbHVnaW4gZnJvbSAnLi9pbnN0YWxsLXBsdWdpbic7XG5pbXBvcnQgQ3JlYXRlUGx1Z2luIGZyb20gJy4vY3JlYXRlLXBsdWdpbic7XG5pbXBvcnQgVXBkYXRlUGx1Z2lucyBmcm9tICcuL3VwZGF0ZS1wbHVnaW5zJztcbmltcG9ydCBCdWlsZFBsdWdpbnMgZnJvbSAnLi9idWlsZC1wbHVnaW5zJztcbmltcG9ydCBXYXRjaFBsdWdpbnMgZnJvbSAnLi93YXRjaC1wbHVnaW5zJztcbmltcG9ydCBTeW5jIGZyb20gJy4vc3luYyc7XG5pbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeSc7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi4vLi4vLi4vcGFja2FnZS5qc29uJztcblxuaW1wb3J0IHsgRGF0YWJhc2UgfSBmcm9tICdtaW5pZGInO1xuXG55YXJncy4kMCA9ICdmdWxjcnVtJztcblxucmVxdWlyZSgnc291cmNlLW1hcC1zdXBwb3J0JykuaW5zdGFsbCgpO1xuXG5jb25zdCBDT01NQU5EUyA9IFtcbiAgU2V0dXAsXG4gIFN5bmMsXG4gIEluc3RhbGxQbHVnaW4sXG4gIENyZWF0ZVBsdWdpbixcbiAgVXBkYXRlUGx1Z2lucyxcbiAgQnVpbGRQbHVnaW5zLFxuICBXYXRjaFBsdWdpbnMsXG4gIFF1ZXJ5XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDTEkge1xuICBhc3luYyBzZXR1cCgpIHtcbiAgICB0aGlzLmFwcCA9IGFwcDtcblxuICAgIHRoaXMuX3lhcmdzID0geWFyZ3MuZW52KCdGVUxDUlVNJyk7XG5cbiAgICBpZiAodGhpcy5hcmdzLmRlYnVnc3FsKSB7XG4gICAgICBEYXRhYmFzZS5kZWJ1ZyA9IHRydWU7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5hcHAuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgYXN5bmMgZGVzdHJveSgpIHtcbiAgICBhd2FpdCB0aGlzLmFwcC5kaXNwb3NlKCk7XG4gIH1cblxuICBhc3luYyBydW4oKSB7XG4gICAgbGV0IGNsaSA9IHRoaXMueWFyZ3MudXNhZ2UoJ1VzYWdlOiBmdWxjcnVtIDxjbWQ+IFthcmdzXScpO1xuXG4gICAgY2xpLiQwID0gJ2Z1bGNydW0nO1xuXG4gICAgLy8gdGhpcyBpcyBzb21lIGhhY2tzIHRvIGNvb3JkaW5hdGUgdGhlIHlhcmdzIGhhbmRsZXIgZnVuY3Rpb24gd2l0aCB0aGlzIGFzeW5jIGZ1bmN0aW9uLlxuICAgIC8vIGlmIHlhcmdzIGFkZHMgc3VwcG9ydCBmb3IgcHJvbWlzZXMgaW4gdGhlIGNvbW1hbmQgaGFuZGxlcnMgdGhpcyBjYW4gZ28gYXdheS5cbiAgICBsZXQgcHJvbWlzZVJlc29sdmUgPSBudWxsO1xuICAgIGxldCBwcm9taXNlUmVqZWN0ID0gbnVsbDtcblxuICAgIGNvbnN0IGNvbXBsZXRpb24gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBwcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XG4gICAgICBwcm9taXNlUmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuXG4gICAgLy8gY2xpID0gYXdhaXQgdGhpcy5hZGREZWZhdWx0KHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgIGZvciAoY29uc3QgQ29tbWFuZENsYXNzIG9mIENPTU1BTkRTKSB7XG4gICAgICBjb25zdCBjb21tYW5kID0gbmV3IENvbW1hbmRDbGFzcygpO1xuXG4gICAgICBjb21tYW5kLmFwcCA9IHRoaXMuYXBwO1xuXG4gICAgICBjb25zdCBjb21tYW5kQ2xpID0gYXdhaXQgY29tbWFuZC50YXNrKHRoaXMud3JhcEFzeW5jKGNsaSwgcHJvbWlzZVJlc29sdmUsIHByb21pc2VSZWplY3QpKTtcblxuICAgICAgaWYgKGNvbW1hbmRDbGkpIHtcbiAgICAgICAgY2xpID0gY29tbWFuZENsaTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLmFwcC5fcGx1Z2lucykge1xuICAgICAgaWYgKHBsdWdpbi50YXNrKSB7XG4gICAgICAgIGNvbnN0IHBsdWdpbkNvbW1hbmQgPSBhd2FpdCBwbHVnaW4udGFzayh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICAgICAgaWYgKHBsdWdpbkNvbW1hbmQpIHtcbiAgICAgICAgICBjbGkgPSBwbHVnaW5Db21tYW5kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcmd2ID1cbiAgICAgIGNsaS5kZW1hbmRDb21tYW5kKClcbiAgICAgICAgIC52ZXJzaW9uKG1hbmlmZXN0LnZlcnNpb24pXG4gICAgICAgICAuaGVscCgpXG4gICAgICAgICAuYXJndjtcblxuICAgIGF3YWl0IGNvbXBsZXRpb247XG4gIH1cblxuICAvLyBhZGREZWZhdWx0ID0gYXN5bmMgKGNsaSkgPT4ge1xuICAvLyAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gIC8vICAgICBjb21tYW5kOiAneW95bycsXG4gIC8vICAgICBkZXNjOiAneXlvJyxcbiAgLy8gICAgIGJ1aWxkZXI6IHt9LFxuICAvLyAgICAgaGFuZGxlcjogdGhpcy5ydW5EZWZhdWx0Q29tbWFuZFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gcnVuRGVmYXVsdENvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gIC8vIH1cblxuICBnZXQgZGIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmRiO1xuICB9XG5cbiAgZ2V0IHlhcmdzKCkge1xuICAgIHJldHVybiB0aGlzLl95YXJncztcbiAgfVxuXG4gIGdldCBhcmdzKCkge1xuICAgIHJldHVybiB5YXJncy5hcmd2O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHdoZXJlLm9yZ2FuaXphdGlvbl9uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQuZmluZEFsbCh0aGlzLmRiLCB3aGVyZSk7XG5cbiAgICByZXR1cm4gYWNjb3VudHM7XG4gIH1cblxuICBhc3luYyBjcmVhdGVEYXRhU291cmNlKGFjY291bnQpIHtcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XG5cbiAgICBjb25zdCBsb2NhbERhdGFiYXNlID0gbmV3IExvY2FsRGF0YWJhc2VEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XG5cbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KCkge1xuICAgIC8vIFRPRE8oemhtKSByZXF1aXJlZCBvciBpdCBoYW5ncyBmb3IgfjMwc2VjIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvNDk0NFxuICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5leGl0KCk7XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zZXR1cCgpO1xuICAgICAgYXdhaXQgdGhpcy5ydW4oKTtcbiAgICAgIGF3YWl0IHRoaXMuZGVzdHJveSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyh6aG0pIHJlcXVpcmVkIG9yIGl0IGhhbmdzIGZvciB+MzBzZWMgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy80OTQ0XG4gICAgcHJvY2Vzcy5leGl0KCk7XG4gIH1cblxuICAvLyB0aGlzIGhhY2tzIHRoZSB5YXJncyBjb21tYW5kIGhhbmRsZXIgdG8gYWxsb3cgaXQgdG8gcmV0dXJuIGEgcHJvbWlzZSAoYXN5bmMgZnVuY3Rpb24pXG4gIHdyYXBBc3luYyA9IChvYmosIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IF9fY29tbWFuZCA9IG9iai5jb21tYW5kLmJpbmQob2JqKTtcblxuICAgIG9iai5jb21tYW5kID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzICYmIGFyZ3NbMF0gJiYgYXJnc1swXS5oYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBhcmdzWzBdLmhhbmRsZXI7XG5cbiAgICAgICAgYXJnc1swXS5oYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGhhbmRsZXIoKTtcblxuICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgICAgICAgIHJlc3VsdC50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX19jb21tYW5kKC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm5ldyBDTEkoKS5zdGFydCgpLnRoZW4oKCkgPT4ge1xufSkuY2F0Y2goKGVycikgPT4ge1xuICBjb25zb2xlLmVycm9yKGVycik7XG59KTtcbiJdfQ==