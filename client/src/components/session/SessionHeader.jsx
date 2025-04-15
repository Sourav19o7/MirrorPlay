import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Tooltip, 
  Box,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InsightsIcon from '@mui/icons-material/Insights';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

const SessionHeader = ({ 
  title, 
  mode, 
  status, 
  onToggleInsights, 
  onTogglePause, 
  onEndSession, 
  isPaused = false
}) => {
  const navigate = useNavigate();
  
  const getModeColor = () => {
    switch (mode) {
      case 'self-dialogue':
        return 'primary';
      case 'projected-conflict':
        return 'secondary';
      case 'live-session':
        return 'success';
      default:
        return 'default';
    }
  };
  
  const getModeLabel = () => {
    switch (mode) {
      case 'self-dialogue':
        return 'Self-Self Dialogue';
      case 'projected-conflict':
        return 'Projected Conflict';
      case 'live-session':
        return 'Live Session';
      default:
        return 'Session';
    }
  };
  
  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider'
      }}
    >
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate('/dashboard')}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, mr: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {title}
        </Typography>
        
        <Chip 
          label={getModeLabel()} 
          color={getModeColor()} 
          size="small" 
          sx={{ mr: 2 }}
        />
        
        <Box>
          <Tooltip title="Toggle Insights">
            <IconButton color="inherit" onClick={onToggleInsights}>
              <InsightsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isPaused ? "Resume Session" : "Pause Session"}>
            <IconButton 
              color={isPaused ? "error" : "inherit"} 
              onClick={onTogglePause}
            >
              {isPaused ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
          </Tooltip>
          
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<SaveIcon />}
            onClick={onEndSession}
            size="small"
            sx={{ ml: 1 }}
          >
            End Session
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SessionHeader;