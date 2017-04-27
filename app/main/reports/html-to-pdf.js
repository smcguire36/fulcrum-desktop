'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_MARGIN = '0.75in';
const DEFAULT_PAGE_SIZE = 'Letter';
const DEFAULT_IMAGE_QUALITY = '85';
const DEFAULT_ORIENTATION = 'Portrait';

class HtmlToPdf {
  constructor(html, header, footer, cover) {
    this.tempID = _uuid2.default.v4();
    this.debug = false;
    this.html = html;
    this.header = header;
    this.footer = footer;
    this.cover = cover;
    this.marginTop = DEFAULT_MARGIN;
    this.marginBottom = DEFAULT_MARGIN;
    this.marginLeft = DEFAULT_MARGIN;
    this.marginRight = DEFAULT_MARGIN;
    this.pageSize = DEFAULT_PAGE_SIZE;
    this.imageQuality = DEFAULT_IMAGE_QUALITY;
    this.orientation = DEFAULT_ORIENTATION;
  }

  get binary() {
    return '/usr/local/bin/wkhtmltopdf';
  }

  get command() {
    const parts = ['--page-size', this.pageSize, '--margin-top', this.marginTop, '--margin-left', this.marginLeft, '--margin-bottom', this.marginBottom, '--margin-right', this.marginRight, '--image-quality', this.imageQuality, '--orientation', this.orientation, '--encoding', 'UTF-8', this.quietArgument, this.coverArgument, this.headerArgument, this.footerArgument, this.inputArgument, this.headerArgument, this.footerArgument, this.outputArgument];

    return _lodash2.default.compact(parts);
  }

  tempFilePath(part, ext = 'html') {
    return _path2.default.join(_os2.default.tmpdir(), `${this.tempID}_${part}.${ext}`);
  }

  get quietArgument() {
    return '--quiet';
    // return this.debug ? null : '--quiet';
  }

  get inputArgument() {
    return '-';
  }

  get outputArgument() {
    return this.tempFilePath(this.tempID + '_output', 'pdf');
  }

  get coverArgument() {
    if (this.cover) {
      const coverPath = this.tempFilePath('cover');

      _fs2.default.writeFileSync(coverPath, this.cover);

      return `cover "${coverPath}"`;
    }

    return null;
  }

  get headerArgument() {
    if (this.header) {
      const headerPath = this.tempFilePath('header');

      _fs2.default.writeFileSync(headerPath, this.header);

      return `--header-html "${headerPath}"`;
    }

    return null;
  }

  get footerArgument() {
    if (this.footer) {
      const footerPath = this.tempFilePath('footer');

      _fs2.default.writeFileSync(footerPath, this.footer);

      return `--footer-html "${footerPath}"`;
    }

    return null;
  }

  run() {
    return new Promise((resolve, reject) => {
      const cmd = this.command;

      const process = (0, _child_process.spawn)(this.binary, cmd, {});

      const stdout = [];
      const stderr = [];

      process.stdin.setEncoding('utf8');
      process.stdin.end(this.html);

      process.stdout.on('data', data => {
        stdout.push(data.toString());
      });

      process.stderr.on('data', data => {
        stderr.push(data.toString());
      });

      process.on('close', code => {
        _fs2.default.stat(this.outputArgument, (err, stat) => {
          if (err) {
            return reject(err);
          }

          return resolve({ code: code,
            stdout: stdout,
            stderr: stderr,
            size: stat.size,
            file: this.outputArgument });
        });
      });
    });
  }

  cleanup() {
    const files = [this.tempFilePath('header'), this.tempFilePath('cover'), this.tempFilePath('content'), this.tempFilePath('footer'), this.tempFilePath('toc', 'xml'), this.tempFilePath('output', 'pdf')];

    return new Promise((resolve, reject) => {
      _async2.default.each(files, _rimraf2.default, err => {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
}
exports.default = HtmlToPdf;
//# sourceMappingURL=html-to-pdf.js.map