import path from 'path';
import os from 'os';

// we need this file because we want to get these paths from Nodejs-only processes

/*
 *  Windows: %LOCALAPPDATA%
 *  macOS:   ~/Library/Application Support
 *  Linux:   ~/.config
 */

let appData = '';
let userData = '';

const APPNAME = 'Fulcrum';

if (process.platform === 'win32') {
  appData = process.env.LOCALAPPDATA;
} else if (process.platform === 'darwin') {
  appData = path.join(os.homedir(), 'Library', 'Application Support');
} else {
  appData = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
}

userData = path.join(appData, APPNAME);

const paths = {
  appData,
  userData
};

export default paths;
