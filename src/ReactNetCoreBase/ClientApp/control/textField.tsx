import * as React from 'react';
import { FormFieldProps, FormFieldState } from '../provider/formInterface';
import { Field } from './field';
import TextField from 'material-ui/TextField';

interface Props extends FormFieldProps, __MaterialUI.TextFieldProps {
  value?: string;
}

export class FormTextField extends Field<Props, FormFieldState, TextField> {
  static muiName = "TextField";
  className = "text-box";  

  renderChild() {
    return <TextField
      errorText={this.getErrorElement()}
      fullWidth={true}
      floatingLabelText={this.props.label}
      {...this.propsForChild}
      onFocus={this.touched}
      value={this.state.value}
      onChange={(evt) => { this.value((evt.target as HTMLInputElement).value) } } />
  }
}