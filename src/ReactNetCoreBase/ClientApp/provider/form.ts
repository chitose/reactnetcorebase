import { Dictionary } from '../common';
import { Validator, ValidationResult } from '../service/validator';

export interface FormFieldProps {
    name?: string;
    validators?: Validator[];
    disabled?: boolean;
    errorText?: __React.ReactNode;
    error?: string;
    autoFocus?: boolean;
}

export interface FormFieldState {
    errorText?: __React.ReactNode;
    error?: string;
    value?: any;
    isValid?: boolean;
    isDirty?: boolean;
    isTouched?: boolean;
}

export interface FormFieldApi {
    updateStatus(result: Dictionary<ValidationResult>, onSubmit?: boolean, cb?: () => void): void;
    props: FormFieldProps;
    state: FormFieldState;
    getFieldValue(): any;
    resetState(): void;
    focus(): void;
}

export interface FormApi {
    updateValueAndValidility(field: FormFieldApi);
    detachFromForm(field: FormFieldApi);
    attachToForm(field: FormFieldApi);
    validate(): Dictionary<any>;
    getField(name: string): FormFieldApi;
    isDirty(): boolean;
    isValid(): boolean;
    isIgnoreSaveConfirm(): boolean;
    reset(): void;
    submit(): void;
}