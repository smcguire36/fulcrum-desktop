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
    var _this = this;

    this.runCommand = _asyncToGenerator(function* () {
      let exit = false;

      while (!exit) {
        if (fulcrum.args.email && fulcrum.args.password) {
          yield _this.setupAccount(fulcrum.args.email, fulcrum.args.password);
          return;
        }

        const answers = yield prompt(questions);

        const success = yield _this.setupAccount(answers.email, answers.password);

        if (success) {
          exit = true;
        } else {
          let retry = yield prompt(againQuestion);

          if (!retry.again) {
            exit = true;
          }
        }
      }
    });

    this.setupAccount = (() => {
      var _ref2 = _asyncToGenerator(function* (email, password) {
        const results = yield _client2.default.authenticate(email, password);
        const response = results;
        const body = results.body;

        if (response.statusCode === 200) {
          console.log(('Successfully authenticated with ' + email).green);

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
          }

          return true;
        } else {
          console.log('Username or password incorrect'.red);
        }

        return false;
      });

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })();
  }

  task(cli) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return cli.command({
        command: 'setup',
        desc: 'setup the local fulcrum database',
        builder: {},
        handler: _this2.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3NldHVwLmpzIl0sIm5hbWVzIjpbInByb21wdCIsInF1ZXN0aW9ucyIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImFnYWluUXVlc3Rpb24iLCJydW5Db21tYW5kIiwiZXhpdCIsImZ1bGNydW0iLCJhcmdzIiwiZW1haWwiLCJwYXNzd29yZCIsInNldHVwQWNjb3VudCIsImFuc3dlcnMiLCJzdWNjZXNzIiwicmV0cnkiLCJhZ2FpbiIsInJlc3VsdHMiLCJhdXRoZW50aWNhdGUiLCJyZXNwb25zZSIsImJvZHkiLCJzdGF0dXNDb2RlIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwidXNlciIsIkpTT04iLCJwYXJzZSIsImNvbnRleHQiLCJjb250ZXh0cyIsImNvbnRleHRBdHRyaWJ1dGVzIiwidXNlcl9yZXNvdXJjZV9pZCIsImlkIiwib3JnYW5pemF0aW9uX3Jlc291cmNlX2lkIiwiZGIiLCJhY2NvdW50IiwiZmluZE9yQ3JlYXRlIiwiX29yZ2FuaXphdGlvbk5hbWUiLCJfZmlyc3ROYW1lIiwiZmlyc3RfbmFtZSIsIl9sYXN0TmFtZSIsImxhc3RfbmFtZSIsIl9lbWFpbCIsIl90b2tlbiIsImFwaV90b2tlbiIsInNhdmUiLCJyZWQiLCJ0YXNrIiwiY2xpIiwiY29tbWFuZCIsImRlc2MiLCJidWlsZGVyIiwiaGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLFNBQVNBLE1BQVQsQ0FBZ0JDLFNBQWhCLEVBQTJCO0FBQ3pCLFNBQU8sbUJBQVNELE1BQVQsQ0FBZ0JDLFNBQWhCLENBQVA7QUFDRDs7QUFFRCxNQUFNQSxZQUFZLENBQ2hCO0FBQ0VDLFFBQU0sT0FEUjtBQUVFQyxRQUFNLE9BRlI7QUFHRUMsV0FBUztBQUhYLENBRGdCLEVBS2I7QUFDREYsUUFBTSxVQURMO0FBRURFLFdBQVMsNkJBRlI7QUFHREQsUUFBTTtBQUhMLENBTGEsQ0FB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LCJmaWxlIjoic2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2NvbG9ycyc7XG5pbXBvcnQgaW5xdWlyZXIgZnJvbSAnaW5xdWlyZXInO1xuaW1wb3J0IEFjY291bnQgZnJvbSAnLi4vbW9kZWxzL2FjY291bnQnO1xuaW1wb3J0IENsaWVudCBmcm9tICcuLi9hcGkvY2xpZW50JztcblxuZnVuY3Rpb24gcHJvbXB0KHF1ZXN0aW9ucykge1xuICByZXR1cm4gaW5xdWlyZXIucHJvbXB0KHF1ZXN0aW9ucyk7XG59XG5cbmNvbnN0IHF1ZXN0aW9ucyA9IFtcbiAge1xuICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgbmFtZTogJ2VtYWlsJyxcbiAgICBtZXNzYWdlOiAnRW50ZXIgeW91ciBGdWxjcnVtIGVtYWlsIGFkZHJlc3MnXG4gIH0sIHtcbiAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgIG1lc3NhZ2U6ICdFbnRlciB5b3VyIEZ1bGNydW0gcGFzc3dvcmQnLFxuICAgIG5hbWU6ICdwYXNzd29yZCdcbiAgfVxuXTtcblxuY29uc3QgYWdhaW5RdWVzdGlvbiA9IHtcbiAgdHlwZTogJ2NvbmZpcm0nLFxuICBuYW1lOiAnYWdhaW4nLFxuICBtZXNzYWdlOiAnVHJ5IGFnYWluPyAoanVzdCBoaXQgZW50ZXIgZm9yIFlFUyknLFxuICAnZGVmYXVsdCc6IHRydWVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgYXN5bmMgdGFzayhjbGkpIHtcbiAgICByZXR1cm4gY2xpLmNvbW1hbmQoe1xuICAgICAgY29tbWFuZDogJ3NldHVwJyxcbiAgICAgIGRlc2M6ICdzZXR1cCB0aGUgbG9jYWwgZnVsY3J1bSBkYXRhYmFzZScsXG4gICAgICBidWlsZGVyOiB7fSxcbiAgICAgIGhhbmRsZXI6IHRoaXMucnVuQ29tbWFuZFxuICAgIH0pO1xuICB9XG5cbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcbiAgICBsZXQgZXhpdCA9IGZhbHNlO1xuXG4gICAgd2hpbGUgKCFleGl0KSB7XG4gICAgICBpZiAoZnVsY3J1bS5hcmdzLmVtYWlsICYmIGZ1bGNydW0uYXJncy5wYXNzd29yZCkge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudChmdWxjcnVtLmFyZ3MuZW1haWwsIGZ1bGNydW0uYXJncy5wYXNzd29yZCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IHByb21wdChxdWVzdGlvbnMpO1xuXG4gICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQgdGhpcy5zZXR1cEFjY291bnQoYW5zd2Vycy5lbWFpbCwgYW5zd2Vycy5wYXNzd29yZCk7XG5cbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIGV4aXQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHJldHJ5ID0gYXdhaXQgcHJvbXB0KGFnYWluUXVlc3Rpb24pO1xuXG4gICAgICAgIGlmICghcmV0cnkuYWdhaW4pIHtcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldHVwQWNjb3VudCA9IGFzeW5jIChlbWFpbCwgcGFzc3dvcmQpID0+IHtcbiAgICBjb25zdCByZXN1bHRzID0gYXdhaXQgQ2xpZW50LmF1dGhlbnRpY2F0ZShlbWFpbCwgcGFzc3dvcmQpO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzdWx0cztcbiAgICBjb25zdCBib2R5ID0gcmVzdWx0cy5ib2R5O1xuXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgY29uc29sZS5sb2coKCdTdWNjZXNzZnVsbHkgYXV0aGVudGljYXRlZCB3aXRoICcgKyBlbWFpbCkuZ3JlZW4pO1xuXG4gICAgICBjb25zdCB1c2VyID0gSlNPTi5wYXJzZShib2R5KS51c2VyO1xuXG4gICAgICBmb3IgKGxldCBjb250ZXh0IG9mIHVzZXIuY29udGV4dHMpIHtcbiAgICAgICAgY29uc3QgY29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgICAgdXNlcl9yZXNvdXJjZV9pZDogdXNlci5pZCxcbiAgICAgICAgICBvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQ6IGNvbnRleHQuaWRcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkYiA9IGZ1bGNydW0uZGI7XG5cbiAgICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9yQ3JlYXRlKGRiLCBjb250ZXh0QXR0cmlidXRlcyk7XG5cbiAgICAgICAgYWNjb3VudC5fb3JnYW5pemF0aW9uTmFtZSA9IGNvbnRleHQubmFtZTtcbiAgICAgICAgYWNjb3VudC5fZmlyc3ROYW1lID0gdXNlci5maXJzdF9uYW1lO1xuICAgICAgICBhY2NvdW50Ll9sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgICAgICBhY2NvdW50Ll9lbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgICAgIGFjY291bnQuX3Rva2VuID0gY29udGV4dC5hcGlfdG9rZW47XG5cbiAgICAgICAgYXdhaXQgYWNjb3VudC5zYXZlKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ+KckycuZ3JlZW4sIGNvbnRleHQubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnVXNlcm5hbWUgb3IgcGFzc3dvcmQgaW5jb3JyZWN0Jy5yZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19