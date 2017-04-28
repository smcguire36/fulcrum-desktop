'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _csvString = require('csv-string');

var _csvString2 = _interopRequireDefault(_csvString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      let headers = false;

      yield fulcrum.db.each(fulcrum.args.sql, {}, function (columns, row, index) {
        if (!headers) {
          headers = true;
          process.stdout.write(_csvString2.default.stringify(columns.map(function (c) {
            return c.name;
          })));
        }

        if (row) {
          process.stdout.write(_csvString2.default.stringify(row));
        }
      });
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'query',
        desc: 'run a query in the local database',
        builder: {
          sql: {
            type: 'string',
            desc: 'sql query',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=query.js.map