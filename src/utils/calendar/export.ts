import { TimelineEvent } from '../../store/timelineStore';
import { format } from 'date-fns';

export interface CalendarExport {
  ics: string;
  google: string;
  outlook: string;
}

export function generateCalendarExports(events: TimelineEvent[]): CalendarExport {
  // Generate ICS file content
  const icsContent = generateICS(events);
  const icsBlob = new Blob([icsContent], { type: 'text/calendar' });
  const icsUrl = URL.createObjectURL(icsBlob);

  // Generate Google Calendar URL
  const googleUrl = generateGoogleUrl(events);

  // Generate Outlook URL
  const outlookUrl = generateOutlookUrl(events);

  return {
    ics: icsUrl,
    google: googleUrl,
    outlook: outlookUrl
  };
}

function generateICS(events: TimelineEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LifeRPG//Calendar//EN'
  ];

  events.forEach(event => {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.id}`);
    lines.push(`DTSTAMP:${formatDate(event.timestamp)}`);
    lines.push(`DTSTART:${formatDate(event.timestamp)}`);
    if (event.duration) {
      const end = new Date(event.timestamp.getTime() + event.duration);
      lines.push(`DTEND:${formatDate(end)}`);
    }
    lines.push(`SUMMARY:${event.title}`);
    lines.push(`DESCRIPTION:${event.description}\\n\\nXP Gained: ${event.xpGained}`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
}

function generateGoogleUrl(events: TimelineEvent[]): string {
  // Implementation for Google Calendar URL generation
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  // Add parameters for each event
  return baseUrl;
}

function generateOutlookUrl(events: TimelineEvent[]): string {
  // Implementation for Outlook URL generation
  const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';
  // Add parameters for each event
  return baseUrl;
} 