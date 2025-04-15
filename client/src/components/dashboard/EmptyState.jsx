// client/src/components/dashboard/EmptyState.jsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const EmptyState = ({ title, description, buttonText, buttonPath }) => {
  const navigate = useNavigate();
  
  return (
    <Paper
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: '100%',
        minHeight: 300,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'primary.dark',
          mb: 3
        }}
      >
        <AddIcon sx={{ fontSize: 40 }} />
      </Box>
      
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
        {description}
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<AddIcon />}
        onClick={() => navigate(buttonPath)}
      >
        {buttonText}
      </Button>
    </Paper>
  );
};

export default EmptyState;