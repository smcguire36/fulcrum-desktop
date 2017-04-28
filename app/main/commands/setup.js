'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('colors');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

var _client = require('../api/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
}];

const againQuestion = {
  type: 'confirm',
  name: 'again',
  message: 'Try again? (just hit enter for YES)',
  'default': true
};

exports.default = class {
  constructor() {
    this.runCommand = _asyncToGenerator(function* () {
      let exit = false;

      while (!exit) {
        const answers = yield prompt(questions);

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

            const db = fulcrum.db;

            const account = yield _account2.default.findOrCreate(db, contextAttributes);

            account._organizationName = context.name;
            account._firstName = user.first_name;
            account._lastName = user.last_name;
            account._email = user.email;
            account._token = context.api_token;

            yield account.save();

            console.log('✓'.green, context.name);

            exit = true;
          }
        } else {
          console.log('Username or password incorrect'.red);

          let retry = yield prompt(againQuestion);

          if (!retry.again) {
            exit = true;
          }
        }
      }
    });
  }

  task(cli) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'setup',
        desc: 'setup the local fulcrum database',
        builder: {},
        handler: _this.runCommand
      });
    })();
  }

};
//# sourceMappingURL=setup.js.map