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

    if (options.valuesTransformer) {
      options.valuesTransformer({ db, form, feature, parentFeature, record, values });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMuanMiXSwibmFtZXMiOlsiUmVjb3JkVmFsdWVzIiwidXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImRiIiwicmVjb3JkIiwib3B0aW9ucyIsInN0YXRlbWVudHMiLCJwdXNoIiwiYXBwbHkiLCJkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiZm9ybSIsImluc2VydEZvclJlY29yZFN0YXRlbWVudHMiLCJpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50IiwiaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzIiwiaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImZlYXR1cmUiLCJwYXJlbnRGZWF0dXJlIiwidmFsdWVzIiwiY29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsInN5c3RlbVZhbHVlcyIsInN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YWJsZU5hbWUiLCJ0YWJsZU5hbWVXaXRoRm9ybSIsIl9lbGVtZW50IiwidmFsdWVzVHJhbnNmb3JtZXIiLCJpbnNlcnRTdGF0ZW1lbnQiLCJwayIsImZvcm1WYWx1ZSIsImZvcm1WYWx1ZXMiLCJhbGwiLCJlbGVtZW50IiwiaXNSZXBlYXRhYmxlRWxlbWVudCIsInJlcGVhdGFibGVJdGVtIiwiX2l0ZW1zIiwibWF5YmVBc3NpZ25BcnJheSIsImtleSIsInZhbHVlIiwiZGlzYWJsZUFycmF5cyIsImlzQXJyYXkiLCJqb2luIiwiaXNFbXB0eSIsImNvbHVtblZhbHVlIiwiaXNOdW1iZXIiLCJpc1N0cmluZyIsImlzRGF0ZSIsImdldEZ1bGxZZWFyIiwidG9Mb3dlckNhc2UiLCJtZWRpYVVSTEZvcm1hdHRlciIsImlzUGhvdG9FbGVtZW50IiwiaXNWaWRlb0VsZW1lbnQiLCJpc0F1ZGlvRWxlbWVudCIsInByZWZpeCIsIm1lZGlhVmlld1VSTEZvcm1hdHRlciIsImtleXMiLCJtdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUiLCJtdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0iLCJwYXJlbnRSZXNvdXJjZUlkIiwiaWQiLCJtdWx0aXBsZVZhbHVlSXRlbSIsImluc2VydFZhbHVlcyIsInRleHRfdmFsdWUiLCJyZWNvcmRfaWQiLCJyb3dJRCIsInJlY29yZF9yZXNvdXJjZV9pZCIsInBhcmVudF9yZXNvdXJjZV9pZCIsImZlYXR1cmVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInJlcG9ydFVSTEZvcm1hdHRlciIsInJlcG9ydF91cmwiLCJfcHJvamVjdFJvd0lEIiwicHJvamVjdF9pZCIsInByb2plY3RJRCIsInByb2plY3RfcmVzb3VyY2VfaWQiLCJfYXNzaWduZWRUb1Jvd0lEIiwiYXNzaWduZWRfdG9faWQiLCJhc3NpZ25lZFRvSUQiLCJhc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsIl9jcmVhdGVkQnlSb3dJRCIsImNyZWF0ZWRfYnlfaWQiLCJjcmVhdGVkQnlJRCIsImNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQiLCJfdXBkYXRlZEJ5Um93SUQiLCJ1cGRhdGVkX2J5X2lkIiwidXBkYXRlZEJ5SUQiLCJ1cGRhdGVkX2J5X3Jlc291cmNlX2lkIiwiX2NoYW5nZXNldFJvd0lEIiwiY2hhbmdlc2V0X2lkIiwiY2hhbmdlc2V0SUQiLCJjaGFuZ2VzZXRfcmVzb3VyY2VfaWQiLCJzdGF0dXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImFsdGl0dWRlIiwic3BlZWQiLCJjb3Vyc2UiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsInZlcnRpY2FsQWNjdXJhY3kiLCJob3Jpem9udGFsX2FjY3VyYWN5IiwiaG9yaXpvbnRhbEFjY3VyYWN5IiwicmVzb3VyY2VfaWQiLCJpbmRleCIsImhhc0Nvb3JkaW5hdGUiLCJyZWNvcmRfc3RhdHVzIiwicmVjb3JkX3Byb2plY3RfaWQiLCJyZWNvcmRfcHJvamVjdF9yZXNvdXJjZV9pZCIsInJlY29yZF9hc3NpZ25lZF90b19pZCIsInJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsImNyZWF0ZWRCeSIsInVwZGF0ZWRCeSIsImNoYW5nZXNldCIsInRpdGxlIiwiZGlzcGxheVZhbHVlIiwiZm9ybV92YWx1ZXMiLCJKU09OIiwic3RyaW5naWZ5IiwidG9KU09OIiwic2V0dXBTZWFyY2giLCJnZW9tZXRyeSIsInNldHVwUG9pbnQiLCJjcmVhdGVkX2F0IiwiY2xpZW50Q3JlYXRlZEF0IiwiY3JlYXRlZEF0IiwidXBkYXRlZF9hdCIsImNsaWVudFVwZGF0ZWRBdCIsInVwZGF0ZWRBdCIsInZlcnNpb24iLCJzZXJ2ZXJfY3JlYXRlZF9hdCIsInNlcnZlcl91cGRhdGVkX2F0IiwiY3JlYXRlZF9kdXJhdGlvbiIsImNyZWF0ZWREdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJ1cGRhdGVkRHVyYXRpb24iLCJlZGl0ZWRfZHVyYXRpb24iLCJlZGl0ZWREdXJhdGlvbiIsImNyZWF0ZWRfbGF0aXR1ZGUiLCJjcmVhdGVkTGF0aXR1ZGUiLCJjcmVhdGVkX2xvbmdpdHVkZSIsImNyZWF0ZWRMb25naXR1ZGUiLCJjcmVhdGVkX2FsdGl0dWRlIiwiY3JlYXRlZEFsdGl0dWRlIiwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5IiwiY3JlYXRlZEFjY3VyYWN5IiwiaGFzQ3JlYXRlZENvb3JkaW5hdGUiLCJjcmVhdGVkX2dlb21ldHJ5IiwidXBkYXRlZF9sYXRpdHVkZSIsInVwZGF0ZWRMYXRpdHVkZSIsInVwZGF0ZWRfbG9uZ2l0dWRlIiwidXBkYXRlZExvbmdpdHVkZSIsInVwZGF0ZWRfYWx0aXR1ZGUiLCJ1cGRhdGVkQWx0aXR1ZGUiLCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kiLCJ1cGRhdGVkQWNjdXJhY3kiLCJoYXNVcGRhdGVkQ29vcmRpbmF0ZSIsInVwZGF0ZWRfZ2VvbWV0cnkiLCJkZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50IiwiZGVsZXRlU3RhdGVtZW50IiwiZGVsZXRlUm93c1N0YXRlbWVudCIsInJlcGVhdGFibGVzIiwiZWxlbWVudHNPZlR5cGUiLCJyZXBlYXRhYmxlIiwiZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMiLCJfYWNjb3VudFJvd0lEIiwic2VhcmNoYWJsZVZhbHVlIiwicmVjb3JkX2luZGV4X3RleHQiLCJyZWNvcmRfaW5kZXgiLCJyYXciLCJ3a3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFlBQU4sQ0FBbUI7QUFDaEMsU0FBT0MseUJBQVAsQ0FBaUNDLEVBQWpDLEVBQXFDQyxNQUFyQyxFQUE2Q0MsVUFBVSxFQUF2RCxFQUEyRDtBQUN6RCxVQUFNQyxhQUFhLEVBQW5COztBQUVBQSxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0cseUJBQUwsQ0FBK0JOLEVBQS9CLEVBQW1DQyxNQUFuQyxFQUEyQ0EsT0FBT00sSUFBbEQsRUFBd0RMLE9BQXhELENBQWxDO0FBQ0FDLGVBQVdDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixFQUFrQyxLQUFLSyx5QkFBTCxDQUErQlIsRUFBL0IsRUFBbUNDLE1BQW5DLEVBQTJDQSxPQUFPTSxJQUFsRCxFQUF3REwsT0FBeEQsQ0FBbEM7O0FBRUEsV0FBT0MsVUFBUDtBQUNEOztBQUVELFNBQU9LLHlCQUFQLENBQWlDUixFQUFqQyxFQUFxQ0MsTUFBckMsRUFBNkNNLElBQTdDLEVBQW1ETCxVQUFVLEVBQTdELEVBQWlFO0FBQy9ELFVBQU1DLGFBQWEsRUFBbkI7O0FBRUFBLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS0ssNEJBQUwsQ0FBa0NULEVBQWxDLEVBQXNDTyxJQUF0QyxFQUE0Q04sTUFBNUMsRUFBb0QsSUFBcEQsRUFBMERBLE1BQTFELEVBQWtFQyxPQUFsRSxDQUFoQjtBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS08sdUNBQUwsQ0FBNkNWLEVBQTdDLEVBQWlETyxJQUFqRCxFQUF1RE4sTUFBdkQsRUFBK0RBLE1BQS9ELEVBQXVFQyxPQUF2RSxDQUFsQztBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS1Esd0NBQUwsQ0FBOENYLEVBQTlDLEVBQWtETyxJQUFsRCxFQUF3RE4sTUFBeEQsRUFBZ0VBLE1BQWhFLEVBQXdFQyxPQUF4RSxDQUFsQztBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS1MsNkNBQUwsQ0FBbURaLEVBQW5ELEVBQXVETyxJQUF2RCxFQUE2RE4sTUFBN0QsRUFBcUVBLE1BQXJFLEVBQTZFQyxPQUE3RSxDQUFsQzs7QUFFQSxXQUFPQyxVQUFQO0FBQ0Q7O0FBRUQsU0FBT00sNEJBQVAsQ0FBb0NULEVBQXBDLEVBQXdDTyxJQUF4QyxFQUE4Q00sT0FBOUMsRUFBdURDLGFBQXZELEVBQXNFYixNQUF0RSxFQUE4RUMsVUFBVSxFQUF4RixFQUE0RjtBQUMxRixVQUFNYSxTQUFTLEtBQUtDLHNCQUFMLENBQTRCSCxPQUE1QixFQUFxQ1gsT0FBckMsQ0FBZjtBQUNBLFVBQU1lLGVBQWUsS0FBS0MsNEJBQUwsQ0FBa0NMLE9BQWxDLEVBQTJDQyxhQUEzQyxFQUEwRGIsTUFBMUQsRUFBa0VDLE9BQWxFLENBQXJCOztBQUVBaUIsV0FBT0MsTUFBUCxDQUFjTCxNQUFkLEVBQXNCRSxZQUF0Qjs7QUFFQSxRQUFJSSxZQUFZLElBQWhCOztBQUVBLFFBQUlSLG1EQUFKLEVBQTRDO0FBQzFDO0FBQ0FRLGtCQUFZLEtBQUtDLGlCQUFMLENBQXVCZixJQUF2QixFQUE2Qk0sUUFBUVUsUUFBckMsQ0FBWjtBQUNELEtBSEQsTUFHTztBQUNMRixrQkFBWSxLQUFLQyxpQkFBTCxDQUF1QmYsSUFBdkIsRUFBNkIsSUFBN0IsQ0FBWjtBQUNEOztBQUVELFFBQUlMLFFBQVFzQixpQkFBWixFQUErQjtBQUM3QnRCLGNBQVFzQixpQkFBUixDQUEwQixFQUFDeEIsRUFBRCxFQUFLTyxJQUFMLEVBQVdNLE9BQVgsRUFBb0JDLGFBQXBCLEVBQW1DYixNQUFuQyxFQUEyQ2MsTUFBM0MsRUFBMUI7QUFDRDs7QUFFRCxXQUFPZixHQUFHeUIsZUFBSCxDQUFtQkosU0FBbkIsRUFBOEJOLE1BQTlCLEVBQXNDLEVBQUNXLElBQUksSUFBTCxFQUF0QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBT2hCLHVDQUFQLENBQStDVixFQUEvQyxFQUFtRE8sSUFBbkQsRUFBeURNLE9BQXpELEVBQWtFWixNQUFsRSxFQUEwRUMsVUFBVSxFQUFwRixFQUF3RjtBQUN0RixVQUFNQyxhQUFhLEVBQW5COztBQUVBLFNBQUssTUFBTXdCLFNBQVgsSUFBd0JkLFFBQVFlLFVBQVIsQ0FBbUJDLEdBQTNDLEVBQWdEO0FBQzlDLFVBQUlGLFVBQVVHLE9BQVYsQ0FBa0JDLG1CQUF0QixFQUEyQztBQUN6QztBQUNBLGFBQUssTUFBTUMsY0FBWCxJQUE2QkwsVUFBVU0sTUFBdkMsRUFBK0M7QUFDN0M5QixxQkFBV0MsSUFBWCxDQUFnQixLQUFLSyw0QkFBTCxDQUFrQ1QsRUFBbEMsRUFBc0NPLElBQXRDLEVBQTRDeUIsY0FBNUMsRUFBNERuQixPQUE1RCxFQUFxRVosTUFBckUsRUFBNkVDLE9BQTdFLENBQWhCO0FBQ0FDLHFCQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS08sdUNBQUwsQ0FBNkNWLEVBQTdDLEVBQWlETyxJQUFqRCxFQUF1RHlCLGNBQXZELEVBQXVFL0IsTUFBdkUsRUFBK0VDLE9BQS9FLENBQWxDO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFdBQU9DLFVBQVA7QUFDRDs7QUFFRCxTQUFPK0IsZ0JBQVAsQ0FBd0JuQixNQUF4QixFQUFnQ29CLEdBQWhDLEVBQXFDQyxLQUFyQyxFQUE0Q0MsYUFBNUMsRUFBMkQ7QUFDekQsUUFBSUQsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCO0FBQ0Q7O0FBRURyQixXQUFPb0IsR0FBUCxJQUFlLGlCQUFFRyxPQUFGLENBQVVGLEtBQVYsS0FBb0JDLGFBQXJCLEdBQXNDRCxNQUFNRyxJQUFOLENBQVcsR0FBWCxDQUF0QyxHQUNzQ0gsS0FEcEQ7QUFFRDs7QUFFRCxTQUFPcEIsc0JBQVAsQ0FBOEJILE9BQTlCLEVBQXVDWCxVQUFVLEVBQWpELEVBQXFEO0FBQ25ELFVBQU1hLFNBQVMsRUFBZjs7QUFFQSxTQUFLLE1BQU1ZLFNBQVgsSUFBd0JkLFFBQVFlLFVBQVIsQ0FBbUJDLEdBQTNDLEVBQWdEO0FBQzlDLFVBQUlGLFVBQVVhLE9BQWQsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxVQUFJQyxjQUFjZCxVQUFVYyxXQUE1Qjs7QUFFQSxVQUFJLGlCQUFFQyxRQUFGLENBQVdELFdBQVgsS0FBMkIsaUJBQUVFLFFBQUYsQ0FBV0YsV0FBWCxDQUEzQixJQUFzRCxpQkFBRUgsT0FBRixDQUFVRyxXQUFWLENBQXRELElBQWdGLGlCQUFFRyxNQUFGLENBQVNILFdBQVQsQ0FBcEYsRUFBMkc7QUFDekc7QUFDQSxZQUFJLGlCQUFFRyxNQUFGLENBQVNILFdBQVQsS0FBeUJBLFlBQVlJLFdBQVosS0FBNEIsSUFBekQsRUFBK0Q7QUFDN0RKLHdCQUFjLElBQWQ7QUFDRDs7QUFFRCxhQUFLUCxnQkFBTCxDQUFzQm5CLE1BQXRCLEVBQThCLE1BQU1ZLFVBQVVHLE9BQVYsQ0FBa0JLLEdBQWxCLENBQXNCVyxXQUF0QixFQUFwQyxFQUF5RUwsV0FBekUsRUFBc0Z2QyxRQUFRbUMsYUFBOUY7QUFDRCxPQVBELE1BT08sSUFBSUksV0FBSixFQUFpQjtBQUN0QixjQUFNWCxVQUFVSCxVQUFVRyxPQUExQjs7QUFFQSxZQUFJQSxXQUFXNUIsUUFBUTZDLGlCQUF2QixFQUEwQztBQUN4QyxjQUFJakIsUUFBUWtCLGNBQVIsSUFBMEJsQixRQUFRbUIsY0FBbEMsSUFBb0RuQixRQUFRb0IsY0FBaEUsRUFBZ0Y7QUFDOUUsa0JBQU1DLFNBQVMsTUFBTXhCLFVBQVVHLE9BQVYsQ0FBa0JLLEdBQWxCLENBQXNCVyxXQUF0QixFQUFyQjs7QUFFQUwsd0JBQVlVLFNBQVMsT0FBckIsSUFBZ0NqRCxRQUFRNkMsaUJBQVIsQ0FBMEJwQixTQUExQixDQUFoQzs7QUFFQSxnQkFBSXpCLFFBQVFrRCxxQkFBWixFQUFtQztBQUNqQ1gsMEJBQVlVLFNBQVMsV0FBckIsSUFBb0NqRCxRQUFRa0QscUJBQVIsQ0FBOEJ6QixTQUE5QixDQUFwQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRDtBQUNBLFlBQUl6QixRQUFRbUMsYUFBWixFQUEyQjtBQUN6QixlQUFLLE1BQU1GLEdBQVgsSUFBa0JoQixPQUFPa0MsSUFBUCxDQUFZWixXQUFaLENBQWxCLEVBQTRDO0FBQzFDLGlCQUFLUCxnQkFBTCxDQUFzQk8sV0FBdEIsRUFBbUNOLEdBQW5DLEVBQXdDTSxZQUFZTixHQUFaLENBQXhDLEVBQTBEakMsUUFBUW1DLGFBQWxFO0FBQ0Q7QUFDRjs7QUFFRGxCLGVBQU9DLE1BQVAsQ0FBY0wsTUFBZCxFQUFzQjBCLFdBQXRCO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPMUIsTUFBUDtBQUNEOztBQUVELFNBQU9KLHdDQUFQLENBQWdEWCxFQUFoRCxFQUFvRE8sSUFBcEQsRUFBMERNLE9BQTFELEVBQW1FWixNQUFuRSxFQUEyRUMsVUFBVSxFQUFyRixFQUF5RjtBQUN2RixVQUFNQyxhQUFhLEVBQW5COztBQUVBLFVBQU1ZLFNBQVMsS0FBS3VDLHdCQUFMLENBQThCekMsT0FBOUIsRUFBdUNaLE1BQXZDLENBQWY7O0FBRUEsVUFBTW9CLFlBQVksS0FBS2tDLDhCQUFMLENBQW9DaEQsSUFBcEMsQ0FBbEI7O0FBRUEsUUFBSWlELG1CQUFtQixJQUF2Qjs7QUFFQSxRQUFJM0MsbURBQUosRUFBNEM7QUFDMUMyQyx5QkFBbUIzQyxRQUFRNEMsRUFBM0I7QUFDRDs7QUFFRCxTQUFLLE1BQU1DLGlCQUFYLElBQWdDM0MsTUFBaEMsRUFBd0M7QUFDdEMsWUFBTTRDLGVBQWV4QyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixFQUFDZSxLQUFLdUIsa0JBQWtCNUIsT0FBbEIsQ0FBMEJLLEdBQWhDLEVBQXFDeUIsWUFBWUYsa0JBQWtCdEIsS0FBbkUsRUFBbEIsRUFDYyxFQUFDeUIsV0FBVzVELE9BQU82RCxLQUFuQixFQUEwQkMsb0JBQW9COUQsT0FBT3dELEVBQXJELEVBQXlETyxvQkFBb0JSLGdCQUE3RSxFQURkLENBQXJCOztBQUdBckQsaUJBQVdDLElBQVgsQ0FBZ0JKLEdBQUd5QixlQUFILENBQW1CSixTQUFuQixFQUE4QnNDLFlBQTlCLEVBQTRDLEVBQUNqQyxJQUFJLElBQUwsRUFBNUMsQ0FBaEI7QUFDRDs7QUFFRCxXQUFPdkIsVUFBUDtBQUNEOztBQUVELFNBQU9TLDZDQUFQLENBQXFEWixFQUFyRCxFQUF5RE8sSUFBekQsRUFBK0RNLE9BQS9ELEVBQXdFWixNQUF4RSxFQUFnRkMsVUFBVSxFQUExRixFQUE4RjtBQUM1RixVQUFNQyxhQUFhLEVBQW5COztBQUVBLFNBQUssTUFBTXdCLFNBQVgsSUFBd0JkLFFBQVFlLFVBQVIsQ0FBbUJDLEdBQTNDLEVBQWdEO0FBQzlDLFVBQUlGLFVBQVVJLG1CQUFkLEVBQW1DO0FBQ2pDLGFBQUssTUFBTUMsY0FBWCxJQUE2QkwsVUFBVU0sTUFBdkMsRUFBK0M7QUFDN0M5QixxQkFBV0MsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0JGLFVBQXRCLEVBQWtDLEtBQUtRLHdDQUFMLENBQThDWCxFQUE5QyxFQUFrRE8sSUFBbEQsRUFBd0R5QixjQUF4RCxFQUF3RS9CLE1BQXhFLEVBQWdGQyxPQUFoRixDQUFsQztBQUNBQyxxQkFBV0MsSUFBWCxDQUFnQkMsS0FBaEIsQ0FBc0JGLFVBQXRCLEVBQWtDLEtBQUtTLDZDQUFMLENBQW1EWixFQUFuRCxFQUF1RE8sSUFBdkQsRUFBNkR5QixjQUE3RCxFQUE2RS9CLE1BQTdFLEVBQXFGQyxPQUFyRixDQUFsQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxXQUFPQyxVQUFQO0FBQ0Q7O0FBRUQsU0FBT21ELHdCQUFQLENBQWdDekMsT0FBaEMsRUFBeUNaLE1BQXpDLEVBQWlEO0FBQy9DLFVBQU1jLFNBQVMsRUFBZjs7QUFFQSxTQUFLLE1BQU1ZLFNBQVgsSUFBd0JkLFFBQVFlLFVBQVIsQ0FBbUJDLEdBQTNDLEVBQWdEO0FBQzlDLFVBQUlGLFVBQVVhLE9BQWQsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxZQUFNeUIsZ0JBQWdCdEMsVUFBVXVDLGNBQWhDOztBQUVBLFVBQUlELGFBQUosRUFBbUI7QUFDakJsRCxlQUFPWCxJQUFQLENBQVlDLEtBQVosQ0FBa0JVLE1BQWxCLEVBQTBCa0QsYUFBMUI7QUFDRDtBQUNGOztBQUVELFdBQU9sRCxNQUFQO0FBQ0Q7O0FBRUQsU0FBT0csNEJBQVAsQ0FBb0NMLE9BQXBDLEVBQTZDQyxhQUE3QyxFQUE0RGIsTUFBNUQsRUFBb0VDLFVBQVUsRUFBOUUsRUFBa0Y7QUFDaEYsVUFBTWEsU0FBUyxFQUFmOztBQUVBQSxXQUFPOEMsU0FBUCxHQUFtQjVELE9BQU82RCxLQUExQjtBQUNBL0MsV0FBT2dELGtCQUFQLEdBQTRCOUQsT0FBT3dELEVBQW5DOztBQUVBLFFBQUl2RCxRQUFRaUUsa0JBQVosRUFBZ0M7QUFDOUJwRCxhQUFPcUQsVUFBUCxHQUFvQmxFLFFBQVFpRSxrQkFBUixDQUEyQnRELE9BQTNCLENBQXBCO0FBQ0Q7O0FBRUQsUUFBSUEsc0NBQUosRUFBK0I7QUFDN0IsVUFBSVosT0FBT29FLGFBQVgsRUFBMEI7QUFDeEJ0RCxlQUFPdUQsVUFBUCxHQUFvQnJFLE9BQU9vRSxhQUEzQjtBQUNEOztBQUVELFVBQUlwRSxPQUFPc0UsU0FBWCxFQUFzQjtBQUNwQnhELGVBQU95RCxtQkFBUCxHQUE2QnZFLE9BQU9zRSxTQUFwQztBQUNEOztBQUVELFVBQUl0RSxPQUFPd0UsZ0JBQVgsRUFBNkI7QUFDM0IxRCxlQUFPMkQsY0FBUCxHQUF3QnpFLE9BQU93RSxnQkFBL0I7QUFDRDs7QUFFRCxVQUFJeEUsT0FBTzBFLFlBQVgsRUFBeUI7QUFDdkI1RCxlQUFPNkQsdUJBQVAsR0FBaUMzRSxPQUFPMEUsWUFBeEM7QUFDRDs7QUFFRCxVQUFJMUUsT0FBTzRFLGVBQVgsRUFBNEI7QUFDMUI5RCxlQUFPK0QsYUFBUCxHQUF1QjdFLE9BQU80RSxlQUE5QjtBQUNEOztBQUVELFVBQUk1RSxPQUFPOEUsV0FBWCxFQUF3QjtBQUN0QmhFLGVBQU9pRSxzQkFBUCxHQUFnQy9FLE9BQU84RSxXQUF2QztBQUNEOztBQUVELFVBQUk5RSxPQUFPZ0YsZUFBWCxFQUE0QjtBQUMxQmxFLGVBQU9tRSxhQUFQLEdBQXVCakYsT0FBT2dGLGVBQTlCO0FBQ0Q7O0FBRUQsVUFBSWhGLE9BQU9rRixXQUFYLEVBQXdCO0FBQ3RCcEUsZUFBT3FFLHNCQUFQLEdBQWdDbkYsT0FBT2tGLFdBQXZDO0FBQ0Q7O0FBRUQsVUFBSWxGLE9BQU9vRixlQUFYLEVBQTRCO0FBQzFCdEUsZUFBT3VFLFlBQVAsR0FBc0JyRixPQUFPb0YsZUFBN0I7QUFDRDs7QUFFRCxVQUFJcEYsT0FBT3NGLFdBQVgsRUFBd0I7QUFDdEJ4RSxlQUFPeUUscUJBQVAsR0FBK0J2RixPQUFPc0YsV0FBdEM7QUFDRDs7QUFFRCxVQUFJdEYsT0FBT3dGLE1BQVgsRUFBbUI7QUFDakIxRSxlQUFPMEUsTUFBUCxHQUFnQnhGLE9BQU93RixNQUF2QjtBQUNEOztBQUVELFVBQUl4RixPQUFPeUYsUUFBUCxJQUFtQixJQUF2QixFQUE2QjtBQUMzQjNFLGVBQU8yRSxRQUFQLEdBQWtCekYsT0FBT3lGLFFBQXpCO0FBQ0Q7O0FBRUQsVUFBSXpGLE9BQU8wRixTQUFQLElBQW9CLElBQXhCLEVBQThCO0FBQzVCNUUsZUFBTzRFLFNBQVAsR0FBbUIxRixPQUFPMEYsU0FBMUI7QUFDRDs7QUFFRDVFLGFBQU82RSxRQUFQLEdBQWtCM0YsT0FBTzJGLFFBQXpCO0FBQ0E3RSxhQUFPOEUsS0FBUCxHQUFlNUYsT0FBTzRGLEtBQXRCO0FBQ0E5RSxhQUFPK0UsTUFBUCxHQUFnQjdGLE9BQU82RixNQUF2QjtBQUNBL0UsYUFBT2dGLGlCQUFQLEdBQTJCOUYsT0FBTytGLGdCQUFsQztBQUNBakYsYUFBT2tGLG1CQUFQLEdBQTZCaEcsT0FBT2lHLGtCQUFwQztBQUNELEtBMURELE1BMERPLElBQUlyRixtREFBSixFQUE0QztBQUNqREUsYUFBT29GLFdBQVAsR0FBcUJ0RixRQUFRNEMsRUFBN0I7QUFDQTFDLGFBQU9xRixLQUFQLEdBQWV2RixRQUFRdUYsS0FBdkI7QUFDQXJGLGFBQU9pRCxrQkFBUCxHQUE0QmxELGNBQWMyQyxFQUExQzs7QUFFQSxVQUFJNUMsUUFBUXdGLGFBQVosRUFBMkI7QUFDekJ0RixlQUFPMkUsUUFBUCxHQUFrQjdFLFFBQVE2RSxRQUExQjtBQUNBM0UsZUFBTzRFLFNBQVAsR0FBbUI5RSxRQUFROEUsU0FBM0I7QUFDRDs7QUFFRDtBQUNBLFVBQUkxRixPQUFPd0YsTUFBWCxFQUFtQjtBQUNqQjFFLGVBQU91RixhQUFQLEdBQXVCckcsT0FBT3dGLE1BQTlCO0FBQ0Q7O0FBRUQsVUFBSXhGLE9BQU9vRSxhQUFYLEVBQTBCO0FBQ3hCdEQsZUFBT3dGLGlCQUFQLEdBQTJCdEcsT0FBT29FLGFBQWxDO0FBQ0Q7O0FBRUQsVUFBSXBFLE9BQU9zRSxTQUFYLEVBQXNCO0FBQ3BCeEQsZUFBT3lGLDBCQUFQLEdBQW9DdkcsT0FBT3NFLFNBQTNDO0FBQ0Q7O0FBRUQsVUFBSXRFLE9BQU93RSxnQkFBWCxFQUE2QjtBQUMzQjFELGVBQU8wRixxQkFBUCxHQUErQnhHLE9BQU93RSxnQkFBdEM7QUFDRDs7QUFFRCxVQUFJeEUsT0FBTzBFLFlBQVgsRUFBeUI7QUFDdkI1RCxlQUFPMkYsOEJBQVAsR0FBd0N6RyxPQUFPMEUsWUFBL0M7QUFDRDs7QUFFRDtBQUNBLFVBQUk5RCxRQUFROEYsU0FBWixFQUF1QjtBQUNyQjVGLGVBQU8rRCxhQUFQLEdBQXVCakUsUUFBUThGLFNBQVIsQ0FBa0I3QyxLQUF6QztBQUNEOztBQUVELFVBQUlqRCxRQUFRa0UsV0FBWixFQUF5QjtBQUN2QmhFLGVBQU9pRSxzQkFBUCxHQUFnQ25FLFFBQVFrRSxXQUF4QztBQUNEOztBQUVELFVBQUlsRSxRQUFRK0YsU0FBWixFQUF1QjtBQUNyQjdGLGVBQU9tRSxhQUFQLEdBQXVCckUsUUFBUStGLFNBQVIsQ0FBa0I5QyxLQUF6QztBQUNEOztBQUVELFVBQUlqRCxRQUFRc0UsV0FBWixFQUF5QjtBQUN2QnBFLGVBQU9xRSxzQkFBUCxHQUFnQ3ZFLFFBQVFzRSxXQUF4QztBQUNEOztBQUVELFVBQUl0RSxRQUFRZ0csU0FBWixFQUF1QjtBQUNyQjlGLGVBQU91RSxZQUFQLEdBQXNCekUsUUFBUWdHLFNBQVIsQ0FBa0IvQyxLQUF4QztBQUNBL0MsZUFBT3lFLHFCQUFQLEdBQStCM0UsUUFBUTBFLFdBQXZDO0FBQ0QsT0FIRCxNQUdPLElBQUl0RixPQUFPb0YsZUFBWCxFQUE0QjtBQUNqQ3RFLGVBQU91RSxZQUFQLEdBQXNCckYsT0FBT29GLGVBQTdCO0FBQ0F0RSxlQUFPeUUscUJBQVAsR0FBK0J2RixPQUFPc0YsV0FBdEM7QUFDRDtBQUNGOztBQUVEeEUsV0FBTytGLEtBQVAsR0FBZWpHLFFBQVFrRyxZQUF2Qjs7QUFFQWhHLFdBQU9pRyxXQUFQLEdBQXFCQyxLQUFLQyxTQUFMLENBQWVyRyxRQUFRZSxVQUFSLENBQW1CdUYsTUFBbkIsRUFBZixDQUFyQjs7QUFFQSxTQUFLQyxXQUFMLENBQWlCckcsTUFBakIsRUFBeUJGLE9BQXpCOztBQUVBLFFBQUlBLFFBQVF3RixhQUFaLEVBQTJCO0FBQ3pCdEYsYUFBT3NHLFFBQVAsR0FBa0IsS0FBS0MsVUFBTCxDQUFnQnZHLE1BQWhCLEVBQXdCRixRQUFRNkUsUUFBaEMsRUFBMEM3RSxRQUFROEUsU0FBbEQsQ0FBbEI7QUFDRCxLQUZELE1BRU87QUFDTDVFLGFBQU9zRyxRQUFQLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUR0RyxXQUFPd0csVUFBUCxHQUFvQjFHLFFBQVEyRyxlQUFSLElBQTJCM0csUUFBUTRHLFNBQXZEO0FBQ0ExRyxXQUFPMkcsVUFBUCxHQUFvQjdHLFFBQVE4RyxlQUFSLElBQTJCOUcsUUFBUStHLFNBQXZEO0FBQ0E3RyxXQUFPOEcsT0FBUCxHQUFpQmhILFFBQVFnSCxPQUF6Qjs7QUFFQSxRQUFJOUcsT0FBTytELGFBQVAsSUFBd0IsSUFBNUIsRUFBa0M7QUFDaEMvRCxhQUFPK0QsYUFBUCxHQUF1QixDQUFDLENBQXhCO0FBQ0Q7O0FBRUQsUUFBSS9ELE9BQU9tRSxhQUFQLElBQXdCLElBQTVCLEVBQWtDO0FBQ2hDbkUsYUFBT21FLGFBQVAsR0FBdUIsQ0FBQyxDQUF4QjtBQUNEOztBQUVEbkUsV0FBTytHLGlCQUFQLEdBQTJCakgsUUFBUTRHLFNBQW5DO0FBQ0ExRyxXQUFPZ0gsaUJBQVAsR0FBMkJsSCxRQUFRK0csU0FBbkM7O0FBRUE3RyxXQUFPaUgsZ0JBQVAsR0FBMEJuSCxRQUFRb0gsZUFBbEM7QUFDQWxILFdBQU9tSCxnQkFBUCxHQUEwQnJILFFBQVFzSCxlQUFsQztBQUNBcEgsV0FBT3FILGVBQVAsR0FBeUJ2SCxRQUFRd0gsY0FBakM7O0FBRUF0SCxXQUFPdUgsZ0JBQVAsR0FBMEJ6SCxRQUFRMEgsZUFBbEM7QUFDQXhILFdBQU95SCxpQkFBUCxHQUEyQjNILFFBQVE0SCxnQkFBbkM7QUFDQTFILFdBQU8ySCxnQkFBUCxHQUEwQjdILFFBQVE4SCxlQUFsQztBQUNBNUgsV0FBTzZILDJCQUFQLEdBQXFDL0gsUUFBUWdJLGVBQTdDOztBQUVBLFFBQUloSSxRQUFRaUksb0JBQVosRUFBa0M7QUFDaEMvSCxhQUFPZ0ksZ0JBQVAsR0FBMEIsS0FBS3pCLFVBQUwsQ0FBZ0J2RyxNQUFoQixFQUF3QkYsUUFBUTBILGVBQWhDLEVBQWlEMUgsUUFBUTRILGdCQUF6RCxDQUExQjtBQUNEOztBQUVEMUgsV0FBT2lJLGdCQUFQLEdBQTBCbkksUUFBUW9JLGVBQWxDO0FBQ0FsSSxXQUFPbUksaUJBQVAsR0FBMkJySSxRQUFRc0ksZ0JBQW5DO0FBQ0FwSSxXQUFPcUksZ0JBQVAsR0FBMEJ2SSxRQUFRd0ksZUFBbEM7QUFDQXRJLFdBQU91SSwyQkFBUCxHQUFxQ3pJLFFBQVEwSSxlQUE3Qzs7QUFFQSxRQUFJMUksUUFBUTJJLG9CQUFaLEVBQWtDO0FBQ2hDekksYUFBTzBJLGdCQUFQLEdBQTBCLEtBQUtuQyxVQUFMLENBQWdCdkcsTUFBaEIsRUFBd0JGLFFBQVFvSSxlQUFoQyxFQUFpRHBJLFFBQVFzSSxnQkFBekQsQ0FBMUI7QUFDRDs7QUFFRCxXQUFPcEksTUFBUDtBQUNEOztBQUVELFNBQU8ySSw0QkFBUCxDQUFvQzFKLEVBQXBDLEVBQXdDQyxNQUF4QyxFQUFnRG9CLFNBQWhELEVBQTJEO0FBQ3pELFdBQU9yQixHQUFHMkosZUFBSCxDQUFtQnRJLFNBQW5CLEVBQThCLEVBQUMwQyxvQkFBb0I5RCxPQUFPd0QsRUFBNUIsRUFBOUIsQ0FBUDtBQUNEOztBQUVELFNBQU9tRyxtQkFBUCxDQUEyQjVKLEVBQTNCLEVBQStCcUIsU0FBL0IsRUFBMEM7QUFDeEMsV0FBT3JCLEdBQUcySixlQUFILENBQW1CdEksU0FBbkIsRUFBOEIsRUFBOUIsQ0FBUDtBQUNEOztBQUVELFNBQU9mLHlCQUFQLENBQWlDTixFQUFqQyxFQUFxQ0MsTUFBckMsRUFBNkNNLElBQTdDLEVBQW1EO0FBQ2pELFVBQU1zSixjQUFjdEosS0FBS3VKLGNBQUwsQ0FBb0IsWUFBcEIsQ0FBcEI7O0FBRUEsVUFBTTNKLGFBQWEsRUFBbkI7O0FBRUEsUUFBSWtCLFlBQVksS0FBS0MsaUJBQUwsQ0FBdUJmLElBQXZCLEVBQTZCLElBQTdCLENBQWhCOztBQUVBSixlQUFXQyxJQUFYLENBQWdCLEtBQUtzSiw0QkFBTCxDQUFrQzFKLEVBQWxDLEVBQXNDQyxNQUF0QyxFQUE4Q29CLFNBQTlDLENBQWhCOztBQUVBLFNBQUssTUFBTTBJLFVBQVgsSUFBeUJGLFdBQXpCLEVBQXNDO0FBQ3BDeEksa0JBQVksS0FBS0MsaUJBQUwsQ0FBdUJmLElBQXZCLEVBQTZCd0osVUFBN0IsQ0FBWjs7QUFFQTVKLGlCQUFXQyxJQUFYLENBQWdCLEtBQUtzSiw0QkFBTCxDQUFrQzFKLEVBQWxDLEVBQXNDQyxNQUF0QyxFQUE4Q29CLFNBQTlDLENBQWhCO0FBQ0Q7O0FBRURBLGdCQUFZLEtBQUtrQyw4QkFBTCxDQUFvQ2hELElBQXBDLENBQVo7O0FBRUFKLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS3NKLDRCQUFMLENBQWtDMUosRUFBbEMsRUFBc0NDLE1BQXRDLEVBQThDb0IsU0FBOUMsQ0FBaEI7O0FBRUEsV0FBT2xCLFVBQVA7QUFDRDs7QUFFRCxTQUFPNkosdUJBQVAsQ0FBK0JoSyxFQUEvQixFQUFtQ08sSUFBbkMsRUFBeUM7QUFDdkMsVUFBTXNKLGNBQWN0SixLQUFLdUosY0FBTCxDQUFvQixZQUFwQixDQUFwQjs7QUFFQSxVQUFNM0osYUFBYSxFQUFuQjs7QUFFQSxRQUFJa0IsWUFBWSxLQUFLQyxpQkFBTCxDQUF1QmYsSUFBdkIsRUFBNkIsSUFBN0IsQ0FBaEI7O0FBRUFKLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS3dKLG1CQUFMLENBQXlCNUosRUFBekIsRUFBNkJxQixTQUE3QixDQUFoQjs7QUFFQSxTQUFLLE1BQU0wSSxVQUFYLElBQXlCRixXQUF6QixFQUFzQztBQUNwQ3hJLGtCQUFZLEtBQUtDLGlCQUFMLENBQXVCZixJQUF2QixFQUE2QndKLFVBQTdCLENBQVo7O0FBRUE1SixpQkFBV0MsSUFBWCxDQUFnQixLQUFLd0osbUJBQUwsQ0FBeUI1SixFQUF6QixFQUE2QnFCLFNBQTdCLENBQWhCO0FBQ0Q7O0FBRURBLGdCQUFZLEtBQUtrQyw4QkFBTCxDQUFvQ2hELElBQXBDLENBQVo7O0FBRUFKLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS3dKLG1CQUFMLENBQXlCNUosRUFBekIsRUFBNkJxQixTQUE3QixDQUFoQjs7QUFFQSxXQUFPbEIsVUFBUDtBQUNEOztBQUVELFNBQU9vRCw4QkFBUCxDQUFzQ2hELElBQXRDLEVBQTRDO0FBQzFDLFdBQU8sa0JBQU8sMkJBQVAsRUFBb0NBLEtBQUswSixhQUF6QyxFQUF3RDFKLEtBQUt1RCxLQUE3RCxDQUFQO0FBQ0Q7O0FBRUQsU0FBT3hDLGlCQUFQLENBQXlCZixJQUF6QixFQUErQndKLFVBQS9CLEVBQTJDO0FBQ3pDLFFBQUlBLGNBQWMsSUFBbEIsRUFBd0I7QUFDdEIsYUFBTyxrQkFBTyxvQkFBUCxFQUE2QnhKLEtBQUswSixhQUFsQyxFQUFpRDFKLEtBQUt1RCxLQUF0RCxDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxrQkFBTyx1QkFBUCxFQUFnQ3ZELEtBQUswSixhQUFyQyxFQUFvRDFKLEtBQUt1RCxLQUF6RCxFQUFnRWlHLFdBQVc1SCxHQUEzRSxDQUFQO0FBQ0Q7O0FBRUQsU0FBT2lGLFdBQVAsQ0FBbUJyRyxNQUFuQixFQUEyQkYsT0FBM0IsRUFBb0M7QUFDbEMsVUFBTXFKLGtCQUFrQnJKLFFBQVFxSixlQUFoQzs7QUFFQW5KLFdBQU9vSixpQkFBUCxHQUEyQkQsZUFBM0I7QUFDQW5KLFdBQU9xSixZQUFQLEdBQXNCLEVBQUNDLEtBQU0sZUFBZSx3QkFBUyxJQUFULEVBQWVILGVBQWYsQ0FBaUMsR0FBdkQsRUFBdEI7O0FBRUEsV0FBT25KLE1BQVA7QUFDRDs7QUFFRCxTQUFPdUcsVUFBUCxDQUFrQnZHLE1BQWxCLEVBQTBCMkUsUUFBMUIsRUFBb0NDLFNBQXBDLEVBQStDO0FBQzdDLFVBQU0yRSxNQUFNLHdCQUFTLGNBQVQsRUFBeUIzRSxTQUF6QixFQUFvQ0QsUUFBcEMsQ0FBWjs7QUFFQSxXQUFPLEVBQUMyRSxLQUFNLDBDQUEwQ0MsR0FBSyxZQUF0RCxFQUFQO0FBQ0Q7QUF4YStCO2tCQUFieEssWSIsImZpbGUiOiJyZWNvcmQtdmFsdWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHsgUmVjb3JkLCBSZXBlYXRhYmxlSXRlbVZhbHVlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBwZ2Zvcm1hdCBmcm9tICdwZy1mb3JtYXQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNvcmRWYWx1ZXMge1xuICBzdGF0aWMgdXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5kZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIHJlY29yZC5mb3JtLCBvcHRpb25zKSk7XG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Rm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCByZWNvcmQuZm9ybSwgb3B0aW9ucykpO1xuXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Rm9yUmVjb3JkU3RhdGVtZW50cyhkYiwgcmVjb3JkLCBmb3JtLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5pbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50KGRiLCBmb3JtLCByZWNvcmQsIG51bGwsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkRmVhdHVyZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyhkYiwgZm9ybSwgcmVjb3JkLCByZWNvcmQsIG9wdGlvbnMpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5jb2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHN5c3RlbVZhbHVlcyA9IHRoaXMuc3lzdGVtQ29sdW1uVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCBwYXJlbnRGZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih2YWx1ZXMsIHN5c3RlbVZhbHVlcyk7XG5cbiAgICBsZXQgdGFibGVOYW1lID0gbnVsbDtcblxuICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgLy8gVE9ETyh6aG0pIGFkZCBwdWJsaWMgaW50ZXJmYWNlIGZvciBhY2Nlc3NpbmcgX2VsZW1lbnQsIGxpa2UgYGdldCByZXBlYXRhYmxlRWxlbWVudCgpYFxuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCBmZWF0dXJlLl9lbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCBudWxsKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy52YWx1ZXNUcmFuc2Zvcm1lcikge1xuICAgICAgb3B0aW9ucy52YWx1ZXNUcmFuc2Zvcm1lcih7ZGIsIGZvcm0sIGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgdmFsdWVzfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRiLmluc2VydFN0YXRlbWVudCh0YWJsZU5hbWUsIHZhbHVlcywge3BrOiAnaWQnfSk7XG4gIH1cblxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuZWxlbWVudC5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgX2l0ZW1zXG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG1heWJlQXNzaWduQXJyYXkodmFsdWVzLCBrZXksIHZhbHVlLCBkaXNhYmxlQXJyYXlzKSB7XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YWx1ZXNba2V5XSA9IChfLmlzQXJyYXkodmFsdWUpICYmIGRpc2FibGVBcnJheXMpID8gdmFsdWUuam9pbignLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHZhbHVlO1xuICB9XG5cbiAgc3RhdGljIGNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdmFsdWVzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XG4gICAgICBpZiAoZm9ybVZhbHVlLmlzRW1wdHkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb2x1bW5WYWx1ZSA9IGZvcm1WYWx1ZS5jb2x1bW5WYWx1ZTtcblxuICAgICAgaWYgKF8uaXNOdW1iZXIoY29sdW1uVmFsdWUpIHx8IF8uaXNTdHJpbmcoY29sdW1uVmFsdWUpIHx8IF8uaXNBcnJheShjb2x1bW5WYWx1ZSkgfHwgXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XG4gICAgICAgIC8vIGRvbid0IGFsbG93IGRhdGVzIGdyZWF0ZXIgdGhhbiA5OTk5LCB5ZXMgLSB0aGV5IGV4aXN0IGluIHRoZSB3aWxkXG4gICAgICAgIGlmIChfLmlzRGF0ZShjb2x1bW5WYWx1ZSkgJiYgY29sdW1uVmFsdWUuZ2V0RnVsbFllYXIoKSA+IDk5OTkpIHtcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1heWJlQXNzaWduQXJyYXkodmFsdWVzLCAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKSwgY29sdW1uVmFsdWUsIG9wdGlvbnMuZGlzYWJsZUFycmF5cyk7XG4gICAgICB9IGVsc2UgaWYgKGNvbHVtblZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBmb3JtVmFsdWUuZWxlbWVudDtcblxuICAgICAgICBpZiAoZWxlbWVudCAmJiBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKSB7XG4gICAgICAgICAgaWYgKGVsZW1lbnQuaXNQaG90b0VsZW1lbnQgfHwgZWxlbWVudC5pc1ZpZGVvRWxlbWVudCB8fCBlbGVtZW50LmlzQXVkaW9FbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgY29sdW1uVmFsdWVbcHJlZml4ICsgJ191cmxzJ10gPSBvcHRpb25zLm1lZGlhVVJMRm9ybWF0dGVyKGZvcm1WYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcikge1xuICAgICAgICAgICAgICBjb2x1bW5WYWx1ZVtwcmVmaXggKyAnX3ZpZXdfdXJsJ10gPSBvcHRpb25zLm1lZGlhVmlld1VSTEZvcm1hdHRlcihmb3JtVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGFycmF5IHR5cGVzIGFyZSBkaXNhYmxlZCwgY29udmVydCBhbGwgdGhlIHByb3BzIHRvIGRlbGltaXRlZCB2YWx1ZXNcbiAgICAgICAgaWYgKG9wdGlvbnMuZGlzYWJsZUFycmF5cykge1xuICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNvbHVtblZhbHVlKSkge1xuICAgICAgICAgICAgdGhpcy5tYXliZUFzc2lnbkFycmF5KGNvbHVtblZhbHVlLCBrZXksIGNvbHVtblZhbHVlW2tleV0sIG9wdGlvbnMuZGlzYWJsZUFycmF5cyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih2YWx1ZXMsIGNvbHVtblZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIGluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5tdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKTtcblxuICAgIGNvbnN0IHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0pO1xuXG4gICAgbGV0IHBhcmVudFJlc291cmNlSWQgPSBudWxsO1xuXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XG4gICAgICBwYXJlbnRSZXNvdXJjZUlkID0gZmVhdHVyZS5pZDtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IG11bHRpcGxlVmFsdWVJdGVtIG9mIHZhbHVlcykge1xuICAgICAgY29uc3QgaW5zZXJ0VmFsdWVzID0gT2JqZWN0LmFzc2lnbih7fSwge2tleTogbXVsdGlwbGVWYWx1ZUl0ZW0uZWxlbWVudC5rZXksIHRleHRfdmFsdWU6IG11bHRpcGxlVmFsdWVJdGVtLnZhbHVlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY29yZF9pZDogcmVjb3JkLnJvd0lELCByZWNvcmRfcmVzb3VyY2VfaWQ6IHJlY29yZC5pZCwgcGFyZW50X3Jlc291cmNlX2lkOiBwYXJlbnRSZXNvdXJjZUlkfSk7XG5cbiAgICAgIHN0YXRlbWVudHMucHVzaChkYi5pbnNlcnRTdGF0ZW1lbnQodGFibGVOYW1lLCBpbnNlcnRWYWx1ZXMsIHtwazogJ2lkJ30pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBpbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xuICAgICAgaWYgKGZvcm1WYWx1ZS5pc1JlcGVhdGFibGVFbGVtZW50KSB7XG4gICAgICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZUl0ZW0gb2YgZm9ybVZhbHVlLl9pdGVtcykge1xuICAgICAgICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZShmZWF0dXJlLCByZWNvcmQpIHtcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNFbXB0eSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmVhdHVyZVZhbHVlcyA9IGZvcm1WYWx1ZS5tdWx0aXBsZVZhbHVlcztcblxuICAgICAgaWYgKGZlYXR1cmVWYWx1ZXMpIHtcbiAgICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCBmZWF0dXJlVmFsdWVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcblxuICAgIHZhbHVlcy5yZWNvcmRfaWQgPSByZWNvcmQucm93SUQ7XG4gICAgdmFsdWVzLnJlY29yZF9yZXNvdXJjZV9pZCA9IHJlY29yZC5pZDtcblxuICAgIGlmIChvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcikge1xuICAgICAgdmFsdWVzLnJlcG9ydF91cmwgPSBvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcihmZWF0dXJlKTtcbiAgICB9XG5cbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlY29yZCkge1xuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X2lkID0gcmVjb3JkLl9wcm9qZWN0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQucHJvamVjdElEKSB7XG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X3Jlc291cmNlX2lkID0gcmVjb3JkLnByb2plY3RJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMuYXNzaWduZWRfdG9fcmVzb3VyY2VfaWQgPSByZWNvcmQuYXNzaWduZWRUb0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9jcmVhdGVkQnlSb3dJRCkge1xuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IHJlY29yZC5fY3JlYXRlZEJ5Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY3JlYXRlZEJ5SUQpIHtcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQgPSByZWNvcmQuY3JlYXRlZEJ5SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuX3VwZGF0ZWRCeVJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gcmVjb3JkLl91cGRhdGVkQnlSb3dJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC51cGRhdGVkQnlJRCkge1xuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQuY2hhbmdlc2V0SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IHJlY29yZC5jaGFuZ2VzZXRJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5zdGF0dXMpIHtcbiAgICAgICAgdmFsdWVzLnN0YXR1cyA9IHJlY29yZC5zdGF0dXM7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubGF0aXR1ZGUgIT0gbnVsbCkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSByZWNvcmQubGF0aXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQubG9uZ2l0dWRlICE9IG51bGwpIHtcbiAgICAgICAgdmFsdWVzLmxvbmdpdHVkZSA9IHJlY29yZC5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIHZhbHVlcy5hbHRpdHVkZSA9IHJlY29yZC5hbHRpdHVkZTtcbiAgICAgIHZhbHVlcy5zcGVlZCA9IHJlY29yZC5zcGVlZDtcbiAgICAgIHZhbHVlcy5jb3Vyc2UgPSByZWNvcmQuY291cnNlO1xuICAgICAgdmFsdWVzLnZlcnRpY2FsX2FjY3VyYWN5ID0gcmVjb3JkLnZlcnRpY2FsQWNjdXJhY3k7XG4gICAgICB2YWx1ZXMuaG9yaXpvbnRhbF9hY2N1cmFjeSA9IHJlY29yZC5ob3Jpem9udGFsQWNjdXJhY3k7XG4gICAgfSBlbHNlIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgUmVwZWF0YWJsZUl0ZW1WYWx1ZSkge1xuICAgICAgdmFsdWVzLnJlc291cmNlX2lkID0gZmVhdHVyZS5pZDtcbiAgICAgIHZhbHVlcy5pbmRleCA9IGZlYXR1cmUuaW5kZXg7XG4gICAgICB2YWx1ZXMucGFyZW50X3Jlc291cmNlX2lkID0gcGFyZW50RmVhdHVyZS5pZDtcblxuICAgICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgICB2YWx1ZXMubGF0aXR1ZGUgPSBmZWF0dXJlLmxhdGl0dWRlO1xuICAgICAgICB2YWx1ZXMubG9uZ2l0dWRlID0gZmVhdHVyZS5sb25naXR1ZGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlY29yZCB2YWx1ZXNcbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfc3RhdHVzID0gcmVjb3JkLnN0YXR1cztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlY29yZC5fcHJvamVjdFJvd0lEKSB7XG4gICAgICAgIHZhbHVlcy5yZWNvcmRfcHJvamVjdF9pZCA9IHJlY29yZC5fcHJvamVjdFJvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnByb2plY3RJRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQgPSByZWNvcmQucHJvamVjdElEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLl9hc3NpZ25lZFRvUm93SUQpIHtcbiAgICAgICAgdmFsdWVzLnJlY29yZF9hc3NpZ25lZF90b19pZCA9IHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLmFzc2lnbmVkVG9JRCkge1xuICAgICAgICB2YWx1ZXMucmVjb3JkX2Fzc2lnbmVkX3RvX3Jlc291cmNlX2lkID0gcmVjb3JkLmFzc2lnbmVkVG9JRDtcbiAgICAgIH1cblxuICAgICAgLy8gbGlua2VkIGZpZWxkc1xuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X2lkID0gZmVhdHVyZS5jcmVhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLmNyZWF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy5jcmVhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS5jcmVhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUudXBkYXRlZEJ5KSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gZmVhdHVyZS51cGRhdGVkQnkucm93SUQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeUlEKSB7XG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X3Jlc291cmNlX2lkID0gZmVhdHVyZS51cGRhdGVkQnlJRDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZlYXR1cmUuY2hhbmdlc2V0KSB7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSBmZWF0dXJlLmNoYW5nZXNldC5yb3dJRDtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY2hhbmdlc2V0SUQ7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9pZCA9IHJlY29yZC5fY2hhbmdlc2V0Um93SUQ7XG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsdWVzLnRpdGxlID0gZmVhdHVyZS5kaXNwbGF5VmFsdWU7XG5cbiAgICB2YWx1ZXMuZm9ybV92YWx1ZXMgPSBKU09OLnN0cmluZ2lmeShmZWF0dXJlLmZvcm1WYWx1ZXMudG9KU09OKCkpO1xuXG4gICAgdGhpcy5zZXR1cFNlYXJjaCh2YWx1ZXMsIGZlYXR1cmUpO1xuXG4gICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmdlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS5sYXRpdHVkZSwgZmVhdHVyZS5sb25naXR1ZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXMuZ2VvbWV0cnkgPSBudWxsO1xuICAgIH1cblxuICAgIHZhbHVlcy5jcmVhdGVkX2F0ID0gZmVhdHVyZS5jbGllbnRDcmVhdGVkQXQgfHwgZmVhdHVyZS5jcmVhdGVkQXQ7XG4gICAgdmFsdWVzLnVwZGF0ZWRfYXQgPSBmZWF0dXJlLmNsaWVudFVwZGF0ZWRBdCB8fCBmZWF0dXJlLnVwZGF0ZWRBdDtcbiAgICB2YWx1ZXMudmVyc2lvbiA9IGZlYXR1cmUudmVyc2lvbjtcblxuICAgIGlmICh2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZXMudXBkYXRlZF9ieV9pZCA9PSBudWxsKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IC0xO1xuICAgIH1cblxuICAgIHZhbHVlcy5zZXJ2ZXJfY3JlYXRlZF9hdCA9IGZlYXR1cmUuY3JlYXRlZEF0O1xuICAgIHZhbHVlcy5zZXJ2ZXJfdXBkYXRlZF9hdCA9IGZlYXR1cmUudXBkYXRlZEF0O1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmNyZWF0ZWREdXJhdGlvbjtcbiAgICB2YWx1ZXMudXBkYXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUudXBkYXRlZER1cmF0aW9uO1xuICAgIHZhbHVlcy5lZGl0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmVkaXRlZER1cmF0aW9uO1xuXG4gICAgdmFsdWVzLmNyZWF0ZWRfbGF0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9sb25naXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMb25naXR1ZGU7XG4gICAgdmFsdWVzLmNyZWF0ZWRfYWx0aXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRBbHRpdHVkZTtcbiAgICB2YWx1ZXMuY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5ID0gZmVhdHVyZS5jcmVhdGVkQWNjdXJhY3k7XG5cbiAgICBpZiAoZmVhdHVyZS5oYXNDcmVhdGVkQ29vcmRpbmF0ZSkge1xuICAgICAgdmFsdWVzLmNyZWF0ZWRfZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLmNyZWF0ZWRMYXRpdHVkZSwgZmVhdHVyZS5jcmVhdGVkTG9uZ2l0dWRlKTtcbiAgICB9XG5cbiAgICB2YWx1ZXMudXBkYXRlZF9sYXRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExhdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2xvbmdpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExvbmdpdHVkZTtcbiAgICB2YWx1ZXMudXBkYXRlZF9hbHRpdHVkZSA9IGZlYXR1cmUudXBkYXRlZEFsdGl0dWRlO1xuICAgIHZhbHVlcy51cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kgPSBmZWF0dXJlLnVwZGF0ZWRBY2N1cmFjeTtcblxuICAgIGlmIChmZWF0dXJlLmhhc1VwZGF0ZWRDb29yZGluYXRlKSB7XG4gICAgICB2YWx1ZXMudXBkYXRlZF9nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUudXBkYXRlZExhdGl0dWRlLCBmZWF0dXJlLnVwZGF0ZWRMb25naXR1ZGUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpIHtcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge3JlY29yZF9yZXNvdXJjZV9pZDogcmVjb3JkLmlkfSk7XG4gIH1cblxuICBzdGF0aWMgZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSB7XG4gICAgcmV0dXJuIGRiLmRlbGV0ZVN0YXRlbWVudCh0YWJsZU5hbWUsIHt9KTtcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIGZvcm0pIHtcbiAgICBjb25zdCByZXBlYXRhYmxlcyA9IGZvcm0uZWxlbWVudHNPZlR5cGUoJ1JlcGVhdGFibGUnKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcblxuICAgIGxldCB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG51bGwpO1xuXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c0ZvclJlY29yZFN0YXRlbWVudChkYiwgcmVjb3JkLCB0YWJsZU5hbWUpKTtcbiAgICB9XG5cbiAgICB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKTtcblxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XG5cbiAgICByZXR1cm4gc3RhdGVtZW50cztcbiAgfVxuXG4gIHN0YXRpYyBkZWxldGVGb3JGb3JtU3RhdGVtZW50cyhkYiwgZm9ybSkge1xuICAgIGNvbnN0IHJlcGVhdGFibGVzID0gZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xuXG4gICAgbGV0IHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgbnVsbCk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIGZvciAoY29uc3QgcmVwZWF0YWJsZSBvZiByZXBlYXRhYmxlcykge1xuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlKTtcblxuICAgICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSk7XG4gICAgfVxuXG4gICAgdGFibGVOYW1lID0gdGhpcy5tdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0oZm9ybSk7XG5cbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcblxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xuICB9XG5cbiAgc3RhdGljIG11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtKSB7XG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzX3ZhbHVlcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gIH1cblxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSkge1xuICAgIGlmIChyZXBlYXRhYmxlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmb3JtYXQoJ2FjY291bnRfJXNfZm9ybV8lcycsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdCgnYWNjb3VudF8lc19mb3JtXyVzXyVzJywgZm9ybS5fYWNjb3VudFJvd0lELCBmb3JtLnJvd0lELCByZXBlYXRhYmxlLmtleSk7XG4gIH1cblxuICBzdGF0aWMgc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlKSB7XG4gICAgY29uc3Qgc2VhcmNoYWJsZVZhbHVlID0gZmVhdHVyZS5zZWFyY2hhYmxlVmFsdWU7XG5cbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4X3RleHQgPSBzZWFyY2hhYmxlVmFsdWU7XG4gICAgdmFsdWVzLnJlY29yZF9pbmRleCA9IHtyYXc6IGB0b190c3ZlY3RvcigkeyBwZ2Zvcm1hdCgnJUwnLCBzZWFyY2hhYmxlVmFsdWUpIH0pYH07XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9XG5cbiAgc3RhdGljIHNldHVwUG9pbnQodmFsdWVzLCBsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XG4gICAgY29uc3Qgd2t0ID0gcGdmb3JtYXQoJ1BPSU5UKCVzICVzKScsIGxvbmdpdHVkZSwgbGF0aXR1ZGUpO1xuXG4gICAgcmV0dXJuIHtyYXc6IGBTVF9Gb3JjZTJEKFNUX1NldFNSSUQoU1RfR2VvbUZyb21UZXh0KCckeyB3a3QgfScpLCA0MzI2KSlgfTtcbiAgfVxufVxuIl19