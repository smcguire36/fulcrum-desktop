'use strict';

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Task extends _command2.default {
  // async setup() {
  //   super.setup();
  // }

  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      yield _this.app.runTask(_this);
    })();
  }
}

new Task().start();
//# sourceMappingURL=task.js.map