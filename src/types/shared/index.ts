export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  username: string;
  email: string;
  avatar?: string;
  level: number;
  experience: number;
  maxExperience: number;
  energy: number;
  maxEnergy: number;
} 