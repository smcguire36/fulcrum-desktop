import Plugin from '../../src/plugin';
import Generator from '../../src/reports/generator';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

const PDF_PATH = path.join('.', 'form-pdfs');

export default class FormPDFPlugin extends Plugin {
  // return true to enable this plugin
  get enabled() {
    return false;
  }

  async runTask({app, yargs}) {
    this.args = yargs.usage('Usage: form-pdfs --org [org]')
      .demandOption([ 'org' ])
      .argv;

    const account = await this.fetchAccount(this.args.org);

    if (account) {
      const dataSource = await this.createDataSource(account);

      const forms = await account.findForms();

      for (const form of forms) {
        console.log('Generating report', form.name);

        // load all of the form dependencies
        await form.load(dataSource);

        await this.generateReport(form);
      }
    } else {
      console.error('Unable to find account', this.args.org);
    }
  }

  async initialize({app}) {
    mkdirp.sync(PDF_PATH);

    this.template = fs.readFileSync(path.join(__dirname, 'template.ejs')).toString();

    // app.on('form:save', this.onFormSave);
  }

  onFormSave = async ({form}) => {
    await this.generateReport(form);
  }

  async generateReport(form) {
    const params = {
      reportName: form.name,
      directory: PDF_PATH,
      template: this.template,
      data: {
        form: form,
        renderElements: this.renderElements
      },
      ejsOptions: {}
    };

    await Generator.generate(params);
  }

  renderElements = (container, renderFunction) => {
    for (const element of container.elements) {
      renderFunction(element);

      if (element.elements) {
        this.renderElements(element, renderFunction);
      }
    }
  }
}
