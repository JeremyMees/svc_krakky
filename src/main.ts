import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: true },
  });
  const port = process.env.PORT || 3000;
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  await app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
}
bootstrap();
