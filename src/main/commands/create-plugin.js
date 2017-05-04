import path from 'path';
import yarn from '../yarn';
import git from '../git';
import mkdirp from 'mkdirp';
import fs from 'fs';
import pluginLogger from '../plugin-logger';

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

    const logger = pluginLogger(newPluginPath);

    logger.log('Installing dependencies...');

    await yarn.run('install', {cwd: newPluginPath, logger});

    logger.log('Compiling...');

    await yarn.run('build', {cwd: newPluginPath, logger});

    logger.log('Setting up git repository...');

    await git.init(newPluginPath);

    logger.log('Plugin created at', path.join(pluginPath, fulcrum.args.name));
    logger.log('Run the plugin task using:');
    logger.log('  fulcrum ' + fulcrum.args.name);
  }
}
