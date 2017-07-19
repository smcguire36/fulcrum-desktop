'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fulcrumCore = require('fulcrum-core');

var _pgFormat = require('pg-format');

var _pgFormat2 = _interopRequireDefault(_pgFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RecordValues {
  static updateForRecordStatements(db, record, options = {}) {
    const statements = [];

    statements.push.apply(statements, this.deleteForRecordStatements(db, record, record.form, options));
    statements.push.apply(statements, this.insertForRecordStatements(db, record, record.form, options));

    return statements;
  }

  static insertForRecordStatements(db, record, form, options = {}) {
    const statements = [];

    statements.push(this.insertRowForFeatureStatement(db, form, record, null, record, options));
    statements.push.apply(statements, this.insertChildFeaturesForFeatureStatements(db, form, record, record, options));
    statements.push.apply(statements, this.insertMultipleValuesForFeatureStatements(db, form, record, record, options));
    statements.push.apply(statements, this.insertChildMultipleValuesForFeatureStatements(db, form, record, record, options));

    return statements;
  }

  static insertRowForFeatureStatement(db, form, feature, parentFeature, record, options = {}) {
    const values = this.columnValuesForFeature(feature, options);
    const systemValues = this.systemColumnValuesForFeature(feature, parentFeature, record, options);

    Object.assign(values, systemValues);

    let tableName = null;

    if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      // TODO(zhm) add public interface for accessing _element, like `get repeatableElement()`
      tableName = this.tableNameWithForm(form, feature._element);
    } else {
      tableName = this.tableNameWithForm(form, null);
    }

    return db.insertStatement(tableName, values, { pk: 'id' });
  }

  static insertChildFeaturesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.element.isRepeatableElement) {
        // TODO(zhm) add public interface for _items
        for (const repeatableItem of formValue._items) {
          statements.push(this.insertRowForFeatureStatement(db, form, repeatableItem, feature, record, options));
          statements.push.apply(statements, this.insertChildFeaturesForFeatureStatements(db, form, repeatableItem, record, options));
        }
      }
    }

    return statements;
  }

  static maybeAssignArray(values, key, value, disableArrays) {
    if (value == null) {
      return;
    }

    values[key] = _lodash2.default.isArray(value) && disableArrays ? value.join(',') : value;
  }

  static columnValuesForFeature(feature, options = {}) {
    const values = {};

    for (const formValue of feature.formValues.all) {
      if (formValue.isEmpty) {
        continue;
      }

      let columnValue = formValue.columnValue;

      if (_lodash2.default.isNumber(columnValue) || _lodash2.default.isString(columnValue) || _lodash2.default.isArray(columnValue) || _lodash2.default.isDate(columnValue)) {
        // don't allow dates greater than 9999, yes - they exist in the wild
        if (_lodash2.default.isDate(columnValue) && columnValue.getFullYear() > 9999) {
          columnValue = null;
        }

        this.maybeAssignArray(values, 'f' + formValue.element.key.toLowerCase(), columnValue, options.disableArrays);
      } else if (columnValue) {
        const element = formValue.element;

        if (element && options.mediaURLFormatter) {
          if (element.isPhotoElement || element.isVideoElement || element.isAudioElement) {
            const prefix = 'f' + formValue.element.key.toLowerCase();

            columnValue[prefix + '_urls'] = options.mediaURLFormatter(formValue);

            if (options.mediaViewURLFormatter) {
              columnValue[prefix + '_view_url'] = options.mediaViewURLFormatter(formValue);
            }
          }
        }

        // if array types are disabled, convert all the props to delimited values
        if (options.disableArrays) {
          for (const key of Object.keys(columnValue)) {
            this.maybeAssignArray(columnValue, key, columnValue[key], options.disableArrays);
          }
        }

        Object.assign(values, columnValue);
      }
    }

    return values;
  }

  static insertMultipleValuesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];

    const values = this.multipleValuesForFeature(feature, record);

    const tableName = this.multipleValueTableNameWithForm(form);

    let parentResourceId = null;

    if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      parentResourceId = feature.id;
    }

    for (const multipleValueItem of values) {
      const insertValues = Object.assign({}, { key: multipleValueItem.element.key, text_value: multipleValueItem.value }, { record_id: record.rowID, record_resource_id: record.id, parent_resource_id: parentResourceId });

      statements.push(db.insertStatement(tableName, insertValues, { pk: 'id' }));
    }

    return statements;
  }

  static insertChildMultipleValuesForFeatureStatements(db, form, feature, record, options = {}) {
    const statements = [];

    for (const formValue of feature.formValues.all) {
      if (formValue.isRepeatableElement) {
        for (const repeatableItem of formValue._items) {
          statements.push.apply(statements, this.insertMultipleValuesForFeatureStatements(db, form, repeatableItem, record, options));
          statements.push.apply(statements, this.insertChildMultipleValuesForFeatureStatements(db, form, repeatableItem, record, options));
        }
      }
    }

    return statements;
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

  static systemColumnValuesForFeature(feature, parentFeature, record, options = {}) {
    const values = {};

    values.record_id = record.rowID;
    values.record_resource_id = record.id;

    if (options.reportURLFormatter) {
      values.report_url = options.reportURLFormatter(feature);
    }

    if (feature instanceof _fulcrumCore.Record) {
      if (record._projectRowID) {
        values.project_id = record._projectRowID;
      }

      if (record.projectID) {
        values.project_resource_id = record.projectID;
      }

      if (record._assignedToRowID) {
        values.assigned_to_id = record._assignedToRowID;
      }

      if (record.assignedToID) {
        values.assigned_to_resource_id = record.assignedToID;
      }

      if (record._createdByRowID) {
        values.created_by_id = record._createdByRowID;
      }

      if (record.createdByID) {
        values.created_by_resource_id = record.createdByID;
      }

      if (record._updatedByRowID) {
        values.updated_by_id = record._updatedByRowID;
      }

      if (record.updatedByID) {
        values.updated_by_resource_id = record.updatedByID;
      }

      if (record._changesetRowID) {
        values.changeset_id = record._changesetRowID;
      }

      if (record.changesetID) {
        values.changeset_resource_id = record.changesetID;
      }

      if (record.status) {
        values.status = record.status;
      }

      if (record.latitude != null) {
        values.latitude = record.latitude;
      }

      if (record.longitude != null) {
        values.longitude = record.longitude;
      }

      values.altitude = record.altitude;
      values.speed = record.speed;
      values.course = record.course;
      values.vertical_accuracy = record.verticalAccuracy;
      values.horizontal_accuracy = record.horizontalAccuracy;
    } else if (feature instanceof _fulcrumCore.RepeatableItemValue) {
      values.resource_id = feature.id;
      values.index = feature.index;
      values.parent_resource_id = parentFeature.id;

      if (feature.hasCoordinate) {
        values.latitude = feature.latitude;
        values.longitude = feature.longitude;
      }

      // record values
      if (record.status) {
        values.record_status = record.status;
      }

      if (record._projectRowID) {
        values.record_project_id = record._projectRowID;
      }

      if (record.projectID) {
        values.record_project_resource_id = record.projectID;
      }

      if (record._assignedToRowID) {
        values.record_assigned_to_id = record._assignedToRowID;
      }

      if (record.assignedToID) {
        values.record_assigned_to_resource_id = record.assignedToID;
      }

      // linked fields
      if (feature.createdBy) {
        values.created_by_id = feature.createdBy.rowID;
      }

      if (feature.createdByID) {
        values.created_by_resource_id = feature.createdByID;
      }

      if (feature.updatedBy) {
        values.updated_by_id = feature.updatedBy.rowID;
      }

      if (feature.updatedByID) {
        values.updated_by_resource_id = feature.updatedByID;
      }

      if (feature.changeset) {
        values.changeset_id = feature.changeset.rowID;
        values.changeset_resource_id = feature.changesetID;
      } else if (record._changesetRowID) {
        values.changeset_id = record._changesetRowID;
        values.changeset_resource_id = record.changesetID;
      }
    }

    values.title = feature.displayValue;

    values.form_values = JSON.stringify(feature.formValues.toJSON());

    this.setupSearch(values, feature);

    if (feature.hasCoordinate) {
      values.geometry = this.setupPoint(values, feature.latitude, feature.longitude);
    } else {
      values.geometry = null;
    }

    values.created_at = feature.clientCreatedAt || feature.createdAt;
    values.updated_at = feature.clientUpdatedAt || feature.updatedAt;
    values.version = feature.version;

    if (values.created_by_id == null) {
      values.created_by_id = -1;
    }

    if (values.updated_by_id == null) {
      values.updated_by_id = -1;
    }

    values.server_created_at = feature.createdAt;
    values.server_updated_at = feature.updatedAt;

    values.created_duration = feature.createdDuration;
    values.updated_duration = feature.updatedDuration;
    values.edited_duration = feature.editedDuration;

    values.created_latitude = feature.createdLatitude;
    values.created_longitude = feature.createdLongitude;
    values.created_altitude = feature.createdAltitude;
    values.created_horizontal_accuracy = feature.createdAccuracy;

    if (feature.hasCreatedCoordinate) {
      values.created_geometry = this.setupPoint(values, feature.createdLatitude, feature.createdLongitude);
    }

    values.updated_latitude = feature.updatedLatitude;
    values.updated_longitude = feature.updatedLongitude;
    values.updated_altitude = feature.updatedAltitude;
    values.updated_horizontal_accuracy = feature.updatedAccuracy;

    if (feature.hasUpdatedCoordinate) {
      values.updated_geometry = this.setupPoint(values, feature.updatedLatitude, feature.updatedLongitude);
    }

    return values;
  }

  static deleteRowsForRecordStatement(db, record, tableName) {
    return db.deleteStatement(tableName, { record_resource_id: record.id });
  }

  static deleteRowsStatement(db, tableName) {
    return db.deleteStatement(tableName, {});
  }

  static deleteForRecordStatements(db, record, form) {
    const repeatables = form.elementsOfType('Repeatable');

    const statements = [];

    let tableName = this.tableNameWithForm(form, null);

    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithForm(form, repeatable);

      statements.push(this.deleteRowsForRecordStatement(db, record, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form);

    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));

    return statements;
  }

  static deleteForFormStatements(db, form) {
    const repeatables = form.elementsOfType('Repeatable');

    const statements = [];

    let tableName = this.tableNameWithForm(form, null);

    statements.push(this.deleteRowsStatement(db, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithForm(form, repeatable);

      statements.push(this.deleteRowsStatement(db, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form);

    statements.push(this.deleteRowsStatement(db, tableName));

    return statements;
  }

  static multipleValueTableNameWithForm(form) {
    return (0, _util.format)('account_%s_form_%s_values', form._accountRowID, form.rowID);
  }

  static tableNameWithForm(form, repeatable) {
    if (repeatable == null) {
      return (0, _util.format)('account_%s_form_%s', form._accountRowID, form.rowID);
    }

    return (0, _util.format)('account_%s_form_%s_%s', form._accountRowID, form.rowID, repeatable.key);
  }

  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;
    values.record_index = { raw: `to_tsvector(${(0, _pgFormat2.default)('%L', searchableValue)})` };

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = (0, _pgFormat2.default)('POINT(%s %s)', longitude, latitude);

    return { raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${wkt}'), 4326))` };
  }
}
exports.default = RecordValues;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMuanMiXSwibmFtZXMiOlsiUmVjb3JkVmFsdWVzIiwidXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImRiIiwicmVjb3JkIiwib3B0aW9ucyIsInN0YXRlbWVudHMiLCJwdXNoIiwiYXBwbHkiLCJkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiZm9ybSIsImluc2VydEZvclJlY29yZFN0YXRlbWVudHMiLCJpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50IiwiaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzIiwiaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImZlYXR1cmUiLCJwYXJlbnRGZWF0dXJlIiwidmFsdWVzIiwiY29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsInN5c3RlbVZhbHVlcyIsInN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YWJsZU5hbWUiLCJ0YWJsZU5hbWVXaXRoRm9ybSIsIl9lbGVtZW50IiwiaW5zZXJ0U3RhdGVtZW50IiwicGsiLCJmb3JtVmFsdWUiLCJmb3JtVmFsdWVzIiwiYWxsIiwiZWxlbWVudCIsImlzUmVwZWF0YWJsZUVsZW1lbnQiLCJyZXBlYXRhYmxlSXRlbSIsIl9pdGVtcyIsIm1heWJlQXNzaWduQXJyYXkiLCJrZXkiLCJ2YWx1ZSIsImRpc2FibGVBcnJheXMiLCJpc0FycmF5Iiwiam9pbiIsImlzRW1wdHkiLCJjb2x1bW5WYWx1ZSIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJpc0RhdGUiLCJnZXRGdWxsWWVhciIsInRvTG93ZXJDYXNlIiwibWVkaWFVUkxGb3JtYXR0ZXIiLCJpc1Bob3RvRWxlbWVudCIsImlzVmlkZW9FbGVtZW50IiwiaXNBdWRpb0VsZW1lbnQiLCJwcmVmaXgiLCJtZWRpYVZpZXdVUkxGb3JtYXR0ZXIiLCJrZXlzIiwibXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlIiwibXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtIiwicGFyZW50UmVzb3VyY2VJZCIsImlkIiwibXVsdGlwbGVWYWx1ZUl0ZW0iLCJpbnNlcnRWYWx1ZXMiLCJ0ZXh0X3ZhbHVlIiwicmVjb3JkX2lkIiwicm93SUQiLCJyZWNvcmRfcmVzb3VyY2VfaWQiLCJwYXJlbnRfcmVzb3VyY2VfaWQiLCJmZWF0dXJlVmFsdWVzIiwibXVsdGlwbGVWYWx1ZXMiLCJyZXBvcnRVUkxGb3JtYXR0ZXIiLCJyZXBvcnRfdXJsIiwiX3Byb2plY3RSb3dJRCIsInByb2plY3RfaWQiLCJwcm9qZWN0SUQiLCJwcm9qZWN0X3Jlc291cmNlX2lkIiwiX2Fzc2lnbmVkVG9Sb3dJRCIsImFzc2lnbmVkX3RvX2lkIiwiYXNzaWduZWRUb0lEIiwiYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQiLCJfY3JlYXRlZEJ5Um93SUQiLCJjcmVhdGVkX2J5X2lkIiwiY3JlYXRlZEJ5SUQiLCJjcmVhdGVkX2J5X3Jlc291cmNlX2lkIiwiX3VwZGF0ZWRCeVJvd0lEIiwidXBkYXRlZF9ieV9pZCIsInVwZGF0ZWRCeUlEIiwidXBkYXRlZF9ieV9yZXNvdXJjZV9pZCIsIl9jaGFuZ2VzZXRSb3dJRCIsImNoYW5nZXNldF9pZCIsImNoYW5nZXNldElEIiwiY2hhbmdlc2V0X3Jlc291cmNlX2lkIiwic3RhdHVzIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJhbHRpdHVkZSIsInNwZWVkIiwiY291cnNlIiwidmVydGljYWxfYWNjdXJhY3kiLCJ2ZXJ0aWNhbEFjY3VyYWN5IiwiaG9yaXpvbnRhbF9hY2N1cmFjeSIsImhvcml6b250YWxBY2N1cmFjeSIsInJlc291cmNlX2lkIiwiaW5kZXgiLCJoYXNDb29yZGluYXRlIiwicmVjb3JkX3N0YXR1cyIsInJlY29yZF9wcm9qZWN0X2lkIiwicmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQiLCJyZWNvcmRfYXNzaWduZWRfdG9faWQiLCJyZWNvcmRfYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQiLCJjcmVhdGVkQnkiLCJ1cGRhdGVkQnkiLCJjaGFuZ2VzZXQiLCJ0aXRsZSIsImRpc3BsYXlWYWx1ZSIsImZvcm1fdmFsdWVzIiwiSlNPTiIsInN0cmluZ2lmeSIsInRvSlNPTiIsInNldHVwU2VhcmNoIiwiZ2VvbWV0cnkiLCJzZXR1cFBvaW50IiwiY3JlYXRlZF9hdCIsImNsaWVudENyZWF0ZWRBdCIsImNyZWF0ZWRBdCIsInVwZGF0ZWRfYXQiLCJjbGllbnRVcGRhdGVkQXQiLCJ1cGRhdGVkQXQiLCJ2ZXJzaW9uIiwic2VydmVyX2NyZWF0ZWRfYXQiLCJzZXJ2ZXJfdXBkYXRlZF9hdCIsImNyZWF0ZWRfZHVyYXRpb24iLCJjcmVhdGVkRHVyYXRpb24iLCJ1cGRhdGVkX2R1cmF0aW9uIiwidXBkYXRlZER1cmF0aW9uIiwiZWRpdGVkX2R1cmF0aW9uIiwiZWRpdGVkRHVyYXRpb24iLCJjcmVhdGVkX2xhdGl0dWRlIiwiY3JlYXRlZExhdGl0dWRlIiwiY3JlYXRlZF9sb25naXR1ZGUiLCJjcmVhdGVkTG9uZ2l0dWRlIiwiY3JlYXRlZF9hbHRpdHVkZSIsImNyZWF0ZWRBbHRpdHVkZSIsImNyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeSIsImNyZWF0ZWRBY2N1cmFjeSIsImhhc0NyZWF0ZWRDb29yZGluYXRlIiwiY3JlYXRlZF9nZW9tZXRyeSIsInVwZGF0ZWRfbGF0aXR1ZGUiLCJ1cGRhdGVkTGF0aXR1ZGUiLCJ1cGRhdGVkX2xvbmdpdHVkZSIsInVwZGF0ZWRMb25naXR1ZGUiLCJ1cGRhdGVkX2FsdGl0dWRlIiwidXBkYXRlZEFsdGl0dWRlIiwidXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5IiwidXBkYXRlZEFjY3VyYWN5IiwiaGFzVXBkYXRlZENvb3JkaW5hdGUiLCJ1cGRhdGVkX2dlb21ldHJ5IiwiZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudCIsImRlbGV0ZVN0YXRlbWVudCIsImRlbGV0ZVJvd3NTdGF0ZW1lbnQiLCJyZXBlYXRhYmxlcyIsImVsZW1lbnRzT2ZUeXBlIiwicmVwZWF0YWJsZSIsImRlbGV0ZUZvckZvcm1TdGF0ZW1lbnRzIiwiX2FjY291bnRSb3dJRCIsInNlYXJjaGFibGVWYWx1ZSIsInJlY29yZF9pbmRleF90ZXh0IiwicmVjb3JkX2luZGV4IiwicmF3Iiwid2t0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7QUFFZSxNQUFNQSxZQUFOLENBQW1CO0FBQ2hDLFNBQU9DLHlCQUFQLENBQWlDQyxFQUFqQyxFQUFxQ0MsTUFBckMsRUFBNkNDLFVBQVUsRUFBdkQsRUFBMkQ7QUFDekQsVUFBTUMsYUFBYSxFQUFuQjs7QUFFQUEsZUFBV0MsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0JGLFVBQXRCLEVBQWtDLEtBQUtHLHlCQUFMLENBQStCTixFQUEvQixFQUFtQ0MsTUFBbkMsRUFBMkNBLE9BQU9NLElBQWxELEVBQXdETCxPQUF4RCxDQUFsQztBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0sseUJBQUwsQ0FBK0JSLEVBQS9CLEVBQW1DQyxNQUFuQyxFQUEyQ0EsT0FBT00sSUFBbEQsRUFBd0RMLE9BQXhELENBQWxDOztBQUVBLFdBQU9DLFVBQVA7QUFDRDs7QUFFRCxTQUFPSyx5QkFBUCxDQUFpQ1IsRUFBakMsRUFBcUNDLE1BQXJDLEVBQTZDTSxJQUE3QyxFQUFtREwsVUFBVSxFQUE3RCxFQUFpRTtBQUMvRCxVQUFNQyxhQUFhLEVBQW5COztBQUVBQSxlQUFXQyxJQUFYLENBQWdCLEtBQUtLLDRCQUFMLENBQWtDVCxFQUFsQyxFQUFzQ08sSUFBdEMsRUFBNENOLE1BQTVDLEVBQW9ELElBQXBELEVBQTBEQSxNQUExRCxFQUFrRUMsT0FBbEUsQ0FBaEI7QUFDQUMsZUFBV0MsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0JGLFVBQXRCLEVBQWtDLEtBQUtP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O0FBQ2xDLFVBQU1vSixrQkFBa0JwSixRQUFRb0osZUFBaEM7O0FBRUFsSixXQUFPbUosaUJBQVAsR0FBMkJELGVBQTNCO0FBQ0FsSixXQUFPb0osWUFBUCxHQUFzQixFQUFDQyxLQUFNLGVBQWUsd0JBQVMsSUFBVCxFQUFlSCxlQUFmLENBQWlDLEdBQXZELEVBQXRCOztBQUVBLFdBQU9sSixNQUFQO0FBQ0Q7O0FBRUQsU0FBT3NHLFVBQVAsQ0FBa0J0RyxNQUFsQixFQUEwQjBFLFFBQTFCLEVBQW9DQyxTQUFwQyxFQUErQztBQUM3QyxVQUFNMkUsTUFBTSx3QkFBUyxjQUFULEVBQXlCM0UsU0FBekIsRUFBb0NELFFBQXBDLENBQVo7O0FBRUEsV0FBTyxFQUFDMkUsS0FBTSwwQ0FBMENDLEdBQUssWUFBdEQsRUFBUDtBQUNEO0FBcGErQjtrQkFBYnZLLFkiLCJmaWxlIjoicmVjb3JkLXZhbHVlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFJlY29yZCwgUmVwZWF0YWJsZUl0ZW1WYWx1ZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgcGdmb3JtYXQgZnJvbSAncGctZm9ybWF0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjb3JkVmFsdWVzIHtcbiAgc3RhdGljIHVwZGF0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuZGVsZXRlRm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCByZWNvcmQuZm9ybSwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydEZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgcmVjb3JkLmZvcm0sIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydEZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgZm9ybSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuaW5zZXJ0Um93Rm9yRmVhdHVyZVN0YXRlbWVudChkYiwgZm9ybSwgcmVjb3JkLCBudWxsLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50KGRiLCBmb3JtLCBmZWF0dXJlLCBwYXJlbnRGZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuY29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBvcHRpb25zKTtcbiAgICBjb25zdCBzeXN0ZW1WYWx1ZXMgPSB0aGlzLnN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zKTtcblxuICAgIE9iamVjdC5hc3NpZ24odmFsdWVzLCBzeXN0ZW1WYWx1ZXMpO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IG51bGw7XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlcGVhdGFibGVJdGVtVmFsdWUpIHtcbiAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgYWNjZXNzaW5nIF9lbGVtZW50LCBsaWtlIGBnZXQgcmVwZWF0YWJsZUVsZW1lbnQoKWBcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgZmVhdHVyZS5fZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRiLmluc2VydFN0YXRlbWVudCh0YWJsZU5hbWUsIHZhbHVlcywge3BrOiAnaWQnfSk7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuZWxlbWVudC5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgX2l0ZW1zXG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG1heWJlQXNzaWduQXJyYXkodmFsdWVzLCBrZXksIHZhbHVlLCBkaXNhYmxlQXJyYXlzKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YWx1ZXNba2V5XSA9IChfLmlzQXJyYXkodmFsdWUpICYmIGRpc2FibGVBcnJheXMpID8gdmFsdWUuam9pbignLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIGNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XG4gICAgICBpZiAoZm9ybVZhbHVlLmlzRW1wdHkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb2x1bW5WYWx1ZSA9IGZvcm1WYWx1ZS5jb2x1bW5WYWx1ZTtcblxuICAgICAgaWYgKF8uaXNOdW1iZXIoY29sdW1uVmFsdWUpIHx8IF8uaXNTdHJpbmcoY29sdW1uVmFsdWUpIHx8IF8uaXNBcnJheShjb2x1bW5WYWx1ZSkgfHwgXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgIC8vIGRvbid0IGFsbG93IGRhdGVzIGdyZWF0ZXIgdGhhbiA5OTk5LCB5ZXMgLSB0aGV5IGV4aXN0IGluIHRoZSB3aWxkXG4gICAgICAgIGlmIChfLmlzRGF0ZShjb2x1bW5WYWx1ZSkgJiYgY29sdW1uVmFsdWUuZ2V0RnVsbFllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1heWJlQXNzaWduQXJyYXkodmFsdWVzLCAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKSwgY29sdW1uVmFsdWUsIG9wdGlvbnMuZGlzYWJsZUFycmF5cyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbHVtblZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBmb3JtVmFsdWUuZWxlbWVudDtcblxuICAgICAgICBpZiAoZWxlbWVudCAmJiBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaXNQaG90b0VsZW1lbnQgfHwgZWxlbWVudC5pc1ZpZGVvRWxlbWVudCB8fCBlbGVtZW50LmlzQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29sdW1uVmFsdWVbcHJlZml4ICsgJ191cmxzJ10gPSBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKGZvcm1WYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICBjb2x1bW5WYWx1ZVtwcmVmaXggKyAnX3ZpZXdfdXJsJ10gPSBvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcihmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFycmF5IHR5cGVzIGFyZSBkaXNhYmxlZCwgY29udmVydCBhbGwgdGhlIHByb3BzIHRvIGRlbGltaXRlZCB2YWx1ZXNcbiAgICAgICAgaWYgKG9wdGlvbnMuZGlzYWJsZUFycmF5cykge1xuICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNvbHVtblZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5tYXliZUFzc2lnbkFycmF5KGNvbHVtblZhbHVlLCBrZXksIGNvbHVtblZhbHVlW2tleV0sIG9wdGlvbnMuZGlzYWJsZUFycmF5cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih2YWx1ZXMsIGNvbHVtblZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5tdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKTtcblxuICAgIGNvbnN0IHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0pO1xuXG4gICAgbGV0IHBhcmVudFJlc291cmNlSWQgPSBudWxsO1xuXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XG4gICAgICBwYXJlbnRSZXNvdXJjZUlkID0gZmVhdHVyZS5pZDtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG11bHRpcGxlVmFsdWVJdGVtIG9mIHZhbHVlcykge1xuICAgICAgY29uc3QgaW5zZXJ0VmFsdWVzID0gT2JqZWN0LmFzc2lnbih7fSwge2tleTogbXVsdGlwbGVWYWx1ZUl0ZW0uZWxlbWVudC5rZXksIHRleHRfdmFsdWU6IG11bHRpcGxlVmFsdWVJdGVtLnZhbHVlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY29yZF9pZDogcmVjb3JkLnJvd0lELCByZWNvcmRfcmVzb3VyY2VfaWQ6IHJlY29yZC5pZCwgcGFyZW50X3Jlc291cmNlX2lkOiBwYXJlbnRSZXNvdXJjZUlkfSk7XG5cbiAgICAgIHN0YXRlbWVudHMucHVzaChkYi5pbnNlcnRTdGF0ZW1lbnQodGFibGVOYW1lLCBpbnNlcnRWYWx1ZXMsIHtwazogJ2lkJ30pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCByZWNvcmQpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNFbXB0eSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZVZhbHVlcyA9IGZvcm1WYWx1ZS5tdWx0aXBsZVZhbHVlcztcblxuICAgICAgaWYgKGZlYXR1cmVWYWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCBmZWF0dXJlVmFsdWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcblxuICAgIHZhbHVlcy5yZWNvcmRfaWQgPSByZWNvcmQucm93SUQ7XG4gICAgdmFsdWVzLnJlY29yZF9yZXNvdXJjZV9pZCA9IHJlY29yZC5pZDtcblxuICAgIGlmIChvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcikge1xuICAgICAgdmFsdWVzLnJlcG9ydF91cmwgPSBvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcihmZWF0dXJlKTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlY29yZCkge1xuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X2lkID0gcmVjb3JkLl9wcm9qZWN0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQucHJvamVjdElEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X3Jlc291cmNlX2lkID0gcmVjb3JkLnByb2plY3RJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMuYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQgPSByZWNvcmQuYXNzaWduZWRUb0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9jcmVhdGVkQnlSb3dJRCkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IHJlY29yZC5fY3JlYXRlZEJ5Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY3JlYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQgPSByZWNvcmQuY3JlYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX3VwZGF0ZWRCeVJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gcmVjb3JkLl91cGRhdGVkQnlSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC51cGRhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY2hhbmdlc2V0SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IHJlY29yZC5jaGFuZ2VzZXRJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5zdGF0dXMpIHtcbiAgICAgICAgdmFsdWVzLnN0YXR1cyA9IHJlY29yZC5zdGF0dXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubGF0aXR1ZGUgIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSByZWNvcmQubGF0aXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubG9uZ2l0dWRlICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWVzLmxvbmdpdHVkZSA9IHJlY29yZC5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlcy5hbHRpdHVkZSA9IHJlY29yZC5hbHRpdHVkZTtcbiAgICAgIHZhbHVlcy5zcGVlZCA9IHJlY29yZC5zcGVlZDtcbiAgICAgIHZhbHVlcy5jb3Vyc2UgPSByZWNvcmQuY291cnNlO1xuICAgICAgdmFsdWVzLnZlcnRpY2FsX2FjY3VyYWN5ID0gcmVjb3JkLnZlcnRpY2FsQWNjdXJhY3k7XG4gICAgICB2YWx1ZXMuaG9yaXpvbnRhbF9hY2N1cmFjeSA9IHJlY29yZC5ob3Jpem9udGFsQWNjdXJhY3k7XG4gICAgfSBlbHNlIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgdmFsdWVzLnJlc291cmNlX2lkID0gZmVhdHVyZS5pZDtcbiAgICAgIHZhbHVlcy5pbmRleCA9IGZlYXR1cmUuaW5kZXg7XG4gICAgICB2YWx1ZXMucGFyZW50X3Jlc291cmNlX2lkID0gcGFyZW50RmVhdHVyZS5pZDtcblxuICAgICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSBmZWF0dXJlLmxhdGl0dWRlO1xuICAgICAgICB2YWx1ZXMubG9uZ2l0dWRlID0gZmVhdHVyZS5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlY29yZCB2YWx1ZXNcbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfc3RhdHVzID0gcmVjb3JkLnN0YXR1cztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfcHJvamVjdF9pZCA9IHJlY29yZC5fcHJvamVjdFJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnByb2plY3RJRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQgPSByZWNvcmQucHJvamVjdElEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9hc3NpZ25lZFRvUm93SUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX2Fzc2lnbmVkX3RvX3Jlc291cmNlX2lkID0gcmVjb3JkLmFzc2lnbmVkVG9JRDtcbiAgICAgIH1cblxuICAgICAgLy8gbGlua2VkIGZpZWxkc1xuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X2lkID0gZmVhdHVyZS5jcmVhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLmNyZWF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS5jcmVhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUudXBkYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gZmVhdHVyZS51cGRhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUuY2hhbmdlc2V0KSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSBmZWF0dXJlLmNoYW5nZXNldC5yb3dJRDtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY2hhbmdlc2V0SUQ7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsdWVzLnRpdGxlID0gZmVhdHVyZS5kaXNwbGF5VmFsdWU7XG5cbiAgICB2YWx1ZXMuZm9ybV92YWx1ZXMgPSBKU09OLnN0cmluZ2lmeShmZWF0dXJlLmZvcm1WYWx1ZXMudG9KU09OKCkpO1xuXG4gICAgdGhpcy5zZXR1cFNlYXJjaCh2YWx1ZXMsIGZlYXR1cmUpO1xuXG4gICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmdlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS5sYXRpdHVkZSwgZmVhdHVyZS5sb25naXR1ZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMuZ2VvbWV0cnkgPSBudWxsO1xuICAgIH1cblxuICAgIHZhbHVlcy5jcmVhdGVkX2F0ID0gZmVhdHVyZS5jbGllbnRDcmVhdGVkQXQgfHwgZmVhdHVyZS5jcmVhdGVkQXQ7XG4gICAgdmFsdWVzLnVwZGF0ZWRfYXQgPSBmZWF0dXJlLmNsaWVudFVwZGF0ZWRBdCB8fCBmZWF0dXJlLnVwZGF0ZWRBdDtcbiAgICB2YWx1ZXMudmVyc2lvbiA9IGZlYXR1cmUudmVyc2lvbjtcblxuICAgIGlmICh2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZXMudXBkYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIHZhbHVlcy5zZXJ2ZXJfY3JlYXRlZF9hdCA9IGZlYXR1cmUuY3JlYXRlZEF0O1xuICAgIHZhbHVlcy5zZXJ2ZXJfdXBkYXRlZF9hdCA9IGZlYXR1cmUudXBkYXRlZEF0O1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmNyZWF0ZWREdXJhdGlvbjtcbiAgICB2YWx1ZXMudXBkYXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUudXBkYXRlZER1cmF0aW9uO1xuICAgIHZhbHVlcy5lZGl0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmVkaXRlZER1cmF0aW9uO1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfbGF0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9sb25naXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMb25naXR1ZGU7XG4gICAgdmFsdWVzLmNyZWF0ZWRfYWx0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRBbHRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5ID0gZmVhdHVyZS5jcmVhdGVkQWNjdXJhY3k7XG5cbiAgICBpZiAoZmVhdHVyZS5oYXNDcmVhdGVkQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmNyZWF0ZWRfZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZSwgZmVhdHVyZS5jcmVhdGVkTG9uZ2l0dWRlKTtcbiAgICB9XG5cbiAgICB2YWx1ZXMudXBkYXRlZF9sYXRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExhdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2xvbmdpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExvbmdpdHVkZTtcbiAgICB2YWx1ZXMudXBkYXRlZF9hbHRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZEFsdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kgPSBmZWF0dXJlLnVwZGF0ZWRBY2N1cmFjeTtcblxuICAgIGlmIChmZWF0dXJlLmhhc1VwZGF0ZWRDb29yZGluYXRlKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUudXBkYXRlZExhdGl0dWRlLCBmZWF0dXJlLnVwZGF0ZWRMb25naXR1ZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge3JlY29yZF9yZXNvdXJjZV9pZDogcmVjb3JkLmlkfSk7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSB7XG4gICAgcmV0dXJuIGRiLmRlbGV0ZVN0YXRlbWVudCh0YWJsZU5hbWUsIHt9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIGZvcm0pIHtcbiAgICBjb25zdCByZXBlYXRhYmxlcyA9IGZvcm0uZWxlbWVudHNPZlR5cGUoJ1JlcGVhdGFibGUnKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGxldCB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG51bGwpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcbiAgICB9XG5cbiAgICB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JGb3JtU3RhdGVtZW50cyhkYiwgZm9ybSkge1xuICAgIGNvbnN0IHJlcGVhdGFibGVzID0gZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgbnVsbCk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSk7XG4gICAgfVxuXG4gICAgdGFibGVOYW1lID0gdGhpcy5tdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzX3ZhbHVlcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gIH1cblxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSkge1xuICAgIGlmIChyZXBlYXRhYmxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmb3JtYXQoJ2FjY291bnRfJXNfZm9ybV8lcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzXyVzJywgZm9ybS5fYWNjb3VudFJvd0lELCBmb3JtLnJvd0lELCByZXBlYXRhYmxlLmtleSk7XG4gIH1cblxuICBzdGF0aWMgc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlKSB7XG4gICAgY29uc3Qgc2VhcmNoYWJsZVZhbHVlID0gZmVhdHVyZS5zZWFyY2hhYmxlVmFsdWU7XG5cbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4X3RleHQgPSBzZWFyY2hhYmxlVmFsdWU7XG4gICAgdmFsdWVzLnJlY29yZF9pbmRleCA9IHtyYXc6IGB0b190c3ZlY3RvcigkeyBwZ2Zvcm1hdCgnJUwnLCBzZWFyY2hhYmxlVmFsdWUpIH0pYH07XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHNldHVwUG9pbnQodmFsdWVzLCBsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgY29uc3Qgd2t0ID0gcGdmb3JtYXQoJ1BPSU5UKCVzICVzKScsIGxvbmdpdHVkZSwgbGF0aXR1ZGUpO1xuXG4gICAgcmV0dXJuIHtyYXc6IGBTVF9Gb3JjZTJEKFNUX1NldFNSSUQoU1RfR2VvbUZyb21UZXh0KCckeyB3a3QgfScpLCA0MzI2KSlgfTtcbiAgfVxufVxuIl19