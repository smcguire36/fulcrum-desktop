'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _minidb = require('minidb');

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _choiceList = require('./choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

var _classificationSet = require('./classification-set');

var _classificationSet2 = _interopRequireDefault(_classificationSet);

var _form = require('./form');

var _form2 = _interopRequireDefault(_form);

var _record = require('./record');

var _record2 = _interopRequireDefault(_record);

var _role = require('./role');

var _role2 = _interopRequireDefault(_role);

var _membership = require('./membership');

var _membership2 = _interopRequireDefault(_membership);

var _syncState = require('./sync-state');

var _syncState2 = _interopRequireDefault(_syncState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Account {
  static get tableName() {
    return 'accounts';
  }

  static get columns() {
    return [{ name: 'userResourceID', column: 'user_resource_id', type: 'string', null: false }, { name: 'organizationResourceID', column: 'organization_resource_id', type: 'string', null: false }, { name: 'organizationName', column: 'organization_name', type: 'string', null: false }, { name: 'email', column: 'email', type: 'string', null: false }, { name: 'firstName', column: 'first_name', type: 'string' }, { name: 'lastName', column: 'last_name', type: 'string' }, { name: 'lastSyncPhotos', column: 'last_sync_photos', type: 'datetime' }, { name: 'lastSyncVideos', column: 'last_sync_videos', type: 'datetime' }, { name: 'lastSyncAudio', column: 'last_sync_audio', type: 'datetime' }, { name: 'lastSyncSignatures', column: 'last_sync_signatures', type: 'datetime' }, { name: 'lastSyncChangesets', column: 'last_sync_changesets', type: 'datetime' }, { name: 'token', column: 'token', type: 'string' }];
  }

  get userResourceID() {
    return this._userResourceID;
  }

  get organizationResourceID() {
    return this._organizationResourceID;
  }

  get organizationName() {
    return this._organizationName;
  }

  get email() {
    return this._email;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get token() {
    return this._token;
  }

  static findByUserAndOrganization(userID, organizationID, callback) {
    return Account.findFirst({ user_resource_id: userID,
      organization_resource_id: organizationID }, callback);
  }

  findForms(where) {
    return _form2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findProjects(where) {
    return _project2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findChoiceLists(where) {
    return _choiceList2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findClassificationSets(where) {
    return _classificationSet2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findRoles(where) {
    return _role2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findMemberships(where) {
    return _membership2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID }), 'email ASC');
  }

  findFirstForm(where) {
    return _form2.default.findFirst(this.db, _extends({}, where, { account_id: this.rowID }), 'name ASC');
  }

  findFirstRecord(where) {
    return _record2.default.findFirst(this.db, _extends({}, where, { account_id: this.rowID }));
  }

  findEachRecord(where, callback) {
    return _record2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachBySQL(sql, values, callback) {
    return this.db.each(sql, values, callback);
  }

  findBySQL(sql, values, callback) {
    return this.db.all(sql, values, callback);
  }

  findActiveForms(where) {
    return _form2.default.findAll(this.db, _extends({}, where, { account_id: this.rowID, deleted_at: null }), 'name ASC');
  }

  projectByResourceID(projectId) {
    return _project2.default.findFirst(this.db, { account_id: this.rowID });
  }

  findSyncState(where) {
    return _syncState2.default.findOrCreate(this.db, _extends({}, where, { account_id: this.rowID }));
  }

  reset() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.db.execute(`
      DELETE FROM columns WHERE table_name IN (
        SELECT name FROM tables WHERE name LIKE 'account_${_this.rowID}_%'
      );
    `);

      yield _this.db.execute(`
      DELETE FROM tables WHERE name LIKE 'account_${_this.rowID}_%';
    `);

      const viewNames = (yield _this.db.all(`
      SELECT tbl_name AS name FROM sqlite_master
      WHERE type = 'view' AND tbl_name LIKE 'account_${_this.rowID}_%'
      ORDER BY tbl_name;
    `)).map(function (o) {
        return o.name;
      });

      for (const viewName of viewNames) {
        yield _this.db.execute(`DROP VIEW ${_this.db.ident(viewName)};`);
      }

      const tableNames = (yield _this.db.all(`
      SELECT tbl_name AS name FROM sqlite_master
      WHERE type = 'table' AND tbl_name LIKE 'account_${_this.rowID}_%'
      ORDER BY tbl_name;
    `)).map(function (o) {
        return o.name;
      });

      for (const tableName of tableNames) {
        yield _this.db.execute(`DROP TABLE ${_this.db.ident(tableName)};`);
      }

      const accountTables = ['audio', 'changesets', 'choice_lists', 'classification_sets', 'forms', 'memberships', 'photos', 'projects', 'records', 'roles', 'signatures', 'videos'];

      for (const tableName of accountTables) {
        yield _this.db.execute(`DELETE FROM ${_this.db.ident(tableName)} WHERE account_id = ${_this.rowID};`);
      }

      yield _this.db.execute(`DELETE FROM sync_state WHERE account_id = ${_this.rowID};`);

      _this._lastSyncPhotos = null;
      _this._lastSyncVideos = null;
      _this._lastSyncAudio = null;
      _this._lastSyncSignatures = null;
      _this._lastSyncChangesets = null;

      yield _this.save();

      yield _this.db.execute('VACUUM');
    })();
  }
}

exports.default = Account;
_minidb.PersistentObject.register(Account);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9hY2NvdW50LmpzIl0sIm5hbWVzIjpbIkFjY291bnQiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwidXNlclJlc291cmNlSUQiLCJfdXNlclJlc291cmNlSUQiLCJvcmdhbml6YXRpb25SZXNvdXJjZUlEIiwiX29yZ2FuaXphdGlvblJlc291cmNlSUQiLCJvcmdhbml6YXRpb25OYW1lIiwiX29yZ2FuaXphdGlvbk5hbWUiLCJlbWFpbCIsIl9lbWFpbCIsImZpcnN0TmFtZSIsIl9maXJzdE5hbWUiLCJsYXN0TmFtZSIsIl9sYXN0TmFtZSIsInRva2VuIiwiX3Rva2VuIiwiZmluZEJ5VXNlckFuZE9yZ2FuaXphdGlvbiIsInVzZXJJRCIsIm9yZ2FuaXphdGlvbklEIiwiY2FsbGJhY2siLCJmaW5kRmlyc3QiLCJ1c2VyX3Jlc291cmNlX2lkIiwib3JnYW5pemF0aW9uX3Jlc291cmNlX2lkIiwiZmluZEZvcm1zIiwid2hlcmUiLCJmaW5kQWxsIiwiZGIiLCJhY2NvdW50X2lkIiwicm93SUQiLCJmaW5kUHJvamVjdHMiLCJmaW5kQ2hvaWNlTGlzdHMiLCJmaW5kQ2xhc3NpZmljYXRpb25TZXRzIiwiZmluZFJvbGVzIiwiZmluZE1lbWJlcnNoaXBzIiwiZmluZEZpcnN0Rm9ybSIsImZpbmRGaXJzdFJlY29yZCIsImZpbmRFYWNoUmVjb3JkIiwiZmluZEVhY2giLCJmaW5kRWFjaEJ5U1FMIiwic3FsIiwidmFsdWVzIiwiZWFjaCIsImZpbmRCeVNRTCIsImFsbCIsImZpbmRBY3RpdmVGb3JtcyIsImRlbGV0ZWRfYXQiLCJwcm9qZWN0QnlSZXNvdXJjZUlEIiwicHJvamVjdElkIiwiZmluZFN5bmNTdGF0ZSIsImZpbmRPckNyZWF0ZSIsInJlc2V0IiwiZXhlY3V0ZSIsInZpZXdOYW1lcyIsIm1hcCIsIm8iLCJ2aWV3TmFtZSIsImlkZW50IiwidGFibGVOYW1lcyIsImFjY291bnRUYWJsZXMiLCJfbGFzdFN5bmNQaG90b3MiLCJfbGFzdFN5bmNWaWRlb3MiLCJfbGFzdFN5bmNBdWRpbyIsIl9sYXN0U3luY1NpZ25hdHVyZXMiLCJfbGFzdFN5bmNDaGFuZ2VzZXRzIiwic2F2ZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsT0FBTixDQUFjO0FBQzNCLGFBQVdDLFNBQVgsR0FBdUI7QUFDckIsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixXQUFPLENBQ0wsRUFBRUMsTUFBTSxnQkFBUixFQUEwQkMsUUFBUSxrQkFBbEMsRUFBc0RDLE1BQU0sUUFBNUQsRUFBc0VDLE1BQU0sS0FBNUUsRUFESyxFQUVMLEVBQUVILE1BQU0sd0JBQVIsRUFBa0NDLFFBQVEsMEJBQTFDLEVBQXNFQyxNQUFNLFFBQTVFLEVBQXNGQyxNQUFNLEtBQTVGLEVBRkssRUFHTCxFQUFFSCxNQUFNLGtCQUFSLEVBQTRCQyxRQUFRLG1CQUFwQyxFQUF5REMsTUFBTSxRQUEvRCxFQUF5RUMsTUFBTSxLQUEvRSxFQUhLLEVBSUwsRUFBRUgsTUFBTSxPQUFSLEVBQWlCQyxRQUFRLE9BQXpCLEVBQWtDQyxNQUFNLFFBQXhDLEVBQWtEQyxNQUFNLEtBQXhELEVBSkssRUFLTCxFQUFFSCxNQUFNLFdBQVIsRUFBcUJDLFFBQVEsWUFBN0IsRUFBMkNDLE1BQU0sUUFBakQsRUFMSyxFQU1MLEVBQUVGLE1BQU0sVUFBUixFQUFvQkMsUUFBUSxXQUE1QixFQUF5Q0MsTUFBTSxRQUEvQyxFQU5LLEVBT0wsRUFBRUYsTUFBTSxnQkFBUixFQUEwQkMsUUFBUSxrQkFBbEMsRUFBc0RDLE1BQU0sVUFBNUQsRUFQSyxFQVFMLEVBQUVGLE1BQU0sZ0JBQVIsRUFBMEJDLFFBQVEsa0JBQWxDLEVBQXNEQyxNQUFNLFVBQTVELEVBUkssRUFT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U0FBZCxDQUF5Qix1QkFBc0IsTUFBS2dDLEtBQU0sR0FBekYsQ0FBTjtBQUNEOztBQUVELFlBQU0sTUFBS0YsRUFBTCxDQUFReUIsT0FBUixDQUFpQiw2Q0FBNEMsTUFBS3ZCLEtBQU0sR0FBeEUsQ0FBTjs7QUFFQSxZQUFLK0IsZUFBTCxHQUF1QixJQUF2QjtBQUNBLFlBQUtDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxZQUFLQyxjQUFMLEdBQXNCLElBQXRCO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQSxZQUFLQyxtQkFBTCxHQUEyQixJQUEzQjs7QUFFQSxZQUFNLE1BQUtDLElBQUwsRUFBTjs7QUFFQSxZQUFNLE1BQUt0QyxFQUFMLENBQVF5QixPQUFSLENBQWdCLFFBQWhCLENBQU47QUE1RFk7QUE2RGI7QUE1SzBCOztrQkFBUnhELE87QUErS3JCLHlCQUFpQnNFLFFBQWpCLENBQTBCdEUsT0FBMUIiLCJmaWxlIjoiYWNjb3VudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBlcnNpc3RlbnRPYmplY3QgfSBmcm9tICdtaW5pZGInO1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0JztcbmltcG9ydCBDaG9pY2VMaXN0IGZyb20gJy4vY2hvaWNlLWxpc3QnO1xuaW1wb3J0IENsYXNzaWZpY2F0aW9uU2V0IGZyb20gJy4vY2xhc3NpZmljYXRpb24tc2V0JztcbmltcG9ydCBGb3JtIGZyb20gJy4vZm9ybSc7XG5pbXBvcnQgUmVjb3JkIGZyb20gJy4vcmVjb3JkJztcbmltcG9ydCBSb2xlIGZyb20gJy4vcm9sZSc7XG5pbXBvcnQgTWVtYmVyc2hpcCBmcm9tICcuL21lbWJlcnNoaXAnO1xuaW1wb3J0IFN5bmNTdGF0ZSBmcm9tICcuL3N5bmMtc3RhdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY2NvdW50IHtcbiAgc3RhdGljIGdldCB0YWJsZU5hbWUoKSB7XG4gICAgcmV0dXJuICdhY2NvdW50cyc7XG4gIH1cblxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHsgbmFtZTogJ3VzZXJSZXNvdXJjZUlEJywgY29sdW1uOiAndXNlcl9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnb3JnYW5pemF0aW9uUmVzb3VyY2VJRCcsIGNvbHVtbjogJ29yZ2FuaXphdGlvbl9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxuICAgICAgeyBuYW1lOiAnb3JnYW5pemF0aW9uTmFtZScsIGNvbHVtbjogJ29yZ2FuaXphdGlvbl9uYW1lJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdlbWFpbCcsIGNvbHVtbjogJ2VtYWlsJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdmaXJzdE5hbWUnLCBjb2x1bW46ICdmaXJzdF9uYW1lJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3ROYW1lJywgY29sdW1uOiAnbGFzdF9uYW1lJywgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jUGhvdG9zJywgY29sdW1uOiAnbGFzdF9zeW5jX3Bob3RvcycsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jVmlkZW9zJywgY29sdW1uOiAnbGFzdF9zeW5jX3ZpZGVvcycsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jQXVkaW8nLCBjb2x1bW46ICdsYXN0X3N5bmNfYXVkaW8nLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICdsYXN0U3luY1NpZ25hdHVyZXMnLCBjb2x1bW46ICdsYXN0X3N5bmNfc2lnbmF0dXJlcycsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jQ2hhbmdlc2V0cycsIGNvbHVtbjogJ2xhc3Rfc3luY19jaGFuZ2VzZXRzJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAndG9rZW4nLCBjb2x1bW46ICd0b2tlbicsIHR5cGU6ICdzdHJpbmcnIH1cbiAgICBdO1xuICB9XG5cbiAgZ2V0IHVzZXJSZXNvdXJjZUlEKCkge1xuICAgIHJldHVybiB0aGlzLl91c2VyUmVzb3VyY2VJRDtcbiAgfVxuXG4gIGdldCBvcmdhbml6YXRpb25SZXNvdXJjZUlEKCkge1xuICAgIHJldHVybiB0aGlzLl9vcmdhbml6YXRpb25SZXNvdXJjZUlEO1xuICB9XG5cbiAgZ2V0IG9yZ2FuaXphdGlvbk5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yZ2FuaXphdGlvbk5hbWU7XG4gIH1cblxuICBnZXQgZW1haWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VtYWlsO1xuICB9XG5cbiAgZ2V0IGZpcnN0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZmlyc3ROYW1lO1xuICB9XG5cbiAgZ2V0IGxhc3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9sYXN0TmFtZTtcbiAgfVxuXG4gIGdldCB0b2tlbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9rZW47XG4gIH1cblxuICBzdGF0aWMgZmluZEJ5VXNlckFuZE9yZ2FuaXphdGlvbih1c2VySUQsIG9yZ2FuaXphdGlvbklELCBjYWxsYmFjaykge1xuICAgIHJldHVybiBBY2NvdW50LmZpbmRGaXJzdCh7dXNlcl9yZXNvdXJjZV9pZDogdXNlcklELFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uX3Jlc291cmNlX2lkOiBvcmdhbml6YXRpb25JRH0sIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRGb3Jtcyh3aGVyZSkge1xuICAgIHJldHVybiBGb3JtLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XG4gIH1cblxuICBmaW5kUHJvamVjdHMod2hlcmUpIHtcbiAgICByZXR1cm4gUHJvamVjdC5maW5kQWxsKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0sICduYW1lIEFTQycpO1xuICB9XG5cbiAgZmluZENob2ljZUxpc3RzKHdoZXJlKSB7XG4gICAgcmV0dXJuIENob2ljZUxpc3QuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcbiAgfVxuXG4gIGZpbmRDbGFzc2lmaWNhdGlvblNldHMod2hlcmUpIHtcbiAgICByZXR1cm4gQ2xhc3NpZmljYXRpb25TZXQuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcbiAgfVxuXG4gIGZpbmRSb2xlcyh3aGVyZSkge1xuICAgIHJldHVybiBSb2xlLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XG4gIH1cblxuICBmaW5kTWVtYmVyc2hpcHMod2hlcmUpIHtcbiAgICByZXR1cm4gTWVtYmVyc2hpcC5maW5kQWxsKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0sICdlbWFpbCBBU0MnKTtcbiAgfVxuXG4gIGZpbmRGaXJzdEZvcm0od2hlcmUpIHtcbiAgICByZXR1cm4gRm9ybS5maW5kRmlyc3QodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XG4gIH1cblxuICBmaW5kRmlyc3RSZWNvcmQod2hlcmUpIHtcbiAgICByZXR1cm4gUmVjb3JkLmZpbmRGaXJzdCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9KTtcbiAgfVxuXG4gIGZpbmRFYWNoUmVjb3JkKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBSZWNvcmQuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZEVhY2hCeVNRTChzcWwsIHZhbHVlcywgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5kYi5lYWNoKHNxbCwgdmFsdWVzLCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kQnlTUUwoc3FsLCB2YWx1ZXMsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZGIuYWxsKHNxbCwgdmFsdWVzLCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kQWN0aXZlRm9ybXMod2hlcmUpIHtcbiAgICByZXR1cm4gRm9ybS5maW5kQWxsKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRCwgZGVsZXRlZF9hdDogbnVsbH0sICduYW1lIEFTQycpO1xuICB9XG5cbiAgcHJvamVjdEJ5UmVzb3VyY2VJRChwcm9qZWN0SWQpIHtcbiAgICByZXR1cm4gUHJvamVjdC5maW5kRmlyc3QodGhpcy5kYiwge2FjY291bnRfaWQ6IHRoaXMucm93SUR9KTtcbiAgfVxuXG4gIGZpbmRTeW5jU3RhdGUod2hlcmUpIHtcbiAgICByZXR1cm4gU3luY1N0YXRlLmZpbmRPckNyZWF0ZSh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9KTtcbiAgfVxuXG4gIGFzeW5jIHJlc2V0KCkge1xuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgXG4gICAgICBERUxFVEUgRlJPTSBjb2x1bW5zIFdIRVJFIHRhYmxlX25hbWUgSU4gKFxuICAgICAgICBTRUxFQ1QgbmFtZSBGUk9NIHRhYmxlcyBXSEVSRSBuYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJ1xuICAgICAgKTtcbiAgICBgKTtcblxuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgXG4gICAgICBERUxFVEUgRlJPTSB0YWJsZXMgV0hFUkUgbmFtZSBMSUtFICdhY2NvdW50XyR7dGhpcy5yb3dJRH1fJSc7XG4gICAgYCk7XG5cbiAgICBjb25zdCB2aWV3TmFtZXMgPSAoYXdhaXQgdGhpcy5kYi5hbGwoYFxuICAgICAgU0VMRUNUIHRibF9uYW1lIEFTIG5hbWUgRlJPTSBzcWxpdGVfbWFzdGVyXG4gICAgICBXSEVSRSB0eXBlID0gJ3ZpZXcnIEFORCB0YmxfbmFtZSBMSUtFICdhY2NvdW50XyR7dGhpcy5yb3dJRH1fJSdcbiAgICAgIE9SREVSIEJZIHRibF9uYW1lO1xuICAgIGApKS5tYXAobyA9PiBvLm5hbWUpO1xuXG4gICAgZm9yIChjb25zdCB2aWV3TmFtZSBvZiB2aWV3TmFtZXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgRFJPUCBWSUVXICR7dGhpcy5kYi5pZGVudCh2aWV3TmFtZSl9O2ApO1xuICAgIH1cblxuICAgIGNvbnN0IHRhYmxlTmFtZXMgPSAoYXdhaXQgdGhpcy5kYi5hbGwoYFxuICAgICAgU0VMRUNUIHRibF9uYW1lIEFTIG5hbWUgRlJPTSBzcWxpdGVfbWFzdGVyXG4gICAgICBXSEVSRSB0eXBlID0gJ3RhYmxlJyBBTkQgdGJsX25hbWUgTElLRSAnYWNjb3VudF8ke3RoaXMucm93SUR9XyUnXG4gICAgICBPUkRFUiBCWSB0YmxfbmFtZTtcbiAgICBgKSkubWFwKG8gPT4gby5uYW1lKTtcblxuICAgIGZvciAoY29uc3QgdGFibGVOYW1lIG9mIHRhYmxlTmFtZXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgRFJPUCBUQUJMRSAke3RoaXMuZGIuaWRlbnQodGFibGVOYW1lKX07YCk7XG4gICAgfVxuXG4gICAgY29uc3QgYWNjb3VudFRhYmxlcyA9IFtcbiAgICAgICdhdWRpbycsXG4gICAgICAnY2hhbmdlc2V0cycsXG4gICAgICAnY2hvaWNlX2xpc3RzJyxcbiAgICAgICdjbGFzc2lmaWNhdGlvbl9zZXRzJyxcbiAgICAgICdmb3JtcycsXG4gICAgICAnbWVtYmVyc2hpcHMnLFxuICAgICAgJ3Bob3RvcycsXG4gICAgICAncHJvamVjdHMnLFxuICAgICAgJ3JlY29yZHMnLFxuICAgICAgJ3JvbGVzJyxcbiAgICAgICdzaWduYXR1cmVzJyxcbiAgICAgICd2aWRlb3MnXG4gICAgXTtcblxuICAgIGZvciAoY29uc3QgdGFibGVOYW1lIG9mIGFjY291bnRUYWJsZXMpIHtcbiAgICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgREVMRVRFIEZST00gJHt0aGlzLmRiLmlkZW50KHRhYmxlTmFtZSl9IFdIRVJFIGFjY291bnRfaWQgPSAke3RoaXMucm93SUR9O2ApO1xuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgREVMRVRFIEZST00gc3luY19zdGF0ZSBXSEVSRSBhY2NvdW50X2lkID0gJHt0aGlzLnJvd0lEfTtgKTtcblxuICAgIHRoaXMuX2xhc3RTeW5jUGhvdG9zID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0U3luY1ZpZGVvcyA9IG51bGw7XG4gICAgdGhpcy5fbGFzdFN5bmNBdWRpbyA9IG51bGw7XG4gICAgdGhpcy5fbGFzdFN5bmNTaWduYXR1cmVzID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0U3luY0NoYW5nZXNldHMgPSBudWxsO1xuXG4gICAgYXdhaXQgdGhpcy5zYXZlKCk7XG5cbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoJ1ZBQ1VVTScpO1xuICB9XG59XG5cblBlcnNpc3RlbnRPYmplY3QucmVnaXN0ZXIoQWNjb3VudCk7XG4iXX0=