// import { describe } from 'node:test';
// import { CognitoAuthService } from '../src/services/CognitoAuthService';
// import {AppConfig} from "../src/configsettings/AppConfig";
// jest.mock('../src/configsettings/AppConfig');
//
// describe("UserServices Test Suite", function() {
//
//   it("should sign up a user", async () => {
//     let appConfig: AppConfig;
//     jest.spyOn(appConfig, "getUserPoolAppClientId").mockImplementation(() => "mocked");
//
//
//     const userService = new CognitoAuthService();
//   })
//
// })

import { CognitoAuthService } from './CognitoAuthService';
import {AppConfig} from "../configsettings/AppConfig";
import { Test, TestingModule } from '@nestjs/testing';
jest.mock('../configsettings/AppConfig');

const getAppConfig = () => {
  const mocked = AppConfig as jest.MockedClass<typeof AppConfig>;
  mocked.prototype.getUserPoolAppClientId.mockReturnValue("FIXME");
  return mocked;
};

describe("UserServices Test Suite", function() {

  let cognitoService: CognitoAuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // ConfigModule.forRoot({
        //   envFilePath: [".env"],
        //   isGlobal: true,
        //   expandVariables: true,
        // })
      ],
      controllers: [],
      providers: [
          CognitoAuthService,
          {
            provide: AppConfig,
            useValue: getAppConfig,
          },
      ],
    }).compile();

    cognitoService = moduleRef.get<CognitoAuthService>(CognitoAuthService);
  });

  it("should sign up a user", async () => {
    await cognitoService.signup({
      email: "gary@onmiddleground.ca",
      username: "testuser",
      password: "Pass!234",
    })
  })
})


//
//
// import { AppService } from './app.service';
// import { Config } from './config';
//
// // Mock the Config class
// jest.mock('./config');
//
// describe('AppService', () => {
//   let appService: AppService;
//   let configMock: jest.Mocked<Config>;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [AppService, Config],
//     }).compile();
//
//     appService = module.get<AppService>(AppService);
//     configMock = module.get<Config>(Config) as jest.Mocked<Config>;
//   });
//
//   it('should return config value', () => {
//     const mockConfigValue = 'mockedConfigValue';
//     configMock.getValue.mockReturnValue(mockConfigValue);
//
//     const result = appService.getConfigValue();
//
//     expect(result).toBe(mockConfigValue);
//     expect(configMock.getValue).toHaveBeenCalled();
//   });
// });
