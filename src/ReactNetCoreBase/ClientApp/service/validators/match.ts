import i18n from 'i18next';
import { FormFieldApi } from './../../provider/formInterface';
import { Validator } from "./validator";

export class MatchValidator extends Validator {
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