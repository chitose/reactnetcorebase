import * as React from 'react';
import { DocumentTitleProviderAPI, DocumentTitleProvider } from '../../provider';
interface Props extends React.Props<PageTitle> {
  title: string;
}

export class PageTitle extends React.Component<Props, void> {
  static contextTypes = DocumentTitleProvider.childContextTypes;
  get docTitle(): DocumentTitleProviderAPI {
    return this.context["documentTitleAPI"] as DocumentTitleProviderAPI;
  }

  constructor(props: Props, ctx) {
    super(props, ctx);
    this.docTitle.setTitle(props.title);
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}