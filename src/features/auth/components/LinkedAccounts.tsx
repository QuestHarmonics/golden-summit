import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Google as GoogleIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { LoadingTransition } from '../../../components/ui/LoadingTransition';

const PROVIDER_ICONS: Record<string, React.ReactElement> = {
  'google.com': <GoogleIcon />,
  'password': <EmailIcon />
};

const PROVIDER_NAMES: Record<string, string> = {
  'google.com': 'Google',
  'password': 'Email/Password'
};

export const LinkedAccounts: React.FC = () => {
  const { user, linkGoogle, unlinkProvider, isLoading, error } = useAuthStore();

  if (!user) return null;

  const handleLinkGoogle = async () => {
    try {
      await linkGoogle();
    } catch (error) {
      console.error('Failed to link Google account:', error);
    }
  };

  const handleUnlink = async (providerId: string) => {
    try {
      await unlinkProvider(providerId);
    } catch (error) {
      console.error('Failed to unlink provider:', error);
    }
  };

  const canUnlink = user.providers.length > 1;

  return (
    <LoadingTransition loading={isLoading} message="Updating linked accounts...">
      <Box>
        <Typography variant="h6" gutterBottom>
          Linked Accounts
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <List>
          {user.providers.map((providerId) => (
            <ListItem key={providerId}>
              <ListItemIcon>
                {PROVIDER_ICONS[providerId] || <LinkIcon />}
              </ListItemIcon>
              <ListItemText
                primary={PROVIDER_NAMES[providerId] || providerId}
                secondary={providerId === 'password' ? user.email : undefined}
              />
              <ListItemSecondaryAction>
                <Tooltip 
                  title={canUnlink ? 'Unlink account' : 'Cannot unlink the only authentication method'}
                >
                  <span>
                    <IconButton
                      edge="end"
                      onClick={() => handleUnlink(providerId)}
                      disabled={!canUnlink}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {!user.providers.includes('google.com') && (
          <Button
            startIcon={<GoogleIcon />}
            variant="outlined"
            onClick={handleLinkGoogle}
            sx={{ mt: 2 }}
          >
            Link Google Account
          </Button>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Linking multiple accounts provides backup sign-in methods and enhanced security.
        </Typography>
      </Box>
    </LoadingTransition>
  );
}; 