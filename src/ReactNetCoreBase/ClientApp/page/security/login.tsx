import * as React from 'react';
import { BaseComponent } from '../../provider';
import * as authSvc from '../../service/auth';
import Paper from 'material-ui/Paper';
import { Constraints } from '../../service/validator';
import { Form } from '../../provider/form';
import { LoginRequest, LoginRequest_Rules } from '../../model/view/loginRequest';
import { FormTextField } from '../../control';
import { Link } from 'react-router';
import { RoutePaths } from '../../routes';
import { PageTitle } from '../component';

import { RouteComponentProps, browserHistory } from 'react-router';

export class LoginPage extends BaseComponent<RouteComponentProps<{ rurl: string }, any>, void> {
  async submit(model: LoginRequest) {
    let resp = await authSvc.login(this.httpClient, model);
    if (resp.data) {
      let info = this.serverInfo.info;
      info.profile = resp.data;
      this.serverInfo.updateServerInfo(info);
      browserHistory.push(this.props.params.rurl || RoutePaths.root);
    }
    return resp;
  }

  render() {
    return (
      <PageTitle title={this.i18n.t("security:login.title")}>
        <div className="row center-xs">
          <div className="col-xs-3">
            <Paper zDepth={1} className="paper">
              <Form onSubmit={this.submit.bind(this)} name="login" title="security:login.title" saveLabel="security:button.login"
                rules={LoginRequest_Rules}>
                <FormTextField name="userName" autoFocus={true} label={this.i18n.t("security:login.label.user_name")}/>
                <FormTextField name="password" label={this.i18n.t("security:login.label.password")} type="password"/>
              </Form>
            </Paper>
          </div>
        </div>
      </PageTitle>
    );
  }
}