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

const QUERY_PAGE_SIZE = 5000;

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
        const rq = _client2.default.rawRequest(options).pipe(_fs2.default.createWriteStream(to));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsInJ1biIsImRhdGFTb3VyY2UiLCJzdGF0ZSIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJsYXN0U3luYyIsInNlcXVlbmNlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRSZXN0QVBJUGFnZSIsImRvd25sb2FkUXVlcnlBUElQYWdlIiwiYWNjb3VudCIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJiZWdpbkZldGNoVGltZSIsIkRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJyZXN1bHRzIiwiZmV0Y2hPYmplY3RzIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZmFpbCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsInJlc291cmNlTmFtZSIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwicHJvY2VzcyIsInRvdGFsVGltZSIsImZpbmlzaGVkIiwiY3lhbiIsInJlZCIsIm5leHRfc2VxdWVuY2UiLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwiZG93bmxvYWRRdWVyeSIsImxhc3RPYmplY3QiLCJwcm9jZXNzUXVlcnlSZXNwb25zZSIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0Iiwib25JbnZhbGlkIiwiY29uc29sZSIsImVycm9yIiwidG9TdHJpbmciLCJFcnJvciIsIm9uVHJ1bmNhdGVkIiwib25FbmQiLCJvbkVycm9yIiwiZXJyIiwib24iLCJwcm9jZXNzT2JqZWN0QXN5bmMiLCJ0aGVuIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJ0byIsInJxIiwicmF3UmVxdWVzdCIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsa0JBQWtCLElBQXhCOztBQUVlLE1BQU1DLHFCQUFOLG9DQUFxRDtBQUNsRSxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxJQUFQO0FBQ0Q7O0FBRUtDLEtBQU4sQ0FBVSxFQUFDQyxVQUFELEVBQVYsRUFBd0I7QUFBQTs7QUFBQTtBQUN0QixZQUFNQyxRQUFRLE1BQU0sTUFBS0MsY0FBTCxFQUFwQjs7QUFFQSxVQUFJLENBQUNELE1BQU1FLFdBQVgsRUFBd0I7QUFDdEI7QUFDRDs7QUFFRCxZQUFNQyxXQUFXLE1BQUtBLFFBQXRCOztBQUVBLFlBQU1DLFdBQVdELFdBQVdBLFNBQVNFLE9BQVQsRUFBWCxHQUFnQyxJQUFqRDs7QUFFQSxZQUFLTixVQUFMLEdBQWtCQSxVQUFsQjs7QUFFQSxZQUFNLE1BQUtPLFFBQUwsQ0FBY0gsUUFBZCxFQUF3QkMsUUFBeEIsRUFBa0NKLEtBQWxDLENBQU47QUFic0I7QUFjdkI7O0FBRUtNLFVBQU4sQ0FBZUgsUUFBZixFQUF5QkMsUUFBekIsRUFBbUNKLEtBQW5DLEVBQTBDO0FBQUE7O0FBQUE7QUFDeEMsVUFBSU8sZUFBZUgsWUFBWSxDQUEvQjs7QUFFQSxhQUFPRyxnQkFBZ0IsSUFBdkIsRUFBNkI7QUFDM0IsWUFBSSxPQUFLVixVQUFMLElBQW1CTSxZQUFZLElB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QyxjQUFNcUIsS0FBSyxpQkFBT0MsVUFBUCxDQUFrQm5DLE9BQWxCLEVBQTJCb0MsSUFBM0IsQ0FBZ0MsYUFBR0MsaUJBQUgsQ0FBcUJKLEVBQXJCLENBQWhDLENBQVg7QUFDQUMsV0FBR04sRUFBSCxDQUFNLE9BQU4sRUFBZTtBQUFBLGlCQUFNaEIsUUFBUXNCLEVBQVIsQ0FBTjtBQUFBLFNBQWY7QUFDQUEsV0FBR04sRUFBSCxDQUFNLE9BQU4sRUFBZWYsTUFBZjtBQUNELE9BSk0sQ0FBUDtBQUQrQjtBQU1oQzs7QUFFS3BELFFBQU4sR0FBZTtBQUFBOztBQUFBO0FBQ2IsWUFBTSxPQUFLSCxPQUFMLENBQWFDLElBQWIsRUFBTjtBQURhO0FBRWQ7QUF2TGlFO2tCQUEvQ2YscUIiLCJmaWxlIjoiZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRSZXNvdXJjZSBmcm9tICcuL2Rvd25sb2FkLXJlc291cmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHRlbXB5IGZyb20gJ3RlbXB5JztcbmltcG9ydCB7IHBhcnNlRmlsZSB9IGZyb20gJy4uLy4uLy4uL2pzb25zZXEnO1xuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XG5cbmNvbnN0IFFVRVJZX1BBR0VfU0laRSA9IDUwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSBleHRlbmRzIERvd25sb2FkUmVzb3VyY2Uge1xuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHJ1bih7ZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoKTtcblxuICAgIGlmICghc3RhdGUubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0U3luYyA9IHRoaXMubGFzdFN5bmM7XG5cbiAgICBjb25zdCBzZXF1ZW5jZSA9IGxhc3RTeW5jID8gbGFzdFN5bmMuZ2V0VGltZSgpIDogbnVsbDtcblxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2U7XG5cbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGxldCBuZXh0U2VxdWVuY2UgPSBzZXF1ZW5jZSB8fCAwO1xuXG4gICAgd2hpbGUgKG5leHRTZXF1ZW5jZSAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy51c2VSZXN0QVBJICYmIGxhc3RTeW5jICE9IG51bGwpIHtcbiAgICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRTZXF1ZW5jZSA9IGF3YWl0IHRoaXMuZG93bmxvYWRRdWVyeUFQSVBhZ2UobGFzdFN5bmMsIG5leHRTZXF1ZW5jZSwgc3RhdGUpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICAgIH1cblxuICAgIGF3YWl0IHN0YXRlLnVwZGF0ZSgpO1xuICAgIGF3YWl0IHRoaXMuZmluaXNoKCk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBiZWdpbkZldGNoVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZmV0Y2hPYmplY3RzKGxhc3RTeW5jLCBzZXF1ZW5jZSk7XG5cbiAgICBjb25zdCB0b3RhbEZldGNoVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gYmVnaW5GZXRjaFRpbWUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKHJlc3VsdHMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICB0aGlzLmZhaWwocmVzdWx0cyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyZXN1bHRzLmJvZHkpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IGRhdGFbdGhpcy5yZXNvdXJjZU5hbWVdO1xuXG4gICAgY29uc3QgZGIgPSB0aGlzLmRiO1xuXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBhd2FpdCBkYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBub3cuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcyB8ICVzIHwgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbEZldGNoVGltZSArICdtcycpLmN5YW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxUaW1lICsgJ21zJykucmVkKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICByZXR1cm4gZGF0YS5uZXh0X3NlcXVlbmNlO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeUFQSVBhZ2UobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGNvbnN0IHNxbCA9IHRoaXMuZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSB8fCAwLCBRVUVSWV9QQUdFX1NJWkUpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IENsaWVudC5nZXRRdWVyeVVSTCh0aGlzLmFjY291bnQsIHNxbCk7XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRlbXB5LmZpbGUoe2V4dGVuc2lvbjogJ2pzb25zZXEnfSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IHtjb3VudCwgbGFzdE9iamVjdH0gPSBhd2FpdCB0aGlzLnByb2Nlc3NRdWVyeVJlc3BvbnNlKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogY291bnQsIHRvdGFsOiAtMX0pO1xuXG4gICAgaWYgKGNvdW50ID49IFFVRVJZX1BBR0VfU0laRSkge1xuICAgICAgcmV0dXJuIE1hdGguY2VpbChsYXN0T2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCkgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NRdWVyeVJlc3BvbnNlKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IDAsIHRvdGFsOiAtMX0pO1xuXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgbGFzdE9iamVjdCA9IG51bGw7XG5cbiAgICBhd2FpdCB0aGlzLmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBvbk9iamVjdCA9IChqc29uLCBkb25lKSA9PiB7XG4gICAgICAgICAgaWYgKGpzb24ucm93KSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NRdWVyeU9iamVjdChqc29uLCBkYXRhYmFzZSwgKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICBsYXN0T2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogLTF9KTtcbiAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25JbnZhbGlkID0gKGRhdGEsIGRvbmUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkJywgZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGRvbmUobmV3IEVycm9yKCdpbnZhbGlkIEpTT04gc2VxdWVuY2UnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25UcnVuY2F0ZWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RydW5jYXRlZDonLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgZG9uZShuZXcgRXJyb3IoJ3RydW5jYXRlZCBKU09OIHNlcXVlbmNlJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBhcnNlRmlsZShmaWxlUGF0aCwge29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSlcbiAgICAgICAgICAub24oJ2VuZCcsIG9uRW5kKVxuICAgICAgICAgIC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtjb3VudDogaW5kZXgsIGxhc3RPYmplY3R9O1xuICB9XG5cbiAgcHJvY2Vzc1F1ZXJ5T2JqZWN0KGF0dHJpYnV0ZXMsIGRhdGFiYXNlLCBkb25lKSB7XG4gICAgdGhpcy5wcm9jZXNzT2JqZWN0QXN5bmMoYXR0cmlidXRlcywgZGF0YWJhc2UpLnRoZW4oZG9uZSkuY2F0Y2goZG9uZSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzT2JqZWN0QXN5bmMoanNvbiwgZGF0YWJhc2UpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzRm9yUXVlcnlSb3coanNvbi5yb3cpO1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpO1xuXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeShvcHRpb25zLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IENsaWVudC5yYXdSZXF1ZXN0KG9wdGlvbnMpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odG8pKTtcbiAgICAgIHJxLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocnEpKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxufVxuIl19