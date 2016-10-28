// Auto-generated using typewriter -> from model.tst
import { Right } from '../enums';


export class LoginResponse {
  userName: string | null;
  rights: Right[];
  displayName: string | null;
  csrfToken: string | null;
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  rowVersion: string;
  hasImage: boolean;



    static ColumnNames = {
       userName : 'userName',
       rights : 'rights',
       displayName : 'displayName',
       csrfToken : 'csrfToken',
       id : 'id',
       firstName : 'firstName',
       lastName : 'lastName',
       email : 'email',
       phone : 'phone',
       rowVersion : 'rowVersion',
       hasImage : 'hasImage',
   };
}