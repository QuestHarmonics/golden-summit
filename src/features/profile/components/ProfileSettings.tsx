import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Slider,
  Chip,
  TextField,
  Button,
  Divider,
  Alert
} from '@mui/material';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../../auth/store/authStore';
import { UserSettings, UserPreferences } from '../types/Profile';

interface ProfileSettingsProps {
  settings: UserSettings;
  preferences: UserPreferences;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  settings,
  preferences
}) => {
  const { currentUser } = useAuthStore();
  const { updateSettings, updatePreferences, loading, error } = useProfileStore();

  const handleSettingChange = async (
    key: keyof UserSettings,
    value: any,
    nestedKey?: string
  ) => {
    if (!currentUser?.uid) return;

    const updatedSettings = { ...settings };
    if (nestedKey) {
      updatedSettings[key as keyof typeof updatedSettings] = {
        ...updatedSettings[key as keyof typeof updatedSettings],
        [nestedKey]: value
      };
    } else {
      updatedSettings[key] = value;
    }

    await updateSettings(currentUser.uid, updatedSettings);
  };

  const handlePreferenceChange = async (
    key: keyof UserPreferences,
    value: any,
    nestedKey?: string
  ) => {
    if (!currentUser?.uid) return;

    const updatedPreferences = { ...preferences };
    if (nestedKey) {
      updatedPreferences[key as keyof typeof updatedPreferences] = {
        ...updatedPreferences[key as keyof typeof updatedPreferences],
        [nestedKey]: value
      };
    } else {
      updatedPreferences[key] = value;
    }

    await updatePreferences(currentUser.uid, updatedPreferences);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Theme</InputLabel>
          <Select
            value={settings.theme}
            onChange={(e) => handleSettingChange('theme', e.target.value)}
            label="Theme"
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System</MenuItem>
          </Select>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.interfacePreferences.compactMode}
                onChange={(e) =>
                  handlePreferenceChange(
                    'interfacePreferences',
                    e.target.checked,
                    'compactMode'
                  )
                }
              />
            }
            label="Compact Mode"
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.interfacePreferences.enableAnimations}
                onChange={(e) =>
                  handlePreferenceChange(
                    'interfacePreferences',
                    e.target.checked,
                    'enableAnimations'
                  )
                }
              />
            }
            label="Enable Animations"
          />
        </FormGroup>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sound Settings
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
            }
            label="Enable Sounds"
          />
        </FormGroup>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quest Preferences
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={preferences.questPreferences.difficulty}
            onChange={(e) =>
              handlePreferenceChange(
                'questPreferences',
                e.target.value,
                'difficulty'
              )
            }
            label="Difficulty"
          >
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
            <MenuItem value="adaptive">Adaptive</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Daily Quest Limit</Typography>
          <Slider
            value={preferences.questPreferences.dailyQuestLimit}
            onChange={(e, value) =>
              handlePreferenceChange(
                'questPreferences',
                value,
                'dailyQuestLimit'
              )
            }
            min={1}
            max={10}
            marks
            valueLabelDisplay="auto"
          />
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={preferences.questPreferences.autoAcceptFamily}
              onChange={(e) =>
                handlePreferenceChange(
                  'questPreferences',
                  e.target.checked,
                  'autoAcceptFamily'
                )
              }
            />
          }
          label="Auto-accept Family Quests"
        />
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.email}
                onChange={(e) =>
                  handleSettingChange('notifications', e.target.checked, 'email')
                }
              />
            }
            label="Email Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.push}
                onChange={(e) =>
                  handleSettingChange('notifications', e.target.checked, 'push')
                }
              />
            }
            label="Push Notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.questReminders}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    e.target.checked,
                    'questReminders'
                  )
                }
              />
            }
            label="Quest Reminders"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.achievementAlerts}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    e.target.checked,
                    'achievementAlerts'
                  )
                }
              />
            }
            label="Achievement Alerts"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.familyUpdates}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    e.target.checked,
                    'familyUpdates'
                  )
                }
              />
            }
            label="Family Updates"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.dailyDigest}
                onChange={(e) =>
                  handleSettingChange(
                    'notifications',
                    e.target.checked,
                    'dailyDigest'
                  )
                }
              />
            }
            label="Daily Digest"
          />
        </FormGroup>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Privacy
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Profile Visibility</InputLabel>
          <Select
            value={settings.privacy.profileVisibility}
            onChange={(e) =>
              handleSettingChange('privacy', e.target.value, 'profileVisibility')
            }
            label="Profile Visibility"
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="family">Family Only</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>

        <FormGroup sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.showAchievements}
                onChange={(e) =>
                  handleSettingChange('privacy', e.target.checked, 'showAchievements')
                }
              />
            }
            label="Show Achievements"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.showStats}
                onChange={(e) =>
                  handleSettingChange('privacy', e.target.checked, 'showStats')
                }
              />
            }
            label="Show Stats"
          />
          <FormControlLabel
            control={
              <Switch
                checked={settings.privacy.showLevel}
                onChange={(e) =>
                  handleSettingChange('privacy', e.target.checked, 'showLevel')
                }
              />
            }
            label="Show Level"
          />
        </FormGroup>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Learning Style
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Preferred Pace</InputLabel>
          <Select
            value={preferences.learningStyle.preferredPace}
            onChange={(e) =>
              handlePreferenceChange('learningStyle', e.target.value, 'preferredPace')
            }
            label="Preferred Pace"
          >
            <MenuItem value="relaxed">Relaxed</MenuItem>
            <MenuItem value="moderate">Moderate</MenuItem>
            <MenuItem value="intense">Intense</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Challenge Preference</InputLabel>
          <Select
            value={preferences.learningStyle.challengePreference}
            onChange={(e) =>
              handlePreferenceChange(
                'learningStyle',
                e.target.value,
                'challengePreference'
              )
            }
            label="Challenge Preference"
          >
            <MenuItem value="skill">Skill-based</MenuItem>
            <MenuItem value="creativity">Creativity-focused</MenuItem>
            <MenuItem value="knowledge">Knowledge-based</MenuItem>
            <MenuItem value="mixed">Mixed</MenuItem>
          </Select>
        </FormControl>
      </Paper>
    </Box>
  );
}; 