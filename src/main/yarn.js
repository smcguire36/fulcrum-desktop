import {exec} from 'child_process';
import path from 'path';
import pluginEnv from './plugin-env';

export default class Yarn {
  static get yarnBin() {
    if (process.env.DEVELOPMENT) {
      return path.resolve(path.join(__dirname, '..', '..', 'resources', 'scripts', 'yarn.js'));
    }

    if (process.platform === 'darwin') {
      return path.resolve(path.join(path.dirname(process.execPath), '..', 'scripts', 'yarn.js'));
    }

    return path.join(path.dirname(process.execPath), 'scripts', 'yarn.js');
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

    return new Promise((resolve, reject) => {
      try {
        const child = exec(wrappedCommand, {...options, env});

        child.stdout.on('data', options.logger.stdoutWrite);

        child.stderr.on('data', options.logger.stderrWrite);

        child.on('exit', function() {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

