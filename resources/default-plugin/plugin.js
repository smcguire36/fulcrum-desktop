export default class {
  async task(cli) {
    return cli.command({
      command: 'example',
      desc: 'an example command',
      builder: {
        org: {
          desc: 'organization name',
          required: true,
          type: 'string'
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    console.log(fulcrum.args.org);
  }

  async activate() {
  }

  async deactivate() {
  }
}
