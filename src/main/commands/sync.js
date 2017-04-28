import Synchronizer from '../sync/synchronizer';

export default class {
  async task(cli) {
    return cli.command({
      command: 'sync',
      desc: 'sync an organization',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        },
        forever: {
          default: false,
          type: 'boolean',
          describe: 'keep the sync running forever'
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    await this.app.activatePlugins();

    const account = await fulcrum.fetchAccount(fulcrum.args.org);

    await this.syncLoop(account, fulcrum.args.full);
  }

  async syncLoop(account, fullSync) {
    const sync = true;

    const dataSource = await fulcrum.createDataSource(account);

    while (sync) {
      const synchronizer = new Synchronizer();

      await synchronizer.run(account, fulcrum.args.form, dataSource, {fullSync});

      fullSync = false;

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}
