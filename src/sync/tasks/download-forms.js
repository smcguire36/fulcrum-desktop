import Task from './task';
import Client from '../../api/Client';
import Form from '../../models/form';
import {format} from 'util';
import RecordValues from '../../record-values';

import Schema from 'fulcrum-schema/dist/schema';
import sqldiff from 'sqldiff';
import V2 from 'fulcrum-schema/dist/schemas/postgres-query-v2';

const {SchemaDiffer, Sqlite, Postgres} = sqldiff;

export default class DownloadForms extends Task {
  async run({account, dataSource}) {
    const sync = await this.checkSyncState(account, 'forms');

    if (!sync.needsUpdate) {
      return;
    }

    this.progress({message: this.downloading + ' forms'});

    const response = await Client.getForms(account);

    const objects = JSON.parse(response.body).forms;

    this.progress({message: this.processing + ' forms', count: 0, total: objects.length});

    const localForms = await account.findForms({});

    // delete all forms that don't exist on the server anymore
    for (const form of localForms) {
      let formExistsOnServer = false;

      for (const attributes of objects) {
        if (attributes.id === form.id) {
          formExistsOnServer = true;
          break;
        }
      }

      if (!formExistsOnServer) {
        form._deletedAt = form._deletedAt ? form._deletedAt : new Date();
        await form.save();
      }
    }

    for (let index = 0; index < objects.length; ++index) {
      const attributes = objects[index];

      const object = await Form.findOrCreate(account.db, {resource_id: attributes.id, account_id: account.rowID});

      let oldForm = null;

      if (object.isPersisted) {
        oldForm = {
          id: object._id,
          row_id: object.rowID,
          name: object._name,
          elements: object._elementsJSON
        };
      }

      const isChanged = !object.isPersisted || attributes.version !== object.version;

      object.updateFromAPIAttributes(attributes);

      await object.save();

      const newForm = {row_id: object.rowID,
                       name: object._name,
                       elements: object._elementsJSON};

      await account.db.execute(format('DROP VIEW IF EXISTS %s',
                                      account.db.ident(object.name)));

      const statements = await this.updateFormTables(account, oldForm, newForm);

      await account.db.execute(format('CREATE VIEW %s AS SELECT * FROM %s_view_full',
                                      account.db.ident(object.name),
                                      RecordValues.tableNameWithForm(object)));

      if (isChanged) {
        await this.trigger('form:save', {form: object, account, statements, oldForm, newForm});
      }

      this.progress({message: this.processing + ' forms', count: index + 1, total: objects.length});
    }

    await sync.update();

    this.progress({message: this.finished + ' forms', count: objects.length, total: objects.length});
  }

  async updateFormTables(account, oldForm, newForm) {
    let oldSchema = null;
    let newSchema = null;

    if (oldForm) {
      oldSchema = new Schema(oldForm, V2, null);
    }

    if (newForm) {
      newSchema = new Schema(newForm, V2, null);
    }

    const differ = new SchemaDiffer(oldSchema, newSchema);

    let generator = null;

    if (account.db.dialect === 'sqlite') {
      generator = new Sqlite(differ, {afterTransform: null});
    } else if (account.db.dialect === 'postgresql') {
      generator = new Postgres(differ, {afterTransform: null});
    }

    generator.tablePrefix = 'account_' + account.rowID + '_';

    const statements = generator.generate();

    await account.db.transaction(async (db) => {
      for (const statement of statements) {
        await db.execute(statement);
      }
    });

    return statements;
  }
}
