import RecordValues from './record-values';
import pgformat from 'pg-format';

export default class PostgresRecordValues extends RecordValues {
  static setupSearch(values, feature) {
    const searchableValue = feature.searchableValue;

    values.record_index_text = searchableValue;
    values.record_index = {raw: `to_tsvector(${ pgformat('%L', searchableValue) })`};

    return values;
  }

  static setupPoint(values, latitude, longitude) {
    const wkt = pgformat('POINT(%s %s)', longitude, latitude);

    return {raw: `ST_Force2D(ST_SetSRID(ST_GeomFromText('${ wkt }'), 4326))`};
  }
}
