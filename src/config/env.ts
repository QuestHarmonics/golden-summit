interface OpenAIConfig {
  apiKey: string;
  isConfigured: boolean;
  model: string;
}

interface AppConfig {
  openai: OpenAIConfig;
  isDev: boolean;
}

const config: AppConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    isConfigured: Boolean(import.meta.env.VITE_OPENAI_API_KEY),
    model: 'gpt-3.5-turbo'
  },
  isDev: import.meta.env.DEV
};

export default config; 