import path from 'path';
import glob from 'glob';
import yarn from '../yarn';
import pluginLogger from '../plugin-logger';

export default class {
  async task(cli) {
    return cli.command({
      command: 'build-plugins',
      desc: 'build all plugins',
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPaths = glob.sync(path.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

    for (const pluginPath of pluginPaths) {
      const pluginDir = path.resolve(path.dirname(pluginPath));
      const logger = pluginLogger(pluginDir);

      try {
        logger.log('Installing dependencies...', pluginPath);

        await yarn.run('install', {cwd: pluginDir, logger});

        logger.log('Compiling plugin...', pluginPath);

        await yarn.run('build', {cwd: pluginDir, logger});

        logger.log('Plugin built.');
      } catch (ex) {
        logger.error('Error building plugin', pluginPath, ex);
      }
    }
  }
}
