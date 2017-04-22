import Command from './command';
import 'colors';
import inquirer from 'inquirer';
import Account from '../models/account';
import Client from '../api/client';

function prompt(questions) {
  return inquirer.prompt(questions);
}

const questions = [
  {
    type: 'input',
    name: 'email',
    message: 'Enter your Fulcrum email address'
  }, {
    type: 'password',
    message: 'Enter your Fulcrum password',
    name: 'password'
  }
];

const againQuestion = {
  type: 'confirm',
  name: 'again',
  message: 'Try again? (just hit enter for YES)',
  'default': true
};

class Setup extends Command {
  async run() {
    let exit = false;

    while (!exit) {
      const answers = await prompt(questions);

      const results = await Client.authenticate(answers.email, answers.password);
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

          const db = this.db;

          const account = await Account.findOrCreate(db, contextAttributes);

          account._organizationName = context.name;
          account._firstName = user.first_name;
          account._lastName = user.last_name;
          account._email = user.email;
          account._token = context.api_token;

          await account.save();

          console.log('✓'.green, context.name);

          exit = true;
        }
      } else {
        console.log('Username or password incorrect'.red);

        let retry = await prompt(againQuestion);

        if (!retry.again) {
          exit = true;
        }
      }
    }
  }
}

new Setup().start();
