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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9hY2NvdW50LmpzIl0sIm5hbWVzIjpbIkFjY291bnQiLCJ0YWJsZU5hbWUiLCJjb2x1bW5zIiwibmFtZSIsImNvbHVtbiIsInR5cGUiLCJudWxsIiwidXNlclJlc291cmNlSUQiLCJfdXNlclJlc291cmNlSUQiLCJvcmdhbml6YXRpb25SZXNvdXJjZUlEIiwiX29yZ2FuaXphdGlvblJlc291cmNlSUQiLCJvcmdhbml6YXRpb25OYW1lIiwiX29yZ2FuaXphdGlvbk5hbWUiLCJlbWFpbCIsIl9lbWFpbCIsImZpcnN0TmFtZSIsIl9maXJzdE5hbWUiLCJsYXN0TmFtZSIsIl9sYXN0TmFtZSIsInRva2VuIiwiX3Rva2VuIiwiZmluZEJ5VXNlckFuZE9yZ2FuaXphdGlvbiIsInVzZXJJRCIsIm9yZ2FuaXphdGlvbklEIiwiY2FsbGJhY2siLCJmaW5kRmlyc3QiLCJ1c2VyX3Jlc291cmNlX2lkIiwib3JnYW5pemF0aW9uX3Jlc291cmNlX2lkIiwiZmluZEZvcm1zIiwid2hlcmUiLCJmaW5kQWxsIiwiZGIiLCJhY2NvdW50X2lkIiwicm93SUQiLCJmaW5kUHJvamVjdHMiLCJmaW5kQ2hvaWNlTGlzdHMiLCJmaW5kQ2xhc3NpZmljYXRpb25TZXRzIiwiZmluZFJvbGVzIiwiZmluZE1lbWJlcnNoaXBzIiwiZmluZEZpcnN0Rm9ybSIsImZpbmRGaXJzdFJlY29yZCIsImZpbmRFYWNoUmVjb3JkIiwiZmluZEVhY2giLCJmaW5kRWFjaFBob3RvIiwiZmluZEVhY2hWaWRlbyIsImZpbmRFYWNoQXVkaW8iLCJmaW5kRWFjaFNpZ25hdHVyZSIsImZpbmRFYWNoQ2hhbmdlc2V0IiwiZmluZEVhY2hSb2xlIiwiZmluZEVhY2hDaG9pY2VMaXN0IiwiZmluZEVhY2hDbGFzc2lmaWNhdGlvblNldCIsImZpbmRFYWNoRm9ybSIsImZpbmRFYWNoUHJvamVjdCIsImZpbmRFYWNoTWVtYmVyc2hpcCIsImZpbmRFYWNoQnlTUUwiLCJzcWwiLCJ2YWx1ZXMiLCJlYWNoIiwiZmluZEJ5U1FMIiwiYWxsIiwiZmluZEFjdGl2ZUZvcm1zIiwiZGVsZXRlZF9hdCIsInByb2plY3RCeVJlc291cmNlSUQiLCJwcm9qZWN0SWQiLCJmaW5kU3luY1N0YXRlIiwiZmluZE9yQ3JlYXRlIiwicmVzZXQiLCJleGVjdXRlIiwidmlld05hbWVzIiwibWFwIiwibyIsInZpZXdOYW1lIiwiaWRlbnQiLCJ0YWJsZU5hbWVzIiwiYWNjb3VudFRhYmxlcyIsIl9sYXN0U3luY1Bob3RvcyIsIl9sYXN0U3luY1ZpZGVvcyIsIl9sYXN0U3luY0F1ZGlvIiwiX2xhc3RTeW5jU2lnbmF0dXJlcyIsIl9sYXN0U3luY0NoYW5nZXNldHMiLCJzYXZlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsT0FBTixDQUFjO0FBQzNCLGFBQVdDLFNBQVgsR0FBdUI7QUFDckIsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQsYUFBV0MsT0FBWCxHQUFxQjtBQUNuQixXQUFPLENBQ0wsRUFBRUMsTUFBTSxnQkFBUixFQUEwQkMsUUFBUSxrQkFBbEMsRUFBc0RDLE1BQU0sUUFBNUQsRUFBc0VDLE1BQU0sS0FBNUUsRUFESyxFQUVMLEVBQUVILE1BQU0sd0JBQVIsRUFBa0NDLFFBQVEsMEJBQTFDLEVBQXNFQyxNQUFNLFFBQTVFLEVBQXNGQyxNQUFNLEtBQTVGLEVBRkssRUFHTCxFQUFFSCxNQUFNLGtCQUFSLEVBQTRCQyxRQUFRLG1CQUFwQyxFQUF5REMsTUFBTSxRQUEvRCxFQUF5RUMsTUFBTSxLQUEvRSxFQUhLLEVBSUwsRUFBRUgsTUFBTSxPQUFSLEVBQWlCQyxRQUFRLE9BQXpCLEVBQWtDQyxNQUFNLFFBQXhDLEVBQWtEQyxNQUFNLEtBQXhELEVBSkssRUFLTCxFQUFF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cEIsWUFGb0IsRUFHcEIsY0FIb0IsRUFJcEIscUJBSm9CLEVBS3BCLE9BTG9CLEVBTXBCLGFBTm9CLEVBT3BCLFFBUG9CLEVBUXBCLFVBUm9CLEVBU3BCLFNBVG9CLEVBVXBCLE9BVm9CLEVBV3BCLFlBWG9CLEVBWXBCLFFBWm9CLENBQXRCOztBQWVBLFdBQUssTUFBTXpFLFNBQVgsSUFBd0J5RSxhQUF4QixFQUF1QztBQUNyQyxjQUFNLE1BQUszQyxFQUFMLENBQVFvQyxPQUFSLENBQWlCLGVBQWMsTUFBS3BDLEVBQUwsQ0FBUXlDLEtBQVIsQ0FBY3ZFLFNBQWQsQ0FBeUIsdUJBQXNCLE1BQUtnQyxLQUFNLEdBQXpGLENBQU47QUFDRDs7QUFFRCxZQUFNLE1BQUtGLEVBQUwsQ0FBUW9DLE9BQVIsQ0FBaUIsNkNBQTRDLE1BQUtsQyxLQUFNLEdBQXhFLENBQU47O0FBRUEsWUFBSzBDLGVBQUwsR0FBdUIsSUFBdkI7QUFDQSxZQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsWUFBS0MsY0FBTCxHQUFzQixJQUF0QjtBQUNBLFlBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsWUFBS0MsbUJBQUwsR0FBMkIsSUFBM0I7O0FBRUEsWUFBTSxNQUFLQyxJQUFMLEVBQU47O0FBRUEsWUFBTSxNQUFLakQsRUFBTCxDQUFRb0MsT0FBUixDQUFnQixRQUFoQixDQUFOO0FBNURZO0FBNkRiO0FBeE4wQjs7a0JBQVJuRSxPO0FBMk5yQix5QkFBaUJpRixRQUFqQixDQUEwQmpGLE9BQTFCIiwiZmlsZSI6ImFjY291bnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXJzaXN0ZW50T2JqZWN0IH0gZnJvbSAnbWluaWRiJztcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCc7XG5pbXBvcnQgQ2hvaWNlTGlzdCBmcm9tICcuL2Nob2ljZS1saXN0JztcbmltcG9ydCBDbGFzc2lmaWNhdGlvblNldCBmcm9tICcuL2NsYXNzaWZpY2F0aW9uLXNldCc7XG5pbXBvcnQgRm9ybSBmcm9tICcuL2Zvcm0nO1xuaW1wb3J0IFJlY29yZCBmcm9tICcuL3JlY29yZCc7XG5pbXBvcnQgUm9sZSBmcm9tICcuL3JvbGUnO1xuaW1wb3J0IE1lbWJlcnNoaXAgZnJvbSAnLi9tZW1iZXJzaGlwJztcbmltcG9ydCBDaGFuZ2VzZXQgZnJvbSAnLi9jaGFuZ2VzZXQnO1xuaW1wb3J0IFBob3RvIGZyb20gJy4vcGhvdG8nO1xuaW1wb3J0IFZpZGVvIGZyb20gJy4vdmlkZW8nO1xuaW1wb3J0IEF1ZGlvIGZyb20gJy4vYXVkaW8nO1xuaW1wb3J0IFNpZ25hdHVyZSBmcm9tICcuL3NpZ25hdHVyZSc7XG5pbXBvcnQgU3luY1N0YXRlIGZyb20gJy4vc3luYy1zdGF0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjY291bnQge1xuICBzdGF0aWMgZ2V0IHRhYmxlTmFtZSgpIHtcbiAgICByZXR1cm4gJ2FjY291bnRzJztcbiAgfVxuXG4gIHN0YXRpYyBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgeyBuYW1lOiAndXNlclJlc291cmNlSUQnLCBjb2x1bW46ICd1c2VyX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdvcmdhbml6YXRpb25SZXNvdXJjZUlEJywgY29sdW1uOiAnb3JnYW5pemF0aW9uX3Jlc291cmNlX2lkJywgdHlwZTogJ3N0cmluZycsIG51bGw6IGZhbHNlIH0sXG4gICAgICB7IG5hbWU6ICdvcmdhbml6YXRpb25OYW1lJywgY29sdW1uOiAnb3JnYW5pemF0aW9uX25hbWUnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2VtYWlsJywgY29sdW1uOiAnZW1haWwnLCB0eXBlOiAnc3RyaW5nJywgbnVsbDogZmFsc2UgfSxcbiAgICAgIHsgbmFtZTogJ2ZpcnN0TmFtZScsIGNvbHVtbjogJ2ZpcnN0X25hbWUnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAnbGFzdE5hbWUnLCBjb2x1bW46ICdsYXN0X25hbWUnLCB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNQaG90b3MnLCBjb2x1bW46ICdsYXN0X3N5bmNfcGhvdG9zJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNWaWRlb3MnLCBjb2x1bW46ICdsYXN0X3N5bmNfdmlkZW9zJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNBdWRpbycsIGNvbHVtbjogJ2xhc3Rfc3luY19hdWRpbycsIHR5cGU6ICdkYXRldGltZScgfSxcbiAgICAgIHsgbmFtZTogJ2xhc3RTeW5jU2lnbmF0dXJlcycsIGNvbHVtbjogJ2xhc3Rfc3luY19zaWduYXR1cmVzJywgdHlwZTogJ2RhdGV0aW1lJyB9LFxuICAgICAgeyBuYW1lOiAnbGFzdFN5bmNDaGFuZ2VzZXRzJywgY29sdW1uOiAnbGFzdF9zeW5jX2NoYW5nZXNldHMnLCB0eXBlOiAnZGF0ZXRpbWUnIH0sXG4gICAgICB7IG5hbWU6ICd0b2tlbicsIGNvbHVtbjogJ3Rva2VuJywgdHlwZTogJ3N0cmluZycgfVxuICAgIF07XG4gIH1cblxuICBnZXQgdXNlclJlc291cmNlSUQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJSZXNvdXJjZUlEO1xuICB9XG5cbiAgZ2V0IG9yZ2FuaXphdGlvblJlc291cmNlSUQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX29yZ2FuaXphdGlvblJlc291cmNlSUQ7XG4gIH1cblxuICBnZXQgb3JnYW5pemF0aW9uTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fb3JnYW5pemF0aW9uTmFtZTtcbiAgfVxuXG4gIGdldCBlbWFpbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZW1haWw7XG4gIH1cblxuICBnZXQgZmlyc3ROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9maXJzdE5hbWU7XG4gIH1cblxuICBnZXQgbGFzdE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xhc3ROYW1lO1xuICB9XG5cbiAgZ2V0IHRva2VuKCkge1xuICAgIHJldHVybiB0aGlzLl90b2tlbjtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kQnlVc2VyQW5kT3JnYW5pemF0aW9uKHVzZXJJRCwgb3JnYW5pemF0aW9uSUQsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIEFjY291bnQuZmluZEZpcnN0KHt1c2VyX3Jlc291cmNlX2lkOiB1c2VySUQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQ6IG9yZ2FuaXphdGlvbklEfSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZEZvcm1zKHdoZXJlKSB7XG4gICAgcmV0dXJuIEZvcm0uZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcbiAgfVxuXG4gIGZpbmRQcm9qZWN0cyh3aGVyZSkge1xuICAgIHJldHVybiBQcm9qZWN0LmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ25hbWUgQVNDJyk7XG4gIH1cblxuICBmaW5kQ2hvaWNlTGlzdHMod2hlcmUpIHtcbiAgICByZXR1cm4gQ2hvaWNlTGlzdC5maW5kQWxsKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0sICduYW1lIEFTQycpO1xuICB9XG5cbiAgZmluZENsYXNzaWZpY2F0aW9uU2V0cyh3aGVyZSkge1xuICAgIHJldHVybiBDbGFzc2lmaWNhdGlvblNldC5maW5kQWxsKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0sICduYW1lIEFTQycpO1xuICB9XG5cbiAgZmluZFJvbGVzKHdoZXJlKSB7XG4gICAgcmV0dXJuIFJvbGUuZmluZEFsbCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcbiAgfVxuXG4gIGZpbmRNZW1iZXJzaGlwcyh3aGVyZSkge1xuICAgIHJldHVybiBNZW1iZXJzaGlwLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfSwgJ2VtYWlsIEFTQycpO1xuICB9XG5cbiAgZmluZEZpcnN0Rm9ybSh3aGVyZSkge1xuICAgIHJldHVybiBGb3JtLmZpbmRGaXJzdCh0aGlzLmRiLCB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9LCAnbmFtZSBBU0MnKTtcbiAgfVxuXG4gIGZpbmRGaXJzdFJlY29yZCh3aGVyZSkge1xuICAgIHJldHVybiBSZWNvcmQuZmluZEZpcnN0KHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0pO1xuICB9XG5cbiAgZmluZEVhY2hSZWNvcmQod2hlcmUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFJlY29yZC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaFBob3RvKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBQaG90by5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaFZpZGVvKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBWaWRlby5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaEF1ZGlvKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBBdWRpby5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaFNpZ25hdHVyZSh3aGVyZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gU2lnbmF0dXJlLmZpbmRFYWNoKHRoaXMuZGIsIHt3aGVyZTogey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfX0sIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRFYWNoQ2hhbmdlc2V0KHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBDaGFuZ2VzZXQuZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZEVhY2hSb2xlKHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBSb2xlLmZpbmRFYWNoKHRoaXMuZGIsIHt3aGVyZTogey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfX0sIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRFYWNoQ2hvaWNlTGlzdCh3aGVyZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gQ2hvaWNlTGlzdC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaENsYXNzaWZpY2F0aW9uU2V0KHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBDbGFzc2lmaWNhdGlvblNldC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaEZvcm0od2hlcmUsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIEZvcm0uZmluZEVhY2godGhpcy5kYiwge3doZXJlOiB7Li4ud2hlcmUsIGFjY291bnRfaWQ6IHRoaXMucm93SUR9fSwgY2FsbGJhY2spO1xuICB9XG5cbiAgZmluZEVhY2hQcm9qZWN0KHdoZXJlLCBjYWxsYmFjaykge1xuICAgIHJldHVybiBQcm9qZWN0LmZpbmRFYWNoKHRoaXMuZGIsIHt3aGVyZTogey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lEfX0sIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRFYWNoTWVtYmVyc2hpcCh3aGVyZSwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gTWVtYmVyc2hpcC5maW5kRWFjaCh0aGlzLmRiLCB7d2hlcmU6IHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH19LCBjYWxsYmFjayk7XG4gIH1cblxuICBmaW5kRWFjaEJ5U1FMKHNxbCwgdmFsdWVzLCBjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmRiLmVhY2goc3FsLCB2YWx1ZXMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRCeVNRTChzcWwsIHZhbHVlcywgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5kYi5hbGwoc3FsLCB2YWx1ZXMsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGZpbmRBY3RpdmVGb3Jtcyh3aGVyZSkge1xuICAgIHJldHVybiBGb3JtLmZpbmRBbGwodGhpcy5kYiwgey4uLndoZXJlLCBhY2NvdW50X2lkOiB0aGlzLnJvd0lELCBkZWxldGVkX2F0OiBudWxsfSwgJ25hbWUgQVNDJyk7XG4gIH1cblxuICBwcm9qZWN0QnlSZXNvdXJjZUlEKHByb2plY3RJZCkge1xuICAgIHJldHVybiBQcm9qZWN0LmZpbmRGaXJzdCh0aGlzLmRiLCB7YWNjb3VudF9pZDogdGhpcy5yb3dJRH0pO1xuICB9XG5cbiAgZmluZFN5bmNTdGF0ZSh3aGVyZSkge1xuICAgIHJldHVybiBTeW5jU3RhdGUuZmluZE9yQ3JlYXRlKHRoaXMuZGIsIHsuLi53aGVyZSwgYWNjb3VudF9pZDogdGhpcy5yb3dJRH0pO1xuICB9XG5cbiAgYXN5bmMgcmVzZXQoKSB7XG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBcbiAgICAgIERFTEVURSBGUk9NIGNvbHVtbnMgV0hFUkUgdGFibGVfbmFtZSBJTiAoXG4gICAgICAgIFNFTEVDVCBuYW1lIEZST00gdGFibGVzIFdIRVJFIG5hbWUgTElLRSAnYWNjb3VudF8ke3RoaXMucm93SUR9XyUnXG4gICAgICApO1xuICAgIGApO1xuXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBcbiAgICAgIERFTEVURSBGUk9NIHRhYmxlcyBXSEVSRSBuYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJztcbiAgICBgKTtcblxuICAgIGNvbnN0IHZpZXdOYW1lcyA9IChhd2FpdCB0aGlzLmRiLmFsbChgXG4gICAgICBTRUxFQ1QgdGJsX25hbWUgQVMgbmFtZSBGUk9NIHNxbGl0ZV9tYXN0ZXJcbiAgICAgIFdIRVJFIHR5cGUgPSAndmlldycgQU5EIHRibF9uYW1lIExJS0UgJ2FjY291bnRfJHt0aGlzLnJvd0lEfV8lJ1xuICAgICAgT1JERVIgQlkgdGJsX25hbWU7XG4gICAgYCkpLm1hcChvID0+IG8ubmFtZSk7XG5cbiAgICBmb3IgKGNvbnN0IHZpZXdOYW1lIG9mIHZpZXdOYW1lcykge1xuICAgICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBEUk9QIFZJRVcgJHt0aGlzLmRiLmlkZW50KHZpZXdOYW1lKX07YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdGFibGVOYW1lcyA9IChhd2FpdCB0aGlzLmRiLmFsbChgXG4gICAgICBTRUxFQ1QgdGJsX25hbWUgQVMgbmFtZSBGUk9NIHNxbGl0ZV9tYXN0ZXJcbiAgICAgIFdIRVJFIHR5cGUgPSAndGFibGUnIEFORCB0YmxfbmFtZSBMSUtFICdhY2NvdW50XyR7dGhpcy5yb3dJRH1fJSdcbiAgICAgIE9SREVSIEJZIHRibF9uYW1lO1xuICAgIGApKS5tYXAobyA9PiBvLm5hbWUpO1xuXG4gICAgZm9yIChjb25zdCB0YWJsZU5hbWUgb2YgdGFibGVOYW1lcykge1xuICAgICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBEUk9QIFRBQkxFICR7dGhpcy5kYi5pZGVudCh0YWJsZU5hbWUpfTtgKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY2NvdW50VGFibGVzID0gW1xuICAgICAgJ2F1ZGlvJyxcbiAgICAgICdjaGFuZ2VzZXRzJyxcbiAgICAgICdjaG9pY2VfbGlzdHMnLFxuICAgICAgJ2NsYXNzaWZpY2F0aW9uX3NldHMnLFxuICAgICAgJ2Zvcm1zJyxcbiAgICAgICdtZW1iZXJzaGlwcycsXG4gICAgICAncGhvdG9zJyxcbiAgICAgICdwcm9qZWN0cycsXG4gICAgICAncmVjb3JkcycsXG4gICAgICAncm9sZXMnLFxuICAgICAgJ3NpZ25hdHVyZXMnLFxuICAgICAgJ3ZpZGVvcydcbiAgICBdO1xuXG4gICAgZm9yIChjb25zdCB0YWJsZU5hbWUgb2YgYWNjb3VudFRhYmxlcykge1xuICAgICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBERUxFVEUgRlJPTSAke3RoaXMuZGIuaWRlbnQodGFibGVOYW1lKX0gV0hFUkUgYWNjb3VudF9pZCA9ICR7dGhpcy5yb3dJRH07YCk7XG4gICAgfVxuXG4gICAgYXdhaXQgdGhpcy5kYi5leGVjdXRlKGBERUxFVEUgRlJPTSBzeW5jX3N0YXRlIFdIRVJFIGFjY291bnRfaWQgPSAke3RoaXMucm93SUR9O2ApO1xuXG4gICAgdGhpcy5fbGFzdFN5bmNQaG90b3MgPSBudWxsO1xuICAgIHRoaXMuX2xhc3RTeW5jVmlkZW9zID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0U3luY0F1ZGlvID0gbnVsbDtcbiAgICB0aGlzLl9sYXN0U3luY1NpZ25hdHVyZXMgPSBudWxsO1xuICAgIHRoaXMuX2xhc3RTeW5jQ2hhbmdlc2V0cyA9IG51bGw7XG5cbiAgICBhd2FpdCB0aGlzLnNhdmUoKTtcblxuICAgIGF3YWl0IHRoaXMuZGIuZXhlY3V0ZSgnVkFDVVVNJyk7XG4gIH1cbn1cblxuUGVyc2lzdGVudE9iamVjdC5yZWdpc3RlcihBY2NvdW50KTtcbiJdfQ==