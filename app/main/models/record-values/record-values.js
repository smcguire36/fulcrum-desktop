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

        values['f' + formValue.element.key.toLowerCase()] = columnValue;
      } else if (columnValue) {
        Object.assign(values, columnValue);

        const element = formValue.element;

        if (element && options.mediaURLFormatter) {
          if (element.isPhotoElement || element.isVideoElement || element.isAudioElement) {
            const prefix = 'f' + formValue.element.key.toLowerCase();

            values[prefix + '_urls'] = options.mediaURLFormatter(formValue);

            if (options.mediaViewURLFormatter) {
              values[prefix + '_view_url'] = options.mediaViewURLFormatter(formValue);
            }
          }
        }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMuanMiXSwibmFtZXMiOlsiUmVjb3JkVmFsdWVzIiwidXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImRiIiwicmVjb3JkIiwib3B0aW9ucyIsInN0YXRlbWVudHMiLCJwdXNoIiwiYXBwbHkiLCJkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiZm9ybSIsImluc2VydEZvclJlY29yZFN0YXRlbWVudHMiLCJpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50IiwiaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzIiwiaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImZlYXR1cmUiLCJwYXJlbnRGZWF0dXJlIiwidmFsdWVzIiwiY29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsInN5c3RlbVZhbHVlcyIsInN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YWJsZU5hbWUiLCJ0YWJsZU5hbWVXaXRoRm9ybSIsIl9lbGVtZW50IiwiaW5zZXJ0U3RhdGVtZW50IiwicGsiLCJmb3JtVmFsdWUiLCJmb3JtVmFsdWVzIiwiYWxsIiwiZWxlbWVudCIsImlzUmVwZWF0YWJsZUVsZW1lbnQiLCJyZXBlYXRhYmxlSXRlbSIsIl9pdGVtcyIsImlzRW1wdHkiLCJjb2x1bW5WYWx1ZSIsImlzTnVtYmVyIiwiaXNTdHJpbmciLCJpc0FycmF5IiwiaXNEYXRlIiwiZ2V0RnVsbFllYXIiLCJrZXkiLCJ0b0xvd2VyQ2FzZSIsIm1lZGlhVVJMRm9ybWF0dGVyIiwiaXNQaG90b0VsZW1lbnQiLCJpc1ZpZGVvRWxlbWVudCIsImlzQXVkaW9FbGVtZW50IiwicHJlZml4IiwibWVkaWFWaWV3VVJMRm9ybWF0dGVyIiwibXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlIiwibXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtIiwicGFyZW50UmVzb3VyY2VJZCIsImlkIiwibXVsdGlwbGVWYWx1ZUl0ZW0iLCJpbnNlcnRWYWx1ZXMiLCJ0ZXh0X3ZhbHVlIiwidmFsdWUiLCJyZWNvcmRfaWQiLCJyb3dJRCIsInJlY29yZF9yZXNvdXJjZV9pZCIsInBhcmVudF9yZXNvdXJjZV9pZCIsImZlYXR1cmVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInJlcG9ydFVSTEZvcm1hdHRlciIsInJlcG9ydF91cmwiLCJfcHJvamVjdFJvd0lEIiwicHJvamVjdF9pZCIsInByb2plY3RJRCIsInByb2plY3RfcmVzb3VyY2VfaWQiLCJfYXNzaWduZWRUb1Jvd0lEIiwiYXNzaWduZWRfdG9faWQiLCJhc3NpZ25lZFRvSUQiLCJhc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsIl9jcmVhdGVkQnlSb3dJRCIsImNyZWF0ZWRfYnlfaWQiLCJjcmVhdGVkQnlJRCIsImNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQiLCJfdXBkYXRlZEJ5Um93SUQiLCJ1cGRhdGVkX2J5X2lkIiwidXBkYXRlZEJ5SUQiLCJ1cGRhdGVkX2J5X3Jlc291cmNlX2lkIiwiX2NoYW5nZXNldFJvd0lEIiwiY2hhbmdlc2V0X2lkIiwiY2hhbmdlc2V0SUQiLCJjaGFuZ2VzZXRfcmVzb3VyY2VfaWQiLCJzdGF0dXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImFsdGl0dWRlIiwic3BlZWQiLCJjb3Vyc2UiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsInZlcnRpY2FsQWNjdXJhY3kiLCJob3Jpem9udGFsX2FjY3VyYWN5IiwiaG9yaXpvbnRhbEFjY3VyYWN5IiwicmVzb3VyY2VfaWQiLCJpbmRleCIsImhhc0Nvb3JkaW5hdGUiLCJyZWNvcmRfc3RhdHVzIiwicmVjb3JkX3Byb2plY3RfaWQiLCJyZWNvcmRfcHJvamVjdF9yZXNvdXJjZV9pZCIsInJlY29yZF9hc3NpZ25lZF90b19pZCIsInJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsImNyZWF0ZWRCeSIsInVwZGF0ZWRCeSIsImNoYW5nZXNldCIsInRpdGxlIiwiZGlzcGxheVZhbHVlIiwiZm9ybV92YWx1ZXMiLCJKU09OIiwic3RyaW5naWZ5IiwidG9KU09OIiwic2V0dXBTZWFyY2giLCJnZW9tZXRyeSIsInNldHVwUG9pbnQiLCJjcmVhdGVkX2F0IiwiY2xpZW50Q3JlYXRlZEF0IiwiY3JlYXRlZEF0IiwidXBkYXRlZF9hdCIsImNsaWVudFVwZGF0ZWRBdCIsInVwZGF0ZWRBdCIsInZlcnNpb24iLCJzZXJ2ZXJfY3JlYXRlZF9hdCIsInNlcnZlcl91cGRhdGVkX2F0IiwiY3JlYXRlZF9kdXJhdGlvbiIsImNyZWF0ZWREdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJ1cGRhdGVkRHVyYXRpb24iLCJlZGl0ZWRfZHVyYXRpb24iLCJlZGl0ZWREdXJhdGlvbiIsImNyZWF0ZWRfbGF0aXR1ZGUiLCJjcmVhdGVkTGF0aXR1ZGUiLCJjcmVhdGVkX2xvbmdpdHVkZSIsImNyZWF0ZWRMb25naXR1ZGUiLCJjcmVhdGVkX2FsdGl0dWRlIiwiY3JlYXRlZEFsdGl0dWRlIiwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5IiwiY3JlYXRlZEFjY3VyYWN5IiwiaGFzQ3JlYXRlZENvb3JkaW5hdGUiLCJjcmVhdGVkX2dlb21ldHJ5IiwidXBkYXRlZF9sYXRpdHVkZSIsInVwZGF0ZWRMYXRpdHVkZSIsInVwZGF0ZWRfbG9uZ2l0dWRlIiwidXBkYXRlZExvbmdpdHVkZSIsInVwZGF0ZWRfYWx0aXR1ZGUiLCJ1cGRhdGVkQWx0aXR1ZGUiLCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kiLCJ1cGRhdGVkQWNjdXJhY3kiLCJoYXNVcGRhdGVkQ29vcmRpbmF0ZSIsInVwZGF0ZWRfZ2VvbWV0cnkiLCJkZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50IiwiZGVsZXRlU3RhdGVtZW50IiwiZGVsZXRlUm93c1N0YXRlbWVudCIsInJlcGVhdGFibGVzIiwiZWxlbWVudHNPZlR5cGUiLCJyZXBlYXRhYmxlIiwiZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMiLCJfYWNjb3VudFJvd0lEIiwic2VhcmNoYWJsZVZhbHVlIiwicmVjb3JkX2luZGV4X3RleHQiLCJyZWNvcmRfaW5kZXgiLCJyYXciLCJ3a3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFlBQU4sQ0FBbUI7QUFDaEMsU0FBT0MseUJBQVAsQ0FBaUNDLEVBQWpDLEVBQXFDQyxNQUFyQyxFQUE2Q0MsVUFBVSxFQUF2RCxFQUEyRDtBQUN6RCxVQUFNQyxhQUFhLEVBQW5COztBQUVBQSxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0cseUJBQUwsQ0FBK0JOLEVBQS9CLEVBQW1DQyxNQUFuQyxFQUEyQ0EsT0FBT00sSUFBbEQsRUFBd0RMLE9BQXhELENBQWxDO0FBQ0FDLGVBQVdDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixFQUFrQyxLQUFLSyx5QkFBTCxDQUErQlIsRUFBL0IsRUFBbUNDLE1BQW5DLEVBQTJDQSxPQUFPTSxJQUFsRCxFQUF3REwsT0FBeEQsQ0FBbEM7O0FBRUEsV0FBT0MsVUFBUDtBQUNEOztBQUVELFNBQU9LLHlCQUFQLENBQWlDUixFQUFqQyxFQUFxQ0MsTUFBckMsRUFBNkNNLElBQTdDLEVBQW1ETCxVQUFVLEVBQTdELEVBQWlFO0FBQy9ELFVBQU1DLGFBQWEsRUFBbkI7O0FBRUFBLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS0ssNEJBQUwsQ0FBa0NULEVBQWxDLEVBQXNDTyxJQUF0QyxFQUE0Q04sTUFBNUMsRUFBb0QsSUFBcEQsRUFBMERBLE1BQTFELEVBQWtFQyxPQUFsRSxDQUFoQjtBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS08sdUNBQUwsQ0FBNkNWLEVBQTdDLEVBQWlETyxJQUFqRCxFQUF1RE4sTUFBdkQsRUFB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LGtCQUFPLDJCQUFQLEVBQW9DQSxLQUFLcUosYUFBekMsRUFBd0RySixLQUFLa0QsS0FBN0QsQ0FBUDtBQUNEOztBQUVELFNBQU9uQyxpQkFBUCxDQUF5QmYsSUFBekIsRUFBK0JtSixVQUEvQixFQUEyQztBQUN6QyxRQUFJQSxjQUFjLElBQWxCLEVBQXdCO0FBQ3RCLGFBQU8sa0JBQU8sb0JBQVAsRUFBNkJuSixLQUFLcUosYUFBbEMsRUFBaURySixLQUFLa0QsS0FBdEQsQ0FBUDtBQUNEOztBQUVELFdBQU8sa0JBQU8sdUJBQVAsRUFBZ0NsRCxLQUFLcUosYUFBckMsRUFBb0RySixLQUFLa0QsS0FBekQsRUFBZ0VpRyxXQUFXbEgsR0FBM0UsQ0FBUDtBQUNEOztBQUVELFNBQU91RSxXQUFQLENBQW1CaEcsTUFBbkIsRUFBMkJGLE9BQTNCLEVBQW9DO0FBQ2xDLFVBQU1nSixrQkFBa0JoSixRQUFRZ0osZUFBaEM7O0FBRUE5SSxXQUFPK0ksaUJBQVAsR0FBMkJELGVBQTNCO0FBQ0E5SSxXQUFPZ0osWUFBUCxHQUFzQixFQUFDQyxLQUFNLGVBQWUsd0JBQVMsSUFBVCxFQUFlSCxlQUFmLENBQWlDLEdBQXZELEVBQXRCOztBQUVBLFdBQU85SSxNQUFQO0FBQ0Q7O0FBRUQsU0FBT2tHLFVBQVAsQ0FBa0JsRyxNQUFsQixFQUEwQnNFLFFBQTFCLEVBQW9DQyxTQUFwQyxFQUErQztBQUM3QyxVQUFNMkUsTUFBTSx3QkFBUyxjQUFULEVBQXlCM0UsU0FBekIsRUFBb0NELFFBQXBDLENBQVo7O0FBRUEsV0FBTyxFQUFDMkUsS0FBTSwwQ0FBMENDLEdBQUssWUFBdEQsRUFBUDtBQUNEO0FBcForQjtrQkFBYm5LLFkiLCJmaWxlIjoicmVjb3JkLXZhbHVlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IFJlY29yZCwgUmVwZWF0YWJsZUl0ZW1WYWx1ZSB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgcGdmb3JtYXQgZnJvbSAncGctZm9ybWF0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjb3JkVmFsdWVzIHtcbiAgc3RhdGljIHVwZGF0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuZGVsZXRlRm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCByZWNvcmQuZm9ybSwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydEZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgcmVjb3JkLmZvcm0sIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydEZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgZm9ybSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuaW5zZXJ0Um93Rm9yRmVhdHVyZVN0YXRlbWVudChkYiwgZm9ybSwgcmVjb3JkLCBudWxsLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50KGRiLCBmb3JtLCBmZWF0dXJlLCBwYXJlbnRGZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuY29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBvcHRpb25zKTtcbiAgICBjb25zdCBzeXN0ZW1WYWx1ZXMgPSB0aGlzLnN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zKTtcblxuICAgIE9iamVjdC5hc3NpZ24odmFsdWVzLCBzeXN0ZW1WYWx1ZXMpO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IG51bGw7XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlcGVhdGFibGVJdGVtVmFsdWUpIHtcbiAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgYWNjZXNzaW5nIF9lbGVtZW50LCBsaWtlIGBnZXQgcmVwZWF0YWJsZUVsZW1lbnQoKWBcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgZmVhdHVyZS5fZWxlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRiLmluc2VydFN0YXRlbWVudCh0YWJsZU5hbWUsIHZhbHVlcywge3BrOiAnaWQnfSk7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuZWxlbWVudC5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgX2l0ZW1zXG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XG4gICAgICBpZiAoZm9ybVZhbHVlLmlzRW1wdHkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb2x1bW5WYWx1ZSA9IGZvcm1WYWx1ZS5jb2x1bW5WYWx1ZTtcblxuICAgICAgaWYgKF8uaXNOdW1iZXIoY29sdW1uVmFsdWUpIHx8IF8uaXNTdHJpbmcoY29sdW1uVmFsdWUpIHx8IF8uaXNBcnJheShjb2x1bW5WYWx1ZSkgfHwgXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgIC8vIGRvbid0IGFsbG93IGRhdGVzIGdyZWF0ZXIgdGhhbiA5OTk5LCB5ZXMgLSB0aGV5IGV4aXN0IGluIHRoZSB3aWxkXG4gICAgICAgIGlmIChfLmlzRGF0ZShjb2x1bW5WYWx1ZSkgJiYgY29sdW1uVmFsdWUuZ2V0RnVsbFllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YWx1ZXNbJ2YnICsgZm9ybVZhbHVlLmVsZW1lbnQua2V5LnRvTG93ZXJDYXNlKCldID0gY29sdW1uVmFsdWU7XG4gICAgICB9IGVsc2UgaWYgKGNvbHVtblZhbHVlKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odmFsdWVzLCBjb2x1bW5WYWx1ZSk7XG5cbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGZvcm1WYWx1ZS5lbGVtZW50O1xuXG4gICAgICAgIGlmIChlbGVtZW50ICYmIG9wdGlvbnMubWVkaWFVUkxGb3JtYXR0ZXIpIHtcbiAgICAgICAgICBpZiAoZWxlbWVudC5pc1Bob3RvRWxlbWVudCB8fCBlbGVtZW50LmlzVmlkZW9FbGVtZW50IHx8IGVsZW1lbnQuaXNBdWRpb0VsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9ICdmJyArIGZvcm1WYWx1ZS5lbGVtZW50LmtleS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgICB2YWx1ZXNbcHJlZml4ICsgJ191cmxzJ10gPSBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKGZvcm1WYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICB2YWx1ZXNbcHJlZml4ICsgJ192aWV3X3VybCddID0gb3B0aW9ucy5tZWRpYVZpZXdVUkxGb3JtYXR0ZXIoZm9ybVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5tdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKTtcblxuICAgIGNvbnN0IHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0pO1xuXG4gICAgbGV0IHBhcmVudFJlc291cmNlSWQgPSBudWxsO1xuXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XG4gICAgICBwYXJlbnRSZXNvdXJjZUlkID0gZmVhdHVyZS5pZDtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG11bHRpcGxlVmFsdWVJdGVtIG9mIHZhbHVlcykge1xuICAgICAgY29uc3QgaW5zZXJ0VmFsdWVzID0gT2JqZWN0LmFzc2lnbih7fSwge2tleTogbXVsdGlwbGVWYWx1ZUl0ZW0uZWxlbWVudC5rZXksIHRleHRfdmFsdWU6IG11bHRpcGxlVmFsdWVJdGVtLnZhbHVlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY29yZF9pZDogcmVjb3JkLnJvd0lELCByZWNvcmRfcmVzb3VyY2VfaWQ6IHJlY29yZC5pZCwgcGFyZW50X3Jlc291cmNlX2lkOiBwYXJlbnRSZXNvdXJjZUlkfSk7XG5cbiAgICAgIHN0YXRlbWVudHMucHVzaChkYi5pbnNlcnRTdGF0ZW1lbnQodGFibGVOYW1lLCBpbnNlcnRWYWx1ZXMsIHtwazogJ2lkJ30pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCByZWNvcmQpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNFbXB0eSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZVZhbHVlcyA9IGZvcm1WYWx1ZS5tdWx0aXBsZVZhbHVlcztcblxuICAgICAgaWYgKGZlYXR1cmVWYWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCBmZWF0dXJlVmFsdWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcblxuICAgIHZhbHVlcy5yZWNvcmRfaWQgPSByZWNvcmQucm93SUQ7XG4gICAgdmFsdWVzLnJlY29yZF9yZXNvdXJjZV9pZCA9IHJlY29yZC5pZDtcblxuICAgIGlmIChvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcikge1xuICAgICAgdmFsdWVzLnJlcG9ydF91cmwgPSBvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcihmZWF0dXJlKTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlY29yZCkge1xuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X2lkID0gcmVjb3JkLl9wcm9qZWN0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQucHJvamVjdElEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X3Jlc291cmNlX2lkID0gcmVjb3JkLnByb2plY3RJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMuYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQgPSByZWNvcmQuYXNzaWduZWRUb0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9jcmVhdGVkQnlSb3dJRCkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IHJlY29yZC5fY3JlYXRlZEJ5Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY3JlYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQgPSByZWNvcmQuY3JlYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX3VwZGF0ZWRCeVJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gcmVjb3JkLl91cGRhdGVkQnlSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC51cGRhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY2hhbmdlc2V0SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IHJlY29yZC5jaGFuZ2VzZXRJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5zdGF0dXMpIHtcbiAgICAgICAgdmFsdWVzLnN0YXR1cyA9IHJlY29yZC5zdGF0dXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubGF0aXR1ZGUgIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSByZWNvcmQubGF0aXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubG9uZ2l0dWRlICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWVzLmxvbmdpdHVkZSA9IHJlY29yZC5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlcy5hbHRpdHVkZSA9IHJlY29yZC5hbHRpdHVkZTtcbiAgICAgIHZhbHVlcy5zcGVlZCA9IHJlY29yZC5zcGVlZDtcbiAgICAgIHZhbHVlcy5jb3Vyc2UgPSByZWNvcmQuY291cnNlO1xuICAgICAgdmFsdWVzLnZlcnRpY2FsX2FjY3VyYWN5ID0gcmVjb3JkLnZlcnRpY2FsQWNjdXJhY3k7XG4gICAgICB2YWx1ZXMuaG9yaXpvbnRhbF9hY2N1cmFjeSA9IHJlY29yZC5ob3Jpem9udGFsQWNjdXJhY3k7XG4gICAgfSBlbHNlIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgdmFsdWVzLnJlc291cmNlX2lkID0gZmVhdHVyZS5pZDtcbiAgICAgIHZhbHVlcy5pbmRleCA9IGZlYXR1cmUuaW5kZXg7XG4gICAgICB2YWx1ZXMucGFyZW50X3Jlc291cmNlX2lkID0gcGFyZW50RmVhdHVyZS5pZDtcblxuICAgICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSBmZWF0dXJlLmxhdGl0dWRlO1xuICAgICAgICB2YWx1ZXMubG9uZ2l0dWRlID0gZmVhdHVyZS5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlY29yZCB2YWx1ZXNcbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfc3RhdHVzID0gcmVjb3JkLnN0YXR1cztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfcHJvamVjdF9pZCA9IHJlY29yZC5fcHJvamVjdFJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnByb2plY3RJRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQgPSByZWNvcmQucHJvamVjdElEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9hc3NpZ25lZFRvUm93SUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX2Fzc2lnbmVkX3RvX3Jlc291cmNlX2lkID0gcmVjb3JkLmFzc2lnbmVkVG9JRDtcbiAgICAgIH1cblxuICAgICAgLy8gbGlua2VkIGZpZWxkc1xuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X2lkID0gZmVhdHVyZS5jcmVhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLmNyZWF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS5jcmVhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUudXBkYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gZmVhdHVyZS51cGRhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUuY2hhbmdlc2V0KSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSBmZWF0dXJlLmNoYW5nZXNldC5yb3dJRDtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY2hhbmdlc2V0SUQ7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsdWVzLnRpdGxlID0gZmVhdHVyZS5kaXNwbGF5VmFsdWU7XG5cbiAgICB2YWx1ZXMuZm9ybV92YWx1ZXMgPSBKU09OLnN0cmluZ2lmeShmZWF0dXJlLmZvcm1WYWx1ZXMudG9KU09OKCkpO1xuXG4gICAgdGhpcy5zZXR1cFNlYXJjaCh2YWx1ZXMsIGZlYXR1cmUpO1xuXG4gICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmdlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS5sYXRpdHVkZSwgZmVhdHVyZS5sb25naXR1ZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMuZ2VvbWV0cnkgPSBudWxsO1xuICAgIH1cblxuICAgIHZhbHVlcy5jcmVhdGVkX2F0ID0gZmVhdHVyZS5jbGllbnRDcmVhdGVkQXQgfHwgZmVhdHVyZS5jcmVhdGVkQXQ7XG4gICAgdmFsdWVzLnVwZGF0ZWRfYXQgPSBmZWF0dXJlLmNsaWVudFVwZGF0ZWRBdCB8fCBmZWF0dXJlLnVwZGF0ZWRBdDtcbiAgICB2YWx1ZXMudmVyc2lvbiA9IGZlYXR1cmUudmVyc2lvbjtcblxuICAgIGlmICh2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZXMudXBkYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIHZhbHVlcy5zZXJ2ZXJfY3JlYXRlZF9hdCA9IGZlYXR1cmUuY3JlYXRlZEF0O1xuICAgIHZhbHVlcy5zZXJ2ZXJfdXBkYXRlZF9hdCA9IGZlYXR1cmUudXBkYXRlZEF0O1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmNyZWF0ZWREdXJhdGlvbjtcbiAgICB2YWx1ZXMudXBkYXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUudXBkYXRlZER1cmF0aW9uO1xuICAgIHZhbHVlcy5lZGl0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmVkaXRlZER1cmF0aW9uO1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfbGF0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9sb25naXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMb25naXR1ZGU7XG4gICAgdmFsdWVzLmNyZWF0ZWRfYWx0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRBbHRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5ID0gZmVhdHVyZS5jcmVhdGVkQWNjdXJhY3k7XG5cbiAgICBpZiAoZmVhdHVyZS5oYXNDcmVhdGVkQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmNyZWF0ZWRfZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZSwgZmVhdHVyZS5jcmVhdGVkTG9uZ2l0dWRlKTtcbiAgICB9XG5cbiAgICB2YWx1ZXMudXBkYXRlZF9sYXRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExhdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2xvbmdpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExvbmdpdHVkZTtcbiAgICB2YWx1ZXMudXBkYXRlZF9hbHRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZEFsdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kgPSBmZWF0dXJlLnVwZGF0ZWRBY2N1cmFjeTtcblxuICAgIGlmIChmZWF0dXJlLmhhc1VwZGF0ZWRDb29yZGluYXRlKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUudXBkYXRlZExhdGl0dWRlLCBmZWF0dXJlLnVwZGF0ZWRMb25naXR1ZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge3JlY29yZF9yZXNvdXJjZV9pZDogcmVjb3JkLmlkfSk7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSB7XG4gICAgcmV0dXJuIGRiLmRlbGV0ZVN0YXRlbWVudCh0YWJsZU5hbWUsIHt9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIGZvcm0pIHtcbiAgICBjb25zdCByZXBlYXRhYmxlcyA9IGZvcm0uZWxlbWVudHNPZlR5cGUoJ1JlcGVhdGFibGUnKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGxldCB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG51bGwpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcbiAgICB9XG5cbiAgICB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JGb3JtU3RhdGVtZW50cyhkYiwgZm9ybSkge1xuICAgIGNvbnN0IHJlcGVhdGFibGVzID0gZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgbnVsbCk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSk7XG4gICAgfVxuXG4gICAgdGFibGVOYW1lID0gdGhpcy5tdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzX3ZhbHVlcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gIH1cblxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSkge1xuICAgIGlmIChyZXBlYXRhYmxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmb3JtYXQoJ2FjY291bnRfJXNfZm9ybV8lcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzXyVzJywgZm9ybS5fYWNjb3VudFJvd0lELCBmb3JtLnJvd0lELCByZXBlYXRhYmxlLmtleSk7XG4gIH1cblxuICBzdGF0aWMgc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlKSB7XG4gICAgY29uc3Qgc2VhcmNoYWJsZVZhbHVlID0gZmVhdHVyZS5zZWFyY2hhYmxlVmFsdWU7XG5cbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4X3RleHQgPSBzZWFyY2hhYmxlVmFsdWU7XG4gICAgdmFsdWVzLnJlY29yZF9pbmRleCA9IHtyYXc6IGB0b190c3ZlY3RvcigkeyBwZ2Zvcm1hdCgnJUwnLCBzZWFyY2hhYmxlVmFsdWUpIH0pYH07XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHNldHVwUG9pbnQodmFsdWVzLCBsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgY29uc3Qgd2t0ID0gcGdmb3JtYXQoJ1BPSU5UKCVzICVzKScsIGxvbmdpdHVkZSwgbGF0aXR1ZGUpO1xuXG4gICAgcmV0dXJuIHtyYXc6IGBTVF9Gb3JjZTJEKFNUX1NldFNSSUQoU1RfR2VvbUZyb21UZXh0KCckeyB3a3QgfScpLCA0MzI2KSlgfTtcbiAgfVxufVxuIl19