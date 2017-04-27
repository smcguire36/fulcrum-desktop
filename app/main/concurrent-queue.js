'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _async = require('async');

const DEFAULT_CONCURRENCY = 5;

class ConcurrentQueue {
  constructor(worker, concurrency) {
    this.worker = worker;

    this.queue = (0, _async.queue)((task, callback) => {
      this.worker(task).then(callback).catch(callback);
    }, concurrency || DEFAULT_CONCURRENCY);

    this.queue.drain = () => {
      if (this.drainResolver) {
        this.drainResolver();
        this.drainResolver = null;
      }
    };
  }

  push(task, handler) {
    this.queue.push(task, handler);
  }

  drain() {
    return new Promise((resolve, reject) => {
      if (this.queue.idle()) {
        resolve();
      } else {
        this.drainResolver = resolve;
      }
    });
  }
}
exports.default = ConcurrentQueue;
//# sourceMappingURL=concurrent-queue.js.map