import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import { HttpClientProvider } from './httpClient';
import { DialogContentComponent, DialogContentAPI } from './dialogContent';

interface SystemProviderState {
    instanceId: number;
    confirmData: ConfirmInfo[];
    alertData: AlertInfo[];
    dialogData: DialogInfo<any>[];
    snackData: SnackInfo;
}

interface SnackInfo {
    message: React.ReactElement<any> | string | number;
    autoHideDuration?: number;
    action?: string;
    open: boolean;
    onActionClick?: React.TouchEventHandler;
}

interface ConfirmInfo {
    id: number;
    open: boolean;
    title: string;
    message: string;
    yesLabel?: string;
    noLabel?: string;
    promiseResolve: { (value: boolean): void }
}

interface AlertInfo {
    id: number;
    open: boolean;
    title: string;
    message: string | string[];
    okLabel?: string;
    promiseResolve: { (value: boolean): void }
}

interface DialogInfo<T> {
    id: number;
    open: boolean;
    title: string;
    content: React.ReactElement<any>;
    cssClass?: string;
    style?: React.CSSProperties;
    promiseResolve: { (value: T): void };
    dialogContentProvider?: DialogContentAPI;
}

export interface SystemAPI {
    confirm: { (title: string, message: string, yesLabel?: string, noLabel?: string): Promise<Boolean> };
    alert: { (title: string, message: string | string[], okLabel?: string): Promise<Boolean> };
    dialog: { <T>(title: string, content: React.ReactElement<any> | React.ReactElement<any>[], cssClass?: string, dialogStyle?: React.CSSProperties): Promise<T> }
    snack: { (message: React.ReactElement<any> | string | number, autoHideDuration?: number, action?: string, onActionClick?: React.TouchEventHandler): void };
    closeDialog(value: any, ignoreConfirm?: boolean): void;
}

interface SystemProviderProps extends React.Props<SystemProvider> {

}

export class SystemProvider extends React.Component<SystemProviderProps, SystemProviderState> implements SystemAPI {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            instanceId: 0,
            confirmData: [],
            alertData: [],
            dialogData: [],
            snackData: { open: false, message: "", autoHideDuration: 4000 }
        };
    }
    static childContextTypes = {
        systemAPI: React.PropTypes.object
    }

    getChildContext() {
        return {
            systemAPI: this
        };
    }

    static contextTypes = {
        i18n: React.PropTypes.object
    }

    get i18n(): I18next.I18n {
        return this.context["i18n"] as I18next.I18n;
    }

    confirm(title: string, message: string, yesLabel?: string, noLabel?: string): Promise<boolean> {
        var newId = this.state.instanceId++;
        return new Promise<Boolean>((resolve, reject) => {
            var newConfirmData = this.state.confirmData;
            newConfirmData.push({ open: true, id: newId, title: title, message: message, yesLabel: yesLabel, noLabel: noLabel, promiseResolve: resolve });
            newConfirmData = newConfirmData.filter(c => c.open);
            this.setState(Object.assign({}, this.state, {
                instanceId: newId,
                confirmData: newConfirmData
            }));
        });
    }

    alert(title: string, message: string | string[], okLabel?: string): Promise<Boolean> {
        var newId = this.state.instanceId++;
        return new Promise<Boolean>((resolve) => {
            var newAlertData = this.state.alertData;
            newAlertData.push({ open: true, id: newId, title: title, message: message, okLabel: okLabel, promiseResolve: resolve });
            newAlertData = newAlertData.filter(a => a.open);
            this.setState(Object.assign({}, this.state, {
                instanceId: newId,
                alertData: newAlertData
            }));
        });
    }

    closeConfirm(ci: ConfirmInfo) {
        ci.open = false;
        this.setState(Object.assign({}, this.state, {
            confirmData: this.state.confirmData
        }));
    }

    closeAlert(ai: AlertInfo) {
        ai.open = false;
        this.setState(Object.assign({}, this.state, {
            alertData: this.state.alertData
        }));
    }

    renderConfirmActions(ci: ConfirmInfo): JSX.Element[] {
        return [
            <FlatButton label={this.i18n.t(ci.noLabel || "common:button.no")} primary={true} onTouchTap={
                () => { ci.promiseResolve(false); this.closeConfirm(ci) } } keyboardFocused={true} />,
            <FlatButton label={this.i18n.t(ci.yesLabel || "common:button.yes")} primary={true} onTouchTap={() => { ci.promiseResolve(true); this.closeConfirm(ci) } }/>
        ];
    }

    renderAlertActions(ai: AlertInfo): JSX.Element[] {
        return [
            <FlatButton label={this.i18n.t(ai.okLabel || "common:button.OK")} primary={true} onTouchTap={() => { ai.promiseResolve(true); this.closeAlert(ai) } }/>
        ];
    }

    dialog<T>(title: string, content: React.ReactElement<any> | React.ReactElement<any>, cssClass?: string, dialogStyle?: React.CSSProperties): Promise<T> {
        var newId = this.state.instanceId++;
        return new Promise<T>((resolve, reject) => {
            var newDialogData = this.state.dialogData;
            newDialogData.push({ open: true, id: newId, title: title, content: content, cssClass: cssClass, style: dialogStyle, promiseResolve: resolve });
            newDialogData = newDialogData.filter(d => d.open);
            this.setState(Object.assign({}, this.state, {
                instanceId: newId,
                dialogData: newDialogData
            }));
        });
    }

    closeDialog(value: any, ignoreConfirm?: boolean): void {
        if (this.state.dialogData.length > 0) {
            let di = this.state.dialogData[this.state.dialogData.length - 1];
            if (!ignoreConfirm && di.dialogContentProvider.hasDirtyFormUnSavedForm()) {
                this.confirm("", this.i18n.t("common:message.saveChangeConfirm")).then((cr: boolean) => {
                    if (cr) {
                        di.dialogContentProvider.resetForm();
                        di.promiseResolve(value);
                        this.state.dialogData[this.state.dialogData.length - 1].open = false;
                        this.setState(Object.assign({}, this.state, {
                            dialogData: this.state.dialogData
                        }));
                    }
                });
            } else {
                di.promiseResolve(value);
                this.state.dialogData[this.state.dialogData.length - 1].open = false;
                this.setState(Object.assign({}, this.state, {
                    dialogData: this.state.dialogData
                }));
            }
        }
    }

    snack(message: React.ReactElement<any> | string | number, autoHideDuration: number, action?: string, onActionClick?: React.TouchEventHandler): void {
        this.setState(Object.assign({}, this.state, { snackData: Object.assign(this.state.snackData, { message: message, action: action, autoHideDuration: autoHideDuration, onActionClick: onActionClick, open: true }) }));
    }

    closeSnack() {
        this.state.snackData.open = false;
        this.setState(Object.assign({}, this.state, {
            snackData: this.state.snackData
        }));
    }

    render() {
        return <HttpClientProvider>
            {this.props.children}
            {this.state.confirmData.map(ci => {
                return <Dialog key={`confirm-${ci.id}`} title={ci.title} modal={true} open={ci.open} actions={this.renderConfirmActions(ci)}>
                    {ci.message}
                </Dialog>;
            })}
            {this.state.alertData.map(ai => {
                return <Dialog key={`alert-${ai.id}`} title={ai.title} modal={false} open={ai.open} onRequestClose={() => this.closeAlert(ai)} actions={this.renderAlertActions(ai)}>
                    {Array.isArray(ai.message) ? (ai.message as string[]).map((m, i) => { return <p key={i}>{m}</p> }) : ai.message}
                </Dialog>
            })}
            {this.state.dialogData.map(di => {
                return <Dialog key={`dialog-${di.id}`} className={"dialog " + (di.cssClass || "")} style={di.style || {}} title={di.title} modal={true} open={di.open}>
                    <DialogContentComponent ref={(r) => { di.dialogContentProvider = r } }>
                        {di.content}
                    </DialogContentComponent>
                </Dialog>
            })}

            <Snackbar onRequestClose={() => this.closeSnack()} open={this.state.snackData.open} message={this.state.snackData.message} action={this.state.snackData.action} onActionTouchTap={this.state.snackData.onActionClick} autoHideDuration={this.state.snackData.autoHideDuration || 1000} />
        </HttpClientProvider>;
    }
}