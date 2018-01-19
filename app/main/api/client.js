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

  request(args) {
    return req(args);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiQkFTRV9VUkwiLCJDbGllbnQiLCJ1cmxGb3JSZXNvdXJjZSIsInJlc291cmNlIiwiX3JlcXVlc3QiLCJyZXF1ZXN0IiwiYXJncyIsIm9wdGlvbnNGb3JBdXRoZW50aWNhdGVkUmVxdWVzdCIsInRva2VuIiwicmVzdWx0IiwiYXV0aGVudGljYXRlIiwidXNlck5hbWUiLCJwYXNzd29yZCIsIm1ldGhvZCIsInVyaSIsImF1dGgiLCJ1c2VybmFtZSIsInNlbmRJbW1lZGlhdGVseSIsImF1dGhlbnRpY2F0ZVdpdGhUb2tlbiIsImdldFJlcXVlc3RPcHRpb25zIiwicGF0aCIsIm9wdHMiLCJ1cmwiLCJnZXRSZXNvdXJjZSIsImFjY291bnQiLCJnZXRTeW5jIiwiZ2V0Um9sZXMiLCJnZXRNZW1iZXJzaGlwcyIsImdldEZvcm1zIiwiZ2V0Q2hvaWNlTGlzdHMiLCJnZXRDbGFzc2lmaWNhdGlvblNldHMiLCJnZXRQcm9qZWN0cyIsImdldFBob3RvcyIsInNlcXVlbmNlIiwicGVyUGFnZSIsInFzIiwicGVyX3BhZ2UiLCJmdWxsIiwiZ2V0VmlkZW9zIiwiZ2V0QXVkaW8iLCJnZXRTaWduYXR1cmVzIiwiZ2V0Q2hhbmdlc2V0cyIsImNvdW50cyIsImdldFF1ZXJ5VVJMIiwic3FsIiwicSIsImZvcm1hdCIsImFycmF5cyIsImdldFBob3RvVVJMIiwibWVkaWEiLCJpZCIsImdldFZpZGVvVVJMIiwiZ2V0VmlkZW9UcmFja1VSTCIsImdldFZpZGVvVHJhY2siLCJnZXRBdWRpb1VSTCIsImdldEF1ZGlvVHJhY2tVUkwiLCJnZXRBdWRpb1RyYWNrIiwiZ2V0U2lnbmF0dXJlVVJMIiwiZG93bmxvYWQiLCJ0byIsInJlc29sdmUiLCJyZWplY3QiLCJycSIsInBpcGUiLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uIiwiZ2V0UmVjb3JkcyIsImZvcm0iLCJwYWdlU2l6ZSIsImZvcm1faWQiLCJnZXRSZWNvcmRzSGlzdG9yeSIsImV4dGVudHMiLCJjbGllbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxhQUFhLG1CQUFRQyxTQUFSLG1CQUFuQjtBQUNBLE1BQU1DLE1BQU9DLE9BQUQsSUFBYUgsc0JBQVlJLFNBQVMsSUFBckIsSUFBOEJELE9BQTlCLEVBQXpCOztBQUVBLE1BQU1FLGlCQUFpQjtBQUNyQkMsV0FBUztBQUNQLGtCQUFjLGNBRFA7QUFFUCxjQUFVO0FBRkg7QUFEWSxDQUF2Qjs7QUFPQSxNQUFNQyxXQUFXLDRCQUFqQjs7QUFFQSxNQUFNQyxNQUFOLENBQWE7QUFDWEMsaUJBQWVDLFFBQWYsRUFBeUI7QUFDdkIsV0FBT0gsV0FBV0csUUFBbEI7QUFDRDs7QUFFREMsV0FBU1IsT0FBVCxFQUFrQjtBQUNoQixXQUFPLGtDQUFTQyxTQUFTLElBQWxCLElBQTJCRCxPQUEzQixFQUFQO0FBQ0Q7O0FBRURTLFVBQVFDLElBQVIsRUFBYztBQUNaLFdBQU9YLElBQUlXLElBQUosQ0FBUDtBQUNEOztBQUVEQyxpQ0FBK0JDLEtBQS9CLEVBQXNDWixPQUF0QyxFQUErQztBQUM3QyxVQUFNYSxTQUFTLG9CQUFPLEVBQVAsRUFBV1gsY0FBWCxFQUEyQkYsT0FBM0IsQ0FBZjs7QUFFQSxRQUFJWSxLQUFKLEVBQVc7QUFDVEMsYUFBT1YsT0FBUCxDQUFlLFlBQWYsSUFBK0JTLEtBQS9CO0FBQ0Q7O0FBRUQsV0FBT0MsTUFBUDtBQUNEOztBQUVEQyxlQUFhQyxRQUFiLEVBQXVCQyxRQUF2QixFQUFpQztBQUMvQixVQUFNaEIsVUFBVTtBQUNkaUIsY0FBUSxLQURNO0FBRWRDLFdBQUssS0FBS1osY0FBTCxDQUFvQixvQkFBcEIsQ0FGUztBQUdkYSxZQUFNO0FBQ0pDLGtCQUFVTCxRQUROO0FBRUpDLGtCQUFVQSxRQUZOO0FBR0pLLHlCQUFpQjtBQUhiLE9BSFE7QUFRZGxCLGVBQVNELGVBQWVDO0FBUlYsS0FBaEI7O0FBV0EsV0FBTyxLQUFLTSxPQUFMLENBQWFULE9BQWIsQ0FBUDtBQUNEOztBQUVEc0Isd0JBQXNCVixLQUF0QixFQUE2QjtBQUMzQixXQUFPLEtBQUtILE9BQUwsQ0FBYSxLQUFLYyxpQkFBTCxDQUF1QlgsS0FBdkIsRUFBOEIsb0JBQTlCLENBQWIsQ0FBUDtBQUNEOztBQUVEVyxvQkFBa0JYLEtBQWxCLEVBQXlCWSxJQUF6QixFQUErQkMsSUFBL0IsRUFBcUM7QUFDbkMsV0FBTyxLQUFLZCw4QkFBTCxDQUFvQ0MsS0FBcEM7QUFDTGMsV0FBSyxLQUFLcEIsY0FBTCxDQUFvQmtCLElBQXBCO0FBREEsT0FFRkMsSUFGRSxFQUFQO0FBSUQ7O0FBRURFLGNBQVlDLE9BQVosRUFBcUJKLElBQXJCLEVBQTJCQyxPQUFPLEVBQWxDLEVBQXNDO0FBQ3BDLFdBQU8sS0FBS2hCLE9BQUwsQ0FBYSxLQUFLYyxpQkFBTCxDQUF1QkssUUFBUWhCLEtBQS9CLEVBQXNDWSxJQUF0QyxFQUE0Q0MsSUFBNUMsQ0FBYixDQUFQO0FBQ0Q7O0FBRURJLFVBQVFELE9BQVIsRUFBaUI7QUFDZixXQUFPLEtBQUtELFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLHlCQUExQixDQUFQO0FBQ0Q7O0FBRURFLFdBQVNGLE9BQVQsRUFBa0I7QUFDaEIsV0FBTyxLQUFLRCxXQUFMLENBQWlCQyxPQUFqQixFQUEwQixvQkFBMUIsQ0FBUDtBQUNEOztBQUVERyxpQkFBZUgsT0FBZixFQUF3QjtBQUN0QixXQUFPLEtBQUtELFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLDBCQUExQixDQUFQO0FBQ0Q7O0FBRURJLFdBQVNKLE9BQVQsRUFBa0I7QUFDaEIsV0FBTyxLQUFLRCxXQUFMLENBQWlCQyxPQUFqQixFQUEwQixvQkFBMUIsQ0FBUDtBQUNEOztBQUVESyxpQkFBZUwsT0FBZixFQUF3QjtBQUN0QixXQUFPLEtBQUtELFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLDJCQUExQixDQUFQO0FBQ0Q7O0FBRURNLHdCQUFzQk4sT0FBdEIsRUFBK0I7QUFDN0IsV0FBTyxLQUFLRCxXQUFMLENBQWlCQyxPQUFqQixFQUEwQixrQ0FBMUIsQ0FBUDtBQUNEOztBQUVETyxjQUFZUCxPQUFaLEVBQXFCO0FBQ25CLFdBQU8sS0FBS0QsV0FBTCxDQUFpQkMsT0FBakIsRUFBMEIsdUJBQTFCLENBQVA7QUFDRDs7QUFFRFEsWUFBVVIsT0FBVixFQUFtQlMsUUFBbkIsRUFBNkJDLE9BQTdCLEVBQXNDO0FBQ3BDLFVBQU1DLEtBQUs7QUFDVEMsZ0JBQVVGLE9BREQ7QUFFVEQsZ0JBQVVBLFlBQVksQ0FGYjtBQUdUSSxZQUFNO0FBSEcsS0FBWDs7QUFNQSxXQUFPLEtBQUtkLFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLHFCQUExQixFQUFpRCxFQUFDVyxFQUFELEVBQWpELENBQVA7QUFDRDs7QUFFREcsWUFBVWQsT0FBVixFQUFtQlMsUUFBbkIsRUFBNkJDLE9BQTdCLEVBQXNDO0FBQ3BDLFVBQU1DLEtBQUs7QUFDVEMsZ0JBQVVGLE9BREQ7QUFFVEQsZ0JBQVVBLFlBQVksQ0FGYjtBQUdUSSxZQUFNO0FBSEcsS0FBWDs7QUFNQSxXQUFPLEtBQUtkLFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLHFCQUExQixFQUFpRCxFQUFDVyxFQUFELEVBQWpELENBQVA7QUFDRDs7QUFFREksV0FBU2YsT0FBVCxFQUFrQlMsUUFBbEIsRUFBNEJDLE9BQTVCLEVBQXFDO0FBQ25DLFVBQU1DLEtBQUs7QUFDVEMsZ0JBQVVGLE9BREQ7QUFFVEQsZ0JBQVVBLFlBQVksQ0FGYjtBQUdUSSxZQUFNO0FBSEcsS0FBWDs7QUFNQSxXQUFPLEtBQUtkLFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLG9CQUExQixFQUFnRCxFQUFDVyxFQUFELEVBQWhELENBQVA7QUFDRDs7QUFFREssZ0JBQWNoQixPQUFkLEVBQXVCUyxRQUF2QixFQUFpQ0MsT0FBakMsRUFBMEM7QUFDeEMsVUFBTUMsS0FBSztBQUNUQyxnQkFBVUYsT0FERDtBQUVURCxnQkFBVUEsWUFBWSxDQUZiO0FBR1RJLFlBQU07QUFIRyxLQUFYOztBQU1BLFdBQU8sS0FBS2QsV0FBTCxDQUFpQkMsT0FBakIsRUFBMEIseUJBQTFCLEVBQXFELEVBQUNXLEVBQUQsRUFBckQsQ0FBUDtBQUNEOztBQUVETSxnQkFBY2pCLE9BQWQsRUFBdUJTLFFBQXZCLEVBQWlDQyxPQUFqQyxFQUEwQztBQUN4QyxVQUFNQyxLQUFLO0FBQ1RDLGdCQUFVRixPQUREO0FBRVRELGdCQUFVQSxZQUFZLENBRmI7QUFHVFMsY0FBUTtBQUhDLEtBQVg7O0FBTUEsV0FBTyxLQUFLbkIsV0FBTCxDQUFpQkMsT0FBakIsRUFBMEIseUJBQTFCLEVBQXFELEVBQUNXLEVBQUQsRUFBckQsQ0FBUDtBQUNEOztBQUVEUSxjQUFZbkIsT0FBWixFQUFxQm9CLEdBQXJCLEVBQTBCO0FBQ3hCLFVBQU1ULEtBQUs7QUFDVFUsU0FBR0QsR0FETTtBQUVURSxjQUFRLFNBRkM7QUFHVEMsY0FBUTtBQUhDLEtBQVg7O0FBTUEsV0FBTyxLQUFLNUIsaUJBQUwsQ0FBdUJLLFFBQVFoQixLQUEvQixFQUFzQyxlQUF0QyxFQUF1RCxFQUFDMkIsRUFBRCxFQUF2RCxDQUFQO0FBQ0Q7O0FBRURhLGNBQVl4QixPQUFaLEVBQXFCeUIsS0FBckIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLL0MsY0FBTCxDQUFxQixrQkFBa0IrQyxNQUFNQyxFQUFJLFVBQVMxQixRQUFRaEIsS0FBTSxFQUF4RSxDQUFQO0FBQ0Q7O0FBRUQyQyxjQUFZM0IsT0FBWixFQUFxQnlCLEtBQXJCLEVBQTRCO0FBQzFCLFdBQU8sS0FBSy9DLGNBQUwsQ0FBcUIsa0JBQWtCK0MsTUFBTUMsRUFBSSxVQUFTMUIsUUFBUWhCLEtBQU0sRUFBeEUsQ0FBUDtBQUNEOztBQUVENEMsbUJBQWlCNUIsT0FBakIsRUFBMEJ5QixLQUExQixFQUFpQztBQUMvQixXQUFPLEtBQUsvQyxjQUFMLENBQXFCLGtCQUFrQitDLE1BQU1DLEVBQUkscUJBQW9CMUIsUUFBUWhCLEtBQU0sRUFBbkYsQ0FBUDtBQUNEOztBQUVENkMsZ0JBQWM3QixPQUFkLEVBQXVCeUIsS0FBdkIsRUFBOEI7QUFDNUIsV0FBTyxLQUFLMUIsV0FBTCxDQUFpQkMsT0FBakIsRUFBMkIsa0JBQWtCeUIsTUFBTUMsRUFBSSxhQUF2RCxDQUFQO0FBQ0Q7O0FBRURJLGNBQVk5QixPQUFaLEVBQXFCeUIsS0FBckIsRUFBNEI7QUFDMUIsV0FBTyxLQUFLL0MsY0FBTCxDQUFxQixpQkFBaUIrQyxNQUFNQyxFQUFJLFVBQVMxQixRQUFRaEIsS0FBTSxFQUF2RSxDQUFQO0FBQ0Q7O0FBRUQrQyxtQkFBaUIvQixPQUFqQixFQUEwQnlCLEtBQTFCLEVBQWlDO0FBQy9CLFdBQU8sS0FBSy9DLGNBQUwsQ0FBcUIsaUJBQWlCK0MsTUFBTUMsRUFBSSxxQkFBb0IxQixRQUFRaEIsS0FBTSxFQUFsRixDQUFQO0FBQ0Q7O0FBRURnRCxnQkFBY2hDLE9BQWQsRUFBdUJ5QixLQUF2QixFQUE4QjtBQUM1QixXQUFPLEtBQUsxQixXQUFMLENBQWlCQyxPQUFqQixFQUEyQixpQkFBaUJ5QixNQUFNQyxFQUFJLGFBQXRELENBQVA7QUFDRDs7QUFFRE8sa0JBQWdCakMsT0FBaEIsRUFBeUJ5QixLQUF6QixFQUFnQztBQUM5QixXQUFPLEtBQUsvQyxjQUFMLENBQXFCLHNCQUFzQitDLE1BQU1DLEVBQUksVUFBUzFCLFFBQVFoQixLQUFNLEVBQTVFLENBQVA7QUFDRDs7QUFFRGtELFdBQVNwQyxHQUFULEVBQWNxQyxFQUFkLEVBQWtCO0FBQ2hCLFdBQU8sdUJBQVksQ0FBQ0MsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDLFlBQU1DLEtBQUssdUJBQVF4QyxHQUFSLEVBQWF5QyxJQUFiLENBQWtCLGFBQUdDLGlCQUFILENBQXFCTCxFQUFyQixDQUFsQixDQUFYO0FBQ0FHLFNBQUdHLEVBQUgsQ0FBTSxPQUFOLEVBQWUsTUFBTUwsUUFBUUUsRUFBUixDQUFyQjtBQUNBQSxTQUFHRyxFQUFILENBQU0sT0FBTixFQUFlSixNQUFmO0FBQ0QsS0FKTSxDQUFQO0FBS0Q7O0FBRURLLGFBQVcxQyxPQUFYLEVBQW9CMkMsSUFBcEIsRUFBMEJsQyxRQUExQixFQUFvQ21DLFFBQXBDLEVBQThDO0FBQzVDLFVBQU1qQyxLQUFLO0FBQ1RrQyxlQUFTRixLQUFLakIsRUFETDtBQUVUZCxnQkFBVWdDLFFBRkQ7QUFHVG5DLGdCQUFVQSxZQUFZO0FBSGIsS0FBWDs7QUFNQSxXQUFPLEtBQUtWLFdBQUwsQ0FBaUJDLE9BQWpCLEVBQTBCLHNCQUExQixFQUFrRCxFQUFDVyxFQUFELEVBQWxELENBQVA7QUFDRDs7QUFFRG1DLG9CQUFrQjlDLE9BQWxCLEVBQTJCMkMsSUFBM0IsRUFBaUNsQyxRQUFqQyxFQUEyQ21DLFFBQTNDLEVBQXFEO0FBQ25ELFVBQU1qQyxLQUFLO0FBQ1RrQyxlQUFTRixLQUFLakIsRUFETDtBQUVUZCxnQkFBVWdDLFFBRkQ7QUFHVEcsZUFBUyxDQUhBO0FBSVR0QyxnQkFBVUEsWUFBWTtBQUpiLEtBQVg7O0FBT0EsV0FBTyxLQUFLVixXQUFMLENBQWlCQyxPQUFqQixFQUEwQiw4QkFBMUIsRUFBMEQsRUFBQ1csRUFBRCxFQUExRCxDQUFQO0FBQ0Q7QUF4TVU7O0FBMk1iLE1BQU1xQyxTQUFTLElBQUl2RSxNQUFKLEVBQWY7O2tCQUVldUUsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0JztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBleHRlbmQgfSBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCByZXFQcm9taXNlID0gUHJvbWlzZS5wcm9taXNpZnkocmVxdWVzdCk7XG5jb25zdCByZXEgPSAob3B0aW9ucykgPT4gcmVxUHJvbWlzZSh7Zm9yZXZlcjogdHJ1ZSwgLi4ub3B0aW9uc30pO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgaGVhZGVyczoge1xuICAgICdVc2VyLUFnZW50JzogJ0Z1bGNydW0gU3luYycsXG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICB9XG59O1xuXG5jb25zdCBCQVNFX1VSTCA9ICdodHRwczovL2FwaS5mdWxjcnVtYXBwLmNvbSc7XG5cbmNsYXNzIENsaWVudCB7XG4gIHVybEZvclJlc291cmNlKHJlc291cmNlKSB7XG4gICAgcmV0dXJuIEJBU0VfVVJMICsgcmVzb3VyY2U7XG4gIH1cblxuICBfcmVxdWVzdChvcHRpb25zKSB7XG4gICAgcmV0dXJuIHJlcXVlc3Qoe2ZvcmV2ZXI6IHRydWUsIC4uLm9wdGlvbnN9KTtcbiAgfVxuXG4gIHJlcXVlc3QoYXJncykge1xuICAgIHJldHVybiByZXEoYXJncyk7XG4gIH1cblxuICBvcHRpb25zRm9yQXV0aGVudGljYXRlZFJlcXVlc3QodG9rZW4sIG9wdGlvbnMpIHtcbiAgICBjb25zdCByZXN1bHQgPSBleHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICAgIGlmICh0b2tlbikge1xuICAgICAgcmVzdWx0LmhlYWRlcnNbJ1gtQXBpVG9rZW4nXSA9IHRva2VuO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBhdXRoZW50aWNhdGUodXNlck5hbWUsIHBhc3N3b3JkKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmk6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvdXNlcnMuanNvbicpLFxuICAgICAgYXV0aDoge1xuICAgICAgICB1c2VybmFtZTogdXNlck5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZCxcbiAgICAgICAgc2VuZEltbWVkaWF0ZWx5OiB0cnVlXG4gICAgICB9LFxuICAgICAgaGVhZGVyczogZGVmYXVsdE9wdGlvbnMuaGVhZGVyc1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG9wdGlvbnMpO1xuICB9XG5cbiAgYXV0aGVudGljYXRlV2l0aFRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdCh0aGlzLmdldFJlcXVlc3RPcHRpb25zKHRva2VuLCAnL2FwaS92Mi91c2Vycy5qc29uJykpO1xuICB9XG5cbiAgZ2V0UmVxdWVzdE9wdGlvbnModG9rZW4sIHBhdGgsIG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zRm9yQXV0aGVudGljYXRlZFJlcXVlc3QodG9rZW4sIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZShwYXRoKSxcbiAgICAgIC4uLm9wdHNcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJlc291cmNlKGFjY291bnQsIHBhdGgsIG9wdHMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QodGhpcy5nZXRSZXF1ZXN0T3B0aW9ucyhhY2NvdW50LnRva2VuLCBwYXRoLCBvcHRzKSk7XG4gIH1cblxuICBnZXRTeW5jKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS9fcHJpdmF0ZS9zeW5jLmpzb24nKTtcbiAgfVxuXG4gIGdldFJvbGVzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9yb2xlcy5qc29uJyk7XG4gIH1cblxuICBnZXRNZW1iZXJzaGlwcyhhY2NvdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvbWVtYmVyc2hpcHMuanNvbicpO1xuICB9XG5cbiAgZ2V0Rm9ybXMoYWNjb3VudCkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsICcvYXBpL3YyL2Zvcm1zLmpzb24nKTtcbiAgfVxuXG4gIGdldENob2ljZUxpc3RzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9jaG9pY2VfbGlzdHMuanNvbicpO1xuICB9XG5cbiAgZ2V0Q2xhc3NpZmljYXRpb25TZXRzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9jbGFzc2lmaWNhdGlvbl9zZXRzLmpzb24nKTtcbiAgfVxuXG4gIGdldFByb2plY3RzKGFjY291bnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9wcm9qZWN0cy5qc29uJyk7XG4gIH1cblxuICBnZXRQaG90b3MoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvcGhvdG9zLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldFZpZGVvcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi92aWRlb3MuanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0QXVkaW8oYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBmdWxsOiAnMSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvYXVkaW8uanNvbicsIHtxc30pO1xuICB9XG5cbiAgZ2V0U2lnbmF0dXJlcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9zaWduYXR1cmVzLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldENoYW5nZXNldHMoYWNjb3VudCwgc2VxdWVuY2UsIHBlclBhZ2UpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBjb3VudHM6ICcwJ1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShhY2NvdW50LCAnL2FwaS92Mi9jaGFuZ2VzZXRzLmpzb24nLCB7cXN9KTtcbiAgfVxuXG4gIGdldFF1ZXJ5VVJMKGFjY291bnQsIHNxbCkge1xuICAgIGNvbnN0IHFzID0ge1xuICAgICAgcTogc3FsLFxuICAgICAgZm9ybWF0OiAnanNvbnNlcScsXG4gICAgICBhcnJheXM6IDFcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVxdWVzdE9wdGlvbnMoYWNjb3VudC50b2tlbiwgJy9hcGkvdjIvcXVlcnknLCB7cXN9KTtcbiAgfVxuXG4gIGdldFBob3RvVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvcGhvdG9zLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0VmlkZW9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi92aWRlb3MvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1RyYWNrVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvdmlkZW9zLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbj90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1RyYWNrKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgYC9hcGkvdjIvdmlkZW9zLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbmApO1xuICB9XG5cbiAgZ2V0QXVkaW9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9hdWRpby8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldEF1ZGlvVHJhY2tVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9hdWRpby8keyBtZWRpYS5pZCB9L3RyYWNrLmpzb24/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZ2V0QXVkaW9UcmFjayhhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGFjY291bnQsIGAvYXBpL3YyL2F1ZGlvLyR7IG1lZGlhLmlkIH0vdHJhY2suanNvbmApO1xuICB9XG5cbiAgZ2V0U2lnbmF0dXJlVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvc2lnbmF0dXJlcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGRvd25sb2FkKHVybCwgdG8pIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgcnEgPSByZXF1ZXN0KHVybCkucGlwZShmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bykpO1xuICAgICAgcnEub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZShycSkpO1xuICAgICAgcnEub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJlY29yZHMoYWNjb3VudCwgZm9ybSwgc2VxdWVuY2UsIHBhZ2VTaXplKSB7XG4gICAgY29uc3QgcXMgPSB7XG4gICAgICBmb3JtX2lkOiBmb3JtLmlkLFxuICAgICAgcGVyX3BhZ2U6IHBhZ2VTaXplLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDBcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvcmVjb3Jkcy5qc29uJywge3FzfSk7XG4gIH1cblxuICBnZXRSZWNvcmRzSGlzdG9yeShhY2NvdW50LCBmb3JtLCBzZXF1ZW5jZSwgcGFnZVNpemUpIHtcbiAgICBjb25zdCBxcyA9IHtcbiAgICAgIGZvcm1faWQ6IGZvcm0uaWQsXG4gICAgICBwZXJfcGFnZTogcGFnZVNpemUsXG4gICAgICBleHRlbnRzOiAwLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDBcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UoYWNjb3VudCwgJy9hcGkvdjIvcmVjb3Jkcy9oaXN0b3J5Lmpzb24nLCB7cXN9KTtcbiAgfVxufVxuXG5jb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KCk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==