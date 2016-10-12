import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';

import { routes } from './routes';

ReactDOM.render(<Router history={browserHistory} children={routes}></Router>,
    document.getElementsByTagName("body")[0]);