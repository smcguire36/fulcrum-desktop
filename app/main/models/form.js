'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minidb = require('minidb');

var _fulcrumCore = require('fulcrum-core');

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Form extends _fulcrumCore.Form {
  static get tableName() {
    return 'forms';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'version', column: 'version', type: 'integer', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'elementsJSON', column: 'elements', type: 'json', null: false }, { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' }, { name: 'statusFieldJSON', column: 'status_field', type: 'json' }, { name: 'geometryTypes', column: 'geometry_types', type: 'json' }, { name: 'geometryRequired', column: 'geometry_required', type: 'boolean' }, { name: 'projectEnabled', column: 'projects_enabled', type: 'boolean' }, { name: 'assignmentEnabled', column: 'assignment_enabled', type: 'boolean' }, { name: 'autoAssign', column: 'auto_assign', type: 'boolean' }, { name: 'hiddenOnDashboard', column: 'hidden_on_dashboard', type: 'boolean' }, { name: 'image', column: 'image', type: 'string' }, { name: 'imageLarge', column: 'image_large', type: 'string' }, { name: 'imageSmall', column: 'image_small', type: 'string' }, { name: 'imageThumbnail', column: 'image_thumbnail', type: 'string' }, { name: 'lastSync', column: 'last_sync', type: 'datetime' }, { name: 'script', column: 'script', type: 'string' }, { name: 'createdAt', column: 'server_created_at', type: 'datetime' }, { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }

  findEachRecord(where, callback) {
    return _record2.default.findEach(this.db, { where: _extends({}, where, { form_id: this.rowID }) }, callback);
  }

  findRecordsBySQL(sql, values) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const tableName = `account_${_this._accountRowID}_form_${_this.rowID}_view_full`;

      sql = 'SELECT * FROM ' + tableName + (sql ? ' WHERE ' + sql : '');

      const rows = yield _this.db.all(sql, values);

      const records = [];

      for (const row of rows) {
        const attributes = _record2.default.queryRowToAttributes(row);

        const record = new _record2.default(attributes, _this);

        record._db = _this.db;

        records.push(record);
      }

      return records;
    })();
  }
}

exports.default = Form;
_minidb.PersistentObject.register(Form);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9mb3JtLmpzIl0sIm5hbWVzIjpbIkZvcm0iLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiZmluZEVhY2hSZWNvcmQiLCJ3aGVyZSIsImNhbGxiYWNrIiwiZmluZEVhY2giLCJkYiIsImZvcm1faWQiLCJyb3dJRCIsImZpbmRSZWNvcmRzQnlTUUwiLCJzcWwiLCJ2YWx1ZXMiLCJfYWNjb3VudFJvd0lEIiwicm93cyIsImFsbCIsInJlY29yZHMiLCJyb3ciLCJhdHRyaWJ1dGVzIiwicXVlcnlSb3dUb0F0dHJpYnV0ZXMiLCJyZWNvcmQiLCJfZGIiLCJwdXNoIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsSUFBTiwyQkFBNEI7QUFDekMsYUFBV0MsU0FBWCxHQUF1QjtBQUNyQixXQUFPLE9BQVA7QUFDRDs7QUFFRCxhQUFXQyxPQUFYLEdBQXFCO0FBQ25CLFdBQU8sQ0FDTCxFQUFFQyxNQUFNLGNBQVIsRUFBd0JDLFFBQVEsWUFBaEMsRUFBOENDLE1BQU0sU0FBcEQsRUFBK0RDLE1BQU0sS0FBckUsRUFESyxFQUVMLEVBQUVILE1BQU0sSUFBUixFQUFjQyxRQUFRLGFBQXRCLEVBQXFDQyxNQUFNLFFBQTNDLEVBQXFEQyxNQUFNLEtBQTNELEVBRkssRUFHTCxFQUFFSCxNQUFNLE1BQVIsRUFBZ0JDLFFBQVEsTUFBeEIsRUFBZ0NDLE1BQU0sUUFBdEMsRUFBZ0RDLE1BQU0sS0FBdEQsRUFISyxFQUlMLEVBQUVILE1BQU0sU0FBUixFQUFtQkMsUUFBUSxTQUEzQixFQUFzQ0MsTUFBTSxTQUE1QyxFQUF1REMsTUFBTSxLQUE3RCxFQUpLLEVBS0wsRUFBRUgsTUFBTSxhQUFSLEVBQXVCQyxRQUFRLGFBQS9CLEVBQThDQyxNQUFNLFFBQXBELEVBTEssRUFNTCxFQUFFRixNQUFNLGNBQVIsRUFBd0JD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bkJrQztBQW9CbkM7QUF6RHdDOztrQkFBdEJwQixJO0FBNERyQix5QkFBaUIyQixRQUFqQixDQUEwQjNCLElBQTFCIiwiZmlsZSI6ImZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcclxuaW1wb3J0IHsgRm9ybSBhcyBGb3JtQmFzZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XHJcbmltcG9ydCBSZWNvcmQgZnJvbSAnLi9yZWNvcmQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ybSBleHRlbmRzIEZvcm1CYXNlIHtcclxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcclxuICAgIHJldHVybiAnZm9ybXMnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBjb2x1bW5zKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgeyBuYW1lOiAnYWNjb3VudFJvd0lEJywgY29sdW1uOiAnYWNjb3VudF9pZCcsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnaWQnLCBjb2x1bW46ICdyZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICduYW1lJywgY29sdW1uOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICd2ZXJzaW9uJywgY29sdW1uOiAndmVyc2lvbicsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnZGVzY3JpcHRpb24nLCBjb2x1bW46ICdkZXNjcmlwdGlvbicsIHR5cGU6ICdzdHJpbmcnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2VsZW1lbnRzSlNPTicsIGNvbHVtbjogJ2VsZW1lbnRzJywgdHlwZTogJ2pzb24nLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICd0aXRsZUZpZWxkS2V5c0pTT04nLCBjb2x1bW46ICd0aXRsZV9maWVsZF9rZXlzJywgdHlwZTogJ2pzb24nIH0sXHJcbiAgICAgIHsgbmFtZTogJ3N0YXR1c0ZpZWxkSlNPTicsIGNvbHVtbjogJ3N0YXR1c19maWVsZCcsIHR5cGU6ICdqc29uJyB9LFxyXG4gICAgICB7IG5hbWU6ICdnZW9tZXRyeVR5cGVzJywgY29sdW1uOiAnZ2VvbWV0cnlfdHlwZXMnLCB0eXBlOiAnanNvbicgfSxcclxuICAgICAgeyBuYW1lOiAnZ2VvbWV0cnlSZXF1aXJlZCcsIGNvbHVtbjogJ2dlb21ldHJ5X3JlcXVpcmVkJywgdHlwZTogJ2Jvb2xlYW4nIH0sXHJcbiAgICAgIHsgbmFtZTogJ3Byb2plY3RFbmFibGVkJywgY29sdW1uOiAncHJvamVjdHNfZW5hYmxlZCcsIHR5cGU6ICdib29sZWFuJyB9LFxyXG4gICAgICB7IG5hbWU6ICdhc3NpZ25tZW50RW5hYmxlZCcsIGNvbHVtbjogJ2Fzc2lnbm1lbnRfZW5hYmxlZCcsIHR5cGU6ICdib29sZWFuJyB9LFxyXG4gICAgICB7IG5hbWU6ICdhdXRvQXNzaWduJywgY29sdW1uOiAnYXV0b19hc3NpZ24nLCB0eXBlOiAnYm9vbGVhbicgfSxcclxuICAgICAgeyBuYW1lOiAnaGlkZGVuT25EYXNoYm9hcmQnLCBjb2x1bW46ICdoaWRkZW5fb25fZGFzaGJvYXJkJywgdHlwZTogJ2Jvb2xlYW4nIH0sXHJcbiAgICAgIHsgbmFtZTogJ2ltYWdlJywgY29sdW1uOiAnaW1hZ2UnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdpbWFnZUxhcmdlJywgY29sdW1uOiAnaW1hZ2VfbGFyZ2UnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdpbWFnZVNtYWxsJywgY29sdW1uOiAnaW1hZ2Vfc21hbGwnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdpbWFnZVRodW1ibmFpbCcsIGNvbHVtbjogJ2ltYWdlX3RodW1ibmFpbCcsIHR5cGU6ICdzdHJpbmcnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jJywgY29sdW1uOiAnbGFzdF9zeW5jJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxyXG4gICAgICB7IG5hbWU6ICdzY3JpcHQnLCBjb2x1bW46ICdzY3JpcHQnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfY3JlYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcclxuICAgICAgeyBuYW1lOiAndXBkYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX3VwZGF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2RlbGV0ZWRBdCcsIGNvbHVtbjogJ2RlbGV0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH1cclxuICAgIF07XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaFJlY29yZCh3aGVyZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBSZWNvcmQuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGZvcm1faWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZmluZFJlY29yZHNCeVNRTChzcWwsIHZhbHVlcykge1xyXG4gICAgY29uc3QgdGFibGVOYW1lID0gYGFjY291bnRfJHt0aGlzLl9hY2NvdW50Um93SUR9X2Zvcm1fJHt0aGlzLnJvd0lEfV92aWV3X2Z1bGxgO1xyXG5cclxuICAgIHNxbCA9ICdTRUxFQ1QgKiBGUk9NICcgKyB0YWJsZU5hbWUgKyAoc3FsID8gJyBXSEVSRSAnICsgc3FsIDogJycpO1xyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBhd2FpdCB0aGlzLmRiLmFsbChzcWwsIHZhbHVlcyk7XHJcblxyXG4gICAgY29uc3QgcmVjb3JkcyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgY29uc3QgYXR0cmlidXRlcyA9IFJlY29yZC5xdWVyeVJvd1RvQXR0cmlidXRlcyhyb3cpO1xyXG5cclxuICAgICAgY29uc3QgcmVjb3JkID0gbmV3IFJlY29yZChhdHRyaWJ1dGVzLCB0aGlzKTtcclxuXHJcbiAgICAgIHJlY29yZC5fZGIgPSB0aGlzLmRiO1xyXG5cclxuICAgICAgcmVjb3Jkcy5wdXNoKHJlY29yZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlY29yZHM7XHJcbiAgfVxyXG59XHJcblxyXG5QZXJzaXN0ZW50T2JqZWN0LnJlZ2lzdGVyKEZvcm0pO1xyXG4iXX0=