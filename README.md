![Fulcrum](https://d2ppvlu71ri8gs.cloudfront.net/items/322R2o0M300C043H1Y0u/fulcrum-desktop.png)

## Fulcrum Desktop :construction:

[![Build Status](https://travis-ci.org/fulcrumapp/fulcrum-desktop.svg?branch=master)](https://travis-ci.org/fulcrumapp/fulcrum-desktop)
[![Build Status](https://ci.appveyor.com/api/projects/status/orvg142ommlitw7v?svg=true)](https://ci.appveyor.com/project/zhm/fulcrum-desktop)

Sync Fulcrum data to a local database. The local database is a complete API representation with search indexes and
query tables. It also supports downloading all media files locally. It's intended to be the foundation for local/disconnected data synchronization and reporting.

### Documentation

* [Get Started](/docs/guides/installation.md)
* [Documentation](/docs)

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
