import * as React from 'react';
import { BaseComponent } from '../../provider';
import * as authSvc from '../../service/auth';
import Paper from 'material-ui/Paper';
import { Constraints } from '../../service/validator';
import { Form } from '../../provider/form';
import { ProfileUpdateRequest } from '../../model/view/profileUpdateRequest';
import { FormTextField, FileUpload } from '../../control';
import { Link } from 'react-router';
import { RoutePaths } from '../../routes';
import { PageTitle } from '../component';

import { browserHistory } from 'react-router';
export class ProfilePage extends BaseComponent<ReactRouter.RouteComponentProps<any, any>, void> {
  async submit(model: ProfileUpdateRequest) {
    return null;
    //return resp;
  }

  render() {
    return (
      <PageTitle title={this.i18n.t("security:profile.title")}>
        <div className="row center-xs">
          <div className="col-xs-6">
            <Paper zDepth={1} className="paper">
              <Form onSubmit={this.submit.bind(this)}
                unSavedConfirm={this.props.route}
                onCancel={() => { browserHistory.goBack() } }
                name="profile" title="security:profile.title"
                rules={ProfileUpdateRequest.ValidationRules}>
                <div className="row">
                  <div className="col-xs-9">
                    <FormTextField name={ProfileUpdateRequest.ColumnNames.firstName} autoFocus={true} label={this.i18n.t("security:profile.label.first_name")}/>
                  </div>
                  <div className="col-xs-3">
                    <FileUpload name={ProfileUpdateRequest.ColumnNames.image} height={290}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-9">
                    <FormTextField name={ProfileUpdateRequest.ColumnNames.lastName} label={this.i18n.t("security:profile.label.last_name")}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-9">
                    <FormTextField name={ProfileUpdateRequest.ColumnNames.phone} label={this.i18n.t("security:profile.label.phone")}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-9">
                    <FormTextField name={ProfileUpdateRequest.ColumnNames.email} label={this.i18n.t("security:profile.label.email")}/>
                  </div>
                </div>                                                
                <FormTextField name={ProfileUpdateRequest.ColumnNames.password} label={this.i18n.t("security:profile.label.password")}/>
                <FormTextField name={ProfileUpdateRequest.ColumnNames.passwordMatch} label={this.i18n.t("security:profile.label.password_match")}/>

              </Form>
            </Paper>
          </div>
        </div >
      </PageTitle >
    );
  }
}