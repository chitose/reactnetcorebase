import * as React from 'react';



interface DocumentTitleProviderState {
  title: string;
}

export interface DocumentTitleProviderAPI {
  setTitle: (title: string) => void;
  getTitle: () => string;
}

export class DocumentTitleProvider extends React.Component<any, DocumentTitleProviderState> implements DocumentTitleProviderAPI {
  state = {
    title: ""
  };

  static childContextTypes = {
    documentTitleAPI: React.PropTypes.object
  }

  getChildContext() {
    return {
      documentTitleAPI: this
    };
  }

  setTitle(title: string) {
    document.title = title;
    this.setState({ title });
  }
  getTitle() {
    return this.state.title;
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}