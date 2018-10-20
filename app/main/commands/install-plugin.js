'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _pluginEnv = require('../plugin-env');

var _pluginEnv2 = _interopRequireDefault(_pluginEnv);

var _git = require('../git');

var _git2 = _interopRequireDefault(_git);

var _yarn = require('../yarn');

var _yarn2 = _interopRequireDefault(_yarn);

var _pluginLogger = require('../plugin-logger');

var _pluginLogger2 = _interopRequireDefault(_pluginLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = class {
    constructor() {
        this.runCommand = _asyncToGenerator(function* () {
            const pluginPath = fulcrum.dir('plugins');

            let pluginName = fulcrum.args.name;

            if (pluginName && pluginName.indexOf('fulcrum-desktop') !== 0) {
                pluginName = `fulcrum-desktop-${pluginName}`;
            }

            const url = fulcrum.args.url || `https://github.com/fulcrumapp/${pluginName}`;

            const parts = url.split('/');

            const name = parts[parts.length - 1].replace(/\.git/, '');

            const newPluginPath = _path2.default.join(pluginPath, name);

            const logger = (0, _pluginLogger2.default)(newPluginPath);

            logger.log('Cloning...');

            yield _git2.default.clone(url, newPluginPath);

            logger.log('Installing dependencies...');

            yield _yarn2.default.run('install', { env: _pluginEnv2.default, cwd: newPluginPath, logger });

            logger.log('Plugin installed at', newPluginPath);
        });
    }

    task(cli) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return cli.command({
                command: 'install-plugin',
                desc: 'install a plugin',
                builder: {
                    name: {
                        type: 'string',
                        desc: 'the plugin name'
                    },
                    url: {
                        type: 'string',
                        desc: 'the URL to a git repo'
                    }
                },
                handler: _this.runCommand
            });
        })();
    }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL2luc3RhbGwtcGx1Z2luLmpzIl0sIm5hbWVzIjpbInJ1bkNvbW1hbmQiLCJwbHVnaW5QYXRoIiwiZnVsY3J1bSIsImRpciIsInBsdWdpbk5hbWUiLCJhcmdzIiwibmFtZSIsImluZGV4T2YiLCJ1cmwiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwicmVwbGFjZSIsIm5ld1BsdWdpblBhdGgiLCJqb2luIiwibG9nZ2VyIiwibG9nIiwiY2xvbmUiLCJydW4iLCJlbnYiLCJjd2QiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwidHlwZSIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O2tCQUVlLE1BQU07QUFBQTtBQUFBLGFBbUJuQkEsVUFuQm1CLHFCQW1CTixhQUFZO0FBQ3ZCLGtCQUFNQyxhQUFhQyxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFuQjs7QUFFQSxnQkFBSUMsYUFBYUYsUUFBUUcsSUFBUixDQUFhQyxJQUE5Qjs7QUFFQSxnQkFBSUYsY0FBY0EsV0FBV0csT0FBWCxDQUFtQixpQkFBbkIsTUFBMEMsQ0FBNUQsRUFBK0Q7QUFDN0RILDZCQUFjLG1CQUFtQkEsVUFBWSxFQUE3QztBQUNEOztBQUVELGtCQUFNSSxNQUFNTixRQUFRRyxJQUFSLENBQWFHLEdBQWIsSUFBcUIsaUNBQWlDSixVQUFZLEVBQTlFOztBQUVBLGtCQUFNSyxRQUFRRCxJQUFJRSxLQUFKLENBQVUsR0FBVixDQUFkOztBQUVBLGtCQUFNSixPQUFPRyxNQUFNQSxNQUFNRSxNQUFOLEdBQWUsQ0FBckIsRUFBd0JDLE9BQXhCLENBQWdDLE9BQWhDLEVBQXlDLEVBQXpDLENBQWI7O0FBRUEsa0JBQU1DLGdCQUFnQixlQUFLQyxJQUFMLENBQVViLFVBQVYsRUFBc0JLLElBQXRCLENBQXRCOztBQUVBLGtCQUFNUyxTQUFTLDRCQUFhRixhQUFiLENBQWY7O0FBRUFFLG1CQUFPQyxHQUFQLENBQVcsWUFBWDs7QUFFQSxrQkFBTSxjQUFJQyxLQUFKLENBQVVULEdBQVYsRUFBZUssYUFBZixDQUFOOztBQUVBRSxtQkFBT0MsR0FBUCxDQUFXLDRCQUFYOztBQUVBLGtCQUFNLGVBQUtFLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQUNDLHdCQUFELEVBQWlCQyxLQUFLUCxhQUF0QixFQUFxQ0UsTUFBckMsRUFBcEIsQ0FBTjs7QUFFQUEsbUJBQU9DLEdBQVAsQ0FBVyxxQkFBWCxFQUFrQ0gsYUFBbEM7QUFDRCxTQS9Da0I7QUFBQTs7QUFDYlEsUUFBTixDQUFXQyxHQUFYLEVBQWdCO0FBQUE7O0FBQUE7QUFDZCxtQkFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSx5QkFBUyxnQkFEUTtBQUVqQkMsc0JBQU0sa0JBRlc7QUFHakJDLHlCQUFTO0FBQ1BuQiwwQkFBTTtBQUNKb0IsOEJBQU0sUUFERjtBQUVKRiw4QkFBTTtBQUZGLHFCQURDO0FBS1BoQix5QkFBSztBQUNIa0IsOEJBQU0sUUFESDtBQUVIRiw4QkFBTTtBQUZIO0FBTEUsaUJBSFE7QUFhakJHLHlCQUFTLE1BQUszQjtBQWJHLGFBQVosQ0FBUDtBQURjO0FBZ0JmOztBQWpCa0IsQyIsImZpbGUiOiJpbnN0YWxsLXBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgcGx1Z2luRW52IGZyb20gJy4uL3BsdWdpbi1lbnYnO1xyXG5pbXBvcnQgZ2l0IGZyb20gJy4uL2dpdCc7XHJcbmltcG9ydCB5YXJuIGZyb20gJy4uL3lhcm4nO1xyXG5pbXBvcnQgcGx1Z2luTG9nZ2VyIGZyb20gJy4uL3BsdWdpbi1sb2dnZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xyXG4gIGFzeW5jIHRhc2soY2xpKSB7XHJcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xyXG4gICAgICBjb21tYW5kOiAnaW5zdGFsbC1wbHVnaW4nLFxyXG4gICAgICBkZXNjOiAnaW5zdGFsbCBhIHBsdWdpbicsXHJcbiAgICAgIGJ1aWxkZXI6IHtcclxuICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcclxuICAgICAgICAgIGRlc2M6ICd0aGUgcGx1Z2luIG5hbWUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1cmw6IHtcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICAgICAgZGVzYzogJ3RoZSBVUkwgdG8gYSBnaXQgcmVwbydcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBydW5Db21tYW5kID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgcGx1Z2luUGF0aCA9IGZ1bGNydW0uZGlyKCdwbHVnaW5zJyk7XHJcblxyXG4gICAgbGV0IHBsdWdpbk5hbWUgPSBmdWxjcnVtLmFyZ3MubmFtZTtcclxuXHJcbiAgICBpZiAocGx1Z2luTmFtZSAmJiBwbHVnaW5OYW1lLmluZGV4T2YoJ2Z1bGNydW0tZGVza3RvcCcpICE9PSAwKSB7XHJcbiAgICAgIHBsdWdpbk5hbWUgPSBgZnVsY3J1bS1kZXNrdG9wLSR7IHBsdWdpbk5hbWUgfWA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXJsID0gZnVsY3J1bS5hcmdzLnVybCB8fCBgaHR0cHM6Ly9naXRodWIuY29tL2Z1bGNydW1hcHAvJHsgcGx1Z2luTmFtZSB9YDtcclxuXHJcbiAgICBjb25zdCBwYXJ0cyA9IHVybC5zcGxpdCgnLycpO1xyXG5cclxuICAgIGNvbnN0IG5hbWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXS5yZXBsYWNlKC9cXC5naXQvLCAnJyk7XHJcblxyXG4gICAgY29uc3QgbmV3UGx1Z2luUGF0aCA9IHBhdGguam9pbihwbHVnaW5QYXRoLCBuYW1lKTtcclxuXHJcbiAgICBjb25zdCBsb2dnZXIgPSBwbHVnaW5Mb2dnZXIobmV3UGx1Z2luUGF0aCk7XHJcblxyXG4gICAgbG9nZ2VyLmxvZygnQ2xvbmluZy4uLicpO1xyXG5cclxuICAgIGF3YWl0IGdpdC5jbG9uZSh1cmwsIG5ld1BsdWdpblBhdGgpO1xyXG5cclxuICAgIGxvZ2dlci5sb2coJ0luc3RhbGxpbmcgZGVwZW5kZW5jaWVzLi4uJyk7XHJcblxyXG4gICAgYXdhaXQgeWFybi5ydW4oJ2luc3RhbGwnLCB7ZW52OiBwbHVnaW5FbnYsIGN3ZDogbmV3UGx1Z2luUGF0aCwgbG9nZ2VyfSk7XHJcblxyXG4gICAgbG9nZ2VyLmxvZygnUGx1Z2luIGluc3RhbGxlZCBhdCcsIG5ld1BsdWdpblBhdGgpO1xyXG4gIH1cclxufVxyXG4iXX0=