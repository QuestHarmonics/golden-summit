import { ID, BaseEntity } from '../shared';

export interface JournalEntry extends BaseEntity {
  title: string;
  content: string;
  mood: number;
  tags: string[];
  attachments: Attachment[];
  relatedQuests: ID[];
}

export interface Attachment {
  id: ID;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  url: string;
  thumbnail?: string;
  caption?: string;
} 