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
      let nextSequence = sequence || 0;

      while (nextSequence != null) {
        nextSequence = yield _this2.downloadPage(account, lastSync, nextSequence, state);

        yield account.save();
      }

      yield state.update();
      yield _this2.finish();
    })();
  }

  downloadPage(account, lastSync, sequence, state) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      _this3.progress({ message: _this3.downloading + ' ' + _this3.syncLabel.blue });

      const results = yield _this3.fetchObjects(account, lastSync, sequence);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      if (results.statusCode !== 200) {
        _this3.fail(account, results);
        return null;
      }

      const data = JSON.parse(results.body);

      const objects = data[_this3.resourceName];

      const db = account.db;

      let now = new Date();

      _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _this3.findOrCreate(database, account, attributes);

            yield _this3.process(object, attributes);

            _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      const message = (0, _util.format)(_this3.finished + ' %s | %s | %s', _this3.syncLabel.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this3.progress({ message, count: objects.length, total: objects.length });

      return data.next_sequence;
    })();
  }
}
exports.default = DownloadSequence;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUEFHRV9TSVpFIiwiRG93bmxvYWRTZXF1ZW5jZSIsImNvbnN0cnVjdG9yIiwiZm9ybSIsImFyZ3MiLCJwYWdlU2l6ZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jUmVzb3VyY2VTY29wZSIsInN5bmNMYWJlbCIsIm5hbWUiLCJyZXNvdXJjZU5hbWUiLCJsYXN0U3luYyIsImZldGNoT2JqZWN0cyIsImFjY291bnQiLCJzZXF1ZW5jZSIsImZpbmRPckNyZWF0ZSIsImRhdGFiYXNlIiwiYXR0cmlidXRlcyIsInByb2Nlc3MiLCJvYmplY3QiLCJmaW5pc2giLCJmYWlsIiwicmVzdWx0cyIsImNvbnNvbGUiLCJsb2ciLCJvcmdhbml6YXRpb25OYW1lIiwiZ3JlZW4iLCJyZWQiLCJydW4iLCJkYXRhU291cmNlIiwic3RhdGUiLCJjaGVja1N5bmNTdGF0ZSIsIm5lZWRzVXBkYXRlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRQYWdlIiwic2F2ZSIsInVwZGF0ZSIsImJlZ2luRmV0Y2hUaW1lIiwiRGF0ZSIsInByb2dyZXNzIiwibWVzc2FnZSIsImRvd25sb2FkaW5nIiwiYmx1ZSIsInRvdGFsRmV0Y2hUaW1lIiwic3RhdHVzQ29kZSIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImluZGV4IiwidG90YWxUaW1lIiwiZmluaXNoZWQiLCJjeWFuIiwibmV4dF9zZXF1ZW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxZQUFZLElBQWxCOztBQUVlLE1BQU1DLGdCQUFOLHdCQUFvQztBQUNqREMsb0JBQTZCO0FBQUEsUUFBakIs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QWdCLGVBQXZCLEVBQ08sT0FBS3JELFNBQUwsQ0FBZW9DLElBRHRCLEVBRU8sQ0FBQ0MsaUJBQWlCLElBQWxCLEVBQXdCaUIsSUFGL0IsRUFHTyxDQUFDRixZQUFZLElBQWIsRUFBbUJqQyxHQUgxQixDQUFoQjs7QUFLQSxhQUFLYyxRQUFMLENBQWMsRUFBQ0MsT0FBRCxFQUFVYSxPQUFPSixRQUFRTSxNQUF6QixFQUFpQ0QsT0FBT0wsUUFBUU0sTUFBaEQsRUFBZDs7QUFFQSxhQUFPVixLQUFLZ0IsYUFBWjtBQTdDcUQ7QUE4Q3REO0FBdkhnRDtrQkFBOUI5RCxnQiIsImZpbGUiOiJkb3dubG9hZC1zZXF1ZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IFBBR0VfU0laRSA9IDEwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkU2VxdWVuY2UgZXh0ZW5kcyBUYXNrIHtcbiAgY29uc3RydWN0b3Ioe2Zvcm0sIC4uLmFyZ3N9KSB7XG4gICAgc3VwZXIoYXJncyk7XG5cbiAgICB0aGlzLmZvcm0gPSBmb3JtO1xuICB9XG5cbiAgZ2V0IHBhZ2VTaXplKCkge1xuICAgIHJldHVybiBQQUdFX1NJWkU7XG4gIH1cblxuICBnZXQgc3luY1Jlc291cmNlTmFtZSgpIHtcbiAgfVxuXG4gIGdldCBzeW5jUmVzb3VyY2VTY29wZSgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldCBzeW5jTGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5uYW1lO1xuICB9XG5cbiAgZ2V0IHJlc291cmNlTmFtZSgpIHtcbiAgfVxuXG4gIGdldCBsYXN0U3luYygpIHtcbiAgfVxuXG4gIGZldGNoT2JqZWN0cyhhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UpIHtcbiAgfVxuXG4gIGZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcykge1xuICB9XG5cbiAgYXN5bmMgcHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpIHtcbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgfVxuXG4gIGZhaWwoYWNjb3VudCwgcmVzdWx0cykge1xuICAgIGNvbnNvbGUubG9nKGFjY291bnQub3JnYW5pemF0aW9uTmFtZS5ncmVlbiwgJ2ZhaWxlZCcucmVkKTtcbiAgfVxuXG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoYWNjb3VudCwgdGhpcy5zeW5jUmVzb3VyY2VOYW1lLCB0aGlzLnN5bmNSZXNvdXJjZVNjb3BlKTtcblxuICAgIGlmICghc3RhdGUubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0U3luYyA9IHRoaXMubGFzdFN5bmM7XG5cbiAgICBjb25zdCBzZXF1ZW5jZSA9IGxhc3RTeW5jID8gbGFzdFN5bmMuZ2V0VGltZSgpIDogbnVsbDtcblxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2U7XG5cbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGxldCBuZXh0U2VxdWVuY2UgPSBzZXF1ZW5jZSB8fCAwO1xuXG4gICAgd2hpbGUgKG5leHRTZXF1ZW5jZSAhPSBudWxsKSB7XG4gICAgICBuZXh0U2VxdWVuY2UgPSBhd2FpdCB0aGlzLmRvd25sb2FkUGFnZShhY2NvdW50LCBsYXN0U3luYywgbmV4dFNlcXVlbmNlLCBzdGF0ZSk7XG5cbiAgICAgIGF3YWl0IGFjY291bnQuc2F2ZSgpO1xuICAgIH1cblxuICAgIGF3YWl0IHN0YXRlLnVwZGF0ZSgpO1xuICAgIGF3YWl0IHRoaXMuZmluaXNoKCk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFBhZ2UoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGNvbnN0IGJlZ2luRmV0Y2hUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XG5cbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5mZXRjaE9iamVjdHMoYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlKTtcblxuICAgIGNvbnN0IHRvdGFsRmV0Y2hUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBiZWdpbkZldGNoVGltZS5nZXRUaW1lKCk7XG5cbiAgICBpZiAocmVzdWx0cy5zdGF0dXNDb2RlICE9PSAyMDApIHtcbiAgICAgIHRoaXMuZmFpbChhY2NvdW50LCByZXN1bHRzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHJlc3VsdHMuYm9keSk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gZGF0YVt0aGlzLnJlc291cmNlTmFtZV07XG5cbiAgICBjb25zdCBkYiA9IGFjY291bnQuZGI7XG5cbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGF3YWl0IGRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBvYmplY3RzW2luZGV4XTtcblxuICAgICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5vdy5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZm9ybWF0KHRoaXMuZmluaXNoZWQgKyAnICVzIHwgJXMgfCAlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNMYWJlbC5ibHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsRmV0Y2hUaW1lICsgJ21zJykuY3lhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbFRpbWUgKyAnbXMnKS5yZWQpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZSwgY291bnQ6IG9iamVjdHMubGVuZ3RoLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIHJldHVybiBkYXRhLm5leHRfc2VxdWVuY2U7XG4gIH1cbn1cbiJdfQ==