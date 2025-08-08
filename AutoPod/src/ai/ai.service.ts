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
  }> {
    try {
      this.logger.log(`Generating content for topic: ${topic} (${minutes} minutes)`);

      // Create all three prompts
      const summaryPrompt = PROMPT_TEMPLATES.SUMMARY(topic);
      const explanationPrompt = PROMPT_TEMPLATES.EXPLANATION(topic);
      const scriptPrompt = PROMPT_TEMPLATES.SCRIPT(topic, minutes);

      // Execute all three requests in parallel
      const [summaryResponse, explanationResponse, scriptResponse] = await Promise.all([
        this.callOpenAI(summaryPrompt, 'summary'),
        this.callOpenAI(explanationPrompt, 'explanation'),
        this.callOpenAI(scriptPrompt, 'script', minutes),
      ]);

      this.logger.log('Successfully generated all content types');

      return {
        summary: summaryResponse,
        explanation: explanationResponse,
        script: scriptResponse,
      };
    } catch (error) {
      this.logger.error('Error generating content:', error);
      throw new Error(`Failed to generate content: ${error.message}`);
    }
  }

  private async callOpenAI(prompt: string, type: string, minutes?: number): Promise<string> {
    try {
      this.logger.debug(`Calling OpenAI for ${type}${minutes ? ` (${minutes} minutes)` : ''}`);

      // Calculate max_tokens based on content type and duration
      let maxTokens = 1000; // Default for summary and explanation
      
      if (type === 'script' && minutes) {
        // For scripts: approximately 150 words per minute, ~1.3 tokens per word
        // Add buffer for quality and context
        maxTokens = Math.floor(Math.max(1000, Math.min(minutes * 150 * 1.3 * 1.5, 4000)));
        this.logger.debug(`Using ${maxTokens} max_tokens for ${minutes}-minute script`);
      }

      const response = await this.openai.chat.completions.create({
        model: 'llama-3.1-8b-instant', // You can change this to gpt-4 or other models
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error(`No content received from OpenAI for ${type}`);
      }

      this.logger.debug(`Successfully received ${type} content`);
      return content.trim();
    } catch (error) {
      this.logger.error(`Error calling OpenAI for ${type}:`, error);
      throw error;
    }
  }
}