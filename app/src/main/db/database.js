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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2RiL2RhdGFiYXNlLmpzIl0sIm5hbWVzIjpbImluc3RhbmNlIiwiZGVmYXVsdERhdGFiYXNlT3B0aW9ucyIsIndhbCIsImF1dG9WYWN1dW0iLCJzeW5jaHJvbm91cyIsIm9wdGlvbnMiLCJvcGVuIiwibWlncmF0aW9ucyIsIm1pZ3JhdGUiLCJkYXRhYmFzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFJQSxXQUFXLElBQWY7O0FBRUEsTUFBTUMseUJBQXlCO0FBQzdCQyxPQUFLLElBRHdCO0FBRTdCQyxjQUFZLElBRmlCO0FBRzdCQyxlQUFhO0FBSGdCLENBQS9COzs7K0JBTWUsV0FBd0JDLE9BQXhCLEVBQWlDO0FBQzlDLFFBQUlMLFFBQUosRUFBYztBQUNaLGFBQU9BLFFBQVA7QUFDRDs7QUFFREEsZUFBVyxNQUFNLGVBQU9NLElBQVAsY0FBZ0JMLHNCQUFoQixFQUEyQ0ksT0FBM0MsRUFBakI7O0FBRUEsVUFBTUUsYUFBYSx5QkFBZVAsUUFBZixDQUFuQjs7QUFFQSxVQUFNTyxXQUFXQyxPQUFYLEVBQU47O0FBRUEsV0FBT1IsUUFBUDtBQUNELEc7O1dBWjZCUyxROzs7O1NBQUFBLFEiLCJmaWxlIjoiZGF0YWJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTUUxpdGUgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IE1pZ3JhdGlvbnMgZnJvbSAnLi9taWdyYXRpb25zJztcblxubGV0IGluc3RhbmNlID0gbnVsbDtcblxuY29uc3QgZGVmYXVsdERhdGFiYXNlT3B0aW9ucyA9IHtcbiAgd2FsOiB0cnVlLFxuICBhdXRvVmFjdXVtOiB0cnVlLFxuICBzeW5jaHJvbm91czogJ29mZidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGRhdGFiYXNlKG9wdGlvbnMpIHtcbiAgaWYgKGluc3RhbmNlKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9XG5cbiAgaW5zdGFuY2UgPSBhd2FpdCBTUUxpdGUub3Blbih7Li4uZGVmYXVsdERhdGFiYXNlT3B0aW9ucywgLi4ub3B0aW9uc30pO1xuXG4gIGNvbnN0IG1pZ3JhdGlvbnMgPSBuZXcgTWlncmF0aW9ucyhpbnN0YW5jZSk7XG5cbiAgYXdhaXQgbWlncmF0aW9ucy5taWdyYXRlKCk7XG5cbiAgcmV0dXJuIGluc3RhbmNlO1xufVxuIl19