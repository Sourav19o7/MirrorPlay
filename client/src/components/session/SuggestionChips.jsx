import React from 'react';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import PsychologyIcon from '@mui/icons-material/Psychology';

const SuggestionChips = ({ suggestions, onSelect }) => {
  
  const getIcon = (type) => {
    switch (type) {
      case 'reframe':
        return <ReplayIcon fontSize="small" />;
      case 'question':
        return <QuestionAnswerIcon fontSize="small" />;
      case 'reflection':
      default:
        return <PsychologyIcon fontSize="small" />;
    }
  };
  
  const getTooltipContent = (suggestion) => {
    if (suggestion.type === 'reframe' && suggestion.originalText) {
      return (
        <Box>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            Original: "{suggestion.originalText}"
          </Typography>
          <Typography variant="body2">
            Reframe: "{suggestion.content}"
          </Typography>
        </Box>
      );
    }
    
    return (
      <Typography variant="body2">
        {suggestion.content}
      </Typography>
    );
  };
  
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {suggestions.map((suggestion, index) => (
        <Tooltip 
          key={index} 
          title={getTooltipContent(suggestion)} 
          placement="top"
          arrow
        >
          <Chip
            icon={getIcon(suggestion.type)}
            label={suggestion.type === 'reframe' ? 'Try reframing' : suggestion.content}
            variant="outlined"
            color={
              suggestion.type === 'reframe' 
                ? 'primary' 
                : suggestion.type === 'question'
                ? 'secondary'
                : 'success'
            }
            onClick={() => onSelect(suggestion.content)}
            sx={{ maxWidth: 250, '& .MuiChip-label': { textOverflow: 'ellipsis' } }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default SuggestionChips;