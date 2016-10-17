import * as React from 'react';
import { FormApi } from './formInterface';

export interface DialogContentAPI {
    registerForm: { (form: FormApi): void };
    unregisterForm: { (form: FormApi): void };
    hasDirtyFormUnSavedForm: { (): boolean };
    resetForm: { (): void };
}

interface DialogContentComponentProps extends React.Props<DialogContentComponent> {
}

export class DialogContentComponent extends React.Component<DialogContentComponentProps, void> implements DialogContentAPI {
    private forms: FormApi[] = [];
    static childContextTypes = {
        dialogOwner: React.PropTypes.object
    }

    resetForm() {
        this.forms.forEach(f => f.reset());
    }

    registerForm(form: FormApi) {
        this.forms.push(form);
    }

    hasDirtyFormUnSavedForm() {
        return this.forms.filter(f => f.isDirty() && !f.isIgnoreSaveConfirm()).length > 0;
    }

    unregisterForm(form: FormApi) {
        this.forms = this.forms.filter(f => f != form);
    }

    getChildContext() {
        return {
            dialogOwner: this
        };
    }

    render() {
        return this.props.children as any;
    }
}