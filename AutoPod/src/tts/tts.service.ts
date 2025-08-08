import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../config/config.service';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

interface UnrealSpeechResponse {
  OutputUri: string;
}

interface AudioChunk {
  text: string;
  index: number;
}

@Injectable()
export class TtsService {
  private readonly logger = new Logger(TtsService.name);
  private readonly unrealSpeechBaseUrl = 'https://api.v8.unrealspeech.com/speech';
  private readonly baseChunkSize = 3000; // Base character limit for Unreal Speech
  
  // Average speaking rate: ~150 words per minute
  // Average word length: ~5 characters
  // So roughly 750 characters per minute of speech
  private readonly avgCharactersPerMinute = 750;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: AppConfigService,
  ) {
    // Set FFmpeg path
    if (ffmpegStatic) {
      ffmpeg.setFfmpegPath(ffmpegStatic);
    }
    if (ffprobeInstaller && ffprobeInstaller.path) {
      ffmpeg.setFfprobePath(ffprobeInstaller.path);
    }
    this.logger.log('TTS Service initialized with Unreal Speech API');
  }

  async generateAudio(text: string, durationMinutes: number = 2): Promise<Buffer | null> {
    if (!text || text.trim().length === 0) {
      this.logger.warn('TTS generation skipped - empty text provided');
      return null;
    }

    try {
      this.logger.log(`Generating audio for text (${text.length} characters, ${durationMinutes} minutes)`);

      // Calculate dynamic chunk size based on duration
      const chunkSize = this.calculateOptimalChunkSize(text.length, durationMinutes);
      this.logger.log(`Using chunk size: ${chunkSize} characters for ${durationMinutes} minute(s)`);

      // Clean the text for TTS
      const cleanText = this.cleanTextForTTS(text);
      this.logger.log(`Cleaned text length: ${cleanText.length} characters`);

      // Check if text needs to be chunked
      if (cleanText.length <= chunkSize) {
        // Single chunk - direct API call
        return await this.generateSingleAudio(cleanText);
      } else {
        // Multiple chunks - split, generate, and merge
        return await this.generateChunkedAudio(cleanText, chunkSize);
      }
    } catch (error) {
      this.logger.error('Error generating audio:', error);
      return null;
    }
  }

  private async generateSingleAudio(text: string): Promise<Buffer | null> {
    try {
      const audioUri = await this.callUnrealSpeechAPI(text);
      if (!audioUri) {
        return null;
      }

      // Download the audio file from the URI
      return await this.downloadAudioFromUri(audioUri);
    } catch (error) {
      this.logger.error('Error generating single audio:', error);
      return null;
    }
  }

  private calculateOptimalChunkSize(textLength: number, durationMinutes: number): number {
    // Calculate expected characters based on duration
    const expectedCharacters = durationMinutes * this.avgCharactersPerMinute;
    
    // If the text is much shorter than expected, we can use larger chunks
    // If the text is much longer than expected, we should use smaller chunks for better distribution
    const textToExpectedRatio = textLength / expectedCharacters;
    
    let optimalChunkSize: number;
    
    if (textToExpectedRatio <= 0.5) {
      // Text is much shorter than expected - use larger chunks (less splitting)
      optimalChunkSize = Math.min(this.baseChunkSize * 1.5, textLength);
    } else if (textToExpectedRatio >= 2.0) {
      // Text is much longer than expected - use smaller chunks for better distribution
      optimalChunkSize = Math.max(this.baseChunkSize * 0.7, 1500);
    } else {
      // Text length is reasonable for the duration - use base chunk size
      optimalChunkSize = this.baseChunkSize;
    }
    
    // Ensure we don't exceed API limits
    optimalChunkSize = Math.min(optimalChunkSize, this.baseChunkSize);
    
    this.logger.debug(`Text length: ${textLength}, Expected: ${expectedCharacters}, Ratio: ${textToExpectedRatio.toFixed(2)}, Chunk size: ${optimalChunkSize}`);
    
    return Math.floor(optimalChunkSize);
  }

  private async generateChunkedAudio(text: string, chunkSize: number = this.baseChunkSize): Promise<Buffer | null> {
    try {
      // Split text into chunks
      const chunks = this.splitTextIntoChunks(text, chunkSize);
      this.logger.log(`Split text into ${chunks.length} chunks using ${chunkSize} characters per chunk`);

      // Generate audio sequentially with retries to guarantee ALL chunks
      const validBuffers: Buffer[] = [];
      for (const chunk of chunks) {
        const buffer = await this.generateChunkBufferWithRetry(chunk.text, 3, 750);
        if (!buffer) {
          this.logger.error(`Failed to generate audio for chunk ${chunk.index}. Aborting to avoid missing content.`);
          return null;
        }
        validBuffers.push(buffer);
      }

      // Merge audio buffers
      return await this.mergeAudioBuffersRobust(validBuffers);
    } catch (error) {
      this.logger.error('Error generating chunked audio:', error);
      return null;
    }
  }

  private async generateChunkBufferWithRetry(text: string, attempts: number, backoffMs: number): Promise<Buffer | null> {
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        const uri = await this.callUnrealSpeechAPI(text);
        if (!uri) throw new Error('No OutputUri from TTS');
        const buf = await this.downloadAudioFromUri(uri);
        if (!buf) throw new Error('Download failed');
        return buf;
      } catch (err) {
        const isLast = attempt === attempts;
        this.logger.warn(`Chunk generation attempt ${attempt}/${attempts} failed: ${err instanceof Error ? err.message : err}`);
        if (isLast) return null;
        await new Promise(r => setTimeout(r, backoffMs * attempt));
      }
    }
    return null;
  }

  private async callUnrealSpeechAPI(text: string): Promise<string | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<UnrealSpeechResponse>(
          this.unrealSpeechBaseUrl,
          {
            Text: text,
            VoiceId: "am_michael",
            Bitrate: "320k",
            AudioFormat: "mp3",
            OutputFormat: "uri",
            TimestampType: "sentence",
            sync: false
          },
          {
            headers: {
              'Authorization': `Bearer ${this.configService.unrealSpeechApiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        )
      );

      if (response.data?.OutputUri) {
        this.logger.log(`Audio URI generated: ${response.data.OutputUri}`);
        return response.data.OutputUri;
      } else {
        this.logger.error('Invalid response from Unreal Speech API');
        return null;
      }
    } catch (error) {
      this.logger.error('Error calling Unreal Speech API:', error);
      if (error.response) {
        this.logger.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        this.logger.error('Response data:', error.response.data);
      }
      return null;
    }
  }

  private async downloadAudioFromUri(uri: string): Promise<Buffer | null> {
    try {
      this.logger.log(`Downloading audio from: ${uri}`);
      
      const response = await firstValueFrom(
        this.httpService.get(uri, {
          responseType: 'arraybuffer',
          timeout: 60000, // 60 seconds for large files
        })
      );

      const audioBuffer = Buffer.from(response.data);
      this.logger.log(`Downloaded audio: ${audioBuffer.length} bytes`);
      return audioBuffer;
    } catch (error) {
      this.logger.error(`Error downloading audio from ${uri}:`, error);
      return null;
    }
  }

  private splitTextIntoChunks(text: string, chunkSize: number = this.baseChunkSize): AudioChunk[] {
    const chunks: AudioChunk[] = [];
    let currentIndex = 0;
    let currentPosition = 0;

    while (currentPosition < text.length) {
      let chunkEnd = currentPosition + chunkSize;
      
      // If we're not at the end and we would cut in the middle of a word/sentence
      if (chunkEnd < text.length) {
        // Try to find a sentence end within the last 200 characters
        const searchStart = Math.max(currentPosition, chunkEnd - 200);
        const subText = text.substring(searchStart, chunkEnd);
        const lastSentenceEnd = Math.max(
          subText.lastIndexOf('.'),
          subText.lastIndexOf('!'),
          subText.lastIndexOf('?')
        );
        
        if (lastSentenceEnd > 0) {
          chunkEnd = searchStart + lastSentenceEnd + 1;
        } else {
          // Fall back to finding a word boundary
          const lastSpace = text.lastIndexOf(' ', chunkEnd);
          if (lastSpace > currentPosition) {
            chunkEnd = lastSpace;
          }
        }
      }

      const chunkText = text.substring(currentPosition, chunkEnd).trim();
      if (chunkText.length > 0) {
        chunks.push({
          text: chunkText,
          index: currentIndex++
        });
      }

      currentPosition = chunkEnd;
    }

    return chunks;
  }

  private async mergeAudioBuffers(audioBuffers: Buffer[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Create temporary directory for audio files
        const tempDir = path.join(os.tmpdir(), `tts-merge-${Date.now()}`);
        fs.mkdirSync(tempDir, { recursive: true });

        // Write audio buffers to temporary files
        const tempFiles = audioBuffers.map((buffer, index) => {
          const tempFile = path.join(tempDir, `chunk_${index}.mp3`);
          fs.writeFileSync(tempFile, buffer);
          return tempFile;
        });

        // Create the output file path
        const outputFile = path.join(tempDir, 'merged.mp3');

        // Use FFmpeg to concatenate the audio files
        const command = ffmpeg();
        
        // Add all input files
        tempFiles.forEach(file => command.input(file));

        command
          .on('end', () => {
            try {
              // Read the merged file
              const mergedBuffer = fs.readFileSync(outputFile);
              
              // Clean up temporary files
              this.cleanupTempFiles(tempDir);
              
              this.logger.log(`Audio merged successfully: ${mergedBuffer.length} bytes`);
              resolve(mergedBuffer);
            } catch (error) {
              this.logger.error('Error reading merged audio file:', error);
              this.cleanupTempFiles(tempDir);
              reject(error);
            }
          })
          .on('error', (error) => {
            this.logger.error('FFmpeg error:', error);
            this.cleanupTempFiles(tempDir);
            reject(error);
          })
          .mergeToFile(outputFile, tempDir);

      } catch (error) {
        this.logger.error('Error setting up audio merge:', error);
        reject(error);
      }
    });
  }

  // More robust merging: transcode to WAV first, then concat with filter and encode back to MP3
  private async mergeAudioBuffersRobust(audioBuffers: Buffer[]): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      // temp dir
      const tempDir = path.join(os.tmpdir(), `tts-merge-robust-${Date.now()}`);
      try {
        fs.mkdirSync(tempDir, { recursive: true });

        // Write mp3 buffers to files and convert to wav sequentially
        const wavFiles: string[] = [];
        for (let i = 0; i < audioBuffers.length; i++) {
          const mp3Path = path.join(tempDir, `c${i}.mp3`);
          const wavPath = path.join(tempDir, `c${i}.wav`);
          fs.writeFileSync(mp3Path, audioBuffers[i]);
          await new Promise<void>((res, rej) => {
            ffmpeg(mp3Path)
              .audioCodec('pcm_s16le')
              .audioFrequency(44100)
              .audioChannels(2)
              .on('end', () => res())
              .on('error', (e: any) => rej(e))
              .save(wavPath);
          });
          wavFiles.push(wavPath);
        }

        // Concat using filter_complex
        const outputFile = path.join(tempDir, 'merged.mp3');
        const cmd = ffmpeg();
        wavFiles.forEach(f => cmd.input(f));
        cmd
          .complexFilter([`concat=n=${wavFiles.length}:v=0:a=1`])
          .audioCodec('libmp3lame')
          .audioBitrate('320k')
          .on('end', () => {
            try {
              const merged = fs.readFileSync(outputFile);
              this.cleanupTempFiles(tempDir);
              this.logger.log(`Robust merge completed: ${merged.length} bytes`);
              resolve(merged);
            } catch (e) {
              this.cleanupTempFiles(tempDir);
              reject(e);
            }
          })
          .on('error', (e: any) => {
            this.logger.error('Robust FFmpeg merge error:', e);
            this.cleanupTempFiles(tempDir);
            reject(e);
          })
          .save(outputFile);
      } catch (e) {
        this.logger.error('Error during robust merge setup:', e);
        this.cleanupTempFiles(tempDir);
        reject(e);
      }
    });
  }

  private cleanupTempFiles(tempDir: string): void {
    try {
      if (fs.existsSync(tempDir)) {
        const files = fs.readdirSync(tempDir);
        files.forEach(file => {
          fs.unlinkSync(path.join(tempDir, file));
        });
        fs.rmdirSync(tempDir);
      }
    } catch (error) {
      this.logger.warn('Error cleaning up temporary files:', error);
    }
  }

  private cleanTextForTTS(text: string): string {
    // Remove markdown formatting and special characters
    let cleaned = text
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove code blocks
      .replace(/\[(.*?)\]/g, '') // Remove brackets and their content
      .replace(/\*\s+/g, '') // Remove bullet points
      .replace(/\d+\.\s+/g, '') // Remove numbered lists
      .replace(/\[PAUSE\]/g, '.') // Replace pause markers with periods
      .replace(/\[INTRO MUSIC.*?\]/g, '') // Remove intro music markers
      .replace(/\[OUTRO MUSIC.*?\]/g, '') // Remove outro music markers
      .replace(/\[.*?\]/g, '') // Remove any remaining bracketed content
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s.,!?;:()'-]/g, '') // Remove special characters except basic punctuation
      .trim();

    this.logger.debug(`Cleaned text for TTS: ${cleaned.length} characters`);
    return cleaned;
  }

  isAvailable(): boolean {
    return true; // Always available since we have the API key hardcoded
  }
}