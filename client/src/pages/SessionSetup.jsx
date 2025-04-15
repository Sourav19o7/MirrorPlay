import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Autocomplete,
  CircularProgress
} from '@mui/material';

import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import { useSessions } from '../context/SessionContext';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // Use Redux instead of context

import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createSession } from '../redux/slices/sessionSlice'; // Import Redux actions
import { showNotification } from '../redux/slices/uiSlice';

// Rest of the SessionSetup component code...

const steps = ['Select Mode', 'Configure Session', 'Review & Start'];

const SessionSetup = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
const { loading } = useSelector(state => state.session);
  
  const [activeStep, setActiveStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);
  const [sessionConfig, setSessionConfig] = useState({
    title: '',
    description: '',
    participants: [],
    topics: [],
    duration: 30,
  });
  
  // Handle step navigation
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle mode selection
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    // Pre-populate some fields based on mode
    if (mode === 'self-dialogue') {
      setSessionConfig({
        ...sessionConfig,
        title: 'Self Reflection Session',
        participants: [],
      });
    } else if (mode === 'projected-conflict') {
      setSessionConfig({
        ...sessionConfig,
        title: 'Practice Conversation',
        participants: [],
      });
    } else if (mode === 'live-session') {
      setSessionConfig({
        ...sessionConfig,
        title: 'Live Discussion',
        participants: [],
      });
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionConfig({
      ...sessionConfig,
      [name]: value,
    });
  };
  
  // Handle session creation and navigation
  const handleCreateSession = async () => {
    if (loading) return;
    
    try {
      const sessionData = {
        mode: selectedMode,
        ...sessionConfig,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      
      const sessionId = await createSession(sessionData);
      
      // Navigate to the appropriate session page
      if (selectedMode === 'self-dialogue') {
        navigate('/self-dialogue', { state: { sessionId } });
      } else if (selectedMode === 'projected-conflict') {
        navigate('/projected-conflict', { state: { sessionId } });
      } else if (selectedMode === 'live-session') {
        navigate(`/live-session/${sessionId}`);
      }
    } catch (error) {
      console.error("Error creating session:", error);
      // Handle error state
    }
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h4" align="center" gutterBottom>
              Select Conversation Mode
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Choose how you want to engage in this dialogue session
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Self-Dialogue Mode */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    border: selectedMode === 'self-dialogue' ? 2 : 0,
                    borderColor: 'primary.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    }
                  }}
                  onClick={() => handleModeSelect('self-dialogue')}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" component="h3" align="center" gutterBottom>
                      Self–Self Dialogue
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      Shadow Mode
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Talk to a pseudo-you. Integrate inner conflict. Heal identity splits. Perfect for mental clarity, emotional processing, and self-improvement.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Projected Conflict Mode */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    border: selectedMode === 'projected-conflict' ? 2 : 0,
                    borderColor: 'secondary.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    }
                  }}
                  onClick={() => handleModeSelect('projected-conflict')}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
                    </Box>
                    <Typography variant="h5" component="h3" align="center" gutterBottom>
                      Self–Other
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      Projected Conflict Mode
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Talk to a person through their imagined version of you. A safe confrontation space for emotional rehearsal, empathy-building, and pre-fight cooling.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Live Session Mode */}
              <Grid item xs={12} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: 'pointer',
                    border: selectedMode === 'live-session' ? 2 : 0,
                    borderColor: 'success.main',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 8,
                    }
                  }}
                  onClick={() => handleModeSelect('live-session')}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <GroupsIcon sx={{ fontSize: 60, color: 'success.main' }} />
                    </Box>
                    <Typography variant="h5" component="h3" align="center" gutterBottom>
                      Self–Other Live
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                      True Conflict Mode
                    </Typography>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      Talk to the actual person — live. The platform listens, reflects back each side, and subtly enhances clarity, empathy, and real-time self-awareness.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h4" align="center" gutterBottom>
              Configure Your Session
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Provide details to customize your conversation experience
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Session Title"
                  name="title"
                  value={sessionConfig.title}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={sessionConfig.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="What would you like to discuss or resolve in this session?"
                />
              </Grid>
              
              {selectedMode === 'projected-conflict' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Who are you practicing a conversation with?"
                    name="otherPerson"
                    value={sessionConfig.otherPerson || ''}
                    onChange={(e) => setSessionConfig({...sessionConfig, otherPerson: e.target.value})}
                    variant="outlined"
                    placeholder="E.g., My partner, My boss, My friend Sarah"
                  />
                </Grid>
              )}
              
              {selectedMode === 'live-session' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Invite Participant (Email)"
                    name="inviteEmail"
                    variant="outlined"
                    placeholder="Enter email address to invite"
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={sessionConfig.topics || []}
                  onChange={(event, newValue) => {
                    setSessionConfig({...sessionConfig, topics: newValue});
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Topics"
                      placeholder="Add relevant topics"
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Estimated Duration</FormLabel>
                  <RadioGroup
                    row
                    name="duration"
                    value={sessionConfig.duration}
                    onChange={(e) => setSessionConfig({...sessionConfig, duration: parseInt(e.target.value)})}
                  >
                    <FormControlLabel value={15} control={<Radio />} label="15 min" />
                    <FormControlLabel value={30} control={<Radio />} label="30 min" />
                    <FormControlLabel value={45} control={<Radio />} label="45 min" />
                    <FormControlLabel value={60} control={<Radio />} label="60 min" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h4" align="center" gutterBottom>
              Review & Start
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Confirm your session details before beginning
            </Typography>
            
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mode:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {selectedMode === 'self-dialogue' && 'Self-Self Dialogue (Shadow Mode)'}
                      {selectedMode === 'projected-conflict' && 'Self-Other (Projected Conflict Mode)'}
                      {selectedMode === 'live-session' && 'Self-Other Live (True Conflict Mode)'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Title:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {sessionConfig.title}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Description:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {sessionConfig.description || 'No description provided'}
                    </Typography>
                  </Grid>
                  
                  {selectedMode === 'projected-conflict' && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Conversation with:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body1">
                          {sessionConfig.otherPerson || 'Not specified'}
                        </Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Topics:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {sessionConfig.topics && sessionConfig.topics.length > 0 
                        ? sessionConfig.topics.join(', ') 
                        : 'No topics specified'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Duration:
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {sessionConfig.duration} minutes
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedMode === 'self-dialogue' && 
                  'You\'ll be talking to a pseudo-you, exploring your thoughts and feelings in a safe space.'}
                {selectedMode === 'projected-conflict' && 
                  'You\'ll be practicing a conversation with your imagined version of the other person.'}
                {selectedMode === 'live-session' && 
                  'You\'ll be having a real-time conversation with another person, with AI support.'}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 3 }}>
                Ready to begin your conversation?
              </Typography>
            </Box>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth="md">
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>
          
          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              variant="outlined"
              onClick={activeStep === 0 ? () => navigate('/dashboard') : handleBack}
              sx={{ mr: 1 }}
            >
              {activeStep === 0 ? 'Cancel' : 'Back'}
            </Button>
            
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreateSession}
                  disabled={!selectedMode || loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Creating...' : 'Start Session'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={activeStep === 0 && !selectedMode}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default SessionSetup;