import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) {}

    getUserPoolAppSecret() {
        return this.configService.get<string>("USER_POOL_SECRET");
    }

    getUserPoolAppClientId() {
        return this.configService.get<string>("USER_POOL_CLIENT_ID");
    }
}
