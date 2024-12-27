import OpenAI from 'openai';
import config from '../../config/env';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true
});

export interface AIResponse {
  content: string;
  role: 'assistant' | 'system' | 'user';
  timestamp: Date;
}

export async function generateResponse(
  prompt: string,
  context: Record<string, any> = {},
  systemPrompt = ''
): Promise<AIResponse> {
  if (!config.openai.isConfigured) {
    throw new Error('OpenAI API key is not configured');
  }

  if (!prompt) {
    throw new Error('Prompt is required');
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful AI assistant for a gamified life management app.'
        },
        {
          role: 'user',
          content: `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`
        }
      ],
      model: config.openai.model,
      temperature: 0.7,
      max_tokens: 500
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No response received from OpenAI');
    }

    return {
      content: completion.choices[0].message.content,
      role: 'assistant',
      timestamp: new Date()
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`OpenAI Error: ${error.message}`);
    }
    throw error;
  }
} 