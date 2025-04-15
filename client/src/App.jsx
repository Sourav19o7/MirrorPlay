import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/lexend/300.css';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/500.css';
import '@fontsource/lexend/700.css';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SessionSetup from './pages/SessionSetup';
import SelfDialogue from './pages/SelfDialogue';
import ProjectedConflict from './pages/ProjectedConflict';
import LiveSession from './pages/LiveSession';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import SessionReview from './pages/SessionReview';

// Context
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';

// Create a dark theme with Lexend as the primary font
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8884FF',
    },
    secondary: {
      main: '#4ECDC4',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    error: {
      main: '#FF6B6B',
    },
    warning: {
      main: '#FFE66D',
    },
    success: {
      main: '#1A936F',
    },
  },
  typography: {
    fontFamily: 'Lexend, Arial, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SessionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/session-setup" element={<SessionSetup />} />
              <Route path="/self-dialogue" element={<SelfDialogue />} />
              <Route path="/projected-conflict" element={<ProjectedConflict />} />
              <Route path="/live-session/:id" element={<LiveSession />} />
              <Route path="/session-review/:id" element={<SessionReview />} />
            </Routes>
          </Router>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;