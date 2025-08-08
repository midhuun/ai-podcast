/**
 * Sample client for testing TopicScriptor API
 * Run with: node examples/sample-request.js
 */

const API_BASE_URL = 'http://localhost:3000';

async function testTopicScriptor() {
  const topics = [
    'Business case study of Netflix',
    'History of electric vehicles',
    'Introduction to quantum computing',
    'Climate change and renewable energy'
  ];

  console.log('🚀 Testing TopicScriptor API...\n');

  for (const topic of topics) {
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
      
      // Show first 100 characters of each section
      console.log(`\n📄 Summary preview: ${result.summary.substring(0, 100)}...`);
      console.log(`📚 Explanation preview: ${result.explanation.substring(0, 100)}...`);
      console.log(`🎬 Script preview: ${result.script.substring(0, 100)}...\n`);
      
      console.log('─'.repeat(80));
      
    } catch (error) {
      console.error(`❌ Network error for "${topic}":`, error.message);
    }
  }

  // Test validation errors
  console.log('\n🧪 Testing validation...');
  
  const invalidRequests = [
    { topic: '' }, // Empty topic
    { topic: 'AI' }, // Too short
    { topic: 'A'.repeat(501) }, // Too long
    { }, // Missing topic
  ];

  for (let i = 0; i < invalidRequests.length; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidRequests[i])
      });

      if (response.status === 400) {
        const error = await response.json();
        console.log(`✅ Validation ${i + 1}: Correctly rejected - ${error.message[0] || error.message}`);
      } else {
        console.log(`❌ Validation ${i + 1}: Should have been rejected`);
      }
    } catch (error) {
      console.error(`❌ Validation test ${i + 1} failed:`, error.message);
    }
  }

  console.log('\n✅ Testing completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with native fetch support');
  console.log('💡 Or install node-fetch: npm install node-fetch');
  process.exit(1);
}

testTopicScriptor().catch(console.error);