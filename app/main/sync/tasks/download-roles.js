'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _role = require('../../models/role');

var _role2 = _interopRequireDefault(_role);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadRoles extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'roles');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' roles' });

      const response = yield _client2.default.getRoles(account);

      const objects = JSON.parse(response.body).roles;

      _this.progress({ message: _this.processing + ' roles', count: 0, total: objects.length });

      const localObjects = yield account.findRoles();

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _role2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' roles', count: index + 1, total: objects.length });
      }

      yield sync.update();

      _this.progress({ message: _this.finished + ' roles', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadRoles;
//# sourceMappingURL=download-roles.js.map