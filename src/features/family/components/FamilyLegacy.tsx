import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Chip,
  ImageList,
  ImageListItem,
  LinearProgress
} from '@mui/material';
import { useFamilyStore } from '../../../store/familyStore';
import { FamilyLegacy as FamilyLegacyType } from '../types/FamilyTypes';

export const FamilyLegacy: React.FC = () => {
  const { currentFamily, families } = useFamilyStore();

  if (!currentFamily || !families[currentFamily]) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          Please join or create a family to view legacies
        </Typography>
      </Box>
    );
  }

  const family = families[currentFamily];
  const achievements = family.legacies.filter(l => l.type === 'achievement');
  const milestones = family.legacies.filter(l => l.type === 'milestone');
  const traditions = family.legacies.filter(l => l.type === 'tradition');

  const renderLegacyCard = (legacy: FamilyLegacyType) => {
    return (
      <Card key={legacy.id} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              {legacy.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {legacy.description}
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Type:
              </Typography>
              <Chip
                label={legacy.type}
                size="small"
                color={
                  legacy.type === 'achievement' ? 'success' :
                  legacy.type === 'milestone' ? 'primary' :
                  'secondary'
                }
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                Participants:
              </Typography>
              {legacy.participants.map(id => (
                <Chip
                  key={id}
                  label={family.members.find(m => m.id === id)?.name}
                  size="small"
                  sx={{ mr: 0.5 }}
                />
              ))}
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" gutterBottom>
                Impact:
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (legacy.impact / 100) * 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          </Grid>
          {legacy.photos && legacy.photos.length > 0 && (
            <Grid item xs={12} sm={4}>
              <ImageList sx={{ maxHeight: 200 }} cols={2} rowHeight={100}>
                {legacy.photos.slice(0, 4).map((photo, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={photo}
                      alt={`Legacy photo ${index + 1}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Legacy
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Achievements
          </Typography>
          <Chip
            label={achievements.length}
            size="small"
            color="success"
            sx={{ ml: 1 }}
          />
        </Box>
        {achievements.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No achievements yet. Complete quests and celebrate traditions to earn achievements!
          </Typography>
        ) : (
          achievements.map(renderLegacyCard)
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Milestones
          </Typography>
          <Chip
            label={milestones.length}
            size="small"
            color="primary"
            sx={{ ml: 1 }}
          />
        </Box>
        {milestones.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No milestones reached yet. Keep growing together as a family!
          </Typography>
        ) : (
          milestones.map(renderLegacyCard)
        )}
      </Box>

      {traditions.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">
              Tradition Legacies
            </Typography>
            <Chip
              label={traditions.length}
              size="small"
              color="secondary"
              sx={{ ml: 1 }}
            />
          </Box>
          {traditions.map(renderLegacyCard)}
        </Box>
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Legacy Stats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Total Legacy Points
            </Typography>
            <Typography variant="h4">
              {family.stats.legacyPoints}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Family Level
            </Typography>
            <Typography variant="h4">
              {family.stats.familyLevel}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="text.secondary">
              Milestones Achieved
            </Typography>
            <Typography variant="h4">
              {family.stats.milestonesAchieved}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}; 