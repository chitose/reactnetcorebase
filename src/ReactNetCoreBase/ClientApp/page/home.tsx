import * as React from 'react';
import { PageTitle } from './component';
import { BaseComponent } from '../provider';

import { Form } from '../provider/form';
import { FormTextField, DatePickerField, AutoCompleteField } from '../control';
import Paper from 'material-ui/Paper';

export class HomePage extends BaseComponent<any, { model: Object }> {
  render() {
    return (
      <PageTitle title={this.i18n.t("common:app_title")}>
        <div>Home page</div>
        <div className="row center-xs">
          <div className="col-md-6">
            <Paper zDepth={2}>
              <Form
                onSubmit={(model) => { return new Promise<any>((r, re) => { r(true); });} }
                onModelChanged={(model) => { this.state.model = model; this.setState(this.state) } }>
              </Form>
            </Paper>
          </div>
        </div>
      </PageTitle>
    );
  }
}