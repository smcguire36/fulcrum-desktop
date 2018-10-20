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

  get updatedAt() {
    return this._updatedAt;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9tZW1iZXJzaGlwLmpzIl0sIm5hbWVzIjpbIk1lbWJlcnNoaXAiLCJjb25zdHJ1Y3RvciIsImF0dHJpYnV0ZXMiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImF0dHJzIiwiX2lkIiwiaWQiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl91c2VySUQiLCJ1c2VyX2lkIiwiX2VtYWlsIiwiZW1haWwiLCJfcm9sZUlEIiwicm9sZV9pZCIsIl9jcmVhdGVkQXQiLCJwYXJzZUlTT1RpbWVzdGFtcCIsImNyZWF0ZWRfYXQiLCJfdXBkYXRlZEF0IiwidXBkYXRlZF9hdCIsInVwZGF0ZWRBdCIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJnZXRMb2NhbFJvbGUiLCJfcm9sZSIsImZpbmRGaXJzdCIsImRiIiwicmVzb3VyY2VfaWQiLCJfcm9sZVJvd0lEIiwicm93SUQiLCJnZXRSb2xlIiwibG9hZE9uZSIsInJvbGUiLCJzZXRPbmUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsVUFBTixDQUFpQjtBQUM5QkMsY0FBWUMsVUFBWixFQUF3QjtBQUN0QixTQUFLQyx1QkFBTCxDQUE2QkQsVUFBN0I7QUFDRDs7QUFFREMsMEJBQXdCQyxLQUF4QixFQUErQjtBQUM3QixVQUFNRixhQUFhRSxTQUFTLEVBQTVCOztBQUVBLFNBQUtDLEdBQUwsR0FBV0gsV0FBV0ksRUFBdEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCTCxXQUFXTSxVQUE3QjtBQUNBLFNBQUtDLFNBQUwsR0FBaUJQLFdBQVdRLFNBQTVCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlVCxXQUFXVSxPQUExQjtBQUNBLFNBQUtDLE1BQUwsR0FBY1gsV0FBV1ksS0FBekI7QUFDQSxTQUFLQyxPQUFMLEdBQWViLFdBQVdjLE9BQTFCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQix1QkFBVUMsaUJBQVYsQ0FBNEJoQixXQUFXaUIsVUFBdkMsQ0FBbEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLHVCQUFVRixpQkFBVixDQUE0QmhCLFdBQVdtQixVQUF2QyxDQUFsQjtBQUNEOztBQUVELE1BQUlmLEVBQUosR0FBUztBQUNQLFdBQU8sS0FBS0QsR0FBWjtBQUNEOztBQUVELE1BQUlpQixTQUFKLEdBQWdCO0FBQ2QsV0FBTyxLQUFLRixVQUFaO0FBQ0Q7O0FBRUQsYUFBV0csU0FBWCxHQUF1QjtBQUNyQixXQUFPLGFBQVA7QUFDRDs7QUFFRCxhQUFXQyxPQUFYLEdBQXFCO0FBQ25CLFdBQU8sQ0FDTCxFQUFFQyxNQUFNLGNBQVIsRUFBd0JDLFFBQVEsWUFBaEMsRUFBOENDLE1BQU0sU0FBcEQsRUFBK0RDLE1BQU0sS0FBckUsRUFESyxFQUVMLEVBQUVILE1BQU0sSUFBUixFQUFjQyxRQUFRLGFBQXRCLEVBQXFDQyxNQUFNLFFBQTNDLEVBQXFEQyxNQUFNLEtBQTNELEVBRkssRUFHTCxFQUFFSCxNQUFNLFFBQVIsRUFBa0JDLFFBQVEsa0JBQTFCLEVBQThDQyxNQUFNLFFBQXBELEVBQThEQyxNQUFNLEtBQXBFLEVBSEssRUFJTCxFQUFFSCxNQUFNLFFBQVIsRUFBa0JDLFFBQVEsa0JBQTFCLEVBQThDQyxNQUFNLFFBQXBELEVBQThEQyxNQUFNLEtBQXBFLEVBSkssRUFLTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsU0FBN0IsRUFBd0NDLE1BQU0sU0FBOUMsRUFBeURDLE1BQU0sS0FBL0QsRUFMSyxFQU1MLEVBQUVILE1BQU0sT0FBUixFQUFpQkMsUUFBUSxPQUF6QixFQUFrQ0MsTUFBTSxRQUF4QyxFQUFrREMsTUFBTSxLQUF4RCxFQU5LLEVBT0wsRUFBRUgsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLFlBQTdCLEVBQTJDQyxNQUFNLFFBQWpELEVBQTJEQyxNQUFNLEtBQWpFLEVBUEssRUFRTCxFQUFFSCxNQUFNLFVBQVIsRUFBb0JDLFFBQVEsV0FBNUIsRUFBeUNDLE1BQU0sUUFBL0MsRUFBeURDLE1BQU0sS0FBL0QsRUFSSyxFQVNMLEVBQUVILE1BQU0sV0FBUixFQUFxQkMsUUFBUSxtQkFBN0IsRUFBa0RDLE1BQU0sVUFBeEQsRUFUSyxFQVVMLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxtQkFBN0IsRUFBa0RDLE1BQU0sVUFBeEQsRUFWSyxFQVdMLEVBQUVGLE1BQU0sV0FBUixFQUFxQkMsUUFBUSxZQUE3QixFQUEyQ0MsTUFBTSxVQUFqRCxFQVhLLENBQVA7QUFhRDs7QUFFS0UsY0FBTixHQUFxQjtBQUFBOztBQUFBO0FBQ25CLFlBQUtDLEtBQUwsR0FBYSxNQUFNLGVBQUtDLFNBQUwsQ0FBZSxNQUFLQyxFQUFwQixFQUF3QixFQUFDQyxhQUFhLE1BQUtsQixPQUFuQixFQUF4QixDQUFuQjtBQUNBLFlBQUttQixVQUFMLEdBQWtCLE1BQUtKLEtBQUwsR0FBYSxNQUFLQSxLQUFMLENBQVdLLEtBQXhCLEdBQWdDLElBQWxEO0FBQ0EsYUFBTyxNQUFLTCxLQUFaO0FBSG1CO0FBSXBCOztBQUVEO0FBQ0FNLFlBQVU7QUFDUixXQUFPLEtBQUtDLE9BQUwsQ0FBYSxNQUFiLGlCQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsSUFBSixHQUFXO0FBQ1QsV0FBTyxLQUFLUixLQUFaO0FBQ0Q7O0FBRUQsTUFBSVEsSUFBSixDQUFTQSxJQUFULEVBQWU7QUFDYixTQUFLQyxNQUFMLENBQVksTUFBWixFQUFvQkQsSUFBcEI7QUFDRDtBQS9ENkI7O2tCQUFYdEMsVTtBQWtFckIseUJBQWlCd0MsUUFBakIsQ0FBMEJ4QyxVQUExQiIsImZpbGUiOiJtZW1iZXJzaGlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGVyc2lzdGVudE9iamVjdCB9IGZyb20gJ21pbmlkYic7XHJcbmltcG9ydCBSb2xlIGZyb20gJy4vcm9sZSc7XHJcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW1iZXJzaGlwIHtcclxuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRnJvbUFQSUF0dHJpYnV0ZXMoYXR0cnMpIHtcclxuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBhdHRycyB8fCB7fTtcclxuXHJcbiAgICB0aGlzLl9pZCA9IGF0dHJpYnV0ZXMuaWQ7XHJcbiAgICB0aGlzLl9maXJzdE5hbWUgPSBhdHRyaWJ1dGVzLmZpcnN0X25hbWU7XHJcbiAgICB0aGlzLl9sYXN0TmFtZSA9IGF0dHJpYnV0ZXMubGFzdF9uYW1lO1xyXG4gICAgdGhpcy5fdXNlcklEID0gYXR0cmlidXRlcy51c2VyX2lkO1xyXG4gICAgdGhpcy5fZW1haWwgPSBhdHRyaWJ1dGVzLmVtYWlsO1xyXG4gICAgdGhpcy5fcm9sZUlEID0gYXR0cmlidXRlcy5yb2xlX2lkO1xyXG4gICAgdGhpcy5fY3JlYXRlZEF0ID0gRGF0ZVV0aWxzLnBhcnNlSVNPVGltZXN0YW1wKGF0dHJpYnV0ZXMuY3JlYXRlZF9hdCk7XHJcbiAgICB0aGlzLl91cGRhdGVkQXQgPSBEYXRlVXRpbHMucGFyc2VJU09UaW1lc3RhbXAoYXR0cmlidXRlcy51cGRhdGVkX2F0KTtcclxuICB9XHJcblxyXG4gIGdldCBpZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9pZDtcclxuICB9XHJcblxyXG4gIGdldCB1cGRhdGVkQXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlZEF0O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XHJcbiAgICByZXR1cm4gJ21lbWJlcnNoaXBzJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHsgbmFtZTogJ2FjY291bnRSb3dJRCcsIGNvbHVtbjogJ2FjY291bnRfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmFtZTogJ2lkJywgY29sdW1uOiAncmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAndXNlcklEJywgY29sdW1uOiAndXNlcl9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdyb2xlSUQnLCBjb2x1bW46ICdyb2xlX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmFtZTogJ3JvbGVSb3dJRCcsIGNvbHVtbjogJ3JvbGVfaWQnLCB0eXBlOiAnaW50ZWdlcicsIG51bGw6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmFtZTogJ2VtYWlsJywgY29sdW1uOiAnZW1haWwnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnZmlyc3ROYW1lJywgY29sdW1uOiAnZmlyc3RfbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdsYXN0TmFtZScsIGNvbHVtbjogJ2xhc3RfbmFtZScsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdzZXJ2ZXJfY3JlYXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfSxcclxuICAgICAgeyBuYW1lOiAndXBkYXRlZEF0JywgY29sdW1uOiAnc2VydmVyX3VwZGF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2RlbGV0ZWRBdCcsIGNvbHVtbjogJ2RlbGV0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnIH1cclxuICAgIF07XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZXRMb2NhbFJvbGUoKSB7XHJcbiAgICB0aGlzLl9yb2xlID0gYXdhaXQgUm9sZS5maW5kRmlyc3QodGhpcy5kYiwge3Jlc291cmNlX2lkOiB0aGlzLl9yb2xlSUR9KTtcclxuICAgIHRoaXMuX3JvbGVSb3dJRCA9IHRoaXMuX3JvbGUgPyB0aGlzLl9yb2xlLnJvd0lEIDogbnVsbDtcclxuICAgIHJldHVybiB0aGlzLl9yb2xlO1xyXG4gIH1cclxuXHJcbiAgLy8gcm9sZVxyXG4gIGdldFJvbGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2FkT25lKCdyb2xlJywgUm9sZSk7XHJcbiAgfVxyXG5cclxuICBnZXQgcm9sZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9yb2xlO1xyXG4gIH1cclxuXHJcbiAgc2V0IHJvbGUocm9sZSkge1xyXG4gICAgdGhpcy5zZXRPbmUoJ3JvbGUnLCByb2xlKTtcclxuICB9XHJcbn1cclxuXHJcblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoTWVtYmVyc2hpcCk7XHJcbiJdfQ==