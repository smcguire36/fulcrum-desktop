import request from 'request';
import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';

const req = Promise.promisify(request);

const defaultOptions = {
  headers: {
    'User-Agent': 'Fulcrum Sync',
    'Accept': 'application/json'
  }
};

// const baseURL = 'http://localhost:3000/api/v2/';
const baseURL = 'https://api.fulcrumapp.com/api/v2/';

export default class Client {
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
      uri: this.urlForResource('users'),
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

  async getForms(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('forms')
    });

    return await req(options);
  }

  async getChoiceLists(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('choice_lists')
    });

    return await req(options);
  }

  async getClassificationSets(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('classification_sets')
    });

    return await req(options);
  }

  async getProjects(account) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('projects')
    });

    return await req(options);
  }

  async getPhotos(account, form, page) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('photos')
    });

    options.qs = {
      per_page: 1000,
      page: page,
      full: '1'
    };

    if (form) {
      options.qs.form_id = form.resourceID;
    }

    return await req(options);
  }

  async getVideos(account, form, page) {
    const options = this.optionsForRequest(account, {
      url: this.urlForResource('videos')
    });

    options.qs = {
      per_page: 1000,
      page: page,
      full: '1'
    };

    if (form) {
      options.qs.form_id = form.resourceID;
    }

    return await req(options);
  }

  download(url, to) {
    return new Promise((resolve, reject) => {
      const rq = request(url).pipe(fs.createWriteStream(to));
      rq.on('close', resolve);
      rq.on('error', reject);
    });
  }

  async getRecords(account, form, page) {
    const options = this.optionsForRequest(account, {
      // url: this.urlForResource('records/history')
      url: this.urlForResource('records')
    });

    options.qs = {
      form_id: form.resourceID,
      per_page: 1000,
      page: page
    };

    return await req(options);
  }
}

const client = new Client();

export default client;
