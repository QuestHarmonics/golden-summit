import React, { useState, useEffect } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { FamilyNavigation } from './components/FamilyNavigation';
import { FamilyDashboard } from './components/FamilyDashboard';
import { FamilyQuests } from './components/FamilyQuests';
import { FamilyTraditions } from './components/FamilyTraditions';
import { FamilyLegacy } from './components/FamilyLegacy';
import { FamilyProfile } from './components/FamilyProfile';
import { useFamilyStore } from '../../store/familyStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`family-tabpanel-${index}`}
      aria-labelledby={`family-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export const FamilyContainer: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { currentFamily, families, generateDailyQuests } = useFamilyStore();

  useEffect(() => {
    if (currentFamily && families[currentFamily]) {
      generateDailyQuests();
    }
  }, [currentFamily, families, generateDailyQuests]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2}>
        <Box sx={{ width: '100%' }}>
          <FamilyNavigation
            value={currentTab}
            onChange={handleTabChange}
          />

          <TabPanel value={currentTab} index={0}>
            <FamilyDashboard />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <FamilyQuests />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <FamilyTraditions />
          </TabPanel>

          <TabPanel value={currentTab} index={3}>
            <FamilyLegacy />
          </TabPanel>

          <TabPanel value={currentTab} index={4}>
            <FamilyProfile />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
}; 