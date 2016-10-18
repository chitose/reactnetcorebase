﻿import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Avatar from 'material-ui/Avatar';

import { BaseComponent } from '../../../provider';
import * as authSvc from '../../../service/auth';
import { RoutePaths } from '../../../routes';
import { browserHistory } from 'react-router';
import * as userSvc from '../../../service/user';

export class Logged extends BaseComponent<any, void> {
  static muiName = "IconMenu";
  async signout() {
    await authSvc.signout(this.httpClient);
    let info = this.serverInfo.info;
    info.profile = null;
    this.serverInfo.updateServerInfo(info);
    browserHistory.push(RoutePaths.login);
  }

  render() {
    return <IconMenu {...this.props} iconButtonElement={
      <IconButton><Avatar size={24} src={userSvc.userThumb(this.serverInfo.info.profile.id)}/></IconButton>
    }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
      <MenuItem primaryText={this.i18n.t("common:app_bar.personal_menu.sign_out")} onTouchTap={this.signout.bind(this)} />
      <MenuItem primaryText={this.i18n.t("common:app_bar.personal_menu.profile")} onTouchTap={() => { browserHistory.push(RoutePaths.profile) } } />
    </IconMenu>
  }
}