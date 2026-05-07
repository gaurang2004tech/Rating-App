import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 1. Create a standalone Express instance
const server = express();

async function bootstrap() {
  // 2. Connect NestJS to the Express instance
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  // Your existing validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS so your React frontend can talk to it
  app.enableCors();

  // 3. Initialize the app INSTEAD of listening on a port
  await app.init();
}

bootstrap();

// 4. Export the server so Vercel can route traffic to it
export default server;