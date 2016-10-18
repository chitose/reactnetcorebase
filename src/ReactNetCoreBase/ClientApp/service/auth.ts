
// Auto generated by typewriter from c# code. Update coresponding c# code to re-generate this file.
import {ApiResponse} from '../model/view/apiResponse';
import {HttpClientAPI} from '../provider/httpClient';

import {LoginResponse} from '../model/view/loginResponse';
import {LoginRequest} from '../model/view/loginRequest';

import { Right } from '../model/enums';


export function login(api: HttpClientAPI,request: LoginRequest) {
  return api.http<ApiResponse<LoginResponse>>(`/api/auth`, { method: 'post' , body: JSON.stringify(request) });
}



export const signout_URL = '/api/auth/signout';
export function signout(api: HttpClientAPI) {
  return api.http<ApiResponse<void>>('/api/auth/signout', { method: 'post'  });
}
