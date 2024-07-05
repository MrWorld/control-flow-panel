import React, { useState } from 'react';
import { Box, Tabs, Tab, Grid, styled } from '@mui/material';
import { useUser, useSetUser, useSetPermission } from "src/contexts/GlobalContext";
import Footer from 'src/components/layouts/AccentSidebarLayout/Footer';
import Profile from 'src/components/Profile'
import ProfileCover from 'src/components/Profile/ProfileCover';
import SecurityTab from 'src/components/Profile/SecurityTab';
import { authService } from 'src/api/services/auth'
import useToast from 'src/hooks/useToast'
import { errorMessage } from 'src/utils/errorTypeDetector'

const MyProfile = () => {
    const { toast } = useToast()
    const [currentTab, setCurrentTab] = useState('edit_profile');
    const user = useUser()
    const setUser = useSetUser();
    const setPermission = useSetPermission();

    const handleTabsChange = (_event, value) => {
        setCurrentTab(value);
    }

    const getMe = async () => {
        try {
            let res = await authService.getProfile()
            setPermission(res.data.data.menu.permissions)
            setUser(res.data.data.admin)
        } catch (error) {
            // ******* if user be deleted or any things happened not normal, api will respond me with 403 error
            // ******* handle logout user here on 403 error 
            toast(errorMessage(error), 'error')
            console.log(error)
        }
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
                        <ProfileCover user={{ ...user, ownProfile: true }} />
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
                        {currentTab === 'edit_profile' && <Profile user={{ ...user, ownProfile: true }} handleRefreshData={getMe} />}
                        {currentTab === 'security' && <SecurityTab user={{ ...user, ownProfile: true }} />}
                    </Grid>
                </Grid>
            </Box>
            <Footer />
        </>
    )
}

export default MyProfile

const tabs = [
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'security', label: 'Passwords/Security' }
];

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
