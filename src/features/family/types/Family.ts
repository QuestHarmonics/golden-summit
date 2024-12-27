import { Timestamp } from 'firebase/firestore';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child';
  level: number;
  xp: number;
  userId: string;
}

export interface Family {
  id: string;
  name: string;
  createdAt: Timestamp;
  level: number;
  xp: number;
  gold: number;
  members: FamilyMember[];
  createdBy: string;
} 