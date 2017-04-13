import Plugin from '../src/plugin';

export default class Hello extends Plugin {
  initialize({app}) {
    app.on('choice_list:save', this.onChoiceListSave);
    app.on('classification_set:save', this.onClassificationSetSave);
    app.on('project:save', this.onProjectSave);
    app.on('form:save', this.onFormSave);
    app.on('record:save', this.onRecordSave);
    app.on('record:delete', this.onRecordDelete);
  }

  log = (...args) => {
    // console.log(...args);
  }

  onFormSave = ({form, statements}) => {
    if (form.version === 1) {
      this.log('form created', form.name);
    } else {
      this.log('form updated', form.name);
    }
  }

  onRecordSave = ({record}) => {
    this.log('record updated', record.displayValue);
  }

  onRecordDelete = ({record}) => {
    this.log('record deleted', record.displayValue);
  }

  onChoiceListSave = ({object}) => {
    if (object.version === 1) {
      this.log('choice list created', object.name);
    } else {
      this.log('choice list updated', object.name);
    }
  }

  onClassificationSetSave = ({object}) => {
    if (object.version === 1) {
      this.log('classification set created', object.name);
    } else {
      this.log('classification set updated', object.name);
    }
  }

  onProjectSave = ({object}) => {
    this.log('project saved', object.name);
  }
}
