import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import packageJSON from '../package.json';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openAPIPath = '/swagger';
  const config = new DocumentBuilder()
    .setTitle('Train REST API Documentation')
    .setDescription(
      'This is the swagger documentation for the Public Train Station Rest API',
    )
    .setVersion(`${packageJSON.version}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(openAPIPath, app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
