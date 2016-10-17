﻿import * as React from 'react';
import { FormApi, FormFieldApi } from './formInterface';
import { Dictionary } from '../common';
import { ApiResponse } from '../model/view/apiResponse';
import RaisedButton from 'material-ui/RaisedButton';
import { BaseComponent } from './httpClient';
import { Validator } from '../service/validator';
import AlertWarning from 'material-ui/svg-icons/alert/warning';
import RefreshIndicator from 'material-ui/RefreshIndicator';

interface FormProps extends React.Props<Form> {
  title?: string;
  unSavedConfirm?: boolean;
  name?: string;
  onModelChanged?: (model: Dictionary<any>) => void;
  onValidationError?: () => void;
  onSubmit: (model: Dictionary<any>) => Promise<ApiResponse<any>>;
  saveLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  footerAction?: JSX.Element | JSX.Element[];
  headerContent?: JSX.Element | JSX.Element[];
  className?: string;
  rules?: Dictionary<Validator[]>;
  showValidationSummary?: boolean;
}

interface FormState {
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
  submitted: boolean;
  validationChanged: boolean;
}

export class Form extends BaseComponent<FormProps, FormState> implements FormApi {
  static childContextTypes = {
    form: React.PropTypes.object
  }
  private fields: Dictionary<FormFieldApi> = {};
  private model: Dictionary<any> = {};
  private validationError: Dictionary<string[]> = {};
  private serverError = "";

  getChildContext() {
    return {
      form: this
    }
  }


  state = {
    dirty: false,
    valid: true,
    submitting: false,
    submitted: false,
    validationChanged: false
  }

  updateValueAndValidility(field: FormFieldApi) {
    this.model[field.props.name] = field.value();

    this.validationError[field.props.name] = this.validateField(field);
    field.updateStatus(this.validationError[field.props.name]);

    console.log(`Form ${this.props.name} model changed`);
    console.log(this.model);
    if (this.props.onModelChanged) {
      this.props.onModelChanged(this.model);
    }

    this.state.valid = Object.keys(this.validationError).map(k => this.validationError[k].length > 0).length === 0;
    this.state.validationChanged = true;
    this.setState(this.state);
  }

  detachFromForm(field: FormFieldApi) {
    delete this.fields[field.props.name];
    delete this.model[field.props.name];
  }

  attachToForm(field: FormFieldApi) {
    this.fields[field.props.name] = field;
    this.model[field.props.name] = null;
  }

  validateField(field: FormFieldApi, onSubmit?: boolean) {
    if (this.props.rules) {
      let fieldValidators = this.props.rules[field.props.name];
      if (fieldValidators) {
        let fr = fieldValidators.map(v => v.isValid(field)).filter(vr => vr !== null);
        field.updateStatus(fr, onSubmit);
        return fr;
      }
    }

    return [];
  }

  validate(): Dictionary<string[]> {
    this.validationError = {};
    for (let name in this.fields) {
      let field = this.fields[name];
      const fr = this.validateField(field, true);
      if (fr.length > 0) {
        this.validationError[name] = fr;
      }
    }

    return this.validationError;
  }

  getField(name: string): FormFieldApi {
    return this.fields[name];
  }

  isDirty(): boolean {
    return this.state.dirty;
  }

  isValid(): boolean {
    return this.state.valid;
  }

  isIgnoreSaveConfirm(): boolean {
    return !this.props.unSavedConfirm;
  }

  reset(): void {
    this.state.valid = true;
    this.state.dirty = false;
    this.setState(this.state);
  }

  submit() {
    this.validate();
    this.state.valid = Object.keys(this.validationError).length === 0;
    this.state.submitted = false;
    if (this.state.valid) {
      this.state.submitting = true;
      this.setState(this.state, () => {
        this.doSubmit();
      });
    } else {
      this.setState(this.state);
    }
  }

  async doSubmit() {
    this.serverError = "";
    try {
      const sr = await this.props.onSubmit(this.model);
      if (sr.isBusinessError) {
        this.serverError = this.i18n.t(sr.errorMessage, sr.errorOptions);
      };
    } finally {
      this.state.submitting = false;
      this.state.submitted = true;
      this.setState(this.state);
    }
  }

  get getFormClassName(): string {
    return "form form-container " + this.props.className || "";
  }

  submitInternal = (evt: React.FormEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.submit();
  }

  renderValidationSummary() {
    return <div className="form validation-summary">
      {Object.keys(this.validationError).map(k =>
        <div className="form validation-summary field-validation">
          {this.validationError[k].map(m => <div style={{ lineHeight: this.theme.spacing.iconSize + 'px' }} className="form validation-summary field-validation validation-message">
            <AlertWarning color={this.theme.textField.errorColor}/><span>{m}</span>
          </div>)}
        </div>
      )}
    </div>;
  }

  render() {
    return <form noValidate={true} className={this.getFormClassName} name={this.props.name} onSubmit={this.submitInternal}>
      {this.state.submitting ? <div className="form form-submitting relative-container">
        <div className="inline-loading-indicator"><RefreshIndicator top={0} left={0} status="loading"/></div>
      </div> : null}      
      <div className="form form-header">
        {this.props.title ? <h1 className="form form-header form-title">{this.i18n.t(this.props.title)}</h1> : null}
        {this.props.headerContent}
      </div>
      {this.props.showValidationSummary ? this.renderValidationSummary() : null}
      {this.serverError ? <p className="form validation-summary server-error">{this.serverError}</p> : null}
      <div className="form form-body">
        {this.props.children}
      </div>
      <div className="form form-footer">
        <RaisedButton label={this.i18n.t(this.props.saveLabel || "common:button.save")} primary={true} type="submit"/>
        {this.props.onCancel ? <RaisedButton label={this.i18n.t(this.props.cancelLabel || "common:button.cancel")} type="reset" onTouchTap={this.props.onCancel}/> : null}
        {this.props.footerAction}
      </div>
    </form>;
  }
}