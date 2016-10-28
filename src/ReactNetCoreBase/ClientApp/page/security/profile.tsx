import * as React from 'react';
import { BaseComponent } from '../../provider';
import * as userSvc from '../../service/user';
import Paper from 'material-ui/Paper';
import { Constraints } from '../../service/validator';
import { Form } from '../../provider/form';
import { ProfileUpdateRequest } from '../../model/view/profileUpdateRequest';
import { FormTextField, Dropify } from '../../control';
import { Link } from 'react-router';
import { RoutePaths } from '../../routes';
import { PageTitle } from '../component';

import { browserHistory } from 'react-router';
export class ProfilePage extends BaseComponent<ReactRouter.RouteComponentProps<any, any>, ProfileUpdateRequest> {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      firstName: this.serverInfo.info.profile.firstName,
      lastName: this.serverInfo.info.profile.lastName,
      email: this.serverInfo.info.profile.email || "",
      phone: this.serverInfo.info.profile.phone || "",
      password: "",
      passwordMatch: "",
      image: ""
    };
  }

  async submit(model: ProfileUpdateRequest) {
    const resp = await userSvc.updateProfile(this.httpClient, model);
    if (!resp.isBusinessError) {
      this.serverInfo.info.profile = resp.data;
      this.serverInfo.updateServerInfo(this.serverInfo.info);
    }
    return resp;
  }

  render() {
    return (
      <PageTitle title={this.i18n.t("security:profile.title")}>
        <div className="row center-xs">
          <div className="col-sm-12 col-md-9 col-lg-6">
            <Paper zDepth={1} className="paper">
              <Form onSubmit={this.submit.bind(this)}
                unSavedConfirm={this.props.route}
                onCancel={() => { browserHistory.goBack() } }
                name="profile" title="security:profile.title"
                rules={ProfileUpdateRequest.ValidationRules}>
                <div className="row">
                  <div className="col-xs-12 col-sm-9">
                    <FormTextField value={this.state.firstName} name={ProfileUpdateRequest.ColumnNames.firstName} autoFocus={true} label={this.i18n.t("security:profile.label.first_name")} />
                  </div>
                  <div className="col-xs-12 col-sm-3">
                    <Dropify name={ProfileUpdateRequest.ColumnNames.image} showInfo={false} allowedFormats={["portrait"]}
                      defaultFile={this.serverInfo.info.profile.hasImage ? userSvc.userImage(this.serverInfo.info.profile.id, this.serverInfo.info.profile.rowVersion) : ''} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-9">
                    <FormTextField value={this.state.lastName} name={ProfileUpdateRequest.ColumnNames.lastName} label={this.i18n.t("security:profile.label.last_name")} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-9">
                    <FormTextField value={this.state.phone} name={ProfileUpdateRequest.ColumnNames.phone} label={this.i18n.t("security:profile.label.phone")} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-9">
                    <FormTextField value={this.state.email} name={ProfileUpdateRequest.ColumnNames.email} label={this.i18n.t("security:profile.label.email")} />
                  </div>
                </div>
                <FormTextField name={ProfileUpdateRequest.ColumnNames.password} label={this.i18n.t("security:profile.label.password")} />
                <FormTextField name={ProfileUpdateRequest.ColumnNames.passwordMatch} label={this.i18n.t("security:profile.label.password_match")} />
              </Form>
            </Paper>
          </div>
        </div >
      </PageTitle >
    );
  }
}