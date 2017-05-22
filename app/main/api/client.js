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

  getVideoTrackURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${media.id}/track.json?token=${account.token}`);
  }

  getVideoTrack(account, media) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      const options = _this14.optionsForRequest(account, {
        url: _this14.urlForResource(`/api/v2/videos/${media.id}/track.json?token=${account.token}`)
      });

      return yield req(options);
    })();
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}?token=${account.token}`);
  }

  getAudioTrackURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}/track.json?token=${account.token}`);
  }

  getAudioTrack(account, media) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      const options = _this15.optionsForRequest(account, {
        url: _this15.urlForResource(`/api/v2/audio/${media.id}/track.json?token=${account.token}`)
      });

      return yield req(options);
    })();
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
    var _this16 = this;

    return _asyncToGenerator(function* () {
      const options = _this16.optionsForRequest(account, {
        url: _this16.urlForResource('/api/v2/records.json')
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
    var _this17 = this;

    return _asyncToGenerator(function* () {
      const options = _this17.optionsForRequest(account, {
        url: _this17.urlForResource('/api/v2/records/history.json')
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiYmFzZVVSTCIsIkNsaWVudCIsInVybEZvclJlc291cmNlIiwicmVzb3VyY2UiLCJvcHRpb25zRm9yUmVxdWVzdCIsImFjY291bnQiLCJyZXN1bHQiLCJleHRlbmQiLCJ0b2tlbiIsImF1dGhlbnRpY2F0ZSIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJtZXRob2QiLCJ1cmkiLCJhdXRoIiwidXNlcm5hbWUiLCJzZW5kSW1tZWRpYXRlbHkiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzcG9uc2UiLCJib2R5IiwiZ2V0U3luYyIsInVybCIsImdldFJvbGVzIiwiZ2V0TWVtYmVyc2hpcHMiLCJnZXRGb3JtcyIsImdldENob2ljZUxpc3RzIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwiZ2V0UHJvamVjdHMiLCJleCIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIiwiY29ubmVjdCIsImdldFBob3RvcyIsInNlcXVlbmNlIiwicGVyUGFnZSIsInFzIiwicGVyX3BhZ2UiLCJmdWxsIiwiZ2V0VmlkZW9zIiwiZ2V0QXVkaW8iLCJnZXRTaWduYXR1cmVzIiwiZ2V0Q2hhbmdlc2V0cyIsImNvdW50cyIsImdldFF1ZXJ5VVJMIiwic3FsIiwicSIsImZvcm1hdCIsImFycmF5cyIsImdldFBob3RvVVJMIiwibWVkaWEiLCJpZCIsImdldFZpZGVvVVJMIiwiZ2V0VmlkZW9UcmFja1VSTCIsImdldFZpZGVvVHJhY2siLCJnZXRBdWRpb1VSTCIsImdldEF1ZGlvVHJhY2tVUkwiLCJnZXRBdWRpb1RyYWNrIiwiZ2V0U2lnbmF0dXJlVVJMIiwiZG93bmxvYWQiLCJ0byIsInJxIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwib24iLCJnZXRSZWNvcmRzIiwiZm9ybSIsInBhZ2VTaXplIiwiZm9ybV9pZCIsImdldFJlY29yZHNIaXN0b3J5IiwiZXh0ZW50cyIsImNsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxhQUFhLG1CQUFRQyxTQUFSLG1CQUFuQjtBQUNBLE1BQU1DLE1BQU9DLE9BQUQsSUFBYUgsc0JBQVlJLFNBQVMsSUFBckIsSUFBOEJELE9BQTlCLEVBQXpCOztBQUVBLE1BQU1FLGlCQUFpQjtBQUNyQkMsV0FBUztBQUNQLGtCQUFjLGNBRFA7QUFFUCxjQUFVO0FBRkg7QUFEWSxDQUF2Qjs7QUFPQTtBQUNBLE1BQU1DLFVBQVUsNEJBQWhCO0FBQ0E7O0FBRUEsTUFBTUMsTUFBTixDQUFhO0FBQ1hDLGlCQUFlQyxRQUFmLEVBQXlCO0FBQ3ZCLFdBQU8sS0FBS0gsT0FBTCxHQUFlRyxRQUF0QjtBQUNEOztBQUVEQyxvQkFBa0JDLE9BQWxCLEVBQTJCVCxPQUEzQixFQUFvQztBQUNsQyxVQUFNVSxTQUFTLGlCQUFFQyxNQUFGLENBQVMsRUFBVCxFQUFhVCxjQUFiLEVBQTZCRixPQUE3QixDQUFmO0FBQ0FVLFdBQU9QLE9BQVAsQ0FBZSxZQUFmLElBQStCTSxRQUFRRyxLQUF2QztBQUNBLFdBQU9GLE1BQVA7QUFDRDs7QUFFS0csY0FBTixDQUFtQkMsUUFBbkIsRUFBNkJDLFFBQTdCLEVBQXVDO0FBQUE7O0FBQUE7QUFDckMsWUFBTWYsVUFBVTtBQUNkZ0IsZ0JBQVEsS0FETTtBQUVkQyxhQUFLLE1BQUtYLGNBQUwsQ0FBb0Isb0JBQXBCLENBRlM7QUFHZFksY0FBTTtBQUNKQyxvQkFBVUwsUUFETjtBQUVKQyxvQkFBVUEsUUFGTjtBQUdKSywyQkFBaUI7QUFIYixTQUhRO0FBUWRqQixpQkFBU0QsZUFBZUM7QUFSVixPQUFoQjs7QUFXQSxhQUFPLHVCQUFZLFVBQUNrQixPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsK0JBQVF0QixPQUFSLEVBQWlCLFVBQUN1QixH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QXZDLEVBQWlEaUMsUUFBakQsRUFBMkQ7QUFBQTs7QUFBQTtBQUN6RCxZQUFNekUsVUFBVSxRQUFLUSxpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUNrQixhQUFLLFFBQUtyQixjQUFMLENBQW9CLDhCQUFwQjtBQUR5QyxPQUFoQyxDQUFoQjs7QUFJQU4sY0FBUTBDLEVBQVIsR0FBYTtBQUNYZ0MsaUJBQVNGLEtBQUtmLEVBREg7QUFFWGQsa0JBQVU4QixRQUZDO0FBR1hHLGlCQUFTLENBSEU7QUFJWHBDLGtCQUFVQSxZQUFZO0FBSlgsT0FBYjs7QUFPQSxhQUFPLE1BQU16QyxJQUFJQyxPQUFKLENBQWI7QUFaeUQ7QUFhMUQ7QUFoUVU7O0FBbVFiLE1BQU02RSxTQUFTLElBQUl4RSxNQUFKLEVBQWY7O2tCQUVld0UsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5jb25zdCByZXFQcm9taXNlID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWVzdCk7XG5jb25zdCByZXEgPSAob3B0aW9ucykgPT4gcmVxUHJvbWlzZSh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgaGVhZGVyczoge1xuICAgICdVc2VyLUFnZW50JzogJ0Z1bGNydW0gU3luYycsXG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG59O1xuXG4vLyBjb25zdCBiYXNlVVJMID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCc7XG5jb25zdCBiYXNlVVJMID0gJ2h0dHBzOi8vYXBpLmZ1bGNydW1hcHAuY29tJztcbi8vIGNvbnN0IGJhc2VVUkwgPSAnaHR0cHM6Ly9lZGdlLmZ1bGNydW1hcHAuY29tJztcblxuY2xhc3MgQ2xpZW50IHtcbiAgdXJsRm9yUmVzb3VyY2UocmVzb3VyY2UpIHtcbiAgICByZXR1cm4gJycgKyBiYXNlVVJMICsgcmVzb3VyY2U7XG4gIH1cblxuICBvcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gXy5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXN1bHQuaGVhZGVyc1snWC1BcGlUb2tlbiddID0gYWNjb3VudC50b2tlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgYXN5bmMgYXV0aGVudGljYXRlKHVzZXJOYW1lLCBwYXNzd29yZCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJpOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3VzZXJzLmpzb24nKSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJOYW1lLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgIHNlbmRJbW1lZGlhdGVseTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcnM6IGRlZmF1bHRPcHRpb25zLmhlYWRlcnNcbiAgICB9O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlcXVlc3Qob3B0aW9ucywgKGVyciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0U3luYyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL19wcml2YXRlL3N5bmMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Um9sZXMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9yb2xlcy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRNZW1iZXJzaGlwcyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL21lbWJlcnNoaXBzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldEZvcm1zKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvZm9ybXMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hvaWNlTGlzdHMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9jaG9pY2VfbGlzdHMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2xhc3NpZmljYXRpb25TZXRzKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvY2xhc3NpZmljYXRpb25fc2V0cy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRQcm9qZWN0cyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3Byb2plY3RzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGNvbnNvbGUubG9nKGV4KTtcbiAgICAgIGNvbnNvbGUubG9nKGV4LmNvZGUgPT09ICdFVElNRURPVVQnKTtcbiAgICAgIGNvbnNvbGUubG9nKGV4LmNvbm5lY3QgPT09IHRydWUpO1xuICAgICAgdGhyb3cgZXg7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZ2V0UGhvdG9zKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3Bob3Rvcy5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRWaWRlb3MoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvdmlkZW9zLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldEF1ZGlvKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL2F1ZGlvLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFNpZ25hdHVyZXMoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvc2lnbmF0dXJlcy5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRDaGFuZ2VzZXRzKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL2NoYW5nZXNldHMuanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGNvdW50czogJzAnXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBnZXRRdWVyeVVSTChhY2NvdW50LCBzcWwpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvcXVlcnknKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHE6IHNxbCxcbiAgICAgIGZvcm1hdDogJ2pzb25zZXEnLFxuICAgICAgYXJyYXlzOiAxXG4gICAgfTtcblxuICAgIHJldHVybiBvcHRpb25zO1xuICB9XG5cbiAgZ2V0UGhvdG9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9waG90b3MvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVHJhY2tVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfS90cmFjay5qc29uP3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGFzeW5jIGdldFZpZGVvVHJhY2soYWNjb3VudCwgbWVkaWEpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvdmlkZW9zLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YClcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBnZXRBdWRpb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0QXVkaW9UcmFja1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBhc3luYyBnZXRBdWRpb1RyYWNrKGFjY291bnQsIG1lZGlhKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YClcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9zaWduYXR1cmVzLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZG93bmxvYWQodXJsLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3QodXJsKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XG4gICAgICBycS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVjb3JkcyhhY2NvdW50LCBmb3JtLCBzZXF1ZW5jZSwgcGFnZVNpemUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvcmVjb3Jkcy5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBmb3JtX2lkOiBmb3JtLmlkLFxuICAgICAgcGVyX3BhZ2U6IHBhZ2VTaXplLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDBcbiAgICB9O1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9yZWNvcmRzL2hpc3RvcnkuanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgZm9ybV9pZDogZm9ybS5pZCxcbiAgICAgIHBlcl9wYWdlOiBwYWdlU2l6ZSxcbiAgICAgIGV4dGVudHM6IDAsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG59XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19