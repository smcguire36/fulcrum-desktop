import fs from 'fs';
import Promise from 'bluebird';

const readFile = Promise.promisify(fs.readFile);

export default class Migration {
  constructor(db, versionName) {
    this.db = db;
    this.versionName = versionName;
  }

  async executeMigrationSQL(suffix) {
    const fileName = './src/db/migrations/version_' + this.versionName + '.' + suffix + '.sql';

    const data = await readFile(fileName, { encoding: 'utf8' });

    const sql = [];

    for (let part of data.split('\n\n')) {
      if (part.trim().length && part.trim().substring(0, 2) !== '--') {
        sql.push(part.trim());
      }
    }

    if (sql.length === 0) {
      return [];
    }

    const results = [];

    for (let script of sql) {
      if (this.db.verbose) {
        console.log(script, '\n');
      }

      results.push(await this.db.execute(script));
    }

    return results;
  }

  async executeUpgradeSQL() {
    return await this.executeMigrationSQL('up');
  }

  async executeDowngradeSQL() {
    return await this.executeMigrationSQL('down');
  }

  async up() {
    return await this.executeUpgradeSQL();
  }

  async down() {
    return await this.executeDowngradeSQL();
  }
}
