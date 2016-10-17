import * as React from 'react';

import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { BaseComponent } from '../../../provider';

export class Logged extends BaseComponent<any, void> {
  static muiName = "IconMenu";
  render() {
    return <IconMenu {...this.props} iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
      <MenuItem primaryText={this.i18n.t("common:app_bar.personal_menu.sign_out")} />
    </IconMenu>
  }
}