import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import SideNav from './SideNav';
import Notification from './Notification';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { drawerOpen, isMobile } = useSelector((state) => state.ui);
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <SideNav />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerOpen ? 240 : isMobile ? 0 : 72}px)` },
          ml: { sm: `${drawerOpen ? 240 : isMobile ? 0 : 72}px` },
          mt: '64px',
          transition: 'margin 0.2s ease'
        }}
      >
        <Outlet />
      </Box>
      
      <Notification />
    </Box>
  );
};

export default Layout;