import path from 'path';
import { execSync } from 'child_process';
import pluginEnv from '../plugin-env';
import git from '../git';
import yarn from '../yarn';
import pluginLogger from '../plugin-logger';

export default class {
  async task(cli) {
    return cli.command({
      command: 'install-plugin',
      desc: 'install a plugin',
      builder: {
        name: {
          type: 'string',
          desc: 'the plugin name'
        },
        url: {
          type: 'string',
          desc: 'the URL to a git repo'
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPath = fulcrum.dir('plugins');

    let pluginName = fulcrum.args.name;

    if (pluginName && pluginName.indexOf('fulcrum-desktop') !== 0) {
      pluginName = `fulcrum-desktop-${ pluginName }`;
    }

    const url = fulcrum.args.url || `https://github.com/fulcrumapp/${ pluginName }`;

    const parts = url.split('/');

    const name = parts[parts.length - 1].replace(/\.git/, '');

    const newPluginPath = path.join(pluginPath, name);

    const logger = pluginLogger(newPluginPath);

    logger.log('Cloning...');

    await git.clone(url, newPluginPath);

    logger.log('Installing dependencies...');

    await yarn.run('install', {env: pluginEnv, cwd: newPluginPath, logger});

    logger.log('Plugin installed at', newPluginPath);
  }
}
