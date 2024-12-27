import React, { useEffect } from 'react';
import { Box, Button, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { useFamilyStore } from '../../../store/familyStore';
import { FamilyQuest } from '../types/FamilyTypes';

export const FamilyQuests: React.FC = () => {
  const {
    currentFamily,
    families,
    generateDailyQuests,
    updateQuestProgress,
    completeQuest
  } = useFamilyStore();

  useEffect(() => {
    generateDailyQuests();
  }, [generateDailyQuests]);

  if (!currentFamily || !families[currentFamily]) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">
          Please join or create a family to view quests
        </Typography>
      </Box>
    );
  }

  const family = families[currentFamily];
  const activeQuests = family.quests.filter(q => q.progress.status === 'active');
  const completedQuests = family.quests.filter(q => q.progress.status === 'completed');

  const handleUpdateProgress = (quest: FamilyQuest, memberId: string, progress: number) => {
    updateQuestProgress(currentFamily, quest.id, memberId, progress);
  };

  const handleCompleteQuest = (quest: FamilyQuest) => {
    completeQuest(currentFamily, quest.id);
  };

  const renderQuestCard = (quest: FamilyQuest) => {
    const isCompleted = quest.progress.status === 'completed';
    const progress = Math.round(quest.progress.overallProgress * 100);

    return (
      <Card
        key={quest.id}
        sx={{
          p: 2,
          mb: 2,
          opacity: isCompleted ? 0.7 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h6" gutterBottom>
              {quest.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {quest.description}
            </Typography>
            <Typography variant="body2">
              Required Participants:{' '}
              {quest.participants.required.map(id => 
                family.members.find(m => m.id === id)?.name
              ).join(', ')}
            </Typography>
            {quest.participants.optional.length > 0 && (
              <Typography variant="body2">
                Optional Participants:{' '}
                {quest.participants.optional.map(id =>
                  family.members.find(m => m.id === id)?.name
                ).join(', ')}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
            <Box position="relative" display="inline-flex">
              <CircularProgress
                variant="determinate"
                value={progress}
                size={80}
                sx={{
                  circle: {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${progress}%`}
                </Typography>
              </Box>
            </Box>
            {!isCompleted && progress >= 100 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCompleteQuest(quest)}
                sx={{ mt: 2 }}
              >
                Complete Quest
              </Button>
            )}
            {!isCompleted && progress < 100 && quest.participants.required.includes(family.members[0].id) && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleUpdateProgress(quest, family.members[0].id, Math.min(1, quest.progress.participantProgress[family.members[0].id] || 0 + 0.2))}
                sx={{ mt: 2 }}
              >
                Update Progress
              </Button>
            )}
          </Grid>
          {!isCompleted && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Rewards:
              </Typography>
              <Typography variant="body2">
                Individual: {quest.rewards.individual.xp} XP,{' '}
                {Object.entries(quest.rewards.individual.skills).map(([skill, points]) => 
                  `${skill} +${points}`
                ).join(', ')}
              </Typography>
              <Typography variant="body2">
                Family: {quest.rewards.family.traditionPoints} Tradition Points,{' '}
                {quest.rewards.family.legacyPoints} Legacy Points
              </Typography>
            </Grid>
          )}
        </Grid>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Quests
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Active Quests
        </Typography>
        {activeQuests.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No active quests available. Check back tomorrow for new quests!
          </Typography>
        ) : (
          activeQuests.map(renderQuestCard)
        )}
      </Box>

      {completedQuests.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Completed Quests
          </Typography>
          {completedQuests.map(renderQuestCard)}
        </Box>
      )}
    </Box>
  );
}; 