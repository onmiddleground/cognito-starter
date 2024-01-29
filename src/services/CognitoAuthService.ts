import {Injectable, Logger} from "@nestjs/common";
import {AppConfig} from "../configsettings/AppConfig";
import { AuthService } from './AuthService';
import {
    SignUpCommand,
    CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { ServiceResponse } from "../lib/ServiceResponse";
import { SignUpRequest } from "../model/SignUpRequest";
import { createHmac } from 'crypto';

@Injectable()
export class CognitoAuthService implements AuthService {
  private readonly logger = new Logger(CognitoAuthService.name);

  constructor(private readonly appConfig: AppConfig) {}

calculateSecretHash(username: string, clientId: string, clientSecret: string): string {
    const data = username + clientId;
    return createHmac('sha256', clientSecret).update(data, 'utf8').digest('base64');
}

  async signup(signUpRequest: SignUpRequest): Promise<ServiceResponse> {
      const client = new CognitoIdentityProviderClient({});

      const poolClientId = this.appConfig.getUserPoolAppClientId();
      const poolClientSecret = this.appConfig.getUserPoolAppSecret();

      const command = new SignUpCommand({
          ClientId: poolClientId,
          SecretHash: this.calculateSecretHash(signUpRequest.username, poolClientId, poolClientSecret),
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