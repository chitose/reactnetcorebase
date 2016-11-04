import * as React from 'react';
import { PageTitle } from './component';
import { BaseRouterComponent } from '../provider';

import { Form } from '../provider/form';
import { FormTextField, DatePickerField, AutoCompleteField } from '../control';
import Paper from 'material-ui/Paper';
import AutoComplete from 'material-ui/AutoComplete';

export class SandboxPage extends BaseRouterComponent<any, { model: Object }, any, any> {
  state = {
      model: {}
  }    

  fetch_autocomplete = (text:string): Promise<any[]> => {
      const fruit = [
  'Apple', 'Apricot', 'Avocado',
  'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
  'Boysenberry', 'Blood Orange',
  'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
  'Coconut', 'Cranberry', 'Clementine',
  'Damson', 'Date', 'Dragonfruit', 'Durian',
  'Elderberry',
  'Feijoa', 'Fig',
  'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
  'Honeydew', 'Huckleberry',
  'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
  'Kiwi fruit', 'Kumquat',
  'Lemon', 'Lime', 'Loquat', 'Lychee',
  'Nectarine',
  'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
  'Olive', 'Orange',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
  'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
  'Quince',
  'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
  'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
  'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
  'Ugli fruit',
  'Watermelon',
];

      return new Promise((resolve)=>{
          resolve(fruit);
      });
  }
  render() {
    return (
      <PageTitle>        
        <div className="row center-xs">
          <div className="col-md-6">
            <Paper zDepth={2} className="paper">
              <Form
                onSubmit={(model) => { return new Promise<any>((r, re) => { r(true); });} }
                onModelChanged={(model) => { this.state.model = model; this.setState(this.state) } }>
                <FormTextField label="TextField" name="text"/>
                <DatePickerField label="date" name="date"/>
                <AutoCompleteField label="Autocomplete" filter={AutoComplete.caseInsensitiveFilter} name="autocomplete" fetch={this.fetch_autocomplete}/>
              </Form>
              <output>{JSON.stringify(this.state.model, null, 2)}</output>
            </Paper>
          </div>
        </div>
      </PageTitle>
    );
  }
}