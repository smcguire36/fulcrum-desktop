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

  _request(options) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiQkFTRV9VUkwiLCJDbGllbnQiLCJ1cmxGb3JSZXNvdXJjZSIsInJlc291cmNlIiwiX3JlcXVlc3QiLCJyZXF1ZXN0Iiwib3B0aW9uc0ZvckF1dGhlbnRpY2F0ZWRSZXF1ZXN0IiwidG9rZW4iLCJyZXN1bHQiLCJhdXRoZW50aWNhdGUiLCJ1c2VyTmFtZSIsInBhc3N3b3JkIiwibWV0aG9kIiwidXJpIiwiYXV0aCIsInVzZXJuYW1lIiwic2VuZEltbWVkaWF0ZWx5IiwiYXV0aGVudGljYXRlV2l0aFRva2VuIiwiZ2V0UmVxdWVzdE9wdGlvbnMiLCJwYXRoIiwib3B0cyIsInVybCIsImdldFJlc291cmNlIiwiYWNjb3VudCIsImdldFN5bmMiLCJnZXRSb2xlcyIsImdldE1lbWJlcnNoaXBzIiwiZ2V0Rm9ybXMiLCJnZXRDaG9pY2VMaXN0cyIsImdldENsYXNzaWZpY2F0aW9uU2V0cyIsImdldFByb2plY3RzIiwiZ2V0UGhvdG9zIiwic2VxdWVuY2UiLCJwZXJQYWdlIiwicXMiLCJwZXJfcGFnZSIsImZ1bGwiLCJnZXRWaWRlb3MiLCJnZXRBdWRpbyIsImdldFNpZ25hdHVyZXMiLCJnZXRDaGFuZ2VzZXRzIiwiY291bnRzIiwiZ2V0UXVlcnlVUkwiLCJzcWwiLCJxIiwiZm9ybWF0IiwiYXJyYXlzIiwiZ2V0UGhvdG9VUkwiLCJtZWRpYSIsImlkIiwiZ2V0VmlkZW9VUkwiLCJnZXRWaWRlb1RyYWNrVVJMIiwiZ2V0VmlkZW9UcmFjayIsImdldEF1ZGlvVVJMIiwiZ2V0QXVkaW9UcmFja1VSTCIsImdldEF1ZGlvVHJhY2siLCJnZXRTaWduYXR1cmVVUkwiLCJkb3dubG9hZCIsInRvIiwicmVzb2x2ZSIsInJlamVjdCIsInJxIiwicGlwZSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwib24iLCJnZXRSZWNvcmRzIiwiZm9ybSIsInBhZ2VTaXplIiwiZm9ybV9pZCIsImdldFJlY29yZHNIaXN0b3J5IiwiZXh0ZW50cyIsImNsaWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBLE1BQU1BLGFBQWEsbUJBQVFDLFNBQVIsbUJBQW5CO0FBQ0EsTUFBTUMsTUFBT0MsT0FBRCxJQUFhSCxzQkFBWUksU0FBUyxJQUFyQixJQUE4QkQsT0FBOUIsRUFBekI7O0FBRUEsTUFBTUUsaUJBQWlCO0FBQ3JCQyxXQUFTO0FBQ1Asa0JBQWMsY0FEUDtBQUVQLGNBQVU7QUFGSDtBQURZLENBQXZCOztBQU9BLE1BQU1DLFdBQVcsNEJBQWpCOztBQUVBLE1BQU1DLE1BQU4sQ0FBYTtBQUNYQyxpQkFBZUMsUUFBZixFQUF5QjtBQUN2QixXQUFPSCxXQUFXRyxRQUFsQjtBQUNEOztBQUVEQyxXQUFTUixPQUFULEVBQWtCO0FBQ2hCLFdBQU8sa0NBQVNDLFNBQVMsSUFBbEIsSUFBMkJELE9BQTNCLEVBQVA7QUFDRDs7QUFFRFMsVUFBUVQsT0FBUixFQUFpQjtBQUNmLFdBQU9ELElBQUlDLE9BQUosQ0FBUDtBQUNEOztBQUVEVSxpQ0FBK0JDLEtBQS9CLEVBQXNDWCxPQUF0QyxFQUErQztBQUM3QyxVQUFNWSxTQUFTLG9CQUFPLEVBQVAsRUFBV1YsY0FBWCxFQUEyQkYsT0FBM0IsQ0FBZjs7QUFFQSxRQUFJVyxLQUFKLEVBQVc7QUFDVEMsYUFBT1QsT0FBUCxDQUFlLFlBQWYsSUFBK0JRLEtBQS9CO0FBQ0Q7O0FBRUQsV0FBT0MsTUFBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxRQUF2QixFQUFpQztBQUMvQixVQUFNZixVQUFVO0FBQ2RnQixjQUFRLEtBRE07QUFFZEMsV0FBSyxLQUFLWCxjQUFMLENBQW9CLG9CQUFwQixDQUZTO0FBR2RZLFlBQU07QUFDSkMsa0JBQVVMLFFBRE47QUFFSkMsa0JBQVVBLFFB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QUNELEtBSk0sQ0FBUDtBQUtEOztBQUVESyxhQUFXMUMsT0FBWCxFQUFvQjJDLElBQXBCLEVBQTBCbEMsUUFBMUIsRUFBb0NtQyxRQUFwQyxFQUE4QztBQUM1QyxVQUFNakMsS0FBSztBQUNUa0MsZUFBU0YsS0FBS2pCLEVBREw7QUFFVGQsZ0JBQVVnQyxRQUZEO0FBR1RuQyxnQkFBVUEsWUFBWTtBQUhiLEtBQVg7O0FBTUEsV0FBTyxLQUFLVixXQUFMLENBQWlCQyxPQUFqQixFQUEwQixzQkFBMUIsRUFBa0QsRUFBQ1csRUFBRCxFQUFsRCxDQUFQO0FBQ0Q7O0FBRURtQyxvQkFBa0I5QyxPQUFsQixFQUEyQjJDLElBQTNCLEVBQWlDbEMsUUFBakMsRUFBMkNtQyxRQUEzQyxFQUFxRDtBQUNuRCxVQUFNakMsS0FBSztBQUNUa0MsZUFBU0YsS0FBS2pCLEVBREw7QUFFVGQsZ0JBQVVnQyxRQUZEO0FBR1RHLGVBQVMsQ0FIQTtBQUlUdEMsZ0JBQVVBLFlBQVk7QUFKYixLQUFYOztBQU9BLFdBQU8sS0FBS1YsV0FBTCxDQUFpQkMsT0FBakIsRUFBMEIsOEJBQTFCLEVBQTBELEVBQUNXLEVBQUQsRUFBMUQsQ0FBUDtBQUNEO0FBeE1VOztBQTJNYixNQUFNcUMsU0FBUyxJQUFJdEUsTUFBSixFQUFmOztrQkFFZXNFLE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgZXh0ZW5kIH0gZnJvbSAnbG9kYXNoJztcblxuY29uc3QgcmVxUHJvbWlzZSA9IFByb21pc2UucHJvbWlzaWZ5KHJlcXVlc3QpO1xuY29uc3QgcmVxID0gKG9wdGlvbnMpID0+IHJlcVByb21pc2Uoe2ZvcmV2ZXI6IHRydWUsIC4uLm9wdGlvbnN9KTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhlYWRlcnM6IHtcbiAgICAnVXNlci1BZ2VudCc6ICdGdWxjcnVtIFN5bmMnLFxuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxufTtcblxuY29uc3QgQkFTRV9VUkwgPSAnaHR0cHM6Ly9hcGkuZnVsY3J1bWFwcC5jb20nO1xuXG5jbGFzcyBDbGllbnQge1xuICB1cmxGb3JSZXNvdXJjZShyZXNvdXJjZSkge1xuICAgIHJldHVybiBCQVNFX1VSTCArIHJlc291cmNlO1xuICB9XG5cbiAgX3JlcXVlc3Qob3B0aW9ucykge1xuICAgIHJldHVybiByZXF1ZXN0KHtmb3JldmVyOiB0cnVlLCAuLi5vcHRpb25zfSk7XG4gIH1cblxuICByZXF1ZXN0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgb3B0aW9uc0ZvckF1dGhlbnRpY2F0ZWRSZXF1ZXN0KHRva2VuLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHJlc3VsdC5oZWFkZXJzWydYLUFwaVRva2VuJ10gPSB0b2tlbjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgYXV0aGVudGljYXRlKHVzZXJOYW1lLCBwYXNzd29yZCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJpOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3VzZXJzLmpzb24nKSxcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJOYW1lLFxuICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgIHNlbmRJbW1lZGlhdGVseTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGhlYWRlcnM6IGRlZmF1bHRPcHRpb25zLmhlYWRlcnNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChvcHRpb25zKTtcbiAgfVxuXG4gIGF1dGhlbnRpY2F0ZVdpdGhUb2tlbih0b2tlbikge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5nZXRSZXF1ZXN0T3B0aW9ucyh0b2tlbiwgJy9hcGkvdjIvdXNlcnMuanNvbicpKTtcbiAgfVxuXG4gIGdldFJlcXVlc3RPcHRpb25zKHRva2VuLCBwYXRoLCBvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9uc0ZvckF1dGhlbnRpY2F0ZWRSZXF1ZXN0KHRva2VuLCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UocGF0aCksXG4gICAgICAuLi5vcHRzXG4gICAgfSk7XG4gIH1cblxuICBnZXRSZXNvdXJjZShhY2NvdW50LCBwYXRoLCBvcHRzID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHRoaXMuZ2V0UmVxdWVzdE9wdGlvbnMoYWNjb3VudC50b2tlbiwgcGF0aCwgb3B0cykpO1xuICB9XG5cbiAgZ2V0U3luYyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvX3ByaXZhdGUvc3luYy5qc29uJyk7XG4gIH1cblxuICBnZXRSb2xlcyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvcm9sZXMuanNvbicpO1xuICB9XG5cbiAgZ2V0TWVtYmVyc2hpcHMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL21lbWJlcnNoaXBzLmpzb24nKTtcbiAgfVxuXG4gIGdldEZvcm1zKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9mb3Jtcy5qc29uJyk7XG4gIH1cblxuICBnZXRDaG9pY2VMaXN0cyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvY2hvaWNlX2xpc3RzLmpzb24nKTtcbiAgfVxuXG4gIGdldENsYXNzaWZpY2F0aW9uU2V0cyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvY2xhc3NpZmljYXRpb25fc2V0cy5qc29uJyk7XG4gIH1cblxuICBnZXRQcm9qZWN0cyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvcHJvamVjdHMuanNvbicpO1xuICB9XG5cbiAgZ2V0UGhvdG9zKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3Bob3Rvcy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRWaWRlb3MoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvdmlkZW9zLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldEF1ZGlvKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2F1ZGlvLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldFNpZ25hdHVyZXMoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvc2lnbmF0dXJlcy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRDaGFuZ2VzZXRzKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgY291bnRzOiAnMCdcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvY2hhbmdlc2V0cy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRRdWVyeVVSTChhY2NvdW50LCBzcWwpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHE6IHNxbCxcbiAgICAgIGZvcm1hdDogJ2pzb25zZXEnLFxuICAgICAgYXJyYXlzOiAxXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlcXVlc3RPcHRpb25zKGFjY291bnQudG9rZW4sICcvYXBpL3YyL3F1ZXJ5Jywge3FzfSk7XG4gIH1cblxuICBnZXRQaG90b1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3Bob3Rvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldFZpZGVvVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvdmlkZW9zLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0VmlkZW9UcmFja1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9L3RyYWNrLmpzb24/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0VmlkZW9UcmFjayhhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsIGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9L3RyYWNrLmpzb25gKTtcbiAgfVxuXG4gIGdldEF1ZGlvVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvYXVkaW8vJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRBdWRpb1RyYWNrVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvYXVkaW8vJHsgbWVkaWEuaWQgfS90cmFjay5qc29uP3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldEF1ZGlvVHJhY2soYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCBgL2FwaS92Mi9hdWRpby8keyBtZWRpYS5pZCB9L3RyYWNrLmpzb25gKTtcbiAgfVxuXG4gIGdldFNpZ25hdHVyZVVSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3NpZ25hdHVyZXMvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBkb3dubG9hZCh1cmwsIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHJxID0gcmVxdWVzdCh1cmwpLnBpcGUoZnMuY3JlYXRlV3JpdGVTdHJlYW0odG8pKTtcbiAgICAgIHJxLm9uKCdjbG9zZScsICgpID0+IHJlc29sdmUocnEpKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRSZWNvcmRzKGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgZm9ybV9pZDogZm9ybS5pZCxcbiAgICAgIHBlcl9wYWdlOiBwYWdlU2l6ZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3JlY29yZHMuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0UmVjb3Jkc0hpc3RvcnkoYWNjb3VudCwgZm9ybSwgc2VxdWVuY2UsIHBhZ2VTaXplKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBmb3JtX2lkOiBmb3JtLmlkLFxuICAgICAgcGVyX3BhZ2U6IHBhZ2VTaXplLFxuICAgICAgZXh0ZW50czogMCxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwXG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL3JlY29yZHMvaGlzdG9yeS5qc29uJywge3FzfSk7XG4gIH1cbn1cblxuY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=