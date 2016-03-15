import 'colors';
import inquirer from 'inquirer';
import Account from './models/account';
import database from './db/database';

import Client from './api/client';

import Promise from 'bluebird';

Promise.longStackTraces();

function prompt(questions, callback) {
  return new Promise((resolve, reject) => {
    inquirer.prompt(questions, resolve);
  });
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

let db = null;

async function setup() {
  let exit = false;

  db = await database();

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

        const account = await Account.findOrCreate(db, contextAttributes);

        account.organizationName = context.name;
        account.firstName = user.first_name;
        account.lastName = user.last_name;
        account.email = user.email;
        account.token = context.api_token;

        await account.save();

        console.log('✓'.green, context.name);
      }
      return user;
    } else {
      console.log('Username or password incorrect'.red);

      let retry = await prompt(againQuestion);

      if (!retry.again) {
        exit = true;
      }
    }
  }

  return null;
}

function onerror(err) {
  console.log('ERROR!');
  db.close();
  console.error(err.stack);
  throw err;
}

setup().then(function(result) {
  db.close();
}).catch(onerror);
