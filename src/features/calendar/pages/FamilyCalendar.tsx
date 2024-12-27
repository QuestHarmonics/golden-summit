import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Dialog
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useCalendarStore } from '../store/calendarStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { EventForm } from '../components/EventForm';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const FamilyCalendar: React.FC = () => {
  const { events, loading: eventsLoading } = useCalendarStore();
  const { currentFamily, loading: familyLoading } = useFamilyStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openEventForm, setOpenEventForm] = useState(false);

  if (eventsLoading || familyLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Family Calendar
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenEventForm(true)}
        >
          Add Event
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {/* Calendar Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePreviousMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Calendar Grid */}
        <Grid container spacing={1}>
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Grid item xs key={day}>
              <Box sx={{ textAlign: 'center', fontWeight: 'bold', py: 1 }}>
                {day}
              </Box>
            </Grid>
          ))}

          {/* Calendar Days */}
          {daysInMonth.map(day => {
            const dayEvents = events.filter(event => {
              const eventDate = event.startDate.toDate();
              const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
              const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
              
              if (event.allDay) {
                return eventDate >= dayStart && eventDate < dayEnd;
              }

              const eventEnd = event.endDate.toDate();
              return (
                (eventDate >= dayStart && eventDate < dayEnd) ||
                (eventEnd >= dayStart && eventEnd < dayEnd) ||
                (eventDate <= dayStart && eventEnd >= dayEnd)
              );
            });

            return (
              <Grid item xs key={day.toISOString()}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1,
                    height: '100px',
                    bgcolor: isToday(day) ? 'action.hover' : 'background.paper',
                    opacity: isSameMonth(day, currentDate) ? 1 : 0.5,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday(day) ? 'bold' : 'regular'
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  {dayEvents.map(event => (
                    <Tooltip
                      key={event.id}
                      title={`${event.title}${event.allDay ? ' (All Day)' : ` - ${format(event.startDate.toDate(), 'h:mm a')}`}`}
                    >
                      <Box
                        sx={{
                          bgcolor: event.color || 'primary.main',
                          color: 'white',
                          borderRadius: 1,
                          p: 0.5,
                          mt: 0.5,
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {event.title}
                      </Box>
                    </Tooltip>
                  ))}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      {/* Event Form Dialog */}
      <Dialog
        open={openEventForm}
        onClose={() => setOpenEventForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <EventForm
          open={openEventForm}
          onClose={() => setOpenEventForm(false)}
          selectedDate={currentDate}
        />
      </Dialog>
    </Box>
  );
};

export default FamilyCalendar; 