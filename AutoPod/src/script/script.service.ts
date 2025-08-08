import { Injectable, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { TtsService } from '../tts/tts.service';

@Injectable()
export class ScriptService {
  private readonly logger = new Logger(ScriptService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly ttsService: TtsService,
  ) {}

  async generateScript(topic: string, minutes: number = 2): Promise<Buffer> {
    this.logger.log(`Processing script generation for topic: ${topic} (${minutes} minutes)`);

    // Validate and sanitize topic
    const sanitizedTopic = this.validateAndSanitizeTopic(topic);

    try {
      const targetMinutes = Math.max(1, Math.min(15, minutes));
      const tolerance = 0.08; // 8% delta allowed
      const maxAttempts = 3;
      let attempt = 0;
      let currentTarget = targetMinutes;
      let content = await this.aiService.generateContent(sanitizedTopic, currentTarget);

      while (attempt < maxAttempts) {
        attempt += 1;
        const words = this.countWords(content.script);
        const estimatedMinutes = this.estimateMinutesFromWords(words);
        const delta = Math.abs(estimatedMinutes - targetMinutes) / targetMinutes;
        this.logger.log(`Attempt ${attempt}: words=${words}, estimatedMinutes=${estimatedMinutes.toFixed(2)}, target=${targetMinutes}, delta=${(delta*100).toFixed(1)}%`);

        if (delta <= tolerance) {
          break;
        }

        // Adjust target minutes proportionally and regenerate
        const ratio = targetMinutes / Math.max(estimatedMinutes, 0.5);
        currentTarget = Math.max(1, Math.min(20, Math.round(currentTarget * ratio)));
        this.logger.log(`Regenerating script with adjusted target minutes: ${currentTarget}`);
        content = await this.aiService.generateContent(sanitizedTopic, currentTarget);
      }

      this.logger.log('Script generation completed successfully with duration targeting');

      // Generate audio from the script using TTS
      let audioData: Buffer | null = null;
      if (this.ttsService.isAvailable()) {
        this.logger.log('Generating audio from script...');
        this.logger.log(`Script length: ${content.script.length} characters`);
        this.logger.log(`Script preview: "${content.script.substring(0, 200)}..."`);
        audioData = await this.ttsService.generateAudio(content.script, minutes);
        if (audioData) {
          this.logger.log('Audio generation completed successfully');
        } else {
          this.logger.warn('Audio generation failed or was skipped');
        }
      } else {
        this.logger.log('TTS service not available - skipping audio generation');
      }

      if (!audioData) {
        // Create a simple fallback audio or throw a more specific error
        this.logger.error('Failed to generate audio for the script');
        throw new Error('Audio generation failed. Please try again with a different topic or check the TTS service.');
      }

      return audioData;
    } catch (error) {
      this.logger.error('Error in script generation:', error);
      
      // If it's a TTS-specific error, provide a more helpful message
      if (error.message.includes('Audio generation failed')) {
        throw new Error('Unable to generate audio at this time. Please try again later.');
      }
      
      throw new Error(`Failed to generate script: ${error.message}`);
    }
  }

  private countWords(text: string): number {
    if (!text) return 0;
    return (text.trim().match(/\b\w+\b/g) || []).length;
  }

  private estimateMinutesFromWords(words: number): number {
    const wordsPerMinute = 150; // natural read rate
    return words / wordsPerMinute;
  }

  private validateAndSanitizeTopic(topic: string): string {
    if (!topic || typeof topic !== 'string') {
      throw new Error('Topic must be a valid string');
    }

    // Basic sanitization
    const sanitized = topic.trim();
    
    if (sanitized.length === 0) {
      throw new Error('Topic cannot be empty');
    }

    if (sanitized.length > 500) {
      throw new Error('Topic is too long (max 500 characters)');
    }

    // Remove potentially harmful characters
    const cleaned = sanitized.replace(/[<>\"']/g, '');

    this.logger.debug(`Topic sanitized: "${topic}" -> "${cleaned}"`);
    
    return cleaned;
  }
}