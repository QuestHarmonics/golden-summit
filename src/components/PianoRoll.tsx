import { useState, useRef, useEffect } from 'react';
import { ChiptuneSynth } from '../utils/soundSynth';

const NOTES = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
const FREQUENCIES: Record<string, number> = {
  'C5': 523.25, 'B4': 493.88, 'A4': 440.00,
  'G4': 392.00, 'F4': 349.23, 'E4': 329.63,
  'D4': 293.66, 'C4': 261.63
};

interface Note {
  note: string;
  freq: number;
  start: number;
  duration: number;
  effect?: EffectType;
}

type EffectType = 'none' | 'echo' | 'vibrato' | 'bitcrush';

const effects: Record<EffectType, { color: string }> = {
  none: { color: '#4CAF50' },
  echo: { color: '#2196F3' },
  vibrato: { color: '#9C27B0' },
  bitcrush: { color: '#FF5722' }
};

type QuestState = 'active' | 'completed' | 'failed' | 'locked';

interface QuestStatus {
  id: string;
  state: QuestState;
  progress: number;
}

type RewardType = 'xp' | 'multiplier' | 'achievement' | 'item';

interface QuestReward {
  id: string;
  type: RewardType;
}

// @ts-ignore - Used for type definitions
interface Quest {
  id: string;
  status: QuestStatus;
  rewards: QuestReward[];
}

export const PianoRoll = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEffect, setCurrentEffect] = useState<EffectType>('none');
  const [gridSize, setGridSize] = useState(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const synth = useRef(new ChiptuneSynth());
  const [delayTime, setDelayTime] = useState(0.2);
  const [lfoFrequency, setLfoFrequency] = useState(6);
  const [lfoGain, setLfoGain] = useState(10);
  const [filterFrequency, setFilterFrequency] = useState(1000);
  const [attack, setAttack] = useState(0.1);
  const [release, setRelease] = useState(0.1);

  useEffect(() => {
    drawGrid();
  }, [notes, gridSize]);

  useEffect(() => {
    synth.current.setLFOGain(lfoGain);
  }, [lfoGain]);

  useEffect(() => {
    const audio = new Audio('/path/to/background-music.mp3');
    audio.loop = true;
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / NOTES.length;

    // Draw vertical lines
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, canvas.height);
      ctx.strokeStyle = i % 4 === 0 ? '#555' : '#333';
      ctx.stroke();
    }

    // Draw horizontal lines and note names
    NOTES.forEach((note, i) => {
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(canvas.width, i * cellHeight);
      ctx.strokeStyle = '#333';
      ctx.stroke();

      ctx.fillStyle = '#888';
      ctx.font = '12px monospace';
      ctx.fillText(note, 5, i * cellHeight + 15);
    });

    // Draw notes
    notes.forEach(note => {
      const y = NOTES.indexOf(note.note) * cellHeight;
      const x = (note.start / gridSize) * canvas.width;
      const width = (note.duration / gridSize) * canvas.width;

      ctx.fillStyle = effects[note.effect || 'none'].color;
      ctx.fillRect(x, y, width, cellHeight - 2);
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / NOTES.length;

    const noteIndex = Math.floor(y / cellHeight);
    const startTime = Math.floor(x / cellWidth);

    const note: Note = {
      note: NOTES[noteIndex],
      freq: FREQUENCIES[NOTES[noteIndex]],
      start: startTime,
      duration: 1,
      effect: currentEffect === 'none' ? undefined : currentEffect
    };

    setNotes([...notes, note]);
    synth.current.playNote(note.freq, 0.2, note.effect);
  };

  const playComposition = () => {
    setIsPlaying(true);
    notes.forEach(note => {
      setTimeout(() => {
        synth.current.playNote(note.freq, note.duration * 0.2, note.effect);
      }, note.start * 250);
    });
    setTimeout(() => setIsPlaying(false), gridSize * 250);
  };

  const handleEffectChange = (effect: EffectType, value: number) => {
    switch (effect) {
      case 'echo':
        setDelayTime(value);
        break;
      case 'vibrato':
        setLfoFrequency(value);
        break;
      case 'bitcrush':
        setFilterFrequency(value);
        break;
    }
  };

  const handleEnvelopeChange = (type: 'attack' | 'release', value: number) => {
    if (type === 'attack') setAttack(value);
    else setRelease(value);
  };

  const handleFilterChange = (value: number) => {
    setFilterFrequency(value);
  };

  const handleKeyClick = (note: string) => {
    const frequency = FREQUENCIES[note];
    synth.current.playNote(frequency, 0.2, currentEffect);
  };

  return (
    <div className="piano-roll">
      <div className="controls">
        <select 
          value={currentEffect} 
          onChange={(e) => setCurrentEffect(e.target.value as EffectType)}
        >
          <option value="none">No Effect</option>
          <option value="echo">Echo</option>
          <option value="vibrato">Vibrato</option>
          <option value="bitcrush">Bit Crush</option>
        </select>
        <button 
          onClick={playComposition}
          disabled={isPlaying || notes.length === 0}
        >
          {isPlaying ? 'Playing...' : 'Play'}
        </button>
        <button onClick={() => setNotes([])}>Clear</button>
        <input
          type="range"
          min="8"
          max="32"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
        />
        <span>Grid: {gridSize}</span>
      </div>

      <div className="effect-controls">
        <div>
          <label>Delay Time</label>
          <input type="range" min="0" max="1" step="0.01" value={delayTime} onChange={(e) => handleEffectChange('echo', Number(e.target.value))} />
        </div>
        <div>
          <label>LFO Frequency</label>
          <input type="range" min="0" max="20" step="0.1" value={lfoFrequency} onChange={(e) => handleEffectChange('vibrato', Number(e.target.value))} />
        </div>
        <div>
          <label>Filter Frequency</label>
          <input type="range" min="100" max="5000" step="100" value={filterFrequency} onChange={(e) => handleFilterChange(Number(e.target.value))} />
        </div>
        <div>
          <label>Attack</label>
          <input type="range" min="0" max="1" step="0.01" value={attack} onChange={(e) => handleEnvelopeChange('attack', Number(e.target.value))} />
        </div>
        <div>
          <label>Release</label>
          <input type="range" min="0" max="1" step="0.01" value={release} onChange={(e) => handleEnvelopeChange('release', Number(e.target.value))} />
        </div>
        <div>
          <label>LFO Gain</label>
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={lfoGain} 
            onChange={(e) => setLfoGain(Number(e.target.value))} 
          />
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        onClick={handleCanvasClick}
        className="piano-roll-grid"
      />

      <div className="piano-keyboard">
        {NOTES.map(note => (
          <div 
            key={note} 
            className="piano-key" 
            onClick={() => handleKeyClick(note)}
          >
            {note}
          </div>
        ))}
      </div>

      <div className="effect-legend">
        {Object.entries(effects).map(([name, { color }]) => (
          <div key={name} className="effect-item">
            <div className="color-box" style={{ background: color }} />
            <span>{name}</span>
          </div>
        ))}
      </div>

      <div className="drum-controls">
        <button onClick={() => synth.current.playDrum('kick')}>Kick</button>
        <button onClick={() => synth.current.playDrum('snare')}>Snare</button>
        <button onClick={() => synth.current.playDrum('hihat')}>Hi-Hat</button>
      </div>
    </div>
  );
}; 