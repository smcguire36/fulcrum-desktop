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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import DownloadPhotos from './download-photos';

class DownloadAllRecords extends _task2.default {
  run({ account, dataSource }) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const forms = yield account.findActiveForms();

      for (const form of forms) {
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
}
exports.default = DownloadAllRecords;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL3N5bmMvdGFza3MvZG93bmxvYWQtYWxsLXJlY29yZHMuanMiXSwibmFtZXMiOlsiRG93bmxvYWRBbGxSZWNvcmRzIiwicnVuIiwiYWNjb3VudCIsImRhdGFTb3VyY2UiLCJmb3JtcyIsImZpbmRBY3RpdmVGb3JtcyIsImZvcm0iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImxvYWQiLCJzeW5jaHJvbml6ZXIiLCJhZGRUYXNrIiwidGFza1BhcmFtcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBQ0E7O0FBRWUsTUFBTUEsa0JBQU4sd0JBQXNDO0FBQzdDQyxLQUFOLENBQVUsRUFBQ0MsT0FBRCxFQUFVQyxVQUFWLEVBQVYsRUFBaUM7QUFBQTs7QUFBQTtBQUMvQixZQUFNQyxRQUFRLE1BQU1GLFFBQVFHLGVBQVIsRUFBcEI7O0FBRUEsV0FBSyxNQUFNQyxJQUFYLElBQW1CRixLQUFuQixFQUEwQjtBQUN4QixjQUFNLElBQUlHLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDckNILGVBQUtJLElBQUwsQ0FBVVAsVUFBVixFQUFzQkssT0FBdEI7QUFDRCxTQUZLLENBQU47O0FBSUEsY0FBS0csWUFBTCxDQUFrQkMsT0FBbEIsQ0FBMEIseUNBQXFCTixNQUFNQSxJQUEzQixJQUFvQyxNQUFLSyxZQUFMLENBQWtCRSxVQUF0RCxFQUExQjtBQUNEOztBQUVEO0FBQ0EsWUFBS0YsWUFBTCxDQUFrQkMsT0FBbEIsQ0FBMEIsNkJBQW1CLE1BQUtELFlBQUwsQ0FBa0JFLFVBQXJDLENBQTFCO0FBQ0EsWUFBS0YsWUFBTCxDQUFrQkMsT0FBbEIsQ0FBMEIsNkJBQW1CLE1BQUtELFlBQUwsQ0FBa0JFLFVBQXJDLENBQTFCO0FBQ0EsWUFBS0YsWUFBTCxDQUFrQkMsT0FBbEIsQ0FBMEIsNEJBQWtCLE1BQUtELFlBQUwsQ0FBa0JFLFVBQXBDLENBQTFCO0FBQ0EsWUFBS0YsWUFBTCxDQUFrQkMsT0FBbEIsQ0FBMEIsaUNBQXVCLE1BQUtELFlBQUwsQ0FBa0JFLFVBQXpDLENBQTFCO0FBZitCO0FBZ0JoQztBQWpCa0Q7a0JBQWhDYixrQiIsImZpbGUiOiJkb3dubG9hZC1hbGwtcmVjb3Jkcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrIGZyb20gJy4vdGFzayc7XG5pbXBvcnQgRG93bmxvYWRSZWNvcmRzIGZyb20gJy4vZG93bmxvYWQtcmVjb3Jkcyc7XG5pbXBvcnQgRG93bmxvYWRQaG90b3MgZnJvbSAnLi9kb3dubG9hZC1waG90b3MnO1xuaW1wb3J0IERvd25sb2FkVmlkZW9zIGZyb20gJy4vZG93bmxvYWQtdmlkZW9zJztcbmltcG9ydCBEb3dubG9hZEF1ZGlvIGZyb20gJy4vZG93bmxvYWQtYXVkaW8nO1xuaW1wb3J0IERvd25sb2FkU2lnbmF0dXJlcyBmcm9tICcuL2Rvd25sb2FkLXNpZ25hdHVyZXMnO1xuLy8gaW1wb3J0IERvd25sb2FkUGhvdG9zIGZyb20gJy4vZG93bmxvYWQtcGhvdG9zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRG93bmxvYWRBbGxSZWNvcmRzIGV4dGVuZHMgVGFzayB7XG4gIGFzeW5jIHJ1bih7YWNjb3VudCwgZGF0YVNvdXJjZX0pIHtcbiAgICBjb25zdCBmb3JtcyA9IGF3YWl0IGFjY291bnQuZmluZEFjdGl2ZUZvcm1zKCk7XG5cbiAgICBmb3IgKGNvbnN0IGZvcm0gb2YgZm9ybXMpIHtcbiAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZm9ybS5sb2FkKGRhdGFTb3VyY2UsIHJlc29sdmUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkUmVjb3Jkcyh7Zm9ybTogZm9ybSwgLi4udGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtc30pKTtcbiAgICB9XG5cbiAgICAvLyBkb3dubG9hZCBtZWRpYSBoZXJlIHRvIG1ha2Ugc3VyZSB0aGUgdGFza3MgYXJlIG9yZGVyZWQgYWZ0ZXIgdGhlIHJlY29yZHNcbiAgICB0aGlzLnN5bmNocm9uaXplci5hZGRUYXNrKG5ldyBEb3dubG9hZFBob3Rvcyh0aGlzLnN5bmNocm9uaXplci50YXNrUGFyYW1zKSk7XG4gICAgdGhpcy5zeW5jaHJvbml6ZXIuYWRkVGFzayhuZXcgRG93bmxvYWRWaWRlb3ModGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtcykpO1xuICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkQXVkaW8odGhpcy5zeW5jaHJvbml6ZXIudGFza1BhcmFtcykpO1xuICAgIHRoaXMuc3luY2hyb25pemVyLmFkZFRhc2sobmV3IERvd25sb2FkU2lnbmF0dXJlcyh0aGlzLnN5bmNocm9uaXplci50YXNrUGFyYW1zKSk7XG4gIH1cbn1cbiJdfQ==