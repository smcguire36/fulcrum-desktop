import path from 'path';
import { execSync } from 'child_process';
import pluginEnv from '../plugin-env';
import git from '../git';
import yarn from '../yarn';

export default class {
  async task(cli) {
    return cli.command({
      command: 'install-plugin',
      desc: 'install a plugin',
      builder: {
        url: {
          type: 'string',
          desc: 'the URL to a git repo',
          required: true
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPath = fulcrum.dir('plugins');

    const parts = fulcrum.args.url.split('/');

    const name = parts[parts.length - 1].replace(/\.git/, '');

    const newPluginPath = path.join(pluginPath, name);

    console.log('Cloning...');

    await git.clone(fulcrum.args.url, newPluginPath);

    console.log('Installing...');

    await yarn.run('install', {env: pluginEnv, cwd: newPluginPath});

    console.log('Plugin installed at', newPluginPath);
  }
}
