import React, { useState } from 'react';
import { generateResponse } from '../../services/ai/openai';

export function TestAI() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      console.log('Starting API test...');
      
      // Log environment variables
      console.log('Environment variables:', {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY ? 'Present' : 'Missing',
        keyLength: import.meta.env.VITE_OPENAI_API_KEY?.length,
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV
      });

      // Test the API with a simple prompt
      const response = await generateResponse(
        'Say hello and confirm you are working',
        {},
        'You are a test assistant. Keep your response under 10 words.'
      );

      setResult(`Success! Response: ${response.content}`);
      console.log('Full response:', response);
    } catch (error) {
      console.error('Test failed:', error);
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold mb-4">Test AI Connection</h3>
      <button 
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Environment'}
      </button>
      {result && (
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
} 