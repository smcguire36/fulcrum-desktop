import Plugin from '../../src/plugin';
import Generator from '../../src/reports/generator';
import mkdirp from 'mkdirp';
import path from 'path';

const REPORT_PATH = path.join('.', 'reports');

export default class ReportPlugin extends Plugin {
  // return true to enable this plugin
  get enabled() {
    return false;
  }

  async initialize({app}) {
    mkdirp.sync(REPORT_PATH);

    // app.on('record:save', this.onRecordSave);
  }

  onRecordSave = async ({record}) => {
    const generator = new Generator(record);

    const reportDirectory = path.join(REPORT_PATH, record.form.name);

    mkdirp.sync(reportDirectory);

    await generator.generate(reportDirectory);
  }
}
