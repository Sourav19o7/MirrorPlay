import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  CardMedia
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: 12, 
          backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.95)), url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 3 }}>
                MirrorPlay: Talk. Reflect. Evolve.
              </Typography>
              <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                Turn difficult conversations into moments of growth and understanding with AI-enhanced dialogue tools.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  onClick={() => navigate('/register')}
                  sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: '400px',
                  width: '100%',
                  backgroundColor: 'background.paper',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: 8,
                }}
              >
                {/* Placeholder for app demo/screenshot */}
                <Box 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(45deg, #8884FF20, #4ECDC420)'
                  }}
                >
                  <Typography variant="h4" align="center">
                    Interactive App Demo
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Mode Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Three Powerful Modes
          </Typography>
          <Grid container spacing={4}>
            {/* Mode 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h4" component="h3" align="center" gutterBottom>
                    Self–Self Dialogue
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    Shadow Mode
                  </Typography>
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    Talk to a pseudo-you. Integrate inner conflict. Heal identity splits. Perfect for mental clarity, emotional processing, and self-improvement.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Mode 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <PeopleIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
                  </Box>
                  <Typography variant="h4" component="h3" align="center" gutterBottom>
                    Self–Other
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    Projected Conflict Mode
                  </Typography>
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    Talk to a person through their imagined version of you. A safe confrontation space for emotional rehearsal, empathy-building, and pre-fight cooling.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Mode 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <GroupsIcon sx={{ fontSize: 60, color: 'success.main' }} />
                  </Box>
                  <Typography variant="h4" component="h3" align="center" gutterBottom>
                    Self–Other Live
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    True Conflict Mode
                  </Typography>
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    Talk to the actual person — live. The platform listens, reflects back each side, and subtly enhances clarity, empathy, and real-time self-awareness.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Use Cases Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            Who Can Benefit
          </Typography>
          <Grid container spacing={4}>
            {/* Couples */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'primary.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">Couples</Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="body1">
                    "No more messy fights. Talk in clarity and strengthen your relationship with every conversation."
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Co-Founders */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'secondary.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">Co-Founders</Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="body1">
                    "Resolve conflict like world-class leaders do. Build stronger partnerships through enhanced communication."
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Friends & Family */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'warning.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">Friends & Family</Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="body1">
                    "Say what matters. Be understood. Transform challenging family dynamics into opportunities for growth."
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            {/* Therapists & Coaches */}
            <Grid item xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    backgroundColor: 'success.dark',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h5">Therapists</Typography>
                </CardMedia>
                <CardContent>
                  <Typography variant="body1">
                    "Let clients practice live in a safe, AI-buffered room. Enhance your practice with cutting-edge tools."
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 10, 
          backgroundColor: 'background.default',
          backgroundImage: 'linear-gradient(rgba(18, 18, 18, 0.9), rgba(18, 18, 18, 0.9)), url(/images/cta-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" align="center" gutterBottom>
            Ready to Transform Your Conversations?
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
            This is not just a product — it's a new relational protocol.
            You're not using tech. You're upgrading how humans relate.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Landing;