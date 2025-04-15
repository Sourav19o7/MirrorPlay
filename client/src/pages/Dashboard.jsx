import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionContext';

import { useDispatch, useSelector } from 'react-redux'; // Use Redux instead of context
import { useNavigate, useSearchParams } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { getSessions, deleteSession } from '../redux/slices/sessionSlice'; // Import Redux actions
import { showNotification } from '../redux/slices/uiSlice';
import Header from '../components/common/Header'; // Updated import path
import Footer from '../components/common/Footer'; // Updated import path
import SessionCard from '../components/dashboard/SessionCard'; // Updated import path
import EmptyState from '../components/dashboard/EmptyState';

// Rest of the Dashboard component code...

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { sessions, loading, error } = useSelector(state => state.session);
  const [tabValue, setTabValue] = useState(0);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const startNewSession = () => {
    navigate('/session-setup');
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Welcome back, {user.displayName || user.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Continue your journey of better conversations and relationships.
            </Typography>
          </Box>
          
          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Total Sessions
                  </Typography>
                  <Typography variant="h3">
                    {sessions?.length || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Clarity Score
                  </Typography>
                  <Typography variant="h3">
                    78%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Growth Trend
                  </Typography>
                  <Typography variant="h3">
                    ↑ 12%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="overline" color="text.secondary">
                    Empathy Score
                  </Typography>
                  <Typography variant="h3">
                    81%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Start New Session Button */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={startNewSession}
              sx={{ py: 1.5, px: 4 }}
            >
              Start New Session
            </Button>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          {/* Tabs and Content */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                centered
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab icon={<HistoryIcon />} label="Recent Sessions" />
                <Tab icon={<InsightsIcon />} label="Insights" />
              </Tabs>
            </Box>
            
            {/* Recent Sessions Tab */}
            <Box role="tabpanel" hidden={tabValue !== 0}>
              {loading ? (
                <LinearProgress sx={{ my: 4 }} />
              ) : error ? (
                <Typography color="error" align="center" sx={{ my: 4 }}>
                  Error loading sessions: {error.message}
                </Typography>
              ) : sessions?.length > 0 ? (
                <Grid container spacing={3}>
                  {sessions.map((session) => (
                    <Grid item xs={12} sm={6} md={4} key={session.id}>
                      <SessionCard session={session} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    No sessions yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Start your first conversation to begin the journey
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={startNewSession}
                  >
                    Create Your First Session
                  </Button>
                </Box>
              )}
            </Box>
            
            {/* Insights Tab */}
            <Box role="tabpanel" hidden={tabValue !== 1}>
              {sessions?.length > 0 ? (
                <Grid container spacing={4}>
                  {/* Growth Patterns */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Growth Patterns
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Better Emotional Awareness" 
                              secondary="Your ability to name emotions has improved by 23%" 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Reduced Blame Language" 
                              secondary="Your use of accusatory 'you' statements has decreased" 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Improved Listening" 
                              secondary="You're responding more directly to what others say" 
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Recommendations */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom>
                          Recommendations
                        </Typography>
                        <List>
                          <ListItem>
                            <ListItemIcon>
                              <PersonIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Try a Self-Self Shadow Session" 
                              secondary="Work through your conflicting thoughts about career decisions" 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <PeopleIcon color="secondary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Practice with Projected Mode" 
                              secondary="Rehearse the difficult conversation with your colleague" 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <GroupsIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Schedule a Live Session" 
                              secondary="Invite your partner to discuss vacation planning with AI support" 
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    No insights available yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Complete a few sessions to start seeing patterns and insights
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={startNewSession}
                  >
                    Start a Session
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Dashboard;