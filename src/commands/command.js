import 'colors';
import yargs from 'yargs';
import Promise from 'bluebird';
import Account from '../models/account';
import database from '../db/database';
import fs from 'fs';
import path from 'path';
import { DataSource } from 'fulcrum-core';
import LocalDatabaseDataSource from '../local-database-data-source';
import { Postgres } from 'minidb';
import app from '../app';

Promise.longStackTraces();

const config = JSON.parse(fs.readFileSync(path.join('data', 'config.json')).toString());

export default class Command {
  async setup() {
    this.app = app;

    this._db = await database(this.config);

    await this.app.initialize({db: this.db});
  }

  async destroy() {
    await this.app.dispose({db: this.db});

    await this._db.close();

    Postgres.shutdown();
  }

  get db() {
    return this._db;
  }

  get yargs() {
    return yargs;
  }

  get args() {
    return yargs.argv;
  }

  get config() {
    return config;
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
  }
}
