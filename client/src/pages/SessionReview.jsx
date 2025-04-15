import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import PatternIcon from '@mui/icons-material/Timeline';
import GrowthIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { getSessionById, generateSummary } from '../redux/slices/sessionSlice';
import { showNotification } from '../redux/slices/uiSlice';
import { formatDate, formatDateTime, getSessionModeLabel } from '../utils/helpers';
import Header from '../components/common/Header';

const SessionReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSession, summary, loading, error } = useSelector(state => state.session);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  // Load session data
  useEffect(() => {
    if (id) {
      dispatch(getSessionById(id));
    }
  }, [id, dispatch]);
  
  // Generate session summary
  const handleGenerateSummary = async () => {
    setIsSummaryLoading(true);
    try {
      await dispatch(generateSummary(id)).unwrap();
      dispatch(showNotification({
        message: 'Session summary generated successfully',
        type: 'success'
      }));
    } catch (error) {
      dispatch(showNotification({
        message: 'Failed to generate summary: ' + error,
        type: 'error'
      }));
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !currentSession) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error || 'Session not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  const { session, messages } = currentSession;
  const hasSummary = summary || (session.insights && session.insights.clarityScore);
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Container maxWidth="lg" sx={{ my: 4, flex: 1 }}>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {session.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={getSessionModeLabel(session.mode)} 
                  color={
                    session.mode === 'self-dialogue' 
                      ? 'primary' 
                      : session.mode === 'projected-conflict'
                      ? 'secondary'
                      : 'success'
                  }
                  size="small" 
                  sx={{ mr: 2 }}
                />
                <Chip 
                  label={session.status.toUpperCase()} 
                  color={
                    session.status === 'completed' 
                      ? 'success' 
                      : session.status === 'active'
                      ? 'primary'
                      : 'default'
                  }
                  size="small" 
                />
              </Box>
            </Box>
            
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </Box>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Created:</strong> {formatDateTime(session.createdAt)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                <strong>Completed:</strong> {session.endedAt ? formatDateTime(session.endedAt) : 'Not completed'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Description:</strong> {session.description || 'No description provided'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Topics:</strong> {session.topics && session.topics.length > 0 
                  ? session.topics.join(', ') 
                  : 'No topics specified'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {!hasSummary && (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h5" gutterBottom>
              Generate Session Summary
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Get AI-powered insights, patterns, and growth opportunities from your conversation.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={isSummaryLoading ? <CircularProgress size={20} /> : <InsightsIcon />}
              onClick={handleGenerateSummary}
              disabled={isSummaryLoading}
            >
              {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
            </Button>
          </Box>
        )}
        
        {hasSummary && (
          <>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InsightsIcon sx={{ mr: 1 }} /> Session Insights
            </Typography>
            
            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Clarity Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={summary?.clarityScore || session.insights?.clarityScore || 0} 
                          color={
                            (summary?.clarityScore || session.insights?.clarityScore || 0) > 75 
                              ? 'success' 
                              : (summary?.clarityScore || session.insights?.clarityScore || 0) > 50
                              ? 'info'
                              : 'warning'
                          }
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {summary?.clarityScore || session.insights?.clarityScore || 0}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Message Count
                    </Typography>
                    <Typography variant="h4">
                      {messages?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.duration} minute session
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Status
                    </Typography>
                    <Typography variant="h6" color={
                      session.status === 'completed' 
                        ? 'success.main' 
                        : session.status === 'active'
                        ? 'primary.main'
                        : 'text.secondary'
                    }>
                      {session.status.toUpperCase()}
                    </Typography>
                    {session.status === 'completed' && (
                      <Typography variant="body2" color="text.secondary">
                        Completed on {formatDate(session.endedAt)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Patterns Section */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <PatternIcon fontSize="small" sx={{ mr: 1 }} /> Communication Patterns
                    </Typography>
                    
                    {(summary?.patterns || session.insights?.patterns) ? (
                      <List>
                        {(summary?.patterns || session.insights?.patterns || []).map((pattern, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircleIcon color="info" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={typeof pattern === 'string' ? pattern : pattern.type} 
                              secondary={typeof pattern !== 'string' ? pattern.description : null}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No significant patterns detected.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Growth Opportunities Section */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <GrowthIcon fontSize="small" sx={{ mr: 1 }} /> Growth Opportunities
                    </Typography>
                    
                    {(summary?.growthOpportunities || session.insights?.growthOpportunities) ? (
                      <List>
                        {(summary?.growthOpportunities || session.insights?.growthOpportunities || []).map((opportunity, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <GrowthIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary={opportunity} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No specific growth opportunities identified.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Key Moments Section */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <ForumIcon fontSize="small" sx={{ mr: 1 }} /> Key Conversation Moments
                    </Typography>
                    
                    {(summary?.keyMoments || session.insights?.connectionMoments) ? (
                      <List>
                        {(summary?.keyMoments || session.insights?.connectionMoments || []).map((moment, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={typeof moment === 'string' ? moment : moment.description} 
                              secondary={typeof moment !== 'string' && moment.timestamp ? formatDateTime(moment.timestamp) : null}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No key moments identified.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (session.status === 'completed') {
                    if (session.mode === 'self-dialogue') {
                      navigate('/self-dialogue/' + id);
                    } else if (session.mode === 'projected-conflict') {
                      navigate('/projected-conflict/' + id);
                    } else {
                      navigate('/live-session/' + id);
                    }
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                {session.status === 'completed' ? 'Review Conversation' : 'Back to Dashboard'}
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default SessionReview;