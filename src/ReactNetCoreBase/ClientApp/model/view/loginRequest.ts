// Auto-generated using typewriter -> from model.tst

import { Constraints } from '../../service/validator';

export interface LoginRequest {
  userName: string;
  password: string;
}


export let LoginRequest_Rules = {
userName: [Constraints.required()],
password: [[Constraints.required(), Constraints.minLength(8)]]
};
