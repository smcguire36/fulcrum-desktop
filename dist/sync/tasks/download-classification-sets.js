'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _classificationSet = require('../../models/classification-set');

var _classificationSet2 = _interopRequireDefault(_classificationSet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadClassificationSets extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'classification_sets');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' classification sets' });

      const response = yield _client2.default.getClassificationSets(account);

      const objects = JSON.parse(response.body).classification_sets;

      _this.progress({ message: _this.processing + ' classification sets', count: 0, total: objects.length });

      const localObjects = yield account.findClassificationSets();

      _this.markDeletedObjects(localObjects, objects);

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _classificationSet2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        object._deletedAt = null;

        yield object.save();

        _this.progress({ message: _this.processing + ' classification sets', count: index + 1, total: objects.length });
      }

      yield sync.update();

      dataSource.source.invalidate('classificationSets');

      _this.progress({ message: _this.finished + ' classification sets', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadClassificationSets;
//# sourceMappingURL=download-classification-sets.js.map