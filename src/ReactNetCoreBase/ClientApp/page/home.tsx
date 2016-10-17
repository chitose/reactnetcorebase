import * as React from 'react';
import { PageTitle } from './component';
import { BaseComponent } from '../provider';
export class HomePage extends BaseComponent<any, void> {
  render() {
    return (
      <PageTitle title={this.i18n.t("common:app_title")}>
        <div>Home page</div>
      </PageTitle>
    );
  }
}