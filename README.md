## Fulcrum Sync

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

# sync all accounts
./run sync
```

### Media

The app currently syncs media to `$HOME/fulcrum-media`. One day the media location will be configurable.
