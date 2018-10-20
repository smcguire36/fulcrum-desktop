'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _choiceList = require('../../models/choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownloadChoiceLists extends _downloadResource2.default {
  get resourceName() {
    return 'choice_lists';
  }

  get typeName() {
    return 'choice-list';
  }

  get propertyName() {
    return 'choiceList';
  }

  fetchObjects(lastSync, sequence) {
    return _client2.default.getChoiceLists(this.account);
  }

  fetchLocalObjects() {
    return this.account.findChoiceLists();
  }

  findOrCreate(database, attributes) {
    return _choiceList2.default.findOrCreate(database, { resource_id: attributes.id, account_id: this.account.rowID });
  }
}
exports.default = DownloadChoiceLists;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtY2hvaWNlLWxpc3RzLmpzIl0sIm5hbWVzIjpbIkRvd25sb2FkQ2hvaWNlTGlzdHMiLCJyZXNvdXJjZU5hbWUiLCJ0eXBlTmFtZSIsInByb3BlcnR5TmFtZSIsImZldGNoT2JqZWN0cyIsImxhc3RTeW5jIiwic2VxdWVuY2UiLCJnZXRDaG9pY2VMaXN0cyIsImFjY291bnQiLCJmZXRjaExvY2FsT2JqZWN0cyIsImZpbmRDaG9pY2VMaXN0cyIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsInJlc291cmNlX2lkIiwiaWQiLCJhY2NvdW50X2lkIiwicm93SUQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsbUJBQU4sb0NBQW1EO0FBQ2hFLE1BQUlDLFlBQUosR0FBbUI7QUFDakIsV0FBTyxjQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxhQUFQO0FBQ0Q7O0FBRUQsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFlBQVA7QUFDRDs7QUFFREMsZUFBYUMsUUFBYixFQUF1QkMsUUFBdkIsRUFBaUM7QUFDL0IsV0FBTyxpQkFBT0MsY0FBUCxDQUFzQixLQUFLQyxPQUEzQixDQUFQO0FBQ0Q7O0FBRURDLHNCQUFvQjtBQUNsQixXQUFPLEtBQUtELE9BQUwsQ0FBYUUsZUFBYixFQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQU8scUJBQVdGLFlBQVgsQ0FBd0JDLFFBQXhCLEVBQWtDLEVBQUNFLGFBQWFELFdBQVdFLEVBQXpCLEVBQTZCQyxZQUFZLEtBQUtSLE9BQUwsQ0FBYVMsS0FBdEQsRUFBbEMsQ0FBUDtBQUNEO0FBdkIrRDtrQkFBN0NqQixtQiIsImZpbGUiOiJkb3dubG9hZC1jaG9pY2UtbGlzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xyXG5pbXBvcnQgQ2hvaWNlTGlzdCBmcm9tICcuLi8uLi9tb2RlbHMvY2hvaWNlLWxpc3QnO1xyXG5pbXBvcnQgRG93bmxvYWRSZXNvdXJjZSBmcm9tICcuL2Rvd25sb2FkLXJlc291cmNlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQ2hvaWNlTGlzdHMgZXh0ZW5kcyBEb3dubG9hZFJlc291cmNlIHtcclxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xyXG4gICAgcmV0dXJuICdjaG9pY2VfbGlzdHMnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHR5cGVOYW1lKCkge1xyXG4gICAgcmV0dXJuICdjaG9pY2UtbGlzdCc7XHJcbiAgfVxyXG5cclxuICBnZXQgcHJvcGVydHlOYW1lKCkge1xyXG4gICAgcmV0dXJuICdjaG9pY2VMaXN0JztcclxuICB9XHJcblxyXG4gIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcclxuICAgIHJldHVybiBDbGllbnQuZ2V0Q2hvaWNlTGlzdHModGhpcy5hY2NvdW50KTtcclxuICB9XHJcblxyXG4gIGZldGNoTG9jYWxPYmplY3RzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5maW5kQ2hvaWNlTGlzdHMoKTtcclxuICB9XHJcblxyXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xyXG4gICAgcmV0dXJuIENob2ljZUxpc3QuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRH0pO1xyXG4gIH1cclxufVxyXG4iXX0=