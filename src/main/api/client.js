import request from 'request';
import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';

const reqPromise = Promise.promisify(request);
const req = (options) => reqPromise({forever: true, ...options});

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
    const result = _.extend({}, defaultOptions, options);
    result.headers['X-ApiToken'] = account.token;
    return result;
  }

  async authenticate(userName, password) {
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

    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(response);
        }
      });
    });
  }

  async getSync(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/_private/sync.json')
    });

    return await req(options);
  }

  async getRoles(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/roles.json')
    });

    return await req(options);
  }

  async getMemberships(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/memberships.json')
    });

    return await req(options);
  }

  async getForms(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/forms.json')
    });

    return await req(options);
  }

  async getChoiceLists(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/choice_lists.json')
    });

    return await req(options);
  }

  async getClassificationSets(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/classification_sets.json')
    });

    return await req(options);
  }

  async getProjects(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/projects.json')
    });

    try {
      return await req(options);
    } catch (ex) {
      console.log(ex);
      console.log(ex.code === 'ETIMEDOUT');
      console.log(ex.connect === true);
      throw ex;
    }
  }

  async getPhotos(account, sequence, perPage) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/photos.json')
    });

    options.qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return await req(options);
  }

  async getVideos(account, sequence, perPage) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/videos.json')
    });

    options.qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return await req(options);
  }

  async getAudio(account, sequence, perPage) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/audio.json')
    });

    options.qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return await req(options);
  }

  async getSignatures(account, sequence, perPage) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/signatures.json')
    });

    options.qs = {
      per_page: perPage,
      sequence: sequence || 0,
      full: '1'
    };

    return await req(options);
  }

  async getChangesets(account, sequence, perPage) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/changesets.json')
    });

    options.qs = {
      per_page: perPage,
      sequence: sequence || 0,
      counts: '0'
    };

    return await req(options);
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
    return this.urlForResource(`/api/v2/photos/${ media.id }?token=${account.token}`);
  }

  getVideoURL(account, media) {
    return this.urlForResource(`/api/v2/videos/${ media.id }?token=${account.token}`);
  }

  getAudioURL(account, media) {
    return this.urlForResource(`/api/v2/audio/${ media.id }?token=${account.token}`);
  }

  getSignatureURL(account, media) {
    return this.urlForResource(`/api/v2/signatures/${ media.id }?token=${account.token}`);
  }

  download(url, to) {
    return new Promise((resolve, reject) => {
      const rq = request(url).pipe(fs.createWriteStream(to));
      rq.on('close', () => resolve(rq));
      rq.on('error', reject);
    });
  }

  async getRecords(account, form, sequence, pageSize) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/records.json')
    });

    options.qs = {
      form_id: form.id,
      per_page: pageSize,
      sequence: sequence || 0
    };

    return await req(options);
  }

  async getRecordsHistory(account, form, sequence, pageSize) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('/api/v2/records/history.json')
    });

    options.qs = {
      form_id: form.id,
      per_page: pageSize,
      extents: 0,
      sequence: sequence || 0
    };

    return await req(options);
  }
}

const client = new Client();

export default client;
