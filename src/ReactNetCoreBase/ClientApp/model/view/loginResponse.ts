// Auto-generated using typewriter -> from model.tst
import { Right } from '../enums';


export class LoginResponse {
  userName: string;
  rights: Right[];
  displayName: string;
  csrfToken: string;



    static ColumnNames = {
       userName : 'userName',
       rights : 'rights',
       displayName : 'displayName',
       csrfToken : 'csrfToken',
   };
}