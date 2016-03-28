import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import { DateUtils } from 'fulcrum-core';

export default class Generator {
  constructor(record) {
    this.record = record;
  }

  get contentTemplate() {
    return fs.readFileSync(path.join(__dirname, 'template.ejs')).toString();
  }

  async generate() {
    const data = {
      DateUtils: DateUtils,
      record: this.record,
      renderValues: this.renderValues
    };

    const options = {};

    const html = ejs.render(this.contentTemplate, data, options);

    // fs.writeFileSync('report.html', html);

    console.log(html);
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
