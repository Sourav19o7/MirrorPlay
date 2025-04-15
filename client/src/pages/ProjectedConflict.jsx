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
  Avatar
} from '@mui/material';
import { getSessionById, updateSession } from '../redux/slices/sessionSlice';
import { setMessages, sendMessage, getCoachingSuggestions, analyzeEmotions, clearMessages } from '../redux/slices/chatSlice';
import { toggleInsights, showNotification } from '../redux/slices/uiSlice';
import ChatInterface from '../components/session/ChatInterface';
import SessionHeader from '../components/session/SessionHeader';
import InsightsDrawer from '../components/session/InsightsDrawer';
import aiService from '../services/ai';

const ProjectedConflict = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSession, loading: sessionLoading, error: sessionError } = useSelector(state => state.session);
  const { messages, suggestions, emotions, loading: chatLoading } = useSelector(state => state.chat);
  const { insightsOpen } = useSelector(state => state.ui);
  
  const [isPaused, setIsPaused] = useState(false);
  const [projectedPerson, setProjectedPerson] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [isGeneratingProjected, setIsGeneratingProjected] = useState(false);
  
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
    }
  }, [currentSession, dispatch]);
  
  // Generate projected person when session loads
  useEffect(() => {
    if (currentSession?.session && !projectedPerson && !isGeneratingProjected) {
      const session = currentSession.session;
      
      if (session.mode !== 'projected-conflict') {
        dispatch(showNotification({
          message: 'Invalid session mode. Redirecting to dashboard.',
          type: 'error'
        }));
        navigate('/dashboard');
        return;
      }
      
      // Generate projected person
      setIsGeneratingProjected(true);
      
      const generateProjected = async () => {
        try {
          const response = await aiService.generateProjectedOther({
            relationship: session.otherPersonDetails.relationship,
            characteristics: session.otherPersonDetails.characteristics,
            context: session.description || '',
            topics: session.topics
          });
          
          setProjectedPerson(response.data.data);
          
          // Add introduction message if messages are empty
          if (!currentSession.messages || currentSession.messages.length === 0) {
            dispatch(sendMessage({
              sessionId: id,
              content: response.data.data.introduction
            }));
          }
        } catch (error) {
          console.error('Error generating projected person:', error);
          dispatch(showNotification({
            message: 'Failed to generate projected conversation partner. Please try again.',
            type: 'error'
          }));
        } finally {
          setIsGeneratingProjected(false);
        }
      };
      
      generateProjected();
    }
  }, [currentSession, projectedPerson, isGeneratingProjected, id, dispatch, navigate]);
  
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
    // TODO: Implement this
  };
  
  if (sessionLoading || isGeneratingProjected) {
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
          <Grid item xs={12} sx={{ height: '100%', position: 'relative' }}>
            <Paper
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0
              }}
            >
              {/* Projected person info bar */}
              <Box sx={{ p: 2, backgroundColor: 'secondary.dark', display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                  {session.otherPersonDetails.relationship ? session.otherPersonDetails.relationship.charAt(0).toUpperCase() : 'P'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {session.otherPersonDetails.relationship || 'Projected Person'}
                  </Typography>
                  {session.otherPersonDetails.characteristics && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {session.otherPersonDetails.characteristics.map((trait, index) => (
                        <Typography key={index} variant="body2" component="span" sx={{ mr: 1 }}>
                          #{trait}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
              
              <Divider />
              
              {/* Chat interface */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <ChatInterface
                  sessionId={id}
                  sessionMode={session.mode}
                  isPaused={isPaused}
                />
              </Box>
            </Paper>
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

export default ProjectedConflict;