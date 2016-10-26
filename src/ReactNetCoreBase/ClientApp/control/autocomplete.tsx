import * as React from 'react';
import { FormFieldProps, FormFieldState } from '../provider/formInterface';
import { Field } from './field';
import AutoComplete from 'material-ui/AutoComplete';

interface Props extends FormFieldProps, __MaterialUI.AutoCompleteProps {
  value?: any;
  fetch?: (searchText: string) => Promise<any[]>;
}

interface State extends FormFieldState {
  dataSource: any[];
}

export class AutoCompleteField extends Field<Props, State, AutoComplete> {
  static muiName = "AutoComplete";
  className = "autocomplete";  
  

  onNewRequest = (chosenRequest: string, index: number) => {
    this.value(this.state.dataSource[index][this.props.dataSourceConfig.value]);
  }

  protected initState(): State {
    return Object.assign({}, super.initState(), {
      dataSource: []
    });
  }

  onUpdateInput = (searchText: string, dataSource: any[]) => {
    if (this.props.fetch)
      this.props.fetch(searchText).then((data) => {
        this.state.dataSource = data;
        this.setState(this.state);
      });
  }

  renderChild() {
    return <AutoComplete
      dataSource = {this.state.dataSource}
      errorText={this.getErrorElement()}
      fullWidth={true}
      floatingLabelText={this.props.label}
      {...this.propsForChild}
      onFocus={this.touched}
      onUpdateInput={this.onUpdateInput}
      onNewRequest={this.onNewRequest} />
  }
}