import { useState } from 'react';
import { useProgressStore } from '../../store/progressStore';

export function QuickInputPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const skills = useProgressStore(state => state.skills);
  const updateSkill = useProgressStore(state => state.updateSkill);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick command parsing
    const parts = input.toLowerCase().split(' ');
    if (parts.length >= 3) {
      const [command, skillName, amount] = parts;
      
      if (command === 'add') {
        const skill = skills.find(s => 
          s.name.toLowerCase() === skillName || 
          s.id.toLowerCase() === skillName
        );
        
        if (skill && !isNaN(Number(amount))) {
          updateSkill(skill.id, Number(amount));
          setInput('');
        }
      }
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4">
      <div className="relative">
        {isOpen && (
          <form 
            onSubmit={handleSubmit}
            className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-lg p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="add [skill] [amount]"
              className="w-full px-3 py-2 border rounded-md"
              autoFocus
            />
            <div className="mt-2 text-sm text-gray-500">
              Example: add physical 100
            </div>
          </form>
        )}
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-500 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          {isOpen ? '×' : '+'}
        </button>
      </div>
    </div>
  );
} 