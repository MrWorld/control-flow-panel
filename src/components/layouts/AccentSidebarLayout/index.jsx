import { Box, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';
import Scrollbar from '../../layouts/Scrollbar';
import { useState } from 'react';

const AccentSidebarLayout = () => {
  const theme = useTheme();
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)

  const toggleSideBar = () => {
    setIsSideBarOpen((isSideBarOpen) => !isSideBarOpen)
  }

  return (
    <>
      <Header toggleSideBar={toggleSideBar} isSideBarOpen={isSideBarOpen} />
      {isSideBarOpen && <Sidebar />}
      <Scrollbar>
        <Box dir={'rtl'}
          sx={{
            position: 'relative',
            zIndex: 5,
            flex: 1,
            display: 'flex',
            pt: `${theme.header.height}`,
            [theme.breakpoints.up('sm')]: {
              pl: `${isSideBarOpen ? theme.sidebar.width : 0}`
            },
            transition: 'padding-left 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          }}
        >
          <Box dir={'rtl'}
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <Box dir={'rtl'} flexGrow={1}>
              <Outlet />
            </Box>
          </Box>
        </Box>
      </Scrollbar>

    </>
  );
};

export default AccentSidebarLayout;
