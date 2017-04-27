'use strict';

var _electron = require('electron');

var _electronLog = require('electron-log');

var _electronLog2 = _interopRequireDefault(_electronLog);

var _electronUpdater = require('electron-updater');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_electronUpdater.autoUpdater.logger = _electronLog2.default;
_electronUpdater.autoUpdater.logger.transports.file.level = 'info';

_electronLog2.default.info('Auto-updater starting...');

_electronUpdater.autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

_electronUpdater.autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.');
});

_electronUpdater.autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.');
});

_electronUpdater.autoUpdater.on('error', (ev, err) => {
  console.log('Error in auto-updater.');
});

_electronUpdater.autoUpdater.on('download-progress', (ev, progressObj) => {
  console.log('Download progress...');
});

_electronUpdater.autoUpdater.on('update-downloaded', (ev, info) => {
  console.log('Update downloaded; will install in 5 seconds');
});

_electronUpdater.autoUpdater.on('update-downloaded', (ev, info) => {
  setTimeout(function () {
    _electronUpdater.autoUpdater.quitAndInstall();
  }, 5000);
});

_electron.app.on('ready', function () {
  _electronUpdater.autoUpdater.checkForUpdates();
});
//# sourceMappingURL=auto-updater.js.map