import * as React from 'react';
import { ServerInfo } from '../common';
interface ServerInfoProviderProps extends React.Props<ServerInfoProvider> {
  serverInfo: ServerInfo
}

interface ServerInfoProviderState {
  serverInfo: ServerInfo
}

export interface ServerInfoProviderAPI {
  info: ServerInfo;
  updateServerInfo(info: ServerInfo): void;
}

export const ServerInfoContextTypes = {
  serverInfo: React.PropTypes.object,
  i18n: React.PropTypes.object
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
      serverInfo: this
    };
  }

  updateServerInfo(info: ServerInfo): void {
    this.setState({ serverInfo: info });
  }

  get info() {
    return this.state.serverInfo;
  }

  render() {
    return this.props.children as any;
  }
}

export abstract class ServerInfoConsumerComponent<P, S> extends React.Component<P, S> {
  static contextTypes = ServerInfoContextTypes;

  protected get serverInfo(): ServerInfoProviderAPI {
    return this.context["serverInfo"] as ServerInfoProviderAPI;
  }

  protected get i18n(): I18next.I18n {
    return this.context["i18n"] as I18next.I18n;
  }
}