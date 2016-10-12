import * as React from 'react';
import { ServerInfo } from '../common';
interface ServerInfoProviderProps extends React.Props<ServerInfoProvider> {
    serverInfo: ServerInfo
}

interface ServerInfoProviderState {
    serverInfo: ServerInfo
}

export interface ServerInfoProviderAPI {
    serverInfo: ServerInfo;
    updateServerInfo(serverInfo: ServerInfo): void;
}

export const ServerInfoContextTypes = {
    serverInfoAPI: React.PropTypes.object
};

export class ServerInfoProvider extends React.Component<ServerInfoProviderProps, ServerInfoProviderState> implements ServerInfoProviderAPI {
    constructor(props: ServerInfoProviderProps, ctx) {
        super(props, ctx);
        this.state = {
            serverInfo: props.serverInfo
        };
    }

    static childContextTypes = ServerInfoContextTypes;

    getChildContext() {
        return {
            serverInfoAPI: this
        };
    }

    updateServerInfo(serverInfo: ServerInfo): void {
        this.setState({ serverInfo: serverInfo });
    }

    get serverInfo() {
        return this.state.serverInfo;
    }

    render() {
        return this.props.children as any;
    }
}