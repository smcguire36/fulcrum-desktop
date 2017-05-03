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

      yield _this2.finish();

      const message = (0, _util.format)(_this2.finished + ' %s | %s | %s', _this2.syncLabel.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this2.progress({ message, count: objects.length, total: objects.length });

      if (data.next_sequence) {
        yield _this2.download(account, lastSync, data.next_sequence, state);
      } else {
        yield state.update();
      }
    })();
  }
}
exports.default = DownloadSequence;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUEFHRV9TSVpFIiwiRG93bmxvYWRTZXF1ZW5jZSIsImNvbnN0cnVjdG9yIiwiZm9ybSIsImFyZ3MiLCJwYWdlU2l6ZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jUmVzb3VyY2VTY29wZSIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJsYXN0U3luYyIsImZldGNoT2JqZWN0cyIsImFjY291bnQiLCJzZXF1ZW5jZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsInByb2Nlc3MiLCJvYmplY3QiLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJydW4iLCJkYXRhU291cmNlIiwic3RhdGUiLCJjaGVja1N5bmNTdGF0ZSIsIm5lZWRzVXBkYXRlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwiYmVnaW5GZXRjaFRpbWUiLCJEYXRlIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJibHVlIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZGF0YSIsIkpTT04iLCJwYXJzZSIsImJvZHkiLCJvYmplY3RzIiwiZGIiLCJub3ciLCJwcm9jZXNzaW5nIiwiY291bnQiLCJ0b3RhbCIsImxlbmd0aCIsInRyYW5zYWN0aW9uIiwiaW5kZXgiLCJ0b3RhbFRpbWUiLCJmaW5pc2hlZCIsImN5YW4iLCJuZXh0X3NlcXVlbmNlIiwidXBkYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBLE1BQU1BLFlBQVksSUFBbEI7O0FBRWUsTUFBTUMsZ0JBQU4sd0JBQW9DO0FBQ2pEQyxvQkFBNkI7QUFBQSxRQUFqQixFQUFDQyxJQUFELEVBQWlCO0FBQUEsUUFBUEMsSUFBTzs7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TThCLE1BQU4sRUFBTjtBQUNEO0FBbkRnRDtBQW9EbEQ7QUFoSGdEO2tCQUE5QjNELGdCIiwiZmlsZSI6ImRvd25sb2FkLXNlcXVlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCB7Zm9ybWF0fSBmcm9tICd1dGlsJztcblxuY29uc3QgUEFHRV9TSVpFID0gMTAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRTZXF1ZW5jZSBleHRlbmRzIFRhc2sge1xuICBjb25zdHJ1Y3Rvcih7Zm9ybSwgLi4uYXJnc30pIHtcbiAgICBzdXBlcihhcmdzKTtcblxuICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gIH1cblxuICBnZXQgcGFnZVNpemUoKSB7XG4gICAgcmV0dXJuIFBBR0VfU0laRTtcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VOYW1lKCkge1xuICB9XG5cbiAgZ2V0IHN5bmNSZXNvdXJjZVNjb3BlKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XG4gIH1cblxuICBnZXQgcmVzb3VyY2VOYW1lKCkge1xuICB9XG5cbiAgZ2V0IGxhc3RTeW5jKCkge1xuICB9XG5cbiAgZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSkge1xuICB9XG5cbiAgZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhY2NvdW50LCBhdHRyaWJ1dGVzKSB7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcykge1xuICB9XG5cbiAgYXN5bmMgZmluaXNoKCkge1xuICB9XG5cbiAgZmFpbChhY2NvdW50LCByZXN1bHRzKSB7XG4gICAgY29uc29sZS5sb2coYWNjb3VudC5vcmdhbml6YXRpb25OYW1lLmdyZWVuLCAnZmFpbGVkJy5yZWQpO1xuICB9XG5cbiAgYXN5bmMgcnVuKHthY2NvdW50LCBkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZShhY2NvdW50LCB0aGlzLnN5bmNSZXNvdXJjZU5hbWUsIHRoaXMuc3luY1Jlc291cmNlU2NvcGUpO1xuXG4gICAgaWYgKCFzdGF0ZS5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RTeW5jID0gdGhpcy5sYXN0U3luYztcblxuICAgIGNvbnN0IHNlcXVlbmNlID0gbGFzdFN5bmMgPyBsYXN0U3luYy5nZXRUaW1lKCkgOiBudWxsO1xuXG4gICAgdGhpcy5kYXRhU291cmNlID0gZGF0YVNvdXJjZTtcblxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWQoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgY29uc3QgYmVnaW5GZXRjaFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWV9KTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpO1xuXG4gICAgY29uc3QgdG90YWxGZXRjaFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGJlZ2luRmV0Y2hUaW1lLmdldFRpbWUoKTtcblxuICAgIGlmIChyZXN1bHRzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgdGhpcy5mYWlsKGFjY291bnQsIHJlc3VsdHMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHJlc3VsdHMuYm9keSk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gZGF0YVt0aGlzLnJlc291cmNlTmFtZV07XG5cbiAgICBjb25zdCBkYiA9IGFjY291bnQuZGI7XG5cbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGF3YWl0IGRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBvYmplY3RzW2luZGV4XTtcblxuICAgICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5vdy5nZXRUaW1lKCk7XG5cbiAgICBhd2FpdCB0aGlzLmZpbmlzaCgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcyB8ICVzIHwgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbEZldGNoVGltZSArICdtcycpLmN5YW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxUaW1lICsgJ21zJykucmVkKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBpZiAoZGF0YS5uZXh0X3NlcXVlbmNlKSB7XG4gICAgICBhd2FpdCB0aGlzLmRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBkYXRhLm5leHRfc2VxdWVuY2UsIHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgc3RhdGUudXBkYXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=