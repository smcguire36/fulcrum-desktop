'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sequenceSplitter = sequenceSplitter;
exports.jsonSequenceStream = jsonSequenceStream;
exports.parseFile = parseFile;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _delimitStream = require('delimit-stream');

var _delimitStream2 = _interopRequireDefault(_delimitStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sequenceSplitter() {
  return new _delimitStream2.default('\x1e', { objectMode: true });
}

function jsonSequenceStream({ onObject, onInvalid, onTruncated } = {}) {
  return _through2.default.obj(function (chunk, encoding, completion) {
    _assert2.default.ok(chunk.length > 0);

    // if the entry doesn't end with \n, it got truncated
    if (chunk[chunk.length - 1] !== 0x0a) {
      this.push({ truncated: chunk });

      if (onTruncated) {
        onTruncated(chunk, completion);
      } else {
        completion();
      }
    } else {
      try {
        const json = JSON.parse(chunk.toString());

        this.push({ json: json });

        if (onObject) {
          onObject(json, completion);
        } else {
          completion();
        }
      } catch (error) {
        this.push({ invalid: chunk });

        if (onInvalid) {
          onInvalid(chunk, completion);
        } else {
          completion();
        }
      }
    }
  });
}

function parseFile(filePath, { onObject, onInvalid, onTruncated }) {
  return _fs2.default.createReadStream(filePath).pipe(sequenceSplitter()).pipe(jsonSequenceStream({ onObject, onInvalid, onTruncated })).on('data', () => {});
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uc2VxLmpzIl0sIm5hbWVzIjpbInNlcXVlbmNlU3BsaXR0ZXIiLCJqc29uU2VxdWVuY2VTdHJlYW0iLCJwYXJzZUZpbGUiLCJvYmplY3RNb2RlIiwib25PYmplY3QiLCJvbkludmFsaWQiLCJvblRydW5jYXRlZCIsIm9iaiIsImNodW5rIiwiZW5jb2RpbmciLCJjb21wbGV0aW9uIiwib2siLCJsZW5ndGgiLCJwdXNoIiwidHJ1bmNhdGVkIiwianNvbiIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwiZXJyb3IiLCJpbnZhbGlkIiwiZmlsZVBhdGgiLCJjcmVhdGVSZWFkU3RyZWFtIiwicGlwZSIsIm9uIl0sIm1hcHBpbmdzIjoiOzs7OztRQUtnQkEsZ0IsR0FBQUEsZ0I7UUFJQUMsa0IsR0FBQUEsa0I7UUFxQ0FDLFMsR0FBQUEsUzs7QUE5Q2hCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTRixnQkFBVCxHQUE0QjtBQUNqQyxTQUFPLDRCQUFrQixNQUFsQixFQUEwQixFQUFDRyxZQUFZLElBQWIsRUFBMUIsQ0FBUDtBQUNEOztBQUVNLFNBQVNGLGtCQUFULENBQTRCLEVBQUNHLFFBQUQsRUFBV0MsU0FBWCxFQUFzQkMsV0FBdEIsS0FBcUMsRUFBakUsRUFBcUU7QUFDMUUsU0FBTyxrQkFBU0MsR0FBVCxDQUFhLFVBQVNDLEtBQVQsRUFBZ0JDLFFBQWhCLEVBQTBCQyxVQUExQixFQUFzQztBQUN4RCxxQkFBT0MsRUFBUCxDQUFVSCxNQUFNSSxNQUFOLEdBQWUsQ0FBekI7O0FBRUE7QUFDQSxRQUFJSixNQUFNQSxNQUFNSSxNQUFOLEdBQWUsQ0FBckIsTUFBNEIsSUFBaEMsRUFBc0M7QUFDcEMsV0FBS0MsSUFBTCxDQUFVLEVBQUNDLFdBQVdOLEtBQVosRUFBVjs7QUFFQSxVQUFJRixXQUFKLEVBQWlCO0FBQ2ZBLG9CQUFZRSxLQUFaLEVBQW1CRSxVQUFuQjtBQUNELE9BRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0YsS0FSRCxNQVFPO0FBQ0wsVUFBSTtBQUNGLGNBQU1LLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1QsTUFBTVUsUUFBTixFQUFYLENBQWI7O0FBRUEsYUFBS0wsSUFBTCxDQUFVLEVBQUNFLE1BQU1BLElBQVAsRUFBVjs7QUFFQSxZQUFJWCxRQUFKLEVBQWM7QUFDWkEsbUJBQVNXLElBQVQsRUFBZUwsVUFBZjtBQUNELFNBRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0YsT0FWRCxDQVVFLE9BQU9TLEtBQVAsRUFBYztBQUNkLGFBQUtOLElBQUwsQ0FBVSxFQUFDTyxTQUFTWixLQUFWLEVBQVY7O0FBRUEsWUFBSUgsU0FBSixFQUFlO0FBQ2JBLG9CQUFVRyxLQUFWLEVBQWlCRSxVQUFqQjtBQUNELFNBRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEdBakNNLENBQVA7QUFrQ0Q7O0FBRU0sU0FBU1IsU0FBVCxDQUFtQm1CLFFBQW5CLEVBQTZCLEVBQUNqQixRQUFELEVBQVdDLFNBQVgsRUFBc0JDLFdBQXRCLEVBQTdCLEVBQWlFO0FBQ3RFLFNBQU8sYUFBR2dCLGdCQUFILENBQW9CRCxRQUFwQixFQUNHRSxJQURILENBQ1F2QixrQkFEUixFQUVHdUIsSUFGSCxDQUVRdEIsbUJBQW1CLEVBQUNHLFFBQUQsRUFBV0MsU0FBWCxFQUFzQkMsV0FBdEIsRUFBbkIsQ0FGUixFQUdHa0IsRUFISCxDQUdNLE1BSE4sRUFHYyxNQUFNLENBQUUsQ0FIdEIsQ0FBUDtBQUlEIiwiZmlsZSI6Impzb25zZXEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5pbXBvcnQgdGhyb3VnaDIgZnJvbSAndGhyb3VnaDInO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBEZWxpbWl0U3RyZWFtIGZyb20gJ2RlbGltaXQtc3RyZWFtJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlU3BsaXR0ZXIoKSB7XG4gIHJldHVybiBuZXcgRGVsaW1pdFN0cmVhbSgnXFx4MWUnLCB7b2JqZWN0TW9kZTogdHJ1ZX0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24ganNvblNlcXVlbmNlU3RyZWFtKHtvbk9iamVjdCwgb25JbnZhbGlkLCBvblRydW5jYXRlZH0gPSB7fSkge1xuICByZXR1cm4gdGhyb3VnaDIub2JqKGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY29tcGxldGlvbikge1xuICAgIGFzc2VydC5vayhjaHVuay5sZW5ndGggPiAwKTtcblxuICAgIC8vIGlmIHRoZSBlbnRyeSBkb2Vzbid0IGVuZCB3aXRoIFxcbiwgaXQgZ290IHRydW5jYXRlZFxuICAgIGlmIChjaHVua1tjaHVuay5sZW5ndGggLSAxXSAhPT0gMHgwYSkge1xuICAgICAgdGhpcy5wdXNoKHt0cnVuY2F0ZWQ6IGNodW5rfSk7XG5cbiAgICAgIGlmIChvblRydW5jYXRlZCkge1xuICAgICAgICBvblRydW5jYXRlZChjaHVuaywgY29tcGxldGlvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wbGV0aW9uKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNodW5rLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIHRoaXMucHVzaCh7anNvbjoganNvbn0pO1xuXG4gICAgICAgIGlmIChvbk9iamVjdCkge1xuICAgICAgICAgIG9uT2JqZWN0KGpzb24sIGNvbXBsZXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBsZXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5wdXNoKHtpbnZhbGlkOiBjaHVua30pO1xuXG4gICAgICAgIGlmIChvbkludmFsaWQpIHtcbiAgICAgICAgICBvbkludmFsaWQoY2h1bmssIGNvbXBsZXRpb24pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXBsZXRpb24oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbGUoZmlsZVBhdGgsIHtvbk9iamVjdCwgb25JbnZhbGlkLCBvblRydW5jYXRlZH0pIHtcbiAgcmV0dXJuIGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZVBhdGgpXG4gICAgICAgICAgIC5waXBlKHNlcXVlbmNlU3BsaXR0ZXIoKSlcbiAgICAgICAgICAgLnBpcGUoanNvblNlcXVlbmNlU3RyZWFtKHtvbk9iamVjdCwgb25JbnZhbGlkLCBvblRydW5jYXRlZH0pKVxuICAgICAgICAgICAub24oJ2RhdGEnLCAoKSA9PiB7fSk7XG59XG4iXX0=