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
  APIClient: _client2.default,
  HtmlToPdf: _htmlToPdf2.default,
  SchemaLoader: _schemaLoader2.default
});

exports.default = api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiYXBpIiwiT2JqZWN0IiwiYXNzaWduIiwiUmVwb3J0R2VuZXJhdG9yIiwiUmVjb3JkVmFsdWVzIiwiU1FMaXRlUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXNSZWNvcmRWYWx1ZXMiLCJQb3N0Z3JlcyIsIlNRTGl0ZSIsIk1TU1FMIiwiUGVyc2lzdGVudE9iamVjdCIsIkFQSUNsaWVudCIsIkh0bWxUb1BkZiIsIlNjaGVtYUxvYWRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0lBQVlBLEk7O0FBQ1o7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUMsTUFBTSxFQUFaOztBQUVBQyxPQUFPQyxNQUFQLENBQWNGLEdBQWQsRUFBbUI7QUFDakJELE1BRGlCO0FBRWpCSSxzQ0FGaUI7QUFHakJDLHNDQUhpQjtBQUlqQkMsa0RBSmlCO0FBS2pCQyxzREFMaUI7QUFNakJDLDRCQU5pQjtBQU9qQkMsd0JBUGlCO0FBUWpCQyxzQkFSaUI7QUFTakJDLDRDQVRpQjtBQVVqQkMsNkJBVmlCO0FBV2pCQyxnQ0FYaUI7QUFZakJDO0FBWmlCLENBQW5COztrQkFlZWIsRyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgUmVwb3J0R2VuZXJhdG9yIGZyb20gJy4vcmVwb3J0cy9nZW5lcmF0b3InO1xuaW1wb3J0IEh0bWxUb1BkZiBmcm9tICcuL3JlcG9ydHMvaHRtbC10by1wZGYnO1xuaW1wb3J0IFJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMnO1xuaW1wb3J0IFNRTGl0ZVJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3NxbGl0ZS1yZWNvcmQtdmFsdWVzJztcbmltcG9ydCBQb3N0Z3Jlc1JlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3Bvc3RncmVzLXJlY29yZC12YWx1ZXMnO1xuaW1wb3J0IHsgUG9zdGdyZXMsIFNRTGl0ZSwgTVNTUUwsIFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IEFQSUNsaWVudCBmcm9tICcuL2FwaS9jbGllbnQnO1xuaW1wb3J0IFNjaGVtYUxvYWRlciBmcm9tICcuL3V0aWxzL3NjaGVtYS1sb2FkZXInO1xuXG5jb25zdCBhcGkgPSB7fTtcblxuT2JqZWN0LmFzc2lnbihhcGksIHtcbiAgY29yZSxcbiAgUmVwb3J0R2VuZXJhdG9yLFxuICBSZWNvcmRWYWx1ZXMsXG4gIFNRTGl0ZVJlY29yZFZhbHVlcyxcbiAgUG9zdGdyZXNSZWNvcmRWYWx1ZXMsXG4gIFBvc3RncmVzLFxuICBTUUxpdGUsXG4gIE1TU1FMLFxuICBQZXJzaXN0ZW50T2JqZWN0LFxuICBBUElDbGllbnQsXG4gIEh0bWxUb1BkZixcbiAgU2NoZW1hTG9hZGVyXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpO1xuIl19