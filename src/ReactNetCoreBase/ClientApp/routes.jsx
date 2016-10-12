import * as React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Layout } from './pages/layout';
import { HomePage } from './pages/home';
export const RoutePaths = {
    root: "/",
    login: "/login",
    forbidden: "/forbidden"
};
function privateGroupGuard(nextState, replace) {
    if (nextState.location.pathname !== RoutePaths.forbidden) {
    }
    if (nextState.location.pathname !== RoutePaths.login) {
    }
}
function routeChange(prevState, nextState, replace) {
    privateGroupGuard(nextState, replace);
}
export const routes = <Route path={RoutePaths.root} component={Layout} onEnter={privateGroupGuard} onChange={routeChange}>
    <IndexRoute components={{ body: HomePage }}/>
</Route>;
//# sourceMappingURL=routes.jsx.map