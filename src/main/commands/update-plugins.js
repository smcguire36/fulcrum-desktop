import path from 'path';
import glob from 'glob';
import yarn from '../yarn';
import git from '../git';

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

      try {
        console.log('Pulling changes...');
        await git.pull(pluginDir);

        console.log('Installing dependencies...');

        await yarn.run('install', {cwd: pluginDir});

        console.log('Plugin updated.\n\n');
      } catch (ex) {
        console.error('Error updating plugin', pluginPath, ex.toString());
      }
    }
  }
}
