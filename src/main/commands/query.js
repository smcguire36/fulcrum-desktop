import Command from './command';
import CSV from 'csv-string';

class QueryCommand extends Command {
  async run() {
    let headers = false;

    await this.db.each(this.args.sql, {}, (columns, row, index) => {
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

new QueryCommand().start();
