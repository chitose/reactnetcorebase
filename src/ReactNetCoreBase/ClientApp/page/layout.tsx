import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface LayoutProps {
    body: React.ReactElement<any>;
}

export class Layout extends React.Component<LayoutProps & RouteComponentProps<any, any>, void> {
    render() {
        return <div className="app-root">            
            {this.props.body}
        </div>;
    }
}