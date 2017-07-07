'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _progress = require('progress');

var _progress2 = _interopRequireDefault(_progress);

var _util = require('util');

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class Task {
  constructor({ synchronizer, syncState }) {
    this._synchronizer = synchronizer;
    this._syncState = syncState;
  }

  get synchronizer() {
    return this._synchronizer;
  }

  getSyncState(resource, scope = null) {
    return this._syncState.find(object => {
      return object.resource === resource && (object.scope == null && scope === '' || object.scope === scope);
    });
  }

  checkSyncState(account, resource, scope = null) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const oldState = yield account.findSyncState({ resource, scope: scope || '' });
      const newState = _this.getSyncState(resource, scope || '');

      let needsUpdate = true;

      if (oldState && newState && oldState.hash === newState.hash) {
        needsUpdate = false;
      }

      const update = (() => {
        var _ref = _asyncToGenerator(function* () {
          if (oldState && newState) {
            oldState.hash = newState.hash;
            oldState.scope = oldState.scope || '';

            yield oldState.save();
          }
        });

        return function update() {
          return _ref.apply(this, arguments);
        };
      })();

      return { needsUpdate, state: oldState, update };
    })();
  }

  execute({ account, dataSource }) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.account = account;

      const syncName = _this2.syncResourceName;

      if (syncName) {
        yield _this2.trigger(`${syncName}:start`, { task: _this2 });
      }

      const result = yield _this2.run({ account, dataSource });

      if (_this2.bar) {
        console.log('');
      }

      if (syncName) {
        yield _this2.trigger(`${syncName}:finish`, { task: _this2 });
      }

      return result;
    })();
  }

  trigger(name, args) {
    return _app2.default.emit(name, _extends({ account: this.account }, args));
  }

  get downloading() {
    return '😀 '.yellow;
  }

  get processing() {
    // return '➡️ '.cyan;
    return '🤔 '.cyan;
  }

  get finished() {
    return '😎 '.green;
  }

  progress({ message, count, total }) {
    let fmt = '';

    if (total === -1) {
      fmt = (0, _util.format)('%s (:current) :elapsed', message.green);
    } else if (count != null) {
      fmt = (0, _util.format)('%s :bar :percent (:current/:total) :etas :elapsed', message.green);
    } else {
      fmt = (0, _util.format)('%s', message.green);
    }
    // const fmt = count != null ? format('%s :bar :percent (:current/:total) :etas :elapsed', message.green)
    //                           : format('%s', message.green);

    if (!this.bar) {
      const options = {
        width: 40,
        total: total || 1,
        complete: '▇'.green,
        incomplete: '-',
        clear: false
      };

      this.bar = new _progress2.default(fmt, options);
      this.bar.tick(0);
    }

    this.bar.fmt = fmt;

    if (total != null) {
      this.bar.total = total || 1;
    }

    if (this._message !== message) {
      this.bar.curr = 0;
      this.bar.render();
      this._message = message;
    }

    if (count != null) {
      this.bar.curr = count;
      this.bar.render();
    }
  }

  markDeletedObjects(localObjects, newObjects) {
    return _asyncToGenerator(function* () {
      // delete all objects that don't exist on the server anymore
      for (const object of localObjects) {
        let objectExistsOnServer = false;

        for (const attributes of newObjects) {
          if (attributes.id === object.id) {
            objectExistsOnServer = true;
            break;
          }
        }

        if (!objectExistsOnServer) {
          object._deletedAt = object._deletedAt ? object._deletedAt : new Date();
          yield object.save();
        }
      }
    })();
  }

  lookup(record, resourceID, propName, getter) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      if (resourceID) {
        const object = yield new Promise(function (resolve) {
          _this3.dataSource[getter](resourceID, function (err, object) {
            return resolve(object);
          });
        });

        if (object) {
          record[propName] = object.rowID;
        }
      }
    })();
  }
}
exports.default = Task;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiY29uc3RydWN0b3IiLCJzeW5jaHJvbml6ZXIiLCJzeW5jU3RhdGUiLCJfc3luY2hyb25pemVyIiwiX3N5bmNTdGF0ZSIsImdldFN5bmNTdGF0ZSIsInJlc291cmNlIiwic2NvcGUiLCJmaW5kIiwib2JqZWN0IiwiY2hlY2tTeW5jU3RhdGUiLCJhY2NvdW50Iiwib2xkU3RhdGUiLCJmaW5kU3luY1N0YXRlIiwibmV3U3RhdGUiLCJuZWVkc1VwZGF0ZSIsImhhc2giLCJ1cGRhdGUiLCJzYXZlIiwic3RhdGUiLCJleGVjdXRlIiwiZGF0YVNvdXJjZSIsInN5bmNOYW1lIiwic3luY1Jlc291cmNlTmFtZSIsInRyaWdnZXIiLCJ0YXNrIiwicmVzdWx0IiwicnVuIiwiYmFyIiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcmdzIiwiZW1pdCIsImRvd25sb2FkaW5nIiwieWVsbG93IiwicHJvY2Vzc2luZyIsImN5YW4iLCJmaW5pc2hlZCIsImdyZWVuIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiY291bnQiLCJ0b3RhbCIsImZtdCIsIm9wdGlvbnMiLCJ3aWR0aCIsImNvbXBsZXRlIiwiaW5jb21wbGV0ZSIsImNsZWFyIiwidGljayIsIl9tZXNzYWdlIiwiY3VyciIsInJlbmRlciIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImxvY2FsT2JqZWN0cyIsIm5ld09iamVjdHMiLCJvYmplY3RFeGlzdHNPblNlcnZlciIsImF0dHJpYnV0ZXMiLCJpZCIsIl9kZWxldGVkQXQiLCJEYXRlIiwibG9va3VwIiwicmVjb3JkIiwicmVzb3VyY2VJRCIsInByb3BOYW1lIiwiZ2V0dGVyIiwiUHJvbWlzZSIsInJlc29sdmUiLCJlcnIiLCJyb3dJRCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLElBQU4sQ0FBVztBQUN4QkMsY0FBWSxFQUFDQyxZQUFELEVBQWVDLFNBQWYsRUFBWixFQUF1QztBQUNyQyxTQUFLQyxhQUFMLEdBQXFCRixZQUFyQjtBQUNBLFNBQUtHLFVBQUwsR0FBa0JGLFNBQWxCO0FBQ0Q7O0FBRUQsTUFBSUQsWUFBSixHQUFtQjtBQUNqQixXQUFPLEtBQUtFLGFBQVo7QUFDRDs7QUFFREUsZUFBYUMsUUFBYixFQUF1QkMsUUFBUSxJQUEvQixFQUFxQztBQUNuQyxXQUFPLEtBQUtILFVBQUwsQ0FBZ0JJLElBQWhCLENBQXNCQyxNQUFELElBQVk7QUFDdEMsYUFBT0EsT0FBT0gsUUFBUCxLQUFvQkEsUUFBcEIsS0FBa0NHLE9BQU9GLEtBQVAsSUFBZ0IsSUFBaEIsSUFBd0JBLFVBQVUsRUFBbkMsSUFBMENFLE9BQU9GLEtBQVAsS0FBaUJBLEtBQTVGLENBQVA7QUFDRCxLQUZNLENBQVA7QUFHRDs7QUFFS0csZ0JBQU4sQ0FBcUJDLE9BQXJCLEVBQThCTCxRQUE5QixFQUF3Q0MsUUFBUSxJQUFoRCxFQUFzRDtBQUFBOztBQUFBO0FBQ3BELFlBQU1LLFdBQVcsTUFBTUQsUUFBUUUsYUFBUixDQUFzQixFQUFDUCxRQUFELEVBQVdDLE9BQU9BLFNBQVMsRUFBM0IsRUFBdEIsQ0FBdkI7QUFDQSxZQUFNTyxXQUFXLE1BQUtULFlBQUwsQ0FBa0JDLFFBQWxCLEVBQTRCQyxTQUFTLEVBQXJDLENBQWpCOztBQUVBLFVBQUlRLGNBQWMsSUFBbEI7O0FBRUEsVUFBSUgsWUFBWUUsUUFBWixJQUF3QkYsU0FBU0ksSUFBVCxLQUFrQkYsU0FBU0UsSUFBdkQsRUFBNkQ7QUFDM0RELHNCQUFjLEtBQWQ7QUFDRDs7QUFFRCxZQUFNRTtBQUFBLHFDQUFTLGFBQVk7QUFDekIsY0FBSUwsWUFBWUUsUUFBaEIsRUFBMEI7QUFDeEJGLHFCQUFTSSxJQUFULEdBQWdCRixTQUFTRSxJQUF6QjtBQUNBSixxQkFBU0wsS0FBVCxHQUFpQkssU0FBU0wsS0FBVCxJQUFrQixFQUFuQzs7QUFFQSxrQkFBTUssU0FBU00sSUFBVCxFQUFOO0FBQ0Q7QUFDRixTQVBLOztBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQU47O0FBU0EsYUFBTyxFQUFFSCxXQUFGLEVBQWVJLE9BQU9QLFFBQXRCLEVBQWdDSyxNQUFoQyxFQUFQO0FBbkJvRDtBQW9CckQ7O0FBRUtHLFNBQU4sQ0FBYyxFQUFDVCxPQUFELEVBQVVVLFVBQVYsRUFBZCxFQUFxQztBQUFBOztBQUFBO0FBQ25DLGFBQUtWLE9BQUwsR0FBZUEsT0FBZjs7QUFFQSxZQUFNVyxXQUFXLE9BQUtDLGdCQUF0Qjs7QUFFQSxVQUFJRCxRQUFKLEVBQWM7QUFDWixjQUFNLE9BQUtFLE9BQUwsQ0FBYyxHQUFFRixRQUFTLFFBQXpCLEVBQWtDLEVBQUNHLFlBQUQsRUFBbEMsQ0FBTjtBQUNEOztBQUVELFlBQU1DLFNBQVMsTUFBTSxPQUFLQyxHQUFMLENBQVMsRUFBQ2hCLE9BQUQsRUFBVVUsVUFBVixFQUFULENBQXJCOztBQUVBLFVBQUksT0FBS08sR0FBVCxFQUFjO0FBQ1pDLGdCQUFRQyxHQUFSLENBQVksRUFBWjtBQUNEOztBQUVELFVBQUlSLFFBQUosRUFBYztBQUNaLGNBQU0sT0FBS0UsT0FBTCxDQUFjLEdBQUVGLFFBQVMsU0FBekIsRUFBbUMsRUFBQ0csWUFBRCxFQUFuQyxDQUFOO0FBQ0Q7O0FBRUQsYUFBT0MsTUFBUDtBQW5CbUM7QUFvQnBDOztBQUVERixVQUFRTyxJQUFSLEVBQWNDLElBQWQsRUFBb0I7QUFDbEIsV0FBTyxjQUFJQyxJQUFKLENBQVNGLElBQVQsYUFBZ0JwQixTQUFTLEtBQUtBLE9BQTlCLElBQTBDcUIsSUFBMUMsRUFBUDtBQUNEOztBQUVELE1BQUlFLFdBQUosR0FBa0I7QUFDaEIsV0FBTyxNQUFNQyxNQUFiO0FBQ0Q7O0FBRUQsTUFBSUMsVUFBSixHQUFpQjtBQUNmO0FBQ0EsV0FBTyxNQUFNQyxJQUFiO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBSixHQUFlO0FBQ2IsV0FBTyxNQUFNQyxLQUFiO0FBQ0Q7O0FBRURDLFdBQVMsRUFBQ0MsT0FBRCxFQUFVQyxLQUFWLEVBQWlCQyxLQUFqQixFQUFULEVBQWtDO0FBQ2hDLFFBQUlDLE1BQU0sRUFBVjs7QUFFQSxRQUFJRCxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUNoQkMsWUFBTSxrQkFBTyx3QkFBUCxFQUFpQ0gsUUFBUUYsS0FBekMsQ0FBTjtBQUNELEtBRkQsTUFFTyxJQUFJRyxTQUFTLElBQWIsRUFBbUI7QUFDeEJFLFlBQU0sa0JBQU8sbURBQVAsRUFBNERILFFBQVFGLEtBQXBFLENBQU47QUFDRCxLQUZNLE1BRUE7QUFDTEssWUFBTSxrQkFBTyxJQUFQLEVBQWFILFFBQVFGLEtBQXJCLENBQU47QUFDRDtBQUNEO0FBQ0E7O0FBRUEsUUFBSSxDQUFDLEtBQUtYLEdBQVYsRUFBZTtBQUNiLFlBQU1pQixVQUFVO0FBQ2RDLGVBQU8sRUFETztBQUVkSCxlQUFPQSxTQUFTLENBRkY7QUFHZEksa0JBQVUsSUFBSVIsS0FIQTtBQUlkUyxvQkFBWSxHQUpFO0FBS2RDLGVBQU87QUFMTyxPQUFoQjs7QUFRQSxXQUFLckIsR0FBTCxHQUFXLHVCQUFnQmdCLEdBQWhCLEVBQXFCQyxPQUFyQixDQUFYO0FBQ0EsV0FBS2pCLEdBQUwsQ0FBU3NCLElBQVQsQ0FBYyxDQUFkO0FBQ0Q7O0FBRUQsU0FBS3RCLEdBQUwsQ0FBU2dCLEdBQVQsR0FBZUEsR0FBZjs7QUFFQSxRQUFJRCxTQUFTLElBQWIsRUFBbUI7QUFDakIsV0FBS2YsR0FBTCxDQUFTZSxLQUFULEdBQWlCQSxTQUFTLENBQTFCO0FBQ0Q7O0FBRUQsUUFBSSxLQUFLUSxRQUFMLEtBQWtCVixPQUF0QixFQUErQjtBQUM3QixXQUFLYixHQUFMLENBQVN3QixJQUFULEdBQWdCLENBQWhCO0FBQ0EsV0FBS3hCLEdBQUwsQ0FBU3lCLE1BQVQ7QUFDQSxXQUFLRixRQUFMLEdBQWdCVixPQUFoQjtBQUNEOztBQUVELFFBQUlDLFNBQVMsSUFBYixFQUFtQjtBQUNqQixXQUFLZCxHQUFMLENBQVN3QixJQUFULEdBQWdCVixLQUFoQjtBQUNBLFdBQUtkLEdBQUwsQ0FBU3lCLE1BQVQ7QUFDRDtBQUNGOztBQUVLQyxvQkFBTixDQUF5QkMsWUFBekIsRUFBdUNDLFVBQXZDLEVBQW1EO0FBQUE7QUFDakQ7QUFDQSxXQUFLLE1BQU0vQyxNQUFYLElBQXFCOEMsWUFBckIsRUFBbUM7QUFDakMsWUFBSUUsdUJBQXVCLEtBQTNCOztBQUVBLGFBQUssTUFBTUMsVUFBWCxJQUF5QkYsVUFBekIsRUFBcUM7QUFDbkMsY0FBSUUsV0FBV0MsRUFBWCxLQUFrQmxELE9BQU9rRCxFQUE3QixFQUFpQztBQUMvQkYsbUNBQXVCLElBQXZCO0FBQ0E7QUFDRDtBQUNGOztBQUVELFlBQUksQ0FBQ0Esb0JBQUwsRUFBMkI7QUFDekJoRCxpQkFBT21ELFVBQVAsR0FBb0JuRCxPQUFPbUQsVUFBUCxHQUFvQm5ELE9BQU9tRCxVQUEzQixHQUF3QyxJQUFJQyxJQUFKLEVBQTVEO0FBQ0EsZ0JBQU1wRCxPQUFPUyxJQUFQLEVBQU47QUFDRDtBQUNGO0FBaEJnRDtBQWlCbEQ7O0FBRUs0QyxRQUFOLENBQWFDLE1BQWIsRUFBcUJDLFVBQXJCLEVBQWlDQyxRQUFqQyxFQUEyQ0MsTUFBM0MsRUFBbUQ7QUFBQTs7QUFBQTtBQUNqRCxVQUFJRixVQUFKLEVBQWdCO0FBQ2QsY0FBTXZELFNBQVMsTUFBTSxJQUFJMEQsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM1QyxpQkFBSy9DLFVBQUwsQ0FBZ0I2QyxNQUFoQixFQUF3QkYsVUFBeEIsRUFBb0MsVUFBQ0ssR0FBRCxFQUFNNUQsTUFBTjtBQUFBLG1CQUFpQjJELFFBQVEzRCxNQUFSLENBQWpCO0FBQUEsV0FBcEM7QUFDRCxTQUZvQixDQUFyQjs7QUFJQSxZQUFJQSxNQUFKLEVBQVk7QUFDVnNELGlCQUFPRSxRQUFQLElBQW1CeEQsT0FBTzZELEtBQTFCO0FBQ0Q7QUFDRjtBQVRnRDtBQVVsRDtBQXRKdUI7a0JBQUx2RSxJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAncHJvZ3Jlc3MnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IGFwcCBmcm9tICcuLi8uLi9hcHAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3Ioe3N5bmNocm9uaXplciwgc3luY1N0YXRlfSkge1xuICAgIHRoaXMuX3N5bmNocm9uaXplciA9IHN5bmNocm9uaXplcjtcbiAgICB0aGlzLl9zeW5jU3RhdGUgPSBzeW5jU3RhdGU7XG4gIH1cblxuICBnZXQgc3luY2hyb25pemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jaHJvbml6ZXI7XG4gIH1cblxuICBnZXRTeW5jU3RhdGUocmVzb3VyY2UsIHNjb3BlID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU3RhdGUuZmluZCgob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LnJlc291cmNlID09PSByZXNvdXJjZSAmJiAoKG9iamVjdC5zY29wZSA9PSBudWxsICYmIHNjb3BlID09PSAnJykgfHwgb2JqZWN0LnNjb3BlID09PSBzY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjaGVja1N5bmNTdGF0ZShhY2NvdW50LCByZXNvdXJjZSwgc2NvcGUgPSBudWxsKSB7XG4gICAgY29uc3Qgb2xkU3RhdGUgPSBhd2FpdCBhY2NvdW50LmZpbmRTeW5jU3RhdGUoe3Jlc291cmNlLCBzY29wZTogc2NvcGUgfHwgJyd9KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuZ2V0U3luY1N0YXRlKHJlc291cmNlLCBzY29wZSB8fCAnJyk7XG5cbiAgICBsZXQgbmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlICYmIG9sZFN0YXRlLmhhc2ggPT09IG5ld1N0YXRlLmhhc2gpIHtcbiAgICAgIG5lZWRzVXBkYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlKSB7XG4gICAgICAgIG9sZFN0YXRlLmhhc2ggPSBuZXdTdGF0ZS5oYXNoO1xuICAgICAgICBvbGRTdGF0ZS5zY29wZSA9IG9sZFN0YXRlLnNjb3BlIHx8ICcnO1xuXG4gICAgICAgIGF3YWl0IG9sZFN0YXRlLnNhdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgbmVlZHNVcGRhdGUsIHN0YXRlOiBvbGRTdGF0ZSwgdXBkYXRlIH07XG4gIH1cblxuICBhc3luYyBleGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG5cbiAgICBjb25zdCBzeW5jTmFtZSA9IHRoaXMuc3luY1Jlc291cmNlTmFtZTtcblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpzdGFydGAsIHt0YXNrOiB0aGlzfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KTtcblxuICAgIGlmICh0aGlzLmJhcikge1xuICAgICAgY29uc29sZS5sb2coJycpO1xuICAgIH1cblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpmaW5pc2hgLCB7dGFzazogdGhpc30pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB0cmlnZ2VyKG5hbWUsIGFyZ3MpIHtcbiAgICByZXR1cm4gYXBwLmVtaXQobmFtZSwge2FjY291bnQ6IHRoaXMuYWNjb3VudCwgLi4uYXJnc30pO1xuICB9XG5cbiAgZ2V0IGRvd25sb2FkaW5nKCkge1xuICAgIHJldHVybiAn8J+YgCAnLnllbGxvdztcbiAgfVxuXG4gIGdldCBwcm9jZXNzaW5nKCkge1xuICAgIC8vIHJldHVybiAn4p6h77iPICcuY3lhbjtcbiAgICByZXR1cm4gJ/CfpJQgJy5jeWFuO1xuICB9XG5cbiAgZ2V0IGZpbmlzaGVkKCkge1xuICAgIHJldHVybiAn8J+YjiAnLmdyZWVuO1xuICB9XG5cbiAgcHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50LCB0b3RhbH0pIHtcbiAgICBsZXQgZm10ID0gJyc7XG5cbiAgICBpZiAodG90YWwgPT09IC0xKSB7XG4gICAgICBmbXQgPSBmb3JtYXQoJyVzICg6Y3VycmVudCkgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKTtcbiAgICB9IGVsc2UgaWYgKGNvdW50ICE9IG51bGwpIHtcbiAgICAgIGZtdCA9IGZvcm1hdCgnJXMgOmJhciA6cGVyY2VudCAoOmN1cnJlbnQvOnRvdGFsKSA6ZXRhcyA6ZWxhcHNlZCcsIG1lc3NhZ2UuZ3JlZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbXQgPSBmb3JtYXQoJyVzJywgbWVzc2FnZS5ncmVlbik7XG4gICAgfVxuICAgIC8vIGNvbnN0IGZtdCA9IGNvdW50ICE9IG51bGwgPyBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmb3JtYXQoJyVzJywgbWVzc2FnZS5ncmVlbik7XG5cbiAgICBpZiAoIXRoaXMuYmFyKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgIHRvdGFsOiB0b3RhbCB8fCAxLFxuICAgICAgICBjb21wbGV0ZTogJ+KWhycuZ3JlZW4sXG4gICAgICAgIGluY29tcGxldGU6ICctJyxcbiAgICAgICAgY2xlYXI6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmJhciA9IG5ldyBQcm9ncmVzc0JhcihmbXQsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5iYXIudGljaygwKTtcbiAgICB9XG5cbiAgICB0aGlzLmJhci5mbXQgPSBmbXQ7XG5cbiAgICBpZiAodG90YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5iYXIudG90YWwgPSB0b3RhbCB8fCAxO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tZXNzYWdlICE9PSBtZXNzYWdlKSB7XG4gICAgICB0aGlzLmJhci5jdXJyID0gMDtcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xuICAgICAgdGhpcy5fbWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYmFyLmN1cnIgPSBjb3VudDtcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG5ld09iamVjdHMpIHtcbiAgICAvLyBkZWxldGUgYWxsIG9iamVjdHMgdGhhdCBkb24ndCBleGlzdCBvbiB0aGUgc2VydmVyIGFueW1vcmVcbiAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBsb2NhbE9iamVjdHMpIHtcbiAgICAgIGxldCBvYmplY3RFeGlzdHNPblNlcnZlciA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZXMgb2YgbmV3T2JqZWN0cykge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5pZCA9PT0gb2JqZWN0LmlkKSB7XG4gICAgICAgICAgb2JqZWN0RXhpc3RzT25TZXJ2ZXIgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghb2JqZWN0RXhpc3RzT25TZXJ2ZXIpIHtcbiAgICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBvYmplY3QuX2RlbGV0ZWRBdCA/IG9iamVjdC5fZGVsZXRlZEF0IDogbmV3IERhdGUoKTtcbiAgICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBsb29rdXAocmVjb3JkLCByZXNvdXJjZUlELCBwcm9wTmFtZSwgZ2V0dGVyKSB7XG4gICAgaWYgKHJlc291cmNlSUQpIHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZVtnZXR0ZXJdKHJlc291cmNlSUQsIChlcnIsIG9iamVjdCkgPT4gcmVzb2x2ZShvYmplY3QpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJlY29yZFtwcm9wTmFtZV0gPSBvYmplY3Qucm93SUQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=