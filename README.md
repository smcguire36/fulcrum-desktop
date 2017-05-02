![Fulcrum](http://www.fulcrumapp.com/assets/img/fulcrum-logo.svg)

## Fulcrum Desktop

[![Build Status](https://travis-ci.org/fulcrumapp/fulcrum-desktop.svg?branch=master)](https://travis-ci.org/fulcrumapp/fulcrum-desktop)
[![Build Status](https://ci.appveyor.com/api/projects/status/orvg142ommlitw7v?svg=true)](https://ci.appveyor.com/project/zhm/fulcrum-desktop)

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

### Installation

#### macOS

Install the .dmg, drag to `Applications`

#### Windows

Install from the setup .exe and follow instructions

#### Linux

```sh
wget https://github.com/fulcrumapp/fulcrum-desktop/releases/download/v0.0.22/fulcrum-desktop_0.0.22_amd64.deb -O fulcrum-desktop.deb
sudo apt-get update
sudo dpkg -i fulcrum-desktop.deb # it will complain about missing dependencies, the next command will fix it up
sudo apt-get install -f
```

### Development

* Latest Node.js
* Yarn

```sh
git clone git@github.com:fulcrumapp/fulcrum-desktop.git
cd fulcrum-desktop
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
./run create-plugin --name my-plugin
```

To install a plugin:

```sh
./run install-plugin --git https://github.com/fulcrumapp/fulcrum-desktop-reports

./run install-plugin --git https://github.com/fulcrumapp/fulcrum-desktop-postgres

./run install-plugin --git https://github.com/fulcrumapp/fulcrum-desktop-s3-upload
```
