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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3V0aWxzL3NjaGVtYS1sb2FkZXIuanMiXSwibmFtZXMiOlsiU2NoZW1hTG9hZGVyIiwibG9hZEZvcm1TY2hlbWEiLCJmb3JtIiwiY29scyIsImxvYWRDb2x1bW5zIiwicmF3Rm9ybUNvbHVtbnMiLCJyYXdSZXBlYXRhYmxlQ29sdW1ucyIsImZ1bGxTY2hlbWEiLCJ0YWJsZU5hbWVzIiwicm93SUQiLCJyZXBlYXRhYmxlcyIsImVsZW1lbnRzT2ZUeXBlIiwicmVwZWF0YWJsZSIsInB1c2giLCJrZXkiLCJzcWwiLCJyb3dzIiwiZGIiLCJhbGwiLCJyb3ciLCJ0YWJsZV9maWVsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsWUFBTixDQUFtQjtBQUNoQyxTQUFhQyxjQUFiLENBQTRCQyxJQUE1QixFQUFrQztBQUFBOztBQUFBO0FBQ2hDLFlBQU1DLE9BQU8sTUFBTSxNQUFLQyxXQUFMLENBQWlCRixJQUFqQixDQUFuQjs7QUFFQSxhQUFPLGdDQUFlQSxJQUFmLEVBQXFCQyxLQUFLRSxjQUExQixFQUEwQ0YsS0FBS0csb0JBQS9DLEVBQXFFLEVBQUNDLFlBQVksSUFBYixFQUFyRSxDQUFQO0FBSGdDO0FBSWpDOztBQUVELFNBQWFILFdBQWIsQ0FBeUJGLElBQXpCLEVBQStCO0FBQUE7QUFDN0IsWUFBTU0sYUFBYSxDQUNoQixRQUFPTixLQUFLTyxLQUFNLE9BREYsQ0FBbkI7O0FBSUEsWUFBTUMsY0FBY1IsS0FBS1MsY0FBTCxDQUFvQixZQUFwQixDQUFwQjs7QUFFQSxXQUFLLE1BQU1DLFVBQVgsSUFBeUJGLFdBQXpCLEVBQXNDO0FBQ3BDRixtQkFBV0ssSUFBWCxDQUFpQixRQUFPWCxLQUFLTyxLQUFNLElBQUdHLFdBQVdFLEdBQUksT0FBckQ7QUFDRDs7QUFFRCxZQUFNQyxNQUFNLHdCQUFVOzs7Ozs7Ozs7Ozs7O0tBQVYsRUFhVFAsVUFiUyxDQUFaOztBQWVBLFlBQU1RLE9BQU8sTUFBTWQsS0FBS2UsRUFBTCxDQUFRQyxHQUFSLENBQVlILEdBQVosQ0FBbkI7O0FBRUEsWUFBTVYsaUJBQWlCLEVBQXZCO0FBQ0EsWUFBTUMsdUJBQXVCLEVBQTdCOztBQUVBLFdBQUssTUFBTWEsR0FBWCxJQUFrQkgsSUFBbEIsRUFBd0I7QUFDdEIsWUFBSUcsSUFBSUMsV0FBUixFQUFxQjtBQUNuQixjQUFJLENBQUNkLHFCQUFxQmEsSUFBSUMsV0FBekIsQ0FBTCxFQUE0QztBQUMxQ2QsaUNBQXFCYSxJQUFJQyxXQUF6QixJQUF3QyxFQUF4QztBQUNEOztBQUVEZCwrQkFBcUJhLElBQUlDLFdBQXpCLEVBQXNDUCxJQUF0QyxDQUEyQ00sR0FBM0M7QUFDRCxTQU5ELE1BTU87QUFDTGQseUJBQWVRLElBQWYsQ0FBb0JNLEdBQXBCO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLEVBQUNkLGNBQUQsRUFBaUJDLG9CQUFqQixFQUFQO0FBM0M2QjtBQTRDOUI7QUFuRCtCO2tCQUFiTixZIiwiZmlsZSI6InNjaGVtYS1sb2FkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGb3JtU2NoZW1hIH0gZnJvbSAnZnVsY3J1bS1xdWVyeS1zcWwnO1xyXG5pbXBvcnQgcGdmb3JtYXQgZnJvbSAncGctZm9ybWF0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjaGVtYUxvYWRlciB7XHJcbiAgc3RhdGljIGFzeW5jIGxvYWRGb3JtU2NoZW1hKGZvcm0pIHtcclxuICAgIGNvbnN0IGNvbHMgPSBhd2FpdCB0aGlzLmxvYWRDb2x1bW5zKGZvcm0pO1xyXG5cclxuICAgIHJldHVybiBuZXcgRm9ybVNjaGVtYShmb3JtLCBjb2xzLnJhd0Zvcm1Db2x1bW5zLCBjb2xzLnJhd1JlcGVhdGFibGVDb2x1bW5zLCB7ZnVsbFNjaGVtYTogdHJ1ZX0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFzeW5jIGxvYWRDb2x1bW5zKGZvcm0pIHtcclxuICAgIGNvbnN0IHRhYmxlTmFtZXMgPSBbXHJcbiAgICAgIGBmb3JtXyR7Zm9ybS5yb3dJRH1fdmlld2BcclxuICAgIF07XHJcblxyXG4gICAgY29uc3QgcmVwZWF0YWJsZXMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJyk7XHJcblxyXG4gICAgZm9yIChjb25zdCByZXBlYXRhYmxlIG9mIHJlcGVhdGFibGVzKSB7XHJcbiAgICAgIHRhYmxlTmFtZXMucHVzaChgZm9ybV8ke2Zvcm0ucm93SUR9XyR7cmVwZWF0YWJsZS5rZXl9X3ZpZXdgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzcWwgPSBwZ2Zvcm1hdChgXHJcblNFTEVDVFxyXG4gIHRhYmxlcy5maWVsZCBBUyB0YWJsZV9maWVsZCxcclxuICBjb2x1bW5zLm5hbWUsXHJcbiAgY29sdW1ucy5vcmRpbmFsLFxyXG4gIGNvbHVtbnMuZmllbGQsXHJcbiAgY29sdW1ucy50eXBlLFxyXG4gIGNvbHVtbnMucGFydFxyXG5GUk9NIGNvbHVtbnNcclxuSU5ORVIgSk9JTiB0YWJsZXMgT04gY29sdW1ucy50YWJsZV9uYW1lID0gdGFibGVzLm5hbWVcclxuV0hFUkVcclxuICBjb2x1bW5zLnRhYmxlX25hbWUgSU4gKCVMKVxyXG5PUkRFUiBCWSBjb2x1bW5zLnRhYmxlX25hbWUsIGNvbHVtbnMub3JkaW5hbFxyXG4gICAgYCwgdGFibGVOYW1lcyk7XHJcblxyXG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IGZvcm0uZGIuYWxsKHNxbCk7XHJcblxyXG4gICAgY29uc3QgcmF3Rm9ybUNvbHVtbnMgPSBbXTtcclxuICAgIGNvbnN0IHJhd1JlcGVhdGFibGVDb2x1bW5zID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICBpZiAocm93LnRhYmxlX2ZpZWxkKSB7XHJcbiAgICAgICAgaWYgKCFyYXdSZXBlYXRhYmxlQ29sdW1uc1tyb3cudGFibGVfZmllbGRdKSB7XHJcbiAgICAgICAgICByYXdSZXBlYXRhYmxlQ29sdW1uc1tyb3cudGFibGVfZmllbGRdID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByYXdSZXBlYXRhYmxlQ29sdW1uc1tyb3cudGFibGVfZmllbGRdLnB1c2gocm93KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByYXdGb3JtQ29sdW1ucy5wdXNoKHJvdyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge3Jhd0Zvcm1Db2x1bW5zLCByYXdSZXBlYXRhYmxlQ29sdW1uc307XHJcbiAgfVxyXG59XHJcbiJdfQ==