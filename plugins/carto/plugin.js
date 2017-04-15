import Plugin from '../../src/plugin';
import request from 'request';
import Promise from 'bluebird';
// import qs from 'qs';

// import PostgresRecordValues from '../../src/record-values/postgres-record-values';

import Schema from 'fulcrum-schema/dist/schema';
import sqldiff from 'sqldiff';
import V2 from 'fulcrum-schema/dist/schemas/postgres-query-v2';

const {SchemaDiffer, Sqlite, Postgres} = sqldiff;

const reqPromise = Promise.promisify(request);
const req = (options) => reqPromise({forever: true, ...options});

const CARTO_API_KEY = '';
const CARTO_USER = '';

export default class Carto extends Plugin {
  get enabled() {
    return false;
  }

  async initialize({app}) {
    return null;

    app.on('choice_list:save', this.onChoiceListSave);
    app.on('classification_set:save', this.onClassificationSetSave);
    app.on('project:save', this.onProjectSave);
    app.on('form:save', this.onFormSave);
    app.on('record:save', this.onRecordSave);
    app.on('record:delete', this.onRecordDelete);

    const response = await this.run('SELECT cdb_usertables AS name FROM CDB_UserTables()');

    const rows = response.body.rows;

    this.tableNames = rows.map(o => o.name);

    console.log('Existing Tables', '\n  ' + this.tableNames.join('\n  '));
  }

  run = async (sql) => {
    const options = {
      url: `https://${CARTO_USER}.carto.com/api/v2/sql`,
      method: 'POST',
      json: {
        q: sql,
        api_key: CARTO_API_KEY
      }
    };

    return await req(options);
  }

  log = (...args) => {
    // console.log(...args);
  }

  tableName = (account, name) => {
    return 'carto_' + account.rowID + '_' + name;
  }

  onFormSave = async ({form, account, oldForm, newForm}) => {
    const rootTableName = this.tableName(account, 'form_' + form.rowID);

    if (this.tableNames.indexOf(rootTableName) === -1) {
      oldForm = null;
    }

    if (form.name === 'Facility Inspection') {
      const {statements, newSchema} = await this.updateFormTableStatements(account, oldForm, newForm);

      const cartoConvertStatements = newSchema.tables.map((view) => {
        return "select cdb_cartodbfytable('" + this.tableName(account, view.name) + "');";
      });

      const cartoStatements = [
        ...statements,
        ...cartoConvertStatements
      ];

      console.log('CARTO', cartoStatements.join('\n'));

      const response = await this.run(cartoStatements.join('\n'));

      console.log(response.body);
    }
  }

  onRecordSave = ({record}) => {
    // this.log('record updated', record.displayValue);
  }

  onRecordDelete = ({record}) => {
    // this.log('record deleted', record.displayValue);
  }

  onChoiceListSave = ({object}) => {
    // if (object.version === 1) {
    //   this.log('choice list created', object.name);
    // } else {
    //   this.log('choice list updated', object.name);
    // }
  }

  onClassificationSetSave = ({object}) => {
    // if (object.version === 1) {
    //   this.log('classification set created', object.name);
    // } else {
    //   this.log('classification set updated', object.name);
    // }
  }

  onProjectSave = ({object}) => {
    // this.log('project saved', object.name);
  }

  async updateFormTableStatements(account, oldForm, newForm) {
    let oldSchema = null;
    let newSchema = null;

    if (oldForm) {
      oldSchema = new Schema(oldForm, V2, null);
    }

    if (newForm) {
      newSchema = new Schema(newForm, V2, null);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    let generator = new Postgres(differ, {afterTransform: null});

    generator.tablePrefix = 'carto_' + account.rowID + '_';

    const statements = generator.generate();

    // await account.db.transaction(async (db) => {
    //   for (const statement of statements) {
    //     await db.execute(statement);
    //   }
    // });

    return {statements, oldSchema, newSchema};
  }
}
