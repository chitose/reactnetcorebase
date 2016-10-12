import { Dictionary } from '../common';
import * as ValidatorLib from 'validator';
import i18n from 'i18next';
import { AppSettings } from '../common';
import * as formatter from './formatter';

export interface ComponentControl {
    state: {
        value: any;
    }
}

export interface ValidationResult {
    value?: any;
    message: string;
    [key: string]: any;
}

export interface Validator {
    dependencies: string[];
    isValid(value: any, context: Dictionary<any>): Dictionary<ValidationResult>;
}

class BaseValidator implements Validator {
    dependencies: string[];
    constructor(private msgKey: string, dep?: string[]) {
        this.dependencies = dep || [];
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { value: String(value) };
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return false;
    }

    isValid(value: any, context: Dictionary<any>): Dictionary<ValidationResult> {
        const errorMsg: Dictionary<ValidationResult> = {};
        errorMsg[this.msgKey] = {
            value: value,
            message: i18n.t(`validation:${this.msgKey}`, this.getMessageOpt(value))
        };
        return this.isValidInt(value, context) ? null : errorMsg;
    }
}

class RequiredValidator extends BaseValidator {
    constructor() {
        super("required");
    }
    isValidInt(value: string, context: Dictionary<any>): boolean {
        return value && value.length > 0 && !/^\s*$/.test(value);
    }
}

class IntValidator extends BaseValidator {
    constructor(private options?: ValidatorJS.IsIntOptions) {
        super("isInt");
    }

    isValidInt(value: string, context: Dictionary<any>): boolean {
        return !value || ValidatorLib.isInt(String(value), this.options);
    }
}

class SameAsValidator extends BaseValidator {
    constructor(private targetField: string, private targetFieldDisp?: string) {
        super("isSameAs", [targetField]);
        this.targetFieldDisp = targetFieldDisp || this.targetField;
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { other: this.targetFieldDisp };
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return !value || value === context[this.targetField];
    }
}

class PasswordRestrict extends BaseValidator {
    constructor(private setting: AppSettings) {
        super("passwordStrict");
    }
    isValid(value: string, context: Dictionary<any>): Dictionary<ValidationResult> {
        let passOpts = this.setting.passwordOptions;
        if (passOpts.requiredLength && value.length < passOpts.requiredLength) {
            return { password: { message: i18n.t("validation:password.length", <any>{ length: passOpts.requiredLength }) } };
        }
        if (passOpts.requireDigit && !/(.+)?\d(.+)?/gi.test(value)) {
            return { password: { message: i18n.t("validation:password.requireDigit") } };
        }
        if (passOpts.requireLowercase && !/(.+)?[a-z](.+)?/g.test(value)) {
            return { password: { message: i18n.t("validation:password.requireLowerCase") } };
        }
        if (passOpts.requireUppercase && !/(.+)?[A-Z](.+)?/g.test(value)) {
            return { password: { message: i18n.t("validation:password.requireUpperCase") } };
        }
        if (passOpts.requireNonAlphanumeric && !/(.+)?[^a-zA-Z\d](.+)?/g.test(value)) {
            return { password: { message: i18n.t("validation:password.requireNonAlphanumeric") } };
        }
        return null;
    }
}

class IsDateAfter extends BaseValidator {
    constructor(private date: Date | string) {
        super("isDateAfter");
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { date: typeof (this.date) === "string" ? this.date : formatter.formatDate(this.date as Date), value: formatter.formatDate(value) };
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return ValidatorLib.isAfter(String(value), typeof (this.date) === "string" ? context[String(this.date)] : this.date as Date);
    }
}

class IsDateBefore extends BaseValidator {
    constructor(private date?: Date | string) {
        super("isDateBefore");
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { date: typeof (this.date) === "string" ? this.date : formatter.formatDate(this.date as Date), value: formatter.formatDate(value) };
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return ValidatorLib.isBefore(String(value), typeof (this.date) === "string" ? context[String(this.date)] : this.date);
    }
}

class IsURL extends BaseValidator {
    constructor(private opts?: ValidatorJS.IsURLOptions) {
        super("isURL");
    }

    isValidInt(value: any) {
        return ValidatorLib.isURL(String(value), this.opts);
    }
}

class Pattern extends BaseValidator {
    constructor(private pattern: string | RegExp) {
        super("pattern");
    }

    protected getMessageOpt(value: any) {
        return Object.assign({}, super.getMessageOpt(value), {
            pattern: this.pattern
        });
    }

    isValidInt(value: any) {
        return ValidatorLib.matches(String(value), this.pattern);
    }
}

class IsLength extends BaseValidator {
    constructor(private min: number, private max: number) {
        super("isLength" + (min && max ? "MinMax" : (min && !max ? "Min" : (!min && max ? "Max" : ""))));
        this.min = min || 0;
        this.max = max || undefined;
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { min: String(this.min), max: String(this.max) };
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return ValidatorLib.isLength(String(value), this.min, this.max);
    }
}

class IsIn extends BaseValidator {
    constructor(private accepted: (string | number)[]) {
        super("isIn");
        if (!accepted || accepted.length === 0) {
            throw Error("IsIn required accepted values array");
        }
    }

    protected getMessageOpt(value: any): Dictionary<any> {
        return { accepted: this.accepted.join(",") };
    }

    isValidInt(value: any): boolean {
        if (typeof (this.accepted[0]) === "string") {
            return ValidatorLib.isIn(String(value), this.accepted);
        }
        return this.accepted.findIndex(value) >= 0;
    }
}

class IsDecimal extends BaseValidator {
    constructor() {
        super("isDecimal");
    }

    isValidInt(value: any, context: Dictionary<any>): boolean {
        return ValidatorLib.isDecimal(String(value));
    }
}

export class Constraints {
    static isRequired() {
        return new RequiredValidator();
    }

    static isInt(options?: ValidatorJS.IsIntOptions) {
        return new IntValidator(options);
    }

    static isSameAs(targetField: string, targetDisp?: string) {
        return new SameAsValidator(targetField, targetDisp);
    }

    static isPassword(settings: AppSettings) {
        return new PasswordRestrict(settings);
    }

    static isDateAfter(date?: Date) {
        return new IsDateAfter(date);
    }

    static isLength(min?: number, max?: number) {
        return new IsLength(min, max);
    }

    static isDecimal() {
        return new IsDecimal();
    }

    static isIn(accepted: (string | number)[]) {
        return new IsIn(accepted);
    }
}