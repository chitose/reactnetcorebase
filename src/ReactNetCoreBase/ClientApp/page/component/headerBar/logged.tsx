import * as React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import Avatar from 'material-ui/Avatar';

import { BaseComponent } from '../../../provider';
import * as authSvc from '../../../service/auth';
import { RoutePaths } from '../../../routes';
import { browserHistory } from 'react-router';
import * as userSvc from '../../../service/user';

interface LoggedState {
  open: boolean;
  anchorEl: any;
}

export class Logged extends BaseComponent<any, LoggedState> {
  static muiName = "FlatButton";
  state = {
    open: false,
    anchorEl: null
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.state.open = false;
    this.setState(this.state);
  };

  async signout() {
    this.handleRequestClose();
    await authSvc.signout(this.httpClient);
    let info = this.serverInfo.info;
    info.profile = null;
    this.serverInfo.updateServerInfo(info);
    browserHistory.push(RoutePaths.login);
  }

  render() {
    return <div>
      <FlatButton {...this.props} onTouchTap={this.handleTouchTap} labelPosition="before" label={this.serverInfo.info.profile.displayName} icon={<Avatar size={35} src={userSvc.userThumb(this.serverInfo.info.profile.id, this.serverInfo.info.profile.rowVersion)} />} />
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={this.handleRequestClose}
        >
        <Menu>
          <MenuItem primaryText={this.i18n.t("common:app_bar.personal_menu.sign_out")} onTouchTap={this.signout.bind(this)} />
          <MenuItem primaryText={this.i18n.t("common:app_bar.personal_menu.profile")} onTouchTap={() => { this.handleRequestClose(); browserHistory.push(RoutePaths.profile) } } />
        </Menu>
      </Popover>
    </div>;
  }
}