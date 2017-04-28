import path from 'path';
import { execSync } from 'child_process';

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

    const commands = [];

    const parts = fulcrum.args.url.split('/');

    const name = parts[parts.length - 1].replace(/\.git/, '');

    const newPluginPath = path.join(pluginPath, name);

    commands.push(`git clone ${fulcrum.args.url} ${newPluginPath}`);
    commands.push(`cd ${newPluginPath}`);
    commands.push('yarn');

    const string = commands.join(' && ');

    console.log('Installing...');

    execSync(string);

    console.log('Plugin installed at', newPluginPath);
  }
}
