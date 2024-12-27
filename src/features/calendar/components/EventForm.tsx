import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useCalendarStore } from '../store/calendarStore';
import { useQuestStore } from '../../quests/store/questStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { RecurrenceType, RecurrenceRule } from '../types/Calendar';
import { QuestType, QuestStatus } from '../../quests/types/Quest';

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

export const EventForm: React.FC<EventFormProps> = ({ open, onClose, selectedDate }) => {
  const { currentFamily } = useFamilyStore();
  const { createEvent, error, clearError } = useCalendarStore();
  const { quests } = useQuestStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: selectedDate || new Date(),
    endDate: selectedDate || new Date(),
    allDay: false,
    questId: '',
    recurrence: { type: RecurrenceType.NONE } as RecurrenceRule,
    color: '#1976d2', // Default MUI primary color
    reminders: [30] // Default 30 minutes before
  });

  const availableQuests = quests.filter(quest => 
    quest.status === QuestStatus.AVAILABLE && 
    (quest.type === QuestType.FAMILY || quest.type === QuestType.SHARED)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFamily) return;

    try {
      await createEvent({
        ...formData,
        familyId: currentFamily.id,
        createdBy: currentFamily.members[0].id,
        attendees: currentFamily.members.map(member => member.id)
      });
      onClose();
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleTextChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date
      }));
    }
  };

  const handleQuestSelect = (e: SelectChangeEvent) => {
    const questId = e.target.value;
    const selectedQuest = quests.find(q => q.id === questId);
    
    if (selectedQuest) {
      setFormData(prev => ({
        ...prev,
        questId,
        title: selectedQuest.title,
        description: selectedQuest.description,
        color: '#f50057' // Special color for quest events
      }));
    }
  };

  const handleRecurrenceChange = (e: SelectChangeEvent) => {
    const type = e.target.value as RecurrenceType;
    setFormData(prev => ({
      ...prev,
      recurrence: { type }
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {formData.questId ? 'Schedule Quest' : 'Create Event'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Link to Quest</InputLabel>
            <Select
              value={formData.questId}
              onChange={handleQuestSelect}
              label="Link to Quest"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {availableQuests.map(quest => (
                <MenuItem key={quest.id} value={quest.id}>
                  {quest.title}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Linking to a quest will schedule it for completion
            </FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            label="Title"
            value={formData.title}
            onChange={handleTextChange('title')}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={handleTextChange('description')}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.allDay}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  allDay: e.target.checked
                }))}
              />
            }
            label="All Day"
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DateTimePicker
              label="Start"
              value={formData.startDate}
              onChange={handleDateChange('startDate')}
            />
            {!formData.allDay && (
              <DateTimePicker
                label="End"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
              />
            )}
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Recurrence</InputLabel>
            <Select
              value={formData.recurrence.type}
              onChange={handleRecurrenceChange}
              label="Recurrence"
            >
              {Object.values(RecurrenceType).map(type => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <InputLabel sx={{ mb: 1 }}>Reminders</InputLabel>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.reminders.map(minutes => (
                <Chip
                  key={minutes}
                  label={`${minutes} minutes before`}
                  onDelete={() => setFormData(prev => ({
                    ...prev,
                    reminders: prev.reminders.filter(m => m !== minutes)
                  }))}
                />
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  reminders: [...prev.reminders, 15]
                }))}
              >
                Add Reminder
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {formData.questId ? 'Schedule Quest' : 'Create Event'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 