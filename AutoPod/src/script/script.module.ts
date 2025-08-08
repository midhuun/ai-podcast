import { Module } from '@nestjs/common';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';
import { AiModule } from '../ai/ai.module';
import { TtsModule } from '../tts/tts.module';

@Module({
  imports: [AiModule, TtsModule],
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}