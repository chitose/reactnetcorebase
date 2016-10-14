import * as React from 'react';
import { browserHistory, Router, Route, HistoryBase, RouterState, RedirectFunction, IndexRoute } from 'react-router';
import { ServerInfo } from './common';
import { ServerInfoConsumerComponent } from './provider/server';


import { Layout } from './page/layout';
import { HomePage } from './page/home';
import { LoginPage } from './page/security/login';

export interface RouteConfig {
  path: string;
  component: any
}

export const RoutePaths = {
  root: "/",
  login: "/login",
  forbidden: "/forbidden"
}

export class RouteProvider extends ServerInfoConsumerComponent<any, void> {
  privateGroupGuard = (nextState: RouterState, replace: RedirectFunction) => {
    if (nextState.location.pathname !== RoutePaths.forbidden) {

    }

    if (nextState.location.pathname !== RoutePaths.login && nextState.location.pathname !== RoutePaths.forbidden
      && !this.serverInfo.info.userProfile) {
      replace({
        pathname: RoutePaths.login,
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  routeChange = (prevState: RouterState, nextState: RouterState, replace: RedirectFunction) => {
    this.privateGroupGuard(nextState, replace);
  }

  render() {
    const routes = <Route path={RoutePaths.root} component={Layout} onEnter={this.privateGroupGuard} onChange={this.routeChange}>
      <IndexRoute components={{ body: HomePage as any }} />
      <Route path={RoutePaths.login} components={{ body: LoginPage }}/>
    </Route>;
    return <Router history={browserHistory} children={routes} />
  }
}