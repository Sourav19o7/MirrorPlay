import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chat';
import aiService from '../../services/ai';

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ sessionId, content }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(sessionId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const getCoachingSuggestions = createAsyncThunk(
  'chat/getCoachingSuggestions',
  async ({ message, context, sessionMode }, { rejectWithValue }) => {
    try {
      const response = await aiService.getCoachingSuggestions(message, context, sessionMode);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get suggestions');
    }
  }
);

export const generateDialogueResponse = createAsyncThunk(
  'chat/generateDialogueResponse',
  async ({ sessionId, message, history, persona, mode }, { rejectWithValue }) => {
    try {
      const response = await aiService.generateDialogueResponse(
        mode,
        message,
        persona,
        history
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate response');
    }
  }
);

export const analyzeEmotions = createAsyncThunk(
  'chat/analyzeEmotions',
  async (message, { rejectWithValue }) => {
    try {
      const response = await aiService.analyzeEmotions(message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to analyze emotions');
    }
  }
);

const initialState = {
  messages: [],
  suggestions: [],
  emotions: {
    user: { primary: 'neutral', intensity: 5 },
    other: { primary: 'neutral', intensity: 5 }
  },
  isTyping: false,
  loading: false,
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    updateEmotions: (state, action) => {
      const { sender, emotion } = action.payload;
      state.emotions[sender] = emotion;
    },
    clearChatError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        
        // Add user message
        if (action.payload.userMessage) {
          state.messages.push(action.payload.userMessage);
        }
        
        // Add AI response if any
        if (action.payload.aiResponse) {
          state.messages.push(action.payload.aiResponse);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get coaching suggestions
      .addCase(getCoachingSuggestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCoachingSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload.data;
      })
      .addCase(getCoachingSuggestions.rejected, (state) => {
        state.loading = false;
        state.suggestions = [];
      })
      
      // Generate dialogue response
      .addCase(generateDialogueResponse.pending, (state) => {
        state.isTyping = true;
      })
      .addCase(generateDialogueResponse.fulfilled, (state, action) => {
        state.isTyping = false;
        // The AI response will be added to messages when received from the backend
      })
      .addCase(generateDialogueResponse.rejected, (state) => {
        state.isTyping = false;
      })
      
      // Analyze emotions
      .addCase(analyzeEmotions.fulfilled, (state, action) => {
        // Update emotions based on analysis
        const analysis = action.payload.data;
        if (analysis) {
          // In a real implementation, you'd determine if this is the user or other person
          // based on message metadata
          state.emotions.user = {
            primary: analysis.primaryEmotion,
            intensity: analysis.intensity
          };
        }
      });
  }
});

export const {
  setMessages,
  addMessage,
  clearMessages,
  setIsTyping,
  clearSuggestions,
  updateEmotions,
  clearChatError
} = chatSlice.actions;

export default chatSlice.reducer;