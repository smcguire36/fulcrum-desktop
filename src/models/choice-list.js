import Base from './base';
import {Choice} from 'fulcrum-core';
// import {ChoiceList as ChoiceListBase} from 'fulcrum-core';

export default class ChoiceList extends Base {
  static get tableName() {
    return 'choice_lists';
  }

  static get columns() {
    return [
      { name: 'accountID', column: 'account_id', type: 'integer', null: false },
      { name: 'resourceID', column: 'resource_id', type: 'string', null: false },
      { name: 'name', column: 'name', type: 'string', null: false },
      { name: 'description', column: 'description', type: 'string' },
      { name: 'choicesJSON', column: 'choices', type: 'json', null: false }
    ];
  }

  updateFromAPIAttributes(attributes) {
    this.resourceID = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
    this.choicesJSON = attributes.choices;
  }

  get choices() {
    if (!this._choices) {
      this._choices = [];

      for (const choice of this.choicesJSON) {
        this._choices.push(new Choice(choice));
      }
    }
    return this._choices;
  }

  // get model() {
  //   if (!this._model) {
  //     this._model = new ChoiceListModel({choices: this.choices});
  //   }
  //   return this._model;
  // }
}

// Base.includeInto(ChoiceList);
Base.register(ChoiceList);
