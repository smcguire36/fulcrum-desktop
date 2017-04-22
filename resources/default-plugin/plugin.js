import Plugin from 'fulcrum-sync-plugin';

export default class FulcrumPlugin extends Plugin {
  get enabled() {
    return false;
  }

  async runTask({app, yargs}) {
    const args =
      yargs.usage('Usage: reports --org [org]')
        .demandOption([ 'org' ])
        .argv;

    const account = await app.fetchAccount(args.org);

    if (account) {
      // do something
    } else {
      console.error('Unable to find account', args.org);
    }
  }

  async initialize({app}) {
    console.log('Plugin setup');
  }
}
