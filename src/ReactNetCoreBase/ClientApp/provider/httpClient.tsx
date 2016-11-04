import * as React from 'react';
import { SystemAPI, SystemProviderConsumerComponent } from './system';
import { ApiResponse } from '../model/view/apiResponse';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { RouteComponentProps } from 'react-router';

const SHOW_LONG_WAITING_DIALOG_DELAY = 1000;


export interface HttpClientAPI {
  http: { <T>(url: string, req?: any): Promise<T> };
  fetchData: { <T>(url: string, req?: any): Promise<T> }
  url: (string: string[], ...value: any[]) => string;
}

interface HttpClientProviderState {
  pendingRequest: number;
}

export class HttpClientProvider extends SystemProviderConsumerComponent<any, HttpClientProviderState> implements HttpClientAPI {
  private requestRejectedDic: { [key: number]: boolean } = {};
  private requestCounter = 1;
  private longWaitingAlertId = -1;
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

  async showLongInfoRequest() {
    return await this.system.alert(this.i18n.t("common:dialog.title.long_wait"),
      <div className="relative-container inline-loading-indicator">
        <RefreshIndicator status="loading" top={10} left={0} />
        {this.i18n.t("common:message.long_waiting")}</div>,
      this.i18n.t("common:button.cancel"), (id) => this.longWaitingAlertId = id);
  }

  fetchData<T>(url: string, req?: any): Promise<ApiResponse<T>> {
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      req = Object.assign({}, req, {
        credentials: 'same-origin'
      });


      let reqId = this.requestCounter++;
      let timerId = setTimeout(() => {
        this.showLongInfoRequest().then((r) => {
          this.requestRejectedDic[reqId] = true;
          reject('rejected');
        });
      }, SHOW_LONG_WAITING_DIALOG_DELAY);

      fetch(url, req).then((response: Response) => {
        clearTimeout(timerId);
        if (this.longWaitingAlertId > -1) {
          this.system.closeAlert(this.longWaitingAlertId);
          this.longWaitingAlertId = 0;
        }

        if (!this.requestRejectedDic[reqId]) {
          response.text().then((raw) => {
            if (!raw || raw === "") {
              resolve();
            } else {
              var resp = JSON.parse(raw, this.convertDateString) as ApiResponse<T>;
              if (!resp.isBusinessError && resp.errorMessage) {
                let errorMsg: JSX.Element[] = [];
                errorMsg.push(<p className="error-message">{this.i18n.t(resp.errorMessage, resp.errorOptions)}</p>);
                if (resp.errorDetails) {
                  errorMsg.push(<h2>{this.i18n.t("common:dialog.label.exception_details")}</h2>);
                  errorMsg.push(<p className="error-detail">{resp.errorDetails}</p>);
                }
                this.system.alert(this.i18n.t("common:dialog.title.request_failure"), errorMsg);
                reject(resp.errorMessage);
              }

              resolve(resp);
            }
          });
        }
      })
        .catch((ex) => {
          clearTimeout(timerId);
          this.system.alert(this.i18n.t("common:dialog.title.request_failure"), this.i18n.t("common:message.network_error"));
          reject(ex);
        });
    });
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

export class BaseComponent<P, S> extends SystemProviderConsumerComponent<P, S> {
  static contextTypes = Object.assign({},
    HttpClientProvider.childContextTypes,
    { "router": React.PropTypes.object },
    SystemProviderConsumerComponent.contextTypes);
  protected get router(): ReactRouter.RouterOnContext {
    return this.context["router"] as ReactRouter.RouterOnContext;
  }
  protected get httpClient(): HttpClientAPI {
    return this.context["httpClient"] as HttpClientAPI;
  }
}

export class BaseRouterComponent<P, S, RP, RR> extends BaseComponent<P & ReactRouter.RouteComponentProps<RP, RR>, S> {
  static childContextTypes = {
    currentLocation: React.PropTypes.object
  }

  getChildContext(){
    return {
      currentLocation: this.props.location
    };
  }
}