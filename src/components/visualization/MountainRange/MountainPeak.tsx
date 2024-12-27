import React from 'react';
import { PixelatedMesh } from '../common/PixelatedMesh';

interface MountainPeakProps {
  peak: MountainPeak;
  progress: number;
  onClick: () => void;
}

export function MountainPeak({ peak, progress, onClick }: MountainPeakProps) {
  // Use simplified, angular geometry for 8-bit style
  const vertices = generatePixelatedMountain(peak.height);
  
  return (
    <group onClick={onClick}>
      {/* Base mountain shape */}
      <PixelatedMesh
        vertices={vertices}
        color="#2B2B2B"
        wireframe={false}
      />
      
      {/* Progress overlay with pixel-perfect edges */}
      <PixelatedMesh
        vertices={vertices.slice(0, Math.floor(vertices.length * progress))}
        color="#4CAF50"
        wireframe={false}
        opacity={0.8}
      />
      
      {/* Pixel-style progress markers */}
      {peak.skills.map((skill, index) => (
        <PixelMarker
          key={skill.id}
          position={calculateMarkerPosition(index, peak.height)}
          unlocked={progress >= (index + 1) / peak.skills.length}
        />
      ))}
    </group>
  );
}

function PixelMarker({ position, unlocked }: { position: [number, number, number], unlocked: boolean }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial 
        color={unlocked ? '#FFD700' : '#666666'} 
        transparent
        opacity={0.9}
      />
    </mesh>
  );
} 