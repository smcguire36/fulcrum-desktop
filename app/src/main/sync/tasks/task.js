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

      const result = yield _this2.run({ account, dataSource });

      if (_this2.bar) {
        console.log('');
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
    // const fmt = count != null ? format('%s :bar :percent (:current/:total) :etas :elapsed', message.green)
    //                           : format('%s', message.green);
    const fmt = count != null ? (0, _util.format)('%s :bar :percent (:current/:total) :etas :elapsed', message.green) : (0, _util.format)('%s', message.green);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiY29uc3RydWN0b3IiLCJzeW5jaHJvbml6ZXIiLCJzeW5jU3RhdGUiLCJfc3luY2hyb25pemVyIiwiX3N5bmNTdGF0ZSIsImdldFN5bmNTdGF0ZSIsInJlc291cmNlIiwic2NvcGUiLCJmaW5kIiwib2JqZWN0IiwiY2hlY2tTeW5jU3RhdGUiLCJhY2NvdW50Iiwib2xkU3RhdGUiLCJmaW5kU3luY1N0YXRlIiwibmV3U3RhdGUiLCJuZWVkc1VwZGF0ZSIsImhhc2giLCJ1cGRhdGUiLCJzYXZlIiwic3RhdGUiLCJleGVjdXRlIiwiZGF0YVNvdXJjZSIsInJlc3VsdCIsInJ1biIsImJhciIsImNvbnNvbGUiLCJsb2ciLCJ0cmlnZ2VyIiwibmFtZSIsImFyZ3MiLCJlbWl0IiwiZG93bmxvYWRpbmciLCJ5ZWxsb3ciLCJwcm9jZXNzaW5nIiwiY3lhbiIsImZpbmlzaGVkIiwiZ3JlZW4iLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJjb3VudCIsInRvdGFsIiwiZm10Iiwib3B0aW9ucyIsIndpZHRoIiwiY29tcGxldGUiLCJpbmNvbXBsZXRlIiwiY2xlYXIiLCJ0aWNrIiwiX21lc3NhZ2UiLCJjdXJyIiwicmVuZGVyIiwibWFya0RlbGV0ZWRPYmplY3RzIiwibG9jYWxPYmplY3RzIiwibmV3T2JqZWN0cyIsIm9iamVjdEV4aXN0c09uU2VydmVyIiwiYXR0cmlidXRlcyIsImlkIiwiX2RlbGV0ZWRBdCIsIkRhdGUiLCJsb29rdXAiLCJyZWNvcmQiLCJyZXNvdXJjZUlEIiwicHJvcE5hbWUiLCJnZXR0ZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVyciIsInJvd0lEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRWUsTUFBTUEsSUFBTixDQUFXO0FBQ3hCQyxjQUFZLEVBQUNDLFlBQUQsRUFBZUMsU0FBZixFQUFaLEVB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aEJnRDtBQWlCbEQ7O0FBRUt5QyxRQUFOLENBQWFDLE1BQWIsRUFBcUJDLFVBQXJCLEVBQWlDQyxRQUFqQyxFQUEyQ0MsTUFBM0MsRUFBbUQ7QUFBQTs7QUFBQTtBQUNqRCxVQUFJRixVQUFKLEVBQWdCO0FBQ2QsY0FBTXBELFNBQVMsTUFBTSxJQUFJdUQsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM1QyxpQkFBSzVDLFVBQUwsQ0FBZ0IwQyxNQUFoQixFQUF3QkYsVUFBeEIsRUFBb0MsVUFBQ0ssR0FBRCxFQUFNekQsTUFBTjtBQUFBLG1CQUFpQndELFFBQVF4RCxNQUFSLENBQWpCO0FBQUEsV0FBcEM7QUFDRCxTQUZvQixDQUFyQjs7QUFJQSxZQUFJQSxNQUFKLEVBQVk7QUFDVm1ELGlCQUFPRSxRQUFQLElBQW1CckQsT0FBTzBELEtBQTFCO0FBQ0Q7QUFDRjtBQVRnRDtBQVVsRDtBQXJJdUI7a0JBQUxwRSxJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAncHJvZ3Jlc3MnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IGFwcCBmcm9tICcuLi8uLi9hcHAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3Ioe3N5bmNocm9uaXplciwgc3luY1N0YXRlfSkge1xuICAgIHRoaXMuX3N5bmNocm9uaXplciA9IHN5bmNocm9uaXplcjtcbiAgICB0aGlzLl9zeW5jU3RhdGUgPSBzeW5jU3RhdGU7XG4gIH1cblxuICBnZXQgc3luY2hyb25pemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jaHJvbml6ZXI7XG4gIH1cblxuICBnZXRTeW5jU3RhdGUocmVzb3VyY2UsIHNjb3BlID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU3RhdGUuZmluZCgob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LnJlc291cmNlID09PSByZXNvdXJjZSAmJiAoKG9iamVjdC5zY29wZSA9PSBudWxsICYmIHNjb3BlID09PSAnJykgfHwgb2JqZWN0LnNjb3BlID09PSBzY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjaGVja1N5bmNTdGF0ZShhY2NvdW50LCByZXNvdXJjZSwgc2NvcGUgPSBudWxsKSB7XG4gICAgY29uc3Qgb2xkU3RhdGUgPSBhd2FpdCBhY2NvdW50LmZpbmRTeW5jU3RhdGUoe3Jlc291cmNlLCBzY29wZTogc2NvcGUgfHwgJyd9KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuZ2V0U3luY1N0YXRlKHJlc291cmNlLCBzY29wZSB8fCAnJyk7XG5cbiAgICBsZXQgbmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlICYmIG9sZFN0YXRlLmhhc2ggPT09IG5ld1N0YXRlLmhhc2gpIHtcbiAgICAgIG5lZWRzVXBkYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlKSB7XG4gICAgICAgIG9sZFN0YXRlLmhhc2ggPSBuZXdTdGF0ZS5oYXNoO1xuICAgICAgICBvbGRTdGF0ZS5zY29wZSA9IG9sZFN0YXRlLnNjb3BlIHx8ICcnO1xuXG4gICAgICAgIGF3YWl0IG9sZFN0YXRlLnNhdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgbmVlZHNVcGRhdGUsIHN0YXRlOiBvbGRTdGF0ZSwgdXBkYXRlIH07XG4gIH1cblxuICBhc3luYyBleGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pO1xuXG4gICAgaWYgKHRoaXMuYmFyKSB7XG4gICAgICBjb25zb2xlLmxvZygnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHRyaWdnZXIobmFtZSwgYXJncykge1xuICAgIHJldHVybiBhcHAuZW1pdChuYW1lLCB7YWNjb3VudDogdGhpcy5hY2NvdW50LCAuLi5hcmdzfSk7XG4gIH1cblxuICBnZXQgZG93bmxvYWRpbmcoKSB7XG4gICAgcmV0dXJuICfwn5iAICcueWVsbG93O1xuICB9XG5cbiAgZ2V0IHByb2Nlc3NpbmcoKSB7XG4gICAgLy8gcmV0dXJuICfinqHvuI8gJy5jeWFuO1xuICAgIHJldHVybiAn8J+klCAnLmN5YW47XG4gIH1cblxuICBnZXQgZmluaXNoZWQoKSB7XG4gICAgcmV0dXJuICfwn5iOICcuZ3JlZW47XG4gIH1cblxuICBwcm9ncmVzcyh7bWVzc2FnZSwgY291bnQsIHRvdGFsfSkge1xuICAgIC8vIGNvbnN0IGZtdCA9IGNvdW50ICE9IG51bGwgPyBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmb3JtYXQoJyVzJywgbWVzc2FnZS5ncmVlbik7XG4gICAgY29uc3QgZm10ID0gY291bnQgIT0gbnVsbCA/IGZvcm1hdCgnJXMgOmJhciA6cGVyY2VudCAoOmN1cnJlbnQvOnRvdGFsKSA6ZXRhcyA6ZWxhcHNlZCcsIG1lc3NhZ2UuZ3JlZW4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZvcm1hdCgnJXMnLCBtZXNzYWdlLmdyZWVuKTtcblxuICAgIGlmICghdGhpcy5iYXIpIHtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgdG90YWw6IHRvdGFsIHx8IDEsXG4gICAgICAgIGNvbXBsZXRlOiAn4paHJy5ncmVlbixcbiAgICAgICAgaW5jb21wbGV0ZTogJy0nLFxuICAgICAgICBjbGVhcjogZmFsc2VcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYmFyID0gbmV3IFByb2dyZXNzQmFyKGZtdCwgb3B0aW9ucyk7XG4gICAgICB0aGlzLmJhci50aWNrKDApO1xuICAgIH1cblxuICAgIHRoaXMuYmFyLmZtdCA9IGZtdDtcblxuICAgIGlmICh0b3RhbCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmJhci50b3RhbCA9IHRvdGFsIHx8IDE7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21lc3NhZ2UgIT09IG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuYmFyLmN1cnIgPSAwO1xuICAgICAgdGhpcy5iYXIucmVuZGVyKCk7XG4gICAgICB0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICBpZiAoY291bnQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5iYXIuY3VyciA9IGNvdW50O1xuICAgICAgdGhpcy5iYXIucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgbWFya0RlbGV0ZWRPYmplY3RzKGxvY2FsT2JqZWN0cywgbmV3T2JqZWN0cykge1xuICAgIC8vIGRlbGV0ZSBhbGwgb2JqZWN0cyB0aGF0IGRvbid0IGV4aXN0IG9uIHRoZSBzZXJ2ZXIgYW55bW9yZVxuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGxvY2FsT2JqZWN0cykge1xuICAgICAgbGV0IG9iamVjdEV4aXN0c09uU2VydmVyID0gZmFsc2U7XG5cbiAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlcyBvZiBuZXdPYmplY3RzKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmlkID09PSBvYmplY3QuaWQpIHtcbiAgICAgICAgICBvYmplY3RFeGlzdHNPblNlcnZlciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFvYmplY3RFeGlzdHNPblNlcnZlcikge1xuICAgICAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG9iamVjdC5fZGVsZXRlZEF0ID8gb2JqZWN0Ll9kZWxldGVkQXQgOiBuZXcgRGF0ZSgpO1xuICAgICAgICBhd2FpdCBvYmplY3Quc2F2ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvb2t1cChyZWNvcmQsIHJlc291cmNlSUQsIHByb3BOYW1lLCBnZXR0ZXIpIHtcbiAgICBpZiAocmVzb3VyY2VJRCkge1xuICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5kYXRhU291cmNlW2dldHRlcl0ocmVzb3VyY2VJRCwgKGVyciwgb2JqZWN0KSA9PiByZXNvbHZlKG9iamVjdCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmVjb3JkW3Byb3BOYW1lXSA9IG9iamVjdC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==