import * as core from 'fulcrum-core';
import ReportGenerator from './reports/generator';
import RecordValues from './models/record-values/record-values';
import SQLiteRecordValues from './models/record-values/sqlite-record-values';
import PostgresRecordValues from './models/record-values/postgres-record-values';
import { Postgres, SQLite, PersistentObject } from 'minidb';
import Client from './api/client';

const api = {
  core: core,
  ReportGenerator,
  RecordValues,
  SQLiteRecordValues,
  PostgresRecordValues,
  Postgres,
  SQLite,
  PersistentObject,
  Client
};

export default api;
