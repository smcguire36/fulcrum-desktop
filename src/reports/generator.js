import ejs from 'ejs';
import fs from 'fs';
import mv from 'mv';
import path from 'path';
import { DateUtils } from 'fulcrum-core';
import HtmlToPdf from './html-to-pdf';
import Promise from 'bluebird';
import sanitize from 'sanitize-filename';

const move = Promise.promisify(mv);

export default class Generator {
  constructor(record) {
    this.record = record;
  }

  get contentTemplate() {
    return fs.readFileSync(path.join(__dirname, 'template.ejs')).toString();
  }

  async generate(directory) {
    const data = {
      DateUtils: DateUtils,
      record: this.record,
      renderValues: this.renderValues
    };

    const options = {};

    const html = ejs.render(this.contentTemplate, data, options);

    const topdf = new HtmlToPdf(html);

    const result = await topdf.run();

    let outputPath = null;

    if (result) {
      const reportName = sanitize(this.record.displayValue || this.record.id);

      outputPath = path.join(directory, reportName + '.pdf');

      await move(result.file, outputPath);
    }

    await topdf.cleanup();

    return {file: outputPath, size: result.size};
  }

  renderValues = (feature, renderFunction) => {
    for (const element of feature.formValues.container.elements) {
      const formValue = feature.formValues.get(element.key);

      if (formValue) {
        renderFunction(element, formValue);
      }
    }
  }
}
