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

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fulcrumCore = require('fulcrum-core');

var _localDatabaseDataSource = require('../local-database-data-source');

var _localDatabaseDataSource2 = _interopRequireDefault(_localDatabaseDataSource);

var _minidb = require('minidb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bluebird2.default.longStackTraces();

const config = JSON.parse(_fs2.default.readFileSync(_path2.default.join('data', 'config.json')).toString());

class Command {
  setup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._db = yield (0, _database2.default)(_this.config);
    })();
  }

  destroy() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2._db.close();

      _minidb.Postgres.shutdown();
    })();
  }

  get db() {
    return this._db;
  }

  get args() {
    return _yargs2.default.argv;
  }

  get config() {
    return config;
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
    })();
  }
}
exports.default = Command;
//# sourceMappingURL=command.js.map