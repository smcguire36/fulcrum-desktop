## Fulcrum Sync

Sync Fulcrum data to a local database. The local database is a complete API representation with search indexes and
query tables. It also supports downloading all media files locally. It's intended to be the foundation for local/disconnected data synchronization and reporting.

Goals:

* Complete copy of Fulcrum data, _all the way down_, retaining enough information to perform all operations
* Implement a full synchronizer (read+write, download+upload)
* Synchronize all media files
* Be a point of extensibility for further integrations with external databases

Pie in the Sky:

* Replacement for the Fulcrum Exporter (e.g. a command to create XLSX, GeoJSON, etc from the local db)
* Replacement for the Fulcrum Importer (e.g. a set of tools to stage data into the local db)
* Run PDF reports
* Have a UI (possibly another separate application driven from the data)

This is very very very alpha at the moment.

### Requirements

* Latest Node.js
* Yarn

### Install

```sh
git clone git@github.com:fulcrumapp/fulcrum-sync.git
cd fulcrum-sync
yarn
```

### Setup

```sh
./run setup # follow login instructions

./run sync --org 'Fulcrum Labs'
```

### Postgres Build

```sh
# first, sync the local database

# run this once, it sets up the postgres database
./setup-postgres.sh

# run this to fully rebuild the postgres tables from the SQLite database
./run task postgres --org 'Fulcrum Labs'
```

### Plugins

To create a new plugin:

```sh
./run new-plugin --name my-plugin
```

To install a plugin:

```sh
./run install-plugin --git https://github.com/fulcrumapp/fulcrum-sync-reports

./run install-plugin --git https://github.com/fulcrumapp/fulcrum-sync-postgres

./run install-plugin --git https://github.com/fulcrumapp/fulcrum-sync-s3-upload
```
