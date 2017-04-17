import Command from './command';

class Task extends Command {
  // async setup() {
  //   super.setup();
  // }

  async run() {
    await this.app.runTask(this);
  }
}

new Task().start();
