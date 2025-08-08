import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScriptModule } from './script/script.module';
import { AiModule } from './ai/ai.module';
import { TtsModule } from './tts/tts.module';
import { AppConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ScriptModule,
    AiModule,
    TtsModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}