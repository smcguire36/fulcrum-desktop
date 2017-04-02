'use strict';

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _synchronizer = require('../synchronizer');

var _synchronizer2 = _interopRequireDefault(_synchronizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Sync extends _command2.default {
  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const accounts = yield _this.fetchAccount(_this.args.org);

      for (const account of accounts) {
        const dataSource = yield _this.createDataSource(account);

        yield _synchronizer2.default.instance.run(account, _this.args.form, dataSource);
      }
    })();
  }
}

new Sync().start();
//# sourceMappingURL=sync.js.map