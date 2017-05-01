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

var _version = require('../../version');

var _version2 = _interopRequireDefault(_version);

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

      _this3.argv = cli.demandCommand().version(_version2.default.fulcrum).help().argv;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2NsaS5qcyJdLCJuYW1lcyI6WyIkMCIsInJlcXVpcmUiLCJpbnN0YWxsIiwiQ09NTUFORFMiLCJDTEkiLCJ3cmFwQXN5bmMiLCJvYmoiLCJyZXNvbHZlIiwicmVqZWN0IiwiX19jb21tYW5kIiwiY29tbWFuZCIsImJpbmQiLCJhcmdzIiwiaGFuZGxlciIsInJlc3VsdCIsInRoZW4iLCJjYXRjaCIsInNldHVwIiwiYXBwIiwiX3lhcmdzIiwiZW52IiwiZGVidWdzcWwiLCJkZWJ1ZyIsImluaXRpYWxpemUiLCJkZXN0cm95IiwiZGlzcG9zZSIsInJ1biIsImNsaSIsInlhcmdzIiwidXNhZ2UiLCJwcm9taXNlUmVzb2x2ZSIsInByb21pc2VSZWplY3QiLCJjb21wbGV0aW9uIiwiUHJvbWlzZSIsIkNvbW1hbmRDbGFzcyIsImNvbW1hbmRDbGkiLCJ0YXNrIiwicGx1Z2luIiwiX3BsdWdpbnMiLCJwbHVnaW5Db21tYW5kIiwiYXJndiIsImRlbWFuZENvbW1hbmQiLCJ2ZXJzaW9uIiwiZnVsY3J1bSIsImhlbHAiLCJkYiIsImZldGNoQWNjb3VudCIsIm5hbWUiLCJ3aGVyZSIsIm9yZ2FuaXphdGlvbl9uYW1lIiwiYWNjb3VudHMiLCJmaW5kQWxsIiwiY3JlYXRlRGF0YVNvdXJjZSIsImFjY291bnQiLCJkYXRhU291cmNlIiwibG9jYWxEYXRhYmFzZSIsImFkZCIsImxvYWQiLCJzdGFydCIsInByb2Nlc3MiLCJvbiIsImV4aXQiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRUEsZ0JBQU1BLEVBQU4sR0FBVyxTQUFYOztBQUVBQyxRQUFRLG9C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QUFRQyxLQUFSLENBQWNGLElBQUlHLEtBQWxCO0FBQ0EsY0FBTSxPQUFLekMsT0FBTCxFQUFOO0FBQ0Q7O0FBRUQ7QUFDQW1DLGNBQVFFLElBQVI7QUFoQlk7QUFpQmI7O0FBRUQ7QUFwSXVCOztrQkFBSnpELEc7QUE0SnJCLElBQUlBLEdBQUosR0FBVXNELEtBQVYsR0FBa0IzQyxJQUFsQixDQUF1QixNQUFNLENBQzVCLENBREQsRUFDR0MsS0FESCxDQUNVOEMsR0FBRCxJQUFTO0FBQ2hCQyxVQUFRQyxLQUFSLENBQWNGLEdBQWQ7QUFDRCxDQUhEIiwiZmlsZSI6ImNsaS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnY29sb3JzJztcbmltcG9ydCB5YXJncyBmcm9tICd5YXJncyc7XG5pbXBvcnQgQWNjb3VudCBmcm9tICcuLi9tb2RlbHMvYWNjb3VudCc7XG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBMb2NhbERhdGFiYXNlRGF0YVNvdXJjZSBmcm9tICcuLi9sb2NhbC1kYXRhYmFzZS1kYXRhLXNvdXJjZSc7XG5pbXBvcnQgYXBwIGZyb20gJy4uL2FwcCc7XG5cbmltcG9ydCBTZXR1cCBmcm9tICcuL3NldHVwJztcbmltcG9ydCBJbnN0YWxsUGx1Z2luIGZyb20gJy4vaW5zdGFsbC1wbHVnaW4nO1xuaW1wb3J0IENyZWF0ZVBsdWdpbiBmcm9tICcuL2NyZWF0ZS1wbHVnaW4nO1xuaW1wb3J0IFVwZGF0ZVBsdWdpbnMgZnJvbSAnLi91cGRhdGUtcGx1Z2lucyc7XG5pbXBvcnQgQnVpbGRQbHVnaW5zIGZyb20gJy4vYnVpbGQtcGx1Z2lucyc7XG5pbXBvcnQgV2F0Y2hQbHVnaW5zIGZyb20gJy4vd2F0Y2gtcGx1Z2lucyc7XG5pbXBvcnQgU3luYyBmcm9tICcuL3N5bmMnO1xuaW1wb3J0IFF1ZXJ5IGZyb20gJy4vcXVlcnknO1xuaW1wb3J0IHZlcnNpb24gZnJvbSAnLi4vLi4vdmVyc2lvbic7XG5cbmltcG9ydCB7IERhdGFiYXNlIH0gZnJvbSAnbWluaWRiJztcblxueWFyZ3MuJDAgPSAnZnVsY3J1bSc7XG5cbnJlcXVpcmUoJ3NvdXJjZS1tYXAtc3VwcG9ydCcpLmluc3RhbGwoKTtcblxuY29uc3QgQ09NTUFORFMgPSBbXG4gIFNldHVwLFxuICBTeW5jLFxuICBJbnN0YWxsUGx1Z2luLFxuICBDcmVhdGVQbHVnaW4sXG4gIFVwZGF0ZVBsdWdpbnMsXG4gIEJ1aWxkUGx1Z2lucyxcbiAgV2F0Y2hQbHVnaW5zLFxuICBRdWVyeVxuXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ0xJIHtcbiAgYXN5bmMgc2V0dXAoKSB7XG4gICAgdGhpcy5hcHAgPSBhcHA7XG5cbiAgICB0aGlzLl95YXJncyA9IHlhcmdzLmVudignRlVMQ1JVTScpO1xuXG4gICAgaWYgKHRoaXMuYXJncy5kZWJ1Z3NxbCkge1xuICAgICAgRGF0YWJhc2UuZGVidWcgPSB0cnVlO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuYXBwLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3koKSB7XG4gICAgYXdhaXQgdGhpcy5hcHAuZGlzcG9zZSgpO1xuICB9XG5cbiAgYXN5bmMgcnVuKCkge1xuICAgIGxldCBjbGkgPSB0aGlzLnlhcmdzLnVzYWdlKCdVc2FnZTogZnVsY3J1bSA8Y21kPiBbYXJnc10nKTtcblxuICAgIGNsaS4kMCA9ICdmdWxjcnVtJztcblxuICAgIC8vIHRoaXMgaXMgc29tZSBoYWNrcyB0byBjb29yZGluYXRlIHRoZSB5YXJncyBoYW5kbGVyIGZ1bmN0aW9uIHdpdGggdGhpcyBhc3luYyBmdW5jdGlvbi5cbiAgICAvLyBpZiB5YXJncyBhZGRzIHN1cHBvcnQgZm9yIHByb21pc2VzIGluIHRoZSBjb21tYW5kIGhhbmRsZXJzIHRoaXMgY2FuIGdvIGF3YXkuXG4gICAgbGV0IHByb21pc2VSZXNvbHZlID0gbnVsbDtcbiAgICBsZXQgcHJvbWlzZVJlamVjdCA9IG51bGw7XG5cbiAgICBjb25zdCBjb21wbGV0aW9uID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcHJvbWlzZVJlc29sdmUgPSByZXNvbHZlO1xuICAgICAgcHJvbWlzZVJlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcblxuICAgIC8vIGNsaSA9IGF3YWl0IHRoaXMuYWRkRGVmYXVsdCh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICBmb3IgKGNvbnN0IENvbW1hbmRDbGFzcyBvZiBDT01NQU5EUykge1xuICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDb21tYW5kQ2xhc3MoKTtcblxuICAgICAgY29tbWFuZC5hcHAgPSB0aGlzLmFwcDtcblxuICAgICAgY29uc3QgY29tbWFuZENsaSA9IGF3YWl0IGNvbW1hbmQudGFzayh0aGlzLndyYXBBc3luYyhjbGksIHByb21pc2VSZXNvbHZlLCBwcm9taXNlUmVqZWN0KSk7XG5cbiAgICAgIGlmIChjb21tYW5kQ2xpKSB7XG4gICAgICAgIGNsaSA9IGNvbW1hbmRDbGk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgdGhpcy5hcHAuX3BsdWdpbnMpIHtcbiAgICAgIGlmIChwbHVnaW4udGFzaykge1xuICAgICAgICBjb25zdCBwbHVnaW5Db21tYW5kID0gYXdhaXQgcGx1Z2luLnRhc2sodGhpcy53cmFwQXN5bmMoY2xpLCBwcm9taXNlUmVzb2x2ZSwgcHJvbWlzZVJlamVjdCkpO1xuXG4gICAgICAgIGlmIChwbHVnaW5Db21tYW5kKSB7XG4gICAgICAgICAgY2xpID0gcGx1Z2luQ29tbWFuZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJndiA9XG4gICAgICBjbGkuZGVtYW5kQ29tbWFuZCgpXG4gICAgICAgICAudmVyc2lvbih2ZXJzaW9uLmZ1bGNydW0pXG4gICAgICAgICAuaGVscCgpXG4gICAgICAgICAuYXJndjtcblxuICAgIGF3YWl0IGNvbXBsZXRpb247XG4gIH1cblxuICAvLyBhZGREZWZhdWx0ID0gYXN5bmMgKGNsaSkgPT4ge1xuICAvLyAgIHJldHVybiBjbGkuY29tbWFuZCh7XG4gIC8vICAgICBjb21tYW5kOiAneW95bycsXG4gIC8vICAgICBkZXNjOiAneXlvJyxcbiAgLy8gICAgIGJ1aWxkZXI6IHt9LFxuICAvLyAgICAgaGFuZGxlcjogdGhpcy5ydW5EZWZhdWx0Q29tbWFuZFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gcnVuRGVmYXVsdENvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gIC8vIH1cblxuICBnZXQgZGIoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwLmRiO1xuICB9XG5cbiAgZ2V0IHlhcmdzKCkge1xuICAgIHJldHVybiB0aGlzLl95YXJncztcbiAgfVxuXG4gIGdldCBhcmdzKCkge1xuICAgIHJldHVybiB5YXJncy5hcmd2O1xuICB9XG5cbiAgYXN5bmMgZmV0Y2hBY2NvdW50KG5hbWUpIHtcbiAgICBjb25zdCB3aGVyZSA9IHt9O1xuXG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHdoZXJlLm9yZ2FuaXphdGlvbl9uYW1lID0gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50cyA9IGF3YWl0IEFjY291bnQuZmluZEFsbCh0aGlzLmRiLCB3aGVyZSk7XG5cbiAgICByZXR1cm4gYWNjb3VudHM7XG4gIH1cblxuICBhc3luYyBjcmVhdGVEYXRhU291cmNlKGFjY291bnQpIHtcbiAgICBsZXQgZGF0YVNvdXJjZSA9IG5ldyBEYXRhU291cmNlKCk7XG5cbiAgICBjb25zdCBsb2NhbERhdGFiYXNlID0gbmV3IExvY2FsRGF0YWJhc2VEYXRhU291cmNlKGFjY291bnQpO1xuXG4gICAgZGF0YVNvdXJjZS5hZGQobG9jYWxEYXRhYmFzZSk7XG5cbiAgICBhd2FpdCBsb2NhbERhdGFiYXNlLmxvYWQodGhpcy5kYik7XG5cbiAgICByZXR1cm4gZGF0YVNvdXJjZTtcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0KCkge1xuICAgIC8vIFRPRE8oemhtKSByZXF1aXJlZCBvciBpdCBoYW5ncyBmb3IgfjMwc2VjIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvNDk0NFxuICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvY2Vzcy5leGl0KCk7XG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5zZXR1cCgpO1xuICAgICAgYXdhaXQgdGhpcy5ydW4oKTtcbiAgICAgIGF3YWl0IHRoaXMuZGVzdHJveSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgYXdhaXQgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyh6aG0pIHJlcXVpcmVkIG9yIGl0IGhhbmdzIGZvciB+MzBzZWMgaHR0cHM6Ly9naXRodWIuY29tL2VsZWN0cm9uL2VsZWN0cm9uL2lzc3Vlcy80OTQ0XG4gICAgcHJvY2Vzcy5leGl0KCk7XG4gIH1cblxuICAvLyB0aGlzIGhhY2tzIHRoZSB5YXJncyBjb21tYW5kIGhhbmRsZXIgdG8gYWxsb3cgaXQgdG8gcmV0dXJuIGEgcHJvbWlzZSAoYXN5bmMgZnVuY3Rpb24pXG4gIHdyYXBBc3luYyA9IChvYmosIHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IF9fY29tbWFuZCA9IG9iai5jb21tYW5kLmJpbmQob2JqKTtcblxuICAgIG9iai5jb21tYW5kID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgIGlmIChhcmdzICYmIGFyZ3NbMF0gJiYgYXJnc1swXS5oYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBhcmdzWzBdLmhhbmRsZXI7XG5cbiAgICAgICAgYXJnc1swXS5oYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGhhbmRsZXIoKTtcblxuICAgICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0LnRoZW4pIHtcbiAgICAgICAgICAgIHJlc3VsdC50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX19jb21tYW5kKC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICByZXR1cm4gb2JqO1xuICB9XG59XG5cbm5ldyBDTEkoKS5zdGFydCgpLnRoZW4oKCkgPT4ge1xufSkuY2F0Y2goKGVycikgPT4ge1xuICBjb25zb2xlLmVycm9yKGVycik7XG59KTtcbiJdfQ==