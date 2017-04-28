import 'colors';
import yargs from 'yargs';
import Promise from 'bluebird';
import Account from '../models/account';
import { DataSource } from 'fulcrum-core';
import LocalDatabaseDataSource from '../local-database-data-source';
import app from '../app';

// import { Database } from 'minidb';
// Database.debug = true;

Promise.longStackTraces();

export default class Command {
  async setup() {
    this.app = app;

    await this.app.initialize();
  }

  async destroy() {
    await this.app.dispose();
  }

  get db() {
    return this.app.db;
  }

  get yargs() {
    return yargs;
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
}
