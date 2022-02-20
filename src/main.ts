import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: true },
  });
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  const config = new DocumentBuilder()
    .setTitle('Krakky API')
    .setDescription('The Krakky API documentation')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
