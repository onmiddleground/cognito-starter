import { describe } from 'node:test';
import { DefaultAuthService } from '../src/services/DefaultAuthService';
jest.mock('../src/configsettings/AppConfig');

describe("UserServices Test Suite", function() {

  it("should sign up a user", async () => {
    let appConfig: AppConfig;
    jest.spyOn(appConfig, "getUserPoolAppClientId").mockImplementation(() => "mocked");

    const userService = new DefaultAuthService();
  })

})