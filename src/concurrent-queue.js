import {queue} from 'async';

const DEFAULT_CONCURRENCY = 5;

export default class ConcurrentQueue {
  constructor(worker, concurrency) {
    this.worker = worker;

    this.queue = queue((task, callback) => {
      this.worker(task).then(() => callback()).catch(err => callback(err));
    }, concurrency || DEFAULT_CONCURRENCY);

    this.queue.drain = () => {
      if (this.drainResolver) {
        this.drainResolver();
        this.drainResolver = null;
      }
    };
  }

  push(task, handler) {
    this.finished = false;
    this.queue.push(task, handler);
  }

  drain() {
    return new Promise((resolve, reject) => {
      if (this.queue.length() === 0) {
        resolve();
      } else {
        this.drainResolver = resolve;
      }
    });
  }
}
