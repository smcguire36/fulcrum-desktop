import path from 'path';
import glob from 'glob';
import yarn from '../yarn';

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

      try {
        console.log('Installing dependencies...', pluginPath);

        await yarn.run('install', {cwd: pluginDir});

        console.log('Compiling plugin...', pluginPath);

        await yarn.run('build', {cwd: pluginDir});

        console.log('Plugin built.\n\n');
      } catch (ex) {
        console.error('Error building plugin', pluginPath, ex);
      }
    }
  }
}
