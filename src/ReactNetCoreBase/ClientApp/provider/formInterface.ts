import { Dictionary } from '../common';

export interface FormFieldProps {
  name?: string;  
  disabled?: boolean;
  autoFocus?: boolean;
  label?: string;
  value?: any;
}

export interface FormFieldState {
  value?: any;
  isValid?: boolean;
  isDirty?: boolean;
  isTouched?: boolean;
  errors: string[];
}

export interface FormFieldApi {
  updateStatus(errors: string[], onSubmit?: boolean, cb?: () => void): void;
  props: FormFieldProps;
  state: FormFieldState;
  value(val?: any): any;
  form(): FormApi;
  reset(): void;
  focus(): void;  
}

export interface FormApi {
  updateValueAndValidility(field: FormFieldApi);
  detachFromForm(field: FormFieldApi);
  attachToForm(field: FormFieldApi);
  validate(): Dictionary<string[]>;
  getField(name: string): FormFieldApi;
  isDirty(): boolean;
  isValid(): boolean;
  isIgnoreSaveConfirm(): boolean;
  reset(): void;
  submit(): void;
}