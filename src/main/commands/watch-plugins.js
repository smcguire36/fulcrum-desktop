import path from 'path';
import { spawn, exec } from 'child_process';
import glob from 'glob';

const ELECTRON_VERSION = '1.6.6';

export default class {
  async task(cli) {
    return cli.command({
      command: 'watch-plugins',
      desc: 'watch and recompile all plugins',
      builder: {
        name: {
          desc: 'plugin name to watch',
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    const pluginPaths = glob.sync(path.join(fulcrum.dir('plugins'), '*'));

    const promises = [];

    for (const pluginPath of pluginPaths) {
      const pluginDir = path.resolve(pluginPath);

      if (pluginDir.indexOf('hello') > -1) {
        continue;
      }

      const env = {
        ...process.env,
        npm_config_target: ELECTRON_VERSION,
        npm_config_arch: process.arch,
        npm_config_target_arch: process.arch,
        npm_config_disturl: 'https://atom.io/download/electron',
        npm_config_runtime: 'electron',
        npm_config_build_from_source: 'true'
      };

      const parts = pluginPath.split(path.sep);
      const name = parts[parts.length - 1];

      console.log(name);
      if (fulcrum.args.name && name !== fulcrum.args.name) {
        continue;
      }

      console.log('Watching plugin...', pluginPath);

      promises.push(new Promise((resolve, reject) => {
        try {
          const child = exec('yarn watch', {cwd: pluginDir, env});

          child.stdout.on('data', (data) => {
            process.stdout.write(name.green + ' ' + data.toString());
          });

          child.stderr.on('data', (data) => {
            process.stderr.write(name.red + ' ' + data.toString());
          });

          child.on('exit', function() {
            console.log(name.green, 'Done!');
            resolve();
          });

          console.log('Watching...\n\n');
        } catch (ex) {
          console.error('Error watching plugin', pluginPath, ex);
        }
      }));
    }

    await Promise.all(promises);
  }
}
