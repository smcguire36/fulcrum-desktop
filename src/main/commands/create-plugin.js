import path from 'path';
import yarn from '../yarn';
import git from '../git';
import mkdirp from 'mkdirp';
import fs from 'fs';

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

    const newPluginPath = path.join(pluginPath, fulcrum.args.name);

    mkdirp.sync(newPluginPath);

    for (const file of files) {
      let sourcePath = null;

      if (process.env.DEVELOPMENT) {
        sourcePath = path.resolve(path.join(__dirname, '..', '..', '..', 'resources', 'default-plugin', file));
      } else if (process.platform === 'darwin') {
        sourcePath = path.join(path.dirname(process.execPath), '..', 'default-plugin', file);
      } else {
        sourcePath = path.join(path.dirname(process.execPath), 'default-plugin', file);
      }

      fs.writeFileSync(path.join(newPluginPath, file), fs.readFileSync(sourcePath));
    }

    console.log('Installing dependencies...');

    await yarn.run('install', {cwd: newPluginPath});

    console.log('Setting up git repository...');

    await git.init(newPluginPath);

    console.log('Plugin created at', path.join(pluginPath, fulcrum.args.name));
    console.log('Run the plugin task using:\n');
    console.log('  fulcrum ' + fulcrum.args.name);
  }
}
