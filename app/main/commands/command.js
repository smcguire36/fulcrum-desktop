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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import { Database } from 'minidb';
// Database.debug = true;

_bluebird2.default.longStackTraces();

class Command {
  setup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.app = _app2.default;

      yield _this.app.initialize();
    })();
  }

  destroy() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.app.dispose();
    })();
  }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return _yargs2.default;
  }

  get args() {
    return _yargs2.default.argv;
  }

  fetchAccount(name) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const where = {};

      if (name) {
        where.organization_name = name;
      }

      const accounts = yield _account2.default.findAll(_this3.db, where);

      return accounts;
    })();
  }

  createDataSource(account) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      let dataSource = new _fulcrumCore.DataSource();

      const localDatabase = new _localDatabaseDataSource2.default(account);

      dataSource.add(localDatabase);

      yield localDatabase.load(_this4.db);

      return dataSource;
    })();
  }

  start() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      try {
        // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
        process.on('SIGINT', function () {
          process.exit();
        });

        yield _this5.setup();
        yield _this5.run();
        yield _this5.destroy();
      } catch (err) {
        console.error(err.stack);
        // if (this.args.verbose) {
        //   console.error(err.stack);
        // } else {
        //   console.error(err.message);
        // }

        yield _this5.destroy();
      }

      // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
      process.exit();
    })();
  }
}
exports.default = Command;
//# sourceMappingURL=command.js.map