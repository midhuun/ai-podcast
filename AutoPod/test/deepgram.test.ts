import { Test, TestingModule } from '@nestjs/testing';
import { TtsService } from '../src/tts/tts.service';
import { HttpService } from '@nestjs/axios';

describe('Unreal Speech TTS Integration', () => {
  let service: TtsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TtsService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TtsService>(TtsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize with Unreal Speech API', () => {
    expect(service.isAvailable()).toBe(true);
  });

  it('should always be available with hardcoded API key', () => {
    // Since we hardcoded the API key, service should always be available
    expect(service.isAvailable()).toBe(true);
  });

  it('should clean text for TTS properly', () => {
    const testText = '# Header\n**Bold text** and *italic text*\n- Bullet point\n1. Numbered list';
    const result = service['cleanTextForTTS'](testText);
    expect(result).not.toContain('#');
    expect(result).not.toContain('**');
    expect(result).not.toContain('*');
    expect(result).not.toContain('-');
    expect(result).not.toContain('1.');
  });

  it('should split text into chunks correctly with default chunk size', () => {
    const longText = 'A'.repeat(8000); // 8000 characters
    const chunks = service['splitTextIntoChunks'](longText);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every(chunk => chunk.text.length <= 3000)).toBe(true);
  });

  it('should split text into chunks correctly with custom chunk size', () => {
    const longText = 'A'.repeat(8000); // 8000 characters
    const customChunkSize = 2000;
    const chunks = service['splitTextIntoChunks'](longText, customChunkSize);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every(chunk => chunk.text.length <= customChunkSize)).toBe(true);
  });

  it('should handle short text without chunking', () => {
    const shortText = 'This is a short text for testing.';
    const chunks = service['splitTextIntoChunks'](shortText);
    expect(chunks.length).toBe(1);
    expect(chunks[0].text).toBe(shortText);
  });

  it('should calculate optimal chunk size based on duration', () => {
    // Test with different durations
    const textLength = 6000;
    
    // Short duration - should use larger chunks
    const shortDurationChunk = service['calculateOptimalChunkSize'](textLength, 1);
    expect(shortDurationChunk).toBeGreaterThanOrEqual(3000);
    
    // Normal duration - should use base chunk size
    const normalDurationChunk = service['calculateOptimalChunkSize'](textLength, 8);
    expect(normalDurationChunk).toBe(3000);
    
    // Long duration with short text - should use larger chunks
    const longDurationChunk = service['calculateOptimalChunkSize'](1000, 10);
    expect(longDurationChunk).toBeGreaterThan(1000);
  });
}); 