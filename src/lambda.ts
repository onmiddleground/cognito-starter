import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from "./AppModule";
import awsLambdaFastify from '@fastify/aws-lambda';
import {Context, APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda';
import {ValidationPipe} from "@nestjs/common";
import {ResponseInterceptor} from "./filters/ResponseInterceptor";

let cachedNestApp: any;

async function initFastify(): Promise<Handler> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true
    })
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Expose API globally for all APIs that map to the CDK deployment "path" setting
  app.setGlobalPrefix('ms');

  await app.init();

  const fastifyApp: any = app.getHttpAdapter().getInstance();
  return awsLambdaFastify(fastifyApp);
}

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  cachedNestApp = cachedNestApp ?? (await initFastify());
  return cachedNestApp(event, context);
};
