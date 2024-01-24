import {
    Controller,
    Headers, Inject,
    Logger,
    Post,
    Req
} from '@nestjs/common';
import {ServiceResponse} from "../lib/ServiceResponse";
import {AuthService} from "../services/AuthService";
import {FastifyRequest} from "fastify";
// import { Request } from ""

@Controller('/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(@Inject("AuthService") private readonly service: AuthService) {}

    @Post("/signup")
    async signup(@Headers("authorization") token: string) {
        this.logger.debug("::INVOKED Profile::signup");
        return this.service.signup({username: "", password: "", email: ""});
    }

    @Post('/login')
    async login(@Req() request: FastifyRequest, @Headers("authorization") token: string) {
        return ServiceResponse.createSuccess({});
    }
}
