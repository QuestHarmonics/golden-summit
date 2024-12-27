import { ID, BaseEntity } from '../shared';

export interface Region extends BaseEntity {
  name: string;
  description: string;
  type: RegionType;
  level: number;
  unlockedAt?: Date;
  connectedRegions: ID[];
  quests: ID[];
  coordinates: Coordinates;
}

export type RegionType = 
  | 'STARTING_AREA'
  | 'SKILL_DOMAIN'
  | 'CHALLENGE_ZONE'
  | 'ACHIEVEMENT_REALM';

export interface Coordinates {
  x: number;
  y: number;
} 