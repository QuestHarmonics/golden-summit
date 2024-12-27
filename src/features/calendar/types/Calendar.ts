import { Timestamp } from 'firebase/firestore';

export enum RecurrenceType {
  NONE = 'NONE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number;
  endDate?: Timestamp;
  count?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  allDay: boolean;
  color?: string;
  familyId: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  questId?: string;
  recurrence?: RecurrenceRule;
  reminders: number[]; // Minutes before event
}

export interface EventAttendee {
  userId: string;
  status: AttendeeStatus;
  responseDate?: Date;
  note?: string;
}

export enum AttendeeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  TENTATIVE = 'TENTATIVE'
}

export interface Reminder {
  eventId: string;
  userId: string;
  minutesBefore: number;
  notified: boolean;
  notificationDate?: Date;
} 