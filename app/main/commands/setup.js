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
        if (fulcrum.args.token) {
          yield _this.setupAccount({ token: fulcrum.args.token });
          return;
        }

        if (fulcrum.args.email && fulcrum.args.password) {
          yield _this.setupAccount({ email: fulcrum.args.email, password: fulcrum.args.password });
          return;
        }

        const answers = yield prompt(questions);

        const success = yield _this.setupAccount({ email: answers.email, password: answers.password });

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
      var _ref2 = _asyncToGenerator(function* ({ email, password, token }) {
        const results = token ? yield _client2.default.authenticateWithToken(token) : yield _client2.default.authenticate(email, password);

        const response = results;
        const body = results.body;

        if (response.statusCode === 200) {
          const user = JSON.parse(body).user;

          console.log(('Successfully authenticated with ' + user.email).green);

          const context = user.contexts.find(function (o) {
            return o.name === fulcrum.args.org;
          });

          if (!context) {
            console.error(`Organization ${fulcrum.args.org} not found for this account.`.red);
            return false;
          }

          const isOwner = context.role.name === 'Owner' && context.role.is_system;

          if (!isOwner) {
            console.error(`This account is not an owner of ${fulcrum.args.org}. You must be an account owner to use Fulcrum Desktop.`.red);
            return false;
          }

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

          return true;
        } else {
          console.log('Username or password incorrect'.red);
        }

        return false;
      });

      return function (_x) {
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
        builder: {
          org: {
            desc: 'organization name',
            required: true,
            type: 'string'
          }
        },
        handler: _this2.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3NldHVwLmpzIl0sIm5hbWVzIjpbInByb21wdCIsInF1ZXN0aW9ucyIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImFnYWluUXVlc3Rpb24iLCJydW5Db21tYW5kIiwiZXhpdCIsImZ1bGNydW0iLCJhcmdzIiwidG9rZW4iLCJzZXR1cEFjY291bnQiLCJlbWFpbCIsInBhc3N3b3JkIiwiYW5zd2VycyIsInN1Y2Nlc3MiLCJyZXRyeSIsImFnYWluIiwicmVzdWx0cyIsImF1dGhlbnRpY2F0ZVdpdGhUb2tlbiIsImF1dGhlbnRpY2F0ZSIsInJlc3BvbnNlIiwiYm9keSIsInN0YXR1c0NvZGUiLCJ1c2VyIiwiSlNPTiIsInBhcnNlIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwiY29udGV4dCIsImNvbnRleHRzIiwiZmluZCIsIm8iLCJvcmciLCJlcnJvciIsInJlZCIsImlzT3duZXIiLCJyb2xlIiwiaXNfc3lzdGVtIiwiY29udGV4dEF0dHJpYnV0ZXMiLCJ1c2VyX3Jlc291cmNlX2lkIiwiaWQiLCJvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQiLCJkYiIsImFjY291bnQiLCJmaW5kT3JDcmVhdGUiLCJfb3JnYW5pemF0aW9uTmFtZSIsIl9maXJzdE5hbWUiLCJmaXJzdF9uYW1lIiwiX2xhc3ROYW1lIiwibGFzdF9uYW1lIiwiX2VtYWlsIiwiX3Rva2VuIiwiYXBpX3Rva2VuIiwic2F2ZSIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJyZXF1aXJlZCIsImhhbmRsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxTQUFTQSxNQUFULENBQWdCQyxTQUFoQixFQUEyQjtBQUN6QixTQUFPLG1CQUFTRCxNQUFULENBQWdCQyxTQUFoQixDQUFQO0FBQ0Q7O0FBRUQsTUFBTUEsWUFBWSxDQUNoQjtBQUNFQyxRQUFNLE9BRFI7QUFF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IGZyb20gJ2lucXVpcmVyJztcclxuaW1wb3J0IEFjY291bnQgZnJvbSAnLi4vbW9kZWxzL2FjY291bnQnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL2FwaS9jbGllbnQnO1xyXG5cclxuZnVuY3Rpb24gcHJvbXB0KHF1ZXN0aW9ucykge1xyXG4gIHJldHVybiBpbnF1aXJlci5wcm9tcHQocXVlc3Rpb25zKTtcclxufVxyXG5cclxuY29uc3QgcXVlc3Rpb25zID0gW1xyXG4gIHtcclxuICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICBuYW1lOiAnZW1haWwnLFxyXG4gICAgbWVzc2FnZTogJ0VudGVyIHlvdXIgRnVsY3J1bSBlbWFpbCBhZGRyZXNzJ1xyXG4gIH0sIHtcclxuICAgIHR5cGU6ICdwYXNzd29yZCcsXHJcbiAgICBtZXNzYWdlOiAnRW50ZXIgeW91ciBGdWxjcnVtIHBhc3N3b3JkJyxcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICB9XHJcbl07XHJcblxyXG5jb25zdCBhZ2FpblF1ZXN0aW9uID0ge1xyXG4gIHR5cGU6ICdjb25maXJtJyxcclxuICBuYW1lOiAnYWdhaW4nLFxyXG4gIG1lc3NhZ2U6ICdUcnkgYWdhaW4/IChqdXN0IGhpdCBlbnRlciBmb3IgWUVTKScsXHJcbiAgJ2RlZmF1bHQnOiB0cnVlXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XHJcbiAgYXN5bmMgdGFzayhjbGkpIHtcclxuICAgIHJldHVybiBjbGkuY29tbWFuZCh7XHJcbiAgICAgIGNvbW1hbmQ6ICdzZXR1cCcsXHJcbiAgICAgIGRlc2M6ICdzZXR1cCB0aGUgbG9jYWwgZnVsY3J1bSBkYXRhYmFzZScsXHJcbiAgICAgIGJ1aWxkZXI6IHtcclxuICAgICAgICBvcmc6IHtcclxuICAgICAgICAgIGRlc2M6ICdvcmdhbml6YXRpb24gbmFtZScsXHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcnVuQ29tbWFuZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGxldCBleGl0ID0gZmFsc2U7XHJcblxyXG4gICAgd2hpbGUgKCFleGl0KSB7XHJcbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MudG9rZW4pIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudCh7dG9rZW46IGZ1bGNydW0uYXJncy50b2tlbn0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGZ1bGNydW0uYXJncy5lbWFpbCAmJiBmdWxjcnVtLmFyZ3MucGFzc3dvcmQpIHtcclxuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudCh7ZW1haWw6IGZ1bGNydW0uYXJncy5lbWFpbCwgcGFzc3dvcmQ6IGZ1bGNydW0uYXJncy5wYXNzd29yZH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IHByb21wdChxdWVzdGlvbnMpO1xyXG5cclxuICAgICAgY29uc3Qgc3VjY2VzcyA9IGF3YWl0IHRoaXMuc2V0dXBBY2NvdW50KHtlbWFpbDogYW5zd2Vycy5lbWFpbCwgcGFzc3dvcmQ6IGFuc3dlcnMucGFzc3dvcmR9KTtcclxuXHJcbiAgICAgIGlmIChzdWNjZXNzKSB7XHJcbiAgICAgICAgZXhpdCA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGV0IHJldHJ5ID0gYXdhaXQgcHJvbXB0KGFnYWluUXVlc3Rpb24pO1xyXG5cclxuICAgICAgICBpZiAoIXJldHJ5LmFnYWluKSB7XHJcbiAgICAgICAgICBleGl0ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldHVwQWNjb3VudCA9IGFzeW5jICh7ZW1haWwsIHBhc3N3b3JkLCB0b2tlbn0pID0+IHtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSB0b2tlbiA/IGF3YWl0IENsaWVudC5hdXRoZW50aWNhdGVXaXRoVG9rZW4odG9rZW4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhd2FpdCBDbGllbnQuYXV0aGVudGljYXRlKGVtYWlsLCBwYXNzd29yZCk7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSByZXN1bHRzO1xyXG4gICAgY29uc3QgYm9keSA9IHJlc3VsdHMuYm9keTtcclxuXHJcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XHJcbiAgICAgIGNvbnN0IHVzZXIgPSBKU09OLnBhcnNlKGJvZHkpLnVzZXI7XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygoJ1N1Y2Nlc3NmdWxseSBhdXRoZW50aWNhdGVkIHdpdGggJyArIHVzZXIuZW1haWwpLmdyZWVuKTtcclxuXHJcbiAgICAgIGNvbnN0IGNvbnRleHQgPSB1c2VyLmNvbnRleHRzLmZpbmQobyA9PiBvLm5hbWUgPT09IGZ1bGNydW0uYXJncy5vcmcpO1xyXG5cclxuICAgICAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgT3JnYW5pemF0aW9uICR7IGZ1bGNydW0uYXJncy5vcmcgfSBub3QgZm91bmQgZm9yIHRoaXMgYWNjb3VudC5gLnJlZCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBpc093bmVyID0gY29udGV4dC5yb2xlLm5hbWUgPT09ICdPd25lcicgJiYgY29udGV4dC5yb2xlLmlzX3N5c3RlbTtcclxuXHJcbiAgICAgIGlmICghaXNPd25lcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFRoaXMgYWNjb3VudCBpcyBub3QgYW4gb3duZXIgb2YgJHsgZnVsY3J1bS5hcmdzLm9yZyB9LiBZb3UgbXVzdCBiZSBhbiBhY2NvdW50IG93bmVyIHRvIHVzZSBGdWxjcnVtIERlc2t0b3AuYC5yZWQpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgY29udGV4dEF0dHJpYnV0ZXMgPSB7XHJcbiAgICAgICAgdXNlcl9yZXNvdXJjZV9pZDogdXNlci5pZCxcclxuICAgICAgICBvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQ6IGNvbnRleHQuaWRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnN0IGRiID0gZnVsY3J1bS5kYjtcclxuXHJcbiAgICAgIGNvbnN0IGFjY291bnQgPSBhd2FpdCBBY2NvdW50LmZpbmRPckNyZWF0ZShkYiwgY29udGV4dEF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgYWNjb3VudC5fb3JnYW5pemF0aW9uTmFtZSA9IGNvbnRleHQubmFtZTtcclxuICAgICAgYWNjb3VudC5fZmlyc3ROYW1lID0gdXNlci5maXJzdF9uYW1lO1xyXG4gICAgICBhY2NvdW50Ll9sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xyXG4gICAgICBhY2NvdW50Ll9lbWFpbCA9IHVzZXIuZW1haWw7XHJcbiAgICAgIGFjY291bnQuX3Rva2VuID0gY29udGV4dC5hcGlfdG9rZW47XHJcblxyXG4gICAgICBhd2FpdCBhY2NvdW50LnNhdmUoKTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCfinJMnLmdyZWVuLCBjb250ZXh0Lm5hbWUpO1xyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnVXNlcm5hbWUgb3IgcGFzc3dvcmQgaW5jb3JyZWN0Jy5yZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuIl19