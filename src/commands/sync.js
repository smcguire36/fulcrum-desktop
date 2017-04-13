import Command from './command';
import Synchronizer from '../sync/synchronizer';

class Sync extends Command {
  async run() {
    const accounts = await this.fetchAccount(this.args.org);

    for (const account of accounts) {
      await this.syncLoop(account);
      // await Synchronizer.instance.run(account, this.args.form, dataSource);
    }
  }

  async syncLoop(account) {
    const sync = true;

    const dataSource = await this.createDataSource(account);

    while (sync) {
      const synchronizer = new Synchronizer();

      await synchronizer.run(account, this.args.form, dataSource);

      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }
}

new Sync().start();
