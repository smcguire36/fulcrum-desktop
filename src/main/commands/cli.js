import 'colors';
import yargs from 'yargs';
import Promise from 'bluebird';
import Account from '../models/account';
import { DataSource } from 'fulcrum-core';
import LocalDatabaseDataSource from '../local-database-data-source';
import app from '../app';

import Setup from './setup';
import InstallPlugin from './install-plugin';
import CreatePlugin from './create-plugin';
import UpdatePlugins from './update-plugins';
import Sync from './sync';
import Query from './query';
import version from '../../version';

import { Database } from 'minidb';

Promise.longStackTraces();

yargs.$0 = 'fulcrum';

const COMMANDS = [
  Setup,
  Sync,
  InstallPlugin,
  CreatePlugin,
  UpdatePlugins,
  Query
];

export default class CLI {
  async setup() {
    this.app = app;

    this._yargs = yargs.env('FULCRUM');

    if (this.args.debugsql) {
      Database.debug = true;
    }

    await this.app.initialize();
  }

  async destroy() {
    await this.app.dispose();
  }

  async run() {
    let cli = this.yargs.usage('Usage: fulcrum <cmd> [args]');

    cli.$0 = 'fulcrum';

    // this is some hacks to coordinate the yargs handler function with this async function.
    // if yargs adds support for promises in the command handlers this can go away.
    let promiseResolve = null;
    let promiseReject = null;

    const completion = new Promise((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    for (const CommandClass of COMMANDS) {
      const command = new CommandClass();

      command.app = this.app;

      const commandCli = await command.task(this.wrapAsync(cli, promiseResolve, promiseReject));

      if (commandCli) {
        cli = commandCli;
      }
    }

    for (const plugin of this.app._plugins) {
      if (plugin.task) {
        const pluginCommand = await plugin.task(this.wrapAsync(cli, promiseResolve, promiseReject));

        if (pluginCommand) {
          cli = pluginCommand;
        }
      }
    }

    this.argv =
      cli.command('*', 'help', (argv) => cli.showHelp())
       .demandCommand()
       .version(version.fulcrum)
       .help()
       .argv;

    await completion;
  }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return this._yargs;
  }

  get args() {
    return yargs.argv;
  }

  async fetchAccount(name) {
    const where = {};

    if (name) {
      where.organization_name = name;
    }

    const accounts = await Account.findAll(this.db, where);

    return accounts;
  }

  async createDataSource(account) {
    let dataSource = new DataSource();

    const localDatabase = new LocalDatabaseDataSource(account);

    dataSource.add(localDatabase);

    await localDatabase.load(this.db);

    return dataSource;
  }

  async start() {
    try {
      // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
      process.on('SIGINT', function() {
        process.exit();
      });

      await this.setup();
      await this.run();
      await this.destroy();
    } catch (err) {
      console.error(err.stack);
      // if (this.args.verbose) {
      //   console.error(err.stack);
      // } else {
      //   console.error(err.message);
      // }

      await this.destroy();
    }

    // TODO(zhm) required or it hangs for ~30sec https://github.com/electron/electron/issues/4944
    process.exit();
  }

  // this hacks the yargs command handler to allow it to return a promise (async function)
  wrapAsync = (obj, resolve, reject) => {
    const __command = obj.command.bind(obj);

    obj.command = (...args) => {
      if (args && args[0] && args[0].handler) {
        const handler = args[0].handler;

        args[0].handler = () => {
          const result = handler();

          if (result && result.then) {
            result.then(resolve).catch(reject);
          }
        };
      }

      return __command(...args);
    };

    return obj;
  }
}

new CLI().start().then(() => {
}).catch((err) => {
  console.error(err);
});
