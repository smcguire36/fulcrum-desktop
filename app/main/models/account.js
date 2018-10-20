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

var _changeset = require('./changeset');

var _changeset2 = _interopRequireDefault(_changeset);

var _photo = require('./photo');

var _photo2 = _interopRequireDefault(_photo);

var _video = require('./video');

var _video2 = _interopRequireDefault(_video);

var _audio = require('./audio');

var _audio2 = _interopRequireDefault(_audio);

var _signature = require('./signature');

var _signature2 = _interopRequireDefault(_signature);

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

  findEachPhoto(where, callback) {
    return _photo2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachVideo(where, callback) {
    return _video2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachAudio(where, callback) {
    return _audio2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachSignature(where, callback) {
    return _signature2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachChangeset(where, callback) {
    return _changeset2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachRole(where, callback) {
    return _role2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachChoiceList(where, callback) {
    return _choiceList2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachClassificationSet(where, callback) {
    return _classificationSet2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachForm(where, callback) {
    return _form2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachProject(where, callback) {
    return _project2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
  }

  findEachMembership(where, callback) {
    return _membership2.default.findEach(this.db, { where: _extends({}, where, { account_id: this.rowID }) }, callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9hY2NvdW50LmpzIl0sIm5hbWVzIjpbIkFjY291bnQiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwidXNlclJlc291cmNlSUQiLCJfdXNlclJlc291cmNlSUQiLCJvcmdhbml6YXRpb25SZXNvdXJjZUlEIiwiX29yZ2FuaXphdGlvblJlc291cmNlSUQiLCJvcmdhbml6YXRpb25OYW1lIiwiX29yZ2FuaXphdGlvbk5hbWUiLCJlbWFpbCIsIl9lbWFpbCIsImZpcnN0TmFtZSIsIl9maXJzdE5hbWUiLCJsYXN0TmFtZSIsIl9sYXN0TmFtZSIsInRva2VuIiwiX3Rva2VuIiwiZmluZEJ5VXNlckFuZE9yZ2FuaXphdGlvbiIsInVzZXJJRCIsIm9yZ2FuaXphdGlvbklEIiwiY2FsbGJhY2siLCJmaW5kRmlyc3QiLCJ1c2VyX3Jlc291cmNlX2lkIiwib3JnYW5pemF0aW9uX3Jlc291cmNlX2lkIiwiZmluZEZvcm1zIiwid2hlcmUiLCJmaW5kQWxsIiwiZGIiLCJhY2NvdW50X2lkIiwicm93SUQiLCJmaW5kUHJvamVjdHMiLCJmaW5kQ2hvaWNlTGlzdHMiLCJmaW5kQ2xhc3NpZmljYXRpb25TZXRzIiwiZmluZFJvbGVzIiwiZmluZE1lbWJlcnNoaXBzIiwiZmluZEZpcnN0Rm9ybSIsImZpbmRGaXJzdFJlY29yZCIsImZpbmRFYWNoUmVjb3JkIiwiZmluZEVhY2giLCJmaW5kRWFjaFBob3RvIiwiZmluZEVhY2hWaWRlbyIsImZpbmRFYWNoQXVkaW8iLCJmaW5kRWFjaFNpZ25hdHVyZSIsImZpbmRFYWNoQ2hhbmdlc2V0IiwiZmluZEVhY2hSb2xlIiwiZmluZEVhY2hDaG9pY2VMaXN0IiwiZmluZEVhY2hDbGFzc2lmaWNhdGlvblNldCIsImZpbmRFYWNoRm9ybSIsImZpbmRFYWNoUHJvamVjdCIsImZpbmRFYWNoTWVtYmVyc2hpcCIsImZpbmRFYWNoQnlTUUwiLCJzcWwiLCJ2YWx1ZXMiLCJlYWNoIiwiZmluZEJ5U1FMIiwiYWxsIiwiZmluZEFjdGl2ZUZvcm1zIiwiZGVsZXRlZF9hdCIsInByb2plY3RCeVJlc291cmNlSUQiLCJwcm9qZWN0SWQiLCJmaW5kU3luY1N0YXRlIiwiZmluZE9yQ3JlYXRlIiwicmVzZXQiLCJleGVjdXRlIiwidmlld05hbWVzIiwibWFwIiwibyIsInZpZXdOYW1lIiwiaWRlbnQiLCJ0YWJsZU5hbWVzIiwiYWNjb3VudFRhYmxlcyIsIl9sYXN0U3luY1Bob3RvcyIsIl9sYXN0U3luY1ZpZGVvcyIsIl9sYXN0U3luY0F1ZGlvIiwiX2xhc3RTeW5jU2lnbmF0dXJlcyIsIl9sYXN0U3luY0NoYW5nZXNldHMiLCJzYXZlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsT0FBTixDQUFjO0FBQzNCLGFBQVdDLFNBQVgsR0FBdUI7QUFDckIsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixXQUFPLENBQ0wsRUFBRUMsTUFBTSxnQkFBUixFQUEwQkMsUUFBUSxrQkFBbEMsRUFBc0RDLE1BQU0sUUFBNUQsRUFBc0VDLE1BQU0sS0FBNUUsRUFESyxFQUVMLEVBQUVILE1BQU0sd0JBQVIsRUFBa0NDLFFBQVEsMEJBQTFDLEVBQXNFQyxNQUFNLFFBQTVFLEVBQXNGQyxNQUFNLEtBQTVGLEVBRkssRUFHTCxFQUFFSCxNQUFNLGtCQUFSLEVBQTRCQyxRQUFRLG1CQUFwQyxFQUF5REMsTUFBTSxRQUEvRCxFQUF5RUMsTUFBTSxLQUEvRSxFQUhLLEVBSUwsRUFBRUgsTUFBTSxPQUFSLEVBQWlCQyxRQUFRLE9BQXpCLEVBQWtDQyxNQUFNLFFBQXhDLEVBQWtEQyxNQUFNLEtBQXhELEVBSkssRUFLTCxFQUFF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cEIsWUFGb0IsRUFHcEIsY0FIb0IsRUFJcEIscUJBSm9CLEVBS3BCLE9BTG9CLEVBTXBCLGFBTm9CLEVBT3BCLFFBUG9CLEVBUXBCLFVBUm9CLEVBU3BCLFNBVG9CLEVBVXBCLE9BVm9CLEVBV3BCLFlBWG9CLEVBWXBCLFFBWm9CLENBQXRCOztBQWVBLFdBQUssTUFBTXpFLFNBQVgsSUFBd0J5RSxhQUF4QixFQUF1QztBQUNyQyxjQUFNLE1BQUszQyxFQUFMLENBQVFvQyxPQUFSLENBQWlCLGVBQWMsTUFBS3BDLEVBQUwsQ0FBUXlDLEtBQVIsQ0FBY3ZFLFNBQWQsQ0FBeUIsdUJBQXNCLE1BQUtnQyxLQUFNLEdBQXpGLENBQU47QUFDRDs7QUFFRCxZQUFNLE1BQUtGLEVBQUwsQ0FBUW9DLE9BQVIsQ0FBaUIsNkNBQTRDLE1BQUtsQyxLQUFNLEdBQXhFLENBQU47O0FBRUEsWUFBSzBDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxZQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsWUFBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFlBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7O0FBRUEsWUFBTSxNQUFLQyxJQUFMLEVBQU47O0FBRUEsWUFBTSxNQUFLakQsRUFBTCxDQUFRb0MsT0FBUixDQUFnQixRQUFoQixDQUFOO0FBNURZO0FBNkRiO0FBeE4wQjs7a0JBQVJuRSxPO0FBMk5yQix5QkFBaUJpRixRQUFqQixDQUEwQmpGLE9BQTFCIiwiZmlsZSI6ImFjY291bnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcclxuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0JztcclxuaW1wb3J0IENob2ljZUxpc3QgZnJvbSAnLi9jaG9pY2UtbGlzdCc7XHJcbmltcG9ydCBDbGFzc2lmaWNhdGlvblNldCBmcm9tICcuL2NsYXNzaWZpY2F0aW9uLXNldCc7XHJcbmltcG9ydCBGb3JtIGZyb20gJy4vZm9ybSc7XHJcbmltcG9ydCBSZWNvcmQgZnJvbSAnLi9yZWNvcmQnO1xyXG5pbXBvcnQgUm9sZSBmcm9tICcuL3JvbGUnO1xyXG5pbXBvcnQgTWVtYmVyc2hpcCBmcm9tICcuL21lbWJlcnNoaXAnO1xyXG5pbXBvcnQgQ2hhbmdlc2V0IGZyb20gJy4vY2hhbmdlc2V0JztcclxuaW1wb3J0IFBob3RvIGZyb20gJy4vcGhvdG8nO1xyXG5pbXBvcnQgVmlkZW8gZnJvbSAnLi92aWRlbyc7XHJcbmltcG9ydCBBdWRpbyBmcm9tICcuL2F1ZGlvJztcclxuaW1wb3J0IFNpZ25hdHVyZSBmcm9tICcuL3NpZ25hdHVyZSc7XHJcbmltcG9ydCBTeW5jU3RhdGUgZnJvbSAnLi9zeW5jLXN0YXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnQge1xyXG4gIHN0YXRpYyBnZXQgdGFibGVOYW1lKCkge1xyXG4gICAgcmV0dXJuICdhY2NvdW50cyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IGNvbHVtbnMoKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICB7IG5hbWU6ICd1c2VyUmVzb3VyY2VJRCcsIGNvbHVtbjogJ3VzZXJfcmVzb3VyY2VfaWQnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnb3JnYW5pemF0aW9uUmVzb3VyY2VJRCcsIGNvbHVtbjogJ29yZ2FuaXphdGlvbl9yZXNvdXJjZV9pZCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdvcmdhbml6YXRpb25OYW1lJywgY29sdW1uOiAnb3JnYW5pemF0aW9uX25hbWUnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcclxuICAgICAgeyBuYW1lOiAnZW1haWwnLCBjb2x1bW46ICdlbWFpbCcsIHR5cGU6ICdzdHJpbmcnLCBudWxsOiBmYWxzZSB9LFxyXG4gICAgICB7IG5hbWU6ICdmaXJzdE5hbWUnLCBjb2x1bW46ICdmaXJzdF9uYW1lJywgdHlwZTogJ3N0cmluZycgfSxcclxuICAgICAgeyBuYW1lOiAnbGFzdE5hbWUnLCBjb2x1bW46ICdsYXN0X25hbWUnLCB0eXBlOiAnc3RyaW5nJyB9LFxyXG4gICAgICB7IG5hbWU6ICdsYXN0U3luY1Bob3RvcycsIGNvbHVtbjogJ2xhc3Rfc3luY19waG90b3MnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jVmlkZW9zJywgY29sdW1uOiAnbGFzdF9zeW5jX3ZpZGVvcycsIHR5cGU6ICdkYXRldGltZScgfSxcclxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNBdWRpbycsIGNvbHVtbjogJ2xhc3Rfc3luY19hdWRpbycsIHR5cGU6ICdkYXRldGltZScgfSxcclxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNTaWduYXR1cmVzJywgY29sdW1uOiAnbGFzdF9zeW5jX3NpZ25hdHVyZXMnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXHJcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jQ2hhbmdlc2V0cycsIGNvbHVtbjogJ2xhc3Rfc3luY19jaGFuZ2VzZXRzJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxyXG4gICAgICB7IG5hbWU6ICd0b2tlbicsIGNvbHVtbjogJ3Rva2VuJywgdHlwZTogJ3N0cmluZycgfVxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIGdldCB1c2VyUmVzb3VyY2VJRCgpIHtcclxuICAgIHJldHVybiB0aGlzLl91c2VyUmVzb3VyY2VJRDtcclxuICB9XHJcblxyXG4gIGdldCBvcmdhbml6YXRpb25SZXNvdXJjZUlEKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX29yZ2FuaXphdGlvblJlc291cmNlSUQ7XHJcbiAgfVxyXG5cclxuICBnZXQgb3JnYW5pemF0aW9uTmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9vcmdhbml6YXRpb25OYW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGVtYWlsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2VtYWlsO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGZpcnN0TmFtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9maXJzdE5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbGFzdE5hbWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbGFzdE5hbWU7XHJcbiAgfVxyXG5cclxuICBnZXQgdG9rZW4oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdG9rZW47XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZmluZEJ5VXNlckFuZE9yZ2FuaXphdGlvbih1c2VySUQsIG9yZ2FuaXphdGlvbklELCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIEFjY291bnQuZmluZEZpcnN0KHt1c2VyX3Jlc291cmNlX2lkOiB1c2VySUQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbl9yZXNvdXJjZV9pZDogb3JnYW5pemF0aW9uSUR9LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRm9ybXMod2hlcmUpIHtcclxuICAgIHJldHVybiBGb3JtLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBmaW5kUHJvamVjdHMod2hlcmUpIHtcclxuICAgIHJldHVybiBQcm9qZWN0LmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBmaW5kQ2hvaWNlTGlzdHMod2hlcmUpIHtcclxuICAgIHJldHVybiBDaG9pY2VMaXN0LmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBmaW5kQ2xhc3NpZmljYXRpb25TZXRzKHdoZXJlKSB7XHJcbiAgICByZXR1cm4gQ2xhc3NpZmljYXRpb25TZXQuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcclxuICB9XHJcblxyXG4gIGZpbmRSb2xlcyh3aGVyZSkge1xyXG4gICAgcmV0dXJuIFJvbGUuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcclxuICB9XHJcblxyXG4gIGZpbmRNZW1iZXJzaGlwcyh3aGVyZSkge1xyXG4gICAgcmV0dXJuIE1lbWJlcnNoaXAuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnZW1haWwgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBmaW5kRmlyc3RGb3JtKHdoZXJlKSB7XHJcbiAgICByZXR1cm4gRm9ybS5maW5kRmlyc3QodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBmaW5kRmlyc3RSZWNvcmQod2hlcmUpIHtcclxuICAgIHJldHVybiBSZWNvcmQuZmluZEZpcnN0KHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0pO1xyXG4gIH1cclxuXHJcbiAgZmluZEVhY2hSZWNvcmQod2hlcmUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gUmVjb3JkLmZpbmRFYWNoKHRoaXMuZGIsIHt3aGVyZTogey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfX0sIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGZpbmRFYWNoUGhvdG8od2hlcmUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gUGhvdG8uZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEVhY2hWaWRlbyh3aGVyZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBWaWRlby5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaEF1ZGlvKHdoZXJlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIEF1ZGlvLmZpbmRFYWNoKHRoaXMuZGIsIHt3aGVyZTogey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfX0sIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGZpbmRFYWNoU2lnbmF0dXJlKHdoZXJlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIFNpZ25hdHVyZS5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaENoYW5nZXNldCh3aGVyZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBDaGFuZ2VzZXQuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEVhY2hSb2xlKHdoZXJlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIFJvbGUuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEVhY2hDaG9pY2VMaXN0KHdoZXJlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIENob2ljZUxpc3QuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEVhY2hDbGFzc2lmaWNhdGlvblNldCh3aGVyZSwgY2FsbGJhY2spIHtcclxuICAgIHJldHVybiBDbGFzc2lmaWNhdGlvblNldC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaEZvcm0od2hlcmUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gRm9ybS5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaFByb2plY3Qod2hlcmUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gUHJvamVjdC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaE1lbWJlcnNoaXAod2hlcmUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gTWVtYmVyc2hpcC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kRWFjaEJ5U1FMKHNxbCwgdmFsdWVzLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIHRoaXMuZGIuZWFjaChzcWwsIHZhbHVlcywgY2FsbGJhY2spO1xyXG4gIH1cclxuXHJcbiAgZmluZEJ5U1FMKHNxbCwgdmFsdWVzLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIHRoaXMuZGIuYWxsKHNxbCwgdmFsdWVzLCBjYWxsYmFjayk7XHJcbiAgfVxyXG5cclxuICBmaW5kQWN0aXZlRm9ybXMod2hlcmUpIHtcclxuICAgIHJldHVybiBGb3JtLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lELCBkZWxldGVkX2F0OiBudWxsfSwgJ25hbWUgQVNDJyk7XHJcbiAgfVxyXG5cclxuICBwcm9qZWN0QnlSZXNvdXJjZUlEKHByb2plY3RJZCkge1xyXG4gICAgcmV0dXJuIFByb2plY3QuZmluZEZpcnN0KHRoaXMuZGIsIHthY2NvdW50X2lkOiB0aGlzLnJvd0lEfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kU3luY1N0YXRlKHdoZXJlKSB7XHJcbiAgICByZXR1cm4gU3luY1N0YXRlLmZpbmRPckNyZWF0ZSh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJlc2V0KCkge1xyXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBcclxuICAgICAgREVMRVRFIEZST00gY29sdW1ucyBXSEVSRSB0YWJsZV9uYW1lIElOIChcclxuICAgICAgICBTRUxFQ1QgbmFtZSBGUk9NIHRhYmxlcyBXSEVSRSBuYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJ1xyXG4gICAgICApO1xyXG4gICAgYCk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBcclxuICAgICAgREVMRVRFIEZST00gdGFibGVzIFdIRVJFIG5hbWUgTElLRSAnYWNjb3VudF8ke3RoaXMucm93SUR9XyUnO1xyXG4gICAgYCk7XHJcblxyXG4gICAgY29uc3Qgdmlld05hbWVzID0gKGF3YWl0IHRoaXMuZGIuYWxsKGBcclxuICAgICAgU0VMRUNUIHRibF9uYW1lIEFTIG5hbWUgRlJPTSBzcWxpdGVfbWFzdGVyXHJcbiAgICAgIFdIRVJFIHR5cGUgPSAndmlldycgQU5EIHRibF9uYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJ1xyXG4gICAgICBPUkRFUiBCWSB0YmxfbmFtZTtcclxuICAgIGApKS5tYXAobyA9PiBvLm5hbWUpO1xyXG5cclxuICAgIGZvciAoY29uc3Qgdmlld05hbWUgb2Ygdmlld05hbWVzKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZShgRFJPUCBWSUVXICR7dGhpcy5kYi5pZGVudCh2aWV3TmFtZSl9O2ApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRhYmxlTmFtZXMgPSAoYXdhaXQgdGhpcy5kYi5hbGwoYFxyXG4gICAgICBTRUxFQ1QgdGJsX25hbWUgQVMgbmFtZSBGUk9NIHNxbGl0ZV9tYXN0ZXJcclxuICAgICAgV0hFUkUgdHlwZSA9ICd0YWJsZScgQU5EIHRibF9uYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJ1xyXG4gICAgICBPUkRFUiBCWSB0YmxfbmFtZTtcclxuICAgIGApKS5tYXAobyA9PiBvLm5hbWUpO1xyXG5cclxuICAgIGZvciAoY29uc3QgdGFibGVOYW1lIG9mIHRhYmxlTmFtZXMpIHtcclxuICAgICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBEUk9QIFRBQkxFICR7dGhpcy5kYi5pZGVudCh0YWJsZU5hbWUpfTtgKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY2NvdW50VGFibGVzID0gW1xyXG4gICAgICAnYXVkaW8nLFxyXG4gICAgICAnY2hhbmdlc2V0cycsXHJcbiAgICAgICdjaG9pY2VfbGlzdHMnLFxyXG4gICAgICAnY2xhc3NpZmljYXRpb25fc2V0cycsXHJcbiAgICAgICdmb3JtcycsXHJcbiAgICAgICdtZW1iZXJzaGlwcycsXHJcbiAgICAgICdwaG90b3MnLFxyXG4gICAgICAncHJvamVjdHMnLFxyXG4gICAgICAncmVjb3JkcycsXHJcbiAgICAgICdyb2xlcycsXHJcbiAgICAgICdzaWduYXR1cmVzJyxcclxuICAgICAgJ3ZpZGVvcydcclxuICAgIF07XHJcblxyXG4gICAgZm9yIChjb25zdCB0YWJsZU5hbWUgb2YgYWNjb3VudFRhYmxlcykge1xyXG4gICAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoYERFTEVURSBGUk9NICR7dGhpcy5kYi5pZGVudCh0YWJsZU5hbWUpfSBXSEVSRSBhY2NvdW50X2lkID0gJHt0aGlzLnJvd0lEfTtgKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoYERFTEVURSBGUk9NIHN5bmNfc3RhdGUgV0hFUkUgYWNjb3VudF9pZCA9ICR7dGhpcy5yb3dJRH07YCk7XHJcblxyXG4gICAgdGhpcy5fbGFzdFN5bmNQaG90b3MgPSBudWxsO1xyXG4gICAgdGhpcy5fbGFzdFN5bmNWaWRlb3MgPSBudWxsO1xyXG4gICAgdGhpcy5fbGFzdFN5bmNBdWRpbyA9IG51bGw7XHJcbiAgICB0aGlzLl9sYXN0U3luY1NpZ25hdHVyZXMgPSBudWxsO1xyXG4gICAgdGhpcy5fbGFzdFN5bmNDaGFuZ2VzZXRzID0gbnVsbDtcclxuXHJcbiAgICBhd2FpdCB0aGlzLnNhdmUoKTtcclxuXHJcbiAgICBhd2FpdCB0aGlzLmRiLmV4ZWN1dGUoJ1ZBQ1VVTScpO1xyXG4gIH1cclxufVxyXG5cclxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihBY2NvdW50KTtcclxuIl19