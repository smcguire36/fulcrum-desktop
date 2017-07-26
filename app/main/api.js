'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fulcrumCore = require('fulcrum-core');

var core = _interopRequireWildcard(_fulcrumCore);

var _generator = require('./reports/generator');

var _generator2 = _interopRequireDefault(_generator);

var _htmlToPdf = require('./reports/html-to-pdf');

var _htmlToPdf2 = _interopRequireDefault(_htmlToPdf);

var _recordValues = require('./models/record-values/record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

var _sqliteRecordValues = require('./models/record-values/sqlite-record-values');

var _sqliteRecordValues2 = _interopRequireDefault(_sqliteRecordValues);

var _postgresRecordValues = require('./models/record-values/postgres-record-values');

var _postgresRecordValues2 = _interopRequireDefault(_postgresRecordValues);

var _minidb = require('minidb');

var _client = require('./api/client');

var _client2 = _interopRequireDefault(_client);

var _schemaLoader = require('./utils/schema-loader');

var _schemaLoader2 = _interopRequireDefault(_schemaLoader);

var _models = require('./models');

var data = _interopRequireWildcard(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const api = {};

Object.assign(api, {
  core,
  data,
  ReportGenerator: _generator2.default,
  RecordValues: _recordValues2.default,
  SQLiteRecordValues: _sqliteRecordValues2.default,
  PostgresRecordValues: _postgresRecordValues2.default,
  Postgres: _minidb.Postgres,
  SQLite: _minidb.SQLite,
  MSSQL: _minidb.MSSQL,
  PersistentObject: _minidb.PersistentObject,
  APIClient: _client2.default,
  HtmlToPdf: _htmlToPdf2.default,
  SchemaLoader: _schemaLoader2.default
});

exports.default = api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiZGF0YSIsImFwaSIsIk9iamVjdCIsImFzc2lnbiIsIlJlcG9ydEdlbmVyYXRvciIsIlJlY29yZFZhbHVlcyIsIlNRTGl0ZVJlY29yZFZhbHVlcyIsIlBvc3RncmVzUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXMiLCJTUUxpdGUiLCJNU1NRTCIsIlBlcnNpc3RlbnRPYmplY3QiLCJBUElDbGllbnQiLCJIdG1sVG9QZGYiLCJTY2hlbWFMb2FkZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztJQUFZQSxJOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlDLEk7Ozs7OztBQUVaLE1BQU1DLE1BQU0sRUFBWjs7QUFFQUMsT0FBT0MsTUFBUCxDQUFjRixHQUFkLEVBQW1CO0FBQ2pCRixNQURpQjtBQUVqQkMsTUFGaUI7QUFHakJJLHNDQUhpQjtBQUlqQkMsc0NBSmlCO0FBS2pCQyxrREFMaUI7QUFNakJDLHNEQU5pQjtBQU9qQkMsNEJBUGlCO0FBUWpCQyx3QkFSaUI7QUFTakJDLHNCQVRpQjtBQVVqQkMsNENBVmlCO0FBV2pCQyw2QkFYaUI7QUFZakJDLGdDQVppQjtBQWFqQkM7QUFiaUIsQ0FBbkI7O2tCQWdCZWIsRyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgUmVwb3J0R2VuZXJhdG9yIGZyb20gJy4vcmVwb3J0cy9nZW5lcmF0b3InO1xuaW1wb3J0IEh0bWxUb1BkZiBmcm9tICcuL3JlcG9ydHMvaHRtbC10by1wZGYnO1xuaW1wb3J0IFJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMnO1xuaW1wb3J0IFNRTGl0ZVJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3NxbGl0ZS1yZWNvcmQtdmFsdWVzJztcbmltcG9ydCBQb3N0Z3Jlc1JlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3Bvc3RncmVzLXJlY29yZC12YWx1ZXMnO1xuaW1wb3J0IHsgUG9zdGdyZXMsIFNRTGl0ZSwgTVNTUUwsIFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IEFQSUNsaWVudCBmcm9tICcuL2FwaS9jbGllbnQnO1xuaW1wb3J0IFNjaGVtYUxvYWRlciBmcm9tICcuL3V0aWxzL3NjaGVtYS1sb2FkZXInO1xuaW1wb3J0ICogYXMgZGF0YSBmcm9tICcuL21vZGVscyc7XG5cbmNvbnN0IGFwaSA9IHt9O1xuXG5PYmplY3QuYXNzaWduKGFwaSwge1xuICBjb3JlLFxuICBkYXRhLFxuICBSZXBvcnRHZW5lcmF0b3IsXG4gIFJlY29yZFZhbHVlcyxcbiAgU1FMaXRlUmVjb3JkVmFsdWVzLFxuICBQb3N0Z3Jlc1JlY29yZFZhbHVlcyxcbiAgUG9zdGdyZXMsXG4gIFNRTGl0ZSxcbiAgTVNTUUwsXG4gIFBlcnNpc3RlbnRPYmplY3QsXG4gIEFQSUNsaWVudCxcbiAgSHRtbFRvUGRmLFxuICBTY2hlbWFMb2FkZXJcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhcGk7XG4iXX0=