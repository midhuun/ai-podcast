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

  // Enable CORS for frontend integration
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Get port from config
  const port = configService.port;
  
  await app.listen(port);
  
  logger.log(`🚀 TopicScriptor is running on: http://localhost:${port}`);
  logger.log(`📝 Environment: ${configService.nodeEnv}`);
  logger.log(`🤖 OpenAI Integration: ${configService.openaiBaseUrl ? 'Custom URL' : 'OpenAI Default'}`);
  logger.log(`🎙️ Deepgram TTS: Enabled`);
  logger.log(`📡 API Endpoint: POST http://localhost:${port}/generate-script`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});