'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const PAGE_SIZE = 500;

class DownloadSequence extends _downloadResource2.default {
  constructor(_ref) {
    let { form } = _ref,
        args = _objectWithoutProperties(_ref, ['form']);

    super(args);

    this.form = form;
  }

  get pageSize() {
    return PAGE_SIZE;
  }

  get syncLabel() {
    return this.form.name;
  }

  get lastSync() {}

  finish() {
    return _asyncToGenerator(function* () {})();
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

            yield _this3.process(account, object, attributes);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUEFHRV9TSVpFIiwiRG93bmxvYWRTZXF1ZW5jZSIsImNvbnN0cnVjdG9yIiwiZm9ybSIsImFyZ3MiLCJwYWdlU2l6ZSIsInN5bmNMYWJlbCIsIm5hbWUiLCJsYXN0U3luYyIsImZpbmlzaCIsInJ1biIsImFjY291bnQiLCJkYXRhU291cmNlIiwic3RhdGUiLCJjaGVja1N5bmNTdGF0ZSIsInN5bmNSZXNvdXJjZU5hbWUiLCJzeW5jUmVzb3VyY2VTY29wZSIsIm5lZWRzVXBkYXRlIiwic2VxdWVuY2UiLCJnZXRUaW1lIiwiZG93bmxvYWQiLCJuZXh0U2VxdWVuY2UiLCJkb3dubG9hZFBhZ2UiLCJzYXZlIiwidXBkYXRlIiwiYmVnaW5GZXRjaFRpbWUiLCJEYXRlIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJibHVlIiwicmVzdWx0cyIsImZldGNoT2JqZWN0cyIsInRvdGFsRmV0Y2hUaW1lIiwic3RhdHVzQ29kZSIsImZhaWwiLCJkYXRhIiwiSlNPTiIsInBhcnNlIiwiYm9keSIsIm9iamVjdHMiLCJyZXNvdXJjZU5hbWUiLCJkYiIsIm5vdyIsInByb2Nlc3NpbmciLCJjb3VudCIsInRvdGFsIiwibGVuZ3RoIiwidHJhbnNhY3Rpb24iLCJkYXRhYmFzZSIsImluZGV4IiwiYXR0cmlidXRlcyIsIm9iamVjdCIsImZpbmRPckNyZWF0ZSIsInByb2Nlc3MiLCJ0b3RhbFRpbWUiLCJmaW5pc2hlZCIsImN5YW4iLCJyZWQiLCJuZXh0X3NlcXVlbmNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLFlBQVksR0FBbEI7O0FBRWUsTUFBTUMsZ0JBQU4sb0NBQWdEO0FBQzdEQyxvQkFBNkI7QUFBQSxRQUFqQixFQUFDQyxJQUFELEVBQWlCO0FBQUEsUUFBUEMsSUFBTzs7QUFDM0IsVUFB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QUNuRCxrQkFBTUMsYUFBYVgsUUFBUVUsS0FBUixDQUFuQjs7QUFFQSxrQkFBTUUsU0FBUyxNQUFNLE9BQUtDLFlBQUwsQ0FBa0JKLFFBQWxCLEVBQTRCdEMsT0FBNUIsRUFBcUN3QyxVQUFyQyxDQUFyQjs7QUFFQSxrQkFBTSxPQUFLRyxPQUFMLENBQWEzQyxPQUFiLEVBQXNCeUMsTUFBdEIsRUFBOEJELFVBQTlCLENBQU47O0FBRUEsbUJBQUt4QixRQUFMLENBQWMsRUFBQ0MsU0FBUyxPQUFLZ0IsVUFBTCxHQUFrQixHQUFsQixHQUF3QixPQUFLdEMsU0FBTCxDQUFld0IsSUFBakQsRUFBdURlLE9BQU9LLFFBQVEsQ0FBdEUsRUFBeUVKLE9BQU9OLFFBQVFPLE1BQXhGLEVBQWQ7QUFDRDtBQUNGLFNBVks7O0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBTjs7QUFZQSxZQUFNUSxZQUFZLElBQUk3QixJQUFKLEdBQVdQLE9BQVgsS0FBdUJ3QixJQUFJeEIsT0FBSixFQUF6Qzs7QUFFQSxZQUFNUyxVQUFVLGtCQUFPLE9BQUs0QixRQUFMLEdBQWdCLGVBQXZCLEVBQ08sT0FBS2xELFNBQUwsQ0FBZXdCLElBRHRCLEVBRU8sQ0FBQ0csaUJBQWlCLElBQWxCLEVBQXdCd0IsSUFGL0IsRUFHTyxDQUFDRixZQUFZLElBQWIsRUFBbUJHLEdBSDFCLENBQWhCOztBQUtBLGFBQUsvQixRQUFMLENBQWMsRUFBQ0MsT0FBRCxFQUFVaUIsT0FBT0wsUUFBUU8sTUFBekIsRUFBaUNELE9BQU9OLFFBQVFPLE1BQWhELEVBQWQ7O0FBRUEsYUFBT1gsS0FBS3VCLGFBQVo7QUE3Q3FEO0FBOEN0RDtBQWhHNEQ7a0JBQTFDMUQsZ0IiLCJmaWxlIjoiZG93bmxvYWQtc2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Zvcm1hdH0gZnJvbSAndXRpbCc7XG5pbXBvcnQgRG93bmxvYWRSZXNvdXJjZSBmcm9tICcuL2Rvd25sb2FkLXJlc291cmNlJztcblxuY29uc3QgUEFHRV9TSVpFID0gNTAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFNlcXVlbmNlIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHtmb3JtLCAuLi5hcmdzfSkge1xuICAgIHN1cGVyKGFyZ3MpO1xuXG4gICAgdGhpcy5mb3JtID0gZm9ybTtcbiAgfVxuXG4gIGdldCBwYWdlU2l6ZSgpIHtcbiAgICByZXR1cm4gUEFHRV9TSVpFO1xuICB9XG5cbiAgZ2V0IHN5bmNMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtLm5hbWU7XG4gIH1cblxuICBnZXQgbGFzdFN5bmMoKSB7XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gIH1cblxuICBhc3luYyBydW4oe2FjY291bnQsIGRhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKGFjY291bnQsIHRoaXMuc3luY1Jlc291cmNlTmFtZSwgdGhpcy5zeW5jUmVzb3VyY2VTY29wZSk7XG5cbiAgICBpZiAoIXN0YXRlLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdFN5bmMgPSB0aGlzLmxhc3RTeW5jO1xuXG4gICAgY29uc3Qgc2VxdWVuY2UgPSBsYXN0U3luYyA/IGxhc3RTeW5jLmdldFRpbWUoKSA6IG51bGw7XG5cbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZChhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBsZXQgbmV4dFNlcXVlbmNlID0gc2VxdWVuY2UgfHwgMDtcblxuICAgIHdoaWxlIChuZXh0U2VxdWVuY2UgIT0gbnVsbCkge1xuICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFBhZ2UoYWNjb3VudCwgbGFzdFN5bmMsIG5leHRTZXF1ZW5jZSwgc3RhdGUpO1xuXG4gICAgICBhd2FpdCBhY2NvdW50LnNhdmUoKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzdGF0ZS51cGRhdGUoKTtcbiAgICBhd2FpdCB0aGlzLmZpbmlzaCgpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRQYWdlKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBiZWdpbkZldGNoVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZmV0Y2hPYmplY3RzKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSk7XG5cbiAgICBjb25zdCB0b3RhbEZldGNoVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gYmVnaW5GZXRjaFRpbWUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKHJlc3VsdHMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICB0aGlzLmZhaWwoYWNjb3VudCwgcmVzdWx0cyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyZXN1bHRzLmJvZHkpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IGRhdGFbdGhpcy5yZXNvdXJjZU5hbWVdO1xuXG4gICAgY29uc3QgZGIgPSBhY2NvdW50LmRiO1xuXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBhd2FpdCBkYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucHJvY2VzcyhhY2NvdW50LCBvYmplY3QsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBub3cuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcyB8ICVzIHwgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbEZldGNoVGltZSArICdtcycpLmN5YW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxUaW1lICsgJ21zJykucmVkKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICByZXR1cm4gZGF0YS5uZXh0X3NlcXVlbmNlO1xuICB9XG59XG4iXX0=