import Command from './command';
import path from 'path';
import { execSync } from 'child_process';

class NewPlugin extends Command {
  async run() {
    const pluginPath = this.app.dir('plugins');

    const commands = [];

    const parts = this.args.git.split('/');

    const name = parts[parts.length - 1].replace(/\.git/, '');

    const newPluginPath = path.join(pluginPath, name);

    commands.push(`git clone ${this.args.git} ${newPluginPath}`);
    commands.push(`cd ${newPluginPath}`);
    commands.push('yarn');

    const string = commands.join(' && ');

    console.log('Installing...');

    execSync(string);

    console.log('Plugin installed at', newPluginPath);
  }
}

new NewPlugin().start();
