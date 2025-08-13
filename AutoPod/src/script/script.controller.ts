import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  UsePipes,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ScriptService } from './script.service';
import { CreateScriptDto } from '../dto/create-script.dto';

@Controller()
export class ScriptController {
  private readonly logger = new Logger(ScriptController.name);

  constructor(private readonly scriptService: ScriptService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health() {
    return { status: 'ok', service: 'AutoPod', timestamp: new Date().toISOString() };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  root() {
    return {
      service: 'AutoPod',
      status: 'running',
      endpoints: {
        generateScript: { path: '/generate-script', method: 'POST' },
        health: { path: '/health', method: 'GET' },
      },
    };
  }

  @Post('generate-script')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async generateScript(
    @Body() createScriptDto: CreateScriptDto,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Received request to generate script for topic: ${createScriptDto.topic} (${createScriptDto.minutes || 2} minutes)`);

    try {
      const audioBuffer = await this.scriptService.generateScript(
        createScriptDto.topic,
        createScriptDto.minutes || 2,
        {
          backgroundMusic: createScriptDto.backgroundMusic,
          bgmUrl: createScriptDto.bgmUrl,
          bgmVolumeDb: createScriptDto.bgmVolumeDb,
          ducking: createScriptDto.ducking,
        }
      );
      this.logger.log('Successfully generated audio content');

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="topic-script.mp3"',
        'Content-Length': audioBuffer.length,
      });

      res.send(audioBuffer);
    } catch (error) {
      this.logger.error('Error generating script audio:', error);
      // Forward error to NestJS exception layer
      throw error;
    }
  }
}