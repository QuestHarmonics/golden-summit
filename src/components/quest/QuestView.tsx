import React from 'react';
import { QuestTimer } from './QuestTimer';
import { Quest } from '../../types/quest';

interface QuestViewProps {
  quest: Quest;
}

export function QuestView({ quest }: QuestViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-pixel">{quest.title}</h2>
        <QuestTimer questId={quest.id} />
      </div>
      
      {/* Rest of quest view */}
    </div>
  );
} 