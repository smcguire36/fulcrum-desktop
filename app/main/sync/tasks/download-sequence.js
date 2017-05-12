'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PAGE_SIZE = 1000;

class DownloadSequence extends _task2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get syncResourceName() {}

  get syncResourceScope() {
    return null;
  }

  get syncLabel() {
    return this.form.name;
  }

  get resourceName() {}

  get lastSync() {}

  fetchObjects(account, lastSync, sequence) {}

  findOrCreate(database, account, attributes) {}

  process(object, attributes) {
    return _asyncToGenerator(function* () {})();
  }

  finish() {
    return _asyncToGenerator(function* () {})();
  }

  fail(account, results) {
    console.log(account.organizationName.green, 'failed'.red);
  }

  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const state = yield _this.checkSyncState(account, _this.syncResourceName, _this.syncResourceScope);

      if (!state.needsUpdate) {
        return;
      }

      const lastSync = _this.lastSync;

      const sequence = lastSync ? lastSync.getTime() : null;

      _this.dataSource = dataSource;

      yield _this.download(account, lastSync, sequence, state);
    })();
  }

  download(account, lastSync, sequence, state) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      _this2.progress({ message: _this2.downloading + ' ' + _this2.syncLabel.blue });

      const results = yield _this2.fetchObjects(account, lastSync, sequence);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      if (results.statusCode !== 200) {
        _this2.fail(account, results);
        return;
      }

      const data = JSON.parse(results.body);

      const objects = data[_this2.resourceName];

      const db = account.db;

      let now = new Date();

      _this2.progress({ message: _this2.processing + ' ' + _this2.syncLabel.blue, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _this2.findOrCreate(database, account, attributes);

            yield _this2.process(object, attributes);

            _this2.progress({ message: _this2.processing + ' ' + _this2.syncLabel.blue, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      const message = (0, _util.format)(_this2.finished + ' %s | %s | %s', _this2.syncLabel.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this2.progress({ message, count: objects.length, total: objects.length });

      if (data.next_sequence) {
        yield _this2.download(account, lastSync, data.next_sequence, state);
      } else {
        yield state.update();
        yield _this2.finish();
      }
    })();
  }
}
exports.default = DownloadSequence;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUEFHRV9TSVpFIiwiRG93bmxvYWRTZXF1ZW5jZSIsImNvbnN0cnVjdG9yIiwiZm9ybSIsImFyZ3MiLCJwYWdlU2l6ZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jUmVzb3VyY2VTY29wZSIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJsYXN0U3luYyIsImZldGNoT2JqZWN0cyIsImFjY291bnQiLCJzZXF1ZW5jZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsInByb2Nlc3MiLCJvYmplY3QiLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJydW4iLCJkYXRhU291cmNlIiwic3RhdGUiLCJjaGVja1N5bmNTdGF0ZSIsIm5lZWRzVXBkYXRlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwiYmVnaW5GZXRjaFRpbWUiLCJEYXRlIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJibHVlIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJvYmplY3RzIiwiZGIiLCJub3ciLCJwcm9jZXNzaW5nIiwiY291bnQiLCJ0b3RhbCIsImxlbmd0aCIsInRyYW5zYWN0aW9uIiwiaW5kZXgiLCJ0b3RhbFRpbWUiLCJmaW5pc2hlZCIsImN5YW4iLCJuZXh0X3NlcXVlbmNlIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBLE1BQU1BLFlBQVksSUFBbEI7O0FBRWUsTUFBTUMsZ0JBQU4sd0JBQW9DO0FBQ2pEQyxvQkFBNkI7QUFBQSxRQUFqQixFQUFDQyxJQUFELEVBQWlCO0FBQUEsUUFBUEMsSUFBTzs7QUFD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TUFBTCxFQUFOO0FBQ0Q7QUFsRGdEO0FBbURsRDtBQS9HZ0Q7a0JBQTlCbkIsZ0IiLCJmaWxlIjoiZG93bmxvYWQtc2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGFzayBmcm9tICcuL3Rhc2snO1xuaW1wb3J0IHtmb3JtYXR9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBQQUdFX1NJWkUgPSAxMDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFNlcXVlbmNlIGV4dGVuZHMgVGFzayB7XG4gIGNvbnN0cnVjdG9yKHtmb3JtLCAuLi5hcmdzfSkge1xuICAgIHN1cGVyKGFyZ3MpO1xuXG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgfVxuXG4gIGdldCBwYWdlU2l6ZSgpIHtcbiAgICByZXR1cm4gUEFHRV9TSVpFO1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZU5hbWUoKSB7XG4gIH1cblxuICBnZXQgc3luY1Jlc291cmNlU2NvcGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXQgc3luY0xhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLmZvcm0ubmFtZTtcbiAgfVxuXG4gIGdldCByZXNvdXJjZU5hbWUoKSB7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gIH1cblxuICBmZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKSB7XG4gIH1cblxuICBmaW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpIHtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKSB7XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gIH1cblxuICBmYWlsKGFjY291bnQsIHJlc3VsdHMpIHtcbiAgICBjb25zb2xlLmxvZyhhY2NvdW50Lm9yZ2FuaXphdGlvbk5hbWUuZ3JlZW4sICdmYWlsZWQnLnJlZCk7XG4gIH1cblxuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsIHRoaXMuc3luY1Jlc291cmNlTmFtZSwgdGhpcy5zeW5jUmVzb3VyY2VTY29wZSk7XG5cbiAgICBpZiAoIXN0YXRlLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdFN5bmMgPSB0aGlzLmxhc3RTeW5jO1xuXG4gICAgY29uc3Qgc2VxdWVuY2UgPSBsYXN0U3luYyA/IGxhc3RTeW5jLmdldFRpbWUoKSA6IG51bGw7XG5cbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBiZWdpbkZldGNoVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSk7XG5cbiAgICBjb25zdCB0b3RhbEZldGNoVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gYmVnaW5GZXRjaFRpbWUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKHJlc3VsdHMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICB0aGlzLmZhaWwoYWNjb3VudCwgcmVzdWx0cyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocmVzdWx0cy5ib2R5KTtcblxuICAgIGNvbnN0IG9iamVjdHMgPSBkYXRhW3RoaXMucmVzb3VyY2VOYW1lXTtcblxuICAgIGNvbnN0IGRiID0gYWNjb3VudC5kYjtcblxuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgYXdhaXQgZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRhdGFiYXNlKSA9PiB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb2JqZWN0cy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IHRoaXMuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbm93LmdldFRpbWUoKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMgfCAlcyB8ICVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY0xhYmVsLmJsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxGZXRjaFRpbWUgKyAnbXMnKS5jeWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsVGltZSArICdtcycpLnJlZCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgaWYgKGRhdGEubmV4dF9zZXF1ZW5jZSkge1xuICAgICAgYXdhaXQgdGhpcy5kb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgZGF0YS5uZXh0X3NlcXVlbmNlLCBzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHN0YXRlLnVwZGF0ZSgpO1xuICAgICAgYXdhaXQgdGhpcy5maW5pc2goKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==