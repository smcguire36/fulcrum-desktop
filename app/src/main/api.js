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
  PersistentObject: _minidb.PersistentObject,
  APIClient: _client2.default
});

exports.default = api;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS5qcyJdLCJuYW1lcyI6WyJjb3JlIiwiYXBpIiwiT2JqZWN0IiwiYXNzaWduIiwiUmVwb3J0R2VuZXJhdG9yIiwiUmVjb3JkVmFsdWVzIiwiU1FMaXRlUmVjb3JkVmFsdWVzIiwiUG9zdGdyZXNSZWNvcmRWYWx1ZXMiLCJQb3N0Z3JlcyIsIlNRTGl0ZSIsIlBlcnNpc3RlbnRPYmplY3QiLCJBUElDbGllbnQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztJQUFZQSxJOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUMsTUFBTSxFQUFaOztBQUVBQyxPQUFPQyxNQUFQLENBQWNGLEdBQWQsRUFBbUI7QUFDakJELE1BRGlCO0FBRWpCSSxzQ0FGaUI7QUFHakJDLHNDQUhpQjtBQUlqQkMsa0RBSmlCO0FBS2pCQyxzREFMaUI7QUFNakJDLDRCQU5pQjtBQU9qQkMsd0JBUGlCO0FBUWpCQyw0Q0FSaUI7QUFTakJDO0FBVGlCLENBQW5COztrQkFZZVYsRyIsImZpbGUiOiJhcGkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb3JlIGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgUmVwb3J0R2VuZXJhdG9yIGZyb20gJy4vcmVwb3J0cy9nZW5lcmF0b3InO1xuaW1wb3J0IFJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMnO1xuaW1wb3J0IFNRTGl0ZVJlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3NxbGl0ZS1yZWNvcmQtdmFsdWVzJztcbmltcG9ydCBQb3N0Z3Jlc1JlY29yZFZhbHVlcyBmcm9tICcuL21vZGVscy9yZWNvcmQtdmFsdWVzL3Bvc3RncmVzLXJlY29yZC12YWx1ZXMnO1xuaW1wb3J0IHsgUG9zdGdyZXMsIFNRTGl0ZSwgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XG5pbXBvcnQgQVBJQ2xpZW50IGZyb20gJy4vYXBpL2NsaWVudCc7XG5cbmNvbnN0IGFwaSA9IHt9O1xuXG5PYmplY3QuYXNzaWduKGFwaSwge1xuICBjb3JlLFxuICBSZXBvcnRHZW5lcmF0b3IsXG4gIFJlY29yZFZhbHVlcyxcbiAgU1FMaXRlUmVjb3JkVmFsdWVzLFxuICBQb3N0Z3Jlc1JlY29yZFZhbHVlcyxcbiAgUG9zdGdyZXMsXG4gIFNRTGl0ZSxcbiAgUGVyc2lzdGVudE9iamVjdCxcbiAgQVBJQ2xpZW50XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYXBpO1xuIl19