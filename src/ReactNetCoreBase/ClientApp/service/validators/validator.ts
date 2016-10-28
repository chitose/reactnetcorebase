import { FormFieldApi } from './../../provider/formInterface';
export abstract class Validator {
    abstract isValid(field: FormFieldApi): string | null;
    dependencies: string[] = [];
}