'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fulcrumCore = require('fulcrum-core');

var core = _interopRequireWildcard(_fulcrumCore);

var _generator = require('./reports/generator');

var _generator2 = _interopRequireDefault(_generator);

var _recordValues = require('./models/record-values/record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

var _sqliteRecordValues = require('./models/record-values/sqlite-record-values');

var _sqliteRecordValues2 = _interopRequireDefault(_sqliteRecordValues);

var _postgresRecordValues = require('./models/record-values/postgres-record-values');

var _postgresRecordValues2 = _interopRequireDefault(_postgresRecordValues);

var _minidb = require('minidb');

var _client = require('./api/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const api = {};

Object.assign(api, {
  core,
  ReportGenerator: _generator2.default,
  RecordValues: _recordValues2.default,
  SQLiteRecordValues: _sqliteRecordValues2.default,
  PostgresRecordValues: _postgresRecordValues2.default,
  Postgres: _minidb.Postgres,
  SQLite: _minidb.SQLite,
  MSSQL: _minidb.MSSQL,
  PersistentObject: _minidb.PersistentObject,
  APIClient: _client2.default
});

exports.default = api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiYXBpIiwiT2JqZWN0IiwiYXNzaWduIiwiUmVwb3J0R2VuZXJhdG9yIiwiUmVjb3JkVmFsdWVzIiwiU1FMaXRlUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXNSZWNvcmRWYWx1ZXMiLCJQb3N0Z3JlcyIsIlNRTGl0ZSIsIk1TU1FMIiwiUGVyc2lzdGVudE9iamVjdCIsIkFQSUNsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0lBQVlBLEk7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQyxNQUFNLEVBQVo7O0FBRUFDLE9BQU9DLE1BQVAsQ0FBY0YsR0FBZCxFQUFtQjtBQUNqQkQsTUFEaUI7QUFFakJJLHNDQUZpQjtBQUdqQkMsc0NBSGlCO0FBSWpCQyxrREFKaUI7QUFLakJDLHNEQUxpQjtBQU1qQkMsNEJBTmlCO0FBT2pCQyx3QkFQaUI7QUFRakJDLHNCQVJpQjtBQVNqQkMsNENBVGlCO0FBVWpCQztBQVZpQixDQUFuQjs7a0JBYWVYLEciLCJmaWxlIjoiYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuaW1wb3J0IFJlcG9ydEdlbmVyYXRvciBmcm9tICcuL3JlcG9ydHMvZ2VuZXJhdG9yJztcbmltcG9ydCBSZWNvcmRWYWx1ZXMgZnJvbSAnLi9tb2RlbHMvcmVjb3JkLXZhbHVlcy9yZWNvcmQtdmFsdWVzJztcbmltcG9ydCBTUUxpdGVSZWNvcmRWYWx1ZXMgZnJvbSAnLi9tb2RlbHMvcmVjb3JkLXZhbHVlcy9zcWxpdGUtcmVjb3JkLXZhbHVlcyc7XG5pbXBvcnQgUG9zdGdyZXNSZWNvcmRWYWx1ZXMgZnJvbSAnLi9tb2RlbHMvcmVjb3JkLXZhbHVlcy9wb3N0Z3Jlcy1yZWNvcmQtdmFsdWVzJztcbmltcG9ydCB7IFBvc3RncmVzLCBTUUxpdGUsIE1TU1FMLCBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCBBUElDbGllbnQgZnJvbSAnLi9hcGkvY2xpZW50JztcblxuY29uc3QgYXBpID0ge307XG5cbk9iamVjdC5hc3NpZ24oYXBpLCB7XG4gIGNvcmUsXG4gIFJlcG9ydEdlbmVyYXRvcixcbiAgUmVjb3JkVmFsdWVzLFxuICBTUUxpdGVSZWNvcmRWYWx1ZXMsXG4gIFBvc3RncmVzUmVjb3JkVmFsdWVzLFxuICBQb3N0Z3JlcyxcbiAgU1FMaXRlLFxuICBNU1NRTCxcbiAgUGVyc2lzdGVudE9iamVjdCxcbiAgQVBJQ2xpZW50XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpO1xuIl19