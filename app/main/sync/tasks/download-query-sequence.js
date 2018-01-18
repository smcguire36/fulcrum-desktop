'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _downloadResource = require('./download-resource');

var _downloadResource2 = _interopRequireDefault(_downloadResource);

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
        const rq = (0, _request2.default)(options).pipe(_fs2.default.createWriteStream(to));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiXSwibmFtZXMiOlsiUVVFUllfUEFHRV9TSVpFIiwiRG93bmxvYWRRdWVyeVNlcXVlbmNlIiwidXNlUmVzdEFQSSIsInJ1biIsImRhdGFTb3VyY2UiLCJzdGF0ZSIsImNoZWNrU3luY1N0YXRlIiwibmVlZHNVcGRhdGUiLCJsYXN0U3luYyIsInNlcXVlbmNlIiwiZ2V0VGltZSIsImRvd25sb2FkIiwibmV4dFNlcXVlbmNlIiwiZG93bmxvYWRSZXN0QVBJUGFnZSIsImRvd25sb2FkUXVlcnlBUElQYWdlIiwiYWNjb3VudCIsInNhdmUiLCJ1cGRhdGUiLCJmaW5pc2giLCJiZWdpbkZldGNoVGltZSIsIkRhdGUiLCJwcm9ncmVzcyIsIm1lc3NhZ2UiLCJkb3dubG9hZGluZyIsInN5bmNMYWJlbCIsImJsdWUiLCJyZXN1bHRzIiwiZmV0Y2hPYmplY3RzIiwidG90YWxGZXRjaFRpbWUiLCJzdGF0dXNDb2RlIiwiZmFpbCIsImRhdGEiLCJKU09OIiwicGFyc2UiLCJib2R5Iiwib2JqZWN0cyIsInJlc291cmNlTmFtZSIsImRiIiwibm93IiwicHJvY2Vzc2luZyIsImNvdW50IiwidG90YWwiLCJsZW5ndGgiLCJ0cmFuc2FjdGlvbiIsImRhdGFiYXNlIiwiaW5kZXgiLCJhdHRyaWJ1dGVzIiwib2JqZWN0IiwiZmluZE9yQ3JlYXRlIiwicHJvY2VzcyIsInRvdGFsVGltZSIsImZpbmlzaGVkIiwiY3lhbiIsInJlZCIsIm5leHRfc2VxdWVuY2UiLCJzcWwiLCJnZW5lcmF0ZVF1ZXJ5Iiwib3B0aW9ucyIsImdldFF1ZXJ5VVJMIiwiZmlsZVBhdGgiLCJmaWxlIiwiZXh0ZW5zaW9uIiwiZG93bmxvYWRRdWVyeSIsImxhc3RPYmplY3QiLCJwcm9jZXNzUXVlcnlSZXNwb25zZSIsIk1hdGgiLCJjZWlsIiwidXBkYXRlZEF0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJvbk9iamVjdCIsImpzb24iLCJkb25lIiwicm93IiwicHJvY2Vzc1F1ZXJ5T2JqZWN0Iiwib25JbnZhbGlkIiwiY29uc29sZSIsImVycm9yIiwidG9TdHJpbmciLCJFcnJvciIsIm9uVHJ1bmNhdGVkIiwib25FbmQiLCJvbkVycm9yIiwiZXJyIiwib24iLCJwcm9jZXNzT2JqZWN0QXN5bmMiLCJ0aGVuIiwiY2F0Y2giLCJhdHRyaWJ1dGVzRm9yUXVlcnlSb3ciLCJ0byIsInJxIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLE1BQU1BLGtCQUFrQixLQUF4Qjs7QUFFZSxNQUFNQyxxQkFBTixvQ0FBcUQ7QUFDbEUsTUFBSUMsVUFBSixHQUFpQjtBQUNmLFdBQU8sSUFBUDtBQUNEOztBQUVLQyxLQUFOLENBQVUsRUFBQ0MsVUFBRCxFQUFWLEVBQXdCO0FBQUE7O0FBQUE7QUFDdEIsWUFBTUMsUUFBUSxNQUFNLE1BQUtDLGNBQUwsRUFBcEI7O0FBRUEsVUFBSSxDQUFDRCxNQUFNRSxXQUFYLEVBQXdCO0FBQ3RCO0FBQ0Q7O0FBRUQsWUFBTUMsV0FBVyxNQUFLQSxRQUF0Qjs7QUFFQSxZQUFNQyxXQUFXRCxXQUFXQSxTQUFTRSxPQUFULEVBQVgsR0FBZ0MsSUFBakQ7O0FBRUEsWUFBS04sVUFBTCxHQUFrQkEsVUFBbEI7O0FBRUEsWUFBTSxNQUFLTyxRQUFMLENBQWNILFFBQWQsRUFBd0JDLFFBQXhCLEVBQWtDSixLQUFsQyxDQUFOO0FBYnNCO0FBY3ZCOztBQUVLTSxVQUFOLENBQWVILFFBQWYsRUFBeUJDLFFBQXpCLEVBQW1DSixLQUFuQyxFQUEwQztBQUFBOztBQUFBO0FBQ3hDLFVBQUlPLGVBQWVILFlBQVksQ0FBL0I7O0FBRUEsYUFBT0csZ0JBQWdCLElBQXZCLEVBQTZCO0FBQzNCLFlBQUksT0FBS1YsVUFBTCxJQUFtQk0sWUFBWSxJQUFuQyxFQUF5QztBQUN2Q0kseUJBQWUsTUFBTSxPQUFLQyxtQkFBTCxDQUF5QkwsUUFBekIsRUFBbUNJLFlBQW5DLEVBQWlEUCxLQUFqRCxDQUFyQjtBQUNELFNBRkQsTUFFTztBQUNMTyx5QkFBZSxNQUFNLE9BQUtFLG9CQUFMLENBQTBCTixRQUExQixFQUFvQ0ksWUFBcEMsRUFBa0RQLEtBQWxELENBQXJCO0FBQ0Q7O0FBRUQsY0FBTSxPQUFLVSxPQUFMLENBQWFDLElBQWIsRUFBTjtBQUNEOztBQUVELFlBQU1YLE1BQU1ZLE1BQU4sRUFBTjtBQUNBLFlBQU0sT0FBS0MsTUFBTCxFQUFOO0FBZHdDO0FBZXpDOztBQUVLTCxxQkFBTixDQUEwQkwsUUFBMUIsRUFBb0NDLFFBQXBDLEVBQThDSixLQUE5QyxFQUFxRDtBQUFBOztBQUFBO0FBQ25ELFlBQU1jLGlCQUFpQixJQUFJQyxJQUFKLEVBQXZCOztBQUVBLGFBQUtDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE9BQUtDLFdBQUwsR0FBbUIsR0FBbkIsR0FBeUIsT0FBS0MsU0FBTCxDQUFlQyxJQUFsRCxFQUFkOztBQUVBLFlBQU1DLFVBQVUsTUFBTSxPQUFLQyxZQUFMLENBQWtCbkIsUUFBbEIsRUFBNEJDLFFBQTVCLENBQXRCOztBQUVBLFlBQU1tQixpQkFBaUIsSUFBSVIsSUFBSixHQUFXVixPQUFYLEtBQXVCUyxlQUFlVCxPQUFmLEVBQTlDOztBQUVBLFVBQUlnQixRQUFRRyxVQUFSLEtBQXVCLEdBQTNCLEVBQWdDO0FBQzlCLGVBQUtDLElBQUwsQ0FBVUosT0FBVjtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVELFlBQU1LLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1AsUUFBUVEsSUFBbkIsQ0FBYjs7QUFFQSxZQUFNQyxVQUFVSixLQUFLLE9BQUtLLFlBQVYsQ0FBaEI7O0FBRUEsWUFBTUMsS0FBSyxPQUFLQSxFQUFoQjs7QUFFQSxVQUFJQyxNQUFNLElBQUlsQixJQUFKLEVBQVY7O0FBRUEsYUFBS0MsUUFBTCxDQUFjLEVBQUNDLFNBQVMsT0FBS2lCLFVBQUwsR0FBa0IsR0FBbEIsR0FBd0IsT0FBS2YsU0FBTCxDQUFlQyxJQUFqRCxFQUF1RGUsT0FBTyxDQUE5RCxFQUFpRUMsT0FBT04sUUFBUU8sTUFBaEYsRUFBZDs7QUFFQSxZQUFNTCxHQUFHTSxXQUFIO0FBQUEscUNBQWUsV0FBT0MsUUFBUCxFQUFvQjtBQUN2QyxlQUFLLElBQUlDLFFBQVEsQ0FBakIsRUFBb0JBLFFBQVFWLFFBQVFPLE1BQXBDLEVBQTRDLEVBQUVHLEtBQTlDLEVBQXFEO0FBQ25ELGtCQUFNQyxhQUFhWCxRQUFRVSxLQUFSLENBQW5COztBQUVBLGtCQUFNRSxTQUFTLE1BQU0sT0FBS0MsWUFBTCxDQUFrQkosUUFBbEIsRUFBNEJFLFVBQTVCLENBQXJCOztBQUVBLGtCQUFNLE9BQUtHLE9BQUwsQ0FBYUYsTUFBYixFQUFxQkQsVUFBckIsQ0FBTjs7QUFFQSxtQkFBS3pCLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE9BQUtpQixVQUFMLEdBQWtCLEdBQWxCLEdBQXdCLE9BQUtmLFNBQUwsQ0FBZUMsSUFBakQsRUFBdURlLE9BQU9LLFFBQVEsQ0FBdEUsRUFBeUVKLE9BQU9OLFFBQVFPLE1BQXhGLEVBQWQ7QUFDRDtBQUNGLFNBVks7O0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBTjs7QUFZQSxZQUFNUSxZQUFZLElBQUk5QixJQUFKLEdBQVdWLE9BQVgsS0FBdUI0QixJQUFJNUIsT0FBSixFQUF6Qzs7QUFFQSxZQUFNWSxVQUFVLGtCQUFPLE9BQUs2QixRQUFMLEdBQWdCLGVBQXZCLEVBQ08sT0FBSzNCLFNBQUwsQ0FBZUMsSUFEdEIsRUFFTyxDQUFDRyxpQkFBaUIsSUFBbEIsRUFBd0J3QixJQUYvQixFQUdPLENBQUNGLFlBQVksSUFBYixFQUFtQkcsR0FIMUIsQ0FBaEI7O0FBS0EsYUFBS2hDLFFBQUwsQ0FBYyxFQUFDQyxPQUFELEVBQVVrQixPQUFPTCxRQUFRTyxNQUF6QixFQUFpQ0QsT0FBT04sUUFBUU8sTUFBaEQsRUFBZDs7QUFFQSxhQUFPWCxLQUFLdUIsYUFBWjtBQTdDbUQ7QUE4Q3BEOztBQUVLeEMsc0JBQU4sQ0FBMkJOLFFBQTNCLEVBQXFDQyxRQUFyQyxFQUErQ0osS0FBL0MsRUFBc0Q7QUFBQTs7QUFBQTtBQUNwRCxZQUFNa0QsTUFBTSxPQUFLQyxhQUFMLENBQW1CL0MsWUFBWSxDQUEvQixFQUFrQ1QsZUFBbEMsQ0FBWjs7QUFFQSxZQUFNeUQsVUFBVSxpQkFBT0MsV0FBUCxDQUFtQixPQUFLM0MsT0FBeEIsRUFBaUN3QyxHQUFqQyxDQUFoQjs7QUFFQSxZQUFNSSxXQUFXLGdCQUFNQyxJQUFOLENBQVcsRUFBQ0MsV0FBVyxTQUFaLEVBQVgsQ0FBakI7O0FBRUEsYUFBS3hDLFFBQUwsQ0FBYyxFQUFDQyxTQUFTLE9BQUtDLFdBQUwsR0FBbUIsR0FBbkIsR0FBeUIsT0FBS0MsU0FBTCxDQUFlQyxJQUFsRCxFQUFkOztBQUVBLFlBQU0sT0FBS3FDLGFBQUwsQ0FBbUJMLE9BQW5CLEVBQTRCRSxRQUE1QixDQUFOOztBQUVBLFlBQU0sRUFBQ25CLEtBQUQsRUFBUXVCLFVBQVIsS0FBc0IsTUFBTSxPQUFLQyxvQkFBTCxDQUEwQkwsUUFBMUIsQ0FBbEM7O0FBRUEsWUFBTXJDLFVBQVUsa0JBQU8sT0FBSzZCLFFBQUwsR0FBZ0IsS0FBdkIsRUFDTyxPQUFLM0IsU0FBTCxDQUFlQyxJQUR0QixDQUFoQjs7QUFHQSxhQUFLSixRQUFMLENBQWMsRUFBQ0MsT0FBRCxFQUFVa0IsT0FBT0EsS0FBakIsRUFBd0JDLE9BQU8sQ0FBQyxDQUFoQyxFQUFkOztBQUVBLFVBQUlELFNBQVN4QyxlQUFiLEVBQThCO0FBQzVCLGVBQU9pRSxLQUFLQyxJQUFMLENBQVVILFdBQVdJLFNBQVgsQ0FBcUJ6RCxPQUFyQixLQUFpQyxDQUEzQyxDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQO0FBdEJvRDtBQXVCckQ7O0FBRUtzRCxzQkFBTixDQUEyQkwsUUFBM0IsRUFBcUM7QUFBQTs7QUFBQTtBQUNuQyxhQUFLdEMsUUFBTCxDQUFjLEVBQUNDLFNBQVMsT0FBS2lCLFVBQUwsR0FBa0IsR0FBbEIsR0FBd0IsT0FBS2YsU0FBTCxDQUFlQyxJQUFqRCxFQUF1RGUsT0FBTyxDQUE5RCxFQUFpRUMsT0FBTyxDQUFDLENBQXpFLEVBQWQ7O0FBRUEsVUFBSUksUUFBUSxDQUFaO0FBQ0EsVUFBSWtCLGFBQWEsSUFBakI7O0FBRUEsWUFBTSxPQUFLMUIsRUFBTCxDQUFRTSxXQUFSO0FBQUEsc0NBQW9CLFdBQU9DLFFBQVAsRUFBb0I7QUFDNUMsZ0JBQU0sSUFBSXdCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckMsa0JBQU1DLFdBQVcsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWdCO0FBQy9CLGtCQUFJRCxLQUFLRSxHQUFULEVBQWM7QUFDWix1QkFBS0Msa0JBQUwsQ0FBd0JILElBQXhCLEVBQThCNUIsUUFBOUIsRUFBd0MsVUFBQ0csTUFBRCxFQUFZO0FBQ2xEZ0IsK0JBQWFoQixNQUFiO0FBQ0EseUJBQUsxQixRQUFMLENBQWMsRUFBQ0MsU0FBUyxPQUFLaUIsVUFBTCxHQUFrQixHQUFsQixHQUF3QixPQUFLZixTQUFMLENBQWVDLElBQWpELEVBQXVEZSxPQUFPSyxRQUFRLENBQXRFLEVBQXlFSixPQUFPLENBQUMsQ0FBakYsRUFBZDtBQUNBLG9CQUFFSSxLQUFGO0FBQ0E0QjtBQUNELGlCQUxEO0FBTUQsZUFQRCxNQU9PO0FBQ0xBO0FBQ0Q7QUFDRixhQVhEOztBQWFBLGtCQUFNRyxZQUFZLFVBQUM3QyxJQUFELEVBQU8wQyxJQUFQLEVBQWdCO0FBQ2hDSSxzQkFBUUMsS0FBUixDQUFjLFNBQWQsRUFBeUIvQyxRQUFRQSxLQUFLZ0QsUUFBTCxFQUFqQztBQUNBTixtQkFBSyxJQUFJTyxLQUFKLENBQVUsdUJBQVYsQ0FBTDtBQUNELGFBSEQ7O0FBS0Esa0JBQU1DLGNBQWMsVUFBQ2xELElBQUQsRUFBTzBDLElBQVAsRUFBZ0I7QUFDbENJLHNCQUFRQyxLQUFSLENBQWMsWUFBZCxFQUE0Qi9DLFFBQVFBLEtBQUtnRCxRQUFMLEVBQXBDO0FBQ0FOLG1CQUFLLElBQUlPLEtBQUosQ0FBVSx5QkFBVixDQUFMO0FBQ0QsYUFIRDs7QUFLQSxrQkFBTUUsUUFBUSxZQUFNO0FBQ2xCYjtBQUNELGFBRkQ7O0FBSUEsa0JBQU1jLFVBQVUsVUFBQ0MsR0FBRCxFQUFTO0FBQ3ZCZCxxQkFBT2MsR0FBUDtBQUNELGFBRkQ7O0FBSUEsb0NBQVV6QixRQUFWLEVBQW9CLEVBQUNZLFFBQUQsRUFBV0ssU0FBWCxFQUFzQkssV0FBdEIsRUFBcEIsRUFDR0ksRUFESCxDQUNNLEtBRE4sRUFDYUgsS0FEYixFQUVHRyxFQUZILENBRU0sT0FGTixFQUVlRixPQUZmO0FBR0QsV0FuQ0ssQ0FBTjtBQW9DRCxTQXJDSzs7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFOOztBQXVDQSxhQUFPLEVBQUMzQyxPQUFPSyxLQUFSLEVBQWVrQixVQUFmLEVBQVA7QUE3Q21DO0FBOENwQzs7QUFFRFkscUJBQW1CN0IsVUFBbkIsRUFBK0JGLFFBQS9CLEVBQXlDNkIsSUFBekMsRUFBK0M7QUFDN0MsU0FBS2Esa0JBQUwsQ0FBd0J4QyxVQUF4QixFQUFvQ0YsUUFBcEMsRUFBOEMyQyxJQUE5QyxDQUFtRGQsSUFBbkQsRUFBeURlLEtBQXpELENBQStEZixJQUEvRDtBQUNEOztBQUVLYSxvQkFBTixDQUF5QmQsSUFBekIsRUFBK0I1QixRQUEvQixFQUF5QztBQUFBOztBQUFBO0FBQ3ZDLFlBQU1FLGFBQWEsT0FBSzJDLHFCQUFMLENBQTJCakIsS0FBS0UsR0FBaEMsQ0FBbkI7O0FBRUEsWUFBTTNCLFNBQVMsTUFBTSxPQUFLQyxZQUFMLENBQWtCSixRQUFsQixFQUE0QkUsVUFBNUIsQ0FBckI7O0FBRUEsWUFBTSxPQUFLRyxPQUFMLENBQWFGLE1BQWIsRUFBcUJELFVBQXJCLENBQU47O0FBRUEsYUFBT0MsTUFBUDtBQVB1QztBQVF4Qzs7QUFFS2UsZUFBTixDQUFvQkwsT0FBcEIsRUFBNkJpQyxFQUE3QixFQUFpQztBQUFBO0FBQy9CLGFBQU8sSUFBSXRCLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsY0FBTXFCLEtBQUssdUJBQVFsQyxPQUFSLEVBQWlCbUMsSUFBakIsQ0FBc0IsYUFBR0MsaUJBQUgsQ0FBcUJILEVBQXJCLENBQXRCLENBQVg7QUFDQUMsV0FBR04sRUFBSCxDQUFNLE9BQU4sRUFBZTtBQUFBLGlCQUFNaEIsUUFBUXNCLEVBQVIsQ0FBTjtBQUFBLFNBQWY7QUFDQUEsV0FBR04sRUFBSCxDQUFNLE9BQU4sRUFBZWYsTUFBZjtBQUNELE9BSk0sQ0FBUDtBQUQrQjtBQU1oQzs7QUFFS3BELFFBQU4sR0FBZTtBQUFBOztBQUFBO0FBQ2IsWUFBTSxPQUFLSCxPQUFMLENBQWFDLElBQWIsRUFBTjtBQURhO0FBRWQ7QUF2TGlFO2tCQUEvQ2YscUIiLCJmaWxlIjoiZG93bmxvYWQtcXVlcnktc2VxdWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRG93bmxvYWRSZXNvdXJjZSBmcm9tICcuL2Rvd25sb2FkLXJlc291cmNlJztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vLi4vYXBpL2NsaWVudCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgdGVtcHkgZnJvbSAndGVtcHknO1xuaW1wb3J0IHsgcGFyc2VGaWxlIH0gZnJvbSAnLi4vLi4vLi4vanNvbnNlcSc7XG5pbXBvcnQgeyBmb3JtYXQgfSBmcm9tICd1dGlsJztcblxuY29uc3QgUVVFUllfUEFHRV9TSVpFID0gMjAwMDA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkUXVlcnlTZXF1ZW5jZSBleHRlbmRzIERvd25sb2FkUmVzb3VyY2Uge1xuICBnZXQgdXNlUmVzdEFQSSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFzeW5jIHJ1bih7ZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBzdGF0ZSA9IGF3YWl0IHRoaXMuY2hlY2tTeW5jU3RhdGUoKTtcblxuICAgIGlmICghc3RhdGUubmVlZHNVcGRhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0U3luYyA9IHRoaXMubGFzdFN5bmM7XG5cbiAgICBjb25zdCBzZXF1ZW5jZSA9IGxhc3RTeW5jID8gbGFzdFN5bmMuZ2V0VGltZSgpIDogbnVsbDtcblxuICAgIHRoaXMuZGF0YVNvdXJjZSA9IGRhdGFTb3VyY2U7XG5cbiAgICBhd2FpdCB0aGlzLmRvd25sb2FkKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWQobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGxldCBuZXh0U2VxdWVuY2UgPSBzZXF1ZW5jZSB8fCAwO1xuXG4gICAgd2hpbGUgKG5leHRTZXF1ZW5jZSAhPSBudWxsKSB7XG4gICAgICBpZiAodGhpcy51c2VSZXN0QVBJICYmIGxhc3RTeW5jICE9IG51bGwpIHtcbiAgICAgICAgbmV4dFNlcXVlbmNlID0gYXdhaXQgdGhpcy5kb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBuZXh0U2VxdWVuY2UsIHN0YXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5leHRTZXF1ZW5jZSA9IGF3YWl0IHRoaXMuZG93bmxvYWRRdWVyeUFQSVBhZ2UobGFzdFN5bmMsIG5leHRTZXF1ZW5jZSwgc3RhdGUpO1xuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICAgIH1cblxuICAgIGF3YWl0IHN0YXRlLnVwZGF0ZSgpO1xuICAgIGF3YWl0IHRoaXMuZmluaXNoKCk7XG4gIH1cblxuICBhc3luYyBkb3dubG9hZFJlc3RBUElQYWdlKGxhc3RTeW5jLCBzZXF1ZW5jZSwgc3RhdGUpIHtcbiAgICBjb25zdCBiZWdpbkZldGNoVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IHRoaXMuZmV0Y2hPYmplY3RzKGxhc3RTeW5jLCBzZXF1ZW5jZSk7XG5cbiAgICBjb25zdCB0b3RhbEZldGNoVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gYmVnaW5GZXRjaFRpbWUuZ2V0VGltZSgpO1xuXG4gICAgaWYgKHJlc3VsdHMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICB0aGlzLmZhaWwocmVzdWx0cyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyZXN1bHRzLmJvZHkpO1xuXG4gICAgY29uc3Qgb2JqZWN0cyA9IGRhdGFbdGhpcy5yZXNvdXJjZU5hbWVdO1xuXG4gICAgY29uc3QgZGIgPSB0aGlzLmRiO1xuXG4gICAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogMCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICBhd2FpdCBkYi50cmFuc2FjdGlvbihhc3luYyAoZGF0YWJhc2UpID0+IHtcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvYmplY3RzLmxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gb2JqZWN0c1tpbmRleF07XG5cbiAgICAgICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIGF3YWl0IHRoaXMucHJvY2VzcyhvYmplY3QsIGF0dHJpYnV0ZXMpO1xuXG4gICAgICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2U6IHRoaXMucHJvY2Vzc2luZyArICcgJyArIHRoaXMuc3luY0xhYmVsLmJsdWUsIGNvdW50OiBpbmRleCArIDEsIHRvdGFsOiBvYmplY3RzLmxlbmd0aH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgdG90YWxUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBub3cuZ2V0VGltZSgpO1xuXG4gICAgY29uc3QgbWVzc2FnZSA9IGZvcm1hdCh0aGlzLmZpbmlzaGVkICsgJyAlcyB8ICVzIHwgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3RhbEZldGNoVGltZSArICdtcycpLmN5YW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAodG90YWxUaW1lICsgJ21zJykucmVkKTtcblxuICAgIHRoaXMucHJvZ3Jlc3Moe21lc3NhZ2UsIGNvdW50OiBvYmplY3RzLmxlbmd0aCwgdG90YWw6IG9iamVjdHMubGVuZ3RofSk7XG5cbiAgICByZXR1cm4gZGF0YS5uZXh0X3NlcXVlbmNlO1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeUFQSVBhZ2UobGFzdFN5bmMsIHNlcXVlbmNlLCBzdGF0ZSkge1xuICAgIGNvbnN0IHNxbCA9IHRoaXMuZ2VuZXJhdGVRdWVyeShzZXF1ZW5jZSB8fCAwLCBRVUVSWV9QQUdFX1NJWkUpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IENsaWVudC5nZXRRdWVyeVVSTCh0aGlzLmFjY291bnQsIHNxbCk7XG5cbiAgICBjb25zdCBmaWxlUGF0aCA9IHRlbXB5LmZpbGUoe2V4dGVuc2lvbjogJ2pzb25zZXEnfSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLmRvd25sb2FkaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZX0pO1xuXG4gICAgYXdhaXQgdGhpcy5kb3dubG9hZFF1ZXJ5KG9wdGlvbnMsIGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IHtjb3VudCwgbGFzdE9iamVjdH0gPSBhd2FpdCB0aGlzLnByb2Nlc3NRdWVyeVJlc3BvbnNlKGZpbGVQYXRoKTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3JtYXQodGhpcy5maW5pc2hlZCArICcgJXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zeW5jTGFiZWwuYmx1ZSk7XG5cbiAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlLCBjb3VudDogY291bnQsIHRvdGFsOiAtMX0pO1xuXG4gICAgaWYgKGNvdW50ID49IFFVRVJZX1BBR0VfU0laRSkge1xuICAgICAgcmV0dXJuIE1hdGguY2VpbChsYXN0T2JqZWN0LnVwZGF0ZWRBdC5nZXRUaW1lKCkgLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGFzeW5jIHByb2Nlc3NRdWVyeVJlc3BvbnNlKGZpbGVQYXRoKSB7XG4gICAgdGhpcy5wcm9ncmVzcyh7bWVzc2FnZTogdGhpcy5wcm9jZXNzaW5nICsgJyAnICsgdGhpcy5zeW5jTGFiZWwuYmx1ZSwgY291bnQ6IDAsIHRvdGFsOiAtMX0pO1xuXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgbGFzdE9iamVjdCA9IG51bGw7XG5cbiAgICBhd2FpdCB0aGlzLmRiLnRyYW5zYWN0aW9uKGFzeW5jIChkYXRhYmFzZSkgPT4ge1xuICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCBvbk9iamVjdCA9IChqc29uLCBkb25lKSA9PiB7XG4gICAgICAgICAgaWYgKGpzb24ucm93KSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NRdWVyeU9iamVjdChqc29uLCBkYXRhYmFzZSwgKG9iamVjdCkgPT4ge1xuICAgICAgICAgICAgICBsYXN0T2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICAgICAgICB0aGlzLnByb2dyZXNzKHttZXNzYWdlOiB0aGlzLnByb2Nlc3NpbmcgKyAnICcgKyB0aGlzLnN5bmNMYWJlbC5ibHVlLCBjb3VudDogaW5kZXggKyAxLCB0b3RhbDogLTF9KTtcbiAgICAgICAgICAgICAgKytpbmRleDtcbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25JbnZhbGlkID0gKGRhdGEsIGRvbmUpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdJbnZhbGlkJywgZGF0YSAmJiBkYXRhLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGRvbmUobmV3IEVycm9yKCdpbnZhbGlkIEpTT04gc2VxdWVuY2UnKSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25UcnVuY2F0ZWQgPSAoZGF0YSwgZG9uZSkgPT4ge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RydW5jYXRlZDonLCBkYXRhICYmIGRhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgZG9uZShuZXcgRXJyb3IoJ3RydW5jYXRlZCBKU09OIHNlcXVlbmNlJykpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRW5kID0gKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHBhcnNlRmlsZShmaWxlUGF0aCwge29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSlcbiAgICAgICAgICAub24oJ2VuZCcsIG9uRW5kKVxuICAgICAgICAgIC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtjb3VudDogaW5kZXgsIGxhc3RPYmplY3R9O1xuICB9XG5cbiAgcHJvY2Vzc1F1ZXJ5T2JqZWN0KGF0dHJpYnV0ZXMsIGRhdGFiYXNlLCBkb25lKSB7XG4gICAgdGhpcy5wcm9jZXNzT2JqZWN0QXN5bmMoYXR0cmlidXRlcywgZGF0YWJhc2UpLnRoZW4oZG9uZSkuY2F0Y2goZG9uZSk7XG4gIH1cblxuICBhc3luYyBwcm9jZXNzT2JqZWN0QXN5bmMoanNvbiwgZGF0YWJhc2UpIHtcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzRm9yUXVlcnlSb3coanNvbi5yb3cpO1xuXG4gICAgY29uc3Qgb2JqZWN0ID0gYXdhaXQgdGhpcy5maW5kT3JDcmVhdGUoZGF0YWJhc2UsIGF0dHJpYnV0ZXMpO1xuXG4gICAgYXdhaXQgdGhpcy5wcm9jZXNzKG9iamVjdCwgYXR0cmlidXRlcyk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgYXN5bmMgZG93bmxvYWRRdWVyeShvcHRpb25zLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3Qob3B0aW9ucykucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bykpO1xuICAgICAgcnEub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZShycSkpO1xuICAgICAgcnEub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGZpbmlzaCgpIHtcbiAgICBhd2FpdCB0aGlzLmFjY291bnQuc2F2ZSgpO1xuICB9XG59XG4iXX0=