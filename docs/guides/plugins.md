# Plugins

Plugins are extensions to the Fulcrum Desktop application. Each plugin performs a little piece
of functionality to a specific task.

## Available Plugins

* [GeoPackage](https://github.com/fulcrumapp/fulcrum-desktop-geopackage)
* [S3](https://github.com/fulcrumapp/fulcrum-desktop-s3)
* [Reports](https://github.com/fulcrumapp/fulcrum-desktop-reports)
* [PostgreSQL](https://github.com/fulcrumapp/fulcrum-desktop-postgres)

To install or use plugins, you will first need a basic development environment. The development
environment consists of Git, Nodejs and Yarn. Eventually it will not be necessary to install these
to *use* plugins and it will only be required if you want to make changes to the plugins.

## macOS

* `brew install node yarn`

## Linux

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -

echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

sudo apt-get update

sudo apt-get install -y git make build-essential nodejs yarn
```

## Windows
* [Install Git](https://git-scm.com/downloads)
* [Install Nodejs](https://nodejs.org/en/download/current/)
* [Install Yarn](https://yarnpkg.com/en/docs/install)

Once you have these installed, you can now install Fulcrum Desktop Plugins.

```sh
fulcrum install-plugin --url https://github.com/fulcrumapp/fulcrum-desktop-geopackage
```

Once you've installed the plugin, it will now be accessible to use from the `fulcrum` command.

```sh
fulcrum --help
```
