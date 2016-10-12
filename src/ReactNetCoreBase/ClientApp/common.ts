import * as React from 'react';

import { LoginResponse } from './model/view/loginResponse';

export const LANGUAGE_MODULES = ['common', 'security', 'validation'];

export interface Dictionary<T> {
    [key: string]: T;
}

export interface AppSettings {
    passwordOptions: {
        requireDigit: boolean;
        requiredLength: number;
        requireLowercase: boolean;
        requireNonAlphanumeric: boolean;
        requireUppercase: boolean;
    };
}

export interface ServerInfo {
    language: string;
    userProfile: LoginResponse;
    resources: I18next.ResourceStore;
    settings: AppSettings;
}