import { PasswordValidator } from './validators/password';
import { EmailValidator } from './validators/email';
import { MatchValidator } from './validators/match';
import { MaxLengthValidator } from './validators/maxLength';
import { MinLengthValidator } from './validators/minLength';
import { RequiredValidator } from './validators/required';

export * from "./validators/validator";

import { ServerInfo } from '../common';

const serverInfo = window["serverInfos"] as ServerInfo;

export class Constraints {
  static required() {
    return new RequiredValidator();
  }

  static minLength(length: number) {
    return new MinLengthValidator(length);
  }

  static maxLength(length: number) {
    return new MaxLengthValidator(length);
  }

  static match(target: string) {
    return new MatchValidator(target);
  }

  static email() {
    return new EmailValidator();
  }

  static password() {
    return new PasswordValidator(serverInfo.settings);
  }
}