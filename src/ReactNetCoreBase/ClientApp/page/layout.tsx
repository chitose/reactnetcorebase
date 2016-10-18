import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import HeaderBar from './component/headerBar';
import { SystemProvider, DocumentTitleProvider } from '../provider';

interface LayoutProps {
  body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps & RouteComponentProps<any, any>, void> {
  render() {
    return <SystemProvider>
      <DocumentTitleProvider>
        <div className="app-root">
          <HeaderBar/>
          {this.props.body}
        </div>
      </DocumentTitleProvider>
    </SystemProvider>;
  }
}