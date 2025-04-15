// client/src/App.jsx - modified to remove context references
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SessionSetup from './pages/SessionSetup';
import SelfDialogue from './pages/SelfDialogue';
import ProjectedConflict from './pages/ProjectedConflict';
import LiveSession from './pages/LiveSession';
import SessionReview from './pages/SessionReview';
import ProfileSetup from './pages/ProfileSetup';
import NotFound from './pages/NotFound';

const App = () => {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (!isInitialized) {
    return <div>Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      
      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/session-setup"
          element={
            <PrivateRoute>
              <SessionSetup />
            </PrivateRoute>
          }
        />
        <Route
          path="/self-dialogue/:id"
          element={
            <PrivateRoute>
              <SelfDialogue />
            </PrivateRoute>
          }
        />
        <Route
          path="/projected-conflict/:id"
          element={
            <PrivateRoute>
              <ProjectedConflict />
            </PrivateRoute>
          }
        />
        <Route
          path="/live-session/:id"
          element={
            <PrivateRoute>
              <LiveSession />
            </PrivateRoute>
          }
        />
        <Route
          path="/session-review/:id"
          element={
            <PrivateRoute>
              <SessionReview />
            </PrivateRoute>
          }
        />
      </Route>
      
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;