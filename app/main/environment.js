"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class Environment {
  constructor() {}

  get args() {
    return Environment.app.yargs.argv;
  }

  get yargs() {
    return Environment.app.yargs;
  }

  dir(dir) {
    return Environment.app.dir(dir);
  }

  mkdirp(name) {
    return Environment.app.mkdirp(name);
  }

  get db() {
    return Environment.app._db;
  }

  on(name, func) {
    return Environment.app.on(name, func);
  }

  off(name, func) {
    return Environment.app.off(name, func);
  }

  fetchAccount(name) {
    return Environment.app.fetchAccount(name);
  }
}
exports.default = Environment;
//# sourceMappingURL=environment.js.map