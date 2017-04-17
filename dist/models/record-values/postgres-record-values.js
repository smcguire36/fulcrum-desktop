'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recordValues = require('./record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

var _pgFormat = require('pg-format');

var _pgFormat2 = _interopRequireDefault(_pgFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PostgresRecordValues extends _recordValues2.default {
  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;
    values.record_index = { raw: `to_tsvector(${(0, _pgFormat2.default)('%L', searchableValue)})` };

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = (0, _pgFormat2.default)('POINT(%s %s)', longitude, latitude);

    return { raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${wkt}'), 4326))` };
  }
}
exports.default = PostgresRecordValues;
//# sourceMappingURL=postgres-record-values.js.map