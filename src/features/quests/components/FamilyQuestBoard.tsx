import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useQuestStore } from '../store/questStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { useAuthStore } from '../../auth/store/authStore';
import { Quest, QuestStatus, QuestType } from '../types/Quest';

export const FamilyQuestBoard: React.FC = () => {
  const { currentFamily } = useFamilyStore();
  const { user } = useAuthStore();
  const {
    quests,
    isLoading,
    error,
    getFamilyQuests,
    acceptQuest,
    completeQuest,
    abandonQuest
  } = useQuestStore();

  useEffect(() => {
    if (currentFamily) {
      getFamilyQuests(currentFamily.id);
    }
  }, [currentFamily, getFamilyQuests]);

  const handleAcceptQuest = async (questId: string) => {
    if (!user) return;
    await acceptQuest(questId, user.uid);
  };

  const handleCompleteQuest = async (questId: string) => {
    await completeQuest(questId);
  };

  const handleAbandonQuest = async (questId: string) => {
    await abandonQuest(questId);
  };

  const renderQuestActions = (quest: Quest) => {
    if (!user) return null;

    switch (quest.status) {
      case QuestStatus.AVAILABLE:
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAcceptQuest(quest.id)}
            fullWidth
          >
            Accept Quest
          </Button>
        );
      case QuestStatus.IN_PROGRESS:
        if (quest.assignedTo?.userId === user.uid) {
          return (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleCompleteQuest(quest.id)}
                fullWidth
              >
                Complete
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleAbandonQuest(quest.id)}
                fullWidth
              >
                Abandon
              </Button>
            </Box>
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            In Progress by {quest.assignedTo?.userId}
          </Typography>
        );
      case QuestStatus.COMPLETED:
        return (
          <Typography variant="body2" color="success.main">
            Completed by {quest.assignedTo?.userId}
          </Typography>
        );
      default:
        return null;
    }
  };

  if (!currentFamily) {
    return (
      <Alert severity="info">
        Join a family to see and participate in family quests!
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Quest Board
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {currentFamily.name}'s Active Quests
      </Typography>

      <Grid container spacing={3}>
        {quests.map((quest) => (
          <Grid item xs={12} sm={6} md={4} key={quest.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={quest.type}
                    color={quest.type === QuestType.FAMILY ? 'primary' : 'secondary'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={quest.difficulty}
                    color="default"
                    size="small"
                  />
                </Box>

                <Typography variant="h6" gutterBottom>
                  {quest.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {quest.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Rewards:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography variant="body2">
                      XP: {quest.reward.xp}
                    </Typography>
                    <Typography variant="body2">
                      Gold: {quest.reward.gold}
                    </Typography>
                  </Box>
                </Box>

                {quest.dueDate && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Due: {new Date(quest.dueDate).toLocaleDateString()}
                  </Typography>
                )}

                {renderQuestActions(quest)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 