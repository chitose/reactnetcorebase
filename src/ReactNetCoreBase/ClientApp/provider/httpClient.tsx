import * as React from 'react';
import { SystemAPI, SystemProviderConsumerComponent } from './system';
import { ApiResponse } from '../model/view/apiResponse';

export interface HttpClientAPI {
  http: { <T>(url: string, req?: any): Promise<T> };
  fetchData: { <T>(url: string, req?: any): Promise<T> }
  url: (string: string[], ...value: any[]) => string;
}

interface HttpClientProviderState {
  pendingRequest: number;
}

export class HttpClientProvider extends SystemProviderConsumerComponent<any, HttpClientProviderState> implements HttpClientAPI {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      pendingRequest: 0
    };
  }

  static childContextTypes = {
    httpClient: React.PropTypes.object
  }

  getChildContext() {
    return {
      httpClient: this
    };
  }

  static contextTypes = SystemProviderConsumerComponent.contextTypes;

  encoderStringTag(encoder: (s: string) => string, strings: string[], values: any[]) {
    if (values.length === 0) return strings[0];

    const builder: string[] = [];
    for (let i = 0; i < strings.length; i++) {
      builder.push(strings[i]);
      if (i < values.length) {
        builder.push(encoder(values[i]));
      }
    }
    return builder.join('');
  }

  url(strings: string[], ...values: any[]) {
    return this.encoderStringTag(encodeURIComponent, strings, values);
  }

  async http<T>(url: string, req?: RequestInit): Promise<ApiResponse<T>> {
    req = Object.assign({
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    } as RequestInit, req);

    return this.fetchData<T>(url, req);
  }

  async fetchData<T>(url: string, req?: any): Promise<ApiResponse<T>> {
    req = Object.assign({}, req, {
      credentials: 'same-origin'
    });

    let response: Response;
    try {
      response = await fetch(url, req);
    }
    catch (ex) {
      this.system.alert(this.i18n.t("common:dialog.title.request_failure"), this.i18n.t("common:message.network_error"));
      throw ex;
    }

    const raw = await response.text();
    var resp = JSON.parse(raw, this.convertDateString) as ApiResponse<T>;
    if (!resp.isBusinessError && resp.errorMessage) {
      let errorMsg: JSX.Element[] = [];
      errorMsg.push(<p className="error-message">{this.i18n.t(resp.errorMessage, resp.errorOptions)}</p>);
      if (resp.errorDetails) {
        errorMsg.push(<h2>{this.i18n.t("common:dialog.label.exception_details")}</h2>);
        errorMsg.push(<p className="error-detail">{resp.errorDetails}</p>);
      }
      this.system.alert(this.i18n.t("common:dialog.title.request_failure"), errorMsg);
      throw resp.errorMessage;
    }

    return resp;
  }

  convertDateString(key: string, value: any) {
    if (typeof value !== 'string') return value;
    const match = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2})?$/.exec(value);
    // convert date to local time
    return match ? new Date(value + "Z") : value;
  }

  updatePendingRequestCounter(val: number) {
    this.setState(Object.assign({}, this.state, {
      pendingRequest: this.state.pendingRequest + val
    }));
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}

export class HttpClientConsumer<P, S> extends SystemProviderConsumerComponent<P, S> {
  static contextTypes = Object.assign({}, HttpClientProvider.childContextTypes, SystemProviderConsumerComponent.contextTypes);
  protected get httpClient(): HttpClientAPI {
    return this.context["httpClient"] as HttpClientAPI;
  }
}