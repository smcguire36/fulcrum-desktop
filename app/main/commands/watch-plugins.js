'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ELECTRON_VERSION = '1.6.6';

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

        const env = _extends({}, process.env, {
          npm_config_target: ELECTRON_VERSION,
          npm_config_arch: process.arch,
          npm_config_target_arch: process.arch,
          npm_config_disturl: 'https://atom.io/download/electron',
          npm_config_runtime: 'electron',
          npm_config_build_from_source: 'true'
        });

        const parts = pluginPath.split(_path2.default.sep);
        const name = parts[parts.length - 1];

        console.log(name);
        if (fulcrum.args.name && name !== fulcrum.args.name) {
          continue;
        }

        console.log('Watching plugin...', pluginPath);

        promises.push(new Promise(function (resolve, reject) {
          try {
            const child = (0, _child_process.exec)('yarn watch', { cwd: pluginDir, env });

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