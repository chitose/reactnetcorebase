import * as React from 'react';
import { Router, Route, HistoryBase, RouterState, RedirectFunction, IndexRoute } from 'react-router';
import { Layout } from './page/layout';
import { HomePage } from './page/home';

export interface RouteConfig {
    path: string;
    component: any
}

export const RoutePaths = {
    root: "/",
    login: "/login",
    forbidden: "/forbidden"
}

function privateGroupGuard(nextState: RouterState, replace: RedirectFunction) {
    if (nextState.location.pathname !== RoutePaths.forbidden) {
    }

    if (nextState.location.pathname !== RoutePaths.login) {
    }
}

function routeChange(prevState: RouterState, nextState: RouterState, replace: RedirectFunction) {
    privateGroupGuard(nextState, replace);
}

export const routes = <Route path={RoutePaths.root} component={Layout} onEnter={privateGroupGuard} onChange={routeChange}>
    <IndexRoute components={{ body: HomePage as any }} />
</Route>;