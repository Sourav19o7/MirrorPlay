import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { sessions, currentSession, loading, error } = useSelector(state => state.session);

  // This context now just forwards Redux state to maintain compatibility
  const value = {
    sessions,
    currentSession,
    loading,
    error
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export const useSessions = () => useContext(SessionContext);