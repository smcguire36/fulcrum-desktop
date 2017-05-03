'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minidb = require('minidb');

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

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
  }

  get id() {
    return this._id;
  }

  static get tableName() {
    return 'memberships';
  }

  static get columns() {
    return [{ name: 'accountRowID', column: 'account_id', type: 'integer', null: false }, { name: 'id', column: 'resource_id', type: 'string', null: false }, { name: 'userID', column: 'user_resource_id', type: 'string', null: false }, { name: 'roleID', column: 'role_resource_id', type: 'string', null: false }, { name: 'roleRowID', column: 'role_id', type: 'integer', null: false }, { name: 'email', column: 'email', type: 'string', null: false }, { name: 'firstName', column: 'first_name', type: 'string', null: false }, { name: 'lastName', column: 'last_name', type: 'string', null: false }, { name: 'createdAt', column: 'created_at', type: 'datetime', null: false }, { name: 'updatedAt', column: 'updated_at', type: 'datetime', null: false }, { name: 'deletedAt', column: 'deleted_at', type: 'datetime' }];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9tZW1iZXJzaGlwLmpzIl0sIm5hbWVzIjpbIk1lbWJlcnNoaXAiLCJjb25zdHJ1Y3RvciIsImF0dHJpYnV0ZXMiLCJ1cGRhdGVGcm9tQVBJQXR0cmlidXRlcyIsImF0dHJzIiwiX2lkIiwiaWQiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl91c2VySUQiLCJ1c2VyX2lkIiwiX2VtYWlsIiwiZW1haWwiLCJfcm9sZUlEIiwicm9sZV9pZCIsInRhYmxlTmFtZSIsImNvbHVtbnMiLCJuYW1lIiwiY29sdW1uIiwidHlwZSIsIm51bGwiLCJnZXRMb2NhbFJvbGUiLCJfcm9sZSIsImZpbmRGaXJzdCIsImRiIiwicmVzb3VyY2VfaWQiLCJfcm9sZVJvd0lEIiwicm93SUQiLCJnZXRSb2xlIiwibG9hZE9uZSIsInJvbGUiLCJzZXRPbmUiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsVUFBTixDQUFpQjtBQUM5QkMsY0FBWUMsVUFBWixFQUF3QjtBQUN0QixTQUFLQyx1QkFBTCxDQUE2QkQsVUFBN0I7QUFDRDs7QUFFREMsMEJBQXdCQyxLQUF4QixFQUErQjtBQUM3QixVQUFNRixhQUFhRSxTQUFTLEVBQTVCOztBQUVBLFNBQUtDLEdBQUwsR0FBV0gsV0FBV0ksRUFBdEI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCTCxXQUFXTSxVQUE3QjtBQUNBLFNBQUtDLFNBQUwsR0FBaUJQLFdBQVdRLFNBQTVCO0FBQ0EsU0FBS0MsT0FBTCxHQUFlVCxXQUFXVSxPQUExQjtBQUNBLFNBQUtDLE1BQUwsR0FBY1gsV0FBV1ksS0FBekI7QUFDQSxTQUFLQyxPQUFMLEdBQWViLFdBQVdjLE9BQTFCO0FBQ0Q7O0FBRUQsTUFBSVYsRUFBSixHQUFTO0FBQ1AsV0FBTyxLQUFLRCxHQUFaO0FBQ0Q7O0FBRUQsYUFBV1ksU0FBWCxHQUF1QjtBQUNyQixXQUFPLGFBQVA7QUFDRDs7QUFFRCxhQUFXQyxPQUFYLEdBQXFCO0FBQ25CLFdBQU8sQ0FDTCxFQUFFQyxNQUFNLGNBQVIsRUFBd0JDLFFBQVEsWUFBaEMsRUFBOENDLE1BQU0sU0FBcEQsRUFBK0RDLE1BQU0sS0FBckUsRUFESyxFQUVMLEVBQUVILE1BQU0sSUFBUixFQUFjQyxRQUFRLGFBQXRCLEVBQXFDQyxNQUFNLFFBQTNDLEVBQXFEQyxNQUFNLEtBQTNELEVBRkssRUFHTCxFQUFFSCxNQUFNLFFBQVIsRUFBa0JDLFFBQVEsa0JBQTFCLEVBQThDQyxNQUFNLFFBQXBELEVBQThEQyxNQUFNLEtBQXBFLEVBSEssRUFJTCxFQUFFSCxNQUFNLFFBQVIsRUFBa0JDLFFBQVEsa0JBQTFCLEVBQThDQyxNQUFNLFFBQXBELEVBQThEQyxNQUFNLEtBQXBFLEVBSkssRUFLTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsU0FBN0IsRUFBd0NDLE1BQU0sU0FBOUMsRUFBeURDLE1BQU0sS0FBL0QsRUFMSyxFQU1MLEVBQUVILE1BQU0sT0FBUixFQUFpQkMsUUFBUSxPQUF6QixFQUFrQ0MsTUFBTSxRQUF4QyxFQUFrREMsTUFBTSxLQUF4RCxFQU5LLEVBT0wsRUFBRUgsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLFlBQTdCLEVBQTJDQyxNQUFNLFFBQWpELEVBQTJEQyxNQUFNLEtBQWpFLEVBUEssRUFRTCxFQUFFSCxNQUFNLFVBQVIsRUFBb0JDLFFBQVEsV0FBNUIsRUFBeUNDLE1BQU0sUUFBL0MsRUFBeURDLE1BQU0sS0FBL0QsRUFSSyxFQVNMLEVBQUVILE1BQU0sV0FBUixFQUFxQkMsUUFBUSxZQUE3QixFQUEyQ0MsTUFBTSxVQUFqRCxFQUE2REMsTUFBTSxLQUFuRSxFQVRLLEVBVUwsRUFBRUgsTUFBTSxXQUFSLEVBQXFCQyxRQUFRLFlBQTdCLEVBQTJDQyxNQUFNLFVBQWpELEVBQTZEQyxNQUFNLEtBQW5FLEVBVkssRUFXTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsWUFBN0IsRUFBMkNDLE1BQU0sVUFBakQsRUFYSyxDQUFQO0FBYUQ7O0FBRUtFLGNBQU4sR0FBcUI7QUFBQTs7QUFBQTtBQUNuQixZQUFLQyxLQUFMLEdBQWEsTUFBTSxlQUFLQyxTQUFMLENBQWUsTUFBS0MsRUFBcEIsRUFBd0IsRUFBQ0MsYUFBYSxNQUFLWixPQUFuQixFQUF4QixDQUFuQjtBQUNBLFlBQUthLFVBQUwsR0FBa0IsTUFBS0osS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0ssS0FBeEIsR0FBZ0MsSUFBbEQ7QUFDQSxhQUFPLE1BQUtMLEtBQVo7QUFIbUI7QUFJcEI7O0FBRUQ7QUFDQU0sWUFBVTtBQUNSLFdBQU8sS0FBS0MsT0FBTCxDQUFhLE1BQWIsaUJBQVA7QUFDRDs7QUFFRCxNQUFJQyxJQUFKLEdBQVc7QUFDVCxXQUFPLEtBQUtSLEtBQVo7QUFDRDs7QUFFRCxNQUFJUSxJQUFKLENBQVNBLElBQVQsRUFBZTtBQUNiLFNBQUtDLE1BQUwsQ0FBWSxNQUFaLEVBQW9CRCxJQUFwQjtBQUNEO0FBekQ2Qjs7a0JBQVhoQyxVO0FBNERyQix5QkFBaUJrQyxRQUFqQixDQUEwQmxDLFVBQTFCIiwiZmlsZSI6Im1lbWJlcnNoaXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCBSb2xlIGZyb20gJy4vcm9sZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbWJlcnNoaXAge1xuICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy51cGRhdGVGcm9tQVBJQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcbiAgfVxuXG4gIHVwZGF0ZUZyb21BUElBdHRyaWJ1dGVzKGF0dHJzKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IGF0dHJzIHx8IHt9O1xuXG4gICAgdGhpcy5faWQgPSBhdHRyaWJ1dGVzLmlkO1xuICAgIHRoaXMuX2ZpcnN0TmFtZSA9IGF0dHJpYnV0ZXMuZmlyc3RfbmFtZTtcbiAgICB0aGlzLl9sYXN0TmFtZSA9IGF0dHJpYnV0ZXMubGFzdF9uYW1lO1xuICAgIHRoaXMuX3VzZXJJRCA9IGF0dHJpYnV0ZXMudXNlcl9pZDtcbiAgICB0aGlzLl9lbWFpbCA9IGF0dHJpYnV0ZXMuZW1haWw7XG4gICAgdGhpcy5fcm9sZUlEID0gYXR0cmlidXRlcy5yb2xlX2lkO1xuICB9XG5cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLl9pZDtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xuICAgIHJldHVybiAnbWVtYmVyc2hpcHMnO1xuICB9XG5cbiAgc3RhdGljIGdldCBjb2x1bW5zKCkge1xuICAgIHJldHVybiBbXG4gICAgICB7IG5hbWU6ICdhY2NvdW50Um93SUQnLCBjb2x1bW46ICdhY2NvdW50X2lkJywgdHlwZTogJ2ludGVnZXInLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnaWQnLCBjb2x1bW46ICdyZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAndXNlcklEJywgY29sdW1uOiAndXNlcl9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAncm9sZUlEJywgY29sdW1uOiAncm9sZV9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAncm9sZVJvd0lEJywgY29sdW1uOiAncm9sZV9pZCcsIHR5cGU6ICdpbnRlZ2VyJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2VtYWlsJywgY29sdW1uOiAnZW1haWwnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2ZpcnN0TmFtZScsIGNvbHVtbjogJ2ZpcnN0X25hbWUnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3ROYW1lJywgY29sdW1uOiAnbGFzdF9uYW1lJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdjcmVhdGVkQXQnLCBjb2x1bW46ICdjcmVhdGVkX2F0JywgdHlwZTogJ2RhdGV0aW1lJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ3VwZGF0ZWRBdCcsIGNvbHVtbjogJ3VwZGF0ZWRfYXQnLCB0eXBlOiAnZGF0ZXRpbWUnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnZGVsZXRlZEF0JywgY29sdW1uOiAnZGVsZXRlZF9hdCcsIHR5cGU6ICdkYXRldGltZScgfVxuICAgIF07XG4gIH1cblxuICBhc3luYyBnZXRMb2NhbFJvbGUoKSB7XG4gICAgdGhpcy5fcm9sZSA9IGF3YWl0IFJvbGUuZmluZEZpcnN0KHRoaXMuZGIsIHtyZXNvdXJjZV9pZDogdGhpcy5fcm9sZUlEfSk7XG4gICAgdGhpcy5fcm9sZVJvd0lEID0gdGhpcy5fcm9sZSA/IHRoaXMuX3JvbGUucm93SUQgOiBudWxsO1xuICAgIHJldHVybiB0aGlzLl9yb2xlO1xuICB9XG5cbiAgLy8gcm9sZVxuICBnZXRSb2xlKCkge1xuICAgIHJldHVybiB0aGlzLmxvYWRPbmUoJ3JvbGUnLCBSb2xlKTtcbiAgfVxuXG4gIGdldCByb2xlKCkge1xuICAgIHJldHVybiB0aGlzLl9yb2xlO1xuICB9XG5cbiAgc2V0IHJvbGUocm9sZSkge1xuICAgIHRoaXMuc2V0T25lKCdyb2xlJywgcm9sZSk7XG4gIH1cbn1cblxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihNZW1iZXJzaGlwKTtcbiJdfQ==