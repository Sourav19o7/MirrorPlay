import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  List,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';

import { getSessionById, updateSession } from '../redux/slices/sessionSlice';
import { setMessages, sendMessage, getCoachingSuggestions, clearMessages } from '../redux/slices/chatSlice';
import { toggleInsights, showNotification } from '../redux/slices/uiSlice';
import ChatInterface from '../components/session/ChatInterface';
import SessionHeader from '../components/session/SessionHeader';
import InsightsDrawer from '../components/session/InsightsDrawer';
import { getInitials } from '../utils/helpers';

const LiveSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSession, loading: sessionLoading, error: sessionError } = useSelector(state => state.session);
  const { user } = useSelector(state => state.auth);
  const { messages, suggestions, emotions, loading: chatLoading } = useSelector(state => state.chat);
  const { insightsOpen } = useSelector(state => state.ui);
  
  const [isPaused, setIsPaused] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [waitingForParticipants, setWaitingForParticipants] = useState(true);
  
  // Load the session
  useEffect(() => {
    if (id) {
      dispatch(getSessionById(id));
    }
    
    // Cleanup on unmount
    return () => {
      dispatch(clearMessages());
    };
  }, [id, dispatch]);
  
  // Initialize messages when session loads
  useEffect(() => {
    if (currentSession?.messages) {
      dispatch(setMessages(currentSession.messages));
      setWaitingForParticipants(currentSession.session.participants.some(p => p.status !== 'joined'));
    }
    
    if (currentSession?.session) {
      // Set participants from session data
      const sessionParticipants = [];
      
      // Add creator
      if (currentSession.session.creator) {
        sessionParticipants.push({
          id: currentSession.session.creator._id || currentSession.session.creator,
          name: currentSession.session.creator.displayName || 'Session Creator',
          isCreator: true,
          status: 'joined'
        });
      }
      
      // Add other participants
      if (currentSession.session.participants && currentSession.session.participants.length > 0) {
        currentSession.session.participants.forEach(participant => {
          sessionParticipants.push({
            id: participant.user?._id || participant.user,
            name: participant.user?.displayName || participant.email || 'Invited User',
            isCreator: false,
            status: participant.status
          });
        });
      }
      
      setParticipants(sessionParticipants);
    }
  }, [currentSession, dispatch]);
  
  // Handle pause toggle
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    
    // If pausing, open insights drawer
    if (!isPaused) {
      dispatch(toggleInsights());
      
      // Update session status in database
      dispatch(updateSession({
        id,
        data: { status: 'paused' }
      }));
    } else {
      // Update session status in database
      dispatch(updateSession({
        id,
        data: { status: 'active' }
      }));
    }
  };
  
  // Handle end session
  const handleEndSession = async () => {
    if (window.confirm('Are you sure you want to end this session?')) {
      try {
        await dispatch(updateSession({
          id,
          data: {
            status: 'completed',
            endedAt: new Date().toISOString()
          }
        })).unwrap();
        
        dispatch(showNotification({
          message: 'Session completed successfully',
          type: 'success'
        }));
        
        navigate(`/session-review/${id}`);
      } catch (error) {
        dispatch(showNotification({
          message: 'Failed to end session',
          type: 'error'
        }));
      }
    }
  };
  
  // Handle suggestion selection
  const handleUseSuggestion = (suggestion) => {
    // Not implemented yet
    dispatch(showNotification({
      message: 'Suggestion applied',
      type: 'success'
    }));
  };
  
  // Handle resend invitation
  const handleResendInvitation = (participantId) => {
    dispatch(showNotification({
      message: 'Invitation resent',
      type: 'success'
    }));
  };
  
  if (sessionLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (sessionError || !currentSession) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {sessionError || 'Failed to load session. Please try again.'}
        </Alert>
      </Container>
    );
  }
  
  const session = currentSession.session;
  
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <SessionHeader
        title={session.title}
        mode={session.mode}
        status={session.status}
        onToggleInsights={() => dispatch(toggleInsights())}
        onTogglePause={handleTogglePause}
        onEndSession={handleEndSession}
        isPaused={isPaused}
      />
      
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Participants sidebar */}
          <Grid item xs={3} md={2} sx={{ height: '100%', borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" gutterBottom>
                Participants
              </Typography>
              
              <List sx={{ flex: 1, overflow: 'auto' }}>
                {participants.map((participant, index) => (
                  <ListItem key={index} sx={{ px: 1 }}>
                    <ListItemAvatar sx={{ minWidth: 40 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: participant.isCreator ? 'primary.main' : 'secondary.main' }}>
                        {getInitials(participant.name)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={participant.name} 
                      primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                      secondary={
                        <Chip 
                          label={participant.status} 
                          size="small" 
                          color={participant.status === 'joined' ? 'success' : 'default'}
                          sx={{ height: 20, fontSize: '0.6rem' }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
              
              {/* Invite button */}
              <Button 
                variant="outlined" 
                size="small" 
                fullWidth
                startIcon={<PersonIcon />}
                sx={{ mt: 1 }}
              >
                Invite
              </Button>
            </Box>
          </Grid>
          
          {/* Main chat area */}
          <Grid item xs={9} md={10} sx={{ height: '100%', position: 'relative' }}>
            {waitingForParticipants ? (
              <Box 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 3
                }}
              >
                <GroupIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom align="center">
                  Waiting for participants to join
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  Your session is ready but not everyone has joined yet.
                </Typography>
                
                {participants.filter(p => p.status !== 'joined').length > 0 && (
                  <Box sx={{ width: '100%', maxWidth: 500 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Pending participants:
                    </Typography>
                    
                    <List>
                      {participants.filter(p => p.status !== 'joined').map((participant, index) => (
                        <ListItem key={index} sx={{ px: 1 }}>
                          <ListItemAvatar sx={{ minWidth: 40 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              {getInitials(participant.name)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={participant.name} 
                            secondary={participant.status}
                          />
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => handleResendInvitation(participant.id)}
                          >
                            Resend
                          </Button>
                        </ListItem>
                      ))}
                    </List>
                    
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => setWaitingForParticipants(false)}
                      >
                        Begin Anyway
                      </Button>
                      <Button 
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                      >
                        Cancel Session
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <Paper
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 0
                }}
              >
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <ChatInterface
                    sessionId={id}
                    sessionMode={session.mode}
                    isPaused={isPaused}
                  />
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
        
        {/* Insights drawer */}
        <InsightsDrawer
          open={insightsOpen}
          onClose={() => dispatch(toggleInsights())}
          emotions={emotions}
          patterns={patterns}
          suggestions={suggestions}
          onUseSuggestion={handleUseSuggestion}
        />
      </Box>
    </Box>
  );
};

export default LiveSession;