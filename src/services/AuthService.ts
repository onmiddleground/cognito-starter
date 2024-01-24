import { SignUpRequest } from '../model/SignUpRequest';
import { ServiceResponse } from '../lib/ServiceResponse';

export interface AuthService {
  signup(signUpRequest: SignUpRequest): Promise<ServiceResponse> | ServiceResponse;
  login();
}