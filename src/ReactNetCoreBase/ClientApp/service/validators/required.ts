import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from '../validator';

export class RequiredValidator extends Validator {
  isValid(field: FormFieldApi): string | null {
    const value = field.value<any>();
    return value && value.length > 0 && !/^\s*$/.test(value)
      ? null : i18n.t("validation:required", {
        field: field.props.label
      } as any);
  }
}