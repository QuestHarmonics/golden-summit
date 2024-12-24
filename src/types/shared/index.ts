export type ID = string;

export interface BaseEntity {
  id: ID;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  username: string;
  level: number;
  experience: number;
  energy: number;
  maxEnergy: number;
} 