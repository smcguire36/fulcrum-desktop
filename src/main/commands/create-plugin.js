import path from 'path';
import { execSync } from 'child_process';
import pluginEnv from '../plugin-env';

export default class {
  async task(cli) {
    return cli.command({
      command: 'create-plugin',
      desc: 'create a new plugin',
      builder: {
        name: {
          type: 'string',
          desc: 'the new plugin name',
          required: true
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPath = fulcrum.dir('plugins');

    const files = [
      'package.json',
      'plugin.js',
      '.gitignore'
    ];

    const commands = [];

    const newPluginPath = path.join(pluginPath, fulcrum.args.name);

    commands.push(`mkdir -p ${newPluginPath}`);

    for (const file of files) {
      const sourcePath = path.resolve(path.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));

      commands.push(`cp ${sourcePath} ${newPluginPath}`);
    }

    commands.push('yarn');
    commands.push(`cd ${newPluginPath}`);
    commands.push('git init');

    const string = commands.join(' && ');

    console.log('Installing...');

    execSync(string, {env: pluginEnv});

    console.log('Plugin created at', path.join(pluginPath, fulcrum.args.name));
    console.log('Run the plugin task using:\n');
    console.log('  fulcrum ' + fulcrum.args.name);
  }
}
