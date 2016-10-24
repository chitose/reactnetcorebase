import './content/main.less';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ServerInfoProvider } from './provider';

import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import moment from 'moment';

import { RouteProvider } from './routes';

injectTapEventPlugin();

import { ServerInfo, LANGUAGE_MODULES } from './common';

import theme from './theme/theme';

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

moment.locale(serverInfo.language);

i18n.on("languageChanged", (opts: I18next.Options) => {
  moment.locale(i18n.language);
});

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <MuiThemeProvider muiTheme={theme}>
      <ServerInfoProvider serverInfo={serverInfo}>        
        <RouteProvider/>        
      </ServerInfoProvider>
    </MuiThemeProvider>
  </I18nextProvider>,
  document.getElementsByTagName("body")[0]);