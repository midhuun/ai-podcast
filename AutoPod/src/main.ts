import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/config.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);
  
  // Get configuration service
  const configService = app.get(AppConfigService);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS with explicit allowlist
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://autopod-be.vercel.app',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
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

  // Get port from config
  const port = configService.port;
  
  await app.listen(port);
  
  logger.log(`🚀 TopicScriptor is running on: http://localhost:${port} (GET / shows service info)`);
  logger.log(`📝 Environment: ${configService.nodeEnv}`);
  logger.log(`🤖 OpenAI Integration: ${configService.openaiBaseUrl ? 'Custom URL' : 'OpenAI Default'}`);
  logger.log(`🎙️ Deepgram TTS: Enabled`);
  logger.log(`📡 API Endpoint: POST http://localhost:${port}/generate-script`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});