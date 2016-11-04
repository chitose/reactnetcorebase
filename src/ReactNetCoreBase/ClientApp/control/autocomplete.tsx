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

  defaultFilter = (searchText: string, key: string): boolean => {
    return searchText !== '' && key.indexOf(searchText) !== -1;
  }

  onNewRequest = (chosenRequest: string, index: number) => {
    let selectedItem = null;
    if (index > -1) {
      selectedItem = this.state.dataSource[index];
    } else {
      let matchedItems = this.state.dataSource.filter(item => {
        const filterFunc = this.props.filter || this.defaultFilter;
        return filterFunc(chosenRequest, item);
      });
      selectedItem = matchedItems ? matchedItems[0] : null;
    }

    if (this.props.dataSourceConfig)
      this.value(selectedItem ? selectedItem[this.props.dataSourceConfig.value] : null);
    this.value(selectedItem || null);
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
    return <AutoComplete ref={(c) => this.childControl = c}
      dataSource={this.state.dataSource}
      errorText={this.getErrorElement()}
      fullWidth={true}
      floatingLabelText={this.props.label}
      {...this.propsForChild}
      onFocus={this.touched}
      onUpdateInput={this.onUpdateInput}
      onNewRequest={this.onNewRequest} />
  }
}