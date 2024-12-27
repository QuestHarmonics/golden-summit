import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EmojiEvents as TrophyIcon,
  Celebration as CelebrationIcon,
  Assignment as QuestIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { useFamilyStore } from '../../../store/familyStore';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `family-tab-${index}`,
    'aria-controls': `family-tabpanel-${index}`,
  };
}

interface FamilyNavigationProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export const FamilyNavigation: React.FC<FamilyNavigationProps> = ({
  value,
  onChange
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { currentFamily, families } = useFamilyStore();

  const getBadgeCounts = () => {
    if (!currentFamily || !families[currentFamily]) {
      return {
        quests: 0,
        traditions: 0,
        achievements: 0
      };
    }

    const family = families[currentFamily];
    return {
      quests: family.quests.filter(q => q.progress.status === 'active').length,
      traditions: family.traditions.filter(t => !t.lastCelebrated || isTimeForTradition(t)).length,
      achievements: family.legacies.filter(l => l.type === 'achievement' && !l.participants.length).length
    };
  };

  const isTimeForTradition = (tradition: any): boolean => {
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

  const badgeCounts = getBadgeCounts();

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant={isMobile ? 'fullWidth' : 'standard'}
        centered={!isMobile}
        aria-label="family navigation tabs"
      >
        <Tab
          icon={<DashboardIcon />}
          label={isMobile ? undefined : 'Dashboard'}
          {...a11yProps(0)}
        />
        <Tab
          icon={
            <Badge
              badgeContent={badgeCounts.quests}
              color="primary"
              max={99}
            >
              <QuestIcon />
            </Badge>
          }
          label={isMobile ? undefined : 'Quests'}
          {...a11yProps(1)}
        />
        <Tab
          icon={
            <Badge
              badgeContent={badgeCounts.traditions}
              color="secondary"
              max={99}
            >
              <CelebrationIcon />
            </Badge>
          }
          label={isMobile ? undefined : 'Traditions'}
          {...a11yProps(2)}
        />
        <Tab
          icon={
            <Badge
              badgeContent={badgeCounts.achievements}
              color="success"
              max={99}
            >
              <TrophyIcon />
            </Badge>
          }
          label={isMobile ? undefined : 'Legacy'}
          {...a11yProps(3)}
        />
        <Tab
          icon={<GroupIcon />}
          label={isMobile ? undefined : 'Profile'}
          {...a11yProps(4)}
        />
      </Tabs>
    </Box>
  );
}; 