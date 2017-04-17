'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fulcrumCore = require('fulcrum-core');

var _account = require('./models/account');

var _account2 = _interopRequireDefault(_account);

var _localDatabaseDataSource = require('./local-database-data-source');

var _localDatabaseDataSource2 = _interopRequireDefault(_localDatabaseDataSource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Plugin {
  constructor({ db }) {
    this._db = db;
  }

  get db() {
    return this._db;
  }

  fetchAccount(name) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const where = {};

      if (name) {
        where.organization_name = name;
      }

      const accounts = yield _account2.default.findAll(_this.db, where);

      return accounts[0];
    })();
  }

  createDataSource(account) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let dataSource = new _fulcrumCore.DataSource();

      const localDatabase = new _localDatabaseDataSource2.default(account);

      dataSource.add(localDatabase);

      yield localDatabase.load(_this2.db);

      return dataSource;
    })();
  }
}
exports.default = Plugin;
//# sourceMappingURL=plugin.js.map