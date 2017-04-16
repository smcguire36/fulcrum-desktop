import Plugin from '../../src/plugin';
import Generator from '../../src/reports/generator';
import mkdirp from 'mkdirp';
import path from 'path';
import fs from 'fs';

const PDF_PATH = path.join('.', 'form-pdfs');

export default class ReportPlugin extends Plugin {
  // return true to enable this plugin
  get enabled() {
    return false;
  }

  async initialize({app}) {
    mkdirp.sync(PDF_PATH);

    this.template = fs.readFileSync(path.join(__dirname, 'template.ejs')).toString();

    app.on('form:save', this.onFormSave);
  }

  onFormSave = async ({form}) => {
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
