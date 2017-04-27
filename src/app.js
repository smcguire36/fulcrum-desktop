import glob from 'glob';
import path from 'path';
import yargs from 'yargs';
import mkdirp from 'mkdirp';
import os from 'os';
import database from './db/database';
import api from './api';

import Account from './models/account';

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

    // TODO(zhm) this needs to be adjusted for Windows and Linux
    this._rootDirectory = path.join(os.homedir(), 'Documents', 'fulcrum-sync');

    this.mkdirp('data');
    this.mkdirp('plugins');
    this.mkdirp('media');
    this.mkdirp('reports');
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

  dir(dir) {
    return path.join(this._rootDirectory, dir);
  }

  mkdirp(name) {
    mkdirp.sync(this.dir(name));
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
    // process.env.NODE_PATH = __dirname;
    // require('module').Module._initPaths();
    // console.log(process.env.NODE_PATH);

    const file = path.join(this.dir('data'), 'fulcrum.db');

    this._db = await database({file});

    await this.initializePlugins();
  }

  async dispose() {
    for (const plugin of this._plugins) {
      if (plugin.dispose) {
        await plugin.dispose();
      }
    }

    await this._db.close();
  }

  async runTask(command) {
    const name = command.args._[1];

    const plugin = this._pluginsByName[name];

    if (plugin && plugin.runTask) {
      await plugin.runTask({app: this, yargs});
    } else {
      console.error('Plugin named', name, 'not found');
    }
  }

  async initializePlugins() {
    const pluginPaths = glob.sync(path.join(this.dir('plugins'), '*', 'plugin.js'));

    for (const pluginPath of pluginPaths) {
      const fullPath = path.resolve(pluginPath);

      const PluginClass = require(fullPath).default;

      const plugin = new PluginClass({db: this.db, app: this});

      const nameParts = path.dirname(fullPath).split(path.sep);
      const name = nameParts[nameParts.length - 1].replace(/^fulcrum-sync-/, '');

      this._pluginsByName[name] = plugin;
      this._plugins.push(plugin);

      if (this.args.debug) {
        console.error('Loading plugin', fullPath);
      }

      plugin.app = this;

      await plugin.initialize({app: this});
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
}

app = new App();

export default app;
