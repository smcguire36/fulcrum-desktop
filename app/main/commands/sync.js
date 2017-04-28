'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _synchronizer = require('../sync/synchronizer');

var _synchronizer2 = _interopRequireDefault(_synchronizer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      yield _this.app.activatePlugins();

      const account = yield fulcrum.fetchAccount(fulcrum.args.org);

      yield _this.syncLoop(account, fulcrum.args.full);
    });
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'sync',
        desc: 'sync an organization',
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          },
          forever: {
            default: false,
            type: 'boolean',
            describe: 'keep the sync running forever'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

  syncLoop(account, fullSync) {
    return _asyncToGenerator(function* () {
      const sync = true;

      const dataSource = yield fulcrum.createDataSource(account);

      while (sync) {
        const synchronizer = new _synchronizer2.default();

        yield synchronizer.run(account, fulcrum.args.form, dataSource, { fullSync });

        fullSync = false;

        yield new Promise(function (resolve) {
          return setTimeout(resolve, 10000);
        });
      }
    })();
  }
};
//# sourceMappingURL=sync.js.map