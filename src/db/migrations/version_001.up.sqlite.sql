--SELECT InitSpatialMetaData();

CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_resource_id TEXT,
  organization_resource_id TEXT,
  organization_name TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  description TEXT,
  token TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_accounts_user_organization
ON accounts (user_resource_id ASC, organization_resource_id ASC);

CREATE TABLE IF NOT EXISTS sync_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource TEXT NOT NULL,
  scope TEXT,
  hash TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_sync_state_account_resource_scope
ON sync_state (account_id ASC, resource ASC, COALESCE(scope, '') ASC);

CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  form_values TEXT,
  client_created_at INTEGER,
  client_updated_at INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  status TEXT,
  form_id INTEGER,
  project_id INTEGER,
  version INTEGER,
  has_changes INTEGER,
  index_text TEXT
);

CREATE UNIQUE INDEX idx_records_account_resource_id
ON records (account_id, resource_id);

CREATE VIRTUAL TABLE records_index USING fts4(content='records', index_text, form_id, prefix="1,2,3");

CREATE TRIGGER records_before_update BEFORE UPDATE ON records BEGIN
  DELETE FROM records_index WHERE docid=old.rowid;
END;

CREATE TRIGGER records_before_delete BEFORE DELETE ON records BEGIN
  DELETE FROM records_index WHERE docid=old.rowid;
END;

CREATE TRIGGER records_after_update AFTER UPDATE ON records BEGIN
  INSERT INTO records_index (docid, index_text, form_id) VALUES (new.rowid, new.index_text, new.form_id);
END;

CREATE TRIGGER records_after_insert AFTER INSERT ON records BEGIN
  INSERT INTO records_index (docid, index_text, form_id) VALUES (new.rowid, new.index_text, new.form_id);
END;

-- SELECT AddGeometryColumn('records', 'geometry', 4326, 'GEOMETRY');

-- SELECT CreateSpatialIndex('records', 'geometry');

CREATE TABLE IF NOT EXISTS memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  organization_id INTEGER NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_memberships_user_organization
ON memberships (account_id, user_id, organization_id);

CREATE TABLE IF NOT EXISTS choice_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  choices TEXT,
  name TEXT,
  description TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_choice_lists_account_resource_id
ON choice_lists (account_id, resource_id);

CREATE TABLE IF NOT EXISTS classification_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  items TEXT,
  name TEXT,
  description TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_classification_sets_account_resource_id
ON classification_sets (account_id, resource_id);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  name TEXT,
  description TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX idx_projects_account_resource_id
ON projects (account_id, resource_id);

CREATE TABLE IF NOT EXISTS forms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  name TEXT,
  description TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  title_field_keys TEXT,
  status_field TEXT,
  elements TEXT,
  last_sync INTEGER,
  deleted_at INTEGER
);

CREATE UNIQUE INDEX idx_forms_account_resource_id
ON forms (account_id, resource_id);

CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  exif TEXT,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_photos_account_resource_id
ON photos (account_id, resource_id);

CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  resource_id TEXT NOT NULL,
  file_path TEXT,
  metadata TEXT,
  is_downloaded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE UNIQUE INDEX idx_videos_account_resource_id
ON videos (account_id, resource_id);



/* CREATE TABLE IF NOT EXISTS "tables" ( */
/*   name text, */
/*   alias text, */
/*   type text, */
/*   parent text, */
/*   form_id text, */
/*   field text, */
/*   field_type text, */
/*   data_name text */
/* ); */

/* CREATE VIEW IF NOT EXISTS "tables_view" AS */
/* SELECT alias AS name, type, parent, form_id, field, field_type, data_name FROM "tables"; */

/* CREATE INDEX idx_tables_name ON "tables" (name); */

/* CREATE INDEX idx_tables_alias ON "tables" (alias); */

/* CREATE TABLE IF NOT EXISTS "columns" ( */
/*   table_name text, */
/*   table_alias text, */
/*   name text, */
/*   ordinal INTEGER, */
/*   type text, */
/*   nullable INTEGER, */
/*   form_id text, */
/*   field text, */
/*   field_type text, */
/*   data_name text, */
/*   part text, */
/*   data text */
/* ); */

/* CREATE VIEW IF NOT EXISTS "columns_view" AS */
/* SELECT table_alias AS table_name, name, ordinal, type, nullable, form_id, field, field_type, data_name, part FROM "columns"; */

/* CREATE INDEX idx_columns_table_name ON "columns" (table_name); */

/* CREATE INDEX idx_columns_table_alias ON "columns" (table_alias); */
