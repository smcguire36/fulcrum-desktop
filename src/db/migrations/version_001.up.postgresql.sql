--SELECT InitSpatialMetaData();

CREATE TABLE IF NOT EXISTS accounts (
  id bigserial NOT NULL,
  user_resource_id TEXT,
  organization_resource_id TEXT,
  organization_name TEXT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  description TEXT,
  token TEXT,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_accounts_user_organization
ON accounts (user_resource_id ASC, organization_resource_id ASC);

CREATE TABLE IF NOT EXISTS records (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36),
  form_values TEXT,
  client_created_at timestamp without time zone,
  client_updated_at timestamp without time zone,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  status TEXT,
  form_id bigint,
  project_id bigint,
  version bigint,
  has_changes boolean,
  index_text TEXT,
  CONSTRAINT records_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_records_account_resource_id
ON records (account_id, resource_id);

-- SELECT AddGeometryColumn('records', 'geometry', 4326, 'GEOMETRY');

-- SELECT CreateSpatialIndex('records', 'geometry');

CREATE TABLE IF NOT EXISTS memberships (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  user_id bigint NOT NULL,
  organization_id bigint NOT NULL,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT memberships_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_memberships_user_organization
ON memberships (account_id, user_id, organization_id);

CREATE TABLE IF NOT EXISTS choice_lists (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  choices TEXT,
  name TEXT,
  description TEXT,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT choice_lists_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_choice_lists_account_resource_id
ON choice_lists (account_id, resource_id);

CREATE TABLE IF NOT EXISTS classification_sets (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  items TEXT,
  name TEXT,
  description TEXT,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT classification_sets_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_classification_sets_account_resource_id
ON classification_sets (account_id, resource_id);

CREATE TABLE IF NOT EXISTS projects (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  name TEXT,
  description TEXT,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_projects_account_resource_id
ON projects (account_id, resource_id);

CREATE TABLE IF NOT EXISTS forms (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  name TEXT,
  description TEXT,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  title_field_keys TEXT,
  status_field TEXT,
  elements TEXT,
  CONSTRAINT forms_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_forms_account_resource_id
ON forms (account_id, resource_id);

CREATE TABLE IF NOT EXISTS photos (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  file_path TEXT,
  exif TEXT,
  is_downloaded boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT photos_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_photos_account_resource_id
ON photos (account_id, resource_id);

CREATE TABLE IF NOT EXISTS videos (
  id bigserial NOT NULL,
  account_id bigint NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  file_path TEXT,
  metadata TEXT,
  is_downloaded boolean NOT NULL DEFAULT false,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  CONSTRAINT videos_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX idx_videos_account_resource_id
ON videos (account_id, resource_id);
