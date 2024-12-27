import { Timestamp } from 'firebase/firestore';

export enum FamilyNodeType {
  ACTIVE = 'active',      // Active user profile
  HISTORICAL = 'historical', // Deceased/elderly relatives
  PLACEHOLDER = 'placeholder' // Living relatives without profiles
}

export enum RelationType {
  PARENT = 'parent',
  CHILD = 'child',
  SPOUSE = 'spouse',
  SIBLING = 'sibling'
}

export interface FamilyNodeBase {
  id: string;
  type: FamilyNodeType;
  firstName: string;
  lastName: string;
  birthDate?: Timestamp;
  deathDate?: Timestamp;
  gender?: 'male' | 'female' | 'other';
  profilePhoto?: string;
  biography?: string;
  lastUpdated: Timestamp;
  lastUpdatedBy: string;
}

export interface ActiveNode extends FamilyNodeBase {
  type: FamilyNodeType.ACTIVE;
  userId: string;         // Reference to actual user profile
  profileId: string;      // Reference to game profile
  isOnline: boolean;
  lastActive: Timestamp;
}

export interface HistoricalNode extends FamilyNodeBase {
  type: FamilyNodeType.HISTORICAL;
  birthPlace?: string;
  deathPlace?: string;
  occupation?: string;
  achievements?: string[];
  stories?: {
    id: string;
    title: string;
    content: string;
    addedBy: string;
    addedAt: Timestamp;
    photos?: string[];
  }[];
  historicalPhotos?: {
    url: string;
    caption: string;
    date?: Timestamp;
    addedBy: string;
    addedAt: Timestamp;
  }[];
}

export interface PlaceholderNode extends FamilyNodeBase {
  type: FamilyNodeType.PLACEHOLDER;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  inviteSent?: boolean;
  lastInviteSentAt?: Timestamp;
}

export type FamilyNode = ActiveNode | HistoricalNode | PlaceholderNode;

export interface FamilyRelation {
  id: string;
  from: string;          // Node ID
  to: string;            // Node ID
  type: RelationType;
  startDate?: Timestamp; // e.g., marriage date for spouse relations
  endDate?: Timestamp;   // e.g., divorce date
  notes?: string;
}

export interface FamilyTree {
  id: string;
  familyId: string;      // Reference to main family document
  nodes: FamilyNode[];
  relations: FamilyRelation[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  rootNodeId: string;    // Starting point for tree visualization
  settings: {
    privacyLevel: 'public' | 'family' | 'private';
    allowedEditors: string[];  // User IDs who can edit historical/placeholder nodes
    showLiving: boolean;       // Whether to show living relatives in public view
    showDates: boolean;        // Whether to show dates in public view
  };
} 