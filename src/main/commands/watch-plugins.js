import path from 'path';
import { spawn, exec } from 'child_process';
import glob from 'glob';
import yarn from '../yarn';
import pluginLogger from '../plugin-logger';

export default class {
  async task(cli) {
    return cli.command({
      command: 'watch-plugins',
      desc: 'watch and recompile all plugins',
      builder: {
        name: {
          desc: 'plugin name to watch',
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPaths = glob.sync(path.join(fulcrum.dir('plugins'), '*'));

    const promises = [];

    for (const pluginPath of pluginPaths) {
      const pluginDir = path.resolve(pluginPath);

      const logger = pluginLogger(pluginDir);

      const parts = pluginPath.split(path.sep);
      const name = parts[parts.length - 1];

      if (fulcrum.args.name && name !== fulcrum.args.name) {
        continue;
      }

      logger.log('Watching plugin...', pluginPath);

      promises.push(yarn.run('watch', {cwd: pluginDir, logger}));
    }

    await Promise.all(promises);
  }
}
