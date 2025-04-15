import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideNotification } from '../../redux/slices/uiSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { show, message, type } = useSelector((state) => state.ui.notification);
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [show, dispatch]);
  
  const handleClose = () => {
    dispatch(hideNotification());
  };
  
  return (
    <Snackbar
      open={show}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={type} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;