import EventEmitter from 'events';
import glob from 'glob';
import path from 'path';

let app = null;

class App {
  static get instance() {
    return app;
  }

  constructor() {
    this._plugins = [];
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

  async initialize() {
    await this.initializePlugins();
  }

  async initializePlugins() {
    const pluginPaths = glob.sync(path.join('.', 'plugins', '*', 'plugin.js'));

    for (const pluginPath of pluginPaths) {
      const fullPath = path.resolve(pluginPath);

      const PluginClass = require(fullPath).default;

      const plugin = new PluginClass();

      if (plugin.enabled) {
        console.log('Loading plugin', fullPath);

        await plugin.initialize({app: this});

        this._plugins.push(plugin);
      }
    }
  }

  // emit(name, ...args) {
  //   this.emit(name, {app: this, ...args[0]});
  // }
}

app = new App();

export default app;
