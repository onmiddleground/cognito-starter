import {Logger, Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {AppConfig} from "./configsettings/AppConfig";
import {PingController} from "./controllers/PingController";
import { AuthController } from './controllers/AuthController';
import { DefaultAuthService } from './services/DefaultAuthService';

const envPaths = [".env"];
const stage = process.env["STAGE"];
if (stage) {
    console.log(`Using Stage ${stage} and trying to load .env.${stage} ...`);
    envPaths.push(`.env.${stage}`);
} else {
    console.log(
        "Hmmmm, it appears there is no stage that can be set to perform???!!!"
    );
}

console.log("Environments supported in this deployment ", envPaths);

const getAuthService = () => {
    if (stage === "__LOCAL_DEV__") {
        Logger.debug("Using Local Cognito Security Service");
        return DefaultAuthService;
    } else {
        Logger.debug("Using Cognito Security Service");
        return DefaultAuthService;
    }
};

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPaths,
            isGlobal: true,
            expandVariables: true,
        })
    ],
    controllers: [
      PingController,
      AuthController
    ],
    providers: [
        DefaultAuthService,
        {
            provide: "AuthService",
            useClass: getAuthService(),
        },
        AppConfig
    ],
})
export class AppModule {
}
