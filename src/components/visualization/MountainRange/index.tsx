import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MountainPeak } from './MountainPeak';
import { SkillPath } from './SkillPath';
import { useProgress } from '../../hooks/useProgress';

interface MountainRangeProps {
  peaks: MountainPeak[];
  onPeakSelect: (peakId: string) => void;
  onPathSelect: (fromId: string, toId: string) => void;
}

export function MountainRange({ peaks, onPeakSelect, onPathSelect }: MountainRangeProps) {
  const { currentProgress, skillLevels } = useProgress();

  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 20, 100], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {peaks.map(peak => (
          <MountainPeak
            key={peak.id}
            peak={peak}
            progress={currentProgress[peak.id]}
            onClick={() => onPeakSelect(peak.id)}
          />
        ))}

        {peaks.map(peak => 
          peak.connectedPeaks.map(connectedId => (
            <SkillPath
              key={`${peak.id}-${connectedId}`}
              start={peak}
              end={peaks.find(p => p.id === connectedId)!}
              progress={calculatePathProgress(peak, connectedId, skillLevels)}
              onClick={() => onPathSelect(peak.id, connectedId)}
            />
          ))
        )}

        <Environment preset="sunset" />
        <EffectComposer>
          <Bloom intensity={1.5} />
          <DepthOfField
            focusDistance={0}
            focalLength={0.02}
            bokehScale={2}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
} 