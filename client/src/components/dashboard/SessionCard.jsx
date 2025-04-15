// client/src/components/dashboard/SessionCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import { format } from 'date-fns';

const SessionCard = ({ session, onDelete }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleContinueSession = () => {
    handleMenuClose();
    
    switch (session.mode) {
      case 'self-dialogue':
        navigate(`/self-dialogue/${session._id}`);
        break;
      case 'projected-conflict':
        navigate(`/projected-conflict/${session._id}`);
        break;
      case 'live-session':
        navigate(`/live-session/${session._id}`);
        break;
      default:
        navigate(`/session/${session._id}`);
    }
  };
  
  const handleViewSummary = () => {
    handleMenuClose();
    navigate(`/session-review/${session._id}`);
  };
  
  const handleDelete = () => {
    handleMenuClose();
    onDelete(session._id);
  };
  
  const getModeIcon = () => {
    switch (session.mode) {
      case 'self-dialogue':
        return <PersonIcon sx={{ color: 'primary.main' }} />;
      case 'projected-conflict':
        return <PeopleIcon sx={{ color: 'secondary.main' }} />;
      case 'live-session':
        return <GroupsIcon sx={{ color: 'success.main' }} />;
      default:
        return null;
    }
  };
  
  const getModeLabel = () => {
    switch (session.mode) {
      case 'self-dialogue':
        return 'Self-Self Dialogue';
      case 'projected-conflict':
        return 'Projected Conflict';
      case 'live-session':
        return 'Live Session';
      default:
        return 'Unknown Mode';
    }
  };
  
  const getStatusColor = () => {
    switch (session.status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Unknown date';
    }
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getModeIcon()}
            <Chip 
              label={session.status.toUpperCase()} 
              color={getStatusColor()} 
              size="small" 
              sx={{ ml: 1 }}
            />
          </Box>
          <IconButton 
            size="small" 
            onClick={handleMenuOpen}
            aria-label="session options"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleContinueSession}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              Continue Session
            </MenuItem>
            <MenuItem onClick={handleViewSummary}>
              <ListItemIcon>
                <VisibilityIcon fontSize="small" />
              </ListItemIcon>
              View Summary
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" color="error" />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
        </Box>
        
        <Typography variant="h6" component="h2" gutterBottom noWrap>
          {session.title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {getModeLabel()}
        </Typography>
        
        {session.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {session.description}
          </Typography>
        )}
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Created: {formatDate(session.createdAt)}
          </Typography>
          {session.endedAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              Completed: {formatDate(session.endedAt)}
            </Typography>
          )}
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          onClick={handleContinueSession}
          sx={{ mr: 1 }}
        >
          {session.status === 'completed' ? 'Review' : 'Continue'}
        </Button>
        
        {session.status === 'completed' && (
          <Button 
            size="small" 
            color="primary"
            onClick={handleViewSummary}
          >
            View Summary
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default SessionCard;