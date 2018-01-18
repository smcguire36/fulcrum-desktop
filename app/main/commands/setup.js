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
        builder: {},
        handler: _this2.runCommand
      });
    })();
  }

};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL2NvbW1hbmRzL3NldHVwLmpzIl0sIm5hbWVzIjpbInByb21wdCIsInF1ZXN0aW9ucyIsInR5cGUiLCJuYW1lIiwibWVzc2FnZSIsImFnYWluUXVlc3Rpb24iLCJydW5Db21tYW5kIiwiZXhpdCIsImZ1bGNydW0iLCJhcmdzIiwidG9rZW4iLCJzZXR1cEFjY291bnQiLCJlbWFpbCIsInBhc3N3b3JkIiwiYW5zd2VycyIsInN1Y2Nlc3MiLCJyZXRyeSIsImFnYWluIiwicmVzdWx0cyIsImF1dGhlbnRpY2F0ZVdpdGhUb2tlbiIsImF1dGhlbnRpY2F0ZSIsInJlc3BvbnNlIiwiYm9keSIsInN0YXR1c0NvZGUiLCJ1c2VyIiwiSlNPTiIsInBhcnNlIiwiY29uc29sZSIsImxvZyIsImdyZWVuIiwiY29udGV4dCIsImNvbnRleHRzIiwiY29udGV4dEF0dHJpYnV0ZXMiLCJ1c2VyX3Jlc291cmNlX2lkIiwiaWQiLCJvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQiLCJkYiIsImFjY291bnQiLCJmaW5kT3JDcmVhdGUiLCJfb3JnYW5pemF0aW9uTmFtZSIsIl9maXJzdE5hbWUiLCJmaXJzdF9uYW1lIiwiX2xhc3ROYW1lIiwibGFzdF9uYW1lIiwiX2VtYWlsIiwiX3Rva2VuIiwiYXBpX3Rva2VuIiwic2F2ZSIsInJlZCIsInRhc2siLCJjbGkiLCJjb21tYW5kIiwiZGVzYyIsImJ1aWxkZXIiLCJoYW5kbGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBU0EsTUFBVCxDQUFnQkMsU0FBaEIsRUFBMkI7QUFDekIsU0FBTyxtQkFBU0QsTUFBVCxDQUFnQkMsU0FBaEIsQ0FBUDtBQUNEOztBQUVELE1BQU1BLFlBQVksQ0FDaEI7QUFDRUMsUUFBTSxPQURSO0FBRUVDLFFBQU0sT0FGUjtBQUdFQyxXQUFTO0FBSFgsQ0FEZ0IsRUFLYjtBQUNERixRQUFNLFVBREw7QUFFREUsV0FB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LFNBM0JELE1BMkJPO0FBQ0x3QixrQkFBUUMsR0FBUixDQUFZLGlDQUFpQ29CLEdBQTdDO0FBQ0Q7O0FBRUQsZUFBTyxLQUFQO0FBQ0QsT0EvRWtCOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ2JDLE1BQU4sQ0FBV0MsR0FBWCxFQUFnQjtBQUFBOztBQUFBO0FBQ2QsYUFBT0EsSUFBSUMsT0FBSixDQUFZO0FBQ2pCQSxpQkFBUyxPQURRO0FBRWpCQyxjQUFNLGtDQUZXO0FBR2pCQyxpQkFBUyxFQUhRO0FBSWpCQyxpQkFBUyxPQUFLaEQ7QUFKRyxPQUFaLENBQVA7QUFEYztBQU9mOztBQVJrQixDIiwiZmlsZSI6InNldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdjb2xvcnMnO1xuaW1wb3J0IGlucXVpcmVyIGZyb20gJ2lucXVpcmVyJztcbmltcG9ydCBBY2NvdW50IGZyb20gJy4uL21vZGVscy9hY2NvdW50JztcbmltcG9ydCBDbGllbnQgZnJvbSAnLi4vYXBpL2NsaWVudCc7XG5cbmZ1bmN0aW9uIHByb21wdChxdWVzdGlvbnMpIHtcbiAgcmV0dXJuIGlucXVpcmVyLnByb21wdChxdWVzdGlvbnMpO1xufVxuXG5jb25zdCBxdWVzdGlvbnMgPSBbXG4gIHtcbiAgICB0eXBlOiAnaW5wdXQnLFxuICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgbWVzc2FnZTogJ0VudGVyIHlvdXIgRnVsY3J1bSBlbWFpbCBhZGRyZXNzJ1xuICB9LCB7XG4gICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICBtZXNzYWdlOiAnRW50ZXIgeW91ciBGdWxjcnVtIHBhc3N3b3JkJyxcbiAgICBuYW1lOiAncGFzc3dvcmQnXG4gIH1cbl07XG5cbmNvbnN0IGFnYWluUXVlc3Rpb24gPSB7XG4gIHR5cGU6ICdjb25maXJtJyxcbiAgbmFtZTogJ2FnYWluJyxcbiAgbWVzc2FnZTogJ1RyeSBhZ2Fpbj8gKGp1c3QgaGl0IGVudGVyIGZvciBZRVMpJyxcbiAgJ2RlZmF1bHQnOiB0cnVlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gIGFzeW5jIHRhc2soY2xpKSB7XG4gICAgcmV0dXJuIGNsaS5jb21tYW5kKHtcbiAgICAgIGNvbW1hbmQ6ICdzZXR1cCcsXG4gICAgICBkZXNjOiAnc2V0dXAgdGhlIGxvY2FsIGZ1bGNydW0gZGF0YWJhc2UnLFxuICAgICAgYnVpbGRlcjoge30sXG4gICAgICBoYW5kbGVyOiB0aGlzLnJ1bkNvbW1hbmRcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bkNvbW1hbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgbGV0IGV4aXQgPSBmYWxzZTtcblxuICAgIHdoaWxlICghZXhpdCkge1xuICAgICAgaWYgKGZ1bGNydW0uYXJncy50b2tlbikge1xuICAgICAgICBhd2FpdCB0aGlzLnNldHVwQWNjb3VudCh7dG9rZW46IGZ1bGNydW0uYXJncy50b2tlbn0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChmdWxjcnVtLmFyZ3MuZW1haWwgJiYgZnVsY3J1bS5hcmdzLnBhc3N3b3JkKSB7XG4gICAgICAgIGF3YWl0IHRoaXMuc2V0dXBBY2NvdW50KHtlbWFpbDogZnVsY3J1bS5hcmdzLmVtYWlsLCBwYXNzd29yZDogZnVsY3J1bS5hcmdzLnBhc3N3b3JkfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IHByb21wdChxdWVzdGlvbnMpO1xuXG4gICAgICBjb25zdCBzdWNjZXNzID0gYXdhaXQgdGhpcy5zZXR1cEFjY291bnQoe2VtYWlsOiBhbnN3ZXJzLmVtYWlsLCBwYXNzd29yZDogYW5zd2Vycy5wYXNzd29yZH0pO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBleGl0ID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCByZXRyeSA9IGF3YWl0IHByb21wdChhZ2FpblF1ZXN0aW9uKTtcblxuICAgICAgICBpZiAoIXJldHJ5LmFnYWluKSB7XG4gICAgICAgICAgZXhpdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXR1cEFjY291bnQgPSBhc3luYyAoe2VtYWlsLCBwYXNzd29yZCwgdG9rZW59KSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyA9IHRva2VuID8gYXdhaXQgQ2xpZW50LmF1dGhlbnRpY2F0ZVdpdGhUb2tlbih0b2tlbilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBhd2FpdCBDbGllbnQuYXV0aGVudGljYXRlKGVtYWlsLCBwYXNzd29yZCk7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IHJlc3VsdHM7XG4gICAgY29uc3QgYm9keSA9IHJlc3VsdHMuYm9keTtcblxuICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgIGNvbnN0IHVzZXIgPSBKU09OLnBhcnNlKGJvZHkpLnVzZXI7XG5cbiAgICAgIGNvbnNvbGUubG9nKCgnU3VjY2Vzc2Z1bGx5IGF1dGhlbnRpY2F0ZWQgd2l0aCAnICsgdXNlci5lbWFpbCkuZ3JlZW4pO1xuXG4gICAgICBmb3IgKGxldCBjb250ZXh0IG9mIHVzZXIuY29udGV4dHMpIHtcbiAgICAgICAgY29uc3QgY29udGV4dEF0dHJpYnV0ZXMgPSB7XG4gICAgICAgICAgdXNlcl9yZXNvdXJjZV9pZDogdXNlci5pZCxcbiAgICAgICAgICBvcmdhbml6YXRpb25fcmVzb3VyY2VfaWQ6IGNvbnRleHQuaWRcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkYiA9IGZ1bGNydW0uZGI7XG5cbiAgICAgICAgY29uc3QgYWNjb3VudCA9IGF3YWl0IEFjY291bnQuZmluZE9yQ3JlYXRlKGRiLCBjb250ZXh0QXR0cmlidXRlcyk7XG5cbiAgICAgICAgYWNjb3VudC5fb3JnYW5pemF0aW9uTmFtZSA9IGNvbnRleHQubmFtZTtcbiAgICAgICAgYWNjb3VudC5fZmlyc3ROYW1lID0gdXNlci5maXJzdF9uYW1lO1xuICAgICAgICBhY2NvdW50Ll9sYXN0TmFtZSA9IHVzZXIubGFzdF9uYW1lO1xuICAgICAgICBhY2NvdW50Ll9lbWFpbCA9IHVzZXIuZW1haWw7XG4gICAgICAgIGFjY291bnQuX3Rva2VuID0gY29udGV4dC5hcGlfdG9rZW47XG5cbiAgICAgICAgYXdhaXQgYWNjb3VudC5zYXZlKCk7XG5cbiAgICAgICAgY29uc29sZS5sb2coJ+KckycuZ3JlZW4sIGNvbnRleHQubmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnVXNlcm5hbWUgb3IgcGFzc3dvcmQgaW5jb3JyZWN0Jy5yZWQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19