import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  ImageList,
  ImageListItem
} from '@mui/material';
import { useFamilyStore } from '../../../store/familyStore';
import { FamilyTradition } from '../types/FamilyTypes';

interface CreateTraditionFormData {
  name: string;
  description: string;
  frequency: FamilyTradition['frequency'];
  participants: string[];
  skills: string[];
}

interface CelebrationMemoryFormData {
  description: string;
  photos: string[];
  participants: string[];
}

export const FamilyTraditions: React.FC = () => {
  const {
    currentFamily,
    families,
    createTradition,
    celebrateTradition
  } = useFamilyStore();

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCelebrateDialogOpen, setCelebrateDialogOpen] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState<FamilyTradition | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateTraditionFormData>({
    name: '',
    description: '',
    frequency: 'monthly',
    participants: [],
    skills: []
  });
  const [celebrateFormData, setCelebrateFormData] = useState<CelebrationMemoryFormData>({
    description: '',
    photos: [],
    participants: []
  });

  if (!currentFamily || !families[currentFamily]) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          Please join or create a family to view traditions
        </Typography>
      </Box>
    );
  }

  const family = families[currentFamily];
  const activeTraditions = family.traditions.filter(t => !t.lastCelebrated || isTimeForTradition(t));
  const upcomingTraditions = family.traditions.filter(t => t.lastCelebrated && !isTimeForTradition(t));

  const handleCreateTradition = () => {
    createTradition(currentFamily, {
      name: createFormData.name,
      description: createFormData.description,
      frequency: createFormData.frequency,
      participants: createFormData.participants,
      skills: createFormData.skills,
      memories: []
    });
    setCreateDialogOpen(false);
    setCreateFormData({
      name: '',
      description: '',
      frequency: 'monthly',
      participants: [],
      skills: []
    });
  };

  const handleCelebrateTradition = () => {
    if (!selectedTradition) return;

    celebrateTradition(currentFamily, selectedTradition.id, {
      date: new Date().toISOString(),
      description: celebrateFormData.description,
      photos: celebrateFormData.photos,
      participants: celebrateFormData.participants
    });
    setCelebrateDialogOpen(false);
    setSelectedTradition(null);
    setCelebrateFormData({
      description: '',
      photos: [],
      participants: []
    });
  };

  const isTimeForTradition = (tradition: FamilyTradition): boolean => {
    if (!tradition.lastCelebrated) return true;

    const now = new Date();
    const last = new Date(tradition.lastCelebrated);
    const daysSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);

    switch (tradition.frequency) {
      case 'daily': return daysSince >= 1;
      case 'weekly': return daysSince >= 7;
      case 'monthly': return daysSince >= 30;
      case 'yearly': return daysSince >= 365;
      default: return true;
    }
  };

  const renderTraditionCard = (tradition: FamilyTradition) => {
    const isActive = !tradition.lastCelebrated || isTimeForTradition(tradition);
    const memories = tradition.memories.slice().reverse();

    return (
      <Card key={tradition.id} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              {tradition.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {tradition.description}
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Frequency:
              </Typography>
              <Chip
                label={tradition.frequency}
                size="small"
                color={isActive ? 'primary' : 'default'}
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Participants:
              </Typography>
              {tradition.participants.map(id => (
                <Chip
                  key={id}
                  label={family.members.find(m => m.id === id)?.name}
                  size="small"
                  sx={{ mr: 0.5 }}
                />
              ))}
            </Box>
            <Box>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Skills:
              </Typography>
              {tradition.skills.map(skill => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5 }}
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
            {isActive && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setSelectedTradition(tradition);
                  setCelebrateFormData({
                    description: '',
                    photos: [],
                    participants: tradition.participants
                  });
                  setCelebrateDialogOpen(true);
                }}
              >
                Celebrate Now
              </Button>
            )}
          </Grid>
          {memories.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Recent Memories
              </Typography>
              <ImageList sx={{ maxHeight: 200 }} cols={4} rowHeight={100}>
                {memories.slice(0, 4).flatMap(memory => 
                  memory.photos?.map((photo, index) => (
                    <ImageListItem key={`${memory.date}_${index}`}>
                      <img
                        src={photo}
                        alt={`Memory from ${new Date(memory.date).toLocaleDateString()}`}
                        loading="lazy"
                      />
                    </ImageListItem>
                  )) || []
                )}
              </ImageList>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Family Traditions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Tradition
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Active Traditions
        </Typography>
        {activeTraditions.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No active traditions. Create one to get started!
          </Typography>
        ) : (
          activeTraditions.map(renderTraditionCard)
        )}
      </Box>

      {upcomingTraditions.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Upcoming Traditions
          </Typography>
          {upcomingTraditions.map(renderTraditionCard)}
        </Box>
      )}

      {/* Create Tradition Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Tradition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tradition Name"
            fullWidth
            value={createFormData.name}
            onChange={e => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={createFormData.description}
            onChange={e => setCreateFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Frequency</InputLabel>
            <Select
              value={createFormData.frequency}
              onChange={e => setCreateFormData(prev => ({ ...prev, frequency: e.target.value as FamilyTradition['frequency'] }))}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Participants</InputLabel>
            <Select
              multiple
              value={createFormData.participants}
              onChange={e => setCreateFormData(prev => ({ ...prev, participants: e.target.value as string[] }))}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(id => (
                    <Chip
                      key={id}
                      label={family.members.find(m => m.id === id)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {family.members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateTradition}
            disabled={!createFormData.name || !createFormData.description || createFormData.participants.length === 0}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Celebrate Tradition Dialog */}
      <Dialog
        open={isCelebrateDialogOpen}
        onClose={() => setCelebrateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Celebrate Tradition</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memory Description"
            fullWidth
            multiline
            rows={3}
            value={celebrateFormData.description}
            onChange={e => setCelebrateFormData(prev => ({ ...prev, description: e.target.value }))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Participants</InputLabel>
            <Select
              multiple
              value={celebrateFormData.participants}
              onChange={e => setCelebrateFormData(prev => ({ ...prev, participants: e.target.value as string[] }))}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(id => (
                    <Chip
                      key={id}
                      label={family.members.find(m => m.id === id)?.name}
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {family.members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Photo upload functionality would be implemented here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCelebrateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCelebrateTradition}
            disabled={!celebrateFormData.description || celebrateFormData.participants.length === 0}
          >
            Celebrate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 