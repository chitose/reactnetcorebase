// Auto-generated using typewriter -> from model.tst
import { Right } from '../enums';


import {Constraints} from '../../service/validator';
export const LoginResponse_Rules = {
};
export interface LoginResponse {
  userName: string;
  rights: Right[];
  displayName: string;
  csrfToken: string;
}