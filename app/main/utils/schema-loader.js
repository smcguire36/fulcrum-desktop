'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fulcrumQuerySql = require('fulcrum-query-sql');

var _pgFormat = require('pg-format');

var _pgFormat2 = _interopRequireDefault(_pgFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class SchemaLoader {
  static loadFormSchema(form) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const cols = yield _this.loadColumns(form);

      return new _fulcrumQuerySql.FormSchema(form, cols.rawFormColumns, cols.rawRepeatableColumns, { fullSchema: true });
    })();
  }

  static loadColumns(form) {
    return _asyncToGenerator(function* () {
      const tableNames = [`form_${form.rowID}_view`];

      const repeatables = form.elementsOfType('Repeatable');

      for (const repeatable of repeatables) {
        tableNames.push(`form_${form.rowID}_${repeatable.key}_view`);
      }

      const sql = (0, _pgFormat2.default)(`
SELECT
  tables.field AS table_field,
  columns.name,
  columns.ordinal,
  columns.field,
  columns.type,
  columns.part
FROM columns
INNER JOIN tables ON columns.table_name = tables.name
WHERE
  columns.table_name IN (%L)
ORDER BY columns.table_name, columns.ordinal
    `, tableNames);

      const rows = yield form.db.all(sql);

      const rawFormColumns = [];
      const rawRepeatableColumns = {};

      for (const row of rows) {
        if (row.table_field) {
          if (!rawRepeatableColumns[row.table_field]) {
            rawRepeatableColumns[row.table_field] = [];
          }

          rawRepeatableColumns[row.table_field].push(row);
        } else {
          rawFormColumns.push(row);
        }
      }

      return { rawFormColumns, rawRepeatableColumns };
    })();
  }
}
exports.default = SchemaLoader;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3V0aWxzL3NjaGVtYS1sb2FkZXIuanMiXSwibmFtZXMiOlsiU2NoZW1hTG9hZGVyIiwibG9hZEZvcm1TY2hlbWEiLCJmb3JtIiwiY29scyIsImxvYWRDb2x1bW5zIiwicmF3Rm9ybUNvbHVtbnMiLCJyYXdSZXBlYXRhYmxlQ29sdW1ucyIsImZ1bGxTY2hlbWEiLCJ0YWJsZU5hbWVzIiwicm93SUQiLCJyZXBlYXRhYmxlcyIsImVsZW1lbnRzT2ZUeXBlIiwicmVwZWF0YWJsZSIsInB1c2giLCJrZXkiLCJzcWwiLCJyb3dzIiwiZGIiLCJhbGwiLCJyb3ciLCJ0YWJsZV9maWVsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsWUFBTixDQUFtQjtBQUNoQyxTQUFhQyxjQUFiLENBQTRCQyxJQUE1QixFQUFrQztBQUFBOztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sTUFBTSxNQUFLQyxXQUFMLENBQWlCRixJQUFqQixDQUFuQjs7QUFFQSxhQUFPLGdDQUFlQSxJQUFmLEVBQXFCQyxLQUFLRSxjQUExQixFQUEwQ0YsS0FBS0csb0JBQS9DLEVBQXFFLEVBQUNDLFlBQVksSUFBYixFQUFyRSxDQUFQO0FBSGdDO0FBSWpDOztBQUVELFNBQWFILFdBQWIsQ0FBeUJGLElBQXpCLEVBQStCO0FBQUE7QUFDN0IsWUFBTU0sYUFBYSxDQUNoQixRQUFPTixLQUFLTyxLQUFNLE9BREYsQ0FBbkI7O0FBSUEsWUFBTUMsY0FBY1IsS0FBS1MsY0FBTCxDQUFvQixZQUFwQixDQUFwQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJGLFdBQXpCLEVBQXNDO0FBQ3BDRixtQkFBV0ssSUFBWCxDQUFpQixRQUFPWCxLQUFLTyxLQUFNLElBQUdHLFdBQVdFLEdBQUksT0FBckQ7QUFDRDs7QUFFRCxZQUFNQyxNQUFNLHdCQUFVOzs7Ozs7Ozs7Ozs7O0tBQVYsRUFhVFAsVUFiUyxDQUFaOztBQWVBLFlBQU1RLE9BQU8sTUFBTWQsS0FBS2UsRUFBTCxDQUFRQyxHQUFSLENBQVlILEdBQVosQ0FBbkI7O0FBRUEsWUFBTVYsaUJBQWlCLEVBQXZCO0FBQ0EsWUFBTUMsdUJBQXVCLEVBQTdCOztBQUVBLFdBQUssTUFBTWEsR0FBWCxJQUFrQkgsSUFBbEIsRUFBd0I7QUFDdEIsWUFBSUcsSUFBSUMsV0FBUixFQUFxQjtBQUNuQixjQUFJLENBQUNkLHFCQUFxQmEsSUFBSUMsV0FBekIsQ0FBTCxFQUE0QztBQUMxQ2QsaUNBQXFCYSxJQUFJQyxXQUF6QixJQUF3QyxFQUF4QztBQUNEOztBQUVEZCwrQkFBcUJhLElBQUlDLFdBQXpCLEVBQXNDUCxJQUF0QyxDQUEyQ00sR0FBM0M7QUFDRCxTQU5ELE1BTU87QUFDTGQseUJBQWVRLElBQWYsQ0FBb0JNLEdBQXBCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLEVBQUNkLGNBQUQsRUFBaUJDLG9CQUFqQixFQUFQO0FBM0M2QjtBQTRDOUI7QUFuRCtCO2tCQUFiTixZIiwiZmlsZSI6InNjaGVtYS1sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JtU2NoZW1hIH0gZnJvbSAnZnVsY3J1bS1xdWVyeS1zcWwnO1xuaW1wb3J0IHBnZm9ybWF0IGZyb20gJ3BnLWZvcm1hdCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYUxvYWRlciB7XG4gIHN0YXRpYyBhc3luYyBsb2FkRm9ybVNjaGVtYShmb3JtKSB7XG4gICAgY29uc3QgY29scyA9IGF3YWl0IHRoaXMubG9hZENvbHVtbnMoZm9ybSk7XG5cbiAgICByZXR1cm4gbmV3IEZvcm1TY2hlbWEoZm9ybSwgY29scy5yYXdGb3JtQ29sdW1ucywgY29scy5yYXdSZXBlYXRhYmxlQ29sdW1ucywge2Z1bGxTY2hlbWE6IHRydWV9KTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBsb2FkQ29sdW1ucyhmb3JtKSB7XG4gICAgY29uc3QgdGFibGVOYW1lcyA9IFtcbiAgICAgIGBmb3JtXyR7Zm9ybS5yb3dJRH1fdmlld2BcbiAgICBdO1xuXG4gICAgY29uc3QgcmVwZWF0YWJsZXMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJyk7XG5cbiAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGUgb2YgcmVwZWF0YWJsZXMpIHtcbiAgICAgIHRhYmxlTmFtZXMucHVzaChgZm9ybV8ke2Zvcm0ucm93SUR9XyR7cmVwZWF0YWJsZS5rZXl9X3ZpZXdgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzcWwgPSBwZ2Zvcm1hdChgXG5TRUxFQ1RcbiAgdGFibGVzLmZpZWxkIEFTIHRhYmxlX2ZpZWxkLFxuICBjb2x1bW5zLm5hbWUsXG4gIGNvbHVtbnMub3JkaW5hbCxcbiAgY29sdW1ucy5maWVsZCxcbiAgY29sdW1ucy50eXBlLFxuICBjb2x1bW5zLnBhcnRcbkZST00gY29sdW1uc1xuSU5ORVIgSk9JTiB0YWJsZXMgT04gY29sdW1ucy50YWJsZV9uYW1lID0gdGFibGVzLm5hbWVcbldIRVJFXG4gIGNvbHVtbnMudGFibGVfbmFtZSBJTiAoJUwpXG5PUkRFUiBCWSBjb2x1bW5zLnRhYmxlX25hbWUsIGNvbHVtbnMub3JkaW5hbFxuICAgIGAsIHRhYmxlTmFtZXMpO1xuXG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IGZvcm0uZGIuYWxsKHNxbCk7XG5cbiAgICBjb25zdCByYXdGb3JtQ29sdW1ucyA9IFtdO1xuICAgIGNvbnN0IHJhd1JlcGVhdGFibGVDb2x1bW5zID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XG4gICAgICBpZiAocm93LnRhYmxlX2ZpZWxkKSB7XG4gICAgICAgIGlmICghcmF3UmVwZWF0YWJsZUNvbHVtbnNbcm93LnRhYmxlX2ZpZWxkXSkge1xuICAgICAgICAgIHJhd1JlcGVhdGFibGVDb2x1bW5zW3Jvdy50YWJsZV9maWVsZF0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJhd1JlcGVhdGFibGVDb2x1bW5zW3Jvdy50YWJsZV9maWVsZF0ucHVzaChyb3cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmF3Rm9ybUNvbHVtbnMucHVzaChyb3cpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7cmF3Rm9ybUNvbHVtbnMsIHJhd1JlcGVhdGFibGVDb2x1bW5zfTtcbiAgfVxufVxuIl19