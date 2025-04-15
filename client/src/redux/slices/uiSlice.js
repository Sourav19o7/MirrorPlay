import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  drawerOpen: false,
  insightsOpen: false,
  notification: {
    show: false,
    message: '',
    type: 'info'
  },
  theme: 'dark',
  isMobile: window.innerWidth < 768
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.drawerOpen = !state.drawerOpen;
    },
    setDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    toggleInsights: (state) => {
      state.insightsOpen = !state.insightsOpen;
    },
    setInsightsOpen: (state, action) => {
      state.insightsOpen = action.payload;
    },
    showNotification: (state, action) => {
      state.notification = {
        show: true,
        message: action.payload.message,
        type: action.payload.type || 'info'
      };
    },
    hideNotification: (state) => {
      state.notification.show = false;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    }
  }
});

export const {
  toggleDrawer,
  setDrawerOpen,
  toggleInsights,
  setInsightsOpen,
  showNotification,
  hideNotification,
  toggleTheme,
  setTheme,
  setIsMobile
} = uiSlice.actions;

export default uiSlice.reducer;