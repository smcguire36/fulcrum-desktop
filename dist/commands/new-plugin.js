'use strict';

var _command = require('./command');

var _command2 = _interopRequireDefault(_command);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class NewPlugin extends _command2.default {
  run() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const pluginPath = _this.app.dir('plugins');

      const files = ['package.json', 'plugin.js', '.babelrc', '.gitignore'];

      const commands = [];

      const newPluginPath = _path2.default.join(pluginPath, _this.args.name);

      commands.push(`mkdir -p ${newPluginPath}`);

      for (const file of files) {
        const sourcePath = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', 'resources', 'default-plugin', file));

        commands.push(`cp ${sourcePath} ${newPluginPath}`);
      }

      commands.push(`cd ${newPluginPath}`);
      commands.push('yarn');
      commands.push('git init');

      const string = commands.join(' && ');

      console.log('Installing...');

      (0, _child_process.execSync)(string);

      console.log('Plugin created at', _path2.default.join(pluginPath, _this.args.name));
      console.log('Run the plugin task using:\n');
      console.log('  ./run task ' + _this.args.name);
    })();
  }
}

new NewPlugin().start();
//# sourceMappingURL=new-plugin.js.map