'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

var _fulcrumCore = require('fulcrum-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Membership {
  constructor(attributes) {
    this.updateFromAPIAttributes(attributes);
  }

  updateFromAPIAttributes(attrs) {
    const attributes = attrs || {};

    this._id = attributes.id;
    this._firstName = attributes.first_name;
    this._lastName = attributes.last_name;
    this._userID = attributes.user_id;
    this._email = attributes.email;
    this._roleID = attributes.role_id;
    this._createdAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.created_at);
    this._updatedAt = _fulcrumCore.DateUtils.parseISOTimestamp(attributes.updated_at);
  }

  get id() {
    return this._id;
  }

  static get tableName() {
    return 'memberships';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'userID', column: 'user_resource_id', type: 'string', null: false }, { name: 'roleID', column: 'role_resource_id', type: 'string', null: false }, { name: 'roleRowID', column: 'role_id', type: 'integer', null: false }, { name: 'email', column: 'email', type: 'string', null: false }, { name: 'firstName', column: 'first_name', type: 'string', null: false }, { name: 'lastName', column: 'last_name', type: 'string', null: false }, { name: 'createdAt', column: 'server_created_at', type: 'datetime' }, { name: 'updatedAt', column: 'server_updated_at', type: 'datetime' }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
  }

  getLocalRole() {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._role = yield _role2.default.findFirst(_this.db, { resource_id: _this._roleID });
      _this._roleRowID = _this._role ? _this._role.rowID : null;
      return _this._role;
    })();
  }

  // role
  getRole() {
    return this.loadOne('role', _role2.default);
  }

  get role() {
    return this._role;
  }

  set role(role) {
    this.setOne('role', role);
  }
}

exports.default = Membership;
_minidb.PersistentObject.register(Membership);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9tZW1iZXJzaGlwLmpzIl0sIm5hbWVzIjpbIk1lbWJlcnNoaXAiLCJjb25zdHJ1Y3RvciIsImF0dHJpYnV0ZXMiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImF0dHJzIiwiX2lkIiwiaWQiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl91c2VySUQiLCJ1c2VyX2lkIiwiX2VtYWlsIiwiZW1haWwiLCJfcm9sZUlEIiwicm9sZV9pZCIsIl9jcmVhdGVkQXQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsImNyZWF0ZWRfYXQiLCJfdXBkYXRlZEF0IiwidXBkYXRlZF9hdCIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJnZXRMb2NhbFJvbGUiLCJfcm9sZSIsImZpbmRGaXJzdCIsImRiIiwicmVzb3VyY2VfaWQiLCJfcm9sZVJvd0lEIiwicm93SUQiLCJnZXRSb2xlIiwibG9hZE9uZSIsInJvbGUiLCJzZXRPbmUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsVUFBTixDQUFpQjtBQUM5QkMsY0FBWUMsVUFBWixFQUF3QjtBQUN0QixTQUFLQyx1QkFBTCxDQUE2QkQsVUFBN0I7QUFDRDs7QUFFREMsMEJBQXdCQyxLQUF4QixFQUErQjtBQUM3QixVQUFNRixhQUFhRSxTQUFTLEVBQTVCOztBQUVBLFNBQUtDLEdBQUwsR0FBV0gsV0FBV0ksRUFBdEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCTCxXQUFXTSxVQUE3QjtBQUNBLFNBQUtDLFNBQUwsR0FBaUJQLFdBQVdRLFNBQTVCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlVCxXQUFXVSxPQUExQjtBQUNBLFNBQUtDLE1BQUwsR0FBY1gsV0FBV1ksS0FBekI7QUFDQSxTQUFLQyxPQUFMLEdBQWViLFdBQVdjLE9BQTFCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQix1QkFBVUMsaUJBQVYsQ0FBNEJoQixXQUFXaUIsVUFBdkMsQ0FBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLHVCQUFVRixpQkFBVixDQUE0QmhCLFdBQVdtQixVQUF2QyxDQUFsQjtBQUNEOztBQUVELE1BQUlmLEVBQUosR0FBUztBQUNQLFdBQU8sS0FBS0QsR0FBWjtBQUNEOztBQUVELGFBQVdpQixTQUFYLEdBQXVCO0FBQ3JCLFdBQU8sYUFBUDtBQUNEOztBQUVELGFBQVdDLE9BQVgsR0FBcUI7QUFDbkIsV0FBTyxDQUNMLEVBQUVDLE1BQU0sY0FBUixFQUF3QkMsUUFBUSxZQUFoQyxFQUE4Q0MsTUFBTSxTQUFwRCxFQUErREMsTUFBTSxLQUFyRSxFQURLLEVBRUwsRUFBRUgsTUFBTSxJQUFSLEVBQWNDLFFBQVEsYUFBdEIsRUFBcUNDLE1BQU0sUUFBM0MsRUFBcURDLE1BQU0sS0FBM0QsRUFGSyxFQUdMLEVBQUVILE1BQU0sUUFBUixFQUFrQkMsUUFBUSxrQkFBMUIsRUFBOENDLE1BQU0sUUFBcEQsRUFBOERDLE1BQU0sS0FBcEUsRUFISyxFQUlMLEVBQUVILE1BQU0sUUFBUixFQUFrQkMsUUFBUSxrQkFBMUIsRUFBOENDLE1BQU0sUUFBcEQsRUFBOERDLE1BQU0sS0FBcEUsRUFKSyxFQUtMLEVBQUVILE1BQU0sV0FBUixFQUFxQkMsUUFBUSxTQUE3QixFQUF3Q0MsTUFBTSxTQUE5QyxFQUF5REMsTUFBTSxLQUEvRCxFQUxLLEVBTUwsRUFBRUgsTUFBTSxPQUFSLEVBQWlCQyxRQUFRLE9BQXpCLEVBQWtDQyxNQUFNLFFBQXhDLEVBQWtEQyxNQUFNLEtBQXhELEVBTkssRUFPTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsWUFBN0IsRUFBMkNDLE1BQU0sUUFBakQsRUFBMkRDLE1BQU0sS0FBakUsRUFQSyxFQVFMLEVBQUVILE1BQU0sVUFBUixFQUFvQkMsUUFBUSxXQUE1QixFQUF5Q0MsTUFBTSxRQUEvQyxFQUF5REMsTUFBTSxLQUEvRCxFQVJLLEVBU0wsRUFBRUgsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLG1CQUE3QixFQUFrREMsTUFBTSxVQUF4RCxFQVRLLEVBVUwsRUFBRUYsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLG1CQUE3QixFQUFrREMsTUFBTSxVQUF4RCxFQVZLLEVBV0wsRUFBRUYsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLFlBQTdCLEVBQTJDQyxNQUFNLFVBQWpELEVBWEssQ0FBUDtBQWFEOztBQUVLRSxjQUFOLEdBQXFCO0FBQUE7O0FBQUE7QUFDbkIsWUFBS0MsS0FBTCxHQUFhLE1BQU0sZUFBS0MsU0FBTCxDQUFlLE1BQUtDLEVBQXBCLEVBQXdCLEVBQUNDLGFBQWEsTUFBS2pCLE9BQW5CLEVBQXhCLENBQW5CO0FBQ0EsWUFBS2tCLFVBQUwsR0FBa0IsTUFBS0osS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0ssS0FBeEIsR0FBZ0MsSUFBbEQ7QUFDQSxhQUFPLE1BQUtMLEtBQVo7QUFIbUI7QUFJcEI7O0FBRUQ7QUFDQU0sWUFBVTtBQUNSLFdBQU8sS0FBS0MsT0FBTCxDQUFhLE1BQWIsaUJBQVA7QUFDRDs7QUFFRCxNQUFJQyxJQUFKLEdBQVc7QUFDVCxXQUFPLEtBQUtSLEtBQVo7QUFDRDs7QUFFRCxNQUFJUSxJQUFKLENBQVNBLElBQVQsRUFBZTtBQUNiLFNBQUtDLE1BQUwsQ0FBWSxNQUFaLEVBQW9CRCxJQUFwQjtBQUNEO0FBM0Q2Qjs7a0JBQVhyQyxVO0FBOERyQix5QkFBaUJ1QyxRQUFqQixDQUEwQnZDLFVBQTFCIiwiZmlsZSI6Im1lbWJlcnNoaXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCBSb2xlIGZyb20gJy4vcm9sZSc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1iZXJzaGlwIHtcbiAgY29uc3RydWN0b3IoYXR0cmlidXRlcykge1xuICAgIHRoaXMudXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XG4gIH1cblxuICB1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRycykge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBhdHRycyB8fCB7fTtcblxuICAgIHRoaXMuX2lkID0gYXR0cmlidXRlcy5pZDtcbiAgICB0aGlzLl9maXJzdE5hbWUgPSBhdHRyaWJ1dGVzLmZpcnN0X25hbWU7XG4gICAgdGhpcy5fbGFzdE5hbWUgPSBhdHRyaWJ1dGVzLmxhc3RfbmFtZTtcbiAgICB0aGlzLl91c2VySUQgPSBhdHRyaWJ1dGVzLnVzZXJfaWQ7XG4gICAgdGhpcy5fZW1haWwgPSBhdHRyaWJ1dGVzLmVtYWlsO1xuICAgIHRoaXMuX3JvbGVJRCA9IGF0dHJpYnV0ZXMucm9sZV9pZDtcbiAgICB0aGlzLl9jcmVhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy5jcmVhdGVkX2F0KTtcbiAgICB0aGlzLl91cGRhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KTtcbiAgfVxuXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5faWQ7XG4gIH1cblxuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ21lbWJlcnNoaXBzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgeyBuYW1lOiAnYWNjb3VudFJvd0lEJywgY29sdW1uOiAnYWNjb3VudF9pZCcsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2lkJywgY29sdW1uOiAncmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ3VzZXJJRCcsIGNvbHVtbjogJ3VzZXJfcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ3JvbGVJRCcsIGNvbHVtbjogJ3JvbGVfcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ3JvbGVSb3dJRCcsIGNvbHVtbjogJ3JvbGVfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdlbWFpbCcsIGNvbHVtbjogJ2VtYWlsJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdmaXJzdE5hbWUnLCBjb2x1bW46ICdmaXJzdF9uYW1lJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdsYXN0TmFtZScsIGNvbHVtbjogJ2xhc3RfbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnY3JlYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX2NyZWF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICd1cGRhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfdXBkYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2RlbGV0ZWRBdCcsIGNvbHVtbjogJ2RlbGV0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH1cbiAgICBdO1xuICB9XG5cbiAgYXN5bmMgZ2V0TG9jYWxSb2xlKCkge1xuICAgIHRoaXMuX3JvbGUgPSBhd2FpdCBSb2xlLmZpbmRGaXJzdCh0aGlzLmRiLCB7cmVzb3VyY2VfaWQ6IHRoaXMuX3JvbGVJRH0pO1xuICAgIHRoaXMuX3JvbGVSb3dJRCA9IHRoaXMuX3JvbGUgPyB0aGlzLl9yb2xlLnJvd0lEIDogbnVsbDtcbiAgICByZXR1cm4gdGhpcy5fcm9sZTtcbiAgfVxuXG4gIC8vIHJvbGVcbiAgZ2V0Um9sZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sb2FkT25lKCdyb2xlJywgUm9sZSk7XG4gIH1cblxuICBnZXQgcm9sZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcm9sZTtcbiAgfVxuXG4gIHNldCByb2xlKHJvbGUpIHtcbiAgICB0aGlzLnNldE9uZSgncm9sZScsIHJvbGUpO1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoTWVtYmVyc2hpcCk7XG4iXX0=