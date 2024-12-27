import React, { useState } from 'react';
import { LifePath } from '../../types/core';
import { useSkillStore } from '../../store/skillStore';
import { getPathColor } from '../../utils/pathStyles';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: any) => void;
}

export function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [path, setPath] = useState<LifePath>('maintenance');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'once'>('daily');
  const { skills } = useSkillStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      path,
      frequency,
      progress: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md p-6 border-2 border-gray-700">
        <h2 className="font-pixel text-xl text-white mb-6">NEW TASK</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-pixel text-sm text-gray-400 mb-1">
              TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-pixel text-sm text-gray-400 mb-1">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-gray-900 border-2 border-gray-700 rounded px-3 py-2 text-white focus:border-purple-500 outline-none h-24"
            />
          </div>

          {/* Path Selection */}
          <div>
            <label className="block font-pixel text-sm text-gray-400 mb-1">
              PATH
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['artistry', 'entrepreneurship', 'homesteading', 'maintenance'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPath(p)}
                  className={`
                    px-3 py-2 rounded font-pixel text-sm
                    ${path === p 
                      ? `bg-${getPathColor(p)} bg-opacity-20 text-${getPathColor(p)}`
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-700'}
                  `}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="block font-pixel text-sm text-gray-400 mb-1">
              FREQUENCY
            </label>
            <div className="flex gap-2">
              {(['daily', 'weekly', 'once'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFrequency(f)}
                  className={`
                    flex-1 px-3 py-2 rounded font-pixel text-sm
                    ${frequency === f 
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-700'}
                  `}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-pixel rounded"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-pixel rounded"
            >
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 