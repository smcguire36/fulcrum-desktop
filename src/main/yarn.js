import {exec} from 'child_process';
import path from 'path';
import pluginEnv from './plugin-env';

export default class Yarn {
  static get yarnRoot() {
    if (process.env.DEVELOPMENT) {
      return path.resolve(path.join(__dirname, '..', '..', 'resources', 'yarn', 'yarn'));
    }

    if (process.platform === 'darwin') {
      return path.resolve(path.join(process.execPath, '..', 'yarn'));
    }

    return path.join(process.execPath, 'yarn');
  }

  static get yarnBin() {
    return path.join(this.yarnRoot, 'bin', 'yarn.js');
  }

  static run(command, options = {}) {
    const env = {
      ...process.env,
      ...options.env,
      ...pluginEnv,
      ELECTRON_RUN_AS_NODE: 1
    };

    const wrappedCommand = [
      process.execPath,
      this.yarnBin,
      command
    ].join(' ');

    const parts = options.cwd.split(path.sep);
    const name = parts[parts.length - 1];

    return new Promise((resolve, reject) => {
      try {
        const child = exec(wrappedCommand, {...options, env});

        child.stdout.on('data', (data) => {
          process.stdout.write(name.green + ' ' + data.toString());
        });

        child.stderr.on('data', (data) => {
          process.stderr.write(name.red + ' ' + data.toString());
        });

        child.on('exit', function() {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

