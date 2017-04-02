'use strict';

let setup = (() => {
  var _ref = _asyncToGenerator(function* () {
    let exit = false;

    while (!exit) {
      const answers = yield prompt(questions);

      const config = { type: answers.database };

      _fs2.default.writeFileSync(_path2.default.join('data', 'config.json'), JSON.stringify(config, null, 2));

      db = yield (0, _database2.default)({ type: answers.database });

      const results = yield _client2.default.authenticate(answers.email, answers.password);
      const response = results;
      const body = results.body;

      if (response.statusCode === 200) {
        console.log(('Successfully authenticated with ' + answers.email).green);
        const user = JSON.parse(body).user;

        for (let context of user.contexts) {
          const contextAttributes = {
            user_resource_id: user.id,
            organization_resource_id: context.id
          };

          const account = yield _account2.default.findOrCreate(db, contextAttributes);

          account._organizationName = context.name;
          account._firstName = user.first_name;
          account._lastName = user.last_name;
          account._email = user.email;
          account._token = context.api_token;

          yield account.save();

          console.log('✓'.green, context.name);
        }
        return user;
      } else {
        console.log('Username or password incorrect'.red);

        let retry = yield prompt(againQuestion);

        if (!retry.again) {
          exit = true;
        }
      }
    }

    return null;
  });

  return function setup() {
    return _ref.apply(this, arguments);
  };
})();

require('colors');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _database = require('../db/database');

var _database2 = _interopRequireDefault(_database);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _client = require('../api/client');

var _client2 = _interopRequireDefault(_client);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bluebird2.default.longStackTraces();

function prompt(questions) {
  return _inquirer2.default.prompt(questions);
}

const questions = [{
  type: 'input',
  name: 'email',
  message: 'Enter your Fulcrum email address'
}, {
  type: 'password',
  message: 'Enter your Fulcrum password',
  name: 'password'
}, {
  type: 'list',
  message: 'Select database type',
  choices: ['SQLite', 'PostgreSQL'],
  default: 'SQLite',
  name: 'database'
}];

const againQuestion = {
  type: 'confirm',
  name: 'again',
  message: 'Try again? (just hit enter for YES)',
  'default': true
};

let db = null;

function onerror(err) {
  console.log('ERROR!', err);

  if (db) {
    db.close();
  }

  console.error(err.stack);

  throw err;
}

setup().then(function (result) {
  if (db) {
    db.close();
  }
}).catch(onerror);
//# sourceMappingURL=setup.js.map