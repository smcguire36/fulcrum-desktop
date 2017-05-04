import glob from 'glob';
import path from 'path';
import yargs from 'yargs';
import mkdirp from 'mkdirp';
import os from 'os';
import database from './db/database';
import api from './api';
import Environment from './environment';
import Account from './models/account';
import LocalDatabaseDataSource from './local-database-data-source';
import { DataSource } from 'fulcrum-core';
import paths from '../application-paths';
import pluginLogger from './plugin-logger';

let app = null;

class App {
  static get instance() {
    return app;
  }

  constructor() {
    this._plugins = [];
    this._pluginsByName = [];
    this._listeners = {};
    this._api = api;

    this._appDirectory = paths.userData;
    this._dotDirectory = path.join(os.homedir(), '.fulcrum');

    mkdirp.sync(this._appDirectory);
    mkdirp.sync(this._dotDirectory);

    mkdirp.sync(path.join(this._appDirectory, 'data'));
    mkdirp.sync(path.join(this._dotDirectory, 'plugins'));

    this._environment = new Environment({app: this});
  }

  get environment() {
    return this._environment;
  }

  get api() {
    return this._api;
  }

  get yargs() {
    return yargs;
  }

  get args() {
    return this.yargs.argv;
  }

  appDir(dir) {
    return path.join(this._appDirectory, dir);
  }

  dir(dir) {
    return path.join(this._dotDirectory, dir);
  }

  mkdirp(name) {
    mkdirp.sync(this.dir(name));
  }

  get databaseFilePath() {
    return path.join(this.appDir('data'), 'fulcrum.db');
  }

  get db() {
    return this._db;
  }

  on(name, func) {
    if (!this._listeners[name]) {
      this._listeners[name] = [];
    }

    this._listeners[name].push(func);
  }

  off(name, func) {
    if (this._listeners[name]) {
      const index = this._listeners.indexOf(func);

      if (index > -1) {
        this._listeners.splice(index, 1);
      }
    }
  }

  async emit(name, ...args) {
    if (this._listeners[name]) {
      for (const listener of this._listeners[name]) {
        await listener(...args);
      }
    }
  }

  async initialize() {
    this._db = await database({file: this.databaseFilePath});

    if (!this.args.safe) {
      await this.initializePlugins();
    }
  }

  async dispose() {
    for (const plugin of this._plugins) {
      if (plugin.deactivate) {
        await plugin.deactivate();
      }
    }

    if (this._db) {
      await this._db.close();
    }
  }

  async initializePlugins() {
    const pluginPaths = glob.sync(path.join(this.dir('plugins'), '*'));

    for (const pluginPath of pluginPaths) {
      const fullPath = path.resolve(pluginPath);

      const logger = pluginLogger(pluginPath);

      try {
        const pluginModule = require(fullPath);

        const PluginClass = pluginModule.default || pluginModule;

        const plugin = new PluginClass();

        const nameParts = path.dirname(fullPath).split(path.sep);
        const name = nameParts[nameParts.length - 1].replace(/^fulcrum-desktop-/, '');

        this._pluginsByName[name] = plugin;
        this._plugins.push(plugin);

        if (this.args.debug) {
          logger.error('Loading plugin', fullPath);
        }
      } catch (ex) {
        logger.error('Failed to load plugin', ex);
        logger.error('This is most likely an error in the plugin.');
      }
    }
  }

  async activatePlugins() {
    for (const plugin of this._plugins) {
      await plugin.activate();
    }
  }

  async fetchAccount(name) {
    const where = {};

    if (name) {
      where.organization_name = name;
    }

    const accounts = await Account.findAll(this.db, where);

    return accounts[0];
  }

  async createDataSource(account) {
    let dataSource = new DataSource();

    const localDatabase = new LocalDatabaseDataSource(account);

    dataSource.add(localDatabase);

    await localDatabase.load(this.db);

    return dataSource;
  }
}

app = new App();

Environment.app = app;

global.__app__ = app;
global.__api__ = api;
global.fulcrum = app.environment;

export default app;
