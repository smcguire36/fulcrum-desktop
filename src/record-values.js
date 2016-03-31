import {format} from 'util';
import _ from 'lodash';
import {Record, RepeatableItemValue} from 'fulcrum-core';

export default class RecordValues {
  static async updateForRecord(record) {
    await this.deleteForRecord(record);
    await this.insertForRecord(record);
  }

  static async insertForRecord(record) {
    const {db} = record;

    const form = await record.getForm();

    await this.insertRowForFeature(db, form, record, null, record);
    await this.insertChildFeaturesForFeature(db, form, record, record);
    await this.insertMultipleValuesForFeature(db, form, record, record);
    await this.insertChildMultipleValuesForFeature(db, form, record, record);
  }

  static async insertRowForFeature(db, form, feature, parentFeature, record) {
    const values = this.columnValuesForFeature(feature);
    const systemValues = this.systemColumnValuesForFeature(feature, parentFeature, record);

    Object.assign(values, systemValues);

    let tableName = null;

    if (feature instanceof RepeatableItemValue) {
      // TODO(zhm) add public interface for accessing _element, like `get repeatableElement()`
      tableName = this.tableNameWithForm(form, feature._element);
    } else {
      tableName = this.tableNameWithForm(form, null);
    }

    await db.insert(tableName, values, {pk: 'id'});
  }

  static async insertChildFeaturesForFeature(db, form, feature, record) {
    for (const formValue of feature.formValues.all) {
      if (formValue.element.isRepeatableElement) {
        // TODO(zhm) add public interface for _items
        for (const repeatableItem of formValue._items) {
          await this.insertRowForFeature(db, form, repeatableItem, feature, record);
          await this.insertChildFeaturesForFeature(db, form, repeatableItem, record);
        }
      }
    }
  }

  static columnValuesForFeature(feature) {
    const values = {};

    for (const formValue of feature.formValues.all) {
      if (formValue.isEmpty) {
        continue;
      }

      let columnValue = formValue.columnValue;

      if (_.isNumber(columnValue) || _.isString(columnValue) || _.isArray(columnValue)) {
        values['f' + formValue.element.key] = columnValue;
      } else if (columnValue) {
        Object.assign(values, columnValue);
      }
    }

    return values;
  }

  static async insertMultipleValuesForFeature(db, form, feature, record) {
    const values = this.multipleValuesForFeature(feature, record);

    const tableName = this.multipleValueTableNameWithForm(form);

    let parentResourceId = null;

    if (feature instanceof RepeatableItemValue) {
      parentResourceId = feature.id;
    }

    for (const multipleValueItem of values) {
      const insertValues = Object.assign({}, {key: multipleValueItem.element.key, text_value: multipleValueItem.value},
                                         {record_id: record.rowID, parent_resource_id: parentResourceId});

      await db.insert(tableName, insertValues, {pk: 'id'});
    }
  }

  static async insertChildMultipleValuesForFeature(db, form, feature, record) {
    for (const formValue of feature.formValues.all) {
      if (formValue.isRepeatableElement) {
        for (const repeatableItem of formValue._items) {
          await this.insertMultipleValuesForFeature(db, form, repeatableItem, record);
          await this.insertChildMultipleValuesForFeature(db, form, repeatableItem, record);
        }
      }
    }
  }

  static multipleValuesForFeature(feature, record) {
    const values = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.isEmpty) {
        continue;
      }

      const featureValues = formValue.multipleValues;

      if (featureValues) {
        values.push.apply(values, featureValues);
      }
    }

    return values;
  }

  static systemColumnValuesForFeature(feature, parentFeature, record) {
    const values = {};

    values.record_id = record.rowID;
    values.record_resource_id = record.id;

    if (feature instanceof Record) {
      // TODO(zhm) projectID is busted probably
      // if (record.projectID) {
      //   values.project_id = record.project.rowID;
      // }

      if (record.status) {
        values.status = record.status;
      }

      if (record.latitude) {
        values.latitude = record.latitude;
      }

      if (record.longitude) {
        values.longitude = record.longitude;
      }
    } else if (feature instanceof RepeatableItemValue) {
      values.resource_id = feature.id;

      if (parentFeature instanceof RepeatableItemValue) {
        values.parent_resource_id = parentFeature.id;
      }

      if (feature.hasCoordinate) {
        values.latitude = feature.latitude;
        values.longitude = feature.longitude;
      }
    }

    // TODO(zhm) bring these back
    if (feature.createdAt) {
      values.created_at = feature.createdAt.timeIntervalSince1970;
    }

    if (feature.updatedAt) {
      values.updated_at = feature.updatedAt.timeIntervalSince1970;
    }

    values.created_at = feature.createdAt;
    values.updated_at = feature.updatedAt;
    values.version = feature.version;

    // TODO(zhm) bring this back
    values.created_by_id = -1;
    values.updated_by_id = -1;
    values.server_created_at = feature.createdAt;
    values.server_updated_at = feature.updatedAt;

    return values;
  }

  static async deleteForAccount(account) {
    // TODO(zhm) implement this
    // [account.formsSortedByNameIncludingDeleted enumerateObjectsUsingBlock:^(FCMForm *form, NSUInteger idx, BOOL *stop) {
    //     [self deleteRowsForForm:form];
    // }];
  }

  // static async deleteRowsForForm(form) {
  //   leArray *tableNames = [NSMutableArray new];

  //   [tableNames addObject:[self tableNameWithForm:form repeatable:nil]];

  //   NSArray *repeatables = [form.rootSection elementsOfType:kFCMElementTypeRepeatable];

  //   [repeatables enumerateObjectsUsingBlock:^(FCMRepeatableElement *repeatable, NSUInteger idx, BOOL *stop) {
  //       [tableNames addObject:[self tableNameWithForm:form repeatable:repeatable]];
  //   }];

  //   [tableNames addObject:[self multipleValueTableNameWithForm:form]];

  //   [[FCMPersistentStore queue] inDatabase:^(FMDatabase *db) {
  //       [tableNames enumerateObjectsUsingBlock:^(NSString *tableName, NSUInteger idx, BOOL *stop) {
  //           NSString *query = @"DELETE FROM %@ WHERE record_id IN (SELECT id FROM records WHERE account_id = ? AND form_id = ? AND has_local_changes = 0 AND id NOT IN (SELECT record_id FROM attachments WHERE has_local_changes = 1 AND record_id IS NOT NULL))";

  //           query = [NSString stringWithFormat:query, tableName];

  //           BOOL result = [db executeUpdate:query withArgumentsInArray:@[ @(form.account.rowID), @(form.rowID) ]];

  //           if (!result) {
  //               FCMLogError(db.lastError);
  //           }
  //       }];
  //   }];

  static async deleteForRecord(record) {
    const {db} = record;
    const form = await record.getForm();

    const repeatables = form.elementsOfType('Repeatable');

    let tableName = this.tableNameWithForm(form, null);

    await this.deleteRowsForRecord(db, record, tableName);

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithForm(form, repeatable);

      await this.deleteRowsForRecord(db, record, tableName);
    }

    tableName = this.multipleValueTableNameWithForm(form);

    await this.deleteRowsForRecord(db, record, tableName);
  }

  static async deleteRowsForRecord(db, record, tableName) {
    // TODO(zhm) this needs to use an indexed column, but which is it?
    await db.execute(format("DELETE FROM %s WHERE record_resource_id = '%s'", tableName, record.id));
  }

  static async updateForAccount(account, progressCallback) {
    // [[FCMPersistentStore queue] inDatabase:^(FMDatabase *db) {
    //     NSString *tableNameParameter = [NSString stringWithFormat:@"account_%llu_%%", account.rowID];

    //     NSString *query = @"SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ? ORDER BY name";

    //     FMResultSet *resultSet = [db executeQuery:query withArgumentsInArray:@[ tableNameParameter ]];

    //     NSMutableArray *tablesToDrop = [NSMutableArray new];

    //     while ([resultSet next]) {
    //         NSString *tableName = [resultSet stringForColumnIndex:0];

    //         [tablesToDrop addObject:tableName];
    //     }

    //     [resultSet close];

    //     [tablesToDrop enumerateObjectsUsingBlock:^(NSString *tableName, NSUInteger idx, BOOL *stop) {
    //         NSString *drop = [NSString stringWithFormat:@"DROP TABLE %@", tableName];

    //         BOOL result = [db executeUpdate:drop];

    //         if (!result) {
    //             FCMLogError(db.lastError);
    //         }
    //     }];
    // }];

    // FCMFormSchema *schema = [FCMFormSchema new];

    // [account.formsSortedByNameIncludingDeleted enumerateObjectsUsingBlock:^(FCMForm *form, NSUInteger idx, BOOL *stop) {
    //     progress(form, [NSString stringWithFormat:FCMStringMigrationIndexingForm, form.name]);

    //     [FCMPersistentStore beginTransaction];

    //     [schema updateSchemaWithOldForm:nil newForm:form inAccount:account];

    //     [FCMPersistentStore commitTransaction];

    //     [FCMPersistentStore beginTransaction];

    //     [self updateForForm:form progress:progress];

    //     [FCMPersistentStore commitTransaction];
    // }];
  }

  static async updateForForm(form, progressCallback) {
    // __block int count = 0;

    // [FCMRecord selectBachesWithPredicate:@"form_id = ?"
    //                               values:@[ @(form.rowID) ]
    //                              orderBy:@"id ASC"
    //                            batchSize:500
    //                             callback:^(NSArray *records) {
    //                                 @autoreleasepool {
    //                                     [records enumerateObjectsUsingBlock:^(FCMRecord *record, NSUInteger idx, BOOL *stop) {
    //                                         // set the form and account explicitly so each one doesn't have to fetch its own
    //                                         // copy lazily in the getter.

    //                                         record.form = form;
    //                                         record.account = form.account;

    //                                         [self updateForRecord:record];

    //                                         ++count;

    //                                         if (count % 50 == 0) {
    //                                             progress(form, [NSString stringWithFormat:FCMStringMigrationIndexingFormProgress, form.name, count]);
    //                                         }
    //                                     }];
    //                                 }
    //                             }];

  }

  static multipleValueTableNameWithForm(form) {
    return format('account_%s_form_%s_values', form._accountRowID, form.rowID);
  }

  static tableNameWithForm(form, repeatable) {
    if (repeatable == null) {
      return format('account_%s_form_%s', form._accountRowID, form.rowID);
    }

    return format('account_%s_form_%s_%s', form._accountRowID, form.rowID, repeatable.key);
  }
}
