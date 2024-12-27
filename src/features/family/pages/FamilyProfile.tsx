import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import { useFamilyStore } from '../store/familyStore';

const FamilyProfile: React.FC = () => {
  const { currentFamily, loading } = useFamilyStore();

  if (loading) {
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

  if (!currentFamily) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          No family found. Please create or join a family.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Family Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Family Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Family Overview
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">{currentFamily.name}</Typography>
              <Typography color="textSecondary">
                Created on {currentFamily.createdAt.toDate().toLocaleDateString()}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={`Level ${currentFamily.level}`}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`XP: ${currentFamily.xp}`}
                color="secondary"
                sx={{ mr: 1 }}
              />
              <Chip
                label={`Gold: ${currentFamily.gold}`}
                color="warning"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Family Members */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Family Members
            </Typography>
            <Grid container spacing={2}>
              {currentFamily.members.map(member => (
                <Grid item xs={12} key={member.id}>
                  <Card>
                    <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2 }}>{member.name[0]}</Avatar>
                      <Box>
                        <Typography variant="h6">{member.name}</Typography>
                        <Typography color="textSecondary">
                          {member.role}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        <Chip
                          label={`Level ${member.level}`}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={`XP: ${member.xp}`}
                          color="secondary"
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FamilyProfile; 