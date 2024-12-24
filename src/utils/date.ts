import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  
  if (isToday(d)) {
    return 'Today';
  }
  
  if (isYesterday(d)) {
    return 'Yesterday';
  }
  
  return format(d, 'MMM d, yyyy');
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
} 