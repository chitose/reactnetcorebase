// Auto-generated using typewriter -> from model.tst

import { Constraints } from '../../service/validator';

export class LoginRequest {
  userName: string;
  password: string;


    static ValidationRules = {
       userName: Constraints.required(),
       password: Constraints.required()
    };

    static ColumnNames = {
       userName : 'userName',
       password : 'password',
   };
}