# Unreal Speech TTS Integration

This project has been updated to use Unreal Speech API instead of Deepgram for text-to-speech generation.

## Features

- **Dynamic Chunking**: Automatically calculates optimal chunk size based on requested duration
- **Character Limit Handling**: Intelligently splits text while respecting API limits
- **Parallel Processing**: Makes simultaneous API calls for multiple chunks for faster processing
- **Smart Text Splitting**: Splits at sentence boundaries when possible to maintain natural flow
- **Audio Merging**: Automatically downloads and merges audio files from multiple chunks
- **Duration-Aware Processing**: Optimizes chunk size based on content length vs expected duration
- **Robust Error Handling**: Gracefully handles partial failures and retries

## Setup

1. **Get Unreal Speech API Key**
   - Sign up at [Unreal Speech](https://unrealspeech.com/)
   - Get your API key from the dashboard

2. **Environment Configuration**
   ```bash
   # Add to your .env file
   UNREAL_SPEECH_API_KEY=your_api_key_here
   ```

3. **Dependencies**
   The following dependencies have been added for audio processing:
   - `ffmpeg-static`: For audio merging
   - `fluent-ffmpeg`: FFmpeg wrapper
   - `@types/fluent-ffmpeg`: TypeScript types

## How It Works

### Single Text (≤ 3000 characters)
1. Text is cleaned and sent to Unreal Speech API
2. API returns a URI to the audio file
3. Audio file is downloaded and returned as Buffer

### Long Text (> 3000 characters)
1. Text is split into chunks at sentence boundaries
2. Multiple parallel API calls are made to Unreal Speech
3. Audio files are downloaded from returned URIs
4. Files are merged using FFmpeg
5. Final merged audio is returned as Buffer

### Dynamic Text Chunking Strategy

The system automatically adjusts chunk size based on the relationship between text length and requested duration:

#### Chunk Size Calculation
- **Base chunk size**: 3000 characters (API limit)
- **Expected characters**: 750 characters per minute (150 words × 5 chars avg)
- **Text-to-duration ratio**: Determines optimal chunking strategy

#### Chunking Rules
1. **Short text for duration** (ratio ≤ 0.5): Use larger chunks (up to 4500 chars)
   - Example: 1000 chars for 2+ minutes → Use 1 chunk
2. **Long text for duration** (ratio ≥ 2.0): Use smaller chunks (2100 chars)
   - Example: 15000 chars for 3 minutes → Use smaller chunks for better distribution
3. **Normal text length**: Use base chunk size (3000 chars)
   - Example: 6000 chars for 8 minutes → Use 2 chunks of 3000 each

#### Text Splitting Logic
- Prefers splitting at sentence endings (., !, ?)
- Falls back to word boundaries if no sentence end found
- Maintains chronological order during merging
- Always respects API character limits

## API Response Format

Unreal Speech returns responses in this format:
```json
{
  "OutputUri": "https://unreal-expire-in-90-days.s3-us-west-2.amazonaws.com/77e97c99-f87a-4908-b0b1-69f2b29218a2-0.mp3"
}
```

## Voice Configuration

Current settings (can be modified in `tts.service.ts`):
- **Voice**: Sierra
- **Bitrate**: 320k
- **Format**: MP3
- **Output**: URI
- **Timestamps**: Sentence-level
- **Sync**: false (async processing)

## Performance Considerations

### Dynamic Optimization Examples
- **1-minute podcast**: ~750 chars → 1 chunk (no splitting needed)
- **2-minute podcast**: ~1,500 chars → 1 chunk with larger size allowance
- **5-minute podcast**: ~3,750 chars → 1-2 chunks using base size
- **8-minute podcast**: ~6,000 chars → 2 chunks of 3000 each
- **10-minute podcast**: ~7,500 chars → 2-3 chunks optimized for duration

### Performance Benefits
- **Fewer API calls**: Dynamic sizing reduces unnecessary splitting
- **Better distribution**: Long content gets evenly distributed across chunks
- **Optimal parallelization**: Chunk count matches content complexity
- **Processing time**: Parallel processing significantly reduces total time
- **Memory usage**: Temporary files are automatically cleaned up

## Testing

Create a test script:
```javascript
// test-unreal-speech.js
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function test() {
  const app = await NestFactory.create(AppModule);
  const ttsService = app.get('TtsService');
  
  const longText = "Your very long text here...".repeat(100);
  const audioBuffer = await ttsService.generateAudio(longText);
  
  if (audioBuffer) {
    console.log(`Generated audio: ${audioBuffer.length} bytes`);
  }
}

test();
```

## Error Handling

The service includes comprehensive error handling:
- **API failures**: Logs detailed error information
- **Download failures**: Continues with available chunks
- **Merge failures**: Falls back gracefully
- **Partial success**: Warns about missing chunks but continues

## Migration Notes

- Replace `DEEPGRAM_API_KEY` with `UNREAL_SPEECH_API_KEY` in environment
- No changes needed in calling code - the `generateAudio()` method signature remains the same
- Performance improvement for long texts due to parallel processing
- Higher quality audio with 320k bitrate