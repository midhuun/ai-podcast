import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TtsService } from './tts.service';
import { AppConfigService } from '../config/config.service';

@Module({
  imports: [HttpModule],
  providers: [TtsService, AppConfigService],
  exports: [TtsService],
})
export class TtsModule {}