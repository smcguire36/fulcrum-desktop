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

    this._isSimpleShell = _app2.default.args.simpleOutput || process.platform === 'win32';
    this._noProgress = _app2.default.args.progress === false || !process.stdout.isTTY;
  }

  get synchronizer() {
    return this._synchronizer;
  }

  getSyncState(resource, scope = null) {
    return this._syncState.find(object => {
      return object.resource === resource && (object.scope == null && scope === '' || object.scope === scope);
    });
  }

  checkSyncState() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const scope = _this.syncResourceScope || '';
      const resource = _this.syncResourceName;

      const oldState = yield _this.account.findSyncState({ resource, scope });
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
      _this2.db = account.db;

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
    return this._isSimpleShell ? '[downloading]' : '😀 ';
  }

  get processing() {
    return this._isSimpleShell ? '[processing]' : '🤔 ';
  }

  get finished() {
    return this._isSimpleShell ? '[finished]' : '😎 ';
  }

  progress({ message, count, total }) {
    if (this._noProgress) {
      if (message !== this._lastMessage) {
        console.log(new Date().toISOString() + ' ' + message);
        this._lastMessage = message;
      }

      return;
    }

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

  markDeletedObjects(localObjects, newObjects, typeName, propName) {
    var _this3 = this;

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
          const isChanged = object._deletedAt == null;

          object._deletedAt = object._deletedAt ? object._deletedAt : new Date();

          yield object.save();

          if (isChanged) {
            yield _this3.trigger(`${typeName}:delete`, { [propName || typeName]: object });
          }
        }
      }
    })();
  }

  lookup(record, resourceID, propName, getter) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      if (resourceID) {
        const object = yield new Promise(function (resolve) {
          _this4.dataSource[getter](resourceID, function (err, object) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiY29uc3RydWN0b3IiLCJzeW5jaHJvbml6ZXIiLCJzeW5jU3RhdGUiLCJfc3luY2hyb25pemVyIiwiX3N5bmNTdGF0ZSIsIl9pc1NpbXBsZVNoZWxsIiwiYXJncyIsInNpbXBsZU91dHB1dCIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsIl9ub1Byb2dyZXNzIiwicHJvZ3Jlc3MiLCJzdGRvdXQiLCJpc1RUWSIsImdldFN5bmNTdGF0ZSIsInJlc291cmNlIiwic2NvcGUiLCJmaW5kIiwib2JqZWN0IiwiY2hlY2tTeW5jU3RhdGUiLCJzeW5jUmVzb3VyY2VTY29wZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJvbGRTdGF0ZSIsImFjY291bnQiLCJmaW5kU3luY1N0YXRlIiwibmV3U3RhdGUiLCJuZWVkc1VwZGF0ZSIsImhhc2giLCJ1cGRhdGUiLCJzYXZlIiwic3RhdGUiLCJleGVjdXRlIiwiZGF0YVNvdXJjZSIsImRiIiwic3luY05hbWUiLCJ0cmlnZ2VyIiwidGFzayIsInJlc3VsdCIsInJ1biIsImJhciIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiZW1pdCIsImRvd25sb2FkaW5nIiwicHJvY2Vzc2luZyIsImZpbmlzaGVkIiwibWVzc2FnZSIsImNvdW50IiwidG90YWwiLCJfbGFzdE1lc3NhZ2UiLCJEYXRlIiwidG9JU09TdHJpbmciLCJmbXQiLCJncmVlbiIsIm9wdGlvbnMiLCJ3aWR0aCIsImNvbXBsZXRlIiwiaW5jb21wbGV0ZSIsImNsZWFyIiwidGljayIsIl9tZXNzYWdlIiwiY3VyciIsInJlbmRlciIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImxvY2FsT2JqZWN0cyIsIm5ld09iamVjdHMiLCJ0eXBlTmFtZSIsInByb3BOYW1lIiwib2JqZWN0RXhpc3RzT25TZXJ2ZXIiLCJhdHRyaWJ1dGVzIiwiaWQiLCJpc0NoYW5nZWQiLCJfZGVsZXRlZEF0IiwibG9va3VwIiwicmVjb3JkIiwicmVzb3VyY2VJRCIsImdldHRlciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyIiwicm93SUQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxJQUFOLENBQVc7QUFDeEJDLGNBQVksRUFBQ0MsWUFBRCxFQUFlQyxTQUFmLEVBQVosRUFBdUM7QUFDckMsU0FBS0MsYUFBTCxHQUFxQkYsWUFBckI7QUFDQSxTQUFLRyxVQUFMLEdBQWtCRixTQUFsQjs7QUFFQSxTQUFLRyxjQUFMLEdBQXNCLGNBQUlDLElBQUosQ0FBU0MsWUFBVCxJQUF5QkMsUUFBUUMsUUFBUixLQUFxQixPQUFwRTtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsY0FBSUosSUFBSixDQUFTSyxRQUFULEtBQXNCLEtBQXRCLElBQStCLENBQUNILFFBQVFJLE1BQVIsQ0FBZUMsS0FBbEU7QUFDRDs7QUFFRCxNQUFJWixZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sS0FBS0UsYUFBWjtBQUNEOztBQUVEVyxlQUFhQyxRQUFiLEVBQXVCQyxRQUFRLElBQS9CLEVBQXFDO0FBQ25DLFdBQU8sS0FBS1osVUFBTCxDQUFnQmEsSUFBaEIsQ0FBc0JDLE1BQUQsSUFBWTtBQUN0QyxhQUFPQSxPQUFPSCxRQUFQLEtBQW9CQSxRQUFwQixLQUFrQ0csT0FBT0YsS0FBUCxJQUFnQixJQUFoQixJQUF3QkEsVUFBVSxFQUFuQyxJQUEwQ0UsT0FBT0YsS0FBUCxLQUFpQkEsS0FBNUYsQ0FBUDtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVLRyxnQkFBTixHQUF1QjtBQUFBOztBQUFBO0FBQ3JCLFlBQU1ILFFBQVEsTUFBS0ksaUJBQUwsSUFBMEIsRUFBeEM7QUFDQSxZQUFNTCxXQUFXLE1BQUtNLGdCQUF0Qjs7QUFFQSxZQUFNQyxXQUFXLE1BQU0sTUFBS0MsT0FBTCxDQUFhQyxhQUFiLENBQTJCLEVBQUNULFFBQUQsRUFBV0MsS0FBWCxFQUEzQixDQUF2QjtBQUNBLFlBQU1TLFdBQVcsTUFB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Rjs7QUFFRCxZQUFJLENBQUNBLG9CQUFMLEVBQTJCO0FBQ3pCLGdCQUFNRyxZQUFZdEQsT0FBT3VELFVBQVAsSUFBcUIsSUFBdkM7O0FBRUF2RCxpQkFBT3VELFVBQVAsR0FBb0J2RCxPQUFPdUQsVUFBUCxHQUFvQnZELE9BQU91RCxVQUEzQixHQUF3QyxJQUFJdEIsSUFBSixFQUE1RDs7QUFFQSxnQkFBTWpDLE9BQU9XLElBQVAsRUFBTjs7QUFFQSxjQUFJMkMsU0FBSixFQUFlO0FBQ2Isa0JBQU0sT0FBS3JDLE9BQUwsQ0FBYyxHQUFHZ0MsUUFBVSxTQUEzQixFQUFxQyxFQUFDLENBQUNDLFlBQVlELFFBQWIsR0FBd0JqRCxNQUF6QixFQUFyQyxDQUFOO0FBQ0Q7QUFDRjtBQUNGO0FBdkJvRTtBQXdCdEU7O0FBRUt3RCxRQUFOLENBQWFDLE1BQWIsRUFBcUJDLFVBQXJCLEVBQWlDUixRQUFqQyxFQUEyQ1MsTUFBM0MsRUFBbUQ7QUFBQTs7QUFBQTtBQUNqRCxVQUFJRCxVQUFKLEVBQWdCO0FBQ2QsY0FBTTFELFNBQVMsTUFBTSxJQUFJNEQsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM1QyxpQkFBSy9DLFVBQUwsQ0FBZ0I2QyxNQUFoQixFQUF3QkQsVUFBeEIsRUFBb0MsVUFBQ0ksR0FBRCxFQUFNOUQsTUFBTjtBQUFBLG1CQUFpQjZELFFBQVE3RCxNQUFSLENBQWpCO0FBQUEsV0FBcEM7QUFDRCxTQUZvQixDQUFyQjs7QUFJQSxZQUFJQSxNQUFKLEVBQVk7QUFDVnlELGlCQUFPUCxRQUFQLElBQW1CbEQsT0FBTytELEtBQTFCO0FBQ0Q7QUFDRjtBQVRnRDtBQVVsRDtBQTVLdUI7a0JBQUxsRixJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAncHJvZ3Jlc3MnO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuaW1wb3J0IGFwcCBmcm9tICcuLi8uLi9hcHAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3Ioe3N5bmNocm9uaXplciwgc3luY1N0YXRlfSkge1xuICAgIHRoaXMuX3N5bmNocm9uaXplciA9IHN5bmNocm9uaXplcjtcbiAgICB0aGlzLl9zeW5jU3RhdGUgPSBzeW5jU3RhdGU7XG5cbiAgICB0aGlzLl9pc1NpbXBsZVNoZWxsID0gYXBwLmFyZ3Muc2ltcGxlT3V0cHV0IHx8IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG4gICAgdGhpcy5fbm9Qcm9ncmVzcyA9IGFwcC5hcmdzLnByb2dyZXNzID09PSBmYWxzZSB8fCAhcHJvY2Vzcy5zdGRvdXQuaXNUVFk7XG4gIH1cblxuICBnZXQgc3luY2hyb25pemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jaHJvbml6ZXI7XG4gIH1cblxuICBnZXRTeW5jU3RhdGUocmVzb3VyY2UsIHNjb3BlID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU3RhdGUuZmluZCgob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LnJlc291cmNlID09PSByZXNvdXJjZSAmJiAoKG9iamVjdC5zY29wZSA9PSBudWxsICYmIHNjb3BlID09PSAnJykgfHwgb2JqZWN0LnNjb3BlID09PSBzY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjaGVja1N5bmNTdGF0ZSgpIHtcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuc3luY1Jlc291cmNlU2NvcGUgfHwgJyc7XG4gICAgY29uc3QgcmVzb3VyY2UgPSB0aGlzLnN5bmNSZXNvdXJjZU5hbWU7XG5cbiAgICBjb25zdCBvbGRTdGF0ZSA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kU3luY1N0YXRlKHtyZXNvdXJjZSwgc2NvcGV9KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuZ2V0U3luY1N0YXRlKHJlc291cmNlLCBzY29wZSB8fCAnJyk7XG5cbiAgICBsZXQgbmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlICYmIG9sZFN0YXRlLmhhc2ggPT09IG5ld1N0YXRlLmhhc2gpIHtcbiAgICAgIG5lZWRzVXBkYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlKSB7XG4gICAgICAgIG9sZFN0YXRlLmhhc2ggPSBuZXdTdGF0ZS5oYXNoO1xuICAgICAgICBvbGRTdGF0ZS5zY29wZSA9IG9sZFN0YXRlLnNjb3BlIHx8ICcnO1xuXG4gICAgICAgIGF3YWl0IG9sZFN0YXRlLnNhdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgbmVlZHNVcGRhdGUsIHN0YXRlOiBvbGRTdGF0ZSwgdXBkYXRlIH07XG4gIH1cblxuICBhc3luYyBleGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG4gICAgdGhpcy5kYiA9IGFjY291bnQuZGI7XG5cbiAgICBjb25zdCBzeW5jTmFtZSA9IHRoaXMuc3luY1Jlc291cmNlTmFtZTtcblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpzdGFydGAsIHt0YXNrOiB0aGlzfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KTtcblxuICAgIGlmICh0aGlzLmJhcikge1xuICAgICAgY29uc29sZS5sb2coJycpO1xuICAgIH1cblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpmaW5pc2hgLCB7dGFzazogdGhpc30pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB0cmlnZ2VyKG5hbWUsIGFyZ3MpIHtcbiAgICByZXR1cm4gYXBwLmVtaXQobmFtZSwge2FjY291bnQ6IHRoaXMuYWNjb3VudCwgLi4uYXJnc30pO1xuICB9XG5cbiAgZ2V0IGRvd25sb2FkaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NpbXBsZVNoZWxsID8gJ1tkb3dubG9hZGluZ10nIDogJ/CfmIAgJztcbiAgfVxuXG4gIGdldCBwcm9jZXNzaW5nKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NpbXBsZVNoZWxsID8gJ1twcm9jZXNzaW5nXScgOiAn8J+klCAnO1xuICB9XG5cbiAgZ2V0IGZpbmlzaGVkKCkge1xuICAgIHJldHVybiB0aGlzLl9pc1NpbXBsZVNoZWxsID8gJ1tmaW5pc2hlZF0nIDogJ/CfmI4gJztcbiAgfVxuXG4gIHByb2dyZXNzKHttZXNzYWdlLCBjb3VudCwgdG90YWx9KSB7XG4gICAgaWYgKHRoaXMuX25vUHJvZ3Jlc3MpIHtcbiAgICAgIGlmIChtZXNzYWdlICE9PSB0aGlzLl9sYXN0TWVzc2FnZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKyAnICcgKyBtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5fbGFzdE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGZtdCA9ICcnO1xuXG4gICAgaWYgKHRvdGFsID09PSAtMSkge1xuICAgICAgZm10ID0gZm9ybWF0KCclcyAoOmN1cnJlbnQpIDplbGFwc2VkJywgbWVzc2FnZS5ncmVlbik7XG4gICAgfSBlbHNlIGlmIChjb3VudCAhPSBudWxsKSB7XG4gICAgICBmbXQgPSBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm10ID0gZm9ybWF0KCclcycsIG1lc3NhZ2UuZ3JlZW4pO1xuICAgIH1cbiAgICAvLyBjb25zdCBmbXQgPSBjb3VudCAhPSBudWxsID8gZm9ybWF0KCclcyA6YmFyIDpwZXJjZW50ICg6Y3VycmVudC86dG90YWwpIDpldGFzIDplbGFwc2VkJywgbWVzc2FnZS5ncmVlbilcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZm9ybWF0KCclcycsIG1lc3NhZ2UuZ3JlZW4pO1xuXG4gICAgaWYgKCF0aGlzLmJhcikge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICB0b3RhbDogdG90YWwgfHwgMSxcbiAgICAgICAgY29tcGxldGU6ICfilocnLmdyZWVuLFxuICAgICAgICBpbmNvbXBsZXRlOiAnLScsXG4gICAgICAgIGNsZWFyOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgdGhpcy5iYXIgPSBuZXcgUHJvZ3Jlc3NCYXIoZm10LCBvcHRpb25zKTtcbiAgICAgIHRoaXMuYmFyLnRpY2soMCk7XG4gICAgfVxuXG4gICAgdGhpcy5iYXIuZm10ID0gZm10O1xuXG4gICAgaWYgKHRvdGFsICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYmFyLnRvdGFsID0gdG90YWwgfHwgMTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbWVzc2FnZSAhPT0gbWVzc2FnZSkge1xuICAgICAgdGhpcy5iYXIuY3VyciA9IDA7XG4gICAgICB0aGlzLmJhci5yZW5kZXIoKTtcbiAgICAgIHRoaXMuX21lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIH1cblxuICAgIGlmIChjb3VudCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmJhci5jdXJyID0gY291bnQ7XG4gICAgICB0aGlzLmJhci5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBtYXJrRGVsZXRlZE9iamVjdHMobG9jYWxPYmplY3RzLCBuZXdPYmplY3RzLCB0eXBlTmFtZSwgcHJvcE5hbWUpIHtcbiAgICAvLyBkZWxldGUgYWxsIG9iamVjdHMgdGhhdCBkb24ndCBleGlzdCBvbiB0aGUgc2VydmVyIGFueW1vcmVcbiAgICBmb3IgKGNvbnN0IG9iamVjdCBvZiBsb2NhbE9iamVjdHMpIHtcbiAgICAgIGxldCBvYmplY3RFeGlzdHNPblNlcnZlciA9IGZhbHNlO1xuXG4gICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZXMgb2YgbmV3T2JqZWN0cykge1xuICAgICAgICBpZiAoYXR0cmlidXRlcy5pZCA9PT0gb2JqZWN0LmlkKSB7XG4gICAgICAgICAgb2JqZWN0RXhpc3RzT25TZXJ2ZXIgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghb2JqZWN0RXhpc3RzT25TZXJ2ZXIpIHtcbiAgICAgICAgY29uc3QgaXNDaGFuZ2VkID0gb2JqZWN0Ll9kZWxldGVkQXQgPT0gbnVsbDtcblxuICAgICAgICBvYmplY3QuX2RlbGV0ZWRBdCA9IG9iamVjdC5fZGVsZXRlZEF0ID8gb2JqZWN0Ll9kZWxldGVkQXQgOiBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIGF3YWl0IG9iamVjdC5zYXZlKCk7XG5cbiAgICAgICAgaWYgKGlzQ2hhbmdlZCkge1xuICAgICAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcihgJHsgdHlwZU5hbWUgfTpkZWxldGVgLCB7W3Byb3BOYW1lIHx8IHR5cGVOYW1lXTogb2JqZWN0fSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhc3luYyBsb29rdXAocmVjb3JkLCByZXNvdXJjZUlELCBwcm9wTmFtZSwgZ2V0dGVyKSB7XG4gICAgaWYgKHJlc291cmNlSUQpIHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZVtnZXR0ZXJdKHJlc291cmNlSUQsIChlcnIsIG9iamVjdCkgPT4gcmVzb2x2ZShvYmplY3QpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAob2JqZWN0KSB7XG4gICAgICAgIHJlY29yZFtwcm9wTmFtZV0gPSBvYmplY3Qucm93SUQ7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=