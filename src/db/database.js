import { SQLite, Postgres } from 'minidb';
import Migrations from './migrations';
import path from 'path';
import mkdirp from 'mkdirp';

let instance = null;

const dir = path.join('.', 'data');

mkdirp.sync(dir);

const sqliteOptions = {
  file: path.join(dir, 'fulcrumapp.db'),
  wal: true,
  autoVacuum: true,
  synchronous: 'off'
};

const postgresOptions = {
  db: 'dbname = fulcrumapp'
};

Postgres.setNoticeProcessor((message) => {
  // TODO(zhm) handle warnings on the connection
  // console.warn(message);
});

export default async function database(options) {
  if (instance) {
    return instance;
  }

  if (options.type === 'SQLite') {
    instance = new SQLite(sqliteOptions);
  } else if (options.type === 'PostgreSQL') {
    instance = new Postgres(postgresOptions);
  } else {
    throw new Error('unsupported database type: ' + options.type);
  }

  const migrations = new Migrations(instance);

  await instance.open();

  await migrations.migrate();

  return instance;
}
