// Auto-generated using typewriter -> from model.tst

import { Constraints } from '../../service/validator';

export class LoginRequest {
  userName: string | null;
  password: string | null;


    static ValidationRules = {
       userName: Constraints.required(),
       password: Constraints.required()
    };

    static ColumnNames = {
       userName : 'userName',
       password : 'password',
   };
}