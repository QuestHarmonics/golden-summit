import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Timestamp } from 'firebase/firestore';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: { title: string; date: Timestamp; description: string; type?: string }) => void;
}

const EVENT_TYPES = [
  'Birth',
  'Marriage',
  'Education',
  'Career',
  'Achievement',
  'Travel',
  'Residence',
  'Military Service',
  'Religious Event',
  'Immigration',
  'Death',
  'Other'
] as const;

export const AddEventDialog: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<typeof EVENT_TYPES[number] | ''>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!date) {
      setError('Date is required');
      return;
    }
    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    onSubmit({
      title: title.trim(),
      date: Timestamp.fromDate(date),
      description: description.trim(),
      type: type || undefined
    });

    // Reset form
    setTitle('');
    setDate(null);
    setDescription('');
    setType('');
    setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Life Event</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Event Type</InputLabel>
          <Select
            value={type}
            label="Event Type"
            onChange={(e) => setType(e.target.value as typeof EVENT_TYPES[number])}
          >
            {EVENT_TYPES.map((eventType) => (
              <MenuItem key={eventType} value={eventType}>
                {eventType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          autoFocus
          margin="dense"
          label="Event Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <DatePicker
          label="Event Date"
          value={date}
          onChange={(newDate) => setDate(newDate)}
          slotProps={{
            textField: {
              fullWidth: true,
              margin: 'normal',
              sx: { mb: 2 }
            }
          }}
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          placeholder="Describe what happened during this event..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Event
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 