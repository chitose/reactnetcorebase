import * as ValidatorLib from 'validator';
import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from "./validator";

export class EmailValidator extends Validator {
    constructor() {
        super();
    }

    isValid(field: FormFieldApi): string | null {
        const value = field.value<string>();
        return !value || /^\s*$/.test(value) || ValidatorLib.isEmail(value) ? null :
            i18n.t("validation:email", {
                field: field.props.label
            } as any);
    }
}