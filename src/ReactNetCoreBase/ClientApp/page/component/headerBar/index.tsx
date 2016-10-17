import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import { browserHistory } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

import { BaseComponent, DocumentTitleProvider, DocumentTitleProviderAPI } from '../../../provider';
import { Logged } from './logged';
import { Login } from './login';
import { RoutePaths } from '../../../routes';

export default class HeaderBar extends BaseComponent<any, void> {
  static contextTypes = Object.assign({}, BaseComponent.contextTypes, DocumentTitleProvider.childContextTypes);
  get docTitle(): DocumentTitleProviderAPI {
    return this.context["documentTitleAPI"] as DocumentTitleProviderAPI;
  }
  render() {
    const isRoot = location.pathname === RoutePaths.root;
    return <div className="app-bar">
      <AppBar
        title={this.docTitle.getTitle()}
        titleStyle = {{ cursor: 'pointer', display: 'inline-block', flex: 'unset' }}
        onTitleTouchTap={() => { !isRoot && browserHistory.goBack() } }
        iconElementLeft={<IconButton onTouchTap={() => { !isRoot && browserHistory.goBack() } }><NavigationClose /></IconButton>}
        showMenuIconButton={!isRoot}
        iconElementRight={this.logged ? <Logged /> : <Login />}
        zDepth={1}
        />
    </div>;
  }
}