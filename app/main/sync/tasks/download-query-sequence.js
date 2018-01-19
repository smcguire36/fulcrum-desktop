'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tempy = require('tempy');

var _tempy2 = _interopRequireDefault(_tempy);

var _jsonseq = require('../../../jsonseq');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const QUERY_PAGE_SIZE = 20000;

class DownloadQuerySequence extends _downloadResource2.default {
  get useRestAPI() {
    return true;
  }

  run({ dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const state = yield _this.checkSyncState();

      if (!state.needsUpdate) {
        return;
      }

      const lastSync = _this.lastSync;

      const sequence = lastSync ? lastSync.getTime() : null;

      _this.dataSource = dataSource;

      yield _this.download(lastSync, sequence, state);
    })();
  }

  download(lastSync, sequence, state) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let nextSequence = sequence || 0;

      while (nextSequence != null) {
        if (_this2.useRestAPI && lastSync != null) {
          nextSequence = yield _this2.downloadRestAPIPage(lastSync, nextSequence, state);
        } else {
          nextSequence = yield _this2.downloadQueryAPIPage(lastSync, nextSequence, state);
        }

        yield _this2.account.save();
      }

      yield state.update();
      yield _this2.finish();
    })();
  }

  downloadRestAPIPage(lastSync, sequence, state) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const beginFetchTime = new Date();

      _this3.progress({ message: _this3.downloading + ' ' + _this3.syncLabel.blue });

      const results = yield _this3.fetchObjects(lastSync, sequence);

      const totalFetchTime = new Date().getTime() - beginFetchTime.getTime();

      if (results.statusCode !== 200) {
        _this3.fail(results);
        return null;
      }

      const data = JSON.parse(results.body);

      const objects = data[_this3.resourceName];

      const db = _this3.db;

      let now = new Date();

      _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: 0, total: objects.length });

      yield db.transaction((() => {
        var _ref = _asyncToGenerator(function* (database) {
          for (let index = 0; index < objects.length; ++index) {
            const attributes = objects[index];

            const object = yield _this3.findOrCreate(database, attributes);

            yield _this3.process(object, attributes);

            _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: index + 1, total: objects.length });
          }
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      const totalTime = new Date().getTime() - now.getTime();

      const message = (0, _util.format)(_this3.finished + ' %s | %s | %s', _this3.syncLabel.blue, (totalFetchTime + 'ms').cyan, (totalTime + 'ms').red);

      _this3.progress({ message, count: objects.length, total: objects.length });

      return data.next_sequence;
    })();
  }

  downloadQueryAPIPage(lastSync, sequence, state) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const sql = _this4.generateQuery(sequence || 0, QUERY_PAGE_SIZE);

      const options = _client2.default.getQueryURL(_this4.account, sql);

      const filePath = _tempy2.default.file({ extension: 'jsonseq' });

      _this4.progress({ message: _this4.downloading + ' ' + _this4.syncLabel.blue });

      yield _this4.downloadQuery(options, filePath);

      const { count, lastObject } = yield _this4.processQueryResponse(filePath);

      const message = (0, _util.format)(_this4.finished + ' %s', _this4.syncLabel.blue);

      _this4.progress({ message, count: count, total: -1 });

      if (count >= QUERY_PAGE_SIZE) {
        return Math.ceil(lastObject.updatedAt.getTime() - 1);
      }

      return null;
    })();
  }

  processQueryResponse(filePath) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      _this5.progress({ message: _this5.processing + ' ' + _this5.syncLabel.blue, count: 0, total: -1 });

      let index = 0;
      let lastObject = null;

      yield _this5.db.transaction((() => {
        var _ref2 = _asyncToGenerator(function* (database) {
          yield new Promise(function (resolve, reject) {
            const onObject = function (json, done) {
              if (json.row) {
                _this5.processQueryObject(json, database, function (object) {
                  lastObject = object;
                  _this5.progress({ message: _this5.processing + ' ' + _this5.syncLabel.blue, count: index + 1, total: -1 });
                  ++index;
                  done();
                });
              } else {
                done();
              }
            };

            const onInvalid = function (data, done) {
              console.error('Invalid', data && data.toString());
              done(new Error('invalid JSON sequence'));
            };

            const onTruncated = function (data, done) {
              console.error('Truncated:', data && data.toString());
              done(new Error('truncated JSON sequence'));
            };

            const onEnd = function () {
              resolve();
            };

            const onError = function (err) {
              reject(err);
            };

            (0, _jsonseq.parseFile)(filePath, { onObject, onInvalid, onTruncated }).on('end', onEnd).on('error', onError);
          });
        });

        return function (_x2) {
          return _ref2.apply(this, arguments);
        };
      })());

      return { count: index, lastObject };
    })();
  }

  processQueryObject(attributes, database, done) {
    this.processObjectAsync(attributes, database).then(done).catch(done);
  }

  processObjectAsync(json, database) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const attributes = _this6.attributesForQueryRow(json.row);

      const object = yield _this6.findOrCreate(database, attributes);

      yield _this6.process(object, attributes);

      return object;
    })();
  }

  downloadQuery(options, to) {
    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        const rq = _client2.default._request(options).pipe(_fs2.default.createWriteStream(to));
        rq.on('close', function () {
          return resolve(rq);
        });
        rq.on('error', reject);
      });
    })();
  }

  finish() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      yield _this7.account.save();
    })();
  }
}
exports.default = DownloadQuerySequence;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsInJ1biIsImRhdGFTb3VyY2UiLCJzdGF0ZSIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJsYXN0U3luYyIsInNlcXVlbmNlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRSZXN0QVBJUGFnZSIsImRvd25sb2FkUXVlcnlBUElQYWdlIiwiYWNjb3VudCIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJiZWdpbkZldGNoVGltZSIsIkRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJyZXN1bHRzIiwiZmV0Y2hPYmplY3RzIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZmFpbCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsInJlc291cmNlTmFtZSIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwicHJvY2VzcyIsInRvdGFsVGltZSIsImZpbmlzaGVkIiwiY3lhbiIsInJlZCIsIm5leHRfc2VxdWVuY2UiLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwiZG93bmxvYWRRdWVyeSIsImxhc3RPYmplY3QiLCJwcm9jZXNzUXVlcnlSZXNwb25zZSIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0Iiwib25JbnZhbGlkIiwiY29uc29sZSIsImVycm9yIiwidG9TdHJpbmciLCJFcnJvciIsIm9uVHJ1bmNhdGVkIiwib25FbmQiLCJvbkVycm9yIiwiZXJyIiwib24iLCJwcm9jZXNzT2JqZWN0QXN5bmMiLCJ0aGVuIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJ0byIsInJxIiwiX3JlcXVlc3QiLCJwaXBlIiwiY3JlYXRlV3JpdGVTdHJlYW0iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixLQUF4Qjs7QUFFZSxNQUFNQyxxQkFBTixvQ0FBcUQ7QUFDbEUsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUVLQyxLQUFOLENBQVUsRUFBQ0MsVUFBRCxFQUFWLEVBQXdCO0FBQUE7O0FBQUE7QUFDdEIsWUFBTUMsUUFBUSxNQUFNLE1BQUtDLGNBQUwsRUFBcEI7O0FBRUEsVUFBSSxDQUFDRCxNQUFNRSxXQUFYLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBRUQsWUFBTUMsV0FBVyxNQUFLQSxRQUF0Qjs7QUFFQSxZQUFNQyxXQUFXRCxXQUFXQSxTQUFTRSxPQUFULEVBQVgsR0FBZ0MsSUFBakQ7O0FBRUEsWUFBS04sVUFBTCxHQUFrQkEsVUFBbEI7O0FBRUEsWUFBTSxNQUFLTyxRQUFMLENBQWNILFFBQWQsRUFBd0JDLFFBQXhCLEVBQWtDSixLQUFsQyxDQUFOO0FBYnNCO0FBY3ZCOztBQUVLTSxVQUFOLENBQWVILFFBQWYsRUFBeUJDLFFBQXpCLEVBQW1DSixLQUFuQyxFQUEwQztBQUFBOztBQUFBO0FBQ3hDLFVBQUlPLGVBQWVILFlBQVksQ0FBL0I7O0FBRUEsYUFBT0csZ0JBQWdCLElBQXZCLEVBQTZCO0FBQzNCLFlBQUksT0FBS1YsVUFBTCxJQUFtQk0sWUFBWSxJQUFu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Y0FBTXFCLEtBQUssaUJBQU9DLFFBQVAsQ0FBZ0JuQyxPQUFoQixFQUF5Qm9DLElBQXpCLENBQThCLGFBQUdDLGlCQUFILENBQXFCSixFQUFyQixDQUE5QixDQUFYO0FBQ0FDLFdBQUdOLEVBQUgsQ0FBTSxPQUFOLEVBQWU7QUFBQSxpQkFBTWhCLFFBQVFzQixFQUFSLENBQU47QUFBQSxTQUFmO0FBQ0FBLFdBQUdOLEVBQUgsQ0FBTSxPQUFOLEVBQWVmLE1BQWY7QUFDRCxPQUpNLENBQVA7QUFEK0I7QUFNaEM7O0FBRUtwRCxRQUFOLEdBQWU7QUFBQTs7QUFBQTtBQUNiLFlBQU0sT0FBS0gsT0FBTCxDQUFhQyxJQUFiLEVBQU47QUFEYTtBQUVkO0FBdkxpRTtrQkFBL0NmLHFCIiwiZmlsZSI6ImRvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUmVzb3VyY2UgZnJvbSAnLi9kb3dubG9hZC1yZXNvdXJjZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB0ZW1weSBmcm9tICd0ZW1weSc7XG5pbXBvcnQgeyBwYXJzZUZpbGUgfSBmcm9tICcuLi8uLi8uLi9qc29uc2VxJztcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBRVUVSWV9QQUdFX1NJWkUgPSAyMDAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XG4gIGdldCB1c2VSZXN0QVBJKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYXN5bmMgcnVuKHtkYXRhU291cmNlfSkge1xuICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZSgpO1xuXG4gICAgaWYgKCFzdGF0ZS5uZWVkc1VwZGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RTeW5jID0gdGhpcy5sYXN0U3luYztcblxuICAgIGNvbnN0IHNlcXVlbmNlID0gbGFzdFN5bmMgPyBsYXN0U3luYy5nZXRUaW1lKCkgOiBudWxsO1xuXG4gICAgdGhpcy5kYXRhU291cmNlID0gZGF0YVNvdXJjZTtcblxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWQobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZChsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgbGV0IG5leHRTZXF1ZW5jZSA9IHNlcXVlbmNlIHx8IDA7XG5cbiAgICB3aGlsZSAobmV4dFNlcXVlbmNlICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnVzZVJlc3RBUEkgJiYgbGFzdFN5bmMgIT0gbnVsbCkge1xuICAgICAgICBuZXh0U2VxdWVuY2UgPSBhd2FpdCB0aGlzLmRvd25sb2FkUmVzdEFQSVBhZ2UobGFzdFN5bmMsIG5leHRTZXF1ZW5jZSwgc3RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5QVBJUGFnZShsYXN0U3luYywgbmV4dFNlcXVlbmNlLCBzdGF0ZSk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMuYWNjb3VudC5zYXZlKCk7XG4gICAgfVxuXG4gICAgYXdhaXQgc3RhdGUudXBkYXRlKCk7XG4gICAgYXdhaXQgdGhpcy5maW5pc2goKTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkUmVzdEFQSVBhZ2UobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGNvbnN0IGJlZ2luRmV0Y2hUaW1lID0gbmV3IERhdGUoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XG5cbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgdGhpcy5mZXRjaE9iamVjdHMobGFzdFN5bmMsIHNlcXVlbmNlKTtcblxuICAgIGNvbnN0IHRvdGFsRmV0Y2hUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBiZWdpbkZldGNoVGltZS5nZXRUaW1lKCk7XG5cbiAgICBpZiAocmVzdWx0cy5zdGF0dXNDb2RlICE9PSAyMDApIHtcbiAgICAgIHRoaXMuZmFpbChyZXN1bHRzKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBKU09OLnBhcnNlKHJlc3VsdHMuYm9keSk7XG5cbiAgICBjb25zdCBvYmplY3RzID0gZGF0YVt0aGlzLnJlc291cmNlTmFtZV07XG5cbiAgICBjb25zdCBkYiA9IHRoaXMuZGI7XG5cbiAgICBsZXQgbm93ID0gbmV3IERhdGUoKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIGF3YWl0IGRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBvYmplY3RzW2luZGV4XTtcblxuICAgICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCB0b3RhbFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5vdy5nZXRUaW1lKCk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZm9ybWF0KHRoaXMuZmluaXNoZWQgKyAnICVzIHwgJXMgfCAlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNMYWJlbC5ibHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsRmV0Y2hUaW1lICsgJ21zJykuY3lhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbFRpbWUgKyAnbXMnKS5yZWQpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZSwgY291bnQ6IG9iamVjdHMubGVuZ3RoLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcblxuICAgIHJldHVybiBkYXRhLm5leHRfc2VxdWVuY2U7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFF1ZXJ5QVBJUGFnZShsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgY29uc3Qgc3FsID0gdGhpcy5nZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlIHx8IDAsIFFVRVJZX1BBR0VfU0laRSk7XG5cbiAgICBjb25zdCBvcHRpb25zID0gQ2xpZW50LmdldFF1ZXJ5VVJMKHRoaXMuYWNjb3VudCwgc3FsKTtcblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGVtcHkuZmlsZSh7ZXh0ZW5zaW9uOiAnanNvbnNlcSd9KTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XG5cbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkUXVlcnkob3B0aW9ucywgZmlsZVBhdGgpO1xuXG4gICAgY29uc3Qge2NvdW50LCBsYXN0T2JqZWN0fSA9IGF3YWl0IHRoaXMucHJvY2Vzc1F1ZXJ5UmVzcG9uc2UoZmlsZVBhdGgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNMYWJlbC5ibHVlKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBjb3VudCwgdG90YWw6IC0xfSk7XG5cbiAgICBpZiAoY291bnQgPj0gUVVFUllfUEFHRV9TSVpFKSB7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKGxhc3RPYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKSAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1F1ZXJ5UmVzcG9uc2UoZmlsZVBhdGgpIHtcbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogMCwgdG90YWw6IC0xfSk7XG5cbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBsYXN0T2JqZWN0ID0gbnVsbDtcblxuICAgIGF3YWl0IHRoaXMuZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRhdGFiYXNlKSA9PiB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IG9uT2JqZWN0ID0gKGpzb24sIGRvbmUpID0+IHtcbiAgICAgICAgICBpZiAoanNvbi5yb3cpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1F1ZXJ5T2JqZWN0KGpzb24sIGRhdGFiYXNlLCAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGxhc3RPYmplY3QgPSBvYmplY3Q7XG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiAtMX0pO1xuICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkludmFsaWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQnLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgZG9uZShuZXcgRXJyb3IoJ2ludmFsaWQgSlNPTiBzZXF1ZW5jZScpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblRydW5jYXRlZCA9IChkYXRhLCBkb25lKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVHJ1bmNhdGVkOicsIGRhdGEgJiYgZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICBkb25lKG5ldyBFcnJvcigndHJ1bmNhdGVkIEpTT04gc2VxdWVuY2UnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGFyc2VGaWxlKGZpbGVQYXRoLCB7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9KVxuICAgICAgICAgIC5vbignZW5kJywgb25FbmQpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge2NvdW50OiBpbmRleCwgbGFzdE9iamVjdH07XG4gIH1cblxuICBwcm9jZXNzUXVlcnlPYmplY3QoYXR0cmlidXRlcywgZGF0YWJhc2UsIGRvbmUpIHtcbiAgICB0aGlzLnByb2Nlc3NPYmplY3RBc3luYyhhdHRyaWJ1dGVzLCBkYXRhYmFzZSkudGhlbihkb25lKS5jYXRjaChkb25lKTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NPYmplY3RBc3luYyhqc29uLCBkYXRhYmFzZSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhqc29uLnJvdyk7XG5cbiAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcyk7XG5cbiAgICBhd2FpdCB0aGlzLnByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKTtcblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJxID0gQ2xpZW50Ll9yZXF1ZXN0KG9wdGlvbnMpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odG8pKTtcbiAgICAgIHJxLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocnEpKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxufVxuIl19