# Deepgram TTS Integration Setup

This guide explains how to set up Deepgram's text-to-speech API for the AutoPod backend.

## 🎯 What Changed

- **Replaced Grok TTS** with **Deepgram Aura-2-Thalia** model
- **Better audio quality** and longer content support
- **More reliable** text-to-speech generation

## 🔑 Getting Your Deepgram API Key

1. **Sign up** at [Deepgram Console](https://console.deepgram.com/)
2. **Create a new project** or use existing one
3. **Generate API key** from the project settings
4. **Copy the API key** (starts with `3fadee9f964b14b87170e1e644ee25c24381fe0b`)

## ⚙️ Environment Configuration

Add your Deepgram API key to your `.env` file:

```env
# Required for text-to-speech
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Other required variables
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

## 🚀 Testing the Integration

### 1. Start the Backend
```bash
cd AutoPod
npm run start:dev
```

### 2. Test with curl
```bash
curl -X POST http://localhost:3000/generate-script \
  -H "Content-Type: application/json" \
  -d '{"topic": "The future of artificial intelligence"}' \
  -o test_podcast.wav
```

### 3. Test with Frontend
1. Start the frontend: `cd autopod-frontend && npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Get Started for Free"
4. Enter a topic and click "Generate Podcast"

## 🔧 API Details

### Deepgram Request Format
```bash
curl -X POST \
  -H "Authorization: Token YOUR_API_KEY" \
  -H "Content-Type: text/plain" \
  -d "Your text content here" \
  "https://api.deepgram.com/v1/speak?model=aura-2-thalia-en" \
  -o audio.mp3
```

### Features
- **Model**: `aura-2-thalia-en` (high-quality English voice)
- **Format**: MP3 output
- **Text Limit**: Up to 10,000 characters
- **Timeout**: 60 seconds for longer content

## 🐛 Troubleshooting

### Common Issues

1. **"DEEPGRAM_API_KEY not found"**
   - Check your `.env` file has the correct variable name
   - Restart the server after adding the key

2. **"Deepgram API Error: 401"**
   - Verify your API key is correct
   - Check if your Deepgram account has credits

3. **"Deepgram API Error: 400"**
   - Text might be too long (limit: 10,000 characters)
   - Check for special characters in the text

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## 📊 Performance Comparison

| Feature | Grok (Previous) | Deepgram (Current) |
|---------|----------------|-------------------|
| Audio Quality | Good | Excellent |
| Text Limit | 4,000 chars | 10,000 chars |
| Voice Options | Limited | Multiple models |
| Reliability | Variable | High |
| Cost | Per request | Per character |

## 🔄 Migration from Grok

If you were using Grok previously:

1. **Remove** `GROQ_API_KEY` from your `.env`
2. **Add** `DEEPGRAM_API_KEY` to your `.env`
3. **Restart** the server
4. **Test** with a simple topic

The API endpoint remains the same: `POST /generate-script` 