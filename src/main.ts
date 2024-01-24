import {NestFactory} from "@nestjs/core";
import {AppModule} from "./AppModule";
import {Logger, ValidationPipe} from "@nestjs/common";
import {ResponseInterceptor} from "./filters/ResponseInterceptor";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );
  const port = process.env.MS_USER_PORT || 3010;
  Logger.log(`api-gateway running on port ${port}`);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port);
}
bootstrap();
