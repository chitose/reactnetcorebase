// Auto-generated using typewriter -> from model.tst



import {Constraints} from '../../service/validator';
export const ApiResponse_Rules = {
};
export interface ApiResponse<T> {
  errorMessage: string;
  errorOptions: any;
  errorDetails: string;
  isBusinessError: boolean;
  data: T;
  statusCode: number;
}