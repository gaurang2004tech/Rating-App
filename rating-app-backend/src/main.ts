import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// 1. Create a variable to hold the compiled server so it doesn't reboot on every single click
let cachedServer: express.Express;

async function bootstrap() {
  // 2. Only build the app if it hasn't been built yet
  if (!cachedServer) {
    const server = express();
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.enableCors();

    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

// 3. This is the magic Vercel Handler. It waits for bootstrap, THEN handles the request.
export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}