import {SQLite} from 'minidb';
import Migrations from './migrations';
import path from 'path';
import mkdirp from 'mkdirp';

let instance = null;

let dir = path.join('.', 'data');
mkdirp.sync(dir);

let options = {
  file: path.join(dir, 'fulcrumapp.db'),
  wal: true,
  autoVacuum: true,
  synchronous: 'off'
};

export default async function database() {
  if (instance) {
    return instance;
  }

  instance = new SQLite(options);

  const migrations = new Migrations(instance);

  await instance.open();

  await migrations.migrate();

  return instance;
}
