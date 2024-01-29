import { CognitoAuthService } from './CognitoAuthService';
import {AppConfig} from "../configsettings/AppConfig";
import { Test, TestingModule } from '@nestjs/testing';

// 1. Mock the instance
jest.mock('../configsettings/AppConfig');

describe("UserServices Test Suite", function() {

  let cognitoService: CognitoAuthService;
  // 2. Assign Mocked instance to Jest
  let configMock: jest.Mocked<AppConfig>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
          CognitoAuthService,AppConfig,
      ],
    }).compile();

    cognitoService = moduleRef.get<CognitoAuthService>(CognitoAuthService);
    configMock = moduleRef.get<AppConfig>(AppConfig) as jest.Mocked<AppConfig>;
  });

  it("should sign up a user", async () => {

    // 3. Set a test value for the mocked instance
    configMock.getUserPoolAppClientId.mockReturnValue(process.env.USER_POOL_CLIENT_ID);
    configMock.getUserPoolAppSecret.mockReturnValue(process.env.USER_POOL_CLIENT_SECRET);

    await cognitoService.signup({
      email: "gary@onmiddleground.ca",
      username: "gary@onmiddleground.ca",
      password: "Pass!234",
    })
  })
})
