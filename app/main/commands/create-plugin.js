'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPath = fulcrum.dir('plugins');

      const files = ['package.json', 'plugin.js', '.gitignore'];

      const commands = [];

      const newPluginPath = _path2.default.join(pluginPath, fulcrum.args.name);

      commands.push(`mkdir -p ${newPluginPath}`);

      for (const file of files) {
        const sourcePath = _path2.default.resolve(_path2.default.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));

        commands.push(`cp ${sourcePath} ${newPluginPath}`);
      }

      commands.push(`cd ${newPluginPath}`);
      commands.push('yarn');
      commands.push('git init');

      const string = commands.join(' && ');

      console.log('Installing...');

      (0, _child_process.execSync)(string);

      console.log('Plugin created at', _path2.default.join(pluginPath, fulcrum.args.name));
      console.log('Run the plugin task using:\n');
      console.log('  ./run task ' + fulcrum.args.name);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'create-plugin',
        desc: 'create a new plugin',
        builder: {
          url: {
            type: 'string',
            desc: 'the new plugin name',
            required: true
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=create-plugin.js.map