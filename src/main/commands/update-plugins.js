import path from 'path';
import glob from 'glob';
import yarn from '../yarn';
import git from '../git';
import pluginLogger from '../plugin-logger';

export default class {
  async task(cli) {
    return cli.command({
      command: 'update-plugins',
      desc: 'update all plugins',
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPaths = glob.sync(path.join(fulcrum.dir('plugins'), '*', 'plugin.js'));

    for (const pluginPath of pluginPaths) {
      const pluginDir = path.resolve(path.dirname(pluginPath));

      const logger = pluginLogger(pluginDir);

      try {
        logger.log('Pulling changes...');

        await git.pull(pluginDir);

        logger.log('Installing dependencies...');

        await yarn.run('install', {cwd: pluginDir, logger});

        logger.log('Plugin updated.');
      } catch (ex) {
        logger.error('Error updating plugin', pluginPath, ex);
      }
    }
  }
}
