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
}

exports.default = Account;
_minidb.PersistentObject.register(Account);
//# sourceMappingURL=account.js.map