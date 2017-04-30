'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      const commands = [];

      const parts = fulcrum.args.url.split('/');

      const name = parts[parts.length - 1].replace(/\.git/, '');

      const newPluginPath = _path2.default.join(pluginPath, name);

      commands.push(`git clone ${fulcrum.args.url} ${newPluginPath}`);
      commands.push(`cd ${newPluginPath}`);
      commands.push('yarn');

      const string = commands.join(' && ');

      console.log('Installing...');

      (0, _child_process.execSync)(string, { env: _pluginEnv2.default });

      console.log('Plugin installed at', newPluginPath);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'install-plugin',
        desc: 'install a plugin',
        builder: {
          url: {
            type: 'string',
            desc: 'the URL to a git repo',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=install-plugin.js.map