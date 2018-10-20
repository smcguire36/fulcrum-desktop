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
  constructor(html, { header, footer, cover, marginTop, marginBottom, marginLeft, marginRight, pageSize, imageQuality, orientation, wkhtmltopdf }) {
    this.tempID = _uuid2.default.v4();
    this.debug = false;
    this.html = html;
    this.header = header;
    this.footer = footer;
    this.cover = cover;
    this.wkhtmltopdf = wkhtmltopdf;
    this.marginTop = marginTop || DEFAULT_MARGIN;
    this.marginBottom = marginBottom || DEFAULT_MARGIN;
    this.marginLeft = marginLeft || DEFAULT_MARGIN;
    this.marginRight = marginRight || DEFAULT_MARGIN;
    this.pageSize = pageSize || DEFAULT_PAGE_SIZE;
    this.imageQuality = imageQuality || DEFAULT_IMAGE_QUALITY;
    this.orientation = orientation || DEFAULT_ORIENTATION;
  }

  get binary() {
    return this.wkhtmltopdf || '/usr/local/bin/wkhtmltopdf';
  }

  get command() {
    const parts = ['--page-size', this.pageSize, '--margin-top', this.marginTop, '--margin-left', this.marginLeft, '--margin-bottom', this.marginBottom, '--margin-right', this.marginRight, '--image-quality', this.imageQuality, '--orientation', this.orientation, '--encoding', 'UTF-8', this.quietArgument, ...this.coverArgument, ...this.headerArgument, ...this.footerArgument, this.inputArgument, this.outputArgument];

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

      return ['cover', coverPath];
    }

    return [];
  }

  get headerArgument() {
    if (this.header) {
      const headerPath = this.tempFilePath('header');

      _fs2.default.writeFileSync(headerPath, this.header);

      return ['--header-html', headerPath];
    }

    return [];
  }

  get footerArgument() {
    if (this.footer) {
      const footerPath = this.tempFilePath('footer');

      _fs2.default.writeFileSync(footerPath, this.footer);

      return ['--footer-html', footerPath];
    }

    return [];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3JlcG9ydHMvaHRtbC10by1wZGYuanMiXSwibmFtZXMiOlsiREVGQVVMVF9NQVJHSU4iLCJERUZBVUxUX1BBR0VfU0laRSIsIkRFRkFVTFRfSU1BR0VfUVVBTElUWSIsIkRFRkFVTFRfT1JJRU5UQVRJT04iLCJIdG1sVG9QZGYiLCJjb25zdHJ1Y3RvciIsImh0bWwiLCJoZWFkZXIiLCJmb290ZXIiLCJjb3ZlciIsIm1hcmdpblRvcCIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbkxlZnQiLCJtYXJnaW5SaWdodCIsInBhZ2VTaXplIiwiaW1hZ2VRdWFsaXR5Iiwib3JpZW50YXRpb24iLCJ3a2h0bWx0b3BkZiIsInRlbXBJRCIsInY0IiwiZGVidWciLCJiaW5hcnkiLCJjb21tYW5kIiwicGFydHMiLCJxdWlldEFyZ3VtZW50IiwiY292ZXJBcmd1bWVudCIsImhlYWRlckFyZ3VtZW50IiwiZm9vdGVyQXJndW1lbnQiLCJpbnB1dEFyZ3VtZW50Iiwib3V0cHV0QXJndW1lbnQiLCJjb21wYWN0IiwidGVtcEZpbGVQYXRoIiwicGFydCIsImV4dCIsImpvaW4iLCJ0bXBkaXIiLCJjb3ZlclBhdGgiLCJ3cml0ZUZpbGVTeW5jIiwiaGVhZGVyUGF0aCIsImZvb3RlclBhdGgiLCJydW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImNtZCIsInByb2Nlc3MiLCJzdGRvdXQiLCJzdGRlcnIiLCJzdGRpbiIsInNldEVuY29kaW5nIiwiZW5kIiwib24iLCJkYXRhIiwicHVzaCIsInRvU3RyaW5nIiwiY29kZSIsInN0YXQiLCJlcnIiLCJzaXplIiwiZmlsZSIsImNsZWFudXAiLCJmaWxlcyIsImVhY2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxNQUFNQSxpQkFBaUIsUUFBdkI7QUFDQSxNQUFNQyxvQkFBb0IsUUFBMUI7QUFDQSxNQUFNQyx3QkFBd0IsSUFBOUI7QUFDQSxNQUFNQyxzQkFBc0IsVUFBNUI7O0FBRWUsTUFBTUMsU0FBTixDQUFnQjtBQUM3QkMsY0FBWUMsSUFBWixFQUFrQixFQUFDQyxNQUFELEVBQVNDLE1BQVQsRUFBaUJDLEtBQWpCLEVBQXdCQyxTQUF4QixFQUFtQ0MsWUFBbkMsRUFBaURDLFVBQWpELEVBQTZEQyxXQUE3RCxFQUEwRUMsUUFBMUUsRUFBb0ZDLFlBQXBGLEVBQWtHQyxXQUFsRyxFQUErR0MsV0FBL0csRUFBbEIsRUFBK0k7QUFDN0ksU0FBS0MsTUFBTCxHQUFjLGVBQUtDLEVBQUwsRUFBZDtBQUNBLFNBQUtDLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBS2QsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS1EsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxTQUFLUCxTQUFMLEdBQWlCQSxhQUFhVixjQUE5QjtBQUNBLFNBQUtXLFlBQUwsR0FBb0JBLGdCQUFnQlgsY0FBcEM7QUFDQSxTQUFLWSxVQUFMLEdBQWtCQSxjQUFjWixjQUFoQztBQUNBLFNBQUthLFdBQUwsR0FBbUJBLGVBQWViLGNBQWxDO0FBQ0EsU0FBS2MsUUFBTCxHQUFnQkEsWUFBWWIsaUJBQTVCO0FBQ0EsU0FBS2MsWUFBTCxHQUFvQkEsZ0JBQWdCYixxQkFBcEM7QUFDQSxTQUFLYyxXQUFMLEdBQW1CQSxlQUFlYixtQkFBbEM7QUFDRDs7QUFFRCxNQUFJa0IsTUFBSixHQUFhO0FBQ1gsV0FBTyxLQUFLSixXQUFMLElBQW9CLDRCQUEzQjtBQUNEOztBQUVELE1BQUlLLE9BQUosR0FBYztBQUNaLFVBQU1DLFFBQVEsQ0FDWixhQURZLEVBQ0csS0FBS1QsUUFEUixFQUVaLGNBRlksRUFFSSxLQUFLSixTQUZULEVBR1osZUFIWSxFQUdLLEtBQUtFLFVBSFYsRUFJWixpQkFKWSxFQUlPLEtBQUtELFlBSlosRUFLWixnQkFMWSxFQUtNLEtBQUtFLFdBTFgsRUFNWixpQkFOWSxFQU1PLEtBQUtFLFlBTlosRUFPWixlQVBZLEVBT0ssS0FBS0MsV0FQVixFQVFaLFlBUlksRUFRRSxPQVJGLEVBU1osS0FBS1EsYUFUTyxFQVVaLEdBQUcsS0FBS0MsYUFWSSxFQVdaLEdBQUcsS0FBS0MsY0FYSSxFQVlaLEdBQUcsS0FBS0MsY0FaSSxFQWFaLEtBQUtDLGFBYk8sRUFjWixLQUFLQyxjQWRPLENBQWQ7O0FBZ0JBLFdBQU8saUJBQUVDLE9BQUYsQ0FBVVAsS0FBVixDQUFQO0FBQ0Q7O0FBRURRLGVBQWFDLElBQWIsRUFBbUJDLE1BQU0sTUFBekIsRUFBaUM7QUFDL0IsV0FBTyxlQUFLQyxJQUFMLENBQVUsYUFBR0MsTUFBSCxFQUFWLEVBQXdCLEdBQUUsS0FBS2pCLE1BQU8sSUFBR2MsSUFBSyxJQUFHQyxHQUFJLEVBQXJELENBQVA7QUFDRDs7QUFFRCxNQUFJVCxhQUFKLEdBQW9CO0FBQ2xCLFdBQU8sU0FBUDtBQUNBO0FBQ0Q7O0FBRUQsTUFBSUksYUFBSixHQUFvQjtBQUNsQixXQUFPLEdBQVA7QUFDRDs7QUFFRCxNQUFJQyxjQUFKLEdBQXFCO0FBQ25CLFdBQU8sS0FBS0UsWUFBTCxDQUFrQixLQUFLYixNQUFMLEdBQWMsU0FBaEMsRUFBMkMsS0FBM0MsQ0FBUDtBQUNEOztBQUVELE1BQUlPLGFBQUosR0FBb0I7QUFDbEIsUUFBSSxLQUFLaEIsS0FBVCxFQUFnQjtBQUNkLFlBQU0yQixZQUFZLEtBQUtMLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBbEI7O0FBRUEsbUJBQUdNLGFBQUgsQ0FBaUJELFNBQWpCLEVBQTRCLEtBQUszQixLQUFqQzs7QUFFQSxhQUFPLENBQUUsT0FBRixFQUFXMkIsU0FBWCxDQUFQO0FBQ0Q7O0FBRUQsV0FBTyxFQUFQO0FBQ0Q7O0FBRUQsTUFBSVYsY0FBSixHQUFxQjtBQUNuQixRQUFJLEtBQUtuQixNQUFULEVBQWlCO0FBQ2YsWUFBTStCLGFBQWEsS0FBS1AsWUFBTCxDQUFrQixRQUFsQixDQUFuQjs7QUFFQSxtQkFBR00sYUFBSCxDQUFpQkMsVUFBakIsRUFBNkIsS0FBSy9CLE1BQWxDOztBQUVBLGFBQU8sQ0FBRSxlQUFGLEVBQW1CK0IsVUFBbkIsQ0FBUDtBQUNEOztBQUVELFdBQU8sRUFBUDtBQUNEOztBQUVELE1BQUlYLGNBQUosR0FBcUI7QUFDbkIsUUFBSSxLQUFLbkIsTUFBVCxFQUFpQjtBQUNmLFlBQU0rQixhQUFhLEtBQUtSLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBbkI7O0FBRUEsbUJBQUdNLGFBQUgsQ0FBaUJFLFVBQWpCLEVBQTZCLEtBQUsvQixNQUFsQzs7QUFFQSxhQUFPLENBQUUsZUFBRixFQUFtQitCLFVBQW5CLENBQVA7QUFDRDs7QUFFRCxXQUFPLEVBQVA7QUFDRDs7QUFFREMsUUFBTTtBQUNKLFdBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxZQUFNQyxNQUFNLEtBQUt0QixPQUFqQjs7QUFFQSxZQUFNdUIsVUFBVSwwQkFBTSxLQUFLeEIsTUFBWCxFQUFtQnVCLEdBQW5CLEVBQXdCLEVBQXhCLENBQWhCOztBQUVBLFlBQU1FLFNBQVMsRUFBZjtBQUNBLFlBQU1DLFNBQVMsRUFBZjs7QUFFQUYsY0FBUUcsS0FBUixDQUFjQyxXQUFkLENBQTBCLE1BQTFCO0FBQ0FKLGNBQVFHLEtBQVIsQ0FBY0UsR0FBZCxDQUFrQixLQUFLNUMsSUFBdkI7O0FBRUF1QyxjQUFRQyxNQUFSLENBQWVLLEVBQWYsQ0FBa0IsTUFBbEIsRUFBMkJDLElBQUQsSUFBVTtBQUNsQ04sZUFBT08sSUFBUCxDQUFZRCxLQUFLRSxRQUFMLEVBQVo7QUFDRCxPQUZEOztBQUlBVCxjQUFRRSxNQUFSLENBQWVJLEVBQWYsQ0FBa0IsTUFBbEIsRUFBMkJDLElBQUQsSUFBVTtBQUNsQ0wsZUFBT00sSUFBUCxDQUFZRCxLQUFLRSxRQUFMLEVBQVo7QUFDRCxPQUZEOztBQUlBVCxjQUFRTSxFQUFSLENBQVcsT0FBWCxFQUFxQkksSUFBRCxJQUFVO0FBQzVCLHFCQUFHQyxJQUFILENBQVEsS0FBSzNCLGNBQWIsRUFBNkIsQ0FBQzRCLEdBQUQsRUFBTUQsSUFBTixLQUFlO0FBQzFDLGNBQUlDLEdBQUosRUFBUztBQUNQLG1CQUFPZCxPQUFPYyxHQUFQLENBQVA7QUFDRDs7QUFFRCxpQkFBT2YsUUFBUSxFQUFDYSxNQUFNQSxJQUFQO0FBQ0NULG9CQUFRQSxNQURUO0FBRUNDLG9CQUFRQSxNQUZUO0FBR0NXLGtCQUFNRixLQUFLRSxJQUhaO0FBSUNDLGtCQUFNLEtBQUs5QixjQUpaLEVBQVIsQ0FBUDtBQUtELFNBVkQ7QUFXRCxPQVpEO0FBYUQsS0FoQ00sQ0FBUDtBQWlDRDs7QUFFRCtCLFlBQVU7QUFDUixVQUFNQyxRQUFRLENBQ1osS0FBSzlCLFlBQUwsQ0FBa0IsUUFBbEIsQ0FEWSxFQUVaLEtBQUtBLFlBQUwsQ0FBa0IsT0FBbEIsQ0FGWSxFQUdaLEtBQUtBLFlBQUwsQ0FBa0IsU0FBbEIsQ0FIWSxFQUlaLEtBQUtBLFlBQUwsQ0FBa0IsUUFBbEIsQ0FKWSxFQUtaLEtBQUtBLFlBQUwsQ0FBa0IsS0FBbEIsRUFBeUIsS0FBekIsQ0FMWSxFQU1aLEtBQUtBLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsS0FBNUIsQ0FOWSxDQUFkOztBQVNBLFdBQU8sSUFBSVUsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0QyxzQkFBTW1CLElBQU4sQ0FBV0QsS0FBWCxvQkFBMkJKLEdBQUQsSUFBUztBQUNqQyxZQUFJQSxHQUFKLEVBQVM7QUFDUCxpQkFBT2QsT0FBT2MsR0FBUCxDQUFQO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsaUJBQU9mLFNBQVA7QUFDRDtBQUNGLE9BTkQ7QUFPRCxLQVJNLENBQVA7QUFTRDtBQXRKNEI7a0JBQVZ0QyxTIiwiZmlsZSI6Imh0bWwtdG8tcGRmLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBvcyBmcm9tICdvcyc7XHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5pbXBvcnQgYXN5bmMgZnJvbSAnYXN5bmMnO1xyXG5pbXBvcnQgcmltcmFmIGZyb20gJ3JpbXJhZic7XHJcblxyXG5jb25zdCBERUZBVUxUX01BUkdJTiA9ICcwLjc1aW4nO1xyXG5jb25zdCBERUZBVUxUX1BBR0VfU0laRSA9ICdMZXR0ZXInO1xyXG5jb25zdCBERUZBVUxUX0lNQUdFX1FVQUxJVFkgPSAnODUnO1xyXG5jb25zdCBERUZBVUxUX09SSUVOVEFUSU9OID0gJ1BvcnRyYWl0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh0bWxUb1BkZiB7XHJcbiAgY29uc3RydWN0b3IoaHRtbCwge2hlYWRlciwgZm9vdGVyLCBjb3ZlciwgbWFyZ2luVG9wLCBtYXJnaW5Cb3R0b20sIG1hcmdpbkxlZnQsIG1hcmdpblJpZ2h0LCBwYWdlU2l6ZSwgaW1hZ2VRdWFsaXR5LCBvcmllbnRhdGlvbiwgd2todG1sdG9wZGZ9KSB7XHJcbiAgICB0aGlzLnRlbXBJRCA9IHV1aWQudjQoKTtcclxuICAgIHRoaXMuZGVidWcgPSBmYWxzZTtcclxuICAgIHRoaXMuaHRtbCA9IGh0bWw7XHJcbiAgICB0aGlzLmhlYWRlciA9IGhlYWRlcjtcclxuICAgIHRoaXMuZm9vdGVyID0gZm9vdGVyO1xyXG4gICAgdGhpcy5jb3ZlciA9IGNvdmVyO1xyXG4gICAgdGhpcy53a2h0bWx0b3BkZiA9IHdraHRtbHRvcGRmO1xyXG4gICAgdGhpcy5tYXJnaW5Ub3AgPSBtYXJnaW5Ub3AgfHwgREVGQVVMVF9NQVJHSU47XHJcbiAgICB0aGlzLm1hcmdpbkJvdHRvbSA9IG1hcmdpbkJvdHRvbSB8fCBERUZBVUxUX01BUkdJTjtcclxuICAgIHRoaXMubWFyZ2luTGVmdCA9IG1hcmdpbkxlZnQgfHwgREVGQVVMVF9NQVJHSU47XHJcbiAgICB0aGlzLm1hcmdpblJpZ2h0ID0gbWFyZ2luUmlnaHQgfHwgREVGQVVMVF9NQVJHSU47XHJcbiAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemUgfHwgREVGQVVMVF9QQUdFX1NJWkU7XHJcbiAgICB0aGlzLmltYWdlUXVhbGl0eSA9IGltYWdlUXVhbGl0eSB8fCBERUZBVUxUX0lNQUdFX1FVQUxJVFk7XHJcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb24gfHwgREVGQVVMVF9PUklFTlRBVElPTjtcclxuICB9XHJcblxyXG4gIGdldCBiaW5hcnkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy53a2h0bWx0b3BkZiB8fCAnL3Vzci9sb2NhbC9iaW4vd2todG1sdG9wZGYnO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvbW1hbmQoKSB7XHJcbiAgICBjb25zdCBwYXJ0cyA9IFtcclxuICAgICAgJy0tcGFnZS1zaXplJywgdGhpcy5wYWdlU2l6ZSxcclxuICAgICAgJy0tbWFyZ2luLXRvcCcsIHRoaXMubWFyZ2luVG9wLFxyXG4gICAgICAnLS1tYXJnaW4tbGVmdCcsIHRoaXMubWFyZ2luTGVmdCxcclxuICAgICAgJy0tbWFyZ2luLWJvdHRvbScsIHRoaXMubWFyZ2luQm90dG9tLFxyXG4gICAgICAnLS1tYXJnaW4tcmlnaHQnLCB0aGlzLm1hcmdpblJpZ2h0LFxyXG4gICAgICAnLS1pbWFnZS1xdWFsaXR5JywgdGhpcy5pbWFnZVF1YWxpdHksXHJcbiAgICAgICctLW9yaWVudGF0aW9uJywgdGhpcy5vcmllbnRhdGlvbixcclxuICAgICAgJy0tZW5jb2RpbmcnLCAnVVRGLTgnLFxyXG4gICAgICB0aGlzLnF1aWV0QXJndW1lbnQsXHJcbiAgICAgIC4uLnRoaXMuY292ZXJBcmd1bWVudCxcclxuICAgICAgLi4udGhpcy5oZWFkZXJBcmd1bWVudCxcclxuICAgICAgLi4udGhpcy5mb290ZXJBcmd1bWVudCxcclxuICAgICAgdGhpcy5pbnB1dEFyZ3VtZW50LFxyXG4gICAgICB0aGlzLm91dHB1dEFyZ3VtZW50IF07XHJcblxyXG4gICAgcmV0dXJuIF8uY29tcGFjdChwYXJ0cyk7XHJcbiAgfVxyXG5cclxuICB0ZW1wRmlsZVBhdGgocGFydCwgZXh0ID0gJ2h0bWwnKSB7XHJcbiAgICByZXR1cm4gcGF0aC5qb2luKG9zLnRtcGRpcigpLCBgJHt0aGlzLnRlbXBJRH1fJHtwYXJ0fS4ke2V4dH1gKTtcclxuICB9XHJcblxyXG4gIGdldCBxdWlldEFyZ3VtZW50KCkge1xyXG4gICAgcmV0dXJuICctLXF1aWV0JztcclxuICAgIC8vIHJldHVybiB0aGlzLmRlYnVnID8gbnVsbCA6ICctLXF1aWV0JztcclxuICB9XHJcblxyXG4gIGdldCBpbnB1dEFyZ3VtZW50KCkge1xyXG4gICAgcmV0dXJuICctJztcclxuICB9XHJcblxyXG4gIGdldCBvdXRwdXRBcmd1bWVudCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRlbXBGaWxlUGF0aCh0aGlzLnRlbXBJRCArICdfb3V0cHV0JywgJ3BkZicpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGNvdmVyQXJndW1lbnQoKSB7XHJcbiAgICBpZiAodGhpcy5jb3Zlcikge1xyXG4gICAgICBjb25zdCBjb3ZlclBhdGggPSB0aGlzLnRlbXBGaWxlUGF0aCgnY292ZXInKTtcclxuXHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoY292ZXJQYXRoLCB0aGlzLmNvdmVyKTtcclxuXHJcbiAgICAgIHJldHVybiBbICdjb3ZlcicsIGNvdmVyUGF0aCBdO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcblxyXG4gIGdldCBoZWFkZXJBcmd1bWVudCgpIHtcclxuICAgIGlmICh0aGlzLmhlYWRlcikge1xyXG4gICAgICBjb25zdCBoZWFkZXJQYXRoID0gdGhpcy50ZW1wRmlsZVBhdGgoJ2hlYWRlcicpO1xyXG5cclxuICAgICAgZnMud3JpdGVGaWxlU3luYyhoZWFkZXJQYXRoLCB0aGlzLmhlYWRlcik7XHJcblxyXG4gICAgICByZXR1cm4gWyAnLS1oZWFkZXItaHRtbCcsIGhlYWRlclBhdGggXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG5cclxuICBnZXQgZm9vdGVyQXJndW1lbnQoKSB7XHJcbiAgICBpZiAodGhpcy5mb290ZXIpIHtcclxuICAgICAgY29uc3QgZm9vdGVyUGF0aCA9IHRoaXMudGVtcEZpbGVQYXRoKCdmb290ZXInKTtcclxuXHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMoZm9vdGVyUGF0aCwgdGhpcy5mb290ZXIpO1xyXG5cclxuICAgICAgcmV0dXJuIFsgJy0tZm9vdGVyLWh0bWwnLCBmb290ZXJQYXRoIF07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxuXHJcbiAgcnVuKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgY21kID0gdGhpcy5jb21tYW5kO1xyXG5cclxuICAgICAgY29uc3QgcHJvY2VzcyA9IHNwYXduKHRoaXMuYmluYXJ5LCBjbWQsIHt9KTtcclxuXHJcbiAgICAgIGNvbnN0IHN0ZG91dCA9IFtdO1xyXG4gICAgICBjb25zdCBzdGRlcnIgPSBbXTtcclxuXHJcbiAgICAgIHByb2Nlc3Muc3RkaW4uc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcclxuICAgICAgcHJvY2Vzcy5zdGRpbi5lbmQodGhpcy5odG1sKTtcclxuXHJcbiAgICAgIHByb2Nlc3Muc3Rkb3V0Lm9uKCdkYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgICBzdGRvdXQucHVzaChkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+IHtcclxuICAgICAgICBzdGRlcnIucHVzaChkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHByb2Nlc3Mub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcclxuICAgICAgICBmcy5zdGF0KHRoaXMub3V0cHV0QXJndW1lbnQsIChlcnIsIHN0YXQpID0+IHtcclxuICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHJldHVybiByZXNvbHZlKHtjb2RlOiBjb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZG91dDogc3Rkb3V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZGVycjogc3RkZXJyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU6IHN0YXQuc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBmaWxlOiB0aGlzLm91dHB1dEFyZ3VtZW50fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbGVhbnVwKCkge1xyXG4gICAgY29uc3QgZmlsZXMgPSBbXHJcbiAgICAgIHRoaXMudGVtcEZpbGVQYXRoKCdoZWFkZXInKSxcclxuICAgICAgdGhpcy50ZW1wRmlsZVBhdGgoJ2NvdmVyJyksXHJcbiAgICAgIHRoaXMudGVtcEZpbGVQYXRoKCdjb250ZW50JyksXHJcbiAgICAgIHRoaXMudGVtcEZpbGVQYXRoKCdmb290ZXInKSxcclxuICAgICAgdGhpcy50ZW1wRmlsZVBhdGgoJ3RvYycsICd4bWwnKSxcclxuICAgICAgdGhpcy50ZW1wRmlsZVBhdGgoJ291dHB1dCcsICdwZGYnKVxyXG4gICAgXTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBhc3luYy5lYWNoKGZpbGVzLCByaW1yYWYsIChlcnIpID0+IHtcclxuICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=