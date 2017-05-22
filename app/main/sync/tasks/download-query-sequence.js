'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadSequence = require('./download-sequence');

var _downloadSequence2 = _interopRequireDefault(_downloadSequence);

var _client = require('../../api/client');

var _client2 = _interopRequireDefault(_client);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tempy = require('tempy');

var _tempy2 = _interopRequireDefault(_tempy);

var _jsonseq = require('../../../jsonseq');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const QUERY_PAGE_SIZE = 50000;

class DownloadQuerySequence extends _downloadSequence2.default {
  download(account, lastSync, sequence, state) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (lastSync != null) {
        yield _downloadSequence2.default.prototype.download.call(_this, account, lastSync, sequence, state);
      } else {
        let nextSequence = sequence || 0;

        while (nextSequence != null) {
          nextSequence = yield _this.downloadQueryPage(account, lastSync, nextSequence, state);

          yield account.save();
        }

        yield state.update();
        yield _this.finish();
      }
    })();
  }

  downloadQueryPage(account, lastSync, sequence, state) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const sql = _this2.generateQuery(sequence || 0, QUERY_PAGE_SIZE);

      const options = _client2.default.getQueryURL(account, sql);

      const filePath = _tempy2.default.file({ extension: 'jsonseq' });

      _this2.progress({ message: _this2.downloading + ' ' + _this2.syncLabel.blue });

      yield _this2.downloadQuery(options, filePath);

      const { count, lastObject } = yield _this2.processQueryResponse(account, filePath);

      const message = (0, _util.format)(_this2.finished + ' %s', _this2.syncLabel.blue);

      _this2.progress({ message, count: count, total: -1 });

      if (count >= QUERY_PAGE_SIZE) {
        return Math.ceil(lastObject.updatedAt.getTime() - 1);
      }

      return null;
    })();
  }

  processQueryResponse(account, filePath) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: 0, total: -1 });

      let index = 0;
      let lastObject = null;

      yield account.db.transaction((() => {
        var _ref = _asyncToGenerator(function* (database) {
          yield new Promise(function (resolve, reject) {
            const onObject = function (json, done) {
              if (json.row) {
                _this3.processQueryObject(json, account, database, function (object) {
                  lastObject = object;
                  _this3.progress({ message: _this3.processing + ' ' + _this3.syncLabel.blue, count: index + 1, total: -1 });
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

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      return { count: index, lastObject };
    })();
  }

  processQueryObject(attributes, account, database, done) {
    this.processObjectAsync(attributes, account, database).then(done).catch(done);
  }

  processObjectAsync(json, account, database) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const attributes = _this4.attributesForQueryRow(json.row);

      const object = yield _this4.findOrCreate(database, account, attributes);

      yield _this4.process(object, attributes);

      return object;
    })();
  }

  downloadQuery(options, to) {
    return _asyncToGenerator(function* () {
      return new Promise(function (resolve, reject) {
        const rq = (0, _request2.default)(options).pipe(_fs2.default.createWriteStream(to));
        rq.on('close', function () {
          return resolve(rq);
        });
        rq.on('error', reject);
      });
    })();
  }
}
exports.default = DownloadQuerySequence;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwiZG93bmxvYWQiLCJhY2NvdW50IiwibGFzdFN5bmMiLCJzZXF1ZW5jZSIsInN0YXRlIiwicHJvdG90eXBlIiwiY2FsbCIsIm5leHRTZXF1ZW5jZSIsImRvd25sb2FkUXVlcnlQYWdlIiwic2F2ZSIsInVwZGF0ZSIsImZpbmlzaCIsInNxbCIsImdlbmVyYXRlUXVlcnkiLCJvcHRpb25zIiwiZ2V0UXVlcnlVUkwiLCJmaWxlUGF0aCIsImZpbGUiLCJleHRlbnNpb24iLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJkb3dubG9hZFF1ZXJ5IiwiY291bnQiLCJsYXN0T2JqZWN0IiwicHJvY2Vzc1F1ZXJ5UmVzcG9uc2UiLCJmaW5pc2hlZCIsInRvdGFsIiwiTWF0aCIsImNlaWwiLCJ1cGRhdGVkQXQiLCJnZXRUaW1lIiwicHJvY2Vzc2luZyIsImluZGV4IiwiZGIiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0Iiwib2JqZWN0Iiwib25JbnZhbGlkIiwiZGF0YSIsImNvbnNvbGUiLCJlcnJvciIsInRvU3RyaW5nIiwiRXJyb3IiLCJvblRydW5jYXRlZCIsIm9uRW5kIiwib25FcnJvciIsImVyciIsIm9uIiwiYXR0cmlidXRlcyIsInByb2Nlc3NPYmplY3RBc3luYyIsInRoZW4iLCJjYXRjaCIsImF0dHJpYnV0ZXNGb3JRdWVyeVJvdyIsImZpbmRPckNyZWF0ZSIsInByb2Nlc3MiLCJ0byIsInJxIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIl0sIm1hcHBpbmdzIjoi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O0FBL0dpRTtrQkFBL0MxQyxxQiIsImZpbGUiOiJkb3dubG9hZC1xdWVyeS1zZXF1ZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEb3dubG9hZFNlcXVlbmNlIGZyb20gJy4vZG93bmxvYWQtc2VxdWVuY2UnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi8uLi9hcGkvY2xpZW50JztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCB0ZW1weSBmcm9tICd0ZW1weSc7XG5pbXBvcnQgeyBwYXJzZUZpbGUgfSBmcm9tICcuLi8uLi8uLi9qc29uc2VxJztcbmltcG9ydCB7IGZvcm1hdCB9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBRVUVSWV9QQUdFX1NJWkUgPSA1MDAwMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRRdWVyeVNlcXVlbmNlIGV4dGVuZHMgRG93bmxvYWRTZXF1ZW5jZSB7XG4gIGFzeW5jIGRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBpZiAobGFzdFN5bmMgIT0gbnVsbCkge1xuICAgICAgYXdhaXQgRG93bmxvYWRTZXF1ZW5jZS5wcm90b3R5cGUuZG93bmxvYWQuY2FsbCh0aGlzLCBhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5leHRTZXF1ZW5jZSA9IHNlcXVlbmNlIHx8IDA7XG5cbiAgICAgIHdoaWxlIChuZXh0U2VxdWVuY2UgIT0gbnVsbCkge1xuICAgICAgICBuZXh0U2VxdWVuY2UgPSBhd2FpdCB0aGlzLmRvd25sb2FkUXVlcnlQYWdlKGFjY291bnQsIGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcblxuICAgICAgICBhd2FpdCBhY2NvdW50LnNhdmUoKTtcbiAgICAgIH1cblxuICAgICAgYXdhaXQgc3RhdGUudXBkYXRlKCk7XG4gICAgICBhd2FpdCB0aGlzLmZpbmlzaCgpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkUXVlcnlQYWdlKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBzcWwgPSB0aGlzLmdlbmVyYXRlUXVlcnkoc2VxdWVuY2UgfHwgMCwgUVVFUllfUEFHRV9TSVpFKTtcblxuICAgIGNvbnN0IG9wdGlvbnMgPSBDbGllbnQuZ2V0UXVlcnlVUkwoYWNjb3VudCwgc3FsKTtcblxuICAgIGNvbnN0IGZpbGVQYXRoID0gdGVtcHkuZmlsZSh7ZXh0ZW5zaW9uOiAnanNvbnNlcSd9KTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMuZG93bmxvYWRpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlfSk7XG5cbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkUXVlcnkob3B0aW9ucywgZmlsZVBhdGgpO1xuXG4gICAgY29uc3Qge2NvdW50LCBsYXN0T2JqZWN0fSA9IGF3YWl0IHRoaXMucHJvY2Vzc1F1ZXJ5UmVzcG9uc2UoYWNjb3VudCwgZmlsZVBhdGgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN5bmNMYWJlbC5ibHVlKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBjb3VudCwgdG90YWw6IC0xfSk7XG5cbiAgICBpZiAoY291bnQgPj0gUVVFUllfUEFHRV9TSVpFKSB7XG4gICAgICByZXR1cm4gTWF0aC5jZWlsKGxhc3RPYmplY3QudXBkYXRlZEF0LmdldFRpbWUoKSAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgYXN5bmMgcHJvY2Vzc1F1ZXJ5UmVzcG9uc2UoYWNjb3VudCwgZmlsZVBhdGgpIHtcbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogMCwgdG90YWw6IC0xfSk7XG5cbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBsYXN0T2JqZWN0ID0gbnVsbDtcblxuICAgIGF3YWl0IGFjY291bnQuZGIudHJhbnNhY3Rpb24oYXN5bmMgKGRhdGFiYXNlKSA9PiB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IG9uT2JqZWN0ID0gKGpzb24sIGRvbmUpID0+IHtcbiAgICAgICAgICBpZiAoanNvbi5yb3cpIHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc1F1ZXJ5T2JqZWN0KGpzb24sIGFjY291bnQsIGRhdGFiYXNlLCAob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGxhc3RPYmplY3QgPSBvYmplY3Q7XG4gICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiAtMX0pO1xuICAgICAgICAgICAgICArK2luZGV4O1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkludmFsaWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQnLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgZG9uZShuZXcgRXJyb3IoJ2ludmFsaWQgSlNPTiBzZXF1ZW5jZScpKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvblRydW5jYXRlZCA9IChkYXRhLCBkb25lKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVHJ1bmNhdGVkOicsIGRhdGEgJiYgZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgICBkb25lKG5ldyBFcnJvcigndHJ1bmNhdGVkIEpTT04gc2VxdWVuY2UnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25FbmQgPSAoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgcGFyc2VGaWxlKGZpbGVQYXRoLCB7b25PYmplY3QsIG9uSW52YWxpZCwgb25UcnVuY2F0ZWR9KVxuICAgICAgICAgIC5vbignZW5kJywgb25FbmQpXG4gICAgICAgICAgLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge2NvdW50OiBpbmRleCwgbGFzdE9iamVjdH07XG4gIH1cblxuICBwcm9jZXNzUXVlcnlPYmplY3QoYXR0cmlidXRlcywgYWNjb3VudCwgZGF0YWJhc2UsIGRvbmUpIHtcbiAgICB0aGlzLnByb2Nlc3NPYmplY3RBc3luYyhhdHRyaWJ1dGVzLCBhY2NvdW50LCBkYXRhYmFzZSkudGhlbihkb25lKS5jYXRjaChkb25lKTtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NPYmplY3RBc3luYyhqc29uLCBhY2NvdW50LCBkYXRhYmFzZSkge1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXNGb3JRdWVyeVJvdyhqc29uLnJvdyk7XG5cbiAgICBjb25zdCBvYmplY3QgPSBhd2FpdCB0aGlzLmZpbmRPckNyZWF0ZShkYXRhYmFzZSwgYWNjb3VudCwgYXR0cmlidXRlcyk7XG5cbiAgICBhd2FpdCB0aGlzLnByb2Nlc3Mob2JqZWN0LCBhdHRyaWJ1dGVzKTtcblxuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJxID0gcmVxdWVzdChvcHRpb25zKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XG4gICAgICBycS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=