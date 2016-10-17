// Auto-generated using typewriter -> from model.tst



import {Constraints} from '../../service/validator';
export const LoginRequest_Rules = {
userName: [Constraints.required()],
password: [Constraints.required()],
};
export interface LoginRequest {
  userName: string;
  password: string;
}