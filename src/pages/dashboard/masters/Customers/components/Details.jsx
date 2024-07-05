import { useState, useEffect } from 'react';
import Footer from 'src/components/layouts/AccentSidebarLayout/Footer';
import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useParams } from 'react-router-dom';
import { adminService } from 'src/api/services/admin';
import Profile from 'src/components/Profile';
import ProfileCover from 'src/components/Profile/ProfileCover';
import SecurityTab from 'src/components/Profile/SecurityTab';
import { useCheckPermission } from 'src/hooks/useCheckPermission';

const CustomerDetails = () => {
  const { checkPermission } = useCheckPermission();
  const [user, setUser] = useState(null);
  const userId = useParams().id
  const [currentTab, setCurrentTab] = useState('edit_profile');

  const tabs = [
    checkPermission('CUSTOMER:UPDATE') && { value: 'edit_profile', label: 'Edit Profile' },
    checkPermission('CUSTOMER:UPDATE')&& { value: 'security', label: 'Passwords/Security' }
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const getUser = async () => {
    if(!checkPermission('CUSTOMER:READ')) return true;
    try {
      const response = await adminService.getCustomerDetail(userId)
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
          {/* <Grid item xs={12} md={8}>
            <ProfileCover user={user} handleRefreshData={getUser} />
          </Grid> */}
          <Grid item xs={12}>
            <Profile isCustomer={true} user={user} handleRefreshData={getUser} />
          </Grid>
        </Grid>
      </Box>
      {/* <Footer /> */}
    </>
  );
}

export default CustomerDetails;

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
