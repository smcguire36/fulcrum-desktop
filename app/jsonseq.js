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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9qc29uc2VxLmpzIl0sIm5hbWVzIjpbInNlcXVlbmNlU3BsaXR0ZXIiLCJqc29uU2VxdWVuY2VTdHJlYW0iLCJwYXJzZUZpbGUiLCJvYmplY3RNb2RlIiwib25PYmplY3QiLCJvbkludmFsaWQiLCJvblRydW5jYXRlZCIsIm9iaiIsImNodW5rIiwiZW5jb2RpbmciLCJjb21wbGV0aW9uIiwib2siLCJsZW5ndGgiLCJwdXNoIiwidHJ1bmNhdGVkIiwianNvbiIsIkpTT04iLCJwYXJzZSIsInRvU3RyaW5nIiwiZXJyb3IiLCJpbnZhbGlkIiwiZmlsZVBhdGgiLCJjcmVhdGVSZWFkU3RyZWFtIiwicGlwZSIsIm9uIl0sIm1hcHBpbmdzIjoiOzs7OztRQUtnQkEsZ0IsR0FBQUEsZ0I7UUFJQUMsa0IsR0FBQUEsa0I7UUFxQ0FDLFMsR0FBQUEsUzs7QUE5Q2hCOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFTyxTQUFTRixnQkFBVCxHQUE0QjtBQUNqQyxTQUFPLDRCQUFrQixNQUFsQixFQUEwQixFQUFDRyxZQUFZLElBQWIsRUFBMUIsQ0FBUDtBQUNEOztBQUVNLFNBQVNGLGtCQUFULENBQTRCLEVBQUNHLFFBQUQsRUFBV0MsU0FBWCxFQUFzQkMsV0FBdEIsS0FBcUMsRUFBakUsRUFBcUU7QUFDMUUsU0FBTyxrQkFBU0MsR0FBVCxDQUFhLFVBQVNDLEtBQVQsRUFBZ0JDLFFBQWhCLEVBQTBCQyxVQUExQixFQUFzQztBQUN4RCxxQkFBT0MsRUFBUCxDQUFVSCxNQUFNSSxNQUFOLEdBQWUsQ0FBekI7O0FBRUE7QUFDQSxRQUFJSixNQUFNQSxNQUFNSSxNQUFOLEdBQWUsQ0FBckIsTUFBNEIsSUFBaEMsRUFBc0M7QUFDcEMsV0FBS0MsSUFBTCxDQUFVLEVBQUNDLFdBQVdOLEtBQVosRUFBVjs7QUFFQSxVQUFJRixXQUFKLEVBQWlCO0FBQ2ZBLG9CQUFZRSxLQUFaLEVBQW1CRSxVQUFuQjtBQUNELE9BRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0YsS0FSRCxNQVFPO0FBQ0wsVUFBSTtBQUNGLGNBQU1LLE9BQU9DLEtBQUtDLEtBQUwsQ0FBV1QsTUFBTVUsUUFBTixFQUFYLENBQWI7O0FBRUEsYUFBS0wsSUFBTCxDQUFVLEVBQUNFLE1BQU1BLElBQVAsRUFBVjs7QUFFQSxZQUFJWCxRQUFKLEVBQWM7QUFDWkEsbUJBQVNXLElBQVQsRUFBZUwsVUFBZjtBQUNELFNBRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0YsT0FWRCxDQVVFLE9BQU9TLEtBQVAsRUFBYztBQUNkLGFBQUtOLElBQUwsQ0FBVSxFQUFDTyxTQUFTWixLQUFWLEVBQVY7O0FBRUEsWUFBSUgsU0FBSixFQUFlO0FBQ2JBLG9CQUFVRyxLQUFWLEVBQWlCRSxVQUFqQjtBQUNELFNBRkQsTUFFTztBQUNMQTtBQUNEO0FBQ0Y7QUFDRjtBQUNGLEdBakNNLENBQVA7QUFrQ0Q7O0FBRU0sU0FBU1IsU0FBVCxDQUFtQm1CLFFBQW5CLEVBQTZCLEVBQUNqQixRQUFELEVBQVdDLFNBQVgsRUFBc0JDLFdBQXRCLEVBQTdCLEVBQWlFO0FBQ3RFLFNBQU8sYUFBR2dCLGdCQUFILENBQW9CRCxRQUFwQixFQUNHRSxJQURILENBQ1F2QixrQkFEUixFQUVHdUIsSUFGSCxDQUVRdEIsbUJBQW1CLEVBQUNHLFFBQUQsRUFBV0MsU0FBWCxFQUFzQkMsV0FBdEIsRUFBbkIsQ0FGUixFQUdHa0IsRUFISCxDQUdNLE1BSE4sRUFHYyxNQUFNLENBQUUsQ0FIdEIsQ0FBUDtBQUlEIiwiZmlsZSI6Impzb25zZXEuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XHJcbmltcG9ydCB0aHJvdWdoMiBmcm9tICd0aHJvdWdoMic7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBEZWxpbWl0U3RyZWFtIGZyb20gJ2RlbGltaXQtc3RyZWFtJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXF1ZW5jZVNwbGl0dGVyKCkge1xyXG4gIHJldHVybiBuZXcgRGVsaW1pdFN0cmVhbSgnXFx4MWUnLCB7b2JqZWN0TW9kZTogdHJ1ZX0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24ganNvblNlcXVlbmNlU3RyZWFtKHtvbk9iamVjdCwgb25JbnZhbGlkLCBvblRydW5jYXRlZH0gPSB7fSkge1xyXG4gIHJldHVybiB0aHJvdWdoMi5vYmooZnVuY3Rpb24oY2h1bmssIGVuY29kaW5nLCBjb21wbGV0aW9uKSB7XHJcbiAgICBhc3NlcnQub2soY2h1bmsubGVuZ3RoID4gMCk7XHJcblxyXG4gICAgLy8gaWYgdGhlIGVudHJ5IGRvZXNuJ3QgZW5kIHdpdGggXFxuLCBpdCBnb3QgdHJ1bmNhdGVkXHJcbiAgICBpZiAoY2h1bmtbY2h1bmsubGVuZ3RoIC0gMV0gIT09IDB4MGEpIHtcclxuICAgICAgdGhpcy5wdXNoKHt0cnVuY2F0ZWQ6IGNodW5rfSk7XHJcblxyXG4gICAgICBpZiAob25UcnVuY2F0ZWQpIHtcclxuICAgICAgICBvblRydW5jYXRlZChjaHVuaywgY29tcGxldGlvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGxldGlvbigpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNodW5rLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICB0aGlzLnB1c2goe2pzb246IGpzb259KTtcclxuXHJcbiAgICAgICAgaWYgKG9uT2JqZWN0KSB7XHJcbiAgICAgICAgICBvbk9iamVjdChqc29uLCBjb21wbGV0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29tcGxldGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICB0aGlzLnB1c2goe2ludmFsaWQ6IGNodW5rfSk7XHJcblxyXG4gICAgICAgIGlmIChvbkludmFsaWQpIHtcclxuICAgICAgICAgIG9uSW52YWxpZChjaHVuaywgY29tcGxldGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbXBsZXRpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRmlsZShmaWxlUGF0aCwge29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSkge1xyXG4gIHJldHVybiBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVQYXRoKVxyXG4gICAgICAgICAgIC5waXBlKHNlcXVlbmNlU3BsaXR0ZXIoKSlcclxuICAgICAgICAgICAucGlwZShqc29uU2VxdWVuY2VTdHJlYW0oe29uT2JqZWN0LCBvbkludmFsaWQsIG9uVHJ1bmNhdGVkfSkpXHJcbiAgICAgICAgICAgLm9uKCdkYXRhJywgKCkgPT4ge30pO1xyXG59XHJcbiJdfQ==