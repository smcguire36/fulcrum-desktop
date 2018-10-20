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
      tableName = this.tableNameWithForm(form, feature._element, options);
    } else {
      tableName = this.tableNameWithForm(form, null, options);
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

    const tableName = this.multipleValueTableNameWithForm(form, options);

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

  static deleteForRecordStatements(db, record, form, options) {
    const repeatables = form.elementsOfType('Repeatable');

    const statements = [];

    let tableName = this.tableNameWithForm(form, null, options);

    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithForm(form, repeatable, options);

      statements.push(this.deleteRowsForRecordStatement(db, record, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form, options);

    statements.push(this.deleteRowsForRecordStatement(db, record, tableName));

    return statements;
  }

  static deleteForFormStatements(db, form, options) {
    const repeatables = form.elementsOfType('Repeatable');

    const statements = [];

    let tableName = this.tableNameWithForm(form, null, options);

    statements.push(this.deleteRowsStatement(db, tableName));

    for (const repeatable of repeatables) {
      tableName = this.tableNameWithForm(form, repeatable, options);

      statements.push(this.deleteRowsStatement(db, tableName));
    }

    tableName = this.multipleValueTableNameWithForm(form, options);

    statements.push(this.deleteRowsStatement(db, tableName));

    return statements;
  }

  static multipleValueTableNameWithForm(form, options) {
    const prefix = options && options.schema ? options.schema + '.' : '';

    return (0, _util.format)('%saccount_%s_form_%s_values', prefix, form._accountRowID, form.rowID);
  }

  static tableNameWithForm(form, repeatable, options) {
    const prefix = options && options.schema ? options.schema + '.' : '';

    if (repeatable == null) {
      return (0, _util.format)('%saccount_%s_form_%s', prefix, form._accountRowID, form.rowID);
    }

    return (0, _util.format)('%saccount_%s_form_%s_%s', prefix, form._accountRowID, form.rowID, repeatable.key);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL21vZGVscy9yZWNvcmQtdmFsdWVzL3JlY29yZC12YWx1ZXMuanMiXSwibmFtZXMiOlsiUmVjb3JkVmFsdWVzIiwidXBkYXRlRm9yUmVjb3JkU3RhdGVtZW50cyIsImRiIiwicmVjb3JkIiwib3B0aW9ucyIsInN0YXRlbWVudHMiLCJwdXNoIiwiYXBwbHkiLCJkZWxldGVGb3JSZWNvcmRTdGF0ZW1lbnRzIiwiZm9ybSIsImluc2VydEZvclJlY29yZFN0YXRlbWVudHMiLCJpbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50IiwiaW5zZXJ0Q2hpbGRGZWF0dXJlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzIiwiaW5zZXJ0TXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImluc2VydENoaWxkTXVsdGlwbGVWYWx1ZXNGb3JGZWF0dXJlU3RhdGVtZW50cyIsImZlYXR1cmUiLCJwYXJlbnRGZWF0dXJlIiwidmFsdWVzIiwiY29sdW1uVmFsdWVzRm9yRmVhdHVyZSIsInN5c3RlbVZhbHVlcyIsInN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUiLCJPYmplY3QiLCJhc3NpZ24iLCJ0YWJsZU5hbWUiLCJ0YWJsZU5hbWVXaXRoRm9ybSIsIl9lbGVtZW50IiwidmFsdWVzVHJhbnNmb3JtZXIiLCJpbnNlcnRTdGF0ZW1lbnQiLCJwayIsImZvcm1WYWx1ZSIsImZvcm1WYWx1ZXMiLCJhbGwiLCJlbGVtZW50IiwiaXNSZXBlYXRhYmxlRWxlbWVudCIsInJlcGVhdGFibGVJdGVtIiwiX2l0ZW1zIiwibWF5YmVBc3NpZ25BcnJheSIsImtleSIsInZhbHVlIiwiZGlzYWJsZUFycmF5cyIsImlzQXJyYXkiLCJqb2luIiwiaXNFbXB0eSIsImNvbHVtblZhbHVlIiwiaXNOdW1iZXIiLCJpc1N0cmluZyIsImlzRGF0ZSIsImdldEZ1bGxZZWFyIiwidG9Mb3dlckNhc2UiLCJtZWRpYVVSTEZvcm1hdHRlciIsImlzUGhvdG9FbGVtZW50IiwiaXNWaWRlb0VsZW1lbnQiLCJpc0F1ZGlvRWxlbWVudCIsInByZWZpeCIsIm1lZGlhVmlld1VSTEZvcm1hdHRlciIsImtleXMiLCJtdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUiLCJtdWx0aXBsZVZhbHVlVGFibGVOYW1lV2l0aEZvcm0iLCJwYXJlbnRSZXNvdXJjZUlkIiwiaWQiLCJtdWx0aXBsZVZhbHVlSXRlbSIsImluc2VydFZhbHVlcyIsInRleHRfdmFsdWUiLCJyZWNvcmRfaWQiLCJyb3dJRCIsInJlY29yZF9yZXNvdXJjZV9pZCIsInBhcmVudF9yZXNvdXJjZV9pZCIsImZlYXR1cmVWYWx1ZXMiLCJtdWx0aXBsZVZhbHVlcyIsInJlcG9ydFVSTEZvcm1hdHRlciIsInJlcG9ydF91cmwiLCJfcHJvamVjdFJvd0lEIiwicHJvamVjdF9pZCIsInByb2plY3RJRCIsInByb2plY3RfcmVzb3VyY2VfaWQiLCJfYXNzaWduZWRUb1Jvd0lEIiwiYXNzaWduZWRfdG9faWQiLCJhc3NpZ25lZFRvSUQiLCJhc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsIl9jcmVhdGVkQnlSb3dJRCIsImNyZWF0ZWRfYnlfaWQiLCJjcmVhdGVkQnlJRCIsImNyZWF0ZWRfYnlfcmVzb3VyY2VfaWQiLCJfdXBkYXRlZEJ5Um93SUQiLCJ1cGRhdGVkX2J5X2lkIiwidXBkYXRlZEJ5SUQiLCJ1cGRhdGVkX2J5X3Jlc291cmNlX2lkIiwiX2NoYW5nZXNldFJvd0lEIiwiY2hhbmdlc2V0X2lkIiwiY2hhbmdlc2V0SUQiLCJjaGFuZ2VzZXRfcmVzb3VyY2VfaWQiLCJzdGF0dXMiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsImFsdGl0dWRlIiwic3BlZWQiLCJjb3Vyc2UiLCJ2ZXJ0aWNhbF9hY2N1cmFjeSIsInZlcnRpY2FsQWNjdXJhY3kiLCJob3Jpem9udGFsX2FjY3VyYWN5IiwiaG9yaXpvbnRhbEFjY3VyYWN5IiwicmVzb3VyY2VfaWQiLCJpbmRleCIsImhhc0Nvb3JkaW5hdGUiLCJyZWNvcmRfc3RhdHVzIiwicmVjb3JkX3Byb2plY3RfaWQiLCJyZWNvcmRfcHJvamVjdF9yZXNvdXJjZV9pZCIsInJlY29yZF9hc3NpZ25lZF90b19pZCIsInJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCIsImNyZWF0ZWRCeSIsInVwZGF0ZWRCeSIsImNoYW5nZXNldCIsInRpdGxlIiwiZGlzcGxheVZhbHVlIiwiZm9ybV92YWx1ZXMiLCJKU09OIiwic3RyaW5naWZ5IiwidG9KU09OIiwic2V0dXBTZWFyY2giLCJnZW9tZXRyeSIsInNldHVwUG9pbnQiLCJjcmVhdGVkX2F0IiwiY2xpZW50Q3JlYXRlZEF0IiwiY3JlYXRlZEF0IiwidXBkYXRlZF9hdCIsImNsaWVudFVwZGF0ZWRBdCIsInVwZGF0ZWRBdCIsInZlcnNpb24iLCJzZXJ2ZXJfY3JlYXRlZF9hdCIsInNlcnZlcl91cGRhdGVkX2F0IiwiY3JlYXRlZF9kdXJhdGlvbiIsImNyZWF0ZWREdXJhdGlvbiIsInVwZGF0ZWRfZHVyYXRpb24iLCJ1cGRhdGVkRHVyYXRpb24iLCJlZGl0ZWRfZHVyYXRpb24iLCJlZGl0ZWREdXJhdGlvbiIsImNyZWF0ZWRfbGF0aXR1ZGUiLCJjcmVhdGVkTGF0aXR1ZGUiLCJjcmVhdGVkX2xvbmdpdHVkZSIsImNyZWF0ZWRMb25naXR1ZGUiLCJjcmVhdGVkX2FsdGl0dWRlIiwiY3JlYXRlZEFsdGl0dWRlIiwiY3JlYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5IiwiY3JlYXRlZEFjY3VyYWN5IiwiaGFzQ3JlYXRlZENvb3JkaW5hdGUiLCJjcmVhdGVkX2dlb21ldHJ5IiwidXBkYXRlZF9sYXRpdHVkZSIsInVwZGF0ZWRMYXRpdHVkZSIsInVwZGF0ZWRfbG9uZ2l0dWRlIiwidXBkYXRlZExvbmdpdHVkZSIsInVwZGF0ZWRfYWx0aXR1ZGUiLCJ1cGRhdGVkQWx0aXR1ZGUiLCJ1cGRhdGVkX2hvcml6b250YWxfYWNjdXJhY3kiLCJ1cGRhdGVkQWNjdXJhY3kiLCJoYXNVcGRhdGVkQ29vcmRpbmF0ZSIsInVwZGF0ZWRfZ2VvbWV0cnkiLCJkZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50IiwiZGVsZXRlU3RhdGVtZW50IiwiZGVsZXRlUm93c1N0YXRlbWVudCIsInJlcGVhdGFibGVzIiwiZWxlbWVudHNPZlR5cGUiLCJyZXBlYXRhYmxlIiwiZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMiLCJzY2hlbWEiLCJfYWNjb3VudFJvd0lEIiwic2VhcmNoYWJsZVZhbHVlIiwicmVjb3JkX2luZGV4X3RleHQiLCJyZWNvcmRfaW5kZXgiLCJyYXciLCJ3a3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLFlBQU4sQ0FBbUI7QUFDaEMsU0FBT0MseUJBQVAsQ0FBaUNDLEVBQWpDLEVBQXFDQyxNQUFyQyxFQUE2Q0MsVUFBVSxFQUF2RCxFQUEyRDtBQUN6RCxVQUFNQyxhQUFhLEVBQW5COztBQUVBQSxlQUFXQyxJQUFYLENBQWdCQyxLQUFoQixDQUFzQkYsVUFBdEIsRUFBa0MsS0FBS0cseUJBQUwsQ0FBK0JOLEVBQS9CLEVBQW1DQyxNQUFuQyxFQUEyQ0EsT0FBT00sSUFBbEQsRUFBd0RMLE9BQXhELENBQWxDO0FBQ0FDLGVBQVdDLElBQVgsQ0FBZ0JDLEtBQWhCLENBQXNCRixVQUF0QixFQUFrQyxLQUFLSyx5QkFBTCxDQUErQlIsRUFBL0IsRUFBbUNDLE1BQW5DLEVBQTJDQSxPQUFPTSxJQUFsRCxFQUF3REwsT0FBeEQsQ0FBbEM7O0FBRUEsV0FBT0MsVUFBUDtBQUNEOztBQUVELFNBQU9LLHlCQUFQLENBQWlDUixFQUFqQyxFQUFxQ0MsTUFBckMsRUFBNkNNLElBQTdDLEVBQW1ETCxVQUFVLEVBQTdELEVBQWlFO0FBQy9ELFVBQU1DLGFBQWEsRUFBbkI7O0FBRUFBLGVBQVdDLElBQVgsQ0FBZ0IsS0FBS0ssNEJBQUwsQ0FBa0NULEVBQWxDLEVBQXNDTyxJQUF0QyxFQUE0Q04sTUFBNUMsRUFBb0QsSUFBcEQsRUFBMERBLE1BQTFELEVBQWtFQyxPQUFsRSxDQUFoQjtBQUNBQyxlQUFXQyxJQUFYLENBQWdCQyxL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QUFDRDtBQTVhK0I7a0JBQWJ6SyxZIiwiZmlsZSI6InJlY29yZC12YWx1ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBmb3JtYXQgfSBmcm9tICd1dGlsJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgUmVjb3JkLCBSZXBlYXRhYmxlSXRlbVZhbHVlIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcclxuaW1wb3J0IHBnZm9ybWF0IGZyb20gJ3BnLWZvcm1hdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWNvcmRWYWx1ZXMge1xyXG4gIHN0YXRpYyB1cGRhdGVGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgcmVjb3JkLmZvcm0sIG9wdGlvbnMpKTtcclxuICAgIHN0YXRlbWVudHMucHVzaC5hcHBseShzdGF0ZW1lbnRzLCB0aGlzLmluc2VydEZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgcmVjb3JkLmZvcm0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICByZXR1cm4gc3RhdGVtZW50cztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpbnNlcnRGb3JSZWNvcmRTdGF0ZW1lbnRzKGRiLCByZWNvcmQsIGZvcm0sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIHJlY29yZCwgbnVsbCwgcmVjb3JkLCBvcHRpb25zKSk7XHJcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlY29yZCwgcmVjb3JkLCBvcHRpb25zKSk7XHJcbiAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xyXG4gICAgc3RhdGVtZW50cy5wdXNoLmFwcGx5KHN0YXRlbWVudHMsIHRoaXMuaW5zZXJ0Q2hpbGRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZWNvcmQsIHJlY29yZCwgb3B0aW9ucykpO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGluc2VydFJvd0ZvckZlYXR1cmVTdGF0ZW1lbnQoZGIsIGZvcm0sIGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgb3B0aW9ucyk7XHJcbiAgICBjb25zdCBzeXN0ZW1WYWx1ZXMgPSB0aGlzLnN5c3RlbUNvbHVtblZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zKTtcclxuXHJcbiAgICBPYmplY3QuYXNzaWduKHZhbHVlcywgc3lzdGVtVmFsdWVzKTtcclxuXHJcbiAgICBsZXQgdGFibGVOYW1lID0gbnVsbDtcclxuXHJcbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlcGVhdGFibGVJdGVtVmFsdWUpIHtcclxuICAgICAgLy8gVE9ETyh6aG0pIGFkZCBwdWJsaWMgaW50ZXJmYWNlIGZvciBhY2Nlc3NpbmcgX2VsZW1lbnQsIGxpa2UgYGdldCByZXBlYXRhYmxlRWxlbWVudCgpYFxyXG4gICAgICB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIGZlYXR1cmUuX2VsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCBudWxsLCBvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob3B0aW9ucy52YWx1ZXNUcmFuc2Zvcm1lcikge1xyXG4gICAgICBvcHRpb25zLnZhbHVlc1RyYW5zZm9ybWVyKHtkYiwgZm9ybSwgZmVhdHVyZSwgcGFyZW50RmVhdHVyZSwgcmVjb3JkLCB2YWx1ZXN9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGIuaW5zZXJ0U3RhdGVtZW50KHRhYmxlTmFtZSwgdmFsdWVzLCB7cGs6ICdpZCd9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xyXG4gICAgICBpZiAoZm9ybVZhbHVlLmVsZW1lbnQuaXNSZXBlYXRhYmxlRWxlbWVudCkge1xyXG4gICAgICAgIC8vIFRPRE8oemhtKSBhZGQgcHVibGljIGludGVyZmFjZSBmb3IgX2l0ZW1zXHJcbiAgICAgICAgZm9yIChjb25zdCByZXBlYXRhYmxlSXRlbSBvZiBmb3JtVmFsdWUuX2l0ZW1zKSB7XHJcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5pbnNlcnRSb3dGb3JGZWF0dXJlU3RhdGVtZW50KGRiLCBmb3JtLCByZXBlYXRhYmxlSXRlbSwgZmVhdHVyZSwgcmVjb3JkLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZEZlYXR1cmVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGVtZW50cztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtYXliZUFzc2lnbkFycmF5KHZhbHVlcywga2V5LCB2YWx1ZSwgZGlzYWJsZUFycmF5cykge1xyXG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbHVlc1trZXldID0gKF8uaXNBcnJheSh2YWx1ZSkgJiYgZGlzYWJsZUFycmF5cykgPyB2YWx1ZS5qb2luKCcsJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB2YWx1ZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjb2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgdmFsdWVzID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCBmb3JtVmFsdWUgb2YgZmVhdHVyZS5mb3JtVmFsdWVzLmFsbCkge1xyXG4gICAgICBpZiAoZm9ybVZhbHVlLmlzRW1wdHkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGNvbHVtblZhbHVlID0gZm9ybVZhbHVlLmNvbHVtblZhbHVlO1xyXG5cclxuICAgICAgaWYgKF8uaXNOdW1iZXIoY29sdW1uVmFsdWUpIHx8IF8uaXNTdHJpbmcoY29sdW1uVmFsdWUpIHx8IF8uaXNBcnJheShjb2x1bW5WYWx1ZSkgfHwgXy5pc0RhdGUoY29sdW1uVmFsdWUpKSB7XHJcbiAgICAgICAgLy8gZG9uJ3QgYWxsb3cgZGF0ZXMgZ3JlYXRlciB0aGFuIDk5OTksIHllcyAtIHRoZXkgZXhpc3QgaW4gdGhlIHdpbGRcclxuICAgICAgICBpZiAoXy5pc0RhdGUoY29sdW1uVmFsdWUpICYmIGNvbHVtblZhbHVlLmdldEZ1bGxZZWFyKCkgPiA5OTk5KSB7XHJcbiAgICAgICAgICBjb2x1bW5WYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm1heWJlQXNzaWduQXJyYXkodmFsdWVzLCAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKSwgY29sdW1uVmFsdWUsIG9wdGlvbnMuZGlzYWJsZUFycmF5cyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY29sdW1uVmFsdWUpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZm9ybVZhbHVlLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmIChlbGVtZW50ICYmIG9wdGlvbnMubWVkaWFVUkxGb3JtYXR0ZXIpIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50LmlzUGhvdG9FbGVtZW50IHx8IGVsZW1lbnQuaXNWaWRlb0VsZW1lbnQgfHwgZWxlbWVudC5pc0F1ZGlvRWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBwcmVmaXggPSAnZicgKyBmb3JtVmFsdWUuZWxlbWVudC5rZXkudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbHVtblZhbHVlW3ByZWZpeCArICdfdXJscyddID0gb3B0aW9ucy5tZWRpYVVSTEZvcm1hdHRlcihmb3JtVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWVkaWFWaWV3VVJMRm9ybWF0dGVyKSB7XHJcbiAgICAgICAgICAgICAgY29sdW1uVmFsdWVbcHJlZml4ICsgJ192aWV3X3VybCddID0gb3B0aW9ucy5tZWRpYVZpZXdVUkxGb3JtYXR0ZXIoZm9ybVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgYXJyYXkgdHlwZXMgYXJlIGRpc2FibGVkLCBjb252ZXJ0IGFsbCB0aGUgcHJvcHMgdG8gZGVsaW1pdGVkIHZhbHVlc1xyXG4gICAgICAgIGlmIChvcHRpb25zLmRpc2FibGVBcnJheXMpIHtcclxuICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGNvbHVtblZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLm1heWJlQXNzaWduQXJyYXkoY29sdW1uVmFsdWUsIGtleSwgY29sdW1uVmFsdWVba2V5XSwgb3B0aW9ucy5kaXNhYmxlQXJyYXlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odmFsdWVzLCBjb2x1bW5WYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGluc2VydE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIGZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBzdGF0ZW1lbnRzID0gW107XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5tdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKTtcclxuXHJcbiAgICBjb25zdCB0YWJsZU5hbWUgPSB0aGlzLm11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtLCBvcHRpb25zKTtcclxuXHJcbiAgICBsZXQgcGFyZW50UmVzb3VyY2VJZCA9IG51bGw7XHJcblxyXG4gICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XHJcbiAgICAgIHBhcmVudFJlc291cmNlSWQgPSBmZWF0dXJlLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgbXVsdGlwbGVWYWx1ZUl0ZW0gb2YgdmFsdWVzKSB7XHJcbiAgICAgIGNvbnN0IGluc2VydFZhbHVlcyA9IE9iamVjdC5hc3NpZ24oe30sIHtrZXk6IG11bHRpcGxlVmFsdWVJdGVtLmVsZW1lbnQua2V5LCB0ZXh0X3ZhbHVlOiBtdWx0aXBsZVZhbHVlSXRlbS52YWx1ZX0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3JlY29yZF9pZDogcmVjb3JkLnJvd0lELCByZWNvcmRfcmVzb3VyY2VfaWQ6IHJlY29yZC5pZCwgcGFyZW50X3Jlc291cmNlX2lkOiBwYXJlbnRSZXNvdXJjZUlkfSk7XHJcblxyXG4gICAgICBzdGF0ZW1lbnRzLnB1c2goZGIuaW5zZXJ0U3RhdGVtZW50KHRhYmxlTmFtZSwgaW5zZXJ0VmFsdWVzLCB7cGs6ICdpZCd9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgaW5zZXJ0Q2hpbGRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCBmZWF0dXJlLCByZWNvcmQsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgZm9ybVZhbHVlIG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5hbGwpIHtcclxuICAgICAgaWYgKGZvcm1WYWx1ZS5pc1JlcGVhdGFibGVFbGVtZW50KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCByZXBlYXRhYmxlSXRlbSBvZiBmb3JtVmFsdWUuX2l0ZW1zKSB7XHJcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRNdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmVTdGF0ZW1lbnRzKGRiLCBmb3JtLCByZXBlYXRhYmxlSXRlbSwgcmVjb3JkLCBvcHRpb25zKSk7XHJcbiAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2guYXBwbHkoc3RhdGVtZW50cywgdGhpcy5pbnNlcnRDaGlsZE11bHRpcGxlVmFsdWVzRm9yRmVhdHVyZVN0YXRlbWVudHMoZGIsIGZvcm0sIHJlcGVhdGFibGVJdGVtLCByZWNvcmQsIG9wdGlvbnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGVtZW50cztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBtdWx0aXBsZVZhbHVlc0ZvckZlYXR1cmUoZmVhdHVyZSwgcmVjb3JkKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGZvcm1WYWx1ZSBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuYWxsKSB7XHJcbiAgICAgIGlmIChmb3JtVmFsdWUuaXNFbXB0eSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmZWF0dXJlVmFsdWVzID0gZm9ybVZhbHVlLm11bHRpcGxlVmFsdWVzO1xyXG5cclxuICAgICAgaWYgKGZlYXR1cmVWYWx1ZXMpIHtcclxuICAgICAgICB2YWx1ZXMucHVzaC5hcHBseSh2YWx1ZXMsIGZlYXR1cmVWYWx1ZXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzeXN0ZW1Db2x1bW5WYWx1ZXNGb3JGZWF0dXJlKGZlYXR1cmUsIHBhcmVudEZlYXR1cmUsIHJlY29yZCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB7fTtcclxuXHJcbiAgICB2YWx1ZXMucmVjb3JkX2lkID0gcmVjb3JkLnJvd0lEO1xyXG4gICAgdmFsdWVzLnJlY29yZF9yZXNvdXJjZV9pZCA9IHJlY29yZC5pZDtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5yZXBvcnRVUkxGb3JtYXR0ZXIpIHtcclxuICAgICAgdmFsdWVzLnJlcG9ydF91cmwgPSBvcHRpb25zLnJlcG9ydFVSTEZvcm1hdHRlcihmZWF0dXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZmVhdHVyZSBpbnN0YW5jZW9mIFJlY29yZCkge1xyXG4gICAgICBpZiAocmVjb3JkLl9wcm9qZWN0Um93SUQpIHtcclxuICAgICAgICB2YWx1ZXMucHJvamVjdF9pZCA9IHJlY29yZC5fcHJvamVjdFJvd0lEO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVjb3JkLnByb2plY3RJRCkge1xyXG4gICAgICAgIHZhbHVlcy5wcm9qZWN0X3Jlc291cmNlX2lkID0gcmVjb3JkLnByb2plY3RJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5fYXNzaWduZWRUb1Jvd0lEKSB7XHJcbiAgICAgICAgdmFsdWVzLmFzc2lnbmVkX3RvX2lkID0gcmVjb3JkLl9hc3NpZ25lZFRvUm93SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQuYXNzaWduZWRUb0lEKSB7XHJcbiAgICAgICAgdmFsdWVzLmFzc2lnbmVkX3RvX3Jlc291cmNlX2lkID0gcmVjb3JkLmFzc2lnbmVkVG9JRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5fY3JlYXRlZEJ5Um93SUQpIHtcclxuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IHJlY29yZC5fY3JlYXRlZEJ5Um93SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQuY3JlYXRlZEJ5SUQpIHtcclxuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC5jcmVhdGVkQnlJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5fdXBkYXRlZEJ5Um93SUQpIHtcclxuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9pZCA9IHJlY29yZC5fdXBkYXRlZEJ5Um93SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQudXBkYXRlZEJ5SUQpIHtcclxuICAgICAgICB2YWx1ZXMudXBkYXRlZF9ieV9yZXNvdXJjZV9pZCA9IHJlY29yZC51cGRhdGVkQnlJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5fY2hhbmdlc2V0Um93SUQpIHtcclxuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X2lkID0gcmVjb3JkLl9jaGFuZ2VzZXRSb3dJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5jaGFuZ2VzZXRJRCkge1xyXG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XHJcbiAgICAgICAgdmFsdWVzLnN0YXR1cyA9IHJlY29yZC5zdGF0dXM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQubGF0aXR1ZGUgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhbHVlcy5sYXRpdHVkZSA9IHJlY29yZC5sYXRpdHVkZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5sb25naXR1ZGUgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhbHVlcy5sb25naXR1ZGUgPSByZWNvcmQubG9uZ2l0dWRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YWx1ZXMuYWx0aXR1ZGUgPSByZWNvcmQuYWx0aXR1ZGU7XHJcbiAgICAgIHZhbHVlcy5zcGVlZCA9IHJlY29yZC5zcGVlZDtcclxuICAgICAgdmFsdWVzLmNvdXJzZSA9IHJlY29yZC5jb3Vyc2U7XHJcbiAgICAgIHZhbHVlcy52ZXJ0aWNhbF9hY2N1cmFjeSA9IHJlY29yZC52ZXJ0aWNhbEFjY3VyYWN5O1xyXG4gICAgICB2YWx1ZXMuaG9yaXpvbnRhbF9hY2N1cmFjeSA9IHJlY29yZC5ob3Jpem9udGFsQWNjdXJhY3k7XHJcbiAgICB9IGVsc2UgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSZXBlYXRhYmxlSXRlbVZhbHVlKSB7XHJcbiAgICAgIHZhbHVlcy5yZXNvdXJjZV9pZCA9IGZlYXR1cmUuaWQ7XHJcbiAgICAgIHZhbHVlcy5pbmRleCA9IGZlYXR1cmUuaW5kZXg7XHJcbiAgICAgIHZhbHVlcy5wYXJlbnRfcmVzb3VyY2VfaWQgPSBwYXJlbnRGZWF0dXJlLmlkO1xyXG5cclxuICAgICAgaWYgKGZlYXR1cmUuaGFzQ29vcmRpbmF0ZSkge1xyXG4gICAgICAgIHZhbHVlcy5sYXRpdHVkZSA9IGZlYXR1cmUubGF0aXR1ZGU7XHJcbiAgICAgICAgdmFsdWVzLmxvbmdpdHVkZSA9IGZlYXR1cmUubG9uZ2l0dWRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyByZWNvcmQgdmFsdWVzXHJcbiAgICAgIGlmIChyZWNvcmQuc3RhdHVzKSB7XHJcbiAgICAgICAgdmFsdWVzLnJlY29yZF9zdGF0dXMgPSByZWNvcmQuc3RhdHVzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVjb3JkLl9wcm9qZWN0Um93SUQpIHtcclxuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfaWQgPSByZWNvcmQuX3Byb2plY3RSb3dJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlY29yZC5wcm9qZWN0SUQpIHtcclxuICAgICAgICB2YWx1ZXMucmVjb3JkX3Byb2plY3RfcmVzb3VyY2VfaWQgPSByZWNvcmQucHJvamVjdElEO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVjb3JkLl9hc3NpZ25lZFRvUm93SUQpIHtcclxuICAgICAgICB2YWx1ZXMucmVjb3JkX2Fzc2lnbmVkX3RvX2lkID0gcmVjb3JkLl9hc3NpZ25lZFRvUm93SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWNvcmQuYXNzaWduZWRUb0lEKSB7XHJcbiAgICAgICAgdmFsdWVzLnJlY29yZF9hc3NpZ25lZF90b19yZXNvdXJjZV9pZCA9IHJlY29yZC5hc3NpZ25lZFRvSUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGxpbmtlZCBmaWVsZHNcclxuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5KSB7XHJcbiAgICAgICAgdmFsdWVzLmNyZWF0ZWRfYnlfaWQgPSBmZWF0dXJlLmNyZWF0ZWRCeS5yb3dJRDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZlYXR1cmUuY3JlYXRlZEJ5SUQpIHtcclxuICAgICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY3JlYXRlZEJ5SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeSkge1xyXG4gICAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gZmVhdHVyZS51cGRhdGVkQnkucm93SUQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChmZWF0dXJlLnVwZGF0ZWRCeUlEKSB7XHJcbiAgICAgICAgdmFsdWVzLnVwZGF0ZWRfYnlfcmVzb3VyY2VfaWQgPSBmZWF0dXJlLnVwZGF0ZWRCeUlEO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZmVhdHVyZS5jaGFuZ2VzZXQpIHtcclxuICAgICAgICB2YWx1ZXMuY2hhbmdlc2V0X2lkID0gZmVhdHVyZS5jaGFuZ2VzZXQucm93SUQ7XHJcbiAgICAgICAgdmFsdWVzLmNoYW5nZXNldF9yZXNvdXJjZV9pZCA9IGZlYXR1cmUuY2hhbmdlc2V0SUQ7XHJcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLl9jaGFuZ2VzZXRSb3dJRCkge1xyXG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfaWQgPSByZWNvcmQuX2NoYW5nZXNldFJvd0lEO1xyXG4gICAgICAgIHZhbHVlcy5jaGFuZ2VzZXRfcmVzb3VyY2VfaWQgPSByZWNvcmQuY2hhbmdlc2V0SUQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YWx1ZXMudGl0bGUgPSBmZWF0dXJlLmRpc3BsYXlWYWx1ZTtcclxuXHJcbiAgICB2YWx1ZXMuZm9ybV92YWx1ZXMgPSBKU09OLnN0cmluZ2lmeShmZWF0dXJlLmZvcm1WYWx1ZXMudG9KU09OKCkpO1xyXG5cclxuICAgIHRoaXMuc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlKTtcclxuXHJcbiAgICBpZiAoZmVhdHVyZS5oYXNDb29yZGluYXRlKSB7XHJcbiAgICAgIHZhbHVlcy5nZW9tZXRyeSA9IHRoaXMuc2V0dXBQb2ludCh2YWx1ZXMsIGZlYXR1cmUubGF0aXR1ZGUsIGZlYXR1cmUubG9uZ2l0dWRlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbHVlcy5nZW9tZXRyeSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWVzLmNyZWF0ZWRfYXQgPSBmZWF0dXJlLmNsaWVudENyZWF0ZWRBdCB8fCBmZWF0dXJlLmNyZWF0ZWRBdDtcclxuICAgIHZhbHVlcy51cGRhdGVkX2F0ID0gZmVhdHVyZS5jbGllbnRVcGRhdGVkQXQgfHwgZmVhdHVyZS51cGRhdGVkQXQ7XHJcbiAgICB2YWx1ZXMudmVyc2lvbiA9IGZlYXR1cmUudmVyc2lvbjtcclxuXHJcbiAgICBpZiAodmFsdWVzLmNyZWF0ZWRfYnlfaWQgPT0gbnVsbCkge1xyXG4gICAgICB2YWx1ZXMuY3JlYXRlZF9ieV9pZCA9IC0xO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWx1ZXMudXBkYXRlZF9ieV9pZCA9PSBudWxsKSB7XHJcbiAgICAgIHZhbHVlcy51cGRhdGVkX2J5X2lkID0gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWVzLnNlcnZlcl9jcmVhdGVkX2F0ID0gZmVhdHVyZS5jcmVhdGVkQXQ7XHJcbiAgICB2YWx1ZXMuc2VydmVyX3VwZGF0ZWRfYXQgPSBmZWF0dXJlLnVwZGF0ZWRBdDtcclxuXHJcbiAgICB2YWx1ZXMuY3JlYXRlZF9kdXJhdGlvbiA9IGZlYXR1cmUuY3JlYXRlZER1cmF0aW9uO1xyXG4gICAgdmFsdWVzLnVwZGF0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLnVwZGF0ZWREdXJhdGlvbjtcclxuICAgIHZhbHVlcy5lZGl0ZWRfZHVyYXRpb24gPSBmZWF0dXJlLmVkaXRlZER1cmF0aW9uO1xyXG5cclxuICAgIHZhbHVlcy5jcmVhdGVkX2xhdGl0dWRlID0gZmVhdHVyZS5jcmVhdGVkTGF0aXR1ZGU7XHJcbiAgICB2YWx1ZXMuY3JlYXRlZF9sb25naXR1ZGUgPSBmZWF0dXJlLmNyZWF0ZWRMb25naXR1ZGU7XHJcbiAgICB2YWx1ZXMuY3JlYXRlZF9hbHRpdHVkZSA9IGZlYXR1cmUuY3JlYXRlZEFsdGl0dWRlO1xyXG4gICAgdmFsdWVzLmNyZWF0ZWRfaG9yaXpvbnRhbF9hY2N1cmFjeSA9IGZlYXR1cmUuY3JlYXRlZEFjY3VyYWN5O1xyXG5cclxuICAgIGlmIChmZWF0dXJlLmhhc0NyZWF0ZWRDb29yZGluYXRlKSB7XHJcbiAgICAgIHZhbHVlcy5jcmVhdGVkX2dlb21ldHJ5ID0gdGhpcy5zZXR1cFBvaW50KHZhbHVlcywgZmVhdHVyZS5jcmVhdGVkTGF0aXR1ZGUsIGZlYXR1cmUuY3JlYXRlZExvbmdpdHVkZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWVzLnVwZGF0ZWRfbGF0aXR1ZGUgPSBmZWF0dXJlLnVwZGF0ZWRMYXRpdHVkZTtcclxuICAgIHZhbHVlcy51cGRhdGVkX2xvbmdpdHVkZSA9IGZlYXR1cmUudXBkYXRlZExvbmdpdHVkZTtcclxuICAgIHZhbHVlcy51cGRhdGVkX2FsdGl0dWRlID0gZmVhdHVyZS51cGRhdGVkQWx0aXR1ZGU7XHJcbiAgICB2YWx1ZXMudXBkYXRlZF9ob3Jpem9udGFsX2FjY3VyYWN5ID0gZmVhdHVyZS51cGRhdGVkQWNjdXJhY3k7XHJcblxyXG4gICAgaWYgKGZlYXR1cmUuaGFzVXBkYXRlZENvb3JkaW5hdGUpIHtcclxuICAgICAgdmFsdWVzLnVwZGF0ZWRfZ2VvbWV0cnkgPSB0aGlzLnNldHVwUG9pbnQodmFsdWVzLCBmZWF0dXJlLnVwZGF0ZWRMYXRpdHVkZSwgZmVhdHVyZS51cGRhdGVkTG9uZ2l0dWRlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSB7XHJcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge3JlY29yZF9yZXNvdXJjZV9pZDogcmVjb3JkLmlkfSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZGVsZXRlUm93c1N0YXRlbWVudChkYiwgdGFibGVOYW1lKSB7XHJcbiAgICByZXR1cm4gZGIuZGVsZXRlU3RhdGVtZW50KHRhYmxlTmFtZSwge30pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRlbGV0ZUZvclJlY29yZFN0YXRlbWVudHMoZGIsIHJlY29yZCwgZm9ybSwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgcmVwZWF0YWJsZXMgPSBmb3JtLmVsZW1lbnRzT2ZUeXBlKCdSZXBlYXRhYmxlJyk7XHJcblxyXG4gICAgY29uc3Qgc3RhdGVtZW50cyA9IFtdO1xyXG5cclxuICAgIGxldCB0YWJsZU5hbWUgPSB0aGlzLnRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG51bGwsIG9wdGlvbnMpO1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XHJcblxyXG4gICAgZm9yIChjb25zdCByZXBlYXRhYmxlIG9mIHJlcGVhdGFibGVzKSB7XHJcbiAgICAgIHRhYmxlTmFtZSA9IHRoaXMudGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzRm9yUmVjb3JkU3RhdGVtZW50KGRiLCByZWNvcmQsIHRhYmxlTmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG9wdGlvbnMpO1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NGb3JSZWNvcmRTdGF0ZW1lbnQoZGIsIHJlY29yZCwgdGFibGVOYW1lKSk7XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlbWVudHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZGVsZXRlRm9yRm9ybVN0YXRlbWVudHMoZGIsIGZvcm0sIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHJlcGVhdGFibGVzID0gZm9ybS5lbGVtZW50c09mVHlwZSgnUmVwZWF0YWJsZScpO1xyXG5cclxuICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcclxuXHJcbiAgICBsZXQgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCBudWxsLCBvcHRpb25zKTtcclxuXHJcbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5kZWxldGVSb3dzU3RhdGVtZW50KGRiLCB0YWJsZU5hbWUpKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IHJlcGVhdGFibGUgb2YgcmVwZWF0YWJsZXMpIHtcclxuICAgICAgdGFibGVOYW1lID0gdGhpcy50YWJsZU5hbWVXaXRoRm9ybShmb3JtLCByZXBlYXRhYmxlLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRhYmxlTmFtZSA9IHRoaXMubXVsdGlwbGVWYWx1ZVRhYmxlTmFtZVdpdGhGb3JtKGZvcm0sIG9wdGlvbnMpO1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLmRlbGV0ZVJvd3NTdGF0ZW1lbnQoZGIsIHRhYmxlTmFtZSkpO1xyXG5cclxuICAgIHJldHVybiBzdGF0ZW1lbnRzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIG11bHRpcGxlVmFsdWVUYWJsZU5hbWVXaXRoRm9ybShmb3JtLCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBwcmVmaXggPSBvcHRpb25zICYmIG9wdGlvbnMuc2NoZW1hID8gb3B0aW9ucy5zY2hlbWEgKyAnLicgOiAnJztcclxuXHJcbiAgICByZXR1cm4gZm9ybWF0KCclc2FjY291bnRfJXNfZm9ybV8lc192YWx1ZXMnLCBwcmVmaXgsIGZvcm0uX2FjY291bnRSb3dJRCwgZm9ybS5yb3dJRCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgdGFibGVOYW1lV2l0aEZvcm0oZm9ybSwgcmVwZWF0YWJsZSwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgcHJlZml4ID0gb3B0aW9ucyAmJiBvcHRpb25zLnNjaGVtYSA/IG9wdGlvbnMuc2NoZW1hICsgJy4nIDogJyc7XHJcblxyXG4gICAgaWYgKHJlcGVhdGFibGUgPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gZm9ybWF0KCclc2FjY291bnRfJXNfZm9ybV8lcycsIHByZWZpeCwgZm9ybS5fYWNjb3VudFJvd0lELCBmb3JtLnJvd0lEKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZm9ybWF0KCclc2FjY291bnRfJXNfZm9ybV8lc18lcycsIHByZWZpeCwgZm9ybS5fYWNjb3VudFJvd0lELCBmb3JtLnJvd0lELCByZXBlYXRhYmxlLmtleSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2V0dXBTZWFyY2godmFsdWVzLCBmZWF0dXJlKSB7XHJcbiAgICBjb25zdCBzZWFyY2hhYmxlVmFsdWUgPSBmZWF0dXJlLnNlYXJjaGFibGVWYWx1ZTtcclxuXHJcbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4X3RleHQgPSBzZWFyY2hhYmxlVmFsdWU7XHJcbiAgICB2YWx1ZXMucmVjb3JkX2luZGV4ID0ge3JhdzogYHRvX3RzdmVjdG9yKCR7IHBnZm9ybWF0KCclTCcsIHNlYXJjaGFibGVWYWx1ZSkgfSlgfTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNldHVwUG9pbnQodmFsdWVzLCBsYXRpdHVkZSwgbG9uZ2l0dWRlKSB7XHJcbiAgICBjb25zdCB3a3QgPSBwZ2Zvcm1hdCgnUE9JTlQoJXMgJXMpJywgbG9uZ2l0dWRlLCBsYXRpdHVkZSk7XHJcblxyXG4gICAgcmV0dXJuIHtyYXc6IGBTVF9Gb3JjZTJEKFNUX1NldFNSSUQoU1RfR2VvbUZyb21UZXh0KCckeyB3a3QgfScpLCA0MzI2KSlgfTtcclxuICB9XHJcbn1cclxuIl19