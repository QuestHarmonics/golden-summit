import { Configuration, OpenAIApi } from 'openai';
import { MentorshipType, MentorshipConfig } from '../types/mentorship';
import { TaskCategory } from '../types/tasks';

export class MentorshipService {
  private static instance: MentorshipService;
  private openai: OpenAIApi;
  private config: MentorshipConfig;

  private constructor() {
    this.openai = new OpenAIApi(new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    }));

    this.config = {
      baseXpCost: {
        'guidance': 50,
        'technical': 100,
        'planning': 150,
        'diagnostic': 200,
        'review': 75
      },
      tokenMultiplier: 0.1,
      dailyLimit: 5,
      specializations: {
        'Water Supply': ['irrigation', 'water-management', 'sustainability'],
        'Fencing': ['construction', 'security', 'maintenance'],
        // ... other categories
      }
    };
  }

  static getInstance(): MentorshipService {
    if (!MentorshipService.instance) {
      MentorshipService.instance = new MentorshipService();
    }
    return MentorshipService.instance;
  }

  async getMentorship(
    type: MentorshipType,
    category: TaskCategory,
    taskName: string,
    question: string
  ): Promise<{
    response: string;
    xpCost: number;
    tokensUsed: number;
  }> {
    const prompt = this.constructPrompt(type, category, taskName, question);
    
    const response = await this.openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `You are a wise and experienced mentor specializing in ${category}. 
                 Provide ${type} advice for sustainable farming and homesteading.`
      }, {
        role: "user",
        content: prompt
      }],
      max_tokens: 500
    });

    const tokensUsed = response.data.usage?.total_tokens || 0;
    const xpCost = this.calculateXPCost(type, tokensUsed);

    return {
      response: response.data.choices[0].message?.content || '',
      xpCost,
      tokensUsed
    };
  }

  private calculateXPCost(type: MentorshipType, tokens: number): number {
    return this.config.baseXpCost[type] + (tokens * this.config.tokenMultiplier);
  }

  private constructPrompt(
    type: MentorshipType,
    category: TaskCategory,
    taskName: string,
    question: string
  ): string {
    const specializations = this.config.specializations[category].join(', ');
    
    return `
Task: ${taskName}
Category: ${category}
Specializations: ${specializations}
Request Type: ${type}

Question: ${question}

Please provide:
1. Detailed guidance specific to the task
2. Practical steps for implementation
3. Common pitfalls to avoid
4. Sustainable alternatives or methods
5. Resource efficiency tips
`;
  }
} 