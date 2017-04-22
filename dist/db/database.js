'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minidb = require('minidb');

var _migrations = require('./migrations');

var _migrations2 = _interopRequireDefault(_migrations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let instance = null;

const defaultDatabaseOptions = {
  wal: true,
  autoVacuum: true,
  synchronous: 'off'
};

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (options) {
    if (instance) {
      return instance;
    }

    instance = yield _minidb.SQLite.open(_extends({}, defaultDatabaseOptions, options));

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