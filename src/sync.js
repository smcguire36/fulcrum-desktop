require('colors');

import Promise from 'bluebird';
import Synchronizer from './synchronizer';
import Account from './models/account';
import database from './db/database';
import fs from 'fs';
import path from 'path';

import { DataSource } from 'fulcrum-core';
import SQLiteDataSource from './sqlite-data-source';

Promise.longStackTraces();

let db = null;

const config = JSON.parse(fs.readFileSync(path.join('data', 'config.json')).toString());

async function synchronize(organizationName, formName) {
  db = await database(config);

  const where = {};

  if (organizationName) {
    where.organization_name = organizationName;
  }

  const accounts = await Account.findAll(db, where);

  for (const account of accounts) {
    let dataSource = new DataSource();

    const sqliteSource = new SQLiteDataSource(account);

    dataSource.add(sqliteSource);

    await sqliteSource.load(db);

    await Synchronizer.instance.run(account, formName, dataSource);
  }
}

function onerror(err) {
  console.log('ERROR!');
  db.close();
  console.error(err.stack);
  throw err;
}

const organizationName = process.argv[3];
const formName = process.argv[4];

synchronize(organizationName, formName).then(function(result) {
  db.close();
}).catch(onerror);
