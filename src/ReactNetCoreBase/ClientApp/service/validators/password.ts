import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from '../validator';
import { AppSettings } from '../../common';

export class PasswordValidator extends Validator {
  constructor(private opts: AppSettings) {
    super();
  }

  isValid(field: FormFieldApi): string | null {
    const value = field.value<string>();
    if (!value || value.length === 0)
      return null;
    if (value.length < this.opts.passwordOptions.requiredLength)
      return i18n.t("validation:password_required_length", { value: this.opts.passwordOptions.requiredLength } as any);
    if (this.opts.passwordOptions.requireDigit && !/(.+)?(\d+)(.+)?/.test(value))
      return i18n.t("validation:password_required_digit");
    if (this.opts.passwordOptions.requireLowercase && !/(.+)?([a-z]+)(.+)?/.test(value))
      return i18n.t("validation:password_required_lowercase");
    if (this.opts.passwordOptions.requireUppercase && !/(.+)?([A-Z]+)(.+)?/.test(value))
      return i18n.t("validation:password_required_uppercase");
    if (this.opts.passwordOptions.requireNonAlphanumeric && !/(.+)?([^a-zA-Z0-9]+)(.+)?/.test(value))
      return i18n.t("validation:password_required_non_alphanumeric");
    return null;
  }
}