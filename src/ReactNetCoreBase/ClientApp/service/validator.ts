import { Dictionary } from '../common';
import * as ValidatorLib from 'validator';
import i18n from 'i18next';
import { AppSettings } from '../common';
import * as formatter from './formatter';
import { FormFieldApi } from '../provider/formInterface';

export abstract class Validator {
  abstract isValid(field: FormFieldApi): string | null;
  dependencies: string[] = [];
}

class RequiredValidator extends Validator {

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return value && value.length > 0 && !/^\s*$/.test(value)
      ? null : i18n.t("validation:required", {
        field: field.props.label
      } as any);
  }
}

class MinLengthValidator extends Validator {
  constructor(private minLength: number) {
    super();
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return value && value.length >= this.minLength ? null :
      i18n.t("validation:min_length", {
        field: field.props.label,
        count: this.minLength
      } as any);
  }
}

class MaxLengthValidator extends Validator {
  constructor(private maxLength: number) {
    super();
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return !value || value.length <= this.maxLength ? null :
      i18n.t("validation:max_length", {
        field: field.props.label,
        count: this.maxLength
      } as any);
  }
}

class MatchValidator extends Validator {
  constructor(private target) {
    super();
    this.dependencies.push(this.target);
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    const targetField = field.form.getField(this.target);
    return value === targetField.value() ? null :
      i18n.t("validation:match", {
        field: field.props.label,
        target: targetField.props.label
      } as any);
  }
}

class EmailValidator extends Validator {
  constructor() {
    super();
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value();
    return ValidatorLib.isEmail(value) ? null :
      i18n.t("validation:email", {
        field: field.props.label
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

  static maxLength(length: number) {
    return new MaxLengthValidator(length);
  }

  static match(target: string) {
    return new MatchValidator(target);
  }

  static email() {
    return new EmailValidator();
  }
}