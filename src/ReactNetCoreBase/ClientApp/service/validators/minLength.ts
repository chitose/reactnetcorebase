import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from './validator';

export class MinLengthValidator extends Validator {
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