import * as React from 'react';

import { LoginResponse } from './model/view/loginResponse';

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
    profile: LoginResponse;
    resources: I18next.ResourceStore;
    settings: AppSettings;
}