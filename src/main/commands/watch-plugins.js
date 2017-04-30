import path from 'path';
import { spawn, exec } from 'child_process';
import glob from 'glob';
import pluginEnv from '../plugin-env';

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

      const parts = pluginPath.split(path.sep);
      const name = parts[parts.length - 1];

      if (fulcrum.args.name && name !== fulcrum.args.name) {
        continue;
      }

      console.log('Watching plugin...', pluginPath);

      promises.push(new Promise((resolve, reject) => {
        try {
          const child = exec('yarn watch', {cwd: pluginDir, env: pluginEnv});

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
