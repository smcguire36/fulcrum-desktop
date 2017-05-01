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

export default class {
  async task(cli) {
    return cli.command({
      command: 'setup',
      desc: 'setup the local fulcrum database',
      builder: {},
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    let exit = false;

    while (!exit) {
      if (fulcrum.args.email && fulcrum.args.password) {
        await this.setupAccount(fulcrum.args.email, fulcrum.args.password);
        return;
      }

      const answers = await prompt(questions);

      const success = await this.setupAccount(answers.email, answers.password);

      if (success) {
        exit = true;
      } else {
        let retry = await prompt(againQuestion);

        if (!retry.again) {
          exit = true;
        }
      }
    }
  }

  setupAccount = async (email, password) => {
    const results = await Client.authenticate(email, password);
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

        const account = await Account.findOrCreate(db, contextAttributes);

        account._organizationName = context.name;
        account._firstName = user.first_name;
        account._lastName = user.last_name;
        account._email = user.email;
        account._token = context.api_token;

        await account.save();

        console.log('✓'.green, context.name);
      }

      return true;
    } else {
      console.log('Username or password incorrect'.red);
    }

    return false;
  }
}
