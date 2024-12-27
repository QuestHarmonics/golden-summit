import React, { useState } from 'react';
import { useAIStore } from '../../store/aiStore';
import config from '../../config/env';

export function AIAdvisor() {
  const [theme, setTheme] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateQuest, getAdvice, analyzeProgress, isLoading } = useAIStore();

  if (!config.openai.isConfigured) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">AI Advisor</h3>
        <div className="text-red-600">
          OpenAI API key is not configured. Please check your environment settings.
        </div>
      </div>
    );
  }

  const handleGenerateQuest = async () => {
    if (!theme || isGenerating) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      const result = await generateQuest(theme);
      setResponse(result || 'No response received');
      setTheme('');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate quest');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGetAdvice = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      const advice = await getAdvice('general');
      setResponse(advice);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get advice');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyzeProgress = async () => {
    if (isGenerating) return;
    
    try {
      setIsGenerating(true);
      setError(null);
      const analysis = await analyzeProgress();
      setResponse(analysis);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to analyze progress');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerateQuest();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-slide-up">
      <h3 className="text-xl font-semibold mb-4">AI Advisor</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 animate-fade-out">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quest Theme
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isGenerating}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100"
              placeholder="e.g., fitness, productivity, learning"
            />
            <button
              onClick={handleGenerateQuest}
              disabled={isGenerating || !theme || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? 'Generating...' : 'Generate Quest'}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleGetAdvice}
            disabled={isGenerating || isLoading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isGenerating ? 'Getting Advice...' : 'Get Advice'}
          </button>
          <button
            onClick={handleAnalyzeProgress}
            disabled={isGenerating || isLoading}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isGenerating ? 'Analyzing...' : 'Analyze Progress'}
          </button>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md animate-slide-up">
            <h4 className="font-medium mb-2">AI Response:</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}

        {isGenerating && (
          <div className="text-center text-gray-600 animate-pulse">
            Thinking...
          </div>
        )}
      </div>
    </div>
  );
} 