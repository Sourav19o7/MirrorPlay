import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AuthForm = ({ 
  type = 'login', 
  title, 
  submitText, 
  onSubmit, 
  loading, 
  error 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2,
        backgroundColor: 'background.default'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          {title}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit}>
          {type === 'register' && (
            <TextField
              label="Full Name"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
              inputProps={{
                minLength: 3,
                maxLength: 50
              }}
            />
          )}
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            autoComplete={type === 'login' ? 'username' : 'new-username'}
          />
          
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            autoComplete={type === 'login' ? 'current-password' : 'new-password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : submitText}
          </Button>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            {type === 'login' ? (
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" color="primary">
                  Sign up
                </Link>
              </Typography>
            ) : (
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" color="primary">
                  Sign in
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AuthForm;