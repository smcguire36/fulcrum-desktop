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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiY29uc3RydWN0b3IiLCJzeW5jaHJvbml6ZXIiLCJzeW5jU3RhdGUiLCJfc3luY2hyb25pemVyIiwiX3N5bmNTdGF0ZSIsIl9pc1NpbXBsZVNoZWxsIiwiYXJncyIsInNpbXBsZU91dHB1dCIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsIl9ub1Byb2dyZXNzIiwicHJvZ3Jlc3MiLCJzdGRvdXQiLCJpc1RUWSIsImdldFN5bmNTdGF0ZSIsInJlc291cmNlIiwic2NvcGUiLCJmaW5kIiwib2JqZWN0IiwiY2hlY2tTeW5jU3RhdGUiLCJzeW5jUmVzb3VyY2VTY29wZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJvbGRTdGF0ZSIsImFjY291bnQiLCJmaW5kU3luY1N0YXRlIiwibmV3U3RhdGUiLCJuZWVkc1VwZGF0ZSIsImhhc2giLCJ1cGRhdGUiLCJzYXZlIiwic3RhdGUiLCJleGVjdXRlIiwiZGF0YVNvdXJjZSIsImRiIiwic3luY05hbWUiLCJ0cmlnZ2VyIiwidGFzayIsInJlc3VsdCIsInJ1biIsImJhciIsImNvbnNvbGUiLCJsb2ciLCJuYW1lIiwiZW1pdCIsImRvd25sb2FkaW5nIiwicHJvY2Vzc2luZyIsImZpbmlzaGVkIiwibWVzc2FnZSIsImNvdW50IiwidG90YWwiLCJfbGFzdE1lc3NhZ2UiLCJEYXRlIiwidG9JU09TdHJpbmciLCJmbXQiLCJncmVlbiIsIm9wdGlvbnMiLCJ3aWR0aCIsImNvbXBsZXRlIiwiaW5jb21wbGV0ZSIsImNsZWFyIiwidGljayIsIl9tZXNzYWdlIiwiY3VyciIsInJlbmRlciIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImxvY2FsT2JqZWN0cyIsIm5ld09iamVjdHMiLCJ0eXBlTmFtZSIsInByb3BOYW1lIiwib2JqZWN0RXhpc3RzT25TZXJ2ZXIiLCJhdHRyaWJ1dGVzIiwiaWQiLCJpc0NoYW5nZWQiLCJfZGVsZXRlZEF0IiwibG9va3VwIiwicmVjb3JkIiwicmVzb3VyY2VJRCIsImdldHRlciIsIlByb21pc2UiLCJyZXNvbHZlIiwiZXJyIiwicm93SUQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFZSxNQUFNQSxJQUFOLENBQVc7QUFDeEJDLGNBQVksRUFBQ0MsWUFBRCxFQUFlQyxTQUFmLEVBQVosRUFBdUM7QUFDckMsU0FBS0MsYUFBTCxHQUFxQkYsWUFBckI7QUFDQSxTQUFLRyxVQUFMLEdBQWtCRixTQUFsQjs7QUFFQSxTQUFLRyxjQUFMLEdBQXNCLGNBQUlDLElBQUosQ0FBU0MsWUFBVCxJQUF5QkMsUUFBUUMsUUFBUixLQUFxQixPQUFwRTtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsY0FBSUosSUFBSixDQUFTSyxRQUFULEtBQXNCLEtBQXRCLElBQStCLENBQUNILFFBQVFJLE1BQVIsQ0FBZUMsS0FBbEU7QUFDRDs7QUFFRCxNQUFJWixZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sS0FBS0UsYUFBWjtBQUNEOztBQUVEVyxlQUFhQyxRQUFiLEVBQXVCQyxRQUFRLElBQS9CLEVBQXFDO0FBQ25DLFdBQU8sS0FBS1osVUFBTCxDQUFnQmEsSUFBaEIsQ0FBc0JDLE1BQUQsSUFBWTtBQUN0QyxhQUFPQSxPQUFPSCxRQUFQLEtBQW9CQSxRQUFwQixLQUFrQ0csT0FBT0YsS0FBUCxJQUFnQixJQUFoQixJQUF3QkEsVUFBVSxFQUFuQyxJQUEwQ0UsT0FBT0YsS0FBUCxLQUFpQkEsS0FBNUYsQ0FBUDtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVLRyxnQkFBTixHQUF1QjtBQUFBOztBQUFBO0FBQ3JCLFlBQU1ILFFBQVEsTUFBS0ksaUJBQUwsSUFBMEIsRUFBeEM7QUFDQSxZQUFNTCxXQUFXLE1BQUtNLGdCQUF0Qjs7QUFFQSxZQUFNQyxXQUFXLE1BQU0sTUFBS0MsT0FBTCxDQUFhQyxhQUFiLENBQTJCLEVBQUNULFFBQUQsRUFBV0MsS0FBWCxFQUEzQixDQUF2QjtBQUNBLFlBQU1TLFdBQVcsTUFB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Rjs7QUFFRCxZQUFJLENBQUNBLG9CQUFMLEVBQTJCO0FBQ3pCLGdCQUFNRyxZQUFZdEQsT0FBT3VELFVBQVAsSUFBcUIsSUFBdkM7O0FBRUF2RCxpQkFBT3VELFVBQVAsR0FBb0J2RCxPQUFPdUQsVUFBUCxHQUFvQnZELE9BQU91RCxVQUEzQixHQUF3QyxJQUFJdEIsSUFBSixFQUE1RDs7QUFFQSxnQkFBTWpDLE9BQU9XLElBQVAsRUFBTjs7QUFFQSxjQUFJMkMsU0FBSixFQUFlO0FBQ2Isa0JBQU0sT0FBS3JDLE9BQUwsQ0FBYyxHQUFHZ0MsUUFBVSxTQUEzQixFQUFxQyxFQUFDLENBQUNDLFlBQVlELFFBQWIsR0FBd0JqRCxNQUF6QixFQUFyQyxDQUFOO0FBQ0Q7QUFDRjtBQUNGO0FBdkJvRTtBQXdCdEU7O0FBRUt3RCxRQUFOLENBQWFDLE1BQWIsRUFBcUJDLFVBQXJCLEVBQWlDUixRQUFqQyxFQUEyQ1MsTUFBM0MsRUFBbUQ7QUFBQTs7QUFBQTtBQUNqRCxVQUFJRCxVQUFKLEVBQWdCO0FBQ2QsY0FBTTFELFNBQVMsTUFBTSxJQUFJNEQsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBYTtBQUM1QyxpQkFBSy9DLFVBQUwsQ0FBZ0I2QyxNQUFoQixFQUF3QkQsVUFBeEIsRUFBb0MsVUFBQ0ksR0FBRCxFQUFNOUQsTUFBTjtBQUFBLG1CQUFpQjZELFFBQVE3RCxNQUFSLENBQWpCO0FBQUEsV0FBcEM7QUFDRCxTQUZvQixDQUFyQjs7QUFJQSxZQUFJQSxNQUFKLEVBQVk7QUFDVnlELGlCQUFPUCxRQUFQLElBQW1CbEQsT0FBTytELEtBQTFCO0FBQ0Q7QUFDRjtBQVRnRDtBQVVsRDtBQTVLdUI7a0JBQUxsRixJIiwiZmlsZSI6InRhc2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvZ3Jlc3NCYXIgZnJvbSAncHJvZ3Jlc3MnO1xyXG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XHJcbmltcG9ydCBhcHAgZnJvbSAnLi4vLi4vYXBwJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRhc2sge1xyXG4gIGNvbnN0cnVjdG9yKHtzeW5jaHJvbml6ZXIsIHN5bmNTdGF0ZX0pIHtcclxuICAgIHRoaXMuX3N5bmNocm9uaXplciA9IHN5bmNocm9uaXplcjtcclxuICAgIHRoaXMuX3N5bmNTdGF0ZSA9IHN5bmNTdGF0ZTtcclxuXHJcbiAgICB0aGlzLl9pc1NpbXBsZVNoZWxsID0gYXBwLmFyZ3Muc2ltcGxlT3V0cHV0IHx8IHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XHJcbiAgICB0aGlzLl9ub1Byb2dyZXNzID0gYXBwLmFyZ3MucHJvZ3Jlc3MgPT09IGZhbHNlIHx8ICFwcm9jZXNzLnN0ZG91dC5pc1RUWTtcclxuICB9XHJcblxyXG4gIGdldCBzeW5jaHJvbml6ZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc3luY2hyb25pemVyO1xyXG4gIH1cclxuXHJcbiAgZ2V0U3luY1N0YXRlKHJlc291cmNlLCBzY29wZSA9IG51bGwpIHtcclxuICAgIHJldHVybiB0aGlzLl9zeW5jU3RhdGUuZmluZCgob2JqZWN0KSA9PiB7XHJcbiAgICAgIHJldHVybiBvYmplY3QucmVzb3VyY2UgPT09IHJlc291cmNlICYmICgob2JqZWN0LnNjb3BlID09IG51bGwgJiYgc2NvcGUgPT09ICcnKSB8fCBvYmplY3Quc2NvcGUgPT09IHNjb3BlKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgY2hlY2tTeW5jU3RhdGUoKSB7XHJcbiAgICBjb25zdCBzY29wZSA9IHRoaXMuc3luY1Jlc291cmNlU2NvcGUgfHwgJyc7XHJcbiAgICBjb25zdCByZXNvdXJjZSA9IHRoaXMuc3luY1Jlc291cmNlTmFtZTtcclxuXHJcbiAgICBjb25zdCBvbGRTdGF0ZSA9IGF3YWl0IHRoaXMuYWNjb3VudC5maW5kU3luY1N0YXRlKHtyZXNvdXJjZSwgc2NvcGV9KTtcclxuICAgIGNvbnN0IG5ld1N0YXRlID0gdGhpcy5nZXRTeW5jU3RhdGUocmVzb3VyY2UsIHNjb3BlIHx8ICcnKTtcclxuXHJcbiAgICBsZXQgbmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuICAgIGlmIChvbGRTdGF0ZSAmJiBuZXdTdGF0ZSAmJiBvbGRTdGF0ZS5oYXNoID09PSBuZXdTdGF0ZS5oYXNoKSB7XHJcbiAgICAgIG5lZWRzVXBkYXRlID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdXBkYXRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBpZiAob2xkU3RhdGUgJiYgbmV3U3RhdGUpIHtcclxuICAgICAgICBvbGRTdGF0ZS5oYXNoID0gbmV3U3RhdGUuaGFzaDtcclxuICAgICAgICBvbGRTdGF0ZS5zY29wZSA9IG9sZFN0YXRlLnNjb3BlIHx8ICcnO1xyXG5cclxuICAgICAgICBhd2FpdCBvbGRTdGF0ZS5zYXZlKCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHsgbmVlZHNVcGRhdGUsIHN0YXRlOiBvbGRTdGF0ZSwgdXBkYXRlIH07XHJcbiAgfVxyXG5cclxuICBhc3luYyBleGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xyXG4gICAgdGhpcy5hY2NvdW50ID0gYWNjb3VudDtcclxuICAgIHRoaXMuZGIgPSBhY2NvdW50LmRiO1xyXG5cclxuICAgIGNvbnN0IHN5bmNOYW1lID0gdGhpcy5zeW5jUmVzb3VyY2VOYW1lO1xyXG5cclxuICAgIGlmIChzeW5jTmFtZSkge1xyXG4gICAgICBhd2FpdCB0aGlzLnRyaWdnZXIoYCR7c3luY05hbWV9OnN0YXJ0YCwge3Rhc2s6IHRoaXN9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pO1xyXG5cclxuICAgIGlmICh0aGlzLmJhcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN5bmNOYW1lKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMudHJpZ2dlcihgJHtzeW5jTmFtZX06ZmluaXNoYCwge3Rhc2s6IHRoaXN9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgdHJpZ2dlcihuYW1lLCBhcmdzKSB7XHJcbiAgICByZXR1cm4gYXBwLmVtaXQobmFtZSwge2FjY291bnQ6IHRoaXMuYWNjb3VudCwgLi4uYXJnc30pO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRvd25sb2FkaW5nKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2lzU2ltcGxlU2hlbGwgPyAnW2Rvd25sb2FkaW5nXScgOiAn8J+YgCAnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHByb2Nlc3NpbmcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5faXNTaW1wbGVTaGVsbCA/ICdbcHJvY2Vzc2luZ10nIDogJ/CfpJQgJztcclxuICB9XHJcblxyXG4gIGdldCBmaW5pc2hlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9pc1NpbXBsZVNoZWxsID8gJ1tmaW5pc2hlZF0nIDogJ/CfmI4gJztcclxuICB9XHJcblxyXG4gIHByb2dyZXNzKHttZXNzYWdlLCBjb3VudCwgdG90YWx9KSB7XHJcbiAgICBpZiAodGhpcy5fbm9Qcm9ncmVzcykge1xyXG4gICAgICBpZiAobWVzc2FnZSAhPT0gdGhpcy5fbGFzdE1lc3NhZ2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkgKyAnICcgKyBtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLl9sYXN0TWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZm10ID0gJyc7XHJcblxyXG4gICAgaWYgKHRvdGFsID09PSAtMSkge1xyXG4gICAgICBmbXQgPSBmb3JtYXQoJyVzICg6Y3VycmVudCkgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKTtcclxuICAgIH0gZWxzZSBpZiAoY291bnQgIT0gbnVsbCkge1xyXG4gICAgICBmbXQgPSBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGZtdCA9IGZvcm1hdCgnJXMnLCBtZXNzYWdlLmdyZWVuKTtcclxuICAgIH1cclxuICAgIC8vIGNvbnN0IGZtdCA9IGNvdW50ICE9IG51bGwgPyBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZvcm1hdCgnJXMnLCBtZXNzYWdlLmdyZWVuKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuYmFyKSB7XHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgIHRvdGFsOiB0b3RhbCB8fCAxLFxyXG4gICAgICAgIGNvbXBsZXRlOiAn4paHJy5ncmVlbixcclxuICAgICAgICBpbmNvbXBsZXRlOiAnLScsXHJcbiAgICAgICAgY2xlYXI6IGZhbHNlXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLmJhciA9IG5ldyBQcm9ncmVzc0JhcihmbXQsIG9wdGlvbnMpO1xyXG4gICAgICB0aGlzLmJhci50aWNrKDApO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYmFyLmZtdCA9IGZtdDtcclxuXHJcbiAgICBpZiAodG90YWwgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmJhci50b3RhbCA9IHRvdGFsIHx8IDE7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuX21lc3NhZ2UgIT09IG1lc3NhZ2UpIHtcclxuICAgICAgdGhpcy5iYXIuY3VyciA9IDA7XHJcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xyXG4gICAgICB0aGlzLl9tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY291bnQgIT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmJhci5jdXJyID0gY291bnQ7XHJcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgbWFya0RlbGV0ZWRPYmplY3RzKGxvY2FsT2JqZWN0cywgbmV3T2JqZWN0cywgdHlwZU5hbWUsIHByb3BOYW1lKSB7XHJcbiAgICAvLyBkZWxldGUgYWxsIG9iamVjdHMgdGhhdCBkb24ndCBleGlzdCBvbiB0aGUgc2VydmVyIGFueW1vcmVcclxuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGxvY2FsT2JqZWN0cykge1xyXG4gICAgICBsZXQgb2JqZWN0RXhpc3RzT25TZXJ2ZXIgPSBmYWxzZTtcclxuXHJcbiAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlcyBvZiBuZXdPYmplY3RzKSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuaWQgPT09IG9iamVjdC5pZCkge1xyXG4gICAgICAgICAgb2JqZWN0RXhpc3RzT25TZXJ2ZXIgPSB0cnVlO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIW9iamVjdEV4aXN0c09uU2VydmVyKSB7XHJcbiAgICAgICAgY29uc3QgaXNDaGFuZ2VkID0gb2JqZWN0Ll9kZWxldGVkQXQgPT0gbnVsbDtcclxuXHJcbiAgICAgICAgb2JqZWN0Ll9kZWxldGVkQXQgPSBvYmplY3QuX2RlbGV0ZWRBdCA/IG9iamVjdC5fZGVsZXRlZEF0IDogbmV3IERhdGUoKTtcclxuXHJcbiAgICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcclxuXHJcbiAgICAgICAgaWYgKGlzQ2hhbmdlZCkge1xyXG4gICAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAkeyB0eXBlTmFtZSB9OmRlbGV0ZWAsIHtbcHJvcE5hbWUgfHwgdHlwZU5hbWVdOiBvYmplY3R9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFzeW5jIGxvb2t1cChyZWNvcmQsIHJlc291cmNlSUQsIHByb3BOYW1lLCBnZXR0ZXIpIHtcclxuICAgIGlmIChyZXNvdXJjZUlEKSB7XHJcbiAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlW2dldHRlcl0ocmVzb3VyY2VJRCwgKGVyciwgb2JqZWN0KSA9PiByZXNvbHZlKG9iamVjdCkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChvYmplY3QpIHtcclxuICAgICAgICByZWNvcmRbcHJvcE5hbWVdID0gb2JqZWN0LnJvd0lEO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==