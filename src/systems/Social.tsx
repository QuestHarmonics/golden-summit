// import { RetroSoundSynth } from '../utils/RetroSoundSynth';

interface GroupReward {
  id: string;
  type: 'xp' | 'achievement' | 'item' | 'multiplier';
  value: number;
  sharedAmount?: number;  // For group distribution
  description: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: string[];  // user IDs
  startDate: Date;
  endDate: Date;
  rewards: GroupReward[];
  status: 'active' | 'completed' | 'failed';
}

export interface SocialSystem {
  groups: {
    creation: boolean;
    challenges: Challenge[];
    rewards: GroupReward[];
  };
  validation: {
    peerReview: boolean;
    proof: string[];
    reputation: number;
  }
} 