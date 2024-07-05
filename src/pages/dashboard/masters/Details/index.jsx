import { useState, useEffect } from 'react';
import Footer from 'src/components/layouts/AccentSidebarLayout/Footer';
import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import Profile from 'src/components/Profile';
import ProfileCover from 'src/components/Profile/ProfileCover';
import SecurityTab from 'src/components/Profile/SecurityTab';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const UserDetails = () => {
  const { checkPermission } = useCheckPermission();
  const [user, setUser] = useState(null);
  const userId = useParams().id
  const [currentTab, setCurrentTab] = useState('edit_profile');

  const tabs = [
    checkPermission('ADMIN:UPDATE') && { value: 'edit_profile', label: 'Edit Profile' },
    checkPermission('ADMIN:UPDATE')&& { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const getUser = async () => {
    if(!checkPermission('ADMIN:READ')) return true;
    try {
      const response = await adminService.getUserDetail(userId)
      setUser(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  if (!user) {
    return null;
  }

  return (
    <>
      <Box dir={'rtl'}
        sx={{
          mt: 3
        }}
      >
        <Grid
          sx={{
            px: 4
          }}
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12} md={8}>
            <ProfileCover user={user} handleRefreshData={getUser} />
          </Grid>
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'edit_profile' && checkPermission('ADMIN:UPDATE') && <Profile user={user} handleRefreshData={getUser} />}
            {currentTab === 'security' && checkPermission('ADMIN:UPDATE') && <SecurityTab user={user} />}
          </Grid>
        </Grid>
      </Box>
      {/* <Footer /> */}
    </>
  );
}

export default UserDetails;

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;

      .MuiTabs-indicator {
        box-shadow: none;
      }
    }
`
);
