'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _project = require('../../models/project');

var _project2 = _interopRequireDefault(_project);

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DownloadProjects extends _downloadResource2.default {
  get resourceName() {
    return 'projects';
  }

  get typeName() {
    return 'project';
  }

  fetchObjects(lastSync, sequence) {
    return _client2.default.getProjects(this.account);
  }

  fetchLocalObjects() {
    return this.account.findProjects();
  }

  findOrCreate(database, attributes) {
    return _project2.default.findOrCreate(database, { resource_id: attributes.id, account_id: this.account.rowID });
  }
}
exports.default = DownloadProjects;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcHJvamVjdHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRQcm9qZWN0cyIsInJlc291cmNlTmFtZSIsInR5cGVOYW1lIiwiZmV0Y2hPYmplY3RzIiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsImdldFByb2plY3RzIiwiYWNjb3VudCIsImZldGNoTG9jYWxPYmplY3RzIiwiZmluZFByb2plY3RzIiwiZmluZE9yQ3JlYXRlIiwiZGF0YWJhc2UiLCJhdHRyaWJ1dGVzIiwicmVzb3VyY2VfaWQiLCJpZCIsImFjY291bnRfaWQiLCJyb3dJRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxnQkFBTixvQ0FBZ0Q7QUFDN0QsTUFBSUMsWUFBSixHQUFtQjtBQUNqQixXQUFPLFVBQVA7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLFNBQVA7QUFDRDs7QUFFREMsZUFBYUMsUUFBYixFQUF1QkMsUUFBdkIsRUFBaUM7QUFDL0IsV0FBTyxpQkFBT0MsV0FBUCxDQUFtQixLQUFLQyxPQUF4QixDQUFQO0FBQ0Q7O0FBRURDLHNCQUFvQjtBQUNsQixXQUFPLEtBQUtELE9BQUwsQ0FBYUUsWUFBYixFQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFVBQXZCLEVBQW1DO0FBQ2pDLFdBQU8sa0JBQVFGLFlBQVIsQ0FBcUJDLFFBQXJCLEVBQStCLEVBQUNFLGFBQWFELFdBQVdFLEVBQXpCLEVBQTZCQyxZQUFZLEtBQUtSLE9BQUwsQ0FBYVMsS0FBdEQsRUFBL0IsQ0FBUDtBQUNEO0FBbkI0RDtrQkFBMUNoQixnQiIsImZpbGUiOiJkb3dubG9hZC1wcm9qZWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XHJcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4uLy4uL21vZGVscy9wcm9qZWN0JztcclxuaW1wb3J0IERvd25sb2FkUmVzb3VyY2UgZnJvbSAnLi9kb3dubG9hZC1yZXNvdXJjZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFByb2plY3RzIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XHJcbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcclxuICAgIHJldHVybiAncHJvamVjdHMnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHR5cGVOYW1lKCkge1xyXG4gICAgcmV0dXJuICdwcm9qZWN0JztcclxuICB9XHJcblxyXG4gIGZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpIHtcclxuICAgIHJldHVybiBDbGllbnQuZ2V0UHJvamVjdHModGhpcy5hY2NvdW50KTtcclxuICB9XHJcblxyXG4gIGZldGNoTG9jYWxPYmplY3RzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWNjb3VudC5maW5kUHJvamVjdHMoKTtcclxuICB9XHJcblxyXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcykge1xyXG4gICAgcmV0dXJuIFByb2plY3QuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCB7cmVzb3VyY2VfaWQ6IGF0dHJpYnV0ZXMuaWQsIGFjY291bnRfaWQ6IHRoaXMuYWNjb3VudC5yb3dJRH0pO1xyXG4gIH1cclxufVxyXG4iXX0=