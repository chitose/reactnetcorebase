import * as React from 'react';
import { FormApi, FormFieldProps, FormFieldState, FormFieldApi } from '../provider/formInterface';
import { BaseComponent } from '../provider/httpClient';

export abstract class Field<P extends FormFieldProps, S extends FormFieldState, F> extends BaseComponent<P, S> implements FormFieldApi {
  protected childControl: F;

  static contextTypes = Object.assign({}, BaseComponent.contextTypes, {
    form: React.PropTypes.object
  });

  protected className = "";

  get propsForChild() {
    let props = Object.assign({}, this.props);
    ["validators"].forEach(k => delete props[k]);
    return props;
  }

  get form(): FormApi {
    return this.context["form"] as FormApi;
  }

  protected initValue(): any {
    return this.props.value || "";
  }

  touched = () => {
    if (!this.state.isTouched) {
      this.state.isTouched = true;
      this.setState(this.state);
    }
  }

  constructor(props: P, ctx) {
    super(props, ctx);
    this.state = this.initState();
  }

  componentWillMount() {
    this.form.attachToForm(this);
  }

  componentWillUnmount() {
    this.form.detachFromForm(this);
  }

  updateStatus(errors: string[], onSubmit?: boolean, cb?: () => void) {
    this.state.isValid = errors.length === 0;
    if (onSubmit || this.state.isTouched) {
      this.state.errors = errors;
      this.setState(this.state, cb);
    }

    if (cb) {
      cb();
    }
  }

  value(val?: any) {
    if (val !== undefined) {
      this.state.value = val;
      this.state.isDirty = true;
      console.log(`Field ${this.props.name} value changed`);
      console.log(val);
      this.setState(this.state, () => {
        this.form.updateValueAndValidility(this);
      });
      return this.state.value;
    } else {
      return this.state.value;
    }
  }

  protected initState(): S {
    return {
      value: this.initValue(),
      isDirty: false,
      isValid: true,
      isTouched: false,
      errors: []
    } as any;
  }

  protected getErrorElement() {
    return this.state.errors.length === 0 ? null :
      <div className="form field validation-error">{this.state.errors.map(e => <p className="form field validation-error error-message">{e}</p>)}</div>;
  }

  reset() {
    this.state = this.initState();
    this.setState(this.state);
  }

  focus() {
  }

  abstract renderChild(): JSX.Element;

  protected focusOnControl() {
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      setTimeout(() => { this.focusOnControl() }, 100);
    }
  }

  getControlStatuses() {
    let css = [];
    if (this.state.isDirty)
      css.push("field-dirty");
    else
      css.push("field-pristine");
    if (this.state.isValid)
      css.push("field-valid");
    else
      css.push("field-invalid");
    if (this.state.isTouched)
      css.push("field-touched");
    else
      css.push("field-untouched");
    return css.join(" ");
  }

  render() {
    return <div className={"form field " + this.getControlStatuses() + " " + this.className + " " + (this.props["className"] || "")}>
      {this.renderChild()}
    </div>
  }
}