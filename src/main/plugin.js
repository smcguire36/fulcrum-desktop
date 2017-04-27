import { DataSource } from 'fulcrum-core';
import Account from './models/account';
import LocalDatabaseDataSource from './local-database-data-source';

export default class Plugin {
  constructor({db}) {
    this._db = db;
  }

  get db() {
    return this._db;
  }

  async fetchAccount(name) {
    const where = {};

    if (name) {
      where.organization_name = name;
    }

    const accounts = await Account.findAll(this.db, where);

    return accounts[0];
  }

  async createDataSource(account) {
    let dataSource = new DataSource();

    const localDatabase = new LocalDatabaseDataSource(account);

    dataSource.add(localDatabase);

    await localDatabase.load(this.db);

    return dataSource;
  }
}
