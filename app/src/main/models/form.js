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
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'name', column: 'name', type: 'string', null: false }, { name: 'version', column: 'version', type: 'integer', null: false }, { name: 'description', column: 'description', type: 'string' }, { name: 'elementsJSON', column: 'elements', type: 'json', null: false }, { name: 'titleFieldKeysJSON', column: 'title_field_keys', type: 'json' }, { name: 'statusFieldJSON', column: 'status_field', type: 'json' }, { name: 'lastSync', column: 'last_sync', type: 'datetime' }, { name: 'createdAt', column: 'created_at', type: 'datetime', null: false }, { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9mb3JtLmpzIl0sIm5hbWVzIjpbIkZvcm0iLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwiZmluZEVhY2hSZWNvcmQiLCJ3aGVyZSIsImNhbGxiYWNrIiwiZmluZEVhY2giLCJkYiIsImZvcm1faWQiLCJyb3dJRCIsImZpbmRSZWNvcmRzQnlTUUwiLCJzcWwiLCJ2YWx1ZXMiLCJfYWNjb3VudFJvd0lEIiwicm93cyIsImFsbCIsInJlY29yZHMiLCJyb3ciLCJhdHRyaWJ1dGVzIiwicXVlcnlSb3dUb0F0dHJpYnV0ZXMiLCJyZWNvcmQiLCJfZGIiLCJwdXNoIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsSUFBTiwyQkFBNEI7QUFDekMsYUFBV0MsU0FBWCxHQUF1QjtBQUNyQixXQUFPLE9BQVA7QUFDRDs7QUFFRCxhQUFXQyxPQUFYLEdBQXFCO0FBQ25CLFdBQU8sQ0FDTCxFQUFFQyxNQUFNLGNBQVIsRUFBd0JDLFFBQVEsWUFBaEMsRUFBOENDLE1BQU0sU0FBcEQsRUFBK0RDLE1BQU0sS0FBckUsRUFESyxFQUVMLEVBQUVILE1BQU0sSUFBUixFQUFjQyxRQUFRLGFBQXRCLEVBQXFDQyxNQUFNLFFBQTNDLEVBQXFEQyxNQUFNLEtBQTNELEVBRkssRUFHTCxFQUFFSCxNQUFNLE1BQVIsRUFBZ0JDLFFBQVEsTUFBeEIsRUFBZ0NDLE1BQU0sUUFBdEMsRUFBZ0RDLE1BQU0sS0FBdEQsRUFISyxFQUlMLEVBQUVILE1BQU0sU0FBUixFQUFtQkMsUUFBUSxTQUEzQixFQUFzQ0MsTUFBTSxTQUE1QyxFQUF1REMsTUFBTSxLQUE3RCxFQUpLLEVBS0wsRUFBRUgsTUFBTSxhQUFSLEVBQXVCQyxRQUFRLGFBQS9CLEVBQThDQyxNQUFNLFFBQXBELEVBTEssRUFNTCxFQUFFRixNQUFNLGNBQVIsRUFBd0JDLFFBQVEsVUFBaEMsRUFBNENDLE1BQU0sTUFBbEQsRUFBMERDLE1BQU0sS0FBaEUsRUFOSyxFQU9MLEVBQUVILE1BQU0sb0JBQVIsRUFBOEJDLFFBQVEsa0JBQXRDLEVBQTBEQyxNQUFNLE1BQWhFLEVBUEssRUFRTCxFQUFFRixNQUFNLGlCQUFSLEVBQTJCQyxRQUFRLGNBQW5DLEVBQW1EQyxNQUFNLE1BQXpELEVBUkssRUFTTCxFQUFFRixNQUFNLFVBQVIsRUFBb0JDLFFBQVEsV0FBNUIsRUFBeUNDLE1BQU0sVUFBL0MsRUFUSyxFQVVMLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxZQUE3QixFQUEyQ0MsTUFBTSxVQUFqRCxFQUE2REMsTUFBTSxLQUFuRSxFQVZLLEVBV0wsRUFBRUgsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLFlBQTdCLEVBQTJDQyxNQUFNLFVBQWpELEVBQTZEQyxNQUFNLEtBQW5FLEVBWEssRUFZTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsWUFBN0IsRUFBMkNDLE1BQU0sVUFBakQsRUFaSyxDQUFQO0FBY0Q7O0FBRURFLGlCQUFlQyxLQUFmLEVBQXNCQyxRQUF0QixFQUFnQztBQUM5QixXQUFPLGlCQUFPQyxRQUFQLENBQWdCLEtBQUtDLEVBQXJCLEVBQXlCLEVBQUNILG9CQUFXQSxLQUFYLElBQWtCSSxTQUFTLEtBQUtDLEtBQWhDLEdBQUQsRUFBekIsRUFBbUVKLFFBQW5FLENBQVA7QUFDRDs7QUFFS0ssa0JBQU4sQ0FBdUJDLEdBQXZCLEVBQTRCQyxNQUE1QixFQUFvQztBQUFBOztBQUFBO0FBQ2xDLFlBQU1mLFlBQWEsV0FBVSxNQUFLZ0IsYUFBYyxTQUFRLE1BQUtKLEtBQU0sWUFBbkU7O0FBRUFFLFlBQU0sbUJBQW1CZCxTQUFuQixJQUFnQ2MsTUFBTSxZQUFZQSxHQUFsQixHQUF3QixFQUF4RCxDQUFOOztBQUVBLFlBQU1HLE9BQU8sTUFBTSxNQUFLUCxFQUFMLENBQVFRLEdBQVIsQ0FBWUosR0FBWixFQUFpQkMsTUFBakIsQ0FBbkI7O0FBRUEsWUFBTUksVUFBVSxFQUFoQjs7QUFFQSxXQUFLLE1BQU1DLEdBQVgsSUFBa0JILElBQWxCLEVBQXdCO0FBQ3RCLGNBQU1JLGFBQWEsaUJBQU9DLG9CQUFQLENBQTRCRixHQUE1QixDQUFuQjs7QUFFQSxjQUFNRyxTQUFTLHFCQUFXRixVQUFYLFFBQWY7O0FBRUFFLGVBQU9DLEdBQVAsR0FBYSxNQUFLZCxFQUFsQjs7QUFFQVMsZ0JBQVFNLElBQVIsQ0FBYUYsTUFBYjtBQUNEOztBQUVELGFBQU9KLE9BQVA7QUFuQmtDO0FBb0JuQztBQTlDd0M7O2tCQUF0QnBCLEk7QUFpRHJCLHlCQUFpQjJCLFFBQWpCLENBQTBCM0IsSUFBMUIiLCJmaWxlIjoiZm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IHsgRm9ybSBhcyBGb3JtQmFzZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgUmVjb3JkIGZyb20gJy4vcmVjb3JkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRm9ybSBleHRlbmRzIEZvcm1CYXNlIHtcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdmb3Jtcyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdpZCcsIGNvbHVtbjogJ3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICduYW1lJywgY29sdW1uOiAnbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAndmVyc2lvbicsIGNvbHVtbjogJ3ZlcnNpb24nLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdkZXNjcmlwdGlvbicsIGNvbHVtbjogJ2Rlc2NyaXB0aW9uJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2VsZW1lbnRzSlNPTicsIGNvbHVtbjogJ2VsZW1lbnRzJywgdHlwZTogJ2pzb24nLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAndGl0bGVGaWVsZEtleXNKU09OJywgY29sdW1uOiAndGl0bGVfZmllbGRfa2V5cycsIHR5cGU6ICdqc29uJyB9LFxuICAgICAgeyBuYW1lOiAnc3RhdHVzRmllbGRKU09OJywgY29sdW1uOiAnc3RhdHVzX2ZpZWxkJywgdHlwZTogJ2pzb24nIH0sXG4gICAgICB7IG5hbWU6ICdsYXN0U3luYycsIGNvbHVtbjogJ2xhc3Rfc3luYycsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2NyZWF0ZWRBdCcsIGNvbHVtbjogJ2NyZWF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAndXBkYXRlZEF0JywgY29sdW1uOiAndXBkYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdkZWxldGVkQXQnLCBjb2x1bW46ICdkZWxldGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJyB9XG4gICAgXTtcbiAgfVxuXG4gIGZpbmRFYWNoUmVjb3JkKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGZvcm1faWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgYXN5bmMgZmluZFJlY29yZHNCeVNRTChzcWwsIHZhbHVlcykge1xuICAgIGNvbnN0IHRhYmxlTmFtZSA9IGBhY2NvdW50XyR7dGhpcy5fYWNjb3VudFJvd0lEfV9mb3JtXyR7dGhpcy5yb3dJRH1fdmlld19mdWxsYDtcblxuICAgIHNxbCA9ICdTRUxFQ1QgKiBGUk9NICcgKyB0YWJsZU5hbWUgKyAoc3FsID8gJyBXSEVSRSAnICsgc3FsIDogJycpO1xuXG4gICAgY29uc3Qgcm93cyA9IGF3YWl0IHRoaXMuZGIuYWxsKHNxbCwgdmFsdWVzKTtcblxuICAgIGNvbnN0IHJlY29yZHMgPSBbXTtcblxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBSZWNvcmQucXVlcnlSb3dUb0F0dHJpYnV0ZXMocm93KTtcblxuICAgICAgY29uc3QgcmVjb3JkID0gbmV3IFJlY29yZChhdHRyaWJ1dGVzLCB0aGlzKTtcblxuICAgICAgcmVjb3JkLl9kYiA9IHRoaXMuZGI7XG5cbiAgICAgIHJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJldHVybiByZWNvcmRzO1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoRm9ybSk7XG4iXX0=