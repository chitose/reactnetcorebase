import * as React from 'react';
import { FormFieldProps, FormFieldState } from '../provider/formInterface';
import { Field } from './field';
import DatePicker from 'material-ui/DatePicker';
import moment from "moment";

interface Props extends FormFieldProps, __MaterialUI.DatePicker.DatePickerProps {
  value?: Date;
}

export class DatePickerField extends Field<Props, FormFieldState, DatePicker> {
  static muiName = "DatePicker";
  className = "date-picker";  

  formatDate = (date: Date) => {
    return moment(date).format("L");
  }

  renderChild() {    
    return <DatePicker
      errorText={this.getErrorElement()}
      fullWidth={true}
      floatingLabelText={this.props.label}
      {...this.propsForChild}
      formatDate={this.formatDate}
      value={this.state.value}
      onFocus={this.touched}
      onChange={(evt, date: Date) => { this.value(new Date(moment(date).format("YYYY-MM-DDT00:00:00") + "Z")) } } />
  }
}