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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tYWluL2NvbmN1cnJlbnQtcXVldWUuanMiXSwibmFtZXMiOlsiREVGQVVMVF9DT05DVVJSRU5DWSIsIkNvbmN1cnJlbnRRdWV1ZSIsImNvbnN0cnVjdG9yIiwid29ya2VyIiwiY29uY3VycmVuY3kiLCJxdWV1ZSIsInRhc2siLCJjYWxsYmFjayIsInRoZW4iLCJjYXRjaCIsImRyYWluIiwiZHJhaW5SZXNvbHZlciIsInB1c2giLCJoYW5kbGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJpZGxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxNQUFNQSxzQkFBc0IsQ0FBNUI7O0FBRWUsTUFBTUMsZUFBTixDQUFzQjtBQUNuQ0MsY0FBWUMsTUFBWixFQUFvQkMsV0FBcEIsRUFBaUM7QUFDL0IsU0FBS0QsTUFBTCxHQUFjQSxNQUFkOztBQUVBLFNBQUtFLEtBQUwsR0FBYSxrQkFBTSxDQUFDQyxJQUFELEVBQU9DLFFBQVAsS0FBb0I7QUFDckMsV0FBS0osTUFBTCxDQUFZRyxJQUFaLEVBQWtCRSxJQUFsQixDQUF1QkQsUUFBdkIsRUFBaUNFLEtBQWpDLENBQXVDRixRQUF2QztBQUNELEtBRlksRUFFVkgsZUFBZUosbUJBRkwsQ0FBYjs7QUFJQSxTQUFLSyxLQUFMLENBQVdLLEtBQVgsR0FBbUIsTUFBTTtBQUN2QixVQUFJLEtBQUtDLGFBQVQsRUFBd0I7QUFDdEIsYUFBS0EsYUFBTDtBQUNBLGFBQUtBLGFBQUwsR0FBcUIsSUFBckI7QUFDRDtBQUNGLEtBTEQ7QUFNRDs7QUFFREMsT0FBS04sSUFBTCxFQUFXTyxPQUFYLEVBQW9CO0FBQ2xCLFNBQUtSLEtBQUwsQ0FBV08sSUFBWCxDQUFnQk4sSUFBaEIsRUFBc0JPLE9BQXRCO0FBQ0Q7O0FBRURILFVBQVE7QUFDTixXQUFPLElBQUlJLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdEMsVUFBSSxLQUFLWCxLQUFMLENBQVdZLElBQVgsRUFBSixFQUF1QjtBQUNyQkY7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLSixhQUFMLEdBQXFCSSxPQUFyQjtBQUNEO0FBQ0YsS0FOTSxDQUFQO0FBT0Q7QUE1QmtDO2tCQUFoQmQsZSIsImZpbGUiOiJjb25jdXJyZW50LXF1ZXVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtxdWV1ZX0gZnJvbSAnYXN5bmMnO1xyXG5cclxuY29uc3QgREVGQVVMVF9DT05DVVJSRU5DWSA9IDU7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25jdXJyZW50UXVldWUge1xyXG4gIGNvbnN0cnVjdG9yKHdvcmtlciwgY29uY3VycmVuY3kpIHtcclxuICAgIHRoaXMud29ya2VyID0gd29ya2VyO1xyXG5cclxuICAgIHRoaXMucXVldWUgPSBxdWV1ZSgodGFzaywgY2FsbGJhY2spID0+IHtcclxuICAgICAgdGhpcy53b3JrZXIodGFzaykudGhlbihjYWxsYmFjaykuY2F0Y2goY2FsbGJhY2spO1xyXG4gICAgfSwgY29uY3VycmVuY3kgfHwgREVGQVVMVF9DT05DVVJSRU5DWSk7XHJcblxyXG4gICAgdGhpcy5xdWV1ZS5kcmFpbiA9ICgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZHJhaW5SZXNvbHZlcikge1xyXG4gICAgICAgIHRoaXMuZHJhaW5SZXNvbHZlcigpO1xyXG4gICAgICAgIHRoaXMuZHJhaW5SZXNvbHZlciA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwdXNoKHRhc2ssIGhhbmRsZXIpIHtcclxuICAgIHRoaXMucXVldWUucHVzaCh0YXNrLCBoYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIGRyYWluKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgaWYgKHRoaXMucXVldWUuaWRsZSgpKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZHJhaW5SZXNvbHZlciA9IHJlc29sdmU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=