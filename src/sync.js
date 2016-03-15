require('colors');

import Promise from 'bluebird';
import Synchronizer from './synchronizer';
import Account from './models/account';
import database from './db/database';

import { DataSource } from 'fulcrum-core';
import SQLiteDataSource from './sqlite-data-source';

Promise.longStackTraces();

let db = null;

async function synchronize(name) {
  db = await database();

  const where = {};

  if (name) {
    where.organization_name = name;
  }

  const accounts = await Account.findAll(db, where);

  for (const account of accounts) {
    let dataSource = new DataSource();

    const sqliteSource = new SQLiteDataSource(account);

    dataSource.add(sqliteSource);

    await sqliteSource.load(db);

    await Synchronizer.instance.run(account, dataSource);
  }
}

function onerror(err) {
  console.log('ERROR!');
  db.close();
  console.error(err.stack);
  throw err;
}

const organizationName = process.argv[3];

synchronize(organizationName).then(function(result) {
  db.close();
}).catch(onerror);
