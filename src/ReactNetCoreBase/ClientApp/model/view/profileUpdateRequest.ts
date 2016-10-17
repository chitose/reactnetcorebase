// Auto-generated using typewriter -> from model.tst

import { Constraints } from '../../service/validator';

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  password: string;
  passwordMatch: string;
  phone: string;
  email: string;
}


export let ProfileUpdateRequest_Rules = {
firstName: [Constraints.required(), Constraints.maxLength(100)],
lastName: [Constraints.required(), Constraints.maxLength(100)],
password: Constraints.match('PasswordMatch'),
passwordMatch: Constraints.match('Password'),
phone: Constraints.maxLength(30),
email: Constraints.maxLength(256)
};
