import {Injectable, Logger} from "@nestjs/common";
import {AppConfig} from "../configsettings/AppConfig";
import { AuthService } from './AuthService';
import {
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { ServiceResponse } from "src/lib/ServiceResponse";
import { SignUpRequest } from "src/model/SignUpRequest";

@Injectable()
export class DefaultAuthService implements AuthService {
  private readonly logger = new Logger(DefaultAuthService.name);

  constructor(private readonly appConfig: AppConfig) {}

  async signup(signUpRequest: SignUpRequest): Promise<ServiceResponse> {
      const client = new CognitoIdentityProviderClient({});

      const command = new SignUpCommand({
          ClientId: this.appConfig.getUserPoolAppClientId(),
          Username: signUpRequest.username,
          Password: signUpRequest.password,
          UserAttributes: [{ Name: "email", Value: signUpRequest.email }],
      });

      let signUpCommandOutput = await client.send(command);
      return ServiceResponse.createSuccess({});
  }

  async login() {
      
  }
}