'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _Client = require('../../api/Client');

var _Client2 = _interopRequireDefault(_Client);

var _choiceList = require('../../models/choice-list');

var _choiceList2 = _interopRequireDefault(_choiceList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadChoiceLists extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const sync = yield _this.checkSyncState(account, 'choice_lists');

      if (!sync.needsUpdate) {
        return;
      }

      _this.progress({ message: _this.downloading + ' choice lists' });

      const response = yield _Client2.default.getChoiceLists(account);

      const objects = JSON.parse(response.body).choice_lists;

      _this.progress({ message: _this.processing + ' choice lists', count: 0, total: objects.length });

      for (let index = 0; index < objects.length; ++index) {
        const attributes = objects[index];

        const object = yield _choiceList2.default.findOrCreate(account.db, { resource_id: attributes.id, account_id: account.rowID });

        object.updateFromAPIAttributes(attributes);

        yield object.save();

        _this.progress({ message: _this.processing + ' choice lists', count: index + 1, total: objects.length });
      }

      yield sync.update();

      _this.progress({ message: _this.finished + ' choice lists', count: objects.length, total: objects.length });
    })();
  }
}
exports.default = DownloadChoiceLists;
//# sourceMappingURL=download-choice-lists.js.map