import React from 'react';
import { Box, Typography, Paper, Avatar, Chip } from '@mui/material';
import { format } from 'date-fns';

const MessageBubble = ({ message, isUser }) => {
  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch (error) {
      return '';
    }
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2,
        maxWidth: '100%'
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          width: 36,
          height: 36,
          mr: isUser ? 0 : 1,
          ml: isUser ? 1 : 0,
        }}
      >
        {isUser ? 'Y' : 'AI'}
      </Avatar>
      
      <Box sx={{ maxWidth: '75%' }}>
        <Paper
          elevation={0}
          className="chat-bubble"
          sx={{
            p: 2,
            backgroundColor: isUser ? 'primary.dark' : 'background.paper',
            borderTopRightRadius: isUser ? 0 : 12,
            borderTopLeftRadius: isUser ? 12 : 0,
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        </Paper>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            mt: 0.5,
            gap: 1,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {formatTime(message.timestamp)}
          </Typography>
          
          {message.emotions?.primary && message.emotions.primary !== 'neutral' && (
            <Chip
              label={message.emotions.primary}
              size="small"
              color={
                ['happy', 'empathetic'].includes(message.emotions.primary) 
                  ? 'success' 
                  : ['angry', 'frustrated', 'defensive'].includes(message.emotions.primary)
                  ? 'error'
                  : 'default'
              }
              sx={{ height: 20, fontSize: '0.6rem' }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageBubble;