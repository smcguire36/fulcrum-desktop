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

* Not sure, but probably Node 5+

### Install

```sh
git clone git@github.com:fulcrumapp/fulcrum-sync.git
cd fulcrum-sync
npm install
```

### Setup

```sh
# authenticate your account
./run setup
```

### Sync

```sh
# sync a specific account
./run sync 'Fulcrum Labs'

# sync a specific account and form
./run sync 'Fulcrum Labs' 'GeoFood'

# sync all accounts
./run sync
```

### Media

The app currently syncs media to `$HOME/fulcrum-media`. One day the media location will be configurable.
