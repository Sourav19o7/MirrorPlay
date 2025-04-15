import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sessionService from '../../services/session';

export const getSessions = createAsyncThunk(
  'session/getSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await sessionService.getSessions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load sessions');
    }
  }
);

export const getSessionById = createAsyncThunk(
  'session/getSessionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sessionService.getSessionById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to load session');
    }
  }
);

export const createSession = createAsyncThunk(
  'session/createSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await sessionService.createSession(sessionData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create session');
    }
  }
);

export const updateSession = createAsyncThunk(
  'session/updateSession',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await sessionService.updateSession(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update session');
    }
  }
);

export const deleteSession = createAsyncThunk(
  'session/deleteSession',
  async (id, { rejectWithValue }) => {
    try {
      await sessionService.deleteSession(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete session');
    }
  }
);

export const generateSummary = createAsyncThunk(
  'session/generateSummary',
  async (id, { rejectWithValue }) => {
    try {
      const response = await sessionService.generateSummary(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to generate summary');
    }
  }
);

const initialState = {
  sessions: [],
  currentSession: null,
  summary: null,
  loading: false,
  error: null
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all sessions
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload.data;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get session by ID
      .addCase(getSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload.data;
      })
      .addCase(getSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create session
      .addCase(createSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions.unshift(action.payload.data);
        state.currentSession = action.payload.data;
      })
      .addCase(createSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update session
      .addCase(updateSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = state.sessions.map(session =>
          session._id === action.payload.data._id ? action.payload.data : session
        );
        if (state.currentSession && state.currentSession._id === action.payload.data._id) {
          state.currentSession = {
            ...state.currentSession,
            session: action.payload.data
          };
        }
      })
      .addCase(updateSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete session
      .addCase(deleteSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = state.sessions.filter(session => session._id !== action.payload);
        if (state.currentSession && state.currentSession.session._id === action.payload) {
          state.currentSession = null;
        }
      })
      .addCase(deleteSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generate summary
      .addCase(generateSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSessionError, clearCurrentSession } = sessionSlice.actions;

export default sessionSlice.reducer;