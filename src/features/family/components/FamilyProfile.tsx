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
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  AvatarGroup,
  IconButton
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useFamilyStore } from '../../../store/familyStore';
import { FamilyMember, FamilySettings } from '../types/FamilyTypes';

interface EditMemberFormData {
  name: string;
  role: FamilyMember['role'];
  avatar?: string;
  skills: {
    teaching: string[];
    learning: string[];
    shared: string[];
  };
  preferences: FamilyMember['preferences'];
}

export const FamilyProfile: React.FC = () => {
  const {
    currentFamily,
    families,
    updateFamilyProfile,
    joinFamily,
    leaveFamily
  } = useFamilyStore();

  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [isEditMemberOpen, setEditMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [editMemberForm, setEditMemberForm] = useState<EditMemberFormData>({
    name: '',
    role: 'parent',
    skills: {
      teaching: [],
      learning: [],
      shared: []
    },
    preferences: {
      notificationEnabled: true,
      reminderFrequency: 'daily',
      privacyLevel: 'family'
    }
  });

  if (!currentFamily || !families[currentFamily]) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          Please join or create a family to view profile
        </Typography>
      </Box>
    );
  }

  const family = families[currentFamily];

  const handleUpdateSettings = (settings: Partial<FamilySettings>) => {
    updateFamilyProfile(currentFamily, {
      settings: {
        ...family.settings,
        ...settings
      }
    });
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setEditMemberForm({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      skills: { ...member.skills },
      preferences: { ...member.preferences }
    });
    setEditMemberOpen(true);
  };

  const handleSaveMember = () => {
    if (!selectedMember) return;

    const updatedMembers = family.members.map(member =>
      member.id === selectedMember.id
        ? {
            ...member,
            name: editMemberForm.name,
            role: editMemberForm.role,
            avatar: editMemberForm.avatar,
            skills: editMemberForm.skills,
            preferences: editMemberForm.preferences
          }
        : member
    );

    updateFamilyProfile(currentFamily, {
      members: updatedMembers
    });

    setEditMemberOpen(false);
    setSelectedMember(null);
  };

  const renderMemberCard = (member: FamilyMember) => {
    return (
      <Card key={member.id} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              src={member.avatar}
              sx={{ width: 64, height: 64 }}
            >
              {member.name.charAt(0)}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6">
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {member.role}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              onClick={() => handleEditMember(member)}
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">
          Family Profile
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setEditProfileOpen(true)}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Family Members
            </Typography>
            <Box sx={{ mb: 2 }}>
              <AvatarGroup max={6}>
                {family.members.map(member => (
                  <Avatar
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                  >
                    {member.name.charAt(0)}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Box>
            {family.members.map(renderMemberCard)}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedMember(null);
                setEditMemberForm({
                  name: '',
                  role: 'parent',
                  skills: {
                    teaching: [],
                    learning: [],
                    shared: []
                  },
                  preferences: {
                    notificationEnabled: true,
                    reminderFrequency: 'daily',
                    privacyLevel: 'family'
                  }
                });
                setEditMemberOpen(true);
              }}
            >
              Add Family Member
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Family Settings
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={family.settings.automatedQuests}
                    onChange={(e) => handleUpdateSettings({
                      automatedQuests: e.target.checked
                    })}
                  />
                }
                label="Automated Quests"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={family.settings.traditionReminders}
                    onChange={(e) => handleUpdateSettings({
                      traditionReminders: e.target.checked
                    })}
                  />
                }
                label="Tradition Reminders"
              />
            </FormGroup>

            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Privacy Level</InputLabel>
                <Select
                  value={family.settings.privacyLevel}
                  onChange={(e) => handleUpdateSettings({
                    privacyLevel: e.target.value as FamilySettings['privacyLevel']
                  })}
                >
                  <MenuItem value="private">Private</MenuItem>
                  <MenuItem value="family">Family Only</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Notification Preferences
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={family.settings.notificationPreferences.traditions}
                      onChange={(e) => handleUpdateSettings({
                        notificationPreferences: {
                          ...family.settings.notificationPreferences,
                          traditions: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Traditions"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={family.settings.notificationPreferences.quests}
                      onChange={(e) => handleUpdateSettings({
                        notificationPreferences: {
                          ...family.settings.notificationPreferences,
                          quests: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Quests"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={family.settings.notificationPreferences.achievements}
                      onChange={(e) => handleUpdateSettings({
                        notificationPreferences: {
                          ...family.settings.notificationPreferences,
                          achievements: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Achievements"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={family.settings.notificationPreferences.milestones}
                      onChange={(e) => handleUpdateSettings({
                        notificationPreferences: {
                          ...family.settings.notificationPreferences,
                          milestones: e.target.checked
                        }
                      })}
                    />
                  }
                  label="Milestones"
                />
              </FormGroup>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Member Dialog */}
      <Dialog
        open={isEditMemberOpen}
        onClose={() => setEditMemberOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedMember ? 'Edit Family Member' : 'Add Family Member'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={editMemberForm.name}
            onChange={(e) => setEditMemberForm(prev => ({
              ...prev,
              name: e.target.value
            }))}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={editMemberForm.role}
              onChange={(e) => setEditMemberForm(prev => ({
                ...prev,
                role: e.target.value as FamilyMember['role']
              }))}
            >
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="child">Child</MenuItem>
              <MenuItem value="guardian">Guardian</MenuItem>
            </Select>
          </FormControl>
          {/* Additional member fields would be added here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMemberOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMember}
            disabled={!editMemberForm.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 