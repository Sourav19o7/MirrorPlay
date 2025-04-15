import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import { setDrawerOpen } from '../../redux/slices/uiSlice';

const SideNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { drawerOpen, isMobile } = useSelector((state) => state.ui);
  
  const handleDrawerToggle = () => {
    if (isMobile) {
      dispatch(setDrawerOpen(false));
    }
  };
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: 'New Session',
      icon: <AddIcon />,
      path: '/session-setup'
    },
    {
      text: 'History',
      icon: <HistoryIcon />,
      path: '/dashboard?tab=history'
    }
  ];
  
  const sessionTypes = [
    {
      text: 'Self-Self Dialogue',
      icon: <PersonIcon />,
      color: 'primary.main',
      path: '/session-setup?mode=self-dialogue'
    },
    {
      text: 'Projected Conflict',
      icon: <PeopleIcon />,
      color: 'secondary.main',
      path: '/session-setup?mode=projected-conflict'
    },
    {
      text: 'Live Session',
      icon: <GroupsIcon />,
      color: 'success.main',
      path: '/session-setup?mode=live-session'
    }
  ];
  
  const drawerWidth = drawerOpen ? 240 : 72;
  
  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={drawerOpen}
      onClose={handleDrawerToggle}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          transition: 'width 0.2s ease',
          mt: '64px',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              selected={location.pathname === item.path}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5,
                '&.Mui-selected': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Tooltip title={drawerOpen ? '' : item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {drawerOpen && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
        
        <Divider />
        
        <List>
          {sessionTypes.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <Tooltip title={drawerOpen ? '' : item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: drawerOpen ? 3 : 'auto',
                    justifyContent: 'center',
                    color: item.color
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {drawerOpen && <ListItemText primary={item.text} sx={{ color: item.color }} />}
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;