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
                _this5.processQueryObject(json, database, function (err, object) {
                  if (err) {
                    console.error('Error', err.message, err.stack);
                    return done(err);
                  }

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
    this.processObjectAsync(attributes, database).then(o => done(null, o)).catch(done);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsInJ1biIsImRhdGFTb3VyY2UiLCJzdGF0ZSIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJsYXN0U3luYyIsInNlcXVlbmNlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRSZXN0QVBJUGFnZSIsImRvd25sb2FkUXVlcnlBUElQYWdlIiwiYWNjb3VudCIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJiZWdpbkZldGNoVGltZSIsIkRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJyZXN1bHRzIiwiZmV0Y2hPYmplY3RzIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZmFpbCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsInJlc291cmNlTmFtZSIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwicHJvY2VzcyIsInRvdGFsVGltZSIsImZpbmlzaGVkIiwiY3lhbiIsInJlZCIsIm5leHRfc2VxdWVuY2UiLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwiZG93bmxvYWRRdWVyeSIsImxhc3RPYmplY3QiLCJwcm9jZXNzUXVlcnlSZXNwb25zZSIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0IiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwic3RhY2siLCJvbkludmFsaWQiLCJ0b1N0cmluZyIsIkVycm9yIiwib25UcnVuY2F0ZWQiLCJvbkVuZCIsIm9uRXJyb3IiLCJvbiIsInByb2Nlc3NPYmplY3RBc3luYyIsInRoZW4iLCJvIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJ0byIsInJxIiwicmF3UmVxdWVzdCIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsa0JBQWtCLElBQXhCOztBQUVlLE1BQU1DLHFCQUFOLG9DQUFxRDtBQUNsRSxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxJQUFQO0FBQ0Q7O0FBRUtDLEtBQU4sQ0FBVSxFQUFDQyxVQUFELEVBQVYsRUFBd0I7QUFBQTs7QUFBQTtBQUN0QixZQUFNQyxRQUFRLE1BQU0sTUFBS0MsY0FBTCxFQUFwQjs7QUFFQSxVQUFJLENBQUNELE1BQU1FLFdBQVgsRUFBd0I7QUFDdEI7QUFDRDs7QUFFRCxZQUFNQyxXQUFXLE1BQUtBLFFBQXRCOztBQUVBLFlBQU1DLFdBQVdELFdBQVdBLFNBQVNFLE9BQVQsRUFBWCxHQUFnQyxJQUFqRDs7QUFFQSxZQUFLTixVQUFMLEdBQWtCQSxVQUFsQjs7QUFFQSxZQUFNLE1BQUtPLFFBQUwsQ0FBY0gsUUFBZCxFQUF3QkMsUUFBeEIsRUFBa0NKLEtBQWxDLENBQU47QUFic0I7QUFjdkI7O0FBRUtNLFVBQU4sQ0FBZUgsUUFBZixFQUF5QkMsUUFBekIsRUFBbUNKLEtBQW5DLEVBQTBDO0FBQUE7O0FBQUE7QUFDeEMsVUFBSU8sZUFBZUgsWUFBWSxDQUEvQjs7QUFFQSxhQUFPRyxnQkFBZ0IsSUFBdkIsRUFBNkI7QUFDM0IsWUFBSSxPQUFLVixVQUFMLElB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QUFNLE9BQUtHLE9BQUwsQ0FBYUYsTUFBYixFQUFxQkQsVUFBckIsQ0FBTjs7QUFFQSxhQUFPQyxNQUFQO0FBUHVDO0FBUXhDOztBQUVLZSxlQUFOLENBQW9CTCxPQUFwQixFQUE2Qm1DLEVBQTdCLEVBQWlDO0FBQUE7QUFDL0IsYUFBTyxJQUFJeEIsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QyxjQUFNdUIsS0FBSyxpQkFBT0MsVUFBUCxDQUFrQnJDLE9BQWxCLEVBQTJCc0MsSUFBM0IsQ0FBZ0MsYUFBR0MsaUJBQUgsQ0FBcUJKLEVBQXJCLENBQWhDLENBQVg7QUFDQUMsV0FBR1AsRUFBSCxDQUFNLE9BQU4sRUFBZTtBQUFBLGlCQUFNakIsUUFBUXdCLEVBQVIsQ0FBTjtBQUFBLFNBQWY7QUFDQUEsV0FBR1AsRUFBSCxDQUFNLE9BQU4sRUFBZWhCLE1BQWY7QUFDRCxPQUpNLENBQVA7QUFEK0I7QUFNaEM7O0FBRUtwRCxRQUFOLEdBQWU7QUFBQTs7QUFBQTtBQUNiLFlBQU0sT0FBS0gsT0FBTCxDQUFhQyxJQUFiLEVBQU47QUFEYTtBQUVkO0FBNUxpRTtrQkFBL0NmLHFCIiwiZmlsZSI6ImRvd25sb2FkLXF1ZXJ5LXNlcXVlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERvd25sb2FkUmVzb3VyY2UgZnJvbSAnLi9kb3dubG9hZC1yZXNvdXJjZSc7XG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB0ZW1weSBmcm9tICd0ZW1weSc7XG5pbXBvcnQgeyBwYXJzZUZpbGUgfSBmcm9tICcuLi8uLi8uLi9qc29uc2VxJztcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBRVUVSWV9QQUdFX1NJWkUgPSA1MDAwO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb3dubG9hZFF1ZXJ5U2VxdWVuY2UgZXh0ZW5kcyBEb3dubG9hZFJlc291cmNlIHtcbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhc3luYyBydW4oe2RhdGFTb3VyY2V9KSB7XG4gICAgY29uc3Qgc3RhdGUgPSBhd2FpdCB0aGlzLmNoZWNrU3luY1N0YXRlKCk7XG5cbiAgICBpZiAoIXN0YXRlLm5lZWRzVXBkYXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdFN5bmMgPSB0aGlzLmxhc3RTeW5jO1xuXG4gICAgY29uc3Qgc2VxdWVuY2UgPSBsYXN0U3luYyA/IGxhc3RTeW5jLmdldFRpbWUoKSA6IG51bGw7XG5cbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZChsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBsZXQgbmV4dFNlcXVlbmNlID0gc2VxdWVuY2UgfHwgMDtcblxuICAgIHdoaWxlIChuZXh0U2VxdWVuY2UgIT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMudXNlUmVzdEFQSSAmJiBsYXN0U3luYyAhPSBudWxsKSB7XG4gICAgICAgIG5leHRTZXF1ZW5jZSA9IGF3YWl0IHRoaXMuZG93bmxvYWRSZXN0QVBJUGFnZShsYXN0U3luYywgbmV4dFNlcXVlbmNlLCBzdGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXh0U2VxdWVuY2UgPSBhd2FpdCB0aGlzLmRvd25sb2FkUXVlcnlBUElQYWdlKGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgICB9XG5cbiAgICBhd2FpdCBzdGF0ZS51cGRhdGUoKTtcbiAgICBhd2FpdCB0aGlzLmZpbmlzaCgpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRSZXN0QVBJUGFnZShsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgY29uc3QgYmVnaW5GZXRjaFRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWV9KTtcblxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpO1xuXG4gICAgY29uc3QgdG90YWxGZXRjaFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIGJlZ2luRmV0Y2hUaW1lLmdldFRpbWUoKTtcblxuICAgIGlmIChyZXN1bHRzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgdGhpcy5mYWlsKHJlc3VsdHMpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocmVzdWx0cy5ib2R5KTtcblxuICAgIGNvbnN0IG9iamVjdHMgPSBkYXRhW3RoaXMucmVzb3VyY2VOYW1lXTtcblxuICAgIGNvbnN0IGRiID0gdGhpcy5kYjtcblxuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IDAsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgYXdhaXQgZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRhdGFiYXNlKSA9PiB7XG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb2JqZWN0cy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xuXG4gICAgICAgIGNvbnN0IG9iamVjdCA9IGF3YWl0IHRoaXMuZmluZE9yQ3JlYXRlKGRhdGFiYXNlLCBhdHRyaWJ1dGVzKTtcblxuICAgICAgICBhd2FpdCB0aGlzLnByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKTtcblxuICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IHRvdGFsVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gbm93LmdldFRpbWUoKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMgfCAlcyB8ICVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY0xhYmVsLmJsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxGZXRjaFRpbWUgKyAnbXMnKS5jeWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsVGltZSArICdtcycpLnJlZCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogb2JqZWN0cy5sZW5ndGgsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuXG4gICAgcmV0dXJuIGRhdGEubmV4dF9zZXF1ZW5jZTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkUXVlcnlBUElQYWdlKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBzcWwgPSB0aGlzLmdlbmVyYXRlUXVlcnkoc2VxdWVuY2UgfHwgMCwgUVVFUllfUEFHRV9TSVpFKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBDbGllbnQuZ2V0UXVlcnlVUkwodGhpcy5hY2NvdW50LCBzcWwpO1xuXG4gICAgY29uc3QgZmlsZVBhdGggPSB0ZW1weS5maWxlKHtleHRlbnNpb246ICdqc29uc2VxJ30pO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5kb3dubG9hZGluZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWV9KTtcblxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWRRdWVyeShvcHRpb25zLCBmaWxlUGF0aCk7XG5cbiAgICBjb25zdCB7Y291bnQsIGxhc3RPYmplY3R9ID0gYXdhaXQgdGhpcy5wcm9jZXNzUXVlcnlSZXNwb25zZShmaWxlUGF0aCk7XG5cbiAgICBjb25zdCBtZXNzYWdlID0gZm9ybWF0KHRoaXMuZmluaXNoZWQgKyAnICVzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY0xhYmVsLmJsdWUpO1xuXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZSwgY291bnQ6IGNvdW50LCB0b3RhbDogLTF9KTtcblxuICAgIGlmIChjb3VudCA+PSBRVUVSWV9QQUdFX1NJWkUpIHtcbiAgICAgIHJldHVybiBNYXRoLmNlaWwobGFzdE9iamVjdC51cGRhdGVkQXQuZ2V0VGltZSgpIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzUXVlcnlSZXNwb25zZShmaWxlUGF0aCkge1xuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogLTF9KTtcblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGxhc3RPYmplY3QgPSBudWxsO1xuXG4gICAgYXdhaXQgdGhpcy5kYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3Qgb25PYmplY3QgPSAoanNvbiwgZG9uZSkgPT4ge1xuICAgICAgICAgIGlmIChqc29uLnJvdykge1xuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUXVlcnlPYmplY3QoanNvbiwgZGF0YWJhc2UsIChlcnIsIG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3InLCBlcnIubWVzc2FnZSwgZXJyLnN0YWNrKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbGFzdE9iamVjdCA9IG9iamVjdDtcbiAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IGluZGV4ICsgMSwgdG90YWw6IC0xfSk7XG4gICAgICAgICAgICAgICsraW5kZXg7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uSW52YWxpZCA9IChkYXRhLCBkb25lKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignSW52YWxpZCcsIGRhdGEgJiYgZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICBkb25lKG5ldyBFcnJvcignaW52YWxpZCBKU09OIHNlcXVlbmNlJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uVHJ1bmNhdGVkID0gKGRhdGEsIGRvbmUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdUcnVuY2F0ZWQ6JywgZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGRvbmUobmV3IEVycm9yKCd0cnVuY2F0ZWQgSlNPTiBzZXF1ZW5jZScpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkVuZCA9ICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25FcnJvciA9IChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBwYXJzZUZpbGUoZmlsZVBhdGgsIHtvbk9iamVjdCwgb25JbnZhbGlkLCBvblRydW5jYXRlZH0pXG4gICAgICAgICAgLm9uKCdlbmQnLCBvbkVuZClcbiAgICAgICAgICAub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7Y291bnQ6IGluZGV4LCBsYXN0T2JqZWN0fTtcbiAgfVxuXG4gIHByb2Nlc3NRdWVyeU9iamVjdChhdHRyaWJ1dGVzLCBkYXRhYmFzZSwgZG9uZSkge1xuICAgIHRoaXMucHJvY2Vzc09iamVjdEFzeW5jKGF0dHJpYnV0ZXMsIGRhdGFiYXNlKS50aGVuKG8gPT4gZG9uZShudWxsLCBvKSkuY2F0Y2goZG9uZSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzT2JqZWN0QXN5bmMoanNvbiwgZGF0YWJhc2UpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzRm9yUXVlcnlSb3coanNvbi5yb3cpO1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpO1xuXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeShvcHRpb25zLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IENsaWVudC5yYXdSZXF1ZXN0KG9wdGlvbnMpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odG8pKTtcbiAgICAgIHJxLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocnEpKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBmaW5pc2goKSB7XG4gICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcbiAgfVxufVxuIl19