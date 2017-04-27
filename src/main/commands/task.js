import Command from './command';

class Task extends Command {
  async run() {
    await this.app.runTask(this);
  }
}

new Task().start();
