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
      rq.on('close', resolve);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tYWluL2FwaS9jbGllbnQuanMiXSwibmFtZXMiOlsicmVxUHJvbWlzZSIsInByb21pc2lmeSIsInJlcSIsIm9wdGlvbnMiLCJmb3JldmVyIiwiZGVmYXVsdE9wdGlvbnMiLCJoZWFkZXJzIiwiYmFzZVVSTCIsIkNsaWVudCIsInVybEZvclJlc291cmNlIiwicmVzb3VyY2UiLCJvcHRpb25zRm9yUmVxdWVzdCIsImFjY291bnQiLCJyZXN1bHQiLCJleHRlbmQiLCJ0b2tlbiIsImF1dGhlbnRpY2F0ZSIsInVzZXJOYW1lIiwicGFzc3dvcmQiLCJtZXRob2QiLCJ1cmkiLCJhdXRoIiwidXNlcm5hbWUiLCJzZW5kSW1tZWRpYXRlbHkiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwicmVzcG9uc2UiLCJib2R5IiwiZ2V0U3luYyIsInVybCIsImdldFJvbGVzIiwiZ2V0TWVtYmVyc2hpcHMiLCJnZXRGb3JtcyIsImdldENob2ljZUxpc3RzIiwiZ2V0Q2xhc3NpZmljYXRpb25TZXRzIiwiZ2V0UHJvamVjdHMiLCJleCIsImNvbnNvbGUiLCJsb2ciLCJjb2RlIiwiY29ubmVjdCIsImdldFBob3RvcyIsInNlcXVlbmNlIiwicGVyUGFnZSIsInFzIiwicGVyX3BhZ2UiLCJmdWxsIiwiZ2V0VmlkZW9zIiwiZ2V0QXVkaW8iLCJnZXRTaWduYXR1cmVzIiwiZ2V0Q2hhbmdlc2V0cyIsImNvdW50cyIsImdldFBob3RvVVJMIiwibWVkaWEiLCJpZCIsImdldFZpZGVvVVJMIiwiZ2V0QXVkaW9VUkwiLCJnZXRTaWduYXR1cmVVUkwiLCJkb3dubG9hZCIsInRvIiwicnEiLCJwaXBlIiwiY3JlYXRlV3JpdGVTdHJlYW0iLCJvbiIsImdldFJlY29yZHMiLCJmb3JtIiwicGFnZVNpemUiLCJmb3JtX2lkIiwiZ2V0UmVjb3Jkc0hpc3RvcnkiLCJleHRlbnRzIiwiY2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLE1BQU1BLGFBQWEsbUJBQVFDLFNBQVIsbUJBQW5CO0FBQ0EsTUFBTUMsTUFBT0MsT0FBRCxJQUFhSCxzQkFBWUksU0FBUyxJQUFyQixJQUE4QkQsT0FBOUIsRUFBekI7O0FBRUEsTUFBTUUsaUJBQWlCO0FBQ3JCQyxXQUFTO0FBQ1Asa0JBQWMsY0FEUDtBQUVQLGNBQVU7QUFGSDtBQURZLENBQXZCOztBQU9BO0FBQ0EsTUFBTUMsVUFBVSw0QkFBaEI7QUFDQTs7QUFFQSxNQUFNQyxNQUFOLENBQWE7QUFDWEMsaUJBQWVDLFFBQWYsRUFBeUI7QUFDdkIsV0FBTyxLQUFLSCxPQUFMLEdBQWVHLFFBQXRCO0FBQ0Q7O0FBRURDLG9CQUFrQkMsT0FBbEIsRUFBMkJULE9BQTNCLEVBQW9DO0FBQ2xDLFVBQU1VLFNBQVMsaUJBQUVDLE1BQUYsQ0FBUyxFQUFULEVBQWFULGNBQWIsRUFBNkJGLE9BQTdCLENBQWY7QUFDQVUsV0FBT1AsT0FBUCxDQUFlLFlBQWYsSUFBK0JNLFFBQVFHLEtBQXZDO0FBQ0EsV0FBT0YsTUFBUDtBQUNEOztBQUVLRyxjQUFOLENBQW1CQyxRQUFuQixFQUE2QkMsUUFBN0IsRUFBdUM7QUFBQTs7QUFBQTtBQUNyQyxZQUFNZixVQUFVO0FBQ2RnQixnQkFBUSxLQURNO0FBRWRDLGFBQUssTUFBS1gsY0FBTCxDQUFvQixvQkFBcEIsQ0FGUztBQUdkWSxjQUFNO0FBQ0pDLG9CQUFVTCxRQUROO0FBRUpDLG9CQUFVQSxRQUZOO0FBR0pLLDJCQUFpQjtBQUhiLFNBSFE7QUFRZGpCLGlCQUFTRCxlQUFlQztBQVJWLE9BQWhCOztBQVdBLGFBQU8sdUJBQVksVUFBQ2tCLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUN0QywrQkFBUXRCLE9BQVIsRUFBaUIsVUFBQ3VCLEdBQUQsRUFBTUMsUUFBTixFQUFnQkMsSUFBaEIsRUFBeUI7QUFDeEMsY0FBSUYsR0FBSixFQUFTO0FBQ1AsbUJBQU9ELE9BQU9DLEdBQVAsQ0FBUDtBQUNELFdBRkQsTUFFTztBQUNMLG1CQUFPRixRQUFRRyxRQUFSLENBQVA7QUFDRDtBQUNGLFNBTkQ7QUFPRCxPQVJNLENBQVA7QUFacUM7QUFxQnRDOztBQUVLRSxTQUFOLENBQWNqQixPQUFkLEVBQXVCO0FBQUE7O0FBQUE7QUFDckIsWUFBTVQsVUFBVSxPQUFLUSxpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUNrQixhQUFLLE9BQUtyQixjQUFMLENBQW9CLHlCQUFwQjtBQUR5QyxPQUFoQyxDQUFoQjs7QUFJQSxhQUFPLE1BQU1QLElBQUlDLE9BQUosQ0FBYjtBQUxxQjtBQU10Qjs7QUFFSzRCLFVBQU4sQ0FBZW5CLE9BQWYsRUFBd0I7QUFBQTs7QUFBQTtBQUN0QixZQUFNVCxVQUFVLE9BQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssT0FBS3JCLGNBQUwsQ0FBb0Isb0JBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBLGFBQU8sTUFBTVAsSUFBSUMsT0FBSixDQUFiO0FBTHNCO0FBTXZCOztBQUVLNkIsZ0JBQU4sQ0FBcUJwQixPQUFyQixFQUE4QjtBQUFBOztBQUFBO0FBQzVCLFlBQU1ULFVBQVUsT0FBS1EsaUJBQUwsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQzlDa0IsYUFBSyxPQUFLckIsY0FBTCxDQUFvQiwwQkFBcEI7QUFEeUMsT0FBaEMsQ0FBaEI7O0FBSUEsYUFBTyxNQUFNUCxJQUFJQyxPQUFKLENBQWI7QUFMNEI7QUFNN0I7O0FBRUs4QixVQUFOLENBQWVyQixPQUFmLEVBQXdCO0FBQUE7O0FBQUE7QUFDdEIsWUFBTVQsVUFBVSxPQUFLUSxpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUNrQixhQUFLLE9BQUtyQixjQUFMLENBQW9CLG9CQUFwQjtBQUR5QyxPQUFoQyxDQUFoQjs7QUFJQSxhQUFPLE1BQU1QLElBQUlDLE9BQUosQ0FBYjtBQUxzQjtBQU12Qjs7QUFFSytCLGdCQUFOLENBQXFCdEIsT0FBckIsRUFBOEI7QUFBQTs7QUFBQTtBQUM1QixZQUFNVCxVQUFVLE9BQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssT0FBS3JCLGNBQUwsQ0FBb0IsMkJBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBLGFBQU8sTUFBTVAsSUFBSUMsT0FBSixDQUFiO0FBTDRCO0FBTTdCOztBQUVLZ0MsdUJBQU4sQ0FBNEJ2QixPQUE1QixFQUFxQztBQUFBOztBQUFBO0FBQ25DLFlBQU1ULFVBQVUsT0FBS1EsaUJBQUwsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQzlDa0IsYUFBSyxPQUFLckIsY0FBTCxDQUFvQixrQ0FBcEI7QUFEeUMsT0FBaEMsQ0FBaEI7O0FBSUEsYUFBTyxNQUFNUCxJQUFJQyxPQUFKLENBQWI7QUFMbUM7QUFNcEM7O0FBRUtpQyxhQUFOLENBQWtCeEIsT0FBbEIsRUFBMkI7QUFBQTs7QUFBQTtBQUN6QixZQUFNVCxVQUFVLE9BQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssT0FBS3JCLGNBQUwsQ0FBb0IsdUJBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBLFVBQUk7QUFDRixlQUFPLE1BQU1QLElBQUlDLE9BQUosQ0FBYjtBQUNELE9BRkQsQ0FFRSxPQUFPa0MsRUFBUCxFQUFXO0FBQ1hDLGdCQUFRQyxHQUFSLENBQVlGLEVBQVo7QUFDQUMsZ0JBQVFDLEdBQVIsQ0FBWUYsR0FBR0csSUFBSCxLQUFZLFdBQXhCO0FBQ0FGLGdCQUFRQyxHQUFSLENBQVlGLEdBQUdJLE9BQUgsS0FBZSxJQUEzQjtBQUNBLGNBQU1KLEVBQU47QUFDRDtBQVp3QjtBQWExQjs7QUFFS0ssV0FBTixDQUFnQjlCLE9BQWhCLEVBQXlCK0IsUUFBekIsRUFBbUNDLE9BQW5DLEVBQTRDO0FBQUE7O0FBQUE7QUFDMUMsWUFBTXpDLFVBQVUsT0FBS1EsaUJBQUwsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQzlDa0IsYUFBSyxPQUFLckIsY0FBTCxDQUFvQixxQkFBcEI7QUFEeUMsT0FBaEMsQ0FBaEI7O0FBSUFOLGNBQVEwQyxFQUFSLEdBQWE7QUFDWEMsa0JBQVVGLE9BREM7QUFFWEQsa0JBQVVBLFlBQVksQ0FGWDtBQUdYSSxjQUFNO0FBSEssT0FBYjs7QUFNQSxhQUFPLE1BQU03QyxJQUFJQyxPQUFKLENBQWI7QUFYMEM7QUFZM0M7O0FBRUs2QyxXQUFOLENBQWdCcEMsT0FBaEIsRUFBeUIrQixRQUF6QixFQUFtQ0MsT0FBbkMsRUFBNEM7QUFBQTs7QUFBQTtBQUMxQyxZQUFNekMsVUFBVSxRQUFLUSxpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUNrQixhQUFLLFFBQUtyQixjQUFMLENBQW9CLHFCQUFwQjtBQUR5QyxPQUFoQyxDQUFoQjs7QUFJQU4sY0FBUTBDLEVBQVIsR0FBYTtBQUNYQyxrQkFBVUYsT0FEQztBQUVYRCxrQkFBVUEsWUFBWSxDQUZYO0FBR1hJLGNBQU07QUFISyxPQUFiOztBQU1BLGFBQU8sTUFBTTdDLElBQUlDLE9BQUosQ0FBYjtBQVgwQztBQVkzQzs7QUFFSzhDLFVBQU4sQ0FBZXJDLE9BQWYsRUFBd0IrQixRQUF4QixFQUFrQ0MsT0FBbEMsRUFBMkM7QUFBQTs7QUFBQTtBQUN6QyxZQUFNekMsVUFBVSxRQUFLUSxpQkFBTCxDQUF1QkMsT0FBdkIsRUFBZ0M7QUFDOUNrQixhQUFLLFFBQUtyQixjQUFMLENBQW9CLG9CQUFwQjtBQUR5QyxPQUFoQyxDQUFoQjs7QUFJQU4sY0FBUTBDLEVBQVIsR0FBYTtBQUNYQyxrQkFBVUYsT0FEQztBQUVYRCxrQkFBVUEsWUFBWSxDQUZYO0FBR1hJLGNBQU07QUFISyxPQUFiOztBQU1BLGFBQU8sTUFBTTdDLElBQUlDLE9BQUosQ0FBYjtBQVh5QztBQVkxQzs7QUFFSytDLGVBQU4sQ0FBb0J0QyxPQUFwQixFQUE2QitCLFFBQTdCLEVBQXVDQyxPQUF2QyxFQUFnRDtBQUFBOztBQUFBO0FBQzlDLFlBQU16QyxVQUFVLFFBQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssUUFBS3JCLGNBQUwsQ0FBb0IseUJBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBTixjQUFRMEMsRUFBUixHQUFhO0FBQ1hDLGtCQUFVRixPQURDO0FBRVhELGtCQUFVQSxZQUFZLENBRlg7QUFHWEksY0FBTTtBQUhLLE9BQWI7O0FBTUEsYUFBTyxNQUFNN0MsSUFBSUMsT0FBSixDQUFiO0FBWDhDO0FBWS9DOztBQUVLZ0QsZUFBTixDQUFvQnZDLE9BQXBCLEVBQTZCK0IsUUFBN0IsRUFBdUNDLE9BQXZDLEVBQWdEO0FBQUE7O0FBQUE7QUFDOUMsWUFBTXpDLFVBQVUsUUFBS1EsaUJBQUwsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQzlDa0IsYUFBSyxRQUFLckIsY0FBTCxDQUFvQix5QkFBcEI7QUFEeUMsT0FBaEMsQ0FBaEI7O0FBSUFOLGNBQVEwQyxFQUFSLEdBQWE7QUFDWEMsa0JBQVVGLE9BREM7QUFFWEQsa0JBQVVBLFlBQVksQ0FGWDtBQUdYUyxnQkFBUTtBQUhHLE9BQWI7O0FBTUEsYUFBTyxNQUFNbEQsSUFBSUMsT0FBSixDQUFiO0FBWDhDO0FBWS9DOztBQUVEa0QsY0FBWXpDLE9BQVosRUFBcUIwQyxLQUFyQixFQUE0QjtBQUMxQixXQUFPLEtBQUs3QyxjQUFMLENBQXFCLGtCQUFrQjZDLE1BQU1DLEVBQUksVUFBUzNDLFFBQVFHLEtBQU0sRUFBeEUsQ0FBUDtBQUNEOztBQUVEeUMsY0FBWTVDLE9BQVosRUFBcUIwQyxLQUFyQixFQUE0QjtBQUMxQixXQUFPLEtBQUs3QyxjQUFMLENBQXFCLGtCQUFrQjZDLE1BQU1DLEVBQUksVUFBUzNDLFFBQVFHLEtBQU0sRUFBeEUsQ0FBUDtBQUNEOztBQUVEMEMsY0FBWTdDLE9BQVosRUFBcUIwQyxLQUFyQixFQUE0QjtBQUMxQixXQUFPLEtBQUs3QyxjQUFMLENBQXFCLGlCQUFpQjZDLE1BQU1DLEVBQUksVUFBUzNDLFFBQVFHLEtBQU0sRUFBdkUsQ0FBUDtBQUNEOztBQUVEMkMsa0JBQWdCOUMsT0FBaEIsRUFBeUIwQyxLQUF6QixFQUFnQztBQUM5QixXQUFPLEtBQUs3QyxjQUFMLENBQXFCLHNCQUFzQjZDLE1BQU1DLEVBQUksVUFBUzNDLFFBQVFHLEtBQU0sRUFBNUUsQ0FBUDtBQUNEOztBQUVENEMsV0FBUzdCLEdBQVQsRUFBYzhCLEVBQWQsRUFBa0I7QUFDaEIsV0FBTyx1QkFBWSxDQUFDcEMsT0FBRCxFQUFVQyxNQUFWLEtBQXFCO0FBQ3RDLFlBQU1vQyxLQUFLLHVCQUFRL0IsR0FBUixFQUFhZ0MsSUFBYixDQUFrQixhQUFHQyxpQkFBSCxDQUFxQkgsRUFBckIsQ0FBbEIsQ0FBWDtBQUNBQyxTQUFHRyxFQUFILENBQU0sT0FBTixFQUFleEMsT0FBZjtBQUNBcUMsU0FBR0csRUFBSCxDQUFNLE9BQU4sRUFBZXZDLE1BQWY7QUFDRCxLQUpNLENBQVA7QUFLRDs7QUFFS3dDLFlBQU4sQ0FBaUJyRCxPQUFqQixFQUEwQnNELElBQTFCLEVBQWdDdkIsUUFBaEMsRUFBMEN3QixRQUExQyxFQUFvRDtBQUFBOztBQUFBO0FBQ2xELFlBQU1oRSxVQUFVLFFBQUtRLGlCQUFMLENBQXVCQyxPQUF2QixFQUFnQztBQUM5Q2tCLGFBQUssUUFBS3JCLGNBQUwsQ0FBb0Isc0JBQXBCO0FBRHlDLE9BQWhDLENBQWhCOztBQUlBTixjQUFRMEMsRUFBUixHQUFhO0FBQ1h1QixpQkFBU0YsS0FBS1gsRUFESDtBQUVYVCxrQkFBVXFCLFFBRkM7QUFHWHhCLGtCQUFVQSxZQUFZO0FBSFgsT0FBYjs7QUFNQSxhQUFPLE1BQU16QyxJQUFJQyxPQUFKLENBQWI7QUFYa0Q7QUFZbkQ7O0FBRUtrRSxtQkFBTixDQUF3QnpELE9BQXhCLEVBQWlDc0QsSUFBakMsRUFBdUN2QixRQUF2QyxFQUFpRHdCLFFBQWpELEVBQTJEO0FBQUE7O0FBQUE7QUFDekQsWUFBTWhFLFVBQVUsUUFBS1EsaUJBQUwsQ0FBdUJDLE9BQXZCLEVBQWdDO0FBQzlDa0IsYUFBSyxRQUFLckIsY0FBTCxDQUFvQiw4QkFBcEI7QUFEeUMsT0FBaEMsQ0FBaEI7O0FBSUFOLGNBQVEwQyxFQUFSLEdBQWE7QUFDWHVCLGlCQUFTRixLQUFLWCxFQURIO0FBRVhULGtCQUFVcUIsUUFGQztBQUdYRyxpQkFBUyxDQUhFO0FBSVgzQixrQkFBVUEsWUFBWTtBQUpYLE9BQWI7O0FBT0EsYUFBTyxNQUFNekMsSUFBSUMsT0FBSixDQUFiO0FBWnlEO0FBYTFEO0FBMU5VOztBQTZOYixNQUFNb0UsU0FBUyxJQUFJL0QsTUFBSixFQUFmOztrQkFFZStELE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuY29uc3QgcmVxUHJvbWlzZSA9IFByb21pc2UucHJvbWlzaWZ5KHJlcXVlc3QpO1xuY29uc3QgcmVxID0gKG9wdGlvbnMpID0+IHJlcVByb21pc2Uoe2ZvcmV2ZXI6IHRydWUsIC4uLm9wdGlvbnN9KTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhlYWRlcnM6IHtcbiAgICAnVXNlci1BZ2VudCc6ICdGdWxjcnVtIFN5bmMnLFxuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbidcbiAgfVxufTtcblxuLy8gY29uc3QgYmFzZVVSTCA9ICdodHRwOi8vbG9jYWxob3N0OjMwMDAnO1xuY29uc3QgYmFzZVVSTCA9ICdodHRwczovL2FwaS5mdWxjcnVtYXBwLmNvbSc7XG4vLyBjb25zdCBiYXNlVVJMID0gJ2h0dHBzOi8vZWRnZS5mdWxjcnVtYXBwLmNvbSc7XG5cbmNsYXNzIENsaWVudCB7XG4gIHVybEZvclJlc291cmNlKHJlc291cmNlKSB7XG4gICAgcmV0dXJuICcnICsgYmFzZVVSTCArIHJlc291cmNlO1xuICB9XG5cbiAgb3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlc3VsdCA9IF8uZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG4gICAgcmVzdWx0LmhlYWRlcnNbJ1gtQXBpVG9rZW4nXSA9IGFjY291bnQudG9rZW47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGFzeW5jIGF1dGhlbnRpY2F0ZSh1c2VyTmFtZSwgcGFzc3dvcmQpIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVyaTogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi91c2Vycy5qc29uJyksXG4gICAgICBhdXRoOiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VyTmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICBzZW5kSW1tZWRpYXRlbHk6IHRydWVcbiAgICAgIH0sXG4gICAgICBoZWFkZXJzOiBkZWZhdWx0T3B0aW9ucy5oZWFkZXJzXG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXF1ZXN0KG9wdGlvbnMsIChlcnIsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldFN5bmMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS9fcHJpdmF0ZS9zeW5jLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldFJvbGVzKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvcm9sZXMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0TWVtYmVyc2hpcHMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9tZW1iZXJzaGlwcy5qc29uJylcbiAgICB9KTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRGb3JtcyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL2Zvcm1zLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldENob2ljZUxpc3RzKGFjY291bnQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zRm9yUmVxdWVzdChhY2NvdW50LCB7XG4gICAgICB1cmw6IHRoaXMudXJsRm9yUmVzb3VyY2UoJy9hcGkvdjIvY2hvaWNlX2xpc3RzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGF3YWl0IHJlcShvcHRpb25zKTtcbiAgfVxuXG4gIGFzeW5jIGdldENsYXNzaWZpY2F0aW9uU2V0cyhhY2NvdW50KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL2NsYXNzaWZpY2F0aW9uX3NldHMuanNvbicpXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UHJvamVjdHMoYWNjb3VudCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9wcm9qZWN0cy5qc29uJylcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICBjb25zb2xlLmxvZyhleCk7XG4gICAgICBjb25zb2xlLmxvZyhleC5jb2RlID09PSAnRVRJTUVET1VUJyk7XG4gICAgICBjb25zb2xlLmxvZyhleC5jb25uZWN0ID09PSB0cnVlKTtcbiAgICAgIHRocm93IGV4O1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGdldFBob3RvcyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9waG90b3MuanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0VmlkZW9zKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3ZpZGVvcy5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRBdWRpbyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9hdWRpby5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBwZXJfcGFnZTogcGVyUGFnZSxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwLFxuICAgICAgZnVsbDogJzEnXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cblxuICBhc3luYyBnZXRTaWduYXR1cmVzKGFjY291bnQsIHNlcXVlbmNlLCBwZXJQYWdlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3NpZ25hdHVyZXMuanNvbicpXG4gICAgfSk7XG5cbiAgICBvcHRpb25zLnFzID0ge1xuICAgICAgcGVyX3BhZ2U6IHBlclBhZ2UsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMCxcbiAgICAgIGZ1bGw6ICcxJ1xuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0Q2hhbmdlc2V0cyhhY2NvdW50LCBzZXF1ZW5jZSwgcGVyUGFnZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9jaGFuZ2VzZXRzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIHBlcl9wYWdlOiBwZXJQYWdlLFxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlIHx8IDAsXG4gICAgICBjb3VudHM6ICcwJ1xuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgZ2V0UGhvdG9VUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9waG90b3MvJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRWaWRlb1VSTChhY2NvdW50LCBtZWRpYSkge1xuICAgIHJldHVybiB0aGlzLnVybEZvclJlc291cmNlKGAvYXBpL3YyL3ZpZGVvcy8keyBtZWRpYS5pZCB9P3Rva2VuPSR7YWNjb3VudC50b2tlbn1gKTtcbiAgfVxuXG4gIGdldEF1ZGlvVVJMKGFjY291bnQsIG1lZGlhKSB7XG4gICAgcmV0dXJuIHRoaXMudXJsRm9yUmVzb3VyY2UoYC9hcGkvdjIvYXVkaW8vJHsgbWVkaWEuaWQgfT90b2tlbj0ke2FjY291bnQudG9rZW59YCk7XG4gIH1cblxuICBnZXRTaWduYXR1cmVVUkwoYWNjb3VudCwgbWVkaWEpIHtcbiAgICByZXR1cm4gdGhpcy51cmxGb3JSZXNvdXJjZShgL2FwaS92Mi9zaWduYXR1cmVzLyR7IG1lZGlhLmlkIH0/dG9rZW49JHthY2NvdW50LnRva2VufWApO1xuICB9XG5cbiAgZG93bmxvYWQodXJsLCB0bykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBycSA9IHJlcXVlc3QodXJsKS5waXBlKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRvKSk7XG4gICAgICBycS5vbignY2xvc2UnLCByZXNvbHZlKTtcbiAgICAgIHJxLm9uKCdlcnJvcicsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRSZWNvcmRzKGFjY291bnQsIGZvcm0sIHNlcXVlbmNlLCBwYWdlU2l6ZSkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnNGb3JSZXF1ZXN0KGFjY291bnQsIHtcbiAgICAgIHVybDogdGhpcy51cmxGb3JSZXNvdXJjZSgnL2FwaS92Mi9yZWNvcmRzLmpzb24nKVxuICAgIH0pO1xuXG4gICAgb3B0aW9ucy5xcyA9IHtcbiAgICAgIGZvcm1faWQ6IGZvcm0uaWQsXG4gICAgICBwZXJfcGFnZTogcGFnZVNpemUsXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UgfHwgMFxuICAgIH07XG5cbiAgICByZXR1cm4gYXdhaXQgcmVxKG9wdGlvbnMpO1xuICB9XG5cbiAgYXN5bmMgZ2V0UmVjb3Jkc0hpc3RvcnkoYWNjb3VudCwgZm9ybSwgc2VxdWVuY2UsIHBhZ2VTaXplKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9uc0ZvclJlcXVlc3QoYWNjb3VudCwge1xuICAgICAgdXJsOiB0aGlzLnVybEZvclJlc291cmNlKCcvYXBpL3YyL3JlY29yZHMvaGlzdG9yeS5qc29uJylcbiAgICB9KTtcblxuICAgIG9wdGlvbnMucXMgPSB7XG4gICAgICBmb3JtX2lkOiBmb3JtLmlkLFxuICAgICAgcGVyX3BhZ2U6IHBhZ2VTaXplLFxuICAgICAgZXh0ZW50czogMCxcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSB8fCAwXG4gICAgfTtcblxuICAgIHJldHVybiBhd2FpdCByZXEob3B0aW9ucyk7XG4gIH1cbn1cblxuY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=