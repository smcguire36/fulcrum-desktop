'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const reqPromise = _bluebird2.default.promisify(_request2.default);
const req = options => reqPromise(_extends({ forever: true }, options));

const defaultOptions = {
  headers: {
    'User-Agent': 'Fulcrum Sync',
    'Accept': 'application/json'
  }
};

// const baseURL = 'http://localhost:3000';
// const baseURL = 'https://api.fulcrumapp.com/api/v2/';
const baseURL = 'https://edge.fulcrumapp.com';

class Client {
  urlForResource(resource) {
    return '' + baseURL + resource;
  }

  optionsForRequest(account, options) {
    const result = _lodash2.default.extend({}, defaultOptions, options);
    result.headers['X-ApiToken'] = account.token;
    return result;
  }

  authenticate(userName, password) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const options = {
        method: 'GET',
        uri: _this.urlForResource('/api/v2/users.json'),
        auth: {
          username: userName,
          password: password,
          sendImmediately: true
        },
        headers: defaultOptions.headers
      };

      return new _bluebird2.default(function (resolve, reject) {
        (0, _request2.default)(options, function (err, response, body) {
          if (err) {
            return reject(err);
          } else {
            return resolve(response);
          }
        });
      });
    })();
  }

  getSync(account) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const options = _this2.optionsForRequest(account, {
        url: _this2.urlForResource('/api/_private/sync.json')
      });

      return yield req(options);
    })();
  }

  getForms(account) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const options = _this3.optionsForRequest(account, {
        url: _this3.urlForResource('/api/v2/forms.json')
      });

      return yield req(options);
    })();
  }

  getChoiceLists(account) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const options = _this4.optionsForRequest(account, {
        url: _this4.urlForResource('/api/v2/choice_lists.json')
      });

      return yield req(options);
    })();
  }

  getClassificationSets(account) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const options = _this5.optionsForRequest(account, {
        url: _this5.urlForResource('/api/v2/classification_sets.json')
      });

      return yield req(options);
    })();
  }

  getProjects(account) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const options = _this6.optionsForRequest(account, {
        url: _this6.urlForResource('/api/v2/projects.json')
      });

      try {
        return yield req(options);
      } catch (ex) {
        console.log(ex);
        console.log(ex.code === 'ETIMEDOUT');
        console.log(ex.connect === true);
        throw ex;
      }
    })();
  }

  getPhotos(account, form, page) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const options = _this7.optionsForRequest(account, {
        url: _this7.urlForResource('/api/v2/photos.json')
      });

      options.qs = {
        per_page: 1000,
        page: page,
        full: '1'
      };

      if (form) {
        options.qs.form_id = form.id;
      }

      return yield req(options);
    })();
  }

  getVideos(account, form, page) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const options = _this8.optionsForRequest(account, {
        url: _this8.urlForResource('/api/v2/videos.json')
      });

      options.qs = {
        per_page: 1000,
        page: page,
        full: '1'
      };

      if (form) {
        options.qs.form_id = form.id;
      }

      return yield req(options);
    })();
  }

  download(url, to) {
    return new _bluebird2.default((resolve, reject) => {
      const rq = (0, _request2.default)(url).pipe(_fs2.default.createWriteStream(to));
      rq.on('close', resolve);
      rq.on('error', reject);
    });
  }

  getRecords(account, form, page) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      const options = _this9.optionsForRequest(account, {
        // url: this.urlForResource('records/history')
        url: _this9.urlForResource('/api/v2/records.json')
      });

      options.qs = {
        form_id: form.id,
        per_page: 1000,
        page: page
      };

      return yield req(options);
    })();
  }

  getRecordsHistory(account, form, page, lastSync) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const options = _this10.optionsForRequest(account, {
        url: _this10.urlForResource('/api/v2/records/history.json')
      });

      options.qs = {
        form_id: form.id,
        per_page: 1000,
        page: page,
        updated_since: lastSync ? lastSync.getTime() / 1000 : 0
      };

      return yield req(options);
    })();
  }
}

const client = new Client();

exports.default = client;
//# sourceMappingURL=client.js.map