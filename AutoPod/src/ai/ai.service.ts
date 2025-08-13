import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PROMPT_TEMPLATES, PromptType } from '../utils/openai.prompts';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL');

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({
      apiKey,
      ...(baseURL && { baseURL }),
    });

    this.logger.log('AI Service initialized successfully');
  }

  async generateContent(topic: string, minutes: number = 2): Promise<{
    summary: string;
    explanation: string;
    script: string;
    mood: 'happy' | 'sad' | 'relaxing' | 'suspense' | 'motivate';
  }> {
    try {
      this.logger.log(`Generating content for topic: ${topic} (${minutes} minutes)`);

      // Create prompts
      const summaryPrompt = PROMPT_TEMPLATES.SUMMARY(topic);
      const explanationPrompt = PROMPT_TEMPLATES.EXPLANATION(topic);
      const scriptPrompt = PROMPT_TEMPLATES.SCRIPT(topic, minutes);
      const moodPrompt = PROMPT_TEMPLATES.MOOD_CLASSIFIER(topic);

      // Execute all three requests in parallel
      // Parallel calls can trigger TPM limits; keep script+mood parallel for speed but SUMMARY/EXPLANATION may be removed if not needed
      const [summaryResponse, explanationResponse, scriptResponse, moodResponse] = await Promise.all([
        this.callOpenAI(summaryPrompt, 'summary'),
        this.callOpenAI(explanationPrompt, 'explanation'),
        this.callOpenAI(scriptPrompt, 'script', minutes),
        this.callOpenAI(moodPrompt, 'mood'),
      ]);

      this.logger.log('Successfully generated all content types');

      // sanitize mood to the allowed set
      const rawMood = moodResponse.trim().toLowerCase();
      const allowed: Array<'happy'|'sad'|'relaxing'|'suspense'|'motivate'> = ['happy','sad','relaxing','suspense','motivate'];
      const mood = (allowed.find(m => rawMood.includes(m)) ?? 'relaxing');

      return {
        summary: summaryResponse,
        explanation: explanationResponse,
        script: scriptResponse,
        mood,
      };
    } catch (error) {
      this.logger.error('Error generating content:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  async generateScriptAndMood(topic: string, minutes: number = 2): Promise<{
    script: string;
    mood: 'happy' | 'sad' | 'relaxing' | 'suspense' | 'motivate';
  }> {
    try {
      this.logger.log(`Generating script+mood for topic: ${topic} (${minutes} minutes)`);

      const scriptPrompt = PROMPT_TEMPLATES.SCRIPT(topic, minutes);
      const moodPrompt = PROMPT_TEMPLATES.MOOD_CLASSIFIER(topic);

      // Run sequentially to avoid TPM spikes
      const scriptResponse = await this.callOpenAI(scriptPrompt, 'script', minutes);
      const moodResponse = await this.callOpenAI(moodPrompt, 'mood');

      const rawMood = moodResponse.trim().toLowerCase();
      const allowed: Array<'happy'|'sad'|'relaxing'|'suspense'|'motivate'> = ['happy','sad','relaxing','suspense','motivate'];
      const mood = (allowed.find(m => rawMood.includes(m)) ?? 'relaxing');

      return { script: scriptResponse, mood };
    } catch (error) {
      this.logger.error('Error generating script+mood:', error);
      throw new Error(`Failed to generate script: ${error.message}`);
    }
  }

  private async callOpenAI(prompt: string, type: string, minutes?: number): Promise<string> {
    const maxRetries = 4;
    let attempt = 0;
    // Base max tokens
    let maxTokens = 600; // tighter default to reduce TPM
    if (type === 'script' && minutes) {
      // ~160 wpm, ~1.2 tok/word, buffer 1.2x, and clamp to 3000
      const estTokens = Math.floor(minutes * 160 * 1.2 * 1.2);
      maxTokens = Math.max(800, Math.min(estTokens, 3000));
      this.logger.debug(`Using ${maxTokens} max_tokens for ${minutes}-minute script`);
    } else if (type === 'mood') {
      maxTokens = 5;
    } else if (type === 'summary' || type === 'explanation') {
      maxTokens = 500;
    }

    while (attempt < maxRetries) {
      attempt += 1;
      try {
        const response = await this.openai.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature: type === 'mood' ? 0 : 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error(`No content received from OpenAI for ${type}`);
        }
        return content.trim();
      } catch (error: any) {
        const msg: string = error?.message || '';
        const is429 = String(error?.status || error?.response?.status) === '429' || msg.includes('Rate limit');
        if (!is429 || attempt >= maxRetries) {
          this.logger.error(`Error calling OpenAI for ${type}:`, error);
          throw error;
        }
        // Parse suggested wait if available
        const match = msg.match(/try again in\s+([0-9.]+)s/i);
        const waitSeconds = match ? Math.ceil(parseFloat(match[1])) : 10 * attempt;
        const waitMs = Math.min(30000, Math.max(3000, waitSeconds * 1000));
        this.logger.warn(`429 for ${type}, retrying in ${waitMs}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
    throw new Error(`Failed to get response for ${type} after ${maxRetries} retries`);
  }
}