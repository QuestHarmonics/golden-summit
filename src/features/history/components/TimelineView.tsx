import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import {
  Event as EventIcon,
  PhotoCamera as PhotoIcon,
  Book as StoryIcon,
  EmojiEvents as AchievementIcon,
  Work as CareerIcon,
  School as EducationIcon,
  Favorite as MarriageIcon,
  Home as ResidenceIcon,
  Public as TravelIcon,
  Church as ReligiousIcon,
  Flight as ImmigrationIcon,
  Star as OtherIcon
} from '@mui/icons-material';
import { Family, FamilyMember } from '../../family/types/Family';
import { TimelineEvent } from '../../../store/timelineStore';
import { Timestamp } from 'firebase/firestore';

interface Props {
  family: Family;
  events: TimelineEvent[];
}

const EVENT_ICONS: Record<string, React.ReactElement> = {
  Birth: <EventIcon />,
  Marriage: <MarriageIcon />,
  Education: <EducationIcon />,
  Career: <CareerIcon />,
  Achievement: <AchievementIcon />,
  Travel: <TravelIcon />,
  Residence: <ResidenceIcon />,
  'Military Service': <EventIcon />,
  'Religious Event': <ReligiousIcon />,
  Immigration: <ImmigrationIcon />,
  Death: <EventIcon />,
  Other: <OtherIcon />
};

const ACTION_ICONS: Record<string, React.ReactElement> = {
  quest: <EventIcon />,
  skill: <EducationIcon />,
  achievement: <AchievementIcon />,
  nutrition: <EventIcon />,
  custom: <OtherIcon />
};

export const TimelineView: React.FC<Props> = ({ family, events }) => {
  const theme = useTheme();

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString();
  };

  return (
    <Timeline position="alternate">
      {sortedEvents.map((event, index) => (
        <TimelineItem key={`${event.type}_${event.timestamp.getTime()}`}>
          <TimelineOppositeContent color="text.secondary">
            {formatDate(event.timestamp)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary">
              {ACTION_ICONS[event.type] || <EventIcon />}
            </TimelineDot>
            {index < sortedEvents.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                bgcolor: theme.palette.background.default
              }}
            >
              <Typography variant="h6" component="h3">
                {event.title}
              </Typography>
              <Typography>{event.description}</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={event.type}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {event.xpGained > 0 && (
                  <Chip
                    label={`+${event.xpGained} XP`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {event.duration && (
                  <Chip
                    label={`${Math.round(event.duration / 60000)}min`}
                    size="small"
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}; 