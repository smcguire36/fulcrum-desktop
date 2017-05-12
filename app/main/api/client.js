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
const baseURL = 'https://api.fulcrumapp.com';
// const baseURL = 'https://edge.fulcrumapp.com';

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

  getRoles(account) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const options = _this3.optionsForRequest(account, {
        url: _this3.urlForResource('/api/v2/roles.json')
      });

      return yield req(options);
    })();
  }

  getMemberships(account) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const options = _this4.optionsForRequest(account, {
        url: _this4.urlForResource('/api/v2/memberships.json')
      });

      return yield req(options);
    })();
  }

  getForms(account) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const options = _this5.optionsForRequest(account, {
        url: _this5.urlForResource('/api/v2/forms.json')
      });

      return yield req(options);
    })();
  }

  getChoiceLists(account) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const options = _this6.optionsForRequest(account, {
        url: _this6.urlForResource('/api/v2/choice_lists.json')
      });

      return yield req(options);
    })();
  }

  getClassificationSets(account) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const options = _this7.optionsForRequest(account, {
        url: _this7.urlForResource('/api/v2/classification_sets.json')
      });

      return yield req(options);
    })();
  }

  getProjects(account) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const options = _this8.optionsForRequest(account, {
        url: _this8.urlForResource('/api/v2/projects.json')
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

  getPhotos(account, sequence, perPage) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      const options = _this9.optionsForRequest(account, {
        url: _this9.urlForResource('/api/v2/photos.json')
      });

      options.qs = {
        per_page: perPage,
        sequence: sequence || 0,
        full: '1'
      };

      return yield req(options);
    })();
  }

  getVideos(account, sequence, perPage) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const options = _this10.optionsForRequest(account, {
        url: _this10.urlForResource('/api/v2/videos.json')
      });

      options.qs = {
        per_page: perPage,
        sequence: sequence || 0,
        full: '1'
      };

      return yield req(options);
    })();
  }

  getAudio(account, sequence, perPage) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      const options = _this11.optionsForRequest(account, {
        url: _this11.urlForResource('/api/v2/audio.json')
      });

      options.qs = {
        per_page: perPage,
        sequence: sequence || 0,
        full: '1'
      };

      return yield req(options);
    })();
  }

  getSignatures(account, sequence, perPage) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      const options = _this12.optionsForRequest(account, {
        url: _this12.urlForResource('/api/v2/signatures.json')
      });

      options.qs = {
        per_page: perPage,
        sequence: sequence || 0,
        full: '1'
      };

      return yield req(options);
    })();
  }

  getChangesets(account, sequence, perPage) {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      const options = _this13.optionsForRequest(account, {
        url: _this13.urlForResource('/api/v2/changesets.json')
      });

      options.qs = {
        per_page: perPage,
        sequence: sequence || 0,
        counts: '0'
      };

      return yield req(options);
    })();
  }

  getQueryURL(account, sql) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/query')
    });

    options.qs = {
      q: sql,
      format: 'jsonseq',
      arrays: 1
    };

    return options;
  }

  getPhotoURL(account, media) {
    return this.urlForResource(`/api/v2/photos/${media.id}?token=${account.token}`);
  }

  getVideoURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${media.id}?token=${account.token}`);
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}?token=${account.token}`);
  }

  getSignatureURL(account, media) {
    return this.urlForResource(`/api/v2/signatures/${media.id}?token=${account.token}`);
  }

  download(url, to) {
    return new _bluebird2.default((resolve, reject) => {
      const rq = (0, _request2.default)(url).pipe(_fs2.default.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }

  getRecords(account, form, sequence, pageSize) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      const options = _this14.optionsForRequest(account, {
        url: _this14.urlForResource('/api/v2/records.json')
      });

      options.qs = {
        form_id: form.id,
        per_page: pageSize,
        sequence: sequence || 0
      };

      return yield req(options);
    })();
  }

  getRecordsHistory(account, form, sequence, pageSize) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      const options = _this15.optionsForRequest(account, {
        url: _this15.urlForResource('/api/v2/records/history.json')
      });

      options.qs = {
        form_id: form.id,
        per_page: pageSize,
        extents: 0,
        sequence: sequence || 0
      };

      return yield req(options);
    })();
  }
}

const client = new Client();

exports.default = client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiYmFzZVVSTCIsIkNsaWVudCIsInVybEZvclJlc291cmNlIiwicmVzb3VyY2UiLCJvcHRpb25zRm9yUmVxdWVzdCIsImFjY291bnQiLCJyZXN1bHQiLCJleHRlbmQiLCJ0b2tlbiIsImF1dGhlbnRpY2F0ZSIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJtZXRob2QiLCJ1cmkiLCJhdXRoIiwidXNlcm5hbWUiLCJzZW5kSW1tZWRpYXRlbHkiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzcG9uc2UiLCJib2R5IiwiZ2V0U3luYyIsInVybCIsImdldFJvbGVzIiwiZ2V0TWVtYmVyc2hpcHMiLCJnZXRGb3JtcyIsImdldENob2ljZUxpc3RzIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwiZ2V0UHJvamVjdHMiLCJleCIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIiwiY29ubmVjdCIsImdldFBob3RvcyIsInNlcXVlbmNlIiwicGVyUGFnZSIsInFzIiwicGVyX3BhZ2UiLCJmdWxsIiwiZ2V0VmlkZW9zIiwiZ2V0QXVkaW8iLCJnZXRTaWduYXR1cmVzIiwiZ2V0Q2hhbmdlc2V0cyIsImNvdW50cyIsImdldFF1ZXJ5VVJMIiwic3FsIiwicSIsImZvcm1hdCIsImFycmF5cyIsImdldFBob3RvVVJMIiwibWVkaWEiLCJpZCIsImdldFZpZGVvVVJMIiwiZ2V0QXVkaW9VUkwiLCJnZXRTaWduYXR1cmVVUkwiLCJkb3dubG9hZCIsInRvIiwicnEiLCJwaXBlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbiIsImdldFJlY29yZHMiLCJmb3JtIiwicGFnZVNpemUiLCJmb3JtX2lkIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJleHRlbnRzIiwiY2xpZW50Il0sIm1h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SUFBSUMsT0FBSixDQUFiO0FBWGtEO0FBWW5EOztBQUVLdUUsbUJBQU4sQ0FBd0I5RCxPQUF4QixFQUFpQzJELElBQWpDLEVBQXVDNUIsUUFBdkMsRUFBaUQ2QixRQUFqRCxFQUEyRDtBQUFBOztBQUFBO0FBQ3pELFlBQU1yRSxVQUFVLFFBQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssUUFBS3JCLGNBQUwsQ0FBb0IsOEJBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBTixjQUFRMEMsRUFBUixHQUFhO0FBQ1g0QixpQkFBU0YsS0FBS1gsRUFESDtBQUVYZCxrQkFBVTBCLFFBRkM7QUFHWEcsaUJBQVMsQ0FIRTtBQUlYaEMsa0JBQVVBLFlBQVk7QUFKWCxPQUFiOztBQU9BLGFBQU8sTUFBTXpDLElBQUlDLE9BQUosQ0FBYjtBQVp5RDtBQWExRDtBQXhPVTs7QUEyT2IsTUFBTXlFLFNBQVMsSUFBSXBFLE1BQUosRUFBZjs7a0JBRWVvRSxNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmNvbnN0IHJlcVByb21pc2UgPSBQcm9taXNlLnByb21pc2lmeShyZXF1ZXN0KTtcbmNvbnN0IHJlcSA9IChvcHRpb25zKSA9PiByZXFQcm9taXNlKHtmb3JldmVyOiB0cnVlLCAuLi5vcHRpb25zfSk7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBoZWFkZXJzOiB7XG4gICAgJ1VzZXItQWdlbnQnOiAnRnVsY3J1bSBTeW5jJyxcbiAgICAnQWNjZXB0JzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gIH1cbn07XG5cbi8vIGNvbnN0IGJhc2VVUkwgPSAnaHR0cDovL2xvY2FsaG9zdDozMDAwJztcbmNvbnN0IGJhc2VVUkwgPSAnaHR0cHM6Ly9hcGkuZnVsY3J1bWFwcC5jb20nO1xuLy8gY29uc3QgYmFzZVVSTCA9ICdodHRwczovL2VkZ2UuZnVsY3J1bWFwcC5jb20nO1xuXG5jbGFzcyBDbGllbnQge1xuICB1cmxGb3JSZXNvdXJjZShyZXNvdXJjZSkge1xuICAgIHJldHVybiAnJyArIGJhc2VVUkwgKyByZXNvdXJjZTtcbiAgfVxuXG4gIG9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHJlc3VsdC5oZWFkZXJzWydYLUFwaVRva2VuJ10gPSBhY2NvdW50LnRva2VuO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhc3luYyBhdXRoZW50aWNhdGUodXNlck5hbWUsIHBhc3N3b3JkKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmk6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvdXNlcnMuanNvbicpLFxuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgc2VuZEltbWVkaWF0ZWx5OiB0cnVlXG4gICAgICB9LFxuICAgICAgaGVhZGVyczogZGVmYXVsdE9wdGlvbnMuaGVhZGVyc1xuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVxdWVzdChvcHRpb25zLCAoZXJyLCByZXNwb25zZSwgYm9keSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRTeW5jKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvX3ByaXZhdGUvc3luYy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRSb2xlcyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3JvbGVzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldE1lbWJlcnNoaXBzKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvbWVtYmVyc2hpcHMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Rm9ybXMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9mb3Jtcy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRDaG9pY2VMaXN0cyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL2Nob2ljZV9saXN0cy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRDbGFzc2lmaWNhdGlvblNldHMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9jbGFzc2lmaWNhdGlvbl9zZXRzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFByb2plY3RzKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvcHJvamVjdHMuanNvbicpXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgY29uc29sZS5sb2coZXgpO1xuICAgICAgY29uc29sZS5sb2coZXguY29kZSA9PT0gJ0VUSU1FRE9VVCcpO1xuICAgICAgY29uc29sZS5sb2coZXguY29ubmVjdCA9PT0gdHJ1ZSk7XG4gICAgICB0aHJvdyBleDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBnZXRQaG90b3MoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvcGhvdG9zLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFZpZGVvcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi92aWRlb3MuanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0QXVkaW8oYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvYXVkaW8uanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0U2lnbmF0dXJlcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9zaWduYXR1cmVzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldENoYW5nZXNldHMoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvY2hhbmdlc2V0cy5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgY291bnRzOiAnMCdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGdldFF1ZXJ5VVJMKGFjY291bnQsIHNxbCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9xdWVyeScpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcTogc3FsLFxuICAgICAgZm9ybWF0OiAnanNvbnNlcScsXG4gICAgICBhcnJheXM6IDFcbiAgICB9O1xuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cblxuICBnZXRQaG90b1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3Bob3Rvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvdmlkZW9zLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0QXVkaW9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9hdWRpby8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFNpZ25hdHVyZVVSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3NpZ25hdHVyZXMvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBkb3dubG9hZCh1cmwsIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJxID0gcmVxdWVzdCh1cmwpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odG8pKTtcbiAgICAgIHJxLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocnEpKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZWNvcmRzKGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9yZWNvcmRzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIGZvcm1faWQ6IGZvcm0uaWQsXG4gICAgICBwZXJfcGFnZTogcGFnZVNpemUsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVjb3Jkc0hpc3RvcnkoYWNjb3VudCwgZm9ybSwgc2VxdWVuY2UsIHBhZ2VTaXplKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3JlY29yZHMvaGlzdG9yeS5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBmb3JtX2lkOiBmb3JtLmlkLFxuICAgICAgcGVyX3BhZ2U6IHBhZ2VTaXplLFxuICAgICAgZXh0ZW50czogMCxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cbn1cblxuY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=