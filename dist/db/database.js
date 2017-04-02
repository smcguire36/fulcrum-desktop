'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _migrations = require('./migrations');

var _migrations2 = _interopRequireDefault(_migrations);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let instance = null;

const dir = _path2.default.join('.', 'data');

_mkdirp2.default.sync(dir);

const sqliteOptions = {
  file: _path2.default.join(dir, 'fulcrumapp.db'),
  wal: true,
  autoVacuum: true,
  synchronous: 'off'
};

const postgresOptions = {
  db: 'dbname = fulcrumapp'
};

_minidb.Postgres.setNoticeProcessor(message => {
  // TODO(zhm) handle warnings on the connection
  // console.warn(message);
});

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    if (instance) {
      return instance;
    }

    if (options.type === 'SQLite') {
      instance = yield _minidb.SQLite.open(sqliteOptions);
    } else if (options.type === 'PostgreSQL') {
      instance = new _minidb.Postgres(postgresOptions);
    } else {
      throw new Error('unsupported database type: ' + options.type);
    }

    const migrations = new _migrations2.default(instance);

    yield migrations.migrate();

    return instance;
  });

  function database(_x) {
    return _ref.apply(this, arguments);
  }

  return database;
})();
//# sourceMappingURL=database.js.map