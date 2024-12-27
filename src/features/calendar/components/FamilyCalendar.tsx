import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Badge,
  Tooltip,
  Chip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Event as EventIcon,
  EmojiEvents as QuestIcon,
  Notifications as ReminderIcon
} from '@mui/icons-material';
import { useCalendarStore } from '../store/calendarStore';
import { useQuestStore } from '../../quests/store/questStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { CalendarEvent } from '../types/Calendar';
import { QuestStatus } from '../../quests/types/Quest';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export const FamilyCalendar: React.FC = () => {
  const { currentFamily } = useFamilyStore();
  const { events, selectedDate, isLoading, getFamilyEvents, setSelectedDate } = useCalendarStore();
  const { quests } = useQuestStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (currentFamily) {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);
      getFamilyEvents(currentFamily.id, start, end);
    }
  }, [currentFamily, currentMonth, getFamilyEvents]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getDayContent = (day: Date) => {
    const dayEvents = events.filter(event => isSameDay(new Date(event.startDate), day));
    const dayQuests = quests.filter(quest => 
      quest.dueDate && isSameDay(new Date(quest.dueDate), day)
    );

    return (
      <Box sx={{ height: '100%', p: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: isSameDay(day, new Date()) ? 'bold' : 'normal' }}>
          {format(day, 'd')}
        </Typography>

        {dayEvents.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {dayEvents.slice(0, 2).map((event) => (
              <Tooltip key={event.id} title={event.title}>
                <Chip
                  size="small"
                  icon={event.questId ? <QuestIcon /> : <EventIcon />}
                  label={event.title}
                  sx={{
                    mb: 0.5,
                    width: '100%',
                    backgroundColor: event.color || 'primary.main',
                    color: 'white'
                  }}
                />
              </Tooltip>
            ))}
            {dayEvents.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{dayEvents.length - 2} more
              </Typography>
            )}
          </Box>
        )}

        {dayQuests.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {dayQuests.slice(0, 2).map((quest) => (
              <Tooltip key={quest.id} title={quest.title}>
                <Chip
                  size="small"
                  icon={<QuestIcon />}
                  label={quest.title}
                  color={quest.status === QuestStatus.COMPLETED ? 'success' : 'primary'}
                  variant="outlined"
                  sx={{ mb: 0.5, width: '100%' }}
                />
              </Tooltip>
            ))}
            {dayQuests.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{dayQuests.length - 2} more
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs key={day}>
            <Typography variant="subtitle2" align="center">
              {day}
            </Typography>
          </Grid>
        ))}

        {eachDayOfInterval({
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        }).map((day) => (
          <Grid item xs key={day.toISOString()}>
            <Paper
              elevation={isSameDay(day, selectedDate) ? 3 : 1}
              sx={{
                height: 120,
                bgcolor: !isSameMonth(day, currentMonth)
                  ? 'action.disabledBackground'
                  : 'background.paper',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => handleDateClick(day)}
            >
              {getDayContent(day)}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}; 