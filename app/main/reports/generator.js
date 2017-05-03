'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

  static generate({ reportName, template, header, footer, cover, data, directory, ejsOptions }) {
    return _asyncToGenerator(function* () {
      const bodyContent = _ejs2.default.render(template, data, ejsOptions);
      const headerContent = header ? _ejs2.default.render(header, data, ejsOptions) : null;
      const footerContent = footer ? _ejs2.default.render(footer, data, ejsOptions) : null;
      const coverContent = cover ? _ejs2.default.render(cover, data, ejsOptions) : null;

      const topdf = new _htmlToPdf2.default(bodyContent, headerContent, footerContent, coverContent);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3JlcG9ydHMvZ2VuZXJhdG9yLmpzIl0sIm5hbWVzIjpbIm1vdmUiLCJwcm9taXNpZnkiLCJSZXBvcnRHZW5lcmF0b3IiLCJjb25zdHJ1Y3RvciIsInJlY29yZCIsInJlbmRlclZhbHVlcyIsImZlYXR1cmUiLCJyZW5kZXJGdW5jdGlvbiIsImVsZW1lbnQiLCJmb3JtVmFsdWVzIiwiY29udGFpbmVyIiwiZWxlbWVudHMiLCJmb3JtVmFsdWUiLCJnZXQiLCJrZXkiLCJjb250ZW50VGVtcGxhdGUiLCJyZWFkRmlsZVN5bmMiLCJqb2luIiwiX19kaXJuYW1lIiwidG9TdHJpbmciLCJnZW5lcmF0ZSIsImRpcmVjdG9yeSIsImRhdGEiLCJEYXRlVXRpbHMiLCJvcHRpb25zIiwiaHRtbCIsInJlbmRlciIsInRvcGRmIiwicmVzdWx0IiwicnVuIiwib3V0cHV0UGF0aCIsInJlcG9ydE5hbWUiLCJkaXNwbGF5VmFsdWUiLCJpZCIsImZpbGUiLCJjbGVhbnVwIiwic2l6ZSIsInRlbXBsYXRlIiwiaGVhZGVyIiwiZm9vdGVyIiwiY292ZXIiLCJlanNPcHRpb25zIiwiYm9keUNvbnRlbnQiLCJoZWFkZXJDb250ZW50IiwiZm9vdGVyQ29udGVudCIsImNvdmVyQ29udGVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsTUFBTUEsT0FBTyxtQkFBUUMsU0FBUixjQUFiOztBQUVlLE1BQU1DLGVBQU4sQ0FBc0I7QUFDbkNDLGNBQVlDLE1BQVosRUFBb0I7QUFBQSxTQXNDcEJDLFlBdENvQixHQXNDTCxDQUFDQyxPQUFELEVBQVVDLGNBQVYsS0FBNkI7QUFDMUMsV0FBSyxNQUFNQyxPQUFYLElBQXNCRixRQUFRRyxVQUFSLENBQW1CQyxTQUFuQixDQUE2QkMsUUFBbkQsRUFBNkQ7QUFDM0QsY0FBTUMsWUFBWU4sUUFBUUcsVUFB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dG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGVqcyBmcm9tICdlanMnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBtdiBmcm9tICdtdic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IERhdGVVdGlscyB9IGZyb20gJ2Z1bGNydW0tY29yZSc7XG5pbXBvcnQgSHRtbFRvUGRmIGZyb20gJy4vaHRtbC10by1wZGYnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHNhbml0aXplIGZyb20gJ3Nhbml0aXplLWZpbGVuYW1lJztcblxuY29uc3QgbW92ZSA9IFByb21pc2UucHJvbWlzaWZ5KG12KTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVwb3J0R2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVjb3JkKSB7XG4gICAgdGhpcy5yZWNvcmQgPSByZWNvcmQ7XG4gIH1cblxuICBnZXQgY29udGVudFRlbXBsYXRlKCkge1xuICAgIHJldHVybiBmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3RlbXBsYXRlLmVqcycpKS50b1N0cmluZygpO1xuICB9XG5cbiAgYXN5bmMgZ2VuZXJhdGUoZGlyZWN0b3J5KSB7XG4gICAgY29uc3QgZGF0YSA9IHtcbiAgICAgIERhdGVVdGlsczogRGF0ZVV0aWxzLFxuICAgICAgcmVjb3JkOiB0aGlzLnJlY29yZCxcbiAgICAgIHJlbmRlclZhbHVlczogdGhpcy5yZW5kZXJWYWx1ZXNcbiAgICB9O1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xuXG4gICAgY29uc3QgaHRtbCA9IGVqcy5yZW5kZXIodGhpcy5jb250ZW50VGVtcGxhdGUsIGRhdGEsIG9wdGlvbnMpO1xuXG4gICAgY29uc3QgdG9wZGYgPSBuZXcgSHRtbFRvUGRmKGh0bWwpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdG9wZGYucnVuKCk7XG5cbiAgICBsZXQgb3V0cHV0UGF0aCA9IG51bGw7XG5cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICBjb25zdCByZXBvcnROYW1lID0gc2FuaXRpemUodGhpcy5yZWNvcmQuZGlzcGxheVZhbHVlIHx8IHRoaXMucmVjb3JkLmlkKTtcblxuICAgICAgb3V0cHV0UGF0aCA9IHBhdGguam9pbihkaXJlY3RvcnksIHJlcG9ydE5hbWUgKyAnLnBkZicpO1xuXG4gICAgICBhd2FpdCBtb3ZlKHJlc3VsdC5maWxlLCBvdXRwdXRQYXRoKTtcbiAgICB9XG5cbiAgICBhd2FpdCB0b3BkZi5jbGVhbnVwKCk7XG5cbiAgICByZXR1cm4ge2ZpbGU6IG91dHB1dFBhdGgsIHNpemU6IHJlc3VsdC5zaXplfTtcbiAgfVxuXG4gIHJlbmRlclZhbHVlcyA9IChmZWF0dXJlLCByZW5kZXJGdW5jdGlvbikgPT4ge1xuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiBmZWF0dXJlLmZvcm1WYWx1ZXMuY29udGFpbmVyLmVsZW1lbnRzKSB7XG4gICAgICBjb25zdCBmb3JtVmFsdWUgPSBmZWF0dXJlLmZvcm1WYWx1ZXMuZ2V0KGVsZW1lbnQua2V5KTtcblxuICAgICAgaWYgKGZvcm1WYWx1ZSkge1xuICAgICAgICByZW5kZXJGdW5jdGlvbihlbGVtZW50LCBmb3JtVmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBnZW5lcmF0ZSh7cmVwb3J0TmFtZSwgdGVtcGxhdGUsIGhlYWRlciwgZm9vdGVyLCBjb3ZlciwgZGF0YSwgZGlyZWN0b3J5LCBlanNPcHRpb25zfSkge1xuICAgIGNvbnN0IGJvZHlDb250ZW50ID0gZWpzLnJlbmRlcih0ZW1wbGF0ZSwgZGF0YSwgZWpzT3B0aW9ucyk7XG4gICAgY29uc3QgaGVhZGVyQ29udGVudCA9IGhlYWRlciA/IGVqcy5yZW5kZXIoaGVhZGVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG4gICAgY29uc3QgZm9vdGVyQ29udGVudCA9IGZvb3RlciA/IGVqcy5yZW5kZXIoZm9vdGVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG4gICAgY29uc3QgY292ZXJDb250ZW50ID0gY292ZXIgPyBlanMucmVuZGVyKGNvdmVyLCBkYXRhLCBlanNPcHRpb25zKSA6IG51bGw7XG5cbiAgICBjb25zdCB0b3BkZiA9IG5ldyBIdG1sVG9QZGYoYm9keUNvbnRlbnQsIGhlYWRlckNvbnRlbnQsIGZvb3RlckNvbnRlbnQsIGNvdmVyQ29udGVudCk7XG5cbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0b3BkZi5ydW4oKTtcblxuICAgIGxldCBvdXRwdXRQYXRoID0gbnVsbDtcblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIG91dHB1dFBhdGggPSBwYXRoLmpvaW4oZGlyZWN0b3J5LCBzYW5pdGl6ZShyZXBvcnROYW1lKSArICcucGRmJyk7XG5cbiAgICAgIGF3YWl0IG1vdmUocmVzdWx0LmZpbGUsIG91dHB1dFBhdGgpO1xuICAgIH1cblxuICAgIGF3YWl0IHRvcGRmLmNsZWFudXAoKTtcblxuICAgIHJldHVybiB7ZmlsZTogb3V0cHV0UGF0aCwgc2l6ZTogcmVzdWx0LnNpemV9O1xuICB9XG59XG4iXX0=