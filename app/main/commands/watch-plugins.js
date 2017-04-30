'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      const pluginPaths = _glob2.default.sync(_path2.default.join(fulcrum.dir('plugins'), '*'));

      const promises = [];

      for (const pluginPath of pluginPaths) {
        const pluginDir = _path2.default.resolve(pluginPath);

        if (pluginDir.indexOf('hello') > -1) {
          continue;
        }

        const parts = pluginPath.split(_path2.default.sep);
        const name = parts[parts.length - 1];

        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        console.log('Watching plugin...', pluginPath);

        promises.push(new Promise(function (resolve, reject) {
          try {
            const child = (0, _child_process.exec)('yarn watch', { cwd: pluginDir, env: _pluginEnv2.default });

            child.stdout.on('data', function (data) {
              process.stdout.write(name.green + ' ' + data.toString());
            });

            child.stderr.on('data', function (data) {
              process.stderr.write(name.red + ' ' + data.toString());
            });

            child.on('exit', function () {
              console.log(name.green, 'Done!');
              resolve();
            });

            console.log('Watching...\n\n');
          } catch (ex) {
            console.error('Error watching plugin', pluginPath, ex);
          }
        }));
      }

      yield Promise.all(promises);
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'watch-plugins',
        desc: 'watch and recompile all plugins',
        builder: {
          name: {
            desc: 'plugin name to watch',
            type: 'string'
          }
        },
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=watch-plugins.js.map