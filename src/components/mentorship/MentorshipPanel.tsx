import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MentorshipType } from '../../types/mentorship';
import { MentorshipService } from '../../services/mentorshipService';

export function MentorshipPanel({ 
  taskName,
  category 
}: { 
  taskName: string;
  category: TaskCategory;
}) {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<MentorshipType>('guidance');
  const [loading, setLoading] = useState(false);
  const { xp, spendXP } = useGameStore();

  const mentorshipService = MentorshipService.getInstance();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { response, xpCost, tokensUsed } = await mentorshipService.getMentorship(
        type,
        category,
        taskName,
        question
      );

      if (xp >= xpCost) {
        spendXP(xpCost);
        // Display response...
      } else {
        // Show insufficient XP error...
      }
    } catch (error) {
      // Handle error...
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-pixel text-white mb-4">SEEK GUIDANCE</h3>
      
      <select
        value={type}
        onChange={(e) => setType(e.target.value as MentorshipType)}
        className="w-full mb-4 bg-gray-700 text-white rounded p-2"
      >
        <option value="guidance">General Guidance</option>
        <option value="technical">Technical How-To</option>
        <option value="planning">Project Planning</option>
        <option value="diagnostic">Problem Solving</option>
        <option value="review">Review Work</option>
      </select>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="What would you like to know?"
        className="w-full h-32 mb-4 bg-gray-700 text-white rounded p-2"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !question}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 
                 disabled:bg-gray-600 text-white rounded font-pixel"
      >
        {loading ? 'CONSULTING...' : 'ASK MENTOR'}
      </button>
    </div>
  );
} 