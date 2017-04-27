'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _recordValues = require('./record-values');

var _recordValues2 = _interopRequireDefault(_recordValues);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SQLiteRecordValues extends _recordValues2.default {
  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    return null;
  }
}
exports.default = SQLiteRecordValues;
//# sourceMappingURL=sqlite-record-values.js.map