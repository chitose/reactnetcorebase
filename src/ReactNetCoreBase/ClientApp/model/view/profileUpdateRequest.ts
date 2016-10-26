// Auto-generated using typewriter -> from model.tst

import { Constraints } from '../../service/validator';

export class ProfileUpdateRequest {
  firstName: string | null;
  lastName: string | null;
  password: string | null;
  passwordMatch: string | null;
  phone: string | null;
  email: string | null;
  image: string;


    static ValidationRules = {
       firstName: [Constraints.required(), Constraints.maxLength(100)],
       lastName: [Constraints.required(), Constraints.maxLength(100)],
       password: Constraints.match('passwordMatch'),
       passwordMatch: Constraints.match('password'),
       phone: Constraints.maxLength(30),
       email: [Constraints.maxLength(256), Constraints.email()]
    };

    static ColumnNames = {
       firstName : 'firstName',
       lastName : 'lastName',
       password : 'password',
       passwordMatch : 'passwordMatch',
       phone : 'phone',
       email : 'email',
       image : 'image',
   };
}