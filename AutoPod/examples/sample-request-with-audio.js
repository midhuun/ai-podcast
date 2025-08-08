/**
 * Sample client for testing TopicScriptor API with audio generation
 * Run with: node examples/sample-request-with-audio.js
 */

const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000';

async function testTopicScriptorWithAudio() {
  const topics = [
    'Brief history of artificial intelligence',
    'Introduction to renewable energy'
  ];

  console.log('🚀 Testing TopicScriptor API with Audio Generation...\n');

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    
    try {
      console.log(`📝 Generating content for: "${topic}"`);
      
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic })
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const error = await response.json();
        console.error(`❌ Error: ${error.message}`);
        continue;
      }

      const result = await response.json();
      
      console.log(`✅ Generated in ${duration}ms`);
      console.log(`📄 Summary length: ${result.summary.length} chars`);
      console.log(`📚 Explanation length: ${result.explanation.length} chars`);
      console.log(`🎬 Script length: ${result.script.length} chars`);
      
      // Check if audio was generated
      if (result.audio) {
        console.log(`🔊 Audio generated successfully!`);
        
        // Save audio file
        const audioBuffer = Buffer.from(result.audio, 'base64');
        const fileName = `audio_${i + 1}_${Date.now()}.wav`;
        const filePath = path.join(__dirname, fileName);
        
        fs.writeFileSync(filePath, audioBuffer);
        console.log(`🎵 Audio saved to: ${fileName} (${audioBuffer.length} bytes)`);
      } else {
        console.log(`⚠️  No audio generated (TTS service may not be configured)`);
      }
      
      // Show previews
      console.log(`\n📄 Summary preview: ${result.summary.substring(0, 100)}...`);
      console.log(`📚 Explanation preview: ${result.explanation.substring(0, 100)}...`);
      console.log(`🎬 Script preview: ${result.script.substring(0, 100)}...\n`);
      
      console.log('─'.repeat(80));
      
    } catch (error) {
      console.error(`❌ Network error for "${topic}":`, error.message);
    }
  }

  console.log('\n✅ Testing completed!');
  console.log('\n💡 Tips:');
  console.log('- Audio files are saved in the examples/ directory');
  console.log('- Make sure GROQ_API_KEY is set in .env for audio generation');
  console.log('- Audio is generated in WAV format using PlayAI TTS');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with native fetch support');
  console.log('💡 Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

testTopicScriptorWithAudio().catch(console.error);