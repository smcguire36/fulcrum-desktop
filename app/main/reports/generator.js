'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mv = require('mv');

var _mv2 = _interopRequireDefault(_mv);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fulcrumCore = require('fulcrum-core');

var _htmlToPdf = require('./html-to-pdf');

var _htmlToPdf2 = _interopRequireDefault(_htmlToPdf);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _sanitizeFilename = require('sanitize-filename');

var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const move = _bluebird2.default.promisify(_mv2.default);

class ReportGenerator {
  constructor(record) {
    this.renderValues = (feature, renderFunction) => {
      for (const element of feature.formValues.container.elements) {
        const formValue = feature.formValues.get(element.key);

        if (formValue) {
          renderFunction(element, formValue);
        }
      }
    };

    this.record = record;
  }

  get contentTemplate() {
    return _fs2.default.readFileSync(_path2.default.join(__dirname, 'template.ejs')).toString();
  }

  generate(directory) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = {
        DateUtils: _fulcrumCore.DateUtils,
        record: _this.record,
        renderValues: _this.renderValues
      };

      const options = {};

      const html = _ejs2.default.render(_this.contentTemplate, data, options);

      const topdf = new _htmlToPdf2.default(html);

      const result = yield topdf.run();

      let outputPath = null;

      if (result) {
        const reportName = (0, _sanitizeFilename2.default)(_this.record.displayValue || _this.record.id);

        outputPath = _path2.default.join(directory, reportName + '.pdf');

        yield move(result.file, outputPath);
      }

      yield topdf.cleanup();

      return { file: outputPath, size: result.size };
    })();
  }

  static generate({ reportName, template, header, footer, cover, data, directory, ejsOptions, reportOptions }) {
    return _asyncToGenerator(function* () {
      const bodyContent = _ejs2.default.render(template, data, ejsOptions);
      const headerContent = header ? _ejs2.default.render(header, data, ejsOptions) : null;
      const footerContent = footer ? _ejs2.default.render(footer, data, ejsOptions) : null;
      const coverContent = cover ? _ejs2.default.render(cover, data, ejsOptions) : null;

      const topdf = new _htmlToPdf2.default(bodyContent, _extends({ header: headerContent, footer: footerContent, cover: coverContent }, reportOptions));

      const result = yield topdf.run();

      let outputPath = null;

      if (result) {
        outputPath = _path2.default.join(directory, (0, _sanitizeFilename2.default)(reportName) + '.pdf');

        yield move(result.file, outputPath);
      }

      yield topdf.cleanup();

      return { file: outputPath, size: result.size };
    })();
  }
}
exports.default = ReportGenerator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3JlcG9ydHMvZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbIm1vdmUiLCJwcm9taXNpZnkiLCJSZXBvcnRHZW5lcmF0b3IiLCJjb25zdHJ1Y3RvciIsInJlY29yZCIsInJlbmRlclZhbHVlcyIsImZlYXR1cmUiLCJyZW5kZXJGdW5jdGlvbiIsImVsZW1lbnQiLCJmb3JtVmFsdWVzIiwiY29udGFpbmVyIiwiZWxlbWVudHMiLCJmb3JtVmFsdWUiLCJnZXQiLCJrZXkiLCJjb250ZW50VGVtcGxhdGUiLCJyZWFkRmlsZVN5bmMiLCJqb2luIiwiX19kaXJuYW1lIiwidG9TdHJpbmciLCJnZW5lcmF0ZSIsImRpcmVjdG9yeSIsImRhdGEiLCJEYXRlVXRpbHMiLCJvcHRpb25zIiwiaHRtbCIsInJlbmRlciIsInRvcGRmIiwicmVzdWx0IiwicnVuIiwib3V0cHV0UGF0aCIsInJlcG9ydE5hbWUiLCJkaXNwbGF5VmFsdWUiLCJpZCIsImZpbGUiLCJjbGVhbnVwIiwic2l6ZSIsInRlbXBsYXRlIiwiaGVhZGVyIiwiZm9vdGVyIiwiY292ZXIiLCJlanNPcHRpb25zIiwicmVwb3J0T3B0aW9ucyIsImJvZHlDb250ZW50IiwiaGVhZGVyQ29udGVudCIsImZvb3RlckNvbnRlbnQiLCJjb3ZlckNvbnRlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUEsT0FBTyxtQkFBUUMsU0FBUixjQUFiOztBQUVlLE1BQU1DLGVBQU4sQ0FBc0I7QUFDbkNDLGNBQVlDLE1BQVosRUFBb0I7QUFBQSxTQXNDcEJDLFlBdENvQixHQXNDTCxDQUFDQyxPQUFELEVBQVVDLGNBQVYsS0FBNkI7QUFDMUMsV0FBSyxNQUFNQyxPQUFYLElBQXNCRixRQUFRRyxVQUFSLENBQW1CQyxTQUFuQixDQUE2QkMsUUFBbkQsRUFBNkQ7QUFDM0QsY0FB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QU9RLElBQWhDLEVBQVA7QUFwQitHO0FBcUJoSDtBQXRFa0M7a0JBQWhCbEMsZSIsImZpbGUiOiJnZW5lcmF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZWpzIGZyb20gJ2Vqcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG12IGZyb20gJ212JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRGF0ZVV0aWxzIH0gZnJvbSAnZnVsY3J1bS1jb3JlJztcbmltcG9ydCBIdG1sVG9QZGYgZnJvbSAnLi9odG1sLXRvLXBkZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgc2FuaXRpemUgZnJvbSAnc2FuaXRpemUtZmlsZW5hbWUnO1xuXG5jb25zdCBtb3ZlID0gUHJvbWlzZS5wcm9taXNpZnkobXYpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihyZWNvcmQpIHtcbiAgICB0aGlzLnJlY29yZCA9IHJlY29yZDtcbiAgfVxuXG4gIGdldCBjb250ZW50VGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVtcGxhdGUuZWpzJykpLnRvU3RyaW5nKCk7XG4gIH1cblxuICBhc3luYyBnZW5lcmF0ZShkaXJlY3RvcnkpIHtcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgRGF0ZVV0aWxzOiBEYXRlVXRpbHMsXG4gICAgICByZWNvcmQ6IHRoaXMucmVjb3JkLFxuICAgICAgcmVuZGVyVmFsdWVzOiB0aGlzLnJlbmRlclZhbHVlc1xuICAgIH07XG5cbiAgICBjb25zdCBvcHRpb25zID0ge307XG5cbiAgICBjb25zdCBodG1sID0gZWpzLnJlbmRlcih0aGlzLmNvbnRlbnRUZW1wbGF0ZSwgZGF0YSwgb3B0aW9ucyk7XG5cbiAgICBjb25zdCB0b3BkZiA9IG5ldyBIdG1sVG9QZGYoaHRtbCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0b3BkZi5ydW4oKTtcblxuICAgIGxldCBvdXRwdXRQYXRoID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIGNvbnN0IHJlcG9ydE5hbWUgPSBzYW5pdGl6ZSh0aGlzLnJlY29yZC5kaXNwbGF5VmFsdWUgfHwgdGhpcy5yZWNvcmQuaWQpO1xuXG4gICAgICBvdXRwdXRQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgcmVwb3J0TmFtZSArICcucGRmJyk7XG5cbiAgICAgIGF3YWl0IG1vdmUocmVzdWx0LmZpbGUsIG91dHB1dFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRvcGRmLmNsZWFudXAoKTtcblxuICAgIHJldHVybiB7ZmlsZTogb3V0cHV0UGF0aCwgc2l6ZTogcmVzdWx0LnNpemV9O1xuICB9XG5cbiAgcmVuZGVyVmFsdWVzID0gKGZlYXR1cmUsIHJlbmRlckZ1bmN0aW9uKSA9PiB7XG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIGZlYXR1cmUuZm9ybVZhbHVlcy5jb250YWluZXIuZWxlbWVudHMpIHtcbiAgICAgIGNvbnN0IGZvcm1WYWx1ZSA9IGZlYXR1cmUuZm9ybVZhbHVlcy5nZXQoZWxlbWVudC5rZXkpO1xuXG4gICAgICBpZiAoZm9ybVZhbHVlKSB7XG4gICAgICAgIHJlbmRlckZ1bmN0aW9uKGVsZW1lbnQsIGZvcm1WYWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGdlbmVyYXRlKHtyZXBvcnROYW1lLCB0ZW1wbGF0ZSwgaGVhZGVyLCBmb290ZXIsIGNvdmVyLCBkYXRhLCBkaXJlY3RvcnksIGVqc09wdGlvbnMsIHJlcG9ydE9wdGlvbnN9KSB7XG4gICAgY29uc3QgYm9keUNvbnRlbnQgPSBlanMucmVuZGVyKHRlbXBsYXRlLCBkYXRhLCBlanNPcHRpb25zKTtcbiAgICBjb25zdCBoZWFkZXJDb250ZW50ID0gaGVhZGVyID8gZWpzLnJlbmRlcihoZWFkZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcbiAgICBjb25zdCBmb290ZXJDb250ZW50ID0gZm9vdGVyID8gZWpzLnJlbmRlcihmb290ZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcbiAgICBjb25zdCBjb3ZlckNvbnRlbnQgPSBjb3ZlciA/IGVqcy5yZW5kZXIoY292ZXIsIGRhdGEsIGVqc09wdGlvbnMpIDogbnVsbDtcblxuICAgIGNvbnN0IHRvcGRmID0gbmV3IEh0bWxUb1BkZihib2R5Q29udGVudCwge2hlYWRlcjogaGVhZGVyQ29udGVudCwgZm9vdGVyOiBmb290ZXJDb250ZW50LCBjb3ZlcjogY292ZXJDb250ZW50LCAuLi5yZXBvcnRPcHRpb25zfSk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0b3BkZi5ydW4oKTtcblxuICAgIGxldCBvdXRwdXRQYXRoID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBzYW5pdGl6ZShyZXBvcnROYW1lKSArICcucGRmJyk7XG5cbiAgICAgIGF3YWl0IG1vdmUocmVzdWx0LmZpbGUsIG91dHB1dFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRvcGRmLmNsZWFudXAoKTtcblxuICAgIHJldHVybiB7ZmlsZTogb3V0cHV0UGF0aCwgc2l6ZTogcmVzdWx0LnNpemV9O1xuICB9XG59XG4iXX0=