export const PROMPT_TEMPLATES = {
  SUMMARY: (topic: string) => `
You are an expert researcher and content curator. Create a well-structured, comprehensive summary of the topic: "${topic}".

Requirements:
- Provide a clear, informative summary in 200-300 words
- Use bullet points for key facts and insights
- Include relevant statistics, dates, or figures when applicable
- Structure the information logically with clear sections
- Use markdown formatting for better readability
- Be factual and cite-worthy in tone
- Do not include any placeholders, host names, channel names, or template text
- Write complete, standalone content that can be read directly

Format your response as a structured summary with clear headings and bullet points.
`,

  EXPLANATION: (topic: string) => `
You are a skilled educator who can explain complex topics to a general audience. Explain the topic: "${topic}" in simple, easy-to-understand terms.

Requirements:
- Write in a conversational, friendly tone
- Use analogies and examples that anyone can understand
- Break down complex concepts into digestible parts
- Aim for 250-350 words
- Avoid jargon and technical terms (or explain them simply)
- Make it engaging and interesting to read
- Use markdown formatting for emphasis and structure
- Do not include any placeholders, host names, channel names, or template text
- Write complete, standalone content that can be read directly

Explain this topic as if you're talking to a curious friend who wants to understand it clearly.
`,

  SCRIPT: (topic: string, minutes: number = 2) => {
    // Calculate target words based on calibrated speaking rate (~180 wpm for current TTS voice)
    const wordsPerMinute = 180;
    const targetWords = minutes * wordsPerMinute;
    
    // Determine content depth based on duration
    let contentGuidance = '';
    if (minutes <= 2) {
      contentGuidance = 'Keep it concise and focused on the most essential points.';
    } else if (minutes <= 5) {
      contentGuidance = 'Include more detailed explanations, examples, and context.';
    } else if (minutes <= 8) {
      contentGuidance = 'Provide comprehensive coverage with multiple examples, detailed explanations, and various perspectives.';
    } else {
      contentGuidance = 'Create an in-depth exploration with extensive examples, detailed analysis, multiple viewpoints, and thorough explanations.';
    }
    
    return `
You are a professional podcast host creating engaging, educational content. Write a compelling podcast script about: "${topic}" that is approximately ${minutes} minutes long when spoken at a normal pace.

TARGET LENGTH: Approximately ${targetWords} words (${minutes} minutes of speaking time)

Requirements:
- Write in a conversational, engaging tone as if speaking directly to listeners
- Start with a captivating hook that immediately grabs attention
- Structure the content logically with smooth transitions between ideas
- Use storytelling techniques and real-world examples when relevant
- Include rhetorical questions to maintain audience engagement
- Add personal insights and thought-provoking observations
- ${contentGuidance}
- Make it sound natural when spoken aloud with appropriate pauses
- Use varied sentence lengths for natural rhythm
- Do not include any placeholders, host names, channel names, or template text
- Write complete, standalone content ready for text-to-speech conversion
- Do NOT use markdown formatting (no **bold**, *italic*, or [brackets])
- Do NOT include music cues, intro/outro markers, or special formatting
- Write plain text that flows naturally when spoken
 - Ensure the content is substantive enough to fill ${minutes} minutes of engaging audio
 - LENGTH RULES: Do not write fewer than ${targetWords} words. It is acceptable to exceed by up to 10% if needed for a coherent ending.

      Create a script that would captivate listeners and provide real value! The content should be rich enough to sustain ${minutes} minutes of quality audio content.
      `;
  },
  MOOD_CLASSIFIER: (topic: string) => [
    'You are selecting background music mood for a podcast episode based on the user\'s topic.',
    '',
    'Valid moods: happy, sad, relaxing, suspense, motivate',
    '',
    'Task: Given the topic, choose exactly ONE mood from the valid list that best matches the vibe the listener should feel during the episode. Consider sentiment, energy, and subject tone. Avoid over-dramatizing.',
    '',
    `Topic: ${topic}`,
    '',
    'Output rules:',
    '- Respond with only the single mood word from the list',
    '- No punctuation, no quotes, no additional text',
  ].join('\n'),
};

export type PromptType = keyof typeof PROMPT_TEMPLATES;
