import { app } from 'electron';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

log.info('Auto-updater starting...');

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
  console.log('Update available.');
});

autoUpdater.on('update-not-available', (ev, info) => {
  console.log('Update not available.');
});

autoUpdater.on('error', (ev, err) => {
  console.log('Error in auto-updater.');
});

autoUpdater.on('download-progress', (ev, progressObj) => {
  console.log('Download progress...');
});

autoUpdater.on('update-downloaded', (ev, info) => {
  console.log('Update downloaded; will install in 5 seconds');
});

autoUpdater.on('update-downloaded', (ev, info) => {
  setTimeout(function() {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('ready', function() {
  if (process.env.DEVELOPMENT) {
    return;
  }

  autoUpdater.checkForUpdates();
});
