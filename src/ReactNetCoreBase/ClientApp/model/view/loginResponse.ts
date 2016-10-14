// Auto-generated using typewriter -> from model.tst
import { Right } from '../enums';

export interface LoginResponse {
  userName: string;
  rights: Right[];
  displayName: string;
  csrfToken: string;
}