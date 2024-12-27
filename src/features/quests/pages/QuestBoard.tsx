import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import {
  Assignment as QuestIcon,
  Star as DifficultyIcon,
  Timer as DeadlineIcon
} from '@mui/icons-material';
import { useQuestStore } from '../store/questStore';
import { useFamilyStore } from '../../family/store/familyStore';
import { useAuthStore } from '../../auth/store/authStore';
import { Quest, QuestStatus, QuestType, QuestDifficulty } from '../types/Quest';
import { Timestamp } from 'firebase/firestore';

const QuestBoard: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { currentFamily } = useFamilyStore();
  const { quests, loading, error, createQuest, updateQuestStatus } = useQuestStore();
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    type: QuestType.PERSONAL,
    difficulty: QuestDifficulty.EASY,
    reward: {
      xp: 100,
      gold: 50
    }
  });

  useEffect(() => {
    if (currentFamily?.id) {
      useQuestStore.getState().fetchQuests(currentFamily.id);
    }
  }, [currentFamily?.id]);

  const handleCreateQuest = async () => {
    if (!currentFamily?.id || !currentUser?.uid) return;

    await createQuest({
      ...newQuest,
      status: QuestStatus.AVAILABLE,
      familyId: currentFamily.id,
      createdBy: currentUser.uid,
      deadline: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 1 week from now
    });

    setCreateDialogOpen(false);
    setNewQuest({
      title: '',
      description: '',
      type: QuestType.PERSONAL,
      difficulty: QuestDifficulty.EASY,
      reward: {
        xp: 100,
        gold: 50
      }
    });
  };

  const handleAcceptQuest = async (quest: Quest) => {
    if (!currentUser?.uid) return;
    await updateQuestStatus(quest.id, QuestStatus.IN_PROGRESS);
  };

  const handleCompleteQuest = async (quest: Quest) => {
    await updateQuestStatus(quest.id, QuestStatus.COMPLETED);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const availableQuests = quests.filter(quest => quest.status === QuestStatus.AVAILABLE);
  const activeQuests = quests.filter(quest => quest.status === QuestStatus.IN_PROGRESS);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Quest Board</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateDialogOpen(true)}
        >
          Create Quest
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Available Quests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Quests
            </Typography>
            <Grid container spacing={2}>
              {availableQuests.map(quest => (
                <Grid item xs={12} key={quest.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{quest.title}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {quest.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<QuestIcon />}
                          label={quest.type}
                          color={quest.type === QuestType.FAMILY ? 'primary' : 'default'}
                          size="small"
                        />
                        <Chip
                          icon={<DifficultyIcon />}
                          label={quest.difficulty}
                          color={
                            quest.difficulty === QuestDifficulty.EASY
                              ? 'success'
                              : quest.difficulty === QuestDifficulty.MEDIUM
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                        {quest.deadline && (
                          <Chip
                            icon={<DeadlineIcon />}
                            label={quest.deadline.toDate().toLocaleDateString()}
                            size="small"
                          />
                        )}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`${quest.reward.xp} XP`}
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`${quest.reward.gold} Gold`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => handleAcceptQuest(quest)}
                      >
                        Accept Quest
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Active Quests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Active Quests
            </Typography>
            <Grid container spacing={2}>
              {activeQuests.map(quest => (
                <Grid item xs={12} key={quest.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{quest.title}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {quest.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          icon={<QuestIcon />}
                          label={quest.type}
                          color={quest.type === QuestType.FAMILY ? 'primary' : 'default'}
                          size="small"
                        />
                        <Chip
                          icon={<DifficultyIcon />}
                          label={quest.difficulty}
                          color={
                            quest.difficulty === QuestDifficulty.EASY
                              ? 'success'
                              : quest.difficulty === QuestDifficulty.MEDIUM
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                        {quest.deadline && (
                          <Chip
                            icon={<DeadlineIcon />}
                            label={quest.deadline.toDate().toLocaleDateString()}
                            size="small"
                          />
                        )}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`${quest.reward.xp} XP`}
                          color="secondary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`${quest.reward.gold} Gold`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleCompleteQuest(quest)}
                      >
                        Complete Quest
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Create Quest Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Quest</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={newQuest.title}
              onChange={e => setNewQuest({ ...newQuest, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newQuest.description}
              onChange={e => setNewQuest({ ...newQuest, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={newQuest.type}
                label="Type"
                onChange={e => setNewQuest({ ...newQuest, type: e.target.value as QuestType })}
              >
                <MenuItem value={QuestType.PERSONAL}>Personal</MenuItem>
                <MenuItem value={QuestType.FAMILY}>Family</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={newQuest.difficulty}
                label="Difficulty"
                onChange={e =>
                  setNewQuest({ ...newQuest, difficulty: e.target.value as QuestDifficulty })
                }
              >
                <MenuItem value={QuestDifficulty.EASY}>Easy</MenuItem>
                <MenuItem value={QuestDifficulty.MEDIUM}>Medium</MenuItem>
                <MenuItem value={QuestDifficulty.HARD}>Hard</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="XP Reward"
                type="number"
                value={newQuest.reward.xp}
                onChange={e =>
                  setNewQuest({
                    ...newQuest,
                    reward: { ...newQuest.reward, xp: parseInt(e.target.value) || 0 }
                  })
                }
              />
              <TextField
                label="Gold Reward"
                type="number"
                value={newQuest.reward.gold}
                onChange={e =>
                  setNewQuest({
                    ...newQuest,
                    reward: { ...newQuest.reward, gold: parseInt(e.target.value) || 0 }
                  })
                }
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateQuest}
            variant="contained"
            disabled={!newQuest.title || !newQuest.description}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestBoard; 