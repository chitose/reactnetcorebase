import * as React from 'react';
import { PageTitle } from './component';
import { BaseRouterComponent } from '../provider';

import { Form } from '../provider/form';
import { FormTextField, DatePickerField, AutoCompleteField } from '../control';
import Paper from 'material-ui/Paper';

export class HomePage extends BaseRouterComponent<any, { model: Object }, any, any> {
  render() {
    return (
      <PageTitle>
      </PageTitle>
    );
  }
}