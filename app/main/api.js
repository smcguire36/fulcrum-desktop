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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiZGF0YSIsImFwaSIsIk9iamVjdCIsImFzc2lnbiIsIlJlcG9ydEdlbmVyYXRvciIsIlJlY29yZFZhbHVlcyIsIlNRTGl0ZVJlY29yZFZhbHVlcyIsIlBvc3RncmVzUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXMiLCJTUUxpdGUiLCJNU1NRTCIsIlBlcnNpc3RlbnRPYmplY3QiLCJBUElDbGllbnQiLCJIdG1sVG9QZGYiLCJTY2hlbWFMb2FkZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztJQUFZQSxJOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlDLEk7Ozs7OztBQUVaLE1BQU1DLE1BQU0sRUFBWjs7QUFFQUMsT0FBT0MsTUFBUCxDQUFjRixHQUFkLEVBQW1CO0FBQ2pCRixNQURpQjtBQUVqQkMsTUFGaUI7QUFHakJJLHNDQUhpQjtBQUlqQkMsc0NBSmlCO0FBS2pCQyxrREFMaUI7QUFNakJDLHNEQU5pQjtBQU9qQkMsNEJBUGlCO0FBUWpCQyx3QkFSaUI7QUFTakJDLHNCQVRpQjtBQVVqQkMsNENBVmlCO0FBV2pCQyw2QkFYaUI7QUFZakJDLGdDQVppQjtBQWFqQkM7QUFiaUIsQ0FBbkI7O2tCQWdCZWIsRyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2Z1bGNydW0tY29yZSc7XHJcbmltcG9ydCBSZXBvcnRHZW5lcmF0b3IgZnJvbSAnLi9yZXBvcnRzL2dlbmVyYXRvcic7XHJcbmltcG9ydCBIdG1sVG9QZGYgZnJvbSAnLi9yZXBvcnRzL2h0bWwtdG8tcGRmJztcclxuaW1wb3J0IFJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMnO1xyXG5pbXBvcnQgU1FMaXRlUmVjb3JkVmFsdWVzIGZyb20gJy4vbW9kZWxzL3JlY29yZC12YWx1ZXMvc3FsaXRlLXJlY29yZC12YWx1ZXMnO1xyXG5pbXBvcnQgUG9zdGdyZXNSZWNvcmRWYWx1ZXMgZnJvbSAnLi9tb2RlbHMvcmVjb3JkLXZhbHVlcy9wb3N0Z3Jlcy1yZWNvcmQtdmFsdWVzJztcclxuaW1wb3J0IHsgUG9zdGdyZXMsIFNRTGl0ZSwgTVNTUUwsIFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xyXG5pbXBvcnQgQVBJQ2xpZW50IGZyb20gJy4vYXBpL2NsaWVudCc7XHJcbmltcG9ydCBTY2hlbWFMb2FkZXIgZnJvbSAnLi91dGlscy9zY2hlbWEtbG9hZGVyJztcclxuaW1wb3J0ICogYXMgZGF0YSBmcm9tICcuL21vZGVscyc7XHJcblxyXG5jb25zdCBhcGkgPSB7fTtcclxuXHJcbk9iamVjdC5hc3NpZ24oYXBpLCB7XHJcbiAgY29yZSxcclxuICBkYXRhLFxyXG4gIFJlcG9ydEdlbmVyYXRvcixcclxuICBSZWNvcmRWYWx1ZXMsXHJcbiAgU1FMaXRlUmVjb3JkVmFsdWVzLFxyXG4gIFBvc3RncmVzUmVjb3JkVmFsdWVzLFxyXG4gIFBvc3RncmVzLFxyXG4gIFNRTGl0ZSxcclxuICBNU1NRTCxcclxuICBQZXJzaXN0ZW50T2JqZWN0LFxyXG4gIEFQSUNsaWVudCxcclxuICBIdG1sVG9QZGYsXHJcbiAgU2NoZW1hTG9hZGVyXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXBpO1xyXG4iXX0=