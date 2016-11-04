import * as React from 'react';
import { browserHistory, Router, Route, HistoryBase, RouterState, RedirectFunction, IndexRoute } from 'react-router';
import { ServerInfo } from './common';
import { ServerInfoConsumerComponent } from './provider/server';


import { Layout } from './page/layout';
import { HomePage } from './page/home';
import { PageNotFound } from './page/404';
import { LoginPage } from './page/security/login';
import { ProfilePage } from './page/security/profile';
import { SandboxPage } from './page/sandbox';

export interface RouteConfig {
  path?: string;
  component: any;
  auth?: boolean;
  indexed?: boolean;
  nav?: boolean;
  title?: string;
}

export const RoutePaths = {
  root: "/",
  login: "/login",
  profile: "/profile",
  forbidden: "/forbidden"
}

const routesConfig: RouteConfig[] = [
  { component: HomePage, indexed: true, auth: true, path: RoutePaths.root, nav: true, title: "common:app_title" },
  { component: LoginPage, path: RoutePaths.login, title: "security:login.title" },
  { component: ProfilePage, path: RoutePaths.profile, auth: true, title: "security:profile.title" },
  { component: SandboxPage, path: "/sandbox", title: "Sandbox page", nav: true }
];

export class RouteProvider extends ServerInfoConsumerComponent<any, void> {
  privateGroupGuard = (nextState: RouterState, replace: RedirectFunction) => {
    const rcfg = routesConfig.find(r => r.path === nextState.location.pathname);
    if ((!nextState.location.state || !nextState.location.state["title"]) && rcfg.title) {
      replace({
        pathname: nextState.location.pathname,
        state: Object.assign({}, nextState.location.state, { title: rcfg.title })
      });
      return;
    }

    if (rcfg && rcfg.auth && !this.logged) {
      replace({
        pathname: RoutePaths.login,
        state: {
          nextPathname: nextState.location.pathname,
          title: rcfg.title
        }
      });
    }
  }

  routeChange = (prevState: RouterState, nextState: RouterState, replace: RedirectFunction) => {
    this.privateGroupGuard(nextState, replace);
  }

  render() {
    const routes = <Route path={RoutePaths.root} component={Layout} onEnter={this.privateGroupGuard} onChange={this.routeChange}>
      {routesConfig.map(r => {
        return r.indexed ? <IndexRoute components={{ body: r.component }} /> : <Route path={r.path} components={{ body: r.component }}></Route>;
      })}
      <Route path="*" components={{ body: PageNotFound }} />
    </Route>;
    return <Router history={browserHistory} children={routes} />
  }
}