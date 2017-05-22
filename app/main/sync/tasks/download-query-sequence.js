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
  get useRestAPI() {
    return true;
  }

  download(account, lastSync, sequence, state) {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.useRestAPI && lastSync != null) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsImRvd25sb2FkIiwiYWNjb3VudCIsImxhc3RTeW5jIiwic2VxdWVuY2UiLCJzdGF0ZSIsInByb3RvdHlwZSIsImNhbGwiLCJuZXh0U2VxdWVuY2UiLCJkb3dubG9hZFF1ZXJ5UGFnZSIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwicHJvZ3Jlc3MiLCJtZXNzYWdlIiwiZG93bmxvYWRpbmciLCJzeW5jTGFiZWwiLCJibHVlIiwiZG93bmxvYWRRdWVyeSIsImNvdW50IiwibGFzdE9iamVjdCIsInByb2Nlc3NRdWVyeVJlc3BvbnNlIiwiZmluaXNoZWQiLCJ0b3RhbCIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiZ2V0VGltZSIsInByb2Nlc3NpbmciLCJpbmRleCIsImRiIiwidHJhbnNhY3Rpb24iLCJkYXRhYmFzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib25PYmplY3QiLCJqc29uIiwiZG9uZSIsInJvdyIsInByb2Nlc3NRdWVyeU9iamVjdCIsIm9iamVjdCIsIm9uSW52YWxpZCIsImRhdGEiLCJjb25zb2xlIiwiZXJyb3IiLCJ0b1N0cmluZyIsIkVycm9yIiwib25UcnVuY2F0ZWQiLCJvbkVuZCIsIm9uRXJyb3IiLCJlcnIiLCJvbiIsImF0dHJpYnV0ZXMiLCJwcm9jZXNzT2JqZWN0QXN5bmMiLCJ0aGVuIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJmaW5kT3JDcmVhdGUiLCJwcm9jZXNzIiwidG8iLCJycSIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSJd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QUEsU0FBZjtBQUNBQSxXQUFHVCxFQUFILENBQU0sT0FBTixFQUFlakIsTUFBZjtBQUNELE9BSk0sQ0FBUDtBQUQrQjtBQU1oQztBQW5IaUU7a0JBQS9DM0MscUIiLCJmaWxlIjoiZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRTZXF1ZW5jZSBmcm9tICcuL2Rvd25sb2FkLXNlcXVlbmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgdGVtcHkgZnJvbSAndGVtcHknO1xuaW1wb3J0IHsgcGFyc2VGaWxlIH0gZnJvbSAnLi4vLi4vLi4vanNvbnNlcSc7XG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tICd1dGlsJztcblxuY29uc3QgUVVFUllfUEFHRV9TSVpFID0gNTAwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSBleHRlbmRzIERvd25sb2FkU2VxdWVuY2Uge1xuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIGRvd25sb2FkKGFjY291bnQsIGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBpZiAodGhpcy51c2VSZXN0QVBJICYmIGxhc3RTeW5jICE9IG51bGwpIHtcbiAgICAgIGF3YWl0IERvd25sb2FkU2VxdWVuY2UucHJvdG90eXBlLmRvd25sb2FkLmNhbGwodGhpcywgYWNjb3VudCwgbGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBuZXh0U2VxdWVuY2UgPSBzZXF1ZW5jZSB8fCAwO1xuXG4gICAgICB3aGlsZSAobmV4dFNlcXVlbmNlICE9IG51bGwpIHtcbiAgICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5UGFnZShhY2NvdW50LCBsYXN0U3luYywgbmV4dFNlcXVlbmNlLCBzdGF0ZSk7XG5cbiAgICAgICAgYXdhaXQgYWNjb3VudC5zYXZlKCk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHN0YXRlLnVwZGF0ZSgpO1xuICAgICAgYXdhaXQgdGhpcy5maW5pc2goKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFF1ZXJ5UGFnZShhY2NvdW50LCBsYXN0U3luYywgc2VxdWVuY2UsIHN0YXRlKSB7XG4gICAgY29uc3Qgc3FsID0gdGhpcy5nZW5lcmF0ZVF1ZXJ5KHNlcXVlbmNlIHx8IDAsIFFVRVJZX1BBR0VfU0laRSk7XG5cbiAgICBjb25zdCBvcHRpb25zID0gQ2xpZW50LmdldFF1ZXJ5VVJMKGFjY291bnQsIHNxbCk7XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRlbXB5LmZpbGUoe2V4dGVuc2lvbjogJ2pzb25zZXEnfSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IHtjb3VudCwgbGFzdE9iamVjdH0gPSBhd2FpdCB0aGlzLnByb2Nlc3NRdWVyeVJlc3BvbnNlKGFjY291bnQsIGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogY291bnQsIHRvdGFsOiAtMX0pO1xuXG4gICAgaWYgKGNvdW50ID49IFFVRVJZX1BBR0VfU0laRSkge1xuICAgICAgcmV0dXJuIE1hdGguY2VpbChsYXN0T2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCkgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NRdWVyeVJlc3BvbnNlKGFjY291bnQsIGZpbGVQYXRoKSB7XG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IDAsIHRvdGFsOiAtMX0pO1xuXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgbGFzdE9iamVjdCA9IG51bGw7XG5cbiAgICBhd2FpdCBhY2NvdW50LmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBvbk9iamVjdCA9IChqc29uLCBkb25lKSA9PiB7XG4gICAgICAgICAgaWYgKGpzb24ucm93KSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NRdWVyeU9iamVjdChqc29uLCBhY2NvdW50LCBkYXRhYmFzZSwgKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICBsYXN0T2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogLTF9KTtcbiAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25JbnZhbGlkID0gKGRhdGEsIGRvbmUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkJywgZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGRvbmUobmV3IEVycm9yKCdpbnZhbGlkIEpTT04gc2VxdWVuY2UnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25UcnVuY2F0ZWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RydW5jYXRlZDonLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgZG9uZShuZXcgRXJyb3IoJ3RydW5jYXRlZCBKU09OIHNlcXVlbmNlJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBhcnNlRmlsZShmaWxlUGF0aCwge29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSlcbiAgICAgICAgICAub24oJ2VuZCcsIG9uRW5kKVxuICAgICAgICAgIC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtjb3VudDogaW5kZXgsIGxhc3RPYmplY3R9O1xuICB9XG5cbiAgcHJvY2Vzc1F1ZXJ5T2JqZWN0KGF0dHJpYnV0ZXMsIGFjY291bnQsIGRhdGFiYXNlLCBkb25lKSB7XG4gICAgdGhpcy5wcm9jZXNzT2JqZWN0QXN5bmMoYXR0cmlidXRlcywgYWNjb3VudCwgZGF0YWJhc2UpLnRoZW4oZG9uZSkuY2F0Y2goZG9uZSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzT2JqZWN0QXN5bmMoanNvbiwgYWNjb3VudCwgZGF0YWJhc2UpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzRm9yUXVlcnlSb3coanNvbi5yb3cpO1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGFjY291bnQsIGF0dHJpYnV0ZXMpO1xuXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeShvcHRpb25zLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3Qob3B0aW9ucykucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bykpO1xuICAgICAgcnEub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZShycSkpO1xuICAgICAgcnEub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxufVxuIl19