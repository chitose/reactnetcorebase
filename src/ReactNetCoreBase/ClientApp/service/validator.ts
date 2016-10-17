import { Dictionary } from '../common';
import * as ValidatorLib from 'validator';
import i18n from 'i18next';
import { AppSettings } from '../common';
import * as formatter from './formatter';
import { FormFieldApi } from '../provider/formInterface';

export interface Validator {
  isValid(field: FormFieldApi): string | null;
}

class RequiredValidator implements Validator {

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return value && value.length > 0 && !/^\s*$/.test(value)
      ? null : i18n.t("validation:required", {
        field: field.props.label
      } as any);
  }
}

class MinLengthValidator implements Validator {
  constructor(private minLength: number) {
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return value && value.length > this.minLength ? null :
      i18n.t("validation:min_length", {
        field: field.props.label,
        count: this.minLength
      } as any);
  }
}

export class Constraints {
  static required() {
    return new RequiredValidator();
  }

  static minLength(length: number) {
    return new MinLengthValidator(length);
  }
}