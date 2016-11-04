import * as React from 'react';
import { DocumentTitleProviderAPI, DocumentTitleProvider } from '../../provider';
import i18n from "i18next";
interface Props extends React.Props<PageTitle> {
  title?: string;
}

export class PageTitle extends React.Component<Props, void> {
  static contextTypes = Object.assign({},DocumentTitleProvider.childContextTypes, {
    currentLocation: React.PropTypes.object
  });

  get docTitle(): DocumentTitleProviderAPI {
    return this.context["documentTitleAPI"] as DocumentTitleProviderAPI;
  }

  get currentLocation():HistoryModule.Location {
    return this.context["currentLocation"] as HistoryModule.Location;
  }

  constructor(props: Props, ctx) {
    super(props, ctx);    
    if (props.title)
      this.docTitle.setTitle(i18n.t(props.title));
    if (this.currentLocation && this.currentLocation.state && this.currentLocation.state["title"])
      this.docTitle.setTitle(i18n.t(this.currentLocation.state["title"]));
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}