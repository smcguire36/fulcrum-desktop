// import EventEmitter from 'events';
import glob from 'glob';
import path from 'path';
import yargs from 'yargs';

let app = null;

class App {
  static get instance() {
    return app;
  }

  constructor() {
    this._plugins = [];
    this._pluginsByName = [];
    this._listeners = {};
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

  async initialize({db}) {
    await this.initializePlugins({db});
  }

  async dispose({db}) {
    for (const plugin of this._plugins) {
      if (plugin.dispose) {
        await plugin.dispose();
      }
    }
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

  async initializePlugins({db}) {
    const pluginPaths = glob.sync(path.join('.', 'plugins', '*', 'plugin.js'));

    for (const pluginPath of pluginPaths) {
      const fullPath = path.resolve(pluginPath);

      const PluginClass = require(fullPath).default;

      const plugin = new PluginClass({db});

      const nameParts = path.dirname(fullPath).split(path.sep);
      const name = nameParts[nameParts.length - 1];

      this._pluginsByName[name] = plugin;
      this._plugins.push(plugin);

      console.log('Loading plugin', fullPath);

      await plugin.initialize({app: this});
    }
  }

  // emit(name, ...args) {
  //   this.emit(name, {app: this, ...args[0]});
  // }
}

app = new App();

export default app;
