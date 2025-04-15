import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import { sendMessage, setIsTyping } from '../../redux/slices/chatSlice';
import MessageBubble from './MessageBubble';
import SuggestionChips from './SuggestionChips';

const ChatInterface = ({ sessionId, sessionMode, isPaused = false }) => {
  const dispatch = useDispatch();
  const { messages, isTyping, loading, suggestions } = useSelector(state => state.chat);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim() || isPaused) return;
    
    dispatch(sendMessage({
      sessionId,
      content: messageText
    }));
    
    setMessageText('');
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setMessageText(suggestion);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.7
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No messages yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Start the conversation by sending a message
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              message={message}
              isUser={!message.isAI}
            />
          ))
        )}
        
        {/* Typing indicator */}
        {isTyping && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              p: 2,
              m: 1,
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <div className="typing-indicator"></div>
            <div className="typing-indicator"></div>
            <div className="typing-indicator"></div>
          </Box>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </Box>
      
      {/* Suggestions area */}
      {suggestions.length > 0 && !isPaused && (
        <Box sx={{ p: 1, backgroundColor: 'background.default' }}>
          <SuggestionChips
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
          />
        </Box>
      )}
      
      {/* Pause notification */}
      {isPaused && (
        <Box
          sx={{
            p: 2,
            backgroundColor: 'warning.dark',
            textAlign: 'center'
          }}
        >
          <Typography>
            Session paused for reflection. Take a moment to consider your thoughts and feelings.
          </Typography>
        </Box>
      )}
      
      {/* Input area */}
      <Paper
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <IconButton size="small">
          <EmojiEmotionsIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type your message..."
          multiline
          maxRows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          disabled={isPaused || loading}
          sx={{ mx: 1 }}
        />
        <IconButton>
          <KeyboardVoiceIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!messageText.trim() || isPaused || loading}
        >
          {loading ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ChatInterface;