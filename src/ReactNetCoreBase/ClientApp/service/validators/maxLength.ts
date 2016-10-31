import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from './validator';

export class MaxLengthValidator extends Validator {
    constructor(private maxLength: number) {
        super();
    }

    isValid(field: FormFieldApi): string | null {
        const value = field.value<string>();
        return !value || value.length <= this.maxLength ? null :
            i18n.t("validation:max_length", {
                field: field.props.label,
                count: this.maxLength
            } as any);
    }
}