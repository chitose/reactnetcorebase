import * as React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { browserHistory } from 'react-router';
import { RoutePaths } from '../../../routes';
import { BaseComponent } from '../../../provider';

export class Login extends BaseComponent<any, void> {
  static muiName = 'FlatButton';

  gotoLogin = (evt: React.MouseEvent) => {
    evt.preventDefault();
    browserHistory.push(RoutePaths.login);
  }  

  render() {
    return <div>
      <FlatButton {...this.props} label={this.i18n.t("common:app_bar.button.login")} onTouchTap={this.gotoLogin}/>
    </div>
  }
}