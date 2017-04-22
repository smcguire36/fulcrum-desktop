import Command from './command';
import path from 'path';
import { execSync } from 'child_process';

class NewPlugin extends Command {
  async run() {
    const pluginPath = this.app.dir('plugins');

    const files = [
      'package.json',
      'plugin.js',
      '.babelrc',
      '.gitignore'
    ];

    const commands = [];

    const newPluginPath = path.join(pluginPath, this.args.name);

    commands.push(`mkdir -p ${newPluginPath}`);

    for (const file of files) {
      const sourcePath = path.resolve(path.join(__dirname, '..', '..', 'resources', 'default-plugin', file));

      commands.push(`cp ${sourcePath} ${newPluginPath}`);
    }

    commands.push(`cd ${newPluginPath}`);
    commands.push('yarn');
    commands.push('git init');

    const string = commands.join(' && ');

    console.log('Installing...');

    execSync(string);

    console.log('Plugin created at', path.join(pluginPath, this.args.name));
    console.log('Run the plugin task using:\n');
    console.log('  ./run task ' + this.args.name);
  }
}

new NewPlugin().start();
