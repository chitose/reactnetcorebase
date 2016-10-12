import * as React from 'react';
import { SystemAPI } from './system';

function encoderStringTag(encoder: (s: string) => string, strings: string[], values: any[]) {
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

function url(strings: string[], ...values: any[]) {
    return encoderStringTag(encodeURIComponent, strings, values);
}

export interface BusinessExceptionResponse {
    businessException: boolean;
    message: string;
    infos: any;
}

export interface HttpClientAPI {
    http: { <T>(url: string, req?: any): Promise<T | BusinessExceptionResponse> };
    fetchData: { <T>(url: string, req?: any): Promise<T | BusinessExceptionResponse> }
}

interface HttpClientProviderState {
    pendingRequest: number;
}

interface HttpClientProviderProps extends React.Props<HttpClientProvider> {
}

export class HttpClientProvider extends React.Component<HttpClientProviderProps, HttpClientProviderState> implements HttpClientAPI {
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

    static contextTypes = {
        i18n: React.PropTypes.object,
        systemAPI: React.PropTypes.object
    }

    get i18n(): I18next.I18n {
        return this.context["i18n"] as I18next.I18n;
    }

    get systemAPI(): SystemAPI {
        return this.context["systemAPI"] as SystemAPI;
    }

    async http<T>(url: string, req?: RequestInit): Promise<T | BusinessExceptionResponse> {
        req = Object.assign({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        } as RequestInit, req);

        return this.fetchData<T>(url, req);
    }

    async fetchData<T>(url: string, req?: any): Promise<T | BusinessExceptionResponse> {
        req = Object.assign({}, req, {
            credentials: 'same-origin'
        });

        let response: Response;
        try {
            response = await fetch(url, req);
        }
        catch (ex) {
            this.setRequestError(this.i18n.t("common:message.networkError"));
            throw ex;
        }

        if (!response.ok) {
            let error: { status: number;[key: string]: any };
            try {
                error = await response.json();
                error.status = response.status;
            }
            catch (ex) {
                error = { status: response.status };
            }

            if (!error["businessException"]) {
                this.handleKnownErrors(error);
                throw error;
            } else {
                return {
                    message: error["message"],
                    businessException: true,
                    infos: error["infos"]
                } as BusinessExceptionResponse;
            }
        }

        if (response.status === 204)
            return null;
        const raw = await response.text();
        if (raw === '') return null;
        return JSON.parse(raw, this.convertDateString) as T;
    }

    convertDateString(key: string, value: any) {
        if (typeof value !== 'string') return value;
        const match = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2})?$/.exec(value);
        // convert date to local time
        return match ? new Date(value + "Z") : value;
    }

    setRequestError(msg: string | string[]) {
        let errorMsg = [];
        if (Array.isArray(msg)) {
            let msga = msg as string[];
            if (msga.length === 0) {
                errorMsg = msga;
            } else {
                errorMsg = errorMsg.concat(msga);
            }
        } else {
            errorMsg.push(msg as string);
        }
        this.systemAPI.alert(this.i18n.t("common:label.failedRequestDialog"), errorMsg);
    }

    updatePendingRequestCounter(val: number) {
        this.setState(Object.assign({}, this.state, {
            pendingRequest: this.state.pendingRequest + val
        }));
    }

    handleKnownErrors(response: { status: number;[key: string]: any }) {
        if (response.status >= 500) {
            this.setRequestError(this.i18n.t('common:message.serverError'));
            return;
        }
        switch (response.status) {
            case 401: // Unauthorized
                this.setRequestError(this.i18n.t('common:message.unauthorized'));
                break;
            case 403: // Forbidden
                this.setRequestError(this.i18n.t('common:message.forbidden'));
                break;
            case 412: // Optimistic concurrency failed
                this.setRequestError(this.i18n.t('common:message.concurrency'));
                break;
        }
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}