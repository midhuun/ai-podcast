import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: NestConfigService) {}

  get openaiApiKey(): string {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    return apiKey;
  }

  get openaiBaseUrl(): string | undefined {
    return this.configService.get<string>('OPENAI_BASE_URL');
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get unrealSpeechApiKey(): string {
    const apiKey = this.configService.get<string>('UNREAL_SPEECH_API_KEY');
    if (!apiKey) {
      throw new Error('UNREAL_SPEECH_API_KEY is not configured');
    }
    return apiKey;
  }
}