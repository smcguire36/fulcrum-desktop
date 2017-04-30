import path from 'path';
import { execSync } from 'child_process';
import glob from 'glob';
import pluginEnv from '../plugin-env';

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

      const commands = [];

      commands.push('yarn');
      commands.push('yarn build');

      const string = commands.join(' && ');

      console.log('Building plugin...', pluginPath);

      try {
        const result = execSync(string, {cwd: pluginDir, env: pluginEnv});
        console.log(result.toString());
        console.log('Plugin built.\n\n');
      } catch (ex) {
        console.error('Error building plugin', pluginPath, ex.stderr.toString());
      }
    }
  }
}
