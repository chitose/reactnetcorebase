import './content/main.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ServerInfoProvider, SystemProvider } from './provider';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { RouteProvider } from './routes';

injectTapEventPlugin();

import { ServerInfo, LANGUAGE_MODULES } from './common';

let theme = getMuiTheme(lightBaseTheme);

const serverInfo = window["serverInfos"] as ServerInfo;

i18n
    .init({
        resources: serverInfo.resources,
        fallbackLng: 'en',
        ns: LANGUAGE_MODULES,
        defaultNS: 'common',
        interpolation: {
            escapeValue: false // not needed for react!!
        }
    });

i18n.changeLanguage(serverInfo.language);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <MuiThemeProvider muiTheme={theme}>
            <ServerInfoProvider serverInfo={serverInfo}>
        <SystemProvider>
          <RouteProvider/>
                </SystemProvider>
            </ServerInfoProvider>
        </MuiThemeProvider>
    </I18nextProvider>,
    document.getElementsByTagName("body")[0]);