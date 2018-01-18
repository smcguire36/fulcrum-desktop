'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _downloadRecords = require('./download-records');

var _downloadRecords2 = _interopRequireDefault(_downloadRecords);

var _downloadPhotos = require('./download-photos');

var _downloadPhotos2 = _interopRequireDefault(_downloadPhotos);

var _downloadVideos = require('./download-videos');

var _downloadVideos2 = _interopRequireDefault(_downloadVideos);

var _downloadAudio = require('./download-audio');

var _downloadAudio2 = _interopRequireDefault(_downloadAudio);

var _downloadSignatures = require('./download-signatures');

var _downloadSignatures2 = _interopRequireDefault(_downloadSignatures);

var _app = require('../../app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class DownloadAllRecords extends _task2.default {
  run({ dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const forms = yield _this.account.findActiveForms();

      const includedForms = _this.includedForms;

      for (const form of forms) {
        if (includedForms != null && includedForms.indexOf(form.id) === -1) {
          continue;
        }

        yield new Promise(function (resolve, reject) {
          form.load(dataSource, resolve);
        });

        _this.synchronizer.addTask(new _downloadRecords2.default(_extends({ form: form }, _this.synchronizer.taskParams)));
      }

      // download media here to make sure the tasks are ordered after the records
      _this.synchronizer.addTask(new _downloadPhotos2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadVideos2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadAudio2.default(_this.synchronizer.taskParams));
      _this.synchronizer.addTask(new _downloadSignatures2.default(_this.synchronizer.taskParams));
    })();
  }

  get includedForms() {
    if (_app2.default.args.form) {
      return Array.isArray(_app2.default.args.form) ? _app2.default.args.form : [_app2.default.args.form];
    }

    return null;
  }
}
exports.default = DownloadAllRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtYWxsLXJlY29yZHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRBbGxSZWNvcmRzIiwicnVuIiwiZGF0YVNvdXJjZSIsImZvcm1zIiwiYWNjb3VudCIsImZpbmRBY3RpdmVGb3JtcyIsImluY2x1ZGVkRm9ybXMiLCJmb3JtIiwiaW5kZXhPZiIsImlkIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJsb2FkIiwic3luY2hyb25pemVyIiwiYWRkVGFzayIsInRhc2tQYXJhbXMiLCJhcmdzIiwiQXJyYXkiLCJpc0FycmF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVlLE1BQU1BLGtCQUFOLHdCQUFzQztBQUM3Q0MsS0FBTixDQUFVLEVBQUNDLFVBQUQsRUFBVixFQUF3QjtBQUFBOztBQUFBO0FBQ3RCLFlBQU1DLFFBQVEsTUFBTSxNQUFLQyxPQUFMLENBQWFDLGVBQWIsRUFBcEI7O0FBRUEsWUFBTUMsZ0JBQWdCLE1BQUtBLGFBQTNCOztBQUVBLFdBQUssTUFBTUMsSUFBWCxJQUFtQkosS0FBbkIsRUFBMEI7QUFDeEIsWUFBSUcsaUJBQWlCLElBQWpCLElBQXlCQSxjQUFjRSxPQUFkLENBQXNCRCxLQUFLRSxFQUEzQixNQUFtQyxDQUFDLENBQWpFLEVBQW9FO0FBQ2xFO0FBQ0Q7O0FBRUQsY0FBTSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQ3JDTCxlQUFLTSxJQUFMLENBQVVYLFVBQVYsRUFBc0JTLE9BQXRCO0FBQ0QsU0FGSyxDQUFOOztBQUlBLGNBQUtHLFlBQUwsQ0FBa0JDLE9BQWxCLENBQTBCLHlDQUFxQlIsTUFBTUEsSUFBM0IsSUFBb0MsTUFBS08sWUFBTCxDQUFrQkUsVUFBdEQsRUFBMUI7QUFDRDs7QUFFRDtBQUNBLFlBQUtGLFlBQUwsQ0FBa0JDLE9BQWxCLENBQTBCLDZCQUFtQixNQUFLRCxZQUFMLENBQWtCRSxVQUFyQyxDQUExQjtBQUNBLFlBQUtGLFlBQUwsQ0FBa0JDLE9BQWxCLENBQTBCLDZCQUFtQixNQUFLRCxZQUFMLENBQWtCRSxVQUFyQyxDQUExQjtBQUNBLFlBQUtGLFlBQUwsQ0FBa0JDLE9BQWxCLENBQTBCLDRCQUFrQixNQUFLRCxZQUFMLENBQWtCRSxVQUFwQyxDQUExQjtBQUNBLFlBQUtGLFlBQUwsQ0FBa0JDLE9BQWxCLENBQTBCLGlDQUF1QixNQUFLRCxZQUFMLENBQWtCRSxVQUF6QyxDQUExQjtBQXJCc0I7QUFzQnZCOztBQUVELE1BQUlWLGFBQUosR0FBb0I7QUFDbEIsUUFBSSxjQUFJVyxJQUFKLENBQVNWLElBQWIsRUFBbUI7QUFDakIsYUFBT1csTUFBTUMsT0FBTixDQUFjLGNBQUlGLElBQUosQ0FBU1YsSUFBdkIsSUFBK0IsY0FBSVUsSUFBSixDQUFTVixJQUF4QyxHQUErQyxDQUFFLGNBQUlVLElBQUosQ0FBU1YsSUFBWCxDQUF0RDtBQUNEOztBQUVELFdBQU8sSUFBUDtBQUNEO0FBL0JrRDtrQkFBaENQLGtCIiwiZmlsZSI6ImRvd25sb2FkLWFsbC1yZWNvcmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRhc2sgZnJvbSAnLi90YXNrJztcbmltcG9ydCBEb3dubG9hZFJlY29yZHMgZnJvbSAnLi9kb3dubG9hZC1yZWNvcmRzJztcbmltcG9ydCBEb3dubG9hZFBob3RvcyBmcm9tICcuL2Rvd25sb2FkLXBob3Rvcyc7XG5pbXBvcnQgRG93bmxvYWRWaWRlb3MgZnJvbSAnLi9kb3dubG9hZC12aWRlb3MnO1xuaW1wb3J0IERvd25sb2FkQXVkaW8gZnJvbSAnLi9kb3dubG9hZC1hdWRpbyc7XG5pbXBvcnQgRG93bmxvYWRTaWduYXR1cmVzIGZyb20gJy4vZG93bmxvYWQtc2lnbmF0dXJlcyc7XG5pbXBvcnQgYXBwIGZyb20gJy4uLy4uL2FwcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvd25sb2FkQWxsUmVjb3JkcyBleHRlbmRzIFRhc2sge1xuICBhc3luYyBydW4oe2RhdGFTb3VyY2V9KSB7XG4gICAgY29uc3QgZm9ybXMgPSBhd2FpdCB0aGlzLmFjY291bnQuZmluZEFjdGl2ZUZvcm1zKCk7XG5cbiAgICBjb25zdCBpbmNsdWRlZEZvcm1zID0gdGhpcy5pbmNsdWRlZEZvcm1zO1xuXG4gICAgZm9yIChjb25zdCBmb3JtIG9mIGZvcm1zKSB7XG4gICAgICBpZiAoaW5jbHVkZWRGb3JtcyAhPSBudWxsICYmIGluY2x1ZGVkRm9ybXMuaW5kZXhPZihmb3JtLmlkKSA9PT0gLTEpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZm9ybS5sb2FkKGRhdGFTb3VyY2UsIHJlc29sdmUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkUmVjb3Jkcyh7Zm9ybTogZm9ybSwgLi4udGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtc30pKTtcbiAgICB9XG5cbiAgICAvLyBkb3dubG9hZCBtZWRpYSBoZXJlIHRvIG1ha2Ugc3VyZSB0aGUgdGFza3MgYXJlIG9yZGVyZWQgYWZ0ZXIgdGhlIHJlY29yZHNcbiAgICB0aGlzLnN5bmNocm9uaXplci5hZGRUYXNrKG5ldyBEb3dubG9hZFBob3Rvcyh0aGlzLnN5bmNocm9uaXplci50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5zeW5jaHJvbml6ZXIuYWRkVGFzayhuZXcgRG93bmxvYWRWaWRlb3ModGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtcykpO1xuICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkQXVkaW8odGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtcykpO1xuICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkU2lnbmF0dXJlcyh0aGlzLnN5bmNocm9uaXplci50YXNrUGFyYW1zKSk7XG4gIH1cblxuICBnZXQgaW5jbHVkZWRGb3JtcygpIHtcbiAgICBpZiAoYXBwLmFyZ3MuZm9ybSkge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXBwLmFyZ3MuZm9ybSkgPyBhcHAuYXJncy5mb3JtIDogWyBhcHAuYXJncy5mb3JtIF07XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==