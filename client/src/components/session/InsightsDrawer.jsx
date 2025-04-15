import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Card,
  CardContent,
  Button,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import EmotionIcon from '@mui/icons-material/Face';
import PatternIcon from '@mui/icons-material/Timeline';
import GrowthIcon from '@mui/icons-material/TrendingUp';

const InsightsDrawer = ({ open, onClose, emotions, patterns, suggestions, onUseSuggestion }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 320,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 320,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" display="flex" alignItems="center">
          <InsightsIcon sx={{ mr: 1 }} /> Session Insights
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2, overflowY: 'auto' }}>
        {/* Emotions Section */}
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <EmotionIcon fontSize="small" sx={{ mr: 0.5 }} /> Emotional States
        </Typography>
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{ mb: 1, height: '100%' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="body2" align="center" gutterBottom>You</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
                  <Chip 
                    label={emotions.user.primary} 
                    color={
                      ['happy', 'empathetic'].includes(emotions.user.primary) 
                        ? 'success' 
                        : ['angry', 'frustrated', 'defensive'].includes(emotions.user.primary)
                        ? 'error'
                        : 'default'
                    } 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card variant="outlined" sx={{ mb: 1, height: '100%' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="body2" align="center" gutterBottom>Other</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 40 }}>
                  <Chip 
                    label={emotions.other.primary} 
                    color={
                      ['happy', 'empathetic'].includes(emotions.other.primary) 
                        ? 'success' 
                        : ['angry', 'frustrated', 'defensive'].includes(emotions.other.primary)
                        ? 'error'
                        : 'default'
                    } 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Patterns Section */}
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PatternIcon fontSize="small" sx={{ mr: 0.5 }} /> Communication Patterns
        </Typography>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {patterns.length > 0 ? (
              patterns.map((pattern, index) => (
                <Box key={index} sx={{ mb: index < patterns.length - 1 ? 1 : 0 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>{pattern.type}:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {pattern.description}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No patterns detected yet. Continue the conversation to gather more insights.
              </Typography>
            )}
          </CardContent>
        </Card>
        
        {/* Suggestions Section */}
        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <GrowthIcon fontSize="small" sx={{ mr: 0.5 }} /> Suggested Responses
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <Button 
                key={index}
                variant="outlined" 
                size="small" 
                onClick={() => onUseSuggestion(suggestion.content)}
                sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
              >
                {suggestion.content}
              </Button>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No suggestions available at the moment.
            </Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default InsightsDrawer;