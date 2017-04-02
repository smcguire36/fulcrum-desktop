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

class Generator {
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

}
exports.default = Generator;
//# sourceMappingURL=generator.js.map