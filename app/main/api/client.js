'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const reqPromise = _bluebird2.default.promisify(_request2.default);
const req = options => reqPromise(_extends({ forever: true }, options));

const defaultOptions = {
  headers: {
    'User-Agent': 'Fulcrum Sync',
    'Accept': 'application/json'
  }
};

const BASE_URL = 'https://api.fulcrumapp.com';

class Client {
  urlForResource(resource) {
    return BASE_URL + resource;
  }

  rawRequest(options) {
    return (0, _request2.default)(_extends({ forever: true }, options));
  }

  request(options) {
    return req(options);
  }

  optionsForAuthenticatedRequest(token, options) {
    const result = (0, _lodash.extend)({}, defaultOptions, options);

    if (token) {
      result.headers['X-ApiToken'] = token;
    }

    return result;
  }

  authenticate(userName, password) {
    const options = {
      method: 'GET',
      uri: this.urlForResource('/api/v2/users.json'),
      auth: {
        username: userName,
        password: password,
        sendImmediately: true
      },
      headers: defaultOptions.headers
    };

    return this.request(options);
  }

  authenticateWithToken(token) {
    return this.request(this.getRequestOptions(token, '/api/v2/users.json'));
  }

  getRequestOptions(token, path, opts) {
    return this.optionsForAuthenticatedRequest(token, _extends({
      url: this.urlForResource(path)
    }, opts));
  }

  getResource(account, path, opts = {}) {
    return this.request(this.getRequestOptions(account.token, path, opts));
  }

  getSync(account) {
    return this.getResource(account, '/api/_private/sync.json');
  }

  getRoles(account) {
    return this.getResource(account, '/api/v2/roles.json');
  }

  getMemberships(account) {
    return this.getResource(account, '/api/v2/memberships.json');
  }

  getForms(account) {
    return this.getResource(account, '/api/v2/forms.json');
  }

  getChoiceLists(account) {
    return this.getResource(account, '/api/v2/choice_lists.json');
  }

  getClassificationSets(account) {
    return this.getResource(account, '/api/v2/classification_sets.json');
  }

  getProjects(account) {
    return this.getResource(account, '/api/v2/projects.json');
  }

  getPhotos(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/photos.json', { qs });
  }

  getVideos(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/videos.json', { qs });
  }

  getAudio(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/audio.json', { qs });
  }

  getSignatures(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return this.getResource(account, '/api/v2/signatures.json', { qs });
  }

  getChangesets(account, sequence, perPage) {
    const qs = {
      per_page: perPage,
      sequence: sequence || 0,
      counts: '0'
    };

    return this.getResource(account, '/api/v2/changesets.json', { qs });
  }

  getQueryURL(account, sql) {
    const qs = {
      q: sql,
      format: 'jsonseq',
      arrays: 1
    };

    return this.getRequestOptions(account.token, '/api/v2/query', { qs });
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
    return this.getResource(account, `/api/v2/videos/${media.id}/track.json`);
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}?token=${account.token}`);
  }

  getAudioTrackURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${media.id}/track.json?token=${account.token}`);
  }

  getAudioTrack(account, media) {
    return this.getResource(account, `/api/v2/audio/${media.id}/track.json`);
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
    const qs = {
      form_id: form.id,
      per_page: pageSize,
      sequence: sequence || 0
    };

    return this.getResource(account, '/api/v2/records.json', { qs });
  }

  getRecordsHistory(account, form, sequence, pageSize) {
    const qs = {
      form_id: form.id,
      per_page: pageSize,
      extents: 0,
      sequence: sequence || 0
    };

    return this.getResource(account, '/api/v2/records/history.json', { qs });
  }
}

const client = new Client();

exports.default = client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiQkFTRV9VUkwiLCJDbGllbnQiLCJ1cmxGb3JSZXNvdXJjZSIsInJlc291cmNlIiwicmF3UmVxdWVzdCIsInJlcXVlc3QiLCJvcHRpb25zRm9yQXV0aGVudGljYXRlZFJlcXVlc3QiLCJ0b2tlbiIsInJlc3VsdCIsImF1dGhlbnRpY2F0ZSIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJtZXRob2QiLCJ1cmkiLCJhdXRoIiwidXNlcm5hbWUiLCJzZW5kSW1tZWRpYXRlbHkiLCJhdXRoZW50aWNhdGVXaXRoVG9rZW4iLCJnZXRSZXF1ZXN0T3B0aW9ucyIsInBhdGgiLCJvcHRzIiwidXJsIiwiZ2V0UmVzb3VyY2UiLCJhY2NvdW50IiwiZ2V0U3luYyIsImdldFJvbGVzIiwiZ2V0TWVtYmVyc2hpcHMiLCJnZXRGb3JtcyIsImdldENob2ljZUxpc3RzIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwiZ2V0UHJvamVjdHMiLCJnZXRQaG90b3MiLCJzZXF1ZW5jZSIsInBlclBhZ2UiLCJxcyIsInBlcl9wYWdlIiwiZnVsbCIsImdldFZpZGVvcyIsImdldEF1ZGlvIiwiZ2V0U2lnbmF0dXJlcyIsImdldENoYW5nZXNldHMiLCJjb3VudHMiLCJnZXRRdWVyeVVSTCIsInNxbCIsInEiLCJmb3JtYXQiLCJhcnJheXMiLCJnZXRQaG90b1VSTCIsIm1lZGlhIiwiaWQiLCJnZXRWaWRlb1VSTCIsImdldFZpZGVvVHJhY2tVUkwiLCJnZXRWaWRlb1RyYWNrIiwiZ2V0QXVkaW9VUkwiLCJnZXRBdWRpb1RyYWNrVVJMIiwiZ2V0QXVkaW9UcmFjayIsImdldFNpZ25hdHVyZVVSTCIsImRvd25sb2FkIiwidG8iLCJyZXNvbHZlIiwicmVqZWN0IiwicnEiLCJwaXBlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbiIsImdldFJlY29yZHMiLCJmb3JtIiwicGFnZVNpemUiLCJmb3JtX2lkIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJleHRlbnRzIiwiY2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUEsTUFBTUEsYUFBYSxtQkFBUUMsU0FBUixtQkFBbkI7QUFDQSxNQUFNQyxNQUFPQyxPQUFELElBQWFILHNCQUFZSSxTQUFTLElBQXJCLElBQThCRCxPQUE5QixFQUF6Qjs7QUFFQSxNQUFNRSxpQkFBaUI7QUFDckJDLFdBQVM7QUFDUCxrQkFBYyxjQURQO0FBRVAsY0FBVTtBQUZIO0FBRFksQ0FBdkI7O0FBT0EsTUFBTUMsV0FBVyw0QkFBakI7O0FBRUEsTUFBTUMsTUFBTixDQUFhO0FBQ1hDLGlCQUFlQyxRQUFmLEVBQXlCO0FBQ3ZCLFdBQU9ILFdBQVdHLFFBQWxCO0FBQ0Q7O0FBRURDLGFBQVdSLE9BQVgsRUFBb0I7QUFDbEIsV0FBTyxrQ0FBU0MsU0FBUyxJQUFsQixJQUEyQkQsT0FBM0IsRUFBUDtBQUNEOztBQUVEUyxVQUFRVCxPQUFSLEVBQWlCO0FBQ2YsV0FBT0QsSUFBSUMsT0FBSixDQUFQO0FBQ0Q7O0FBRURVLGlDQUErQkMsS0FBL0IsRUFBc0NYLE9BQXRDLEVBQStDO0FBQzdDLFVBQU1ZLFNBQVMsb0JBQU8sRUFBUCxFQUFXVixjQUFYLEVBQTJCRixPQUEzQixDQUFmOztBQUVBLFFBQUlXLEtBQUosRUFBVztBQUNUQyxhQUFPVCxPQUFQLENBQWUsWUFBZixJQUErQlEsS0FBL0I7QUFDRDs7QUFFRCxXQUFPQyxNQUFQO0FBQ0Q7O0FBRURDLGVBQWFDLFFBQWIsRUFBdUJDLFFBQXZCLEVBQWlDO0FBQy9CLFVBQU1mLFVBQVU7QUFDZGdCLGNBQVEsS0FETTtBQUVkQyxXQUFLLEtBQUtYLGNBQUwsQ0FBb0Isb0JBQXBCLENBRlM7QUFHZFksWUFBTTtBQUNKQyxrQkFBVUwsUUFETjtBQUVKQyxrQkFBVUEs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O0FBQ0QsS0FKTSxDQUFQO0FBS0Q7O0FBRURLLGFBQVcxQyxPQUFYLEVBQW9CMkMsSUFBcEIsRUFBMEJsQyxRQUExQixFQUFvQ21DLFFBQXBDLEVBQThDO0FBQzVDLFVBQU1qQyxLQUFLO0FBQ1RrQyxlQUFTRixLQUFLakIsRUFETDtBQUVUZCxnQkFBVWdDLFFBRkQ7QUFHVG5DLGdCQUFVQSxZQUFZO0FBSGIsS0FBWDs7QUFNQSxXQUFPLEtBQUtWLFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLHNCQUExQixFQUFrRCxFQUFDVyxFQUFELEVBQWxELENBQVA7QUFDRDs7QUFFRG1DLG9CQUFrQjlDLE9BQWxCLEVBQTJCMkMsSUFBM0IsRUFBaUNsQyxRQUFqQyxFQUEyQ21DLFFBQTNDLEVBQXFEO0FBQ25ELFVBQU1qQyxLQUFLO0FBQ1RrQyxlQUFTRixLQUFLakIsRUFETDtBQUVUZCxnQkFBVWdDLFFBRkQ7QUFHVEcsZUFBUyxDQUhBO0FBSVR0QyxnQkFBVUEsWUFBWTtBQUpiLEtBQVg7O0FBT0EsV0FBTyxLQUFLVixXQUFMLENBQWlCQyxPQUFqQixFQUEwQiw4QkFBMUIsRUFBMEQsRUFBQ1csRUFBRCxFQUExRCxDQUFQO0FBQ0Q7QUF4TVU7O0FBMk1iLE1BQU1xQyxTQUFTLElBQUl0RSxNQUFKLEVBQWY7O2tCQUVlc0UsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBleHRlbmQgfSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCByZXFQcm9taXNlID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWVzdCk7XG5jb25zdCByZXEgPSAob3B0aW9ucykgPT4gcmVxUHJvbWlzZSh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgaGVhZGVyczoge1xuICAgICdVc2VyLUFnZW50JzogJ0Z1bGNydW0gU3luYycsXG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG59O1xuXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwczovL2FwaS5mdWxjcnVtYXBwLmNvbSc7XG5cbmNsYXNzIENsaWVudCB7XG4gIHVybEZvclJlc291cmNlKHJlc291cmNlKSB7XG4gICAgcmV0dXJuIEJBU0VfVVJMICsgcmVzb3VyY2U7XG4gIH1cblxuICByYXdSZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gcmVxdWVzdCh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuICB9XG5cbiAgcmVxdWVzdChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnNGb3JBdXRoZW50aWNhdGVkUmVxdWVzdCh0b2tlbiwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlc3VsdCA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgaWYgKHRva2VuKSB7XG4gICAgICByZXN1bHQuaGVhZGVyc1snWC1BcGlUb2tlbiddID0gdG9rZW47XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZSh1c2VyTmFtZSwgcGFzc3dvcmQpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVyaTogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi91c2Vycy5qc29uJyksXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VyTmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICBzZW5kSW1tZWRpYXRlbHk6IHRydWVcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzOiBkZWZhdWx0T3B0aW9ucy5oZWFkZXJzXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnJlcXVlc3Qob3B0aW9ucyk7XG4gIH1cblxuICBhdXRoZW50aWNhdGVXaXRoVG9rZW4odG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuZ2V0UmVxdWVzdE9wdGlvbnModG9rZW4sICcvYXBpL3YyL3VzZXJzLmpzb24nKSk7XG4gIH1cblxuICBnZXRSZXF1ZXN0T3B0aW9ucyh0b2tlbiwgcGF0aCwgb3B0cykge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnNGb3JBdXRoZW50aWNhdGVkUmVxdWVzdCh0b2tlbiwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKHBhdGgpLFxuICAgICAgLi4ub3B0c1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVzb3VyY2UoYWNjb3VudCwgcGF0aCwgb3B0cyA9IHt9KSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh0aGlzLmdldFJlcXVlc3RPcHRpb25zKGFjY291bnQudG9rZW4sIHBhdGgsIG9wdHMpKTtcbiAgfVxuXG4gIGdldFN5bmMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL19wcml2YXRlL3N5bmMuanNvbicpO1xuICB9XG5cbiAgZ2V0Um9sZXMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3JvbGVzLmpzb24nKTtcbiAgfVxuXG4gIGdldE1lbWJlcnNoaXBzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9tZW1iZXJzaGlwcy5qc29uJyk7XG4gIH1cblxuICBnZXRGb3JtcyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvZm9ybXMuanNvbicpO1xuICB9XG5cbiAgZ2V0Q2hvaWNlTGlzdHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2Nob2ljZV9saXN0cy5qc29uJyk7XG4gIH1cblxuICBnZXRDbGFzc2lmaWNhdGlvblNldHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2NsYXNzaWZpY2F0aW9uX3NldHMuanNvbicpO1xuICB9XG5cbiAgZ2V0UHJvamVjdHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3Byb2plY3RzLmpzb24nKTtcbiAgfVxuXG4gIGdldFBob3RvcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9waG90b3MuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0VmlkZW9zKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3ZpZGVvcy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRBdWRpbyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9hdWRpby5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVzKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3NpZ25hdHVyZXMuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0Q2hhbmdlc2V0cyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGNvdW50czogJzAnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2NoYW5nZXNldHMuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0UXVlcnlVUkwoYWNjb3VudCwgc3FsKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBxOiBzcWwsXG4gICAgICBmb3JtYXQ6ICdqc29uc2VxJyxcbiAgICAgIGFycmF5czogMVxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXF1ZXN0T3B0aW9ucyhhY2NvdW50LnRva2VuLCAnL2FwaS92Mi9xdWVyeScsIHtxc30pO1xuICB9XG5cbiAgZ2V0UGhvdG9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9waG90b3MvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVHJhY2tVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfS90cmFjay5qc29uP3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVHJhY2soYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCBgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfS90cmFjay5qc29uYCk7XG4gIH1cblxuICBnZXRBdWRpb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0QXVkaW9UcmFja1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRBdWRpb1RyYWNrKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgYC9hcGkvdjIvYXVkaW8vJHsgbWVkaWEuaWQgfS90cmFjay5qc29uYCk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9zaWduYXR1cmVzLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZG93bmxvYWQodXJsLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3QodXJsKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCAoKSA9PiByZXNvbHZlKHJxKSk7XG4gICAgICBycS5vbignZXJyb3InLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjb3JkcyhhY2NvdW50LCBmb3JtLCBzZXF1ZW5jZSwgcGFnZVNpemUpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIGZvcm1faWQ6IGZvcm0uaWQsXG4gICAgICBwZXJfcGFnZTogcGFnZVNpemUsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9yZWNvcmRzLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldFJlY29yZHNIaXN0b3J5KGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgZm9ybV9pZDogZm9ybS5pZCxcbiAgICAgIHBlcl9wYWdlOiBwYWdlU2l6ZSxcbiAgICAgIGV4dGVudHM6IDAsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9yZWNvcmRzL2hpc3RvcnkuanNvbicsIHtxc30pO1xuICB9XG59XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBDbGllbnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19