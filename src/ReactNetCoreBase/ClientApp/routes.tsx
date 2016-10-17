import * as React from 'react';
import { browserHistory, Router, Route, HistoryBase, RouterState, RedirectFunction, IndexRoute } from 'react-router';
import { ServerInfo } from './common';
import { ServerInfoConsumerComponent } from './provider/server';


import { Layout } from './page/layout';
import { HomePage } from './page/home';
import { PageNotFound } from './page/404';
import { LoginPage } from './page/security/login';

export interface RouteConfig {
  path?: string;
  component: any;
  auth?: boolean;
  indexed?: boolean;
}

export const RoutePaths = {
  root: "/",
  login: "/login",
  forbidden: "/forbidden"
}

const routesConfig: RouteConfig[] = [
  { component: HomePage, indexed: true },
  { component: LoginPage, path: RoutePaths.login },
];

export class RouteProvider extends ServerInfoConsumerComponent<any, void> {
  privateGroupGuard = (nextState: RouterState, replace: RedirectFunction) => {
    const rcfg = routesConfig.find(r => r.path === nextState.location.pathname);

    if (rcfg && rcfg.auth && !this.logged) {
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
      {routesConfig.map(r => {
        return r.indexed ? <IndexRoute components={{ body: r.component }}/> : <Route path={r.path} components={{ body: r.component }}></Route>;
      })}
      <Route path="*" components={{ body: PageNotFound }}/>
    </Route>;
    return <Router history={browserHistory} children={routes} />
  }
}