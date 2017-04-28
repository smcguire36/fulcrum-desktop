import CSV from 'csv-string';

export default class {
  async task(cli) {
    return cli.command({
      command: 'query',
      desc: 'run a query in the local database',
      builder: {
        sql: {
          type: 'string',
          desc: 'sql query',
          required: true
        }
      },
      handler: this.runCommand
    });
  }

  runCommand = async () => {
    let headers = false;

    await fulcrum.db.each(fulcrum.args.sql, {}, (columns, row, index) => {
      if (!headers) {
        headers = true;
        process.stdout.write(CSV.stringify(columns.map(c => c.name)));
      }

      if (row) {
        process.stdout.write(CSV.stringify(row));
      }
    });
  }
}
