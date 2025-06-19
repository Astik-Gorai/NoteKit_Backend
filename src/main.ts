import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';
import { AuthMiddleware } from './auth/auth.middleware';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

async function bootstrap() {
const app = await NestFactory.create(AppModule);
 app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true, 
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

