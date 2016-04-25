import 'colors';
import yargs from 'yargs';
import Promise from 'bluebird';
import Account from '../models/account';
import database from '../db/database';
import fs from 'fs';
import path from 'path';
import { DataSource } from 'fulcrum-core';
import LocalDatabaseDataSource from '../local-database-data-source';

Promise.longStackTraces();

const config = JSON.parse(fs.readFileSync(path.join('data', 'config.json')).toString());

export default class Command {
  async setup() {
    this._db = await database(this.config);
  }

  async destroy() {
    await this._db.close();
  }

  get db() {
    return this._db;
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
      this.db.close();
      throw err;
    }
  }
}
