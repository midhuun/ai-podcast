# AutoPod

An AI-powered NestJS application that generates comprehensive content (summaries, explanations, and podcast scripts) for any given topic using OpenAI and UnrealSpeech for high-quality text-to-speech.

## 🚀 Features

- **Topic Analysis**: Generate well-structured summaries with key insights
- **Simple Explanations**: Convert complex topics into easy-to-understand content
- **Engaging Scripts**: Create podcast/YouTube scripts with a conversational tone
- **Text-to-Speech**: Convert scripts to audio using UnrealSpeech's high-quality voices
- **Parallel Processing**: All content types generated simultaneously for efficiency
- **Robust Validation**: Input validation and sanitization for security
- **Configurable AI**: Support for OpenAI and compatible APIs

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (or Groq API key)
- UnrealSpeech API key (for text-to-speech)

## 🛠️ Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd topicscriptor
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_BASE_URL=https://api.groq.com/openai/v1
   UNREAL_SPEECH_API_KEY=your_unreal_speech_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the application**:
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## 🔧 API Usage

### Generate Script Content

**Endpoint**: `POST /generate-script`

**Request Body**:
```json
{
  "topic": "Business case study of Netflix"
}
```

**Response**: Returns audio/wav file directly

### Example using curl:
```bash
curl -X POST http://localhost:3000/generate-script \
  -H "Content-Type: application/json" \
  -d '{"topic": "History of electric vehicles"}' \
  -o generated_podcast.wav
```

### Example using JavaScript:
```javascript
const response = await fetch('http://localhost:3000/generate-script', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'Business case study of Tesla'
  })
});

// Response is audio/wav file
const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
```

## 📁 Project Structure

```
src/
├── ai/                 # OpenAI integration module
│   ├── ai.module.ts
│   └── ai.service.ts
├── script/             # Main script generation module
│   ├── script.module.ts
│   ├── script.controller.ts
│   └── script.service.ts
├── dto/                # Data transfer objects
│   └── create-script.dto.ts
├── config/             # Configuration service
│   └── config.service.ts
├── utils/              # Utility functions and prompts
│   └── openai.prompts.ts
├── app.module.ts       # Main application module
└── main.ts            # Application entry point
```

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key for text generation | - |
| `DEEPGRAM_API_KEY` | Yes | Your Deepgram API key for audio generation | - |
| `OPENAI_BASE_URL` | No | Custom API endpoint (for Grok, etc.) | OpenAI default |
| `PORT` | No | Server port | 3000 |
| `NODE_ENV` | No | Environment mode | development |

### AI Model Configuration

The application uses `gpt-3.5-turbo` by default. You can modify the model in `src/ai/ai.service.ts`:

```typescript
const response = await this.openai.chat.completions.create({
  model: 'gpt-4', // Change this to your preferred model
  // ... other options
});
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Content Types Generated

### 1. Summary
- 200-300 words
- Structured with bullet points
- Includes key facts and statistics
- Citation-worthy tone
- Markdown formatted

### 2. Explanation
- 250-350 words
- Conversational and friendly tone
- Uses analogies and examples
- Avoids technical jargon
- Accessible to general audience

### 3. Script
- 400-600 words (3-4 minutes of content)
- YouTuber/podcaster style
- Engaging hooks and transitions
- Includes [PAUSE] markers
- Call-to-action elements

## 🛡️ Security Features

- Input validation and sanitization
- Character limits and type checking
- Harmful character filtering
- Environment variable validation
- Error handling and logging

## 🔧 Development

### Adding New Prompt Types

1. Add new template in `src/utils/openai.prompts.ts`
2. Update the `PromptType` type
3. Modify `AiService.generateContent()` method
4. Update DTOs and interfaces as needed

### Customizing AI Parameters

Modify `src/ai/ai.service.ts` to adjust:
- Temperature (creativity level)
- Max tokens (response length)
- Top_p (nucleus sampling)
- Frequency/presence penalties

## 📊 API Response Examples

### Successful Response:
```json
{
  "summary": "# Electric Vehicle History\n\n- **1890s**: First electric cars invented...",
  "explanation": "Electric vehicles might seem like a new invention, but they're actually...",
  "script": "Welcome back to the channel! Today we're taking a fascinating journey..."
}
```

### Error Response:
```json
{
  "statusCode": 400,
  "message": ["Topic must be at least 3 characters long"],
  "error": "Bad Request"
}
```

## 🚀 Deployment

### Using Docker (optional):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### Environment Setup for Production:
```env
NODE_ENV=production
OPENAI_API_KEY=your_production_api_key
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues:

1. **"OPENAI_API_KEY is required" error**:
   - Ensure your `.env` file exists and contains the API key
   - Verify the API key is valid

2. **API rate limits**:
   - Check your OpenAI account usage
   - Implement retry logic if needed

3. **Long response times**:
   - Consider using faster models like `gpt-3.5-turbo`
   - Reduce max_tokens if needed

4. **Module not found errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript compilation with `npm run build`

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

Built with ❤️ using NestJS and OpenAI