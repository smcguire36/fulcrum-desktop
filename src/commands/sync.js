import Command from './command';
import Synchronizer from '../sync/synchronizer';

class Sync extends Command {
  async run() {
    const accounts = await this.fetchAccount(this.args.org);

    for (const account of accounts) {
      const dataSource = await this.createDataSource(account);

      await Synchronizer.instance.run(account, this.args.form, dataSource);
    }
  }
}

new Sync().start();
