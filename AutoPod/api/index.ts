import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createServer, Server } from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

let server: Server | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://autopod-be.vercel.app',
    ];
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin as string)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      exposedHeaders: 'Content-Disposition',
    });

    await app.init();
    const expressApp: any = app.getHttpAdapter().getInstance();
    server = createServer(expressApp);
  }

  server.emit('request', req, res);
}

