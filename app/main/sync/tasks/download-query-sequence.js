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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsInJ1biIsImRhdGFTb3VyY2UiLCJzdGF0ZSIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJsYXN0U3luYyIsInNlcXVlbmNlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRSZXN0QVBJUGFnZSIsImRvd25sb2FkUXVlcnlBUElQYWdlIiwiYWNjb3VudCIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJiZWdpbkZldGNoVGltZSIsIkRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJyZXN1bHRzIiwiZmV0Y2hPYmplY3RzIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZmFpbCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsInJlc291cmNlTmFtZSIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwicHJvY2VzcyIsInRvdGFsVGltZSIsImZpbmlzaGVkIiwiY3lhbiIsInJlZCIsIm5leHRfc2VxdWVuY2UiLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwiZG93bmxvYWRRdWVyeSIsImxhc3RPYmplY3QiLCJwcm9jZXNzUXVlcnlSZXNwb25zZSIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0IiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwic3RhY2siLCJvbkludmFsaWQiLCJ0b1N0cmluZyIsIkVycm9yIiwib25UcnVuY2F0ZWQiLCJvbkVuZCIsIm9uRXJyb3IiLCJvbiIsInByb2Nlc3NPYmplY3RBc3luYyIsInRoZW4iLCJvIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJ0byIsInJxIiwicmF3UmVxdWVzdCIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsTUFBTUEsa0JBQWtCLElBQXhCOztBQUVlLE1BQU1DLHFCQUFOLG9DQUFxRDtBQUNsRSxNQUFJQyxVQUFKLEdBQWlCO0FBQ2YsV0FBTyxJQUFQO0FBQ0Q7O0FBRUtDLEtBQU4sQ0FBVSxFQUFDQyxVQUFELEVBQVYsRUFBd0I7QUFBQTs7QUFBQTtBQUN0QixZQUFNQyxRQUFRLE1BQU0sTUFBS0MsY0FBTCxFQUFwQjs7QUFFQSxVQUFJLENBQUNELE1BQU1FLFdBQVgsRUFBd0I7QUFDdEI7QUFDRDs7QUFFRCxZQUFNQyxXQUFXLE1BQUtBLFFBQXRCOztBQUVBLFlBQU1DLFdBQVdELFdBQVdBLFNBQVNFLE9BQVQsRUFBWCxHQUFnQyxJQUFqRDs7QUFFQSxZQUFLTixVQUFMLEdBQWtCQSxVQUFsQjs7QUFFQSxZQUFNLE1BQUtPLFFBQUwsQ0FBY0gsUUFBZCxFQUF3QkMsUUFBeEIsRUFBa0NKLEtBQWxDLENBQU47QUFic0I7QUFjdkI7O0FBRUtNLFVBQU4sQ0FBZUgsUUFBZixFQUF5QkMsUUFBekIsRUFBbUNKLEtBQW5DLEVBQTBDO0FBQUE7O0FBQUE7QUFDeEMsVUFBSU8sZUFBZUgsWUFBWSxDQUEvQjs7QUFFQSxhQUFPRyxnQkFBZ0IsSUFBdkIsRUFBNkI7QUFDM0IsWUFBSSxPQUFLVixVQUFMLElB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WUFBTSxPQUFLRyxPQUFMLENBQWFGLE1BQWIsRUFBcUJELFVBQXJCLENBQU47O0FBRUEsYUFBT0MsTUFBUDtBQVJ1QztBQVN4Qzs7QUFFS2UsZUFBTixDQUFvQkwsT0FBcEIsRUFBNkJtQyxFQUE3QixFQUFpQztBQUFBO0FBQy9CLGFBQU8sSUFBSXhCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsY0FBTXVCLEtBQUssaUJBQU9DLFVBQVAsQ0FBa0JyQyxPQUFsQixFQUEyQnNDLElBQTNCLENBQWdDLGFBQUdDLGlCQUFILENBQXFCSixFQUFyQixDQUFoQyxDQUFYO0FBQ0FDLFdBQUdQLEVBQUgsQ0FBTSxPQUFOLEVBQWU7QUFBQSxpQkFBTWpCLFFBQVF3QixFQUFSLENBQU47QUFBQSxTQUFmO0FBQ0FBLFdBQUdQLEVBQUgsQ0FBTSxPQUFOLEVBQWVoQixNQUFmO0FBQ0QsT0FKTSxDQUFQO0FBRCtCO0FBTWhDOztBQUVLcEQsUUFBTixHQUFlO0FBQUE7O0FBQUE7QUFDYixZQUFNLE9BQUtILE9BQUwsQ0FBYUMsSUFBYixFQUFOO0FBRGE7QUFFZDtBQTdMaUU7a0JBQS9DZixxQiIsImZpbGUiOiJkb3dubG9hZC1xdWVyeS1zZXF1ZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFJlc291cmNlIGZyb20gJy4vZG93bmxvYWQtcmVzb3VyY2UnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uLy4uL2FwaS9jbGllbnQnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgdGVtcHkgZnJvbSAndGVtcHknO1xyXG5pbXBvcnQgeyBwYXJzZUZpbGUgfSBmcm9tICcuLi8uLi8uLi9qc29uc2VxJztcclxuaW1wb3J0IHsgZm9ybWF0IH0gZnJvbSAndXRpbCc7XHJcblxyXG5jb25zdCBRVUVSWV9QQUdFX1NJWkUgPSA1MDAwO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGV4dGVuZHMgRG93bmxvYWRSZXNvdXJjZSB7XHJcbiAgZ2V0IHVzZVJlc3RBUEkoKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIGFzeW5jIHJ1bih7ZGF0YVNvdXJjZX0pIHtcclxuICAgIGNvbnN0IHN0YXRlID0gYXdhaXQgdGhpcy5jaGVja1N5bmNTdGF0ZSgpO1xyXG5cclxuICAgIGlmICghc3RhdGUubmVlZHNVcGRhdGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxhc3RTeW5jID0gdGhpcy5sYXN0U3luYztcclxuXHJcbiAgICBjb25zdCBzZXF1ZW5jZSA9IGxhc3RTeW5jID8gbGFzdFN5bmMuZ2V0VGltZSgpIDogbnVsbDtcclxuXHJcbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xyXG5cclxuICAgIGF3YWl0IHRoaXMuZG93bmxvYWQobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBkb3dubG9hZChsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XHJcbiAgICBsZXQgbmV4dFNlcXVlbmNlID0gc2VxdWVuY2UgfHwgMDtcclxuXHJcbiAgICB3aGlsZSAobmV4dFNlcXVlbmNlICE9IG51bGwpIHtcclxuICAgICAgaWYgKHRoaXMudXNlUmVzdEFQSSAmJiBsYXN0U3luYyAhPSBudWxsKSB7XHJcbiAgICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXh0U2VxdWVuY2UgPSBhd2FpdCB0aGlzLmRvd25sb2FkUXVlcnlBUElQYWdlKGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgYXdhaXQgdGhpcy5hY2NvdW50LnNhdmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBhd2FpdCBzdGF0ZS51cGRhdGUoKTtcclxuICAgIGF3YWl0IHRoaXMuZmluaXNoKCk7XHJcbiAgfVxyXG5cclxuICBhc3luYyBkb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcclxuICAgIGNvbnN0IGJlZ2luRmV0Y2hUaW1lID0gbmV3IERhdGUoKTtcclxuXHJcbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCB0aGlzLmZldGNoT2JqZWN0cyhsYXN0U3luYywgc2VxdWVuY2UpO1xyXG5cclxuICAgIGNvbnN0IHRvdGFsRmV0Y2hUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBiZWdpbkZldGNoVGltZS5nZXRUaW1lKCk7XHJcblxyXG4gICAgaWYgKHJlc3VsdHMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XHJcbiAgICAgIHRoaXMuZmFpbChyZXN1bHRzKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGF0YSA9IEpTT04ucGFyc2UocmVzdWx0cy5ib2R5KTtcclxuXHJcbiAgICBjb25zdCBvYmplY3RzID0gZGF0YVt0aGlzLnJlc291cmNlTmFtZV07XHJcblxyXG4gICAgY29uc3QgZGIgPSB0aGlzLmRiO1xyXG5cclxuICAgIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcclxuXHJcbiAgICBhd2FpdCBkYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdHMubGVuZ3RoOyArK2luZGV4KSB7XHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG9iamVjdHNbaW5kZXhdO1xyXG5cclxuICAgICAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcyk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgdG90YWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBub3cuZ2V0VGltZSgpO1xyXG5cclxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMgfCAlcyB8ICVzJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsRmV0Y2hUaW1lICsgJ21zJykuY3lhbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRvdGFsVGltZSArICdtcycpLnJlZCk7XHJcblxyXG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZSwgY291bnQ6IG9iamVjdHMubGVuZ3RoLCB0b3RhbDogb2JqZWN0cy5sZW5ndGh9KTtcclxuXHJcbiAgICByZXR1cm4gZGF0YS5uZXh0X3NlcXVlbmNlO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgZG93bmxvYWRRdWVyeUFQSVBhZ2UobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xyXG4gICAgY29uc3Qgc3FsID0gdGhpcy5nZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlIHx8IDAsIFFVRVJZX1BBR0VfU0laRSk7XHJcblxyXG4gICAgY29uc3Qgb3B0aW9ucyA9IENsaWVudC5nZXRRdWVyeVVSTCh0aGlzLmFjY291bnQsIHNxbCk7XHJcblxyXG4gICAgY29uc3QgZmlsZVBhdGggPSB0ZW1weS5maWxlKHtleHRlbnNpb246ICdqc29uc2VxJ30pO1xyXG5cclxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIGZpbGVQYXRoKTtcclxuXHJcbiAgICBjb25zdCB7Y291bnQsIGxhc3RPYmplY3R9ID0gYXdhaXQgdGhpcy5wcm9jZXNzUXVlcnlSZXNwb25zZShmaWxlUGF0aCk7XHJcblxyXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3luY0xhYmVsLmJsdWUpO1xyXG5cclxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBjb3VudCwgdG90YWw6IC0xfSk7XHJcblxyXG4gICAgaWYgKGNvdW50ID49IFFVRVJZX1BBR0VfU0laRSkge1xyXG4gICAgICByZXR1cm4gTWF0aC5jZWlsKGxhc3RPYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKSAtIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcHJvY2Vzc1F1ZXJ5UmVzcG9uc2UoZmlsZVBhdGgpIHtcclxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiAwLCB0b3RhbDogLTF9KTtcclxuXHJcbiAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgbGV0IGxhc3RPYmplY3QgPSBudWxsO1xyXG5cclxuICAgIGF3YWl0IHRoaXMuZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRhdGFiYXNlKSA9PiB7XHJcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICBjb25zdCBvbk9iamVjdCA9IChqc29uLCBkb25lKSA9PiB7XHJcbiAgICAgICAgICBpZiAoanNvbi5yb3cpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzUXVlcnlPYmplY3QoanNvbiwgZGF0YWJhc2UsIChlcnIsIG9iamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yJywgZXJyLm1lc3NhZ2UsIGVyci5zdGFjayk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIpO1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgbGFzdE9iamVjdCA9IG9iamVjdDtcclxuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogLTF9KTtcclxuICAgICAgICAgICAgICArK2luZGV4O1xyXG4gICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb25lKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25JbnZhbGlkID0gKGRhdGEsIGRvbmUpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQnLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBkb25lKG5ldyBFcnJvcignaW52YWxpZCBKU09OIHNlcXVlbmNlJykpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG9uVHJ1bmNhdGVkID0gKGRhdGEsIGRvbmUpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RydW5jYXRlZDonLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBkb25lKG5ldyBFcnJvcigndHJ1bmNhdGVkIEpTT04gc2VxdWVuY2UnKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgb25FcnJvciA9IChlcnIpID0+IHtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHBhcnNlRmlsZShmaWxlUGF0aCwge29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSlcclxuICAgICAgICAgIC5vbignZW5kJywgb25FbmQpXHJcbiAgICAgICAgICAub24oJ2Vycm9yJywgb25FcnJvcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtjb3VudDogaW5kZXgsIGxhc3RPYmplY3R9O1xyXG4gIH1cclxuXHJcbiAgcHJvY2Vzc1F1ZXJ5T2JqZWN0KGF0dHJpYnV0ZXMsIGRhdGFiYXNlLCBkb25lKSB7XHJcbiAgICB0aGlzLnByb2Nlc3NPYmplY3RBc3luYyhhdHRyaWJ1dGVzLCBkYXRhYmFzZSkudGhlbihvID0+IGRvbmUobnVsbCwgbykpLmNhdGNoKGRvbmUpO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgcHJvY2Vzc09iamVjdEFzeW5jKGpzb24sIGRhdGFiYXNlKSB7XHJcblxyXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlc0ZvclF1ZXJ5Um93KGpzb24ucm93KTtcclxuXHJcbiAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYXR0cmlidXRlcyk7XHJcblxyXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XHJcblxyXG4gICAgcmV0dXJuIG9iamVjdDtcclxuICB9XHJcblxyXG4gIGFzeW5jIGRvd25sb2FkUXVlcnkob3B0aW9ucywgdG8pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGNvbnN0IHJxID0gQ2xpZW50LnJhd1JlcXVlc3Qob3B0aW9ucykucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bykpO1xyXG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XHJcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGZpbmlzaCgpIHtcclxuICAgIGF3YWl0IHRoaXMuYWNjb3VudC5zYXZlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==