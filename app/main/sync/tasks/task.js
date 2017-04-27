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
//# sourceMappingURL=task.js.map