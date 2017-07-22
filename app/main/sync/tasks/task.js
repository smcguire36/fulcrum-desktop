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

var _fulcrumCore = require('fulcrum-core');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvdGFzay5qcyJdLCJuYW1lcyI6WyJUYXNrIiwiY29uc3RydWN0b3IiLCJzeW5jaHJvbml6ZXIiLCJzeW5jU3RhdGUiLCJfc3luY2hyb25pemVyIiwiX3N5bmNTdGF0ZSIsImdldFN5bmNTdGF0ZSIsInJlc291cmNlIiwic2NvcGUiLCJmaW5kIiwib2JqZWN0IiwiY2hlY2tTeW5jU3RhdGUiLCJhY2NvdW50Iiwib2xkU3RhdGUiLCJmaW5kU3luY1N0YXRlIiwibmV3U3RhdGUiLCJuZWVkc1VwZGF0ZSIsImhhc2giLCJ1cGRhdGUiLCJzYXZlIiwic3RhdGUiLCJleGVjdXRlIiwiZGF0YVNvdXJjZSIsInN5bmNOYW1lIiwic3luY1Jlc291cmNlTmFtZSIsInRyaWdnZXIiLCJ0YXNrIiwicmVzdWx0IiwicnVuIiwiYmFyIiwiY29uc29sZSIsImxvZyIsIm5hbWUiLCJhcmdzIiwiZW1pdCIsImRvd25sb2FkaW5nIiwieWVsbG93IiwicHJvY2Vzc2luZyIsImN5YW4iLCJmaW5pc2hlZCIsImdyZWVuIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiY291bnQiLCJ0b3RhbCIsImZtdCIsIm9wdGlvbnMiLCJ3aWR0aCIsImNvbXBsZXRlIiwiaW5jb21wbGV0ZSIsImNsZWFyIiwidGljayIsIl9tZXNzYWdlIiwiY3VyciIsInJlbmRlciIsIm1hcmtEZWxldGVkT2JqZWN0cyIsImxvY2FsT2JqZWN0cyIsIm5ld09iamVjdHMiLCJ0eXBlTmFtZSIsInByb3BOYW1lIiwib2JqZWN0RXhpc3RzT25TZXJ2ZXIiLCJhdHRyaWJ1dGVzIiwiaWQiLCJpc0NoYW5nZWQiLCJfZGVsZXRlZEF0IiwiRGF0ZSIsImxvb2t1cCIsInJlY29yZCIsInJlc291cmNlSUQiLCJnZXR0ZXIiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVyciIsInJvd0lEIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRWUsTUFBTUEsSUFBTixDQUFXO0FBQ3hCQyxjQUFZLEVBQUNDLFlBQUQsRUFBZUMsU0FBZixFQUFaLEVBQXVDO0FBQ3JDLFNBQUtDLGFBQUwsR0FBcUJGLFlBQXJCO0FBQ0EsU0FBS0csVUFBTCxHQUFrQkYsU0FBbEI7QUFDRDs7QUFFRCxNQUFJRCxZQUFKLEdBQW1CO0FBQ2pCLFdBQU8sS0FBS0UsYUFBWjtBQUNEOztBQUVERSxlQUFhQyxRQUFiLEVBQXVCQyxRQUFRLElBQS9CLEVBQXFDO0FBQ25DLFdBQU8sS0FBS0gsVUFBTCxDQUFnQkksSUFBaEIsQ0FBc0JDLE1BQUQsSUFBWTtBQUN0QyxhQUFPQSxPQUFPSCxRQUFQLEtBQW9CQSxRQUFwQixLQUFrQ0csT0FBT0YsS0FBUCxJQUFnQixJQUFoQixJQUF3QkEsVUFBVSxFQUFuQyxJQUEwQ0UsT0FBT0YsS0FBUCxLQUFpQkEsS0FBNUYsQ0FBUDtBQUNELEtBRk0sQ0FBUDtBQUdEOztBQUVLRyxnQkFBTixDQUFxQkMsT0FBckIsRUFBOEJMLFFBQTlCLEVBQXdDQyxRQUFRLElBQWhELEVBQXNEO0FBQUE7O0FBQUE7QUFDcEQsWUFBTUssV0FBVyxNQUFNRCxRQUFRRSxhQUFSLENBQXNCLEVBQUNQLFFBQUQsRUFBV0MsT0FBT0EsU0FBUyxFQUEzQixFQUF0QixDQUF2QjtBQUNBLFlBQU1PLFdBQVcsTUFBS1QsWUFBTCxDQUFrQkMsUUFBbEIsRUFBNEJDLFNBQVMsRUFBckMsQ0FBakI7O0FBRUEsVUFBSVEsY0FBYyxJQUFsQjs7QUFFQSxVQUFJSCxZQUFZRSxRQUFaLElBQXdCRixTQUFTSSxJQUFULEtBQWtCRixTQUFTRSxJQUF2RCxFQUE2RDtBQUMzREQsc0JBQWMsS0FBZDtBQUNEOztBQUVELFlBQU1FO0FBQUEscUNBQVMsYUFBWTtBQUN6QixjQUFJTCxZQUFZRSxRQUFoQixFQUEwQjtBQUN4QkYscUJBQVNJLElBQVQsR0FBZ0JGLFNBQVNFLElBQXpCO0FBQ0FKLHFCQUFTTCxLQUFULEdBQWlCSyxTQUFTTCxLQUFULElBQWtCLEVBQW5DOztBQUVBLGtCQUFNSyxTQUFTTSxJQUFULEVBQU47QUFDRDtBQUNGLFNBUEs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFBTjs7QUFTQSxhQUFPLEVBQUVILFdBQUYsRUFBZUksT0FBT1AsUUFBdEIsRUFBZ0NLLE1BQWhDLEVBQVA7QUFuQm9EO0FBb0JyRDs7QUFFS0csU0FBTixDQUFjLEVBQUNULE9BQUQsRUFBVVUsVUFBVixFQUFkLEVBQXFDO0FBQUE7O0FBQUE7QUFDbkMsYUFBS1YsT0FBTCxHQUFlQSxPQUFmOztBQUVBLFlBQU1XLFdBQVcsT0FBS0MsZ0JBQXRCOztBQUVBLFVBQUlELFFBQUosRUFBYztBQUNaLGNBQU0sT0FBS0UsT0FBTCxDQUFjLEdBQUVGLFFBQVMsUUFBekIsRUFBa0MsRUFBQ0csWUFBRCxFQUFsQyxDQUFOO0FBQ0Q7O0FBRUQsWUFBTUMsU0FBUyxNQUFNLE9BQUtDLEdBQUwsQ0FBUyxFQUFDaEIsT0FBRCxFQUFVVSxVQUFWLEVBQVQsQ0FBckI7O0FBRUEsVUFBSSxPQUFLTyxHQUFULEVBQWM7QUFDWkMsZ0JBQVFDLEdBQVIsQ0FBWSxFQUFaO0FBQ0Q7O0FBRUQsVUFBSVIsUUFBSixFQUFjO0FBQ1osY0FBTSxPQUFLRSxPQUFMLENBQWMsR0FBRUYsUUFBUyxTQUF6QixFQUFtQyxFQUFDRyxZQUFELEVBQW5DLENBQU47QUFDRDs7QUFFRCxhQUFPQyxNQUFQO0FBbkJtQztBQW9CcEM7O0FBRURGLFVBQVFPLElBQVIsRUFBY0MsSUFBZCxFQUFvQjtBQUNsQixXQUFPLGNBQUlDLElBQUosQ0FBU0YsSUFBVCxhQUFnQnBCLFNBQVMsS0FBS0EsT0FBOUIsSUFBMENxQixJQUExQyxFQUFQO0FBQ0Q7O0FBRUQsTUFBSUUsV0FBSixHQUFrQjtBQUNoQixXQUFPLE1BQU1DLE1BQWI7QUFDRDs7QUFFRCxNQUFJQyxVQUFKLEdBQWlCO0FBQ2Y7QUFDQSxXQUFPLE1BQU1DLElBQWI7QUFDRDs7QUFFRCxNQUFJQyxRQUFKLEdBQWU7QUFDYixXQUFPLE1BQU1DLEtBQWI7QUFDRDs7QUFFREMsV0FBUyxFQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBaUJDLEtBQWpCLEVBQVQsRUFBa0M7QUFDaEMsUUFBSUMsTUFBTSxFQUFWOztBQUVBLFFBQUlELFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCQyxZQUFNLGtCQUFPLHdCQUFQLEVBQWlDSCxRQUFRRixLQUF6QyxDQUFOO0FBQ0QsS0FGRCxNQUVPLElBQUlHLFNBQVMsSUFBYixFQUFtQjtBQUN4QkUsWUFBTSxrQkFBTyxtREFBUCxFQUE0REgsUUFBUUYsS0FBcEUsQ0FBTjtBQUNELEtBRk0sTUFFQTtBQUNMSyxZQUFNLGtCQUFPLElBQVAsRUFBYUgsUUFBUUYsS0FBckIsQ0FBTjtBQUNEO0FBQ0Q7QUFDQTs7QUFFQSxRQUFJLENBQUMsS0FBS1gsR0FBVixFQUFlO0FBQ2IsWUFBTWlCLFVBQVU7QUFDZEMsZUFBTyxFQURPO0FBRWRILGVBQU9BLFNBQVMsQ0FGRjtBQUdkSSxrQkFBVSxJQUFJUixLQUhBO0FBSWRTLG9CQUFZLEdBSkU7QUFLZEMsZUFBTztBQUxPLE9BQWhCOztBQVFBLFdBQUtyQixHQUFMLEdBQVcsdUJBQWdCZ0IsR0FBaEIsRUFBcUJDLE9BQXJCLENBQVg7QUFDQSxXQUFLakIsR0FBTCxDQUFTc0IsSUFBVCxDQUFjLENBQWQ7QUFDRDs7QUFFRCxTQUFLdEIsR0FBTCxDQUFTZ0IsR0FBVCxHQUFlQSxHQUFmOztBQUVBLFFBQUlELFNBQVMsSUFBYixFQUFtQjtBQUNqQixXQUFLZixHQUFMLENBQVNlLEtBQVQsR0FBaUJBLFNBQVMsQ0FBMUI7QUFDRDs7QUFFRCxRQUFJLEtBQUtRLFFBQUwsS0FBa0JWLE9BQXRCLEVBQStCO0FBQzdCLFdBQUtiLEdBQUwsQ0FBU3dCLElBQVQsR0FBZ0IsQ0FBaEI7QUFDQSxXQUFLeEIsR0FBTCxDQUFTeUIsTUFBVDtBQUNBLFdBQUtGLFFBQUwsR0FBZ0JWLE9BQWhCO0FBQ0Q7O0FBRUQsUUFBSUMsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCLFdBQUtkLEdBQUwsQ0FBU3dCLElBQVQsR0FBZ0JWLEtBQWhCO0FBQ0EsV0FBS2QsR0FBTCxDQUFTeUIsTUFBVDtBQUNEO0FBQ0Y7O0FBRUtDLG9CQUFOLENBQXlCQyxZQUF6QixFQUF1Q0MsVUFBdkMsRUFBbURDLFFBQW5ELEVBQTZEQyxRQUE3RCxFQUF1RTtBQUFBOztBQUFBO0FBQ3JFO0FBQ0EsV0FBSyxNQUFNakQsTUFBWCxJQUFxQjhDLFlBQXJCLEVBQW1DO0FBQ2pDLFlBQUlJLHVCQUF1QixLQUEzQjs7QUFFQSxhQUFLLE1BQU1DLFVBQVgsSUFBeUJKLFVBQXpCLEVBQXFDO0FBQ25DLGNBQUlJLFdBQVdDLEVBQVgsS0FBa0JwRCxPQUFPb0QsRUFBN0IsRUFBaUM7QUFDL0JGLG1DQUF1QixJQUF2QjtBQUNBO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJLENBQUNBLG9CQUFMLEVBQTJCO0FBQ3pCLGdCQUFNRyxZQUFZckQsT0FBT3NELFVBQVAsSUFBcUIsSUFBdkM7O0FBRUF0RCxpQkFBT3NELFVBQVAsR0FBb0J0RCxPQUFPc0QsVUFBUCxHQUFvQnRELE9BQU9zRCxVQUEzQixHQUF3QyxJQUFJQyxJQUFKLEVBQTVEOztBQUVBLGdCQUFNdkQsT0FBT1MsSUFBUCxFQUFOOztBQUVBLGNBQUk0QyxTQUFKLEVBQWU7QUFDYixrQkFBTSxPQUFLdEMsT0FBTCxDQUFjLEdBQUdpQyxRQUFVLFNBQTNCLEVBQXFDLEVBQUMsQ0FBQ0MsWUFBWUQsUUFBYixHQUF3QmhELE1BQXpCLEVBQXJDLENBQU47QUFDRDtBQUNGO0FBQ0Y7QUF2Qm9FO0FBd0J0RTs7QUFFS3dELFFBQU4sQ0FBYUMsTUFBYixFQUFxQkMsVUFBckIsRUFBaUNULFFBQWpDLEVBQTJDVSxNQUEzQyxFQUFtRDtBQUFBOztBQUFBO0FBQ2pELFVBQUlELFVBQUosRUFBZ0I7QUFDZCxjQUFNMUQsU0FBUyxNQUFNLElBQUk0RCxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFhO0FBQzVDLGlCQUFLakQsVUFBTCxDQUFnQitDLE1BQWhCLEVBQXdCRCxVQUF4QixFQUFvQyxVQUFDSSxHQUFELEVBQU05RCxNQUFOO0FBQUEsbUJBQWlCNkQsUUFBUTdELE1BQVIsQ0FBakI7QUFBQSxXQUFwQztBQUNELFNBRm9CLENBQXJCOztBQUlBLFlBQUlBLE1BQUosRUFBWTtBQUNWeUQsaUJBQU9SLFFBQVAsSUFBbUJqRCxPQUFPK0QsS0FBMUI7QUFDRDtBQUNGO0FBVGdEO0FBVWxEO0FBN0p1QjtrQkFBTHpFLEkiLCJmaWxlIjoidGFzay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9ncmVzc0JhciBmcm9tICdwcm9ncmVzcyc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgYXBwIGZyb20gJy4uLy4uL2FwcCc7XG5pbXBvcnQgeyBEYXRlVXRpbHMgfSBmcm9tICdmdWxjcnVtLWNvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXNrIHtcbiAgY29uc3RydWN0b3Ioe3N5bmNocm9uaXplciwgc3luY1N0YXRlfSkge1xuICAgIHRoaXMuX3N5bmNocm9uaXplciA9IHN5bmNocm9uaXplcjtcbiAgICB0aGlzLl9zeW5jU3RhdGUgPSBzeW5jU3RhdGU7XG4gIH1cblxuICBnZXQgc3luY2hyb25pemVyKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jaHJvbml6ZXI7XG4gIH1cblxuICBnZXRTeW5jU3RhdGUocmVzb3VyY2UsIHNjb3BlID0gbnVsbCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jU3RhdGUuZmluZCgob2JqZWN0KSA9PiB7XG4gICAgICByZXR1cm4gb2JqZWN0LnJlc291cmNlID09PSByZXNvdXJjZSAmJiAoKG9iamVjdC5zY29wZSA9PSBudWxsICYmIHNjb3BlID09PSAnJykgfHwgb2JqZWN0LnNjb3BlID09PSBzY29wZSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBjaGVja1N5bmNTdGF0ZShhY2NvdW50LCByZXNvdXJjZSwgc2NvcGUgPSBudWxsKSB7XG4gICAgY29uc3Qgb2xkU3RhdGUgPSBhd2FpdCBhY2NvdW50LmZpbmRTeW5jU3RhdGUoe3Jlc291cmNlLCBzY29wZTogc2NvcGUgfHwgJyd9KTtcbiAgICBjb25zdCBuZXdTdGF0ZSA9IHRoaXMuZ2V0U3luY1N0YXRlKHJlc291cmNlLCBzY29wZSB8fCAnJyk7XG5cbiAgICBsZXQgbmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlICYmIG9sZFN0YXRlLmhhc2ggPT09IG5ld1N0YXRlLmhhc2gpIHtcbiAgICAgIG5lZWRzVXBkYXRlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKG9sZFN0YXRlICYmIG5ld1N0YXRlKSB7XG4gICAgICAgIG9sZFN0YXRlLmhhc2ggPSBuZXdTdGF0ZS5oYXNoO1xuICAgICAgICBvbGRTdGF0ZS5zY29wZSA9IG9sZFN0YXRlLnNjb3BlIHx8ICcnO1xuXG4gICAgICAgIGF3YWl0IG9sZFN0YXRlLnNhdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHsgbmVlZHNVcGRhdGUsIHN0YXRlOiBvbGRTdGF0ZSwgdXBkYXRlIH07XG4gIH1cblxuICBhc3luYyBleGVjdXRlKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIHRoaXMuYWNjb3VudCA9IGFjY291bnQ7XG5cbiAgICBjb25zdCBzeW5jTmFtZSA9IHRoaXMuc3luY1Jlc291cmNlTmFtZTtcblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpzdGFydGAsIHt0YXNrOiB0aGlzfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5ydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KTtcblxuICAgIGlmICh0aGlzLmJhcikge1xuICAgICAgY29uc29sZS5sb2coJycpO1xuICAgIH1cblxuICAgIGlmIChzeW5jTmFtZSkge1xuICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAke3N5bmNOYW1lfTpmaW5pc2hgLCB7dGFzazogdGhpc30pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICB0cmlnZ2VyKG5hbWUsIGFyZ3MpIHtcbiAgICByZXR1cm4gYXBwLmVtaXQobmFtZSwge2FjY291bnQ6IHRoaXMuYWNjb3VudCwgLi4uYXJnc30pO1xuICB9XG5cbiAgZ2V0IGRvd25sb2FkaW5nKCkge1xuICAgIHJldHVybiAn8J+YgCAnLnllbGxvdztcbiAgfVxuXG4gIGdldCBwcm9jZXNzaW5nKCkge1xuICAgIC8vIHJldHVybiAn4p6h77iPICcuY3lhbjtcbiAgICByZXR1cm4gJ/CfpJQgJy5jeWFuO1xuICB9XG5cbiAgZ2V0IGZpbmlzaGVkKCkge1xuICAgIHJldHVybiAn8J+YjiAnLmdyZWVuO1xuICB9XG5cbiAgcHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50LCB0b3RhbH0pIHtcbiAgICBsZXQgZm10ID0gJyc7XG5cbiAgICBpZiAodG90YWwgPT09IC0xKSB7XG4gICAgICBmbXQgPSBmb3JtYXQoJyVzICg6Y3VycmVudCkgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKTtcbiAgICB9IGVsc2UgaWYgKGNvdW50ICE9IG51bGwpIHtcbiAgICAgIGZtdCA9IGZvcm1hdCgnJXMgOmJhciA6cGVyY2VudCAoOmN1cnJlbnQvOnRvdGFsKSA6ZXRhcyA6ZWxhcHNlZCcsIG1lc3NhZ2UuZ3JlZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbXQgPSBmb3JtYXQoJyVzJywgbWVzc2FnZS5ncmVlbik7XG4gICAgfVxuICAgIC8vIGNvbnN0IGZtdCA9IGNvdW50ICE9IG51bGwgPyBmb3JtYXQoJyVzIDpiYXIgOnBlcmNlbnQgKDpjdXJyZW50Lzp0b3RhbCkgOmV0YXMgOmVsYXBzZWQnLCBtZXNzYWdlLmdyZWVuKVxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBmb3JtYXQoJyVzJywgbWVzc2FnZS5ncmVlbik7XG5cbiAgICBpZiAoIXRoaXMuYmFyKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgICB3aWR0aDogNDAsXG4gICAgICAgIHRvdGFsOiB0b3RhbCB8fCAxLFxuICAgICAgICBjb21wbGV0ZTogJ+KWhycuZ3JlZW4sXG4gICAgICAgIGluY29tcGxldGU6ICctJyxcbiAgICAgICAgY2xlYXI6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgICB0aGlzLmJhciA9IG5ldyBQcm9ncmVzc0JhcihmbXQsIG9wdGlvbnMpO1xuICAgICAgdGhpcy5iYXIudGljaygwKTtcbiAgICB9XG5cbiAgICB0aGlzLmJhci5mbXQgPSBmbXQ7XG5cbiAgICBpZiAodG90YWwgIT0gbnVsbCkge1xuICAgICAgdGhpcy5iYXIudG90YWwgPSB0b3RhbCB8fCAxO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tZXNzYWdlICE9PSBtZXNzYWdlKSB7XG4gICAgICB0aGlzLmJhci5jdXJyID0gMDtcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xuICAgICAgdGhpcy5fbWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ICE9IG51bGwpIHtcbiAgICAgIHRoaXMuYmFyLmN1cnIgPSBjb3VudDtcbiAgICAgIHRoaXMuYmFyLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIG1hcmtEZWxldGVkT2JqZWN0cyhsb2NhbE9iamVjdHMsIG5ld09iamVjdHMsIHR5cGVOYW1lLCBwcm9wTmFtZSkge1xuICAgIC8vIGRlbGV0ZSBhbGwgb2JqZWN0cyB0aGF0IGRvbid0IGV4aXN0IG9uIHRoZSBzZXJ2ZXIgYW55bW9yZVxuICAgIGZvciAoY29uc3Qgb2JqZWN0IG9mIGxvY2FsT2JqZWN0cykge1xuICAgICAgbGV0IG9iamVjdEV4aXN0c09uU2VydmVyID0gZmFsc2U7XG5cbiAgICAgIGZvciAoY29uc3QgYXR0cmlidXRlcyBvZiBuZXdPYmplY3RzKSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmlkID09PSBvYmplY3QuaWQpIHtcbiAgICAgICAgICBvYmplY3RFeGlzdHNPblNlcnZlciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFvYmplY3RFeGlzdHNPblNlcnZlcikge1xuICAgICAgICBjb25zdCBpc0NoYW5nZWQgPSBvYmplY3QuX2RlbGV0ZWRBdCA9PSBudWxsO1xuXG4gICAgICAgIG9iamVjdC5fZGVsZXRlZEF0ID0gb2JqZWN0Ll9kZWxldGVkQXQgPyBvYmplY3QuX2RlbGV0ZWRBdCA6IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgYXdhaXQgb2JqZWN0LnNhdmUoKTtcblxuICAgICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgICAgYXdhaXQgdGhpcy50cmlnZ2VyKGAkeyB0eXBlTmFtZSB9OmRlbGV0ZWAsIHtbcHJvcE5hbWUgfHwgdHlwZU5hbWVdOiBvYmplY3R9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGxvb2t1cChyZWNvcmQsIHJlc291cmNlSUQsIHByb3BOYW1lLCBnZXR0ZXIpIHtcbiAgICBpZiAocmVzb3VyY2VJRCkge1xuICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5kYXRhU291cmNlW2dldHRlcl0ocmVzb3VyY2VJRCwgKGVyciwgb2JqZWN0KSA9PiByZXNvbHZlKG9iamVjdCkpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChvYmplY3QpIHtcbiAgICAgICAgcmVjb3JkW3Byb3BOYW1lXSA9IG9iamVjdC5yb3dJRDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==