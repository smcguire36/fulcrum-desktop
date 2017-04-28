import path from 'path';
import { execSync } from 'child_process';
import glob from 'glob';

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

      const commands = [];

      commands.push('git pull');
      commands.push('yarn');

      const string = commands.join(' && ');

      console.log('Updating plugin...', pluginPath);

      try {
        execSync(string, {cwd: pluginDir});
        console.log('Plugin updated.');
      } catch (ex) {
        console.error('Error updating plugin', pluginPath, ex.stderr.toString());
      }
    }
  }
}
