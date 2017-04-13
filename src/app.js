import EventEmitter from 'events';
import glob from 'glob';
import path from 'path';

let app = null;

class App extends EventEmitter {
  static get instance() {
    return app;
  }

  constructor() {
    super();

    this._plugins = [];
  }

  async initialize() {
    await this.initializePlugins();
  }

  async initializePlugins() {
    const pluginPaths = glob.sync(path.join('.', 'plugins', '*.js'));

    for (const pluginPath of pluginPaths) {
      const fullPath = path.resolve(pluginPath);

      console.log('Loading plugin', fullPath);

      const PluginClass = require(fullPath).default;

      const plugin = new PluginClass();

      await plugin.initialize({app: this});

      this._plugins.push(plugin);
    }
  }

  // emit(name, ...args) {
  //   this.emit(name, {app: this, ...args[0]});
  // }
}

app = new App();

export default app;
